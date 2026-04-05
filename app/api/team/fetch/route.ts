import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId, orgId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!orgId) {
    return NextResponse.json(
      { error: "No active organization found." },
      { status: 400 },
    );
  }

  try {
    const client = await clerkClient();
    const [membershipsResponse, invitationsResponse] = await Promise.all([
      client.organizations.getOrganizationMembershipList({
        organizationId: orgId,
        limit: 100,
      }),
      client.organizations.getOrganizationInvitationList({
        organizationId: orgId,
        limit: 100,
      }),
    ]);

    const team = new Map<
      string,
      {
        id: string;
        name: string;
        user_email: string;
        image?: string;
        role: string;
        status: string;
        created_at: string;
      }
    >();

    for (const membership of membershipsResponse.data) {
      const email = membership.publicUserData?.identifier ?? "";
      const metadataName =
        typeof membership.publicMetadata?.name === "string"
          ? membership.publicMetadata.name
          : "";
      const fullName = [
        membership.publicUserData?.firstName,
        membership.publicUserData?.lastName,
      ]
        .filter(Boolean)
        .join(" ")
        .trim();

      if (!email) {
        continue;
      }

      team.set(email.toLowerCase(), {
        id: membership.id,
        name: fullName || metadataName || email.split("@")[0],
        user_email: email,
        image: membership.publicUserData?.imageUrl,
        role: membership.role,
        status: "active",
        created_at: new Date(membership.createdAt).toISOString(),
      });
    }

    for (const invitation of invitationsResponse.data) {
      const email = invitation.emailAddress;

      if (!email || team.has(email.toLowerCase())) {
        continue;
      }

      const metadataName =
        typeof invitation.publicMetadata?.name === "string"
          ? invitation.publicMetadata.name
          : "";

      team.set(email.toLowerCase(), {
        id: invitation.id,
        name: metadataName || email.split("@")[0],
        user_email: email,
        role: invitation.role,
        status: invitation.status ?? "pending",
        created_at: new Date(invitation.createdAt).toISOString(),
      });
    }

    return NextResponse.json({ team: Array.from(team.values()) });
  } catch (error) {
    console.error("Failed to fetch team members", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
