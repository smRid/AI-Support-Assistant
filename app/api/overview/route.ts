import { NextResponse } from "next/server";
import { count, desc, eq, inArray } from "drizzle-orm";

import { db } from "@/db/client";
import {
  chatBotMetadata,
  conversation,
  knowledge_source,
  messages,
  sections,
} from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { getWorkspaceContext } from "@/lib/workspace";

function formatRelativeTime(timestamp: string | null) {
  if (!timestamp) {
    return "";
  }

  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }

  const diffHours = Math.floor(diffMins / 60);

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  return date.toLocaleDateString();
}

export async function GET() {
  try {
    const user = await isAuthorized();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workspace = await getWorkspaceContext(user);

    const bots = await db
      .select({
        id: chatBotMetadata.id,
      })
      .from(chatBotMetadata)
      .where(inArray(chatBotMetadata.user_email, workspace.memberEmails))
      .orderBy(desc(chatBotMetadata.created_at));

    const botIds = bots.map((bot) => bot.id);

    const groupedKnowledge = await db
      .select({
        type: knowledge_source.type,
        value: count(),
      })
      .from(knowledge_source)
      .where(inArray(knowledge_source.user_email, workspace.memberEmails))
      .groupBy(knowledge_source.type);

    const knowledgeStats = {
      website: 0,
      upload: 0,
      text: 0,
      total: 0,
    };

    for (const item of groupedKnowledge) {
      switch (item.type) {
        case "website":
          knowledgeStats.website += item.value;
          break;
        case "text":
          knowledgeStats.text += item.value;
          break;
        default:
          knowledgeStats.upload += item.value;
          break;
      }

      knowledgeStats.total += item.value;
    }

    const sectionRecords = await db
      .select()
      .from(sections)
      .where(inArray(sections.user_email, workspace.memberEmails))
      .orderBy(desc(sections.created_at));

    const sectionStats = {
      total: sectionRecords.length,
      list: sectionRecords.map((section) => ({
        name: section.name,
        sourceCount: Array.isArray(section.source_ids)
          ? section.source_ids.length
          : 0,
        tone: section.tone,
      })),
    };

    let recentChats: { title: string; snippet: string; time: string }[] = [];
    let totalConversations = 0;

    if (botIds.length > 0) {
      const [conversationCount] = await db
        .select({ value: count() })
        .from(conversation)
        .where(inArray(conversation.chatbot_id, botIds));

      totalConversations = conversationCount?.value ?? 0;

      const recentConversationRecords = await db
        .select()
        .from(conversation)
        .where(inArray(conversation.chatbot_id, botIds))
        .orderBy(desc(conversation.created_at))
        .limit(5);

      recentChats = await Promise.all(
        recentConversationRecords.map(async (conversationRecord) => {
          const [lastMessage] = await db
            .select()
            .from(messages)
            .where(eq(messages.conversation_id, conversationRecord.id))
            .orderBy(desc(messages.created_at))
            .limit(1);

          return {
            title: conversationRecord.name || "Visitor Chat",
            snippet: lastMessage?.content || "No interactions yet",
            time: formatRelativeTime(
              lastMessage?.created_at || conversationRecord.created_at
            ),
          };
        })
      );
    }

    return NextResponse.json({
      botId: botIds[0] ?? null,
      knowledge: knowledgeStats,
      sections: sectionStats,
      chats: recentChats,
      counts: {
        knowledge: knowledgeStats.total,
        sections: sectionStats.total,
        conversations: totalConversations,
      },
    });
  } catch (error) {
    console.error("Dashboard Overview Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
