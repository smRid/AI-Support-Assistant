import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

function getClerkErrorMessage(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "errors" in error &&
    Array.isArray((error as { errors?: unknown[] }).errors)
  ) {
    const [firstError] = (error as { errors: Array<{ longMessage?: string; message?: string }> }).errors;

    if (typeof firstError?.longMessage === "string") {
      return firstError.longMessage;
    }

    if (typeof firstError?.message === "string") {
      return firstError.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Failed to send invitation.";
}

export async function POST(req: Request) {
  const { userId, orgId, has } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!orgId) {
    return NextResponse.json(
      { error: "Select an organization before inviting members." },
      { status: 400 },
    );
  }

  if (!has({ role: "org:admin" })) {
    return NextResponse.json(
      { error: "Only organization admins can invite members." },
      { status: 403 },
    );
  }

  try {
    const body = (await req.json()) as {
      email?: string;
      name?: string;
    };

    const email = body.email?.trim().toLowerCase();
    const name = body.name?.trim();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 },
      );
    }

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

    const memberExists = membershipsResponse.data.some(
      (membership) =>
        membership.publicUserData?.identifier?.toLowerCase() === email,
    );

    if (memberExists) {
      return NextResponse.json(
        { error: "This user is already a member of your organization." },
        { status: 409 },
      );
    }

    const invitationExists = invitationsResponse.data.some(
      (invitation) =>
        invitation.emailAddress.toLowerCase() === email &&
        invitation.status !== "revoked",
    );

    if (invitationExists) {
      return NextResponse.json(
        { error: "An active invitation has already been sent to this email." },
        { status: 409 },
      );
    }

    const invitation = await client.organizations.createOrganizationInvitation({
      organizationId: orgId,
      inviterUserId: userId,
      emailAddress: email,
      role: "org:member",
      publicMetadata: name ? { name } : undefined,
    });

    return NextResponse.json({
      invitation: {
        id: invitation.id,
        emailAddress: invitation.emailAddress,
        role: invitation.role,
        status: invitation.status ?? "pending",
      },
    });
  } catch (error) {
    const status =
      error &&
      typeof error === "object" &&
      "status" in error &&
      typeof (error as { status?: unknown }).status === "number"
        ? (error as { status: number }).status
        : 500;

    return NextResponse.json(
      { error: getClerkErrorMessage(error) },
      { status },
    );
  }
}
