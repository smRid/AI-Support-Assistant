import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { syncClerkUser } from "@/db/users";

const defaultSignedInRedirect = "/";

function getSafeRedirectTarget(rawTarget: string | null, requestUrl: URL): URL {
  if (!rawTarget) {
    return new URL(defaultSignedInRedirect, requestUrl);
  }

  if (rawTarget.startsWith("/") && !rawTarget.startsWith("//")) {
    return new URL(rawTarget, requestUrl);
  }

  try {
    const parsedTarget = new URL(rawTarget);

    if (parsedTarget.origin === requestUrl.origin) {
      return new URL(`${parsedTarget.pathname}${parsedTarget.search}${parsedTarget.hash}`, requestUrl);
    }
  } catch {
    return new URL(defaultSignedInRedirect, requestUrl);
  }

  return new URL(defaultSignedInRedirect, requestUrl);
}

export async function GET(request: NextRequest) {
  const { isAuthenticated, orgId, redirectToSignIn } = await auth();
  const requestUrl = request.nextUrl;

  if (!isAuthenticated) {
    return redirectToSignIn({
      returnBackUrl: requestUrl.toString(),
    });
  }

  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json(
        { error: "Failed to load authenticated user." },
        { status: 500 },
      );
    }

    const redirectTarget = getSafeRedirectTarget(
      requestUrl.searchParams.get("redirect_url") ?? requestUrl.searchParams.get("redirectUrl"),
      requestUrl,
    );

    const userSession = await syncClerkUser(clerkUser, orgId);
    const response = NextResponse.redirect(redirectTarget);

    response.cookies.set("user_session", JSON.stringify(userSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Error syncing authenticated user:", error);

    return NextResponse.json(
      { error: "Failed to authenticate user" },
      { status: 500 },
    );
  }
}
