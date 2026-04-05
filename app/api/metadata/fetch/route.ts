import { db } from "@/db/client";
import { metadata } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { getWorkspaceContext } from "@/lib/workspace";
import { asc, inArray } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user = await isAuthorized();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workspace = await getWorkspaceContext(user);
    const cookieStore = await cookies();
    const metadataCookie = cookieStore.get("metadata");

    if (metadataCookie?.value) {
      try {
        const parsedCookie = JSON.parse(metadataCookie.value) as {
          business_name?: string;
          organization_id?: string;
        };

        if (
          typeof parsedCookie.business_name === "string" &&
          parsedCookie.organization_id === workspace.organizationId
        ) {
        return NextResponse.json(
          {
            exists: true,
            source: "cookie",
              data: parsedCookie,
          },
          { status: 200 }
        );
        }
      } catch (error) {
        console.error("Metadata cookie parse error:", error);
      }
    }

    const [record] = await db
      .select()
      .from(metadata)
      .where(inArray(metadata.user_email, workspace.memberEmails))
      .orderBy(asc(metadata.created_at))
      .limit(1);

    if (record) {
      const response = NextResponse.json(
        {
          exists: true,
          source: "database",
          data: record,
        },
        { status: 200 }
      );

      response.cookies.set(
        "metadata",
        JSON.stringify({
          business_name: record.business_name,
          organization_id: workspace.organizationId,
        }),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 30,
          path: "/",
        }
      );

      return response;
    }

    return NextResponse.json({ exists: false, data: null }, { status: 200 });
  } catch (error) {
    console.error("Metadata fetch error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
