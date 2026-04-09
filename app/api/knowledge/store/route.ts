import { db } from "@/db/client";
import { knowledge_source } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { summarizeMarkdown } from "@/lib/openRouter";
import { getWorkspaceContext } from "@/lib/workspace";
import { and, eq, inArray, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

async function ensureKnowledgeSourcesTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS knowledge_source (
      id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
      user_email text NOT NULL,
      type text NOT NULL,
      name text NOT NULL,
      status text NOT NULL DEFAULT 'active',
      source_url text,
      content text,
      meta_data text,
      last_updated text DEFAULT now()::text,
      created_at text DEFAULT now()::text
    )
  `);
}

function isValidUrl(value: string) {
  try {
    const parsed = new URL(value);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

async function summarizeMarkdownSafely(markdown: string) {
  try {
    return await summarizeMarkdown(markdown);
  } catch (error) {
    console.error("Knowledge summarization failed:", error);
    return "";
  }
}

function parseCsvMetadata(fileContent: string) {
  const lines = fileContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const headers =
    lines.length > 0
      ? lines[0].split(",").map((header) => header.trim())
      : [];

  return {
    headers,
    rowCount: Math.max(lines.length - 1, 0),
  };
}

function looksLikeHtml(content: string) {
  return /<\/?[a-z][\s\S]*>/i.test(content);
}

function decodeHtmlEntities(content: string) {
  return content
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code) => {
      const parsed = Number.parseInt(code, 10);
      return Number.isNaN(parsed) ? _ : String.fromCharCode(parsed);
    });
}

function stripHtmlToText(html: string) {
  const preferredMatch =
    html.match(/<main[^>]*>([\s\S]*?)<\/main>/i) ||
    html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);

  const source = preferredMatch?.[1] ?? html;

  return decodeHtmlEntities(
    source
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
      .replace(/<head[\s\S]*?<\/head>/gi, " ")
      .replace(/<(br|hr)\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|section|article|main|header|footer|aside|nav|li|ul|ol|h1|h2|h3|h4|h5|h6|tr)>/gi, "\n")
      .replace(/<li[^>]*>/gi, "- ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\r/g, "")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n[ \t]+/g, "\n")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

function stripMarkdownToText(markdown: string) {
  return markdown
    .replace(/\)\s*(?=\[)/g, ")\n")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/^-{3,}$/gm, " ")
    .replace(/\r/g, "")
    .trim();
}

function normalizeForDeduplication(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isBoilerplateSegment(segment: string) {
  const normalized = segment.trim();
  const lower = normalized.toLowerCase();

  if (!normalized) {
    return true;
  }

  const exactBoilerplate = new Set([
    "home",
    "courses",
    "about",
    "services",
    "gallery",
    "blog",
    "contact",
    "verify certificate",
    "apply now",
    "join our facebook",
    "address",
    "information",
    "metadata",
    "<!--the end-->",
  ]);

  if (exactBoilerplate.has(lower)) {
    return true;
  }

  const containsBoilerplate = [
    "admission going on for",
    "trusted since 2012",
    "bangladesh's #1 cyber security platfrom",
    "join our team",
    "our valued clients",
    "company statistics",
    "preview of your future",
    "impact in numbers",
    "total students",
    "years in service",
    "successful clients",
    "project completed",
    "copyright",
    "privacy policy",
    "terms",
    "bug bounty",
    "help center",
    "students",
    "faq",
  ];

  if (containsBoilerplate.some((pattern) => lower.includes(pattern))) {
    return true;
  }

  if (
    /(?:\+?\d[\d\s\-(),]{6,}\d)/.test(normalized) ||
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(normalized) ||
    /https?:\/\/\S+/i.test(normalized) ||
    /www\.\S+/i.test(normalized)
  ) {
    return true;
  }

  if (
    lower.includes("house no") ||
    lower.includes("dhaka") ||
    lower.includes("banasree") ||
    lower.includes("rampura")
  ) {
    return true;
  }

  return false;
}

function compactKnowledgeText(text: string) {
  const segments = text
    .split(/\n{2,}/)
    .map((segment) =>
      segment
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean)
        .join(" ")
        .replace(/\s{2,}/g, " ")
        .trim()
    )
    .filter(Boolean);

  const seen = new Set<string>();
  const filteredSegments: string[] = [];

  for (const segment of segments) {
    if (segment.length < 3) {
      continue;
    }

    if (
      /static\/images/i.test(segment) ||
      /gtm\.js/i.test(segment) ||
      /__fcc-html/i.test(segment)
    ) {
      continue;
    }

    if (isBoilerplateSegment(segment)) {
      continue;
    }

    const dedupeKey = normalizeForDeduplication(segment);

    if (!dedupeKey || seen.has(dedupeKey)) {
      continue;
    }

    seen.add(dedupeKey);
    filteredSegments.push(segment);
  }

  return filteredSegments.join("\n\n").trim();
}

function normalizeScrapedContent(content: string) {
  const normalized = looksLikeHtml(content)
    ? stripHtmlToText(content)
    : stripMarkdownToText(content);

  return compactKnowledgeText(normalized);
}

function hasUsefulScrapedContent(content: string) {
  const normalized = normalizeScrapedContent(content);

  if (normalized.length < 120) {
    return false;
  }

  const weakPatterns = [
    "enable javascript",
    "just a moment",
    "access denied",
    "verify you are human",
    "website source for",
  ];

  return !weakPatterns.some((pattern) =>
    normalized.toLowerCase().includes(pattern)
  );
}

function hasPoorPreviewArtifacts(content: string) {
  return (
    looksLikeHtml(content) ||
    /!\[[^\]]*\]\([^)]+\)/.test(content) ||
    /\[[^\]]+\]\((https?:\/\/|\/)/.test(content) ||
    /gtm\.js/i.test(content) ||
    /static\/images/i.test(content) ||
    /__fcc-html/i.test(content)
  );
}

async function buildWebsiteContent(scrapedContent: string) {
  const normalized = normalizeScrapedContent(scrapedContent);
  const summarized = await summarizeMarkdownSafely(normalized);

  if (summarized && !hasPoorPreviewArtifacts(summarized)) {
    return compactKnowledgeText(summarized);
  }

  return normalized;
}

async function fetchZenRowsContent(url: string) {
  const zenUrl = new URL("https://api.zenrows.com/v1/");
  zenUrl.searchParams.set("apikey", process.env.ZENROWS_API_KEY!);
  zenUrl.searchParams.set("url", url);
  zenUrl.searchParams.set("js_render", "true");
  zenUrl.searchParams.set("wait", "5000");
  zenUrl.searchParams.set("response_type", "markdown");

  const response = await fetch(zenUrl.toString(), {
    headers: {
      "User-Agent": "OneMinuteSupportBot/1.0",
    },
  });

  return {
    ok: response.ok,
    status: response.status,
    body: await response.text(),
  };
}

async function fetchZenRowsRenderedHtml(url: string) {
  const zenUrl = new URL("https://api.zenrows.com/v1/");
  zenUrl.searchParams.set("apikey", process.env.ZENROWS_API_KEY!);
  zenUrl.searchParams.set("url", url);
  zenUrl.searchParams.set("js_render", "true");
  zenUrl.searchParams.set("wait", "5000");

  const response = await fetch(zenUrl.toString(), {
    headers: {
      "User-Agent": "OneMinuteSupportBot/1.0",
    },
  });

  return {
    ok: response.ok,
    status: response.status,
    body: await response.text(),
  };
}

export async function POST(req: NextRequest) {
  try {
    const user = await isAuthorized();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workspace = await getWorkspaceContext(user);
    await ensureKnowledgeSourcesTable();

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const type = String(formData.get("type") || "");

      if (type !== "upload") {
        return NextResponse.json(
          { error: "Unsupported multipart request" },
          { status: 400 }
        );
      }

      const file = formData.get("file");

      if (!(file instanceof File)) {
        return NextResponse.json(
          { error: "No file provided" },
          { status: 400 }
        );
      }

      const fileContent = await file.text();
      const { headers, rowCount } = parseCsvMetadata(fileContent);
      const markdown = await summarizeMarkdownSafely(fileContent);
      const formattedContent = markdown || fileContent;

      const [createdSource] = await db
        .insert(knowledge_source)
        .values({
          user_email: workspace.ownerEmail,
          type: "upload",
          name: file.name,
          status: "active",
          source_url: null,
          content: formattedContent,
          meta_data: JSON.stringify({
            fileName: file.name,
            fileSize: file.size,
            rowCount,
            headers,
          }),
        })
        .returning();

      return NextResponse.json(
        {
          message: "CSV file uploaded successfully",
          source: createdSource,
        },
        { status: 200 }
      );
    }

    const body = await req.json();
    const type = body.type;

    if (type === "website") {
      if (!body.url || !isValidUrl(body.url)) {
        return NextResponse.json(
          { error: "Please enter a valid website URL." },
          { status: 400 }
        );
      }

      const [existingSource] = await db
        .select()
        .from(knowledge_source)
        .where(
          and(
            inArray(knowledge_source.user_email, workspace.memberEmails),
            eq(knowledge_source.type, "website"),
            eq(knowledge_source.source_url, body.url)
          )
        );

      if (existingSource) {
        return NextResponse.json(
          { error: "This website is already in your knowledge base." },
          { status: 409 }
        );
      }

      let content = `Website source for ${body.url}`;
      let metaData: string | null = null;

      if (process.env.ZENROWS_API_KEY) {
        try {
          const markdownResponse = await fetchZenRowsContent(body.url);

          if (
            markdownResponse.ok &&
            hasUsefulScrapedContent(markdownResponse.body)
          ) {
            content = await buildWebsiteContent(markdownResponse.body);
          } else {
            const renderedHtmlResponse = await fetchZenRowsRenderedHtml(body.url);

            if (
              renderedHtmlResponse.ok &&
              hasUsefulScrapedContent(renderedHtmlResponse.body)
            ) {
              content = await buildWebsiteContent(renderedHtmlResponse.body);
              metaData = JSON.stringify({
                fetchStatus: renderedHtmlResponse.status,
                fetchMode: "js_render_html_fallback",
              });
            } else {
              const failureStatus =
                renderedHtmlResponse.status || markdownResponse.status;
              const failureBody =
                renderedHtmlResponse.body || markdownResponse.body;

              content = `Website source for ${body.url}`;
              metaData = JSON.stringify({
                fetchStatus: failureStatus,
                fetchError: failureBody.slice(0, 500),
                fetchMode: "zenrows_failed",
              });
            }
          }

          if (!metaData && content !== `Website source for ${body.url}`) {
            metaData = JSON.stringify({
              fetchStatus: markdownResponse.status,
              fetchMode: "js_render_markdown",
            });
          }
        } catch (error) {
          console.error("ZenRows fetch failed:", error);
          metaData = JSON.stringify({
            fetchError: "ZenRows request failed",
            fetchMode: "zenrows_exception",
          });
        }
      }

      const [createdSource] = await db
        .insert(knowledge_source)
        .values({
          user_email: workspace.ownerEmail,
          type: "website",
          name: body.url,
          status: "active",
          source_url: body.url,
          content,
          meta_data: metaData,
        })
        .returning();

      return NextResponse.json(
        { message: "Source added successfully", source: createdSource },
        { status: 201 }
      );
    }

    if (type === "text") {
      if (!body.title?.trim() || !body.content?.trim()) {
        return NextResponse.json(
          { error: "Title and content are required." },
          { status: 400 }
        );
      }

      const content = body.content.trim();
      const [createdSource] = await db
        .insert(knowledge_source)
        .values({
          user_email: workspace.ownerEmail,
          type: "text",
          name: body.title.trim(),
          status: "active",
          source_url: null,
          content,
          meta_data: null,
        })
        .returning();

      return NextResponse.json(
        { message: "Source added successfully", source: createdSource },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { error: "Unsupported knowledge source type." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in knowledge store:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
