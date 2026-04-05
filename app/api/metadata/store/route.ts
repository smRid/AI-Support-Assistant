import { db } from "@/db/client";
import { metadata } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { getWorkspaceContext } from "@/lib/workspace";
import { asc, eq, inArray } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
  const user = await isAuthorized();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { business_name, website_url, external_links } = await req.json();
  const workspace = await getWorkspaceContext(user);

  if (!business_name || !website_url) {
  return NextResponse.json(
    { error: "Missing business name or website URL" },
    { status: 400 }
  );
}

const [existingMetadata] = await db
  .select({ id: metadata.id })
  .from(metadata)
  .where(inArray(metadata.user_email, workspace.memberEmails))
  .orderBy(asc(metadata.created_at))
  .limit(1);

let metadataResponse;

if (existingMetadata) {
  [metadataResponse] = await db
    .update(metadata)
    .set({
      business_name,
      website_url,
      external_links,
    })
    .where(eq(metadata.id, existingMetadata.id))
    .returning();
} else {
  [metadataResponse] = await db
    .insert(metadata)
    .values({
      user_email: workspace.ownerEmail,
      business_name,
      website_url,
      external_links,
    })
    .returning();
}

(await cookies()).set(
  "metadata",
  JSON.stringify({
    business_name,
    organization_id: workspace.organizationId,
  }),
);

return NextResponse.json({ metadataResponse }, { status: 201 });

}
