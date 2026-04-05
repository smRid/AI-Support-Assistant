import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { inArray } from "drizzle-orm";

import { db } from "@/db/client";
import {
  chatBotMetadata,
  knowledgeSources,
  metadata,
  sections,
} from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { getWorkspaceContext } from "@/lib/workspace";

export async function DELETE() {
  const user = await isAuthorized();
  const { userId, orgId, has } = await auth();

  if (!user || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workspace = await getWorkspaceContext(user);

  if (!workspace.isPersonalWorkspace) {
    if (!orgId || orgId !== workspace.organizationId) {
      return NextResponse.json(
        { error: "Select the active organization before deleting it." },
        { status: 400 },
      );
    }

    if (!has({ role: "org:admin" })) {
      return NextResponse.json(
        { error: "Only organization admins can delete workspace data." },
        { status: 403 },
      );
    }
  }

  try {
    await Promise.all([
      db.delete(metadata).where(inArray(metadata.user_email, workspace.memberEmails)),
      db
        .delete(knowledgeSources)
        .where(inArray(knowledgeSources.user_email, workspace.memberEmails)),
      db.delete(sections).where(inArray(sections.user_email, workspace.memberEmails)),
      db
        .delete(chatBotMetadata)
        .where(inArray(chatBotMetadata.user_email, workspace.memberEmails)),
    ]);

    const cookieStore = await cookies();
    cookieStore.delete("metadata");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete workspace data:", error);

    return NextResponse.json(
      { error: "Failed to delete workspace data." },
      { status: 500 },
    );
  }
}
