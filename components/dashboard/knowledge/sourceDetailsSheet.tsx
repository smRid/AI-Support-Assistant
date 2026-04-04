"use client";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, Globe, Upload, X } from "lucide-react";

interface SourceDetailsSheetProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedSource: KnowledgeSource | null;
}

const iconMap = {
  text: FileText,
  website: Globe,
  upload: Upload,
} as const;

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

const scrollbarClassName =
  "overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.18)_transparent] [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15 hover:[&::-webkit-scrollbar-thumb]:bg-white/25";

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

function prettyJson(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

const SourceDetailsSheet = ({
  isOpen,
  setIsOpen,
  selectedSource,
}: SourceDetailsSheetProps) => {
  const Icon =
    iconMap[selectedSource?.type as keyof typeof iconMap] ?? Globe;
  const previewContent =
    selectedSource?.content?.trim() || "No content stored for this source yet.";
  const formattedMetaData = prettyJson(selectedSource?.meta_data ?? null);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="h-full w-full overflow-hidden border-l border-white/10 bg-[#0a0a0e] p-0 text-white sm:max-w-[420px]"
      >
        {selectedSource ? (
          <div className="flex h-full min-h-0 flex-col">
            <SheetHeader className="border-b border-white/5 px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-300">
                      <Icon className="size-3.5" />
                    </div>
                    <SheetTitle className="truncate text-[1.05rem] font-semibold text-white">
                      {selectedSource.name}
                    </SheetTitle>
                  </div>
                  <p className="mt-2 truncate text-sm text-zinc-500">
                    {selectedSource.source_url || "Manual / uploaded content"}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium",
                        statusClassMap[selectedSource.status] ??
                          "border-white/10 bg-white/[0.03] text-zinc-300"
                      )}
                    >
                      {selectedSource.status.charAt(0).toUpperCase() +
                        selectedSource.status.slice(1)}
                    </span>
                    <span>
                      Updated{" "}
                      {formatDate(
                        selectedSource.last_updated || selectedSource.created_at
                      )}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md p-1 text-zinc-500 transition-colors hover:bg-white/[0.04] hover:text-white"
                  aria-label="Close source details"
                >
                  <X className="size-4" />
                </button>
              </div>
            </SheetHeader>

            <div className={cn("min-h-0 flex-1 px-5 py-5", scrollbarClassName)}>
              <div className="space-y-6 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-400">
                    Content Preview
                  </p>
                  <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <div
                      className={cn(
                        "max-h-[360px] rounded-lg border border-white/5 bg-black/20 p-4",
                        scrollbarClassName
                      )}
                    >
                      <p className="whitespace-pre-wrap break-words text-sm leading-6 text-zinc-300">
                        {previewContent}
                      </p>
                    </div>
                  </div>
                </div>

                {formattedMetaData && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-400">
                      Metadata
                    </p>
                    <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                      <div
                        className={cn(
                          "max-h-[220px] rounded-lg border border-white/5 bg-black/20 p-4",
                          scrollbarClassName
                        )}
                      >
                        <pre className="whitespace-pre-wrap break-words text-xs leading-6 text-zinc-400">
                          {formattedMetaData}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <SheetFooter className="shrink-0 border-t border-white/5 bg-[#050509] p-6">
              <Button
                variant="destructive"
                className="w-full bg-red-500/10 text-red-500 hover:bg-red-500/15"
                onClick={() => setIsOpen(false)}
              >
                Disconnect Source
              </Button>
            </SheetFooter>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
};

export default SourceDetailsSheet;
