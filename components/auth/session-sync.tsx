"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { useEffect, useRef } from "react";

const sessionCheckIntervalMs = 5000;

export default function SessionSync() {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const signOutInFlight = useRef(false);

  useEffect(() => {
    if (!isSignedIn) {
      signOutInFlight.current = false;
      return;
    }

    let isActive = true;

    const verifySession = async () => {
      if (!isActive || signOutInFlight.current) {
        return;
      }

      try {
        const response = await fetch("/api/auth/session", {
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as {
          user: { email: string; organization_id: string } | null;
        };

        if (!data.user) {
          signOutInFlight.current = true;
          await signOut({ redirectUrl: "/" });
        }
      } catch (error) {
        console.error("Failed to verify app session", error);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void verifySession();
      }
    };

    void verifySession();

    const intervalId = window.setInterval(() => {
      void verifySession();
    }, sessionCheckIntervalMs);

    window.addEventListener("focus", verifySession);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", verifySession);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isSignedIn, signOut]);

  return null;
}
