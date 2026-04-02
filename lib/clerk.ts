export const clerkAuthCallbackPath = "/auth/callback";

export const clerkSignInRedirectProps = {
  mode: "redirect" as const,
  forceRedirectUrl: clerkAuthCallbackPath,
  fallbackRedirectUrl: clerkAuthCallbackPath,
  signUpForceRedirectUrl: clerkAuthCallbackPath,
  signUpFallbackRedirectUrl: clerkAuthCallbackPath,
};

export const clerkSignUpRedirectProps = {
  mode: "redirect" as const,
  forceRedirectUrl: clerkAuthCallbackPath,
  fallbackRedirectUrl: clerkAuthCallbackPath,
  signInForceRedirectUrl: clerkAuthCallbackPath,
  signInFallbackRedirectUrl: clerkAuthCallbackPath,
};
