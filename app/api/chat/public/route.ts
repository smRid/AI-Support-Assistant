import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/db/client";
import { conversation, knowledgeSources } from "@/db/schema";
import { messages as messagesTable } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { countConversationTokens } from "@/lib/countConversationTokens";
import { createChatCompletion, summarizeConversation } from "@/lib/openRouter";

type PublicChatIncomingMessage = {
  role: string;
  content: string;
};

type PublicChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type PublicChatRequestBody = {
  messages?: PublicChatIncomingMessage[];
  knowledge_source_ids?: string[];
};

export async function POST(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { error: "Missing session token" },
      { status: 401 }
    );
  }

  let sessionId: string | undefined;
  let widgetId: string | undefined;
  let ownerEmail: string | undefined;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    sessionId = payload.sessionId as string;
    widgetId = payload.widgetId as string;
    ownerEmail = payload.ownerEmail as string;

    if (!sessionId || !widgetId || !ownerEmail) {
      throw new Error("Invalid token payload");
    }
  } catch (error) {
    console.error("Token Verification Failed:", error);
    return NextResponse.json(
      { error: "Invalid or expired session token" },
      { status: 401 }
    );
  }

  try {
    const body = (await req.json()) as PublicChatRequestBody;
    const { messages: rawMessages, knowledge_source_ids = [] } = body;

    if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    let messages: PublicChatMessage[] = rawMessages
      .filter(
        (message): message is PublicChatIncomingMessage =>
          typeof message === "object" &&
          message !== null &&
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

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1];

    if (!lastMessage || lastMessage.role !== "user") {
      return NextResponse.json(
        { error: "The latest message must be from the user" },
        { status: 400 }
      );
    }

    try {
      const [existingConv] = await db
        .select()
        .from(conversation)
        .where(
          and(
            eq(conversation.id, sessionId),
            eq(conversation.chatbot_id, widgetId)
          )
        )
        .limit(1);

      if (!existingConv) {
        const forwardedFor = req.headers.get("x-forwarded-for");
        const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "Unknown IP";
        const visitorName = `#Visitor(${ip})`;

        await db.insert(conversation).values({
          id: sessionId,
          chatbot_id: widgetId,
          user_email: ownerEmail,
          visitor_ip: ip,
          name: visitorName,
        });

        const previousMessages = messages.slice(0, -1);
        if (previousMessages.length > 0) {
          for (const msg of previousMessages) {
            await db.insert(messagesTable).values({
              conversation_id: sessionId,
              role: msg.role as "user" | "assistant" | "system",
              content: msg.content,
            });
          }
        }
      }

      await db.insert(messagesTable).values({
        conversation_id: sessionId,
        role: "user",
        content: lastMessage.content,
      });
    } catch (error) {
      console.error("Database Persistence Error (User):", error);
    }

    let context = "";
    if (
      Array.isArray(knowledge_source_ids) &&
      knowledge_source_ids.length > 0
    ) {
      try {
        const sourceIds = knowledge_source_ids.filter(
          (sourceId: unknown): sourceId is string => typeof sourceId === "string"
        );

        if (sourceIds.length > 0) {
          const sources = await db
            .select({
              content: knowledgeSources.content,
            })
            .from(knowledgeSources)
            .where(
              and(
                inArray(knowledgeSources.id, sourceIds),
                eq(knowledgeSources.user_email, ownerEmail)
              )
            );

          context = sources
            .map((source) => source.content)
            .filter(Boolean)
            .join("\n\n");
        }
      } catch (err) {
        console.error("RAG Retrieval Error:", err);
      }
    }

    const tokenCount = countConversationTokens(messages);
    if (tokenCount > 6000) {
      const recentMessages = messages.slice(-10);
      const olderMessages = messages.slice(0, -10);

      if (olderMessages.length > 0) {
        const summary = await summarizeConversation(olderMessages);
        context = `PREVIOUS CONVERSATION SUMMARY:\n${summary}\n\n` + context;
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

    const reply = await createChatCompletion({
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.5,
      maxTokens: 200,
    });

    try {
      await db.insert(messagesTable).values({
        conversation_id: sessionId,
        role: "assistant",
        content: reply,
      });
    } catch (error) {
      console.error("Database Persistence Error (AI):", error);
    }

    return NextResponse.json({ response: reply });
  } catch (error) {
    console.error("OpenRouter Error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
