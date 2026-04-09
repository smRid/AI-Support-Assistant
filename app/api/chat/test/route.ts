import { db } from "@/db/client";
import { knowledge_source } from "@/db/schema";
import { countConversationTokens } from "@/lib/countConversationTokens";
import { isAuthorized } from "@/lib/isAuthorized";
import { createChatCompletion, summarizeConversation } from "@/lib/openRouter";
import { getWorkspaceContext } from "@/lib/workspace";
import { and, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function POST(req: Request) {
  const user = await isAuthorized();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workspace = await getWorkspaceContext(user);
  const body = await req.json();
  const knowledge_source_ids = body.knowledge_source_ids;

  let messages: ChatMessage[] = Array.isArray(body.messages)
    ? body.messages
        .filter(
          (message: unknown): message is ChatMessage =>
            typeof message === "object" &&
            message !== null &&
            "role" in message &&
            "content" in message &&
            typeof message.role === "string" &&
            typeof message.content === "string"
        )
        .map((message: ChatMessage) => ({
          role:
            message.role === "assistant" || message.role === "system"
              ? message.role
              : "user",
          content: message.content,
        }))
    : [];

  if (messages.length === 0) {
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
            inArray(knowledge_source.user_email, workspace.memberEmails)
          )
        );

      context = sources
        .map((source) => source.content)
        .filter(Boolean)
        .join("\n\n");
    }
  }

  const tokenCount = countConversationTokens(messages);

  if (tokenCount > 6000) {
    const recentMessages = messages.slice(-10);
    const olderMessages = messages.slice(0, -10);

    if (olderMessages.length > 0) {
      const summary = await summarizeConversation(olderMessages);

      context = `PREVIOUS CONVERSATION SUMMARY:\n${summary}\n\n${context}`;

      messages = recentMessages;
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

  try {
    const reply = await createChatCompletion({
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.5,
      maxTokens: 200,
    });

    return NextResponse.json({ response: reply });
  } catch (error) {
    console.error("Error in chat test:", error);

    const status =
      typeof (error as { status?: number })?.status === "number"
        ? (error as { status: number }).status
        : 500;
    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate response";

    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}
