import type { User as ClerkUser } from "@clerk/backend";
import { eq } from "drizzle-orm";
import { db } from "./client";
import { user as usersTable } from "./schema";

const personalOrganizationId = "personal";

function getUserEmail(clerkUser: ClerkUser) {
  return (
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress ??
    null
  );
}

function getUserName(clerkUser: ClerkUser) {
  const fullName =
    clerkUser.fullName?.trim() ??
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim();

  if (fullName) {
    return fullName;
  }

  return clerkUser.username ?? "anonymous";
}

export type UserSessionPayload = {
  email: string;
  organization_id: string;
};

export async function syncClerkUser(
  clerkUser: ClerkUser,
  organizationId?: string | null,
): Promise<UserSessionPayload> {
  const email = getUserEmail(clerkUser);

  if (!email) {
    throw new Error("Authenticated Clerk user does not have an email address.");
  }

  const resolvedOrganizationId = organizationId ?? personalOrganizationId;
  const name = getUserName(clerkUser);
  const image = clerkUser.imageUrl || null;

  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (existingUser.length === 0) {
    await db.insert(usersTable).values({
      name,
      email,
      organization_id: resolvedOrganizationId,
      image,
    });
  } else {
    await db
      .update(usersTable)
      .set({
        name,
        organization_id: resolvedOrganizationId,
        image,
      })
      .where(eq(usersTable.email, email));
  }

  return {
    email,
    organization_id: resolvedOrganizationId,
  };
}
