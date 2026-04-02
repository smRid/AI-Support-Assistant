import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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

export async function GET(request: Request) {
  const { isAuthenticated, redirectToSignIn } = await auth();
  const requestUrl = new URL(request.url);

  if (!isAuthenticated) {
    return redirectToSignIn({
      returnBackUrl: requestUrl.toString(),
    });
  }

  const redirectTarget = getSafeRedirectTarget(
    requestUrl.searchParams.get("redirect_url") ?? requestUrl.searchParams.get("redirectUrl"),
    requestUrl,
  );

  return NextResponse.redirect(redirectTarget);
}
