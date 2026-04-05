import "server-only";

import { asc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { user as usersTable } from "@/db/schema";
import type { AuthorizedUser } from "@/lib/isAuthorized";

const PERSONAL_ORGANIZATION_ID = "personal";

export type WorkspaceContext = {
  organizationId: string;
  isPersonalWorkspace: boolean;
  ownerEmail: string;
  memberEmails: string[];
};

function dedupeEmails(emails: string[]) {
  const deduped: string[] = [];
  const seen = new Set<string>();

  for (const email of emails) {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      continue;
    }

    const normalizedEmail = trimmedEmail.toLowerCase();

    if (seen.has(normalizedEmail)) {
      continue;
    }

    seen.add(normalizedEmail);
    deduped.push(trimmedEmail);
  }

  return deduped;
}

export async function getWorkspaceContext(
  user: AuthorizedUser,
): Promise<WorkspaceContext> {
  const currentEmail = user.email.trim();
  const organizationId = user.organization_id;

  if (!organizationId || organizationId === PERSONAL_ORGANIZATION_ID) {
    return {
      organizationId: organizationId || PERSONAL_ORGANIZATION_ID,
      isPersonalWorkspace: true,
      ownerEmail: currentEmail,
      memberEmails: [currentEmail],
    };
  }

  const organizationUsers = await db
    .select({
      email: usersTable.email,
    })
    .from(usersTable)
    .where(eq(usersTable.organization_id, organizationId))
    .orderBy(asc(usersTable.created_at), asc(usersTable.email));

  const memberEmails = dedupeEmails([
    ...organizationUsers.map((organizationUser) => organizationUser.email),
    currentEmail,
  ]);

  const ownerEmail = memberEmails[0] ?? currentEmail;

  return {
    organizationId,
    isPersonalWorkspace: false,
    ownerEmail,
    memberEmails: memberEmails.length > 0 ? memberEmails : [currentEmail],
  };
}
