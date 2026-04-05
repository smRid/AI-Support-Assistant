import { db } from "@/db/client";
import { chatBotMetadata } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { getWorkspaceContext } from "@/lib/workspace";
import { asc, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await isAuthorized();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workspace = await getWorkspaceContext(user);
    const [existingMetadata] = await db
      .select()
      .from(chatBotMetadata)
      .where(inArray(chatBotMetadata.user_email, workspace.memberEmails))
      .orderBy(asc(chatBotMetadata.created_at))
      .limit(1);


    if (!existingMetadata) {
      const [newMetadata] = await db.insert(chatBotMetadata).values({
        user_email: workspace.ownerEmail,
      }).returning();
    return NextResponse.json( newMetadata,{status:200 });
    }
    return NextResponse.json( existingMetadata,{status:200 });
  } catch (error) {
    return NextResponse.json(
        { error: "Internal server error",
        }, { status: 500 });
  }
}
