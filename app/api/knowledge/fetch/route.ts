import { db } from "@/db/client";
import { knowledgeSources } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

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

export async function GET() {
  try {
    const user = await isAuthorized();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureKnowledgeSourcesTable();

    const sources = await db
      .select()
      .from(knowledgeSources)
      .where(eq(knowledgeSources.user_email, user.email))
      .orderBy(desc(knowledgeSources.created_at));

    return NextResponse.json({ sources }, { status: 200 });
  } catch (error) {
    console.error("Knowledge fetch error:", error);

    return NextResponse.json(
      { error: "Internal Server Error", sources: [] },
      { status: 500 }
    );
  }
}
