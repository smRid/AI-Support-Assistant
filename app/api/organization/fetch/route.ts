import { db } from "@/db/client";
import { metadata } from "@/db/schema";
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
    const [metadataRecord] = await db
    .select()
    .from(metadata)
    .where(inArray(metadata.user_email, workspace.memberEmails))
    .orderBy(asc(metadata.created_at))
    .limit(1);

    const organization = {
    ...(metadataRecord || {}),
    id: user.organization_id,
    };

    return NextResponse.json({ organization });
} catch (error) {
    return new Response("Internal Server Error", {status: 500 });
}
}
