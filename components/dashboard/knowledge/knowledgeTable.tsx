"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Filter, Globe, Search } from "lucide-react";
import { useDeferredValue, useState } from "react";

interface KnowledgeTableProps {
  sources: KnowledgeSource[];
  onSourceClick: (source: KnowledgeSource) => void;
  isLoading: boolean;
}

const typeLabelMap: Record<string, string> = {
  text: "Manual Text",
  website: "Website",
  upload: "CSV Upload",
};

const statusClassMap: Record<string, string> = {
  active: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  training: "border-amber-500/25 bg-amber-500/10 text-amber-300",
  error: "border-red-500/25 bg-red-500/10 text-red-300",
  excluded: "border-zinc-500/25 bg-zinc-500/10 text-zinc-300",
};

function formatDate(value: string | null) {
  if (!value) {
    return "Never";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

const KnowledgeTable = ({
  sources,
  onSourceClick,
  isLoading,
}: KnowledgeTableProps) => {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const filteredSources = sources.filter((source) => {
    if (!normalizedQuery) {
      return true;
    }

    const haystack = [
      source.name,
      source.type,
      source.status,
      source.source_url ?? "",
      source.content ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });

  return (
    <Card className="overflow-hidden rounded-2xl border border-white/5 bg-[#0a0a0e] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <CardHeader className="flex flex-col gap-4 px-5 py-6 md:flex-row md:items-center md:justify-between md:px-6">
        <CardTitle className="text-[1.05rem] font-semibold text-white">
          Sources
        </CardTitle>

        <div className="flex items-center gap-2">
          <div className="relative w-full min-w-0 md:w-[216px]">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-9 rounded-xl border-white/10 bg-white/[0.03] pl-9 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:border-white/15 focus-visible:ring-0"
              placeholder="Search sources..."
            />
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 rounded-xl text-zinc-500 hover:bg-white/[0.04] hover:text-white"
            aria-label="Filter sources"
          >
            <Filter className="size-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        <Table>
          <TableHeader>
            <TableRow className="border-y border-white/5 hover:bg-transparent">
              <TableHead className="h-11 px-5 text-[11px] uppercase font-medium tracking-[0.08em] text-zinc-500 md:px-6">
                Name
              </TableHead>
              <TableHead className="h-11 text-[11px] uppercase font-medium tracking-[0.08em] text-zinc-500">
                Type
              </TableHead>
              <TableHead className="h-11 text-[11px] uppercase font-medium tracking-[0.08em] text-zinc-500">
                Status
              </TableHead>
              <TableHead className="h-11 text-[11px] uppercase font-medium tracking-[0.08em] text-zinc-500">
                Last Updated
              </TableHead>
              <TableHead className="h-11 pr-5 text-[11px] uppercase font-medium tracking-[0.08em] text-zinc-500 md:pr-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index} className="border-white/5">
                  <TableCell className="px-5 py-3.5 md:px-6">
                    <Skeleton className="h-5 w-28 rounded-md bg-white/[0.05]" />
                  </TableCell>
                  <TableCell className="py-3.5">
                    <Skeleton className="h-5 w-24 rounded-md bg-white/[0.05]" />
                  </TableCell>
                  <TableCell className="py-3.5">
                    <Skeleton className="h-5 w-24 rounded-md bg-white/[0.05]" />
                  </TableCell>
                  <TableCell className="py-3.5">
                    <Skeleton className="h-5 w-24 rounded-md bg-white/[0.05]" />
                  </TableCell>
                  <TableCell className="py-3.5 pr-5 md:pr-6">
                    <Skeleton className="h-5 w-24 rounded-md bg-white/[0.05]" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredSources.length > 0 ? (
              filteredSources.map((source) => (
                <TableRow
                  key={source.id}
                  className="border-white/5 bg-transparent hover:bg-white/[0.015]"
                >
                  <TableCell className="max-w-[420px] px-5 py-3.5 md:px-6">
                    <div className="flex min-w-0 items-start gap-2.5">
                      <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-300">
                        <Globe className="size-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                          {source.name}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-zinc-500">
                          {source.source_url || "Stored knowledge source"}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-3.5 text-sm text-zinc-300">
                    {typeLabelMap[source.type] ?? source.type}
                  </TableCell>

                  <TableCell className="py-3.5">
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium",
                        statusClassMap[source.status] ??
                          "border-white/10 bg-white/[0.03] text-zinc-300"
                      )}
                    >
                      {source.status.charAt(0).toUpperCase() + source.status.slice(1)}
                    </span>
                  </TableCell>

                  <TableCell className="py-3.5 text-sm text-zinc-400">
                    {formatDate(source.last_updated || source.created_at)}
                  </TableCell>

                  <TableCell className="py-3.5 pr-5 md:pr-6">
                    <button
                      type="button"
                      className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                      onClick={() => onSourceClick(source)}
                    >
                      View
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableCell
                  colSpan={5}
                  className="px-5 py-12 text-center text-sm text-zinc-500 md:px-6"
                >
                  {sources.length === 0
                    ? "No sources yet. Add a website, CSV file, or manual text to get started."
                    : "No sources match your search."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default KnowledgeTable;
