"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Check,
  FileText,
  Globe,
  Loader2,
  MessageSquare,
  Plus,
  Upload,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface OverviewResponse {
  botId: string | null;
  knowledge: {
    website: number;
    upload: number;
    text: number;
    total: number;
  };
  sections: {
    total: number;
    list: Array<{
      name: string;
      sourceCount: number;
      tone: string;
    }>;
  };
  counts: {
    knowledge: number;
    sections: number;
    conversations: number;
  };
}

interface SetupStep {
  label: string;
  href: string;
  complete: boolean;
}

const panelClassName =
  "overflow-hidden rounded-[28px] border border-white/[0.06] bg-[#0b0c10] shadow-[0_20px_60px_rgba(0,0,0,0.22)]";

function SetupStepCard({ step }: { step: SetupStep }) {
  return (
    <Link
      href={step.href}
      className={cn(
        "group flex min-h-[74px] items-center justify-between rounded-[22px] border px-5 py-4 transition-all duration-200",
        step.complete
          ? "border-white/[0.06] bg-[#0d0d12] hover:border-white/[0.1] hover:bg-white/[0.02]"
          : "border-[#31355f] bg-[linear-gradient(180deg,rgba(95,109,255,0.1),rgba(95,109,255,0.03))] hover:border-[#4950a8] hover:bg-[linear-gradient(180deg,rgba(95,109,255,0.14),rgba(95,109,255,0.05))]"
      )}
    >
      <span
        className={cn(
          "text-[15px] font-medium tracking-tight",
          step.complete ? "text-zinc-300" : "text-white"
        )}
      >
        {step.label}
      </span>
      {step.complete ? (
        <Check className="size-4 shrink-0 text-emerald-500" />
      ) : (
        <ArrowUpRight className="size-4 shrink-0 text-[#8390ff] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      )}
    </Link>
  );
}

function KnowledgeMetric({
  label,
  value,
  icon: Icon,
  iconClassName,
}: {
  label: string;
  value: number;
  icon: typeof Globe;
  iconClassName: string;
}) {
  return (
    <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.03] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <Icon className={cn("size-4", iconClassName)} />
        <span>{label}</span>
      </div>
      <div className="mt-3 text-[2.1rem] font-semibold leading-none tracking-tight text-white">
        {value}
      </div>
    </div>
  );
}

export default function DashboardOverView() {
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function fetchOverview() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/overview", {
          cache: "no-store",
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            typeof errorData?.error === "string"
              ? errorData.error
              : "Failed to load dashboard overview."
          );
        }

        const overviewData = (await response.json()) as OverviewResponse;

        if (!cancelled) {
          setData(overviewData);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Failed to load dashboard overview."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void fetchOverview();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-6 py-10">
        <div className="flex items-center gap-3 rounded-full border border-white/[0.06] bg-white/[0.03] px-5 py-3 text-sm text-zinc-400">
          <Loader2 className="size-4 animate-spin" />
          <span>Loading dashboard overview...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto w-full max-w-[1320px] px-6 py-8 md:px-10 md:py-10">
        <div className={cn(panelClassName, "px-7 py-8")}>
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Dashboard overview unavailable
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
            {error || "Something went wrong while loading your dashboard data."}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 inline-flex items-center rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/[0.08]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const setupSteps: SetupStep[] = [
    {
      label: "Website Scanned",
      complete: data.knowledge.website > 0,
      href: "/dashboard/knowledge",
    },
    {
      label: "Knowledge Added",
      complete: data.counts.knowledge > 0,
      href: "/dashboard/knowledge",
    },
    {
      label: "Sections Configured",
      complete: data.counts.sections > 0,
      href: "/dashboard/sections",
    },
    {
      label: "Widget Installed",
      complete: Boolean(data.botId) || data.counts.conversations > 0,
      href: "/dashboard/chatbot",
    },
  ];

  const knowledgeMetrics = [
    {
      label: "Pages",
      value: data.knowledge.website || 0,
      icon: Globe,
      iconClassName: "text-blue-400",
    },
    {
      label: "Manual Texts",
      value: data.knowledge.text || 0,
      icon: FileText,
      iconClassName: "text-violet-400",
    },
    {
      label: "Uploads",
      value: data.knowledge.upload || 0,
      icon: Upload,
      iconClassName: "text-emerald-400",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-9 px-6 py-8 md:px-10 md:py-10">
      <section className="space-y-5">
        <h1 className="text-[2rem] font-semibold tracking-tight text-white">
          Setup Progress
        </h1>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {setupSteps.map((step) => (
            <SetupStepCard key={step.label} step={step} />
          ))}
        </div>
      </section>

      <section className={cn(panelClassName, "px-7 py-7")}>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-[1.85rem] font-semibold tracking-tight text-white">
              Knowledge Base
            </h2>
          </div>

          <Link
            href="/dashboard/knowledge"
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm font-medium text-zinc-300 transition-colors hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white"
          >
            Manage sources
          </Link>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {knowledgeMetrics.map((metric) => (
            <KnowledgeMetric
              key={metric.label}
              label={metric.label}
              value={metric.value}
              icon={metric.icon}
              iconClassName={metric.iconClassName}
            />
          ))}
        </div>
      </section>

      <section className={cn(panelClassName, "min-h-[360px]")}>
        <div className="flex flex-col gap-5 px-7 py-7 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-[1.85rem] font-semibold tracking-tight text-white">
              Sections
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              configure behavior for different topics
            </p>
          </div>

          <Link
            href="/dashboard/sections"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
          >
            <Plus className="size-4" />
            <span>Create Section</span>
          </Link>
        </div>

        <div className="border-t border-white/[0.06]">
          {data.sections.list.length === 0 ? (
            <div className="flex min-h-[220px] items-center justify-center px-7 py-10 text-center text-sm text-zinc-500">
              No sections configured yet. Create your first section to define how the assistant responds to different topics.
            </div>
          ) : (
            <Table>
              <TableHeader className="[&_tr]:border-white/[0.06]">
                <TableRow className="bg-white/[0.02] hover:bg-white/[0.02]">
                  <TableHead className="px-7 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                    Name
                  </TableHead>
                  <TableHead className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                    Sources
                  </TableHead>
                  <TableHead className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                    Tone
                  </TableHead>
                  <TableHead className="w-[88px] px-7 text-right text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="[&_tr]:border-white/[0.06]">
                {data.sections.list.map((section) => (
                  <TableRow
                    key={`${section.name}-${section.tone}`}
                    className="bg-transparent hover:bg-white/[0.02]"
                  >
                    <TableCell className="px-7 py-5 text-base font-semibold tracking-tight text-white">
                      {section.name}
                    </TableCell>
                    <TableCell className="py-5 text-base text-zinc-400">
                      {section.sourceCount} source
                      {section.sourceCount === 1 ? "" : "s"}
                    </TableCell>
                    <TableCell className="py-5">
                      <Badge
                        variant="secondary"
                        className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-sm font-medium capitalize text-zinc-300"
                      >
                        {section.tone}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-7 py-5 text-right">
                      <button
                        type="button"
                        onClick={() => router.push("/dashboard/sections")}
                        className="inline-flex size-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-300 transition-colors hover:border-white/[0.14] hover:bg-white/[0.08] hover:text-white"
                        aria-label={`Manage ${section.name}`}
                        title={`Manage ${section.name}`}
                      >
                        <MessageSquare className="size-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </section>
    </div>
  );
}
