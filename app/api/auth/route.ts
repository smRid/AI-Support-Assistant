import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { clerkAuthCallbackPath } from "@/lib/clerk";

const defaultSignedInRedirect = "/";

function getSafeRedirectTarget(rawTarget: string | null): string {
  if (!rawTarget) {
    return defaultSignedInRedirect;
  }

  if (rawTarget.startsWith("/") && !rawTarget.startsWith("//")) {
    return rawTarget;
  }

  return defaultSignedInRedirect;
}

export async function GET(request: Request) {
  const { isAuthenticated, redirectToSignIn, redirectToSignUp } = await auth();
  const requestUrl = new URL(request.url);
  const intent = requestUrl.searchParams.get("intent") === "sign-in" ? "sign-in" : "sign-up";
  const redirectTarget = getSafeRedirectTarget(
    requestUrl.searchParams.get("redirect_url") ?? requestUrl.searchParams.get("redirectUrl"),
  );
  const callbackUrl = new URL(clerkAuthCallbackPath, requestUrl);

  if (redirectTarget !== defaultSignedInRedirect) {
    callbackUrl.searchParams.set("redirect_url", redirectTarget);
  }

  if (isAuthenticated) {
    return NextResponse.redirect(callbackUrl);
  }

  if (intent === "sign-in") {
    return redirectToSignIn({
      returnBackUrl: callbackUrl.toString(),
    });
  }

  return redirectToSignUp({
    returnBackUrl: callbackUrl.toString(),
  });
}
