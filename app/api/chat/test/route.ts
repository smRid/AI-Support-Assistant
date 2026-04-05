import { isAuthorized } from "@/lib/isAuthorized";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await isAuthorized();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { messages, knowledge_source_ids } = await req.json();

  let context = ""

  if (knowledge_source_ids && knowledge_source_ids.length > 0) {
  const sources = await db
    .select({
      content: knowledge_source.content,
    })
    .from(knowledge_source)
    .where(inArray(knowledge_source.id, knowledge_source_ids));

    context = sources
      .map((s) => s.content)
      .filter(Boolean)
      .join("\n\n");
    }

    const tokenCount = countConversationTokens(messages);

}