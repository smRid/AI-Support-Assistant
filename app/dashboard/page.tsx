"use client";

import DashboradOverView from "@/components/dashboard/dashboradOverView";
import InitialForm from "@/components/dashboard/initialForm";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [isMetaDataAvailable, setIsMetaDataAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchMetadata = async () => {
      try {
        const response = await fetch("/api/metadata/fetch", {
          cache: "no-store",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch metadata.");
        }

        const data = (await response.json()) as { exists?: boolean };

        if (!isMounted) {
          return;
        }

        setIsMetaDataAvailable(Boolean(data.exists));
      } catch (error) {
        console.error("Metadata fetch error:", error);

        if (!isMounted) {
          return;
        }

        setIsMetaDataAvailable(false);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchMetadata();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-4 text-sm text-zinc-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      {!isMetaDataAvailable ? (
        <div className="flex min-h-screen w-full">
          <InitialForm />
        </div>
      ) : (
        <div className="">
          <DashboradOverView />
        </div>
      )}
    </div>
  );
}
