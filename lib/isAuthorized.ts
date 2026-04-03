import "server-only";

import { cookies } from "next/headers";

export type AuthorizedUser = {
  email: string;
  organization_id: string;
};

function isAuthorizedUser(value: unknown): value is AuthorizedUser {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.email === "string" &&
    typeof candidate.organization_id === "string"
  );
}

export const isAuthorized = async (): Promise<AuthorizedUser | null> => {
  const cookieStore = await cookies();
  const userSession = cookieStore.get("user_session");
  let user: AuthorizedUser | null = null;

  if (userSession) {
    try {
      const parsedUser = JSON.parse(userSession.value) as unknown;

      if (isAuthorizedUser(parsedUser)) {
        user = parsedUser;
      }
    } catch (error) {
      console.error("Failed to parse user session", error);
    }
  }

  return user;
};
