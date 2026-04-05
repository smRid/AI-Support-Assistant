import { db } from "@/db/client";
import { sections } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { getWorkspaceContext } from "@/lib/workspace";
import { and, eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const user = await isAuthorized();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workspace = await getWorkspaceContext(user);
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Section ID is required" },
        { status: 400 }
      );
    }

    const existingSection = await db
      .select()
      .from(sections)
      .where(
        and(
          eq(sections.id, id),
          inArray(sections.user_email, workspace.memberEmails),
        ),
      );

    if (existingSection.length === 0) {
      return NextResponse.json(
        { error: "You can't delete this section!" },
        { status: 404 }
      );
    }

    const response = await db
      .delete(sections)
      .where(
        and(
          eq(sections.id, id),
          inArray(sections.user_email, workspace.memberEmails),
        ),
      );

    return NextResponse.json(
      {
        message: "Section deleted successfully",
        success: true,
        response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting section:", error);
    return NextResponse.json(
      { error: "Failed to delete section" },
      { status: 500 }
    );
  }
}
