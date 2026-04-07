import { db } from "@/db/client";
import { knowledge_source } from "@/db/schema";
import { countConversationTokens } from "@/lib/countConversationTokens";
import { openai, summarizeConversation } from "@/lib/openAI";
import { and, eq, inArray } from "drizzle-orm";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function POST(req: Request) {
  try {
    const { token, messages, knowledge_source_ids } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

    let ownerEmail = "";

    try {
      const { payload } = await jwtVerify(token, secret);
      ownerEmail = String(payload.ownerEmail ?? "");
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (!ownerEmail) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const normalizedMessages: ChatMessage[] = messages
      .filter(
        (message: unknown): message is ChatMessage =>
          typeof message === "object" &&
          message !== null &&
          "role" in message &&
          "content" in message &&
          typeof message.role === "string" &&
          typeof message.content === "string"
      )
      .map((message) => ({
        role:
          message.role === "assistant" || message.role === "system"
            ? message.role
            : "user",
        content: message.content,
      }));

    if (normalizedMessages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    let context = "";

    if (Array.isArray(knowledge_source_ids) && knowledge_source_ids.length > 0) {
      const sourceIds = knowledge_source_ids.filter(
        (sourceId: unknown): sourceId is string => typeof sourceId === "string"
      );

      if (sourceIds.length > 0) {
        const sources = await db
          .select({
            content: knowledge_source.content,
          })
          .from(knowledge_source)
          .where(
            and(
              inArray(knowledge_source.id, sourceIds),
              eq(knowledge_source.user_email, ownerEmail)
            )
          );

        context = sources
          .map((source) => source.content)
          .filter(Boolean)
          .join("\n\n");
      }
    }

    let requestMessages = normalizedMessages;
    const tokenCount = countConversationTokens(requestMessages);

    if (tokenCount > 6000) {
      const recentMessages = requestMessages.slice(-10);
      const olderMessages = requestMessages.slice(0, -10);

      if (olderMessages.length > 0) {
        const summary = await summarizeConversation(olderMessages);
        context = `PREVIOUS CONVERSATION SUMMARY:\n${summary}\n\n${context}`;
        requestMessages = recentMessages;
      }
    }

    const systemPrompt = `You are Sarah, a friendly human-like customer support specialist.

Rules:
- If asked your name, say: "I'm Sarah."
- If asked your role, say: "I'm a customer support specialist."
- Keep replies very short: 1-2 sentences max.
- Be conversational, natural, and clear.
- If the question is broad, ask one narrow follow-up instead of giving a long summary.
- Do not dump information.
- Guide the user step by step.
- Match the user's tone and brevity.

Escalation:
- If the answer is not in the context, or the user seems dissatisfied, offer to create a support ticket.
- If the user says yes or gives permission, reply exactly: "TICKET_CREATION_APPROVED"

Context:
${context}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, ...requestMessages],
      temperature: 0.7,
      max_tokens: 200,
    });

    const reply =
      completion.choices[0].message.content ||
      "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({ response: reply });
  } catch (error) {
    console.error("Widget chat error:", error);

    const status =
      typeof (error as { status?: number })?.status === "number"
        ? (error as { status: number }).status
        : 500;
    const message =
      error instanceof Error ? error.message : "Failed to generate response";

    return NextResponse.json({ error: message }, { status });
  }
}
