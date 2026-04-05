import { db } from "@/db/client";
import { sections } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { getWorkspaceContext } from "@/lib/workspace";
import { inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await isAuthorized();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workspace = await getWorkspaceContext(user);
    const response = await db
      .select()
      .from(sections)
      .where(inArray(sections.user_email, workspace.memberEmails));

    return NextResponse.json(response, {status: 200}) 

  } catch (error) {
    console.error("Error fetching sections:", error);
    return NextResponse.json(
        { error: "Failed to fetch sections" }, 
        { status: 500 }
    );
  }
}
