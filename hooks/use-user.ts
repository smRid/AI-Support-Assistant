"use client";

import { useEffect, useState } from "react";
import type { AuthorizedUser } from "@/lib/isAuthorized";

export const useUser = () => {
  const [user, setUser] = useState<AuthorizedUser | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user session.");
        }

        const data = (await response.json()) as { user: AuthorizedUser | null };

        if (!isMounted) {
          return;
        }

        setUser(data.user);
        setEmail(data.user?.email ?? null);
      } catch (error) {
        console.error("Failed to fetch user session", error);

        if (!isMounted) {
          return;
        }

        setUser(null);
        setEmail(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    user,
    email,
    loading,
  };
};
