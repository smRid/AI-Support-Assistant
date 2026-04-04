import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, FileText, Globe, Loader2, Upload, X } from 'lucide-react';
import React, { useState } from 'react'

interface AddKnowledgeModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  defaultTab: string;
  setDefaultTab: (tab: string) => void;
  onImport: (data: any) => Promise<void>;
  isLoading: boolean;
  existingSources: KnowledgeSource[];
}

const AddKnowledgeModal = ({
  isOpen,
  setIsOpen,
  defaultTab,
  setDefaultTab,
  onImport,
  isLoading,
  existingSources,
}: AddKnowledgeModalProps) => {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [docsTitle, setDocsTitle] = useState("");
  const [docsContent, setDocsContent] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return ["http:", "https:"].includes(parsed.protocol);
    } catch {
      return false;
    }
  };

  const handleImportWrapper = async () => {
    const data: Record<string, any> = {
      type: defaultTab,
    };

    if (defaultTab === "website") {
      if (!websiteUrl) {
        setError("Please enter a website URL.");
        return;
      }
      if (!validateUrl(websiteUrl)) {
        setError("Please enter a valid URL (e.g. https://example.com).");
        return;
      }

      const normalizedInput = websiteUrl.replace(/\/$/, "");
      const exists = existingSources.some((source) => {
        if (source.type !== "website" || !source.source_url) return false;
        const normalizedSource = source.source_url.replace(/\/$/, "");
        return normalizedSource === normalizedInput;
      });

      if (exists) {
        setError("This website is already in your knowledge base.");
        return;
      }

      data.url = websiteUrl;
    } else if (defaultTab === "text") {
      if (!docsTitle.trim()) {
        setError("Please enter a title.");
        return;
      }
      if (!docsContent.trim()) {
        setError("Please provide content.");
        return;
      }
      data.title = docsTitle;
      data.content = docsContent;
    } else if (defaultTab === "upload") {
      if (!uploadedFile) {
        setError("Please select a file to upload.");
        return;
      }
      data.file = uploadedFile;
    }

    try {
      await onImport(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to import source."
      );
      return;
    }

    setWebsiteUrl("");
    setDocsTitle("");
    setDocsContent("");
    setUploadedFile(null);
    setError(null);
  };


  return <Dialog
    open={isOpen}
    onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) setError(null);
    }}
  >
    <DialogContent
      showCloseButton={false}
      className="flex max-h-[calc(100vh-2rem)] max-w-[calc(100%-2rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#121216] p-0 text-zinc-100 shadow-2xl shadow-black/50 sm:max-w-[520px]"
    >
      <DialogHeader className="relative px-5 pt-5 pb-4">
        <DialogTitle className="text-[1.1rem] font-semibold tracking-tight text-white">
          Add New Source
        </DialogTitle>
        <DialogDescription className="text-sm text-zinc-500">
          Choose a content type to train your assistant.
        </DialogDescription>
        <DialogClose
          render={
            <button
              type="button"
              className="absolute top-4 right-4 inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-transparent hover:text-white"
            />
          }
        >
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogHeader>

      <Tabs
        defaultValue="website"
        value={defaultTab}
        onValueChange={(value) => {
          setDefaultTab(value);
          setError(null);
        }}
        className="flex min-h-0 w-full flex-1 flex-col"
      >
        <div className="border-b border-white/10 px-5">
          <TabsList
            variant="line"
            className="h-auto gap-5 rounded-none bg-transparent p-0 text-zinc-500"
          >
            <TabsTrigger
              value="website"
              className="cursor-pointer rounded-none px-0 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 hover:bg-transparent hover:text-white data-active:bg-transparent data-active:text-white after:bg-indigo-500 focus-visible:ring-0 focus-visible:outline-none"
            >
              Website
            </TabsTrigger>
            <TabsTrigger
              value="text"
              className="cursor-pointer rounded-none px-0 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 hover:bg-transparent hover:text-white data-active:bg-transparent data-active:text-white after:bg-violet-400 focus-visible:ring-0 focus-visible:outline-none"
            >
              Q&amp;A / Text
            </TabsTrigger>
            <TabsTrigger
              value="upload"
              className="cursor-pointer rounded-none px-0 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 hover:bg-transparent hover:text-white data-active:bg-transparent data-active:text-white after:bg-emerald-500 focus-visible:ring-0 focus-visible:outline-none"
            >
              File Upload
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {error && (
            <Alert
              variant="destructive"
              className="mb-4 border-red-500/20 bg-red-500/10 py-2 text-red-400"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2 text-xs">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <TabsContent
            value="website"
            className="mt-0 space-y-5 animate-in fade-in duration-300"
          >
            <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-100">
                  <Globe className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-100">
                    Crawl Website
                  </p>
                  <p className="mt-1 text-sm leading-6 text-indigo-100/70">
                    Enter a website URL to crawl significantly or add a specific
                    page link to provide focused context.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-zinc-100">
                Website URL <span className="text-zinc-400">*</span>
              </Label>
              <Input
                type="url"
                placeholder="https://example.com"
                className="mt-0 h-10 cursor-text rounded-lg border-white/10 bg-white/[0.04] text-zinc-100 placeholder:text-zinc-500 focus-visible:border-indigo-500/40 focus-visible:ring-indigo-500/15"
                value={websiteUrl}
                onChange={(e) => {
                  setWebsiteUrl(e.target.value);
                  if (error) setError(null);
                }}
              />
            </div>
          </TabsContent>

          <TabsContent
            value="text"
            className="mt-0 space-y-5 animate-in fade-in duration-300"
          >
            <div className="rounded-xl border border-violet-500/25 bg-violet-500/10 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-100">
                  <FileText className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-100">
                    Raw Text
                  </p>
                  <p className="mt-1 text-sm leading-6 text-violet-100/70">
                    Paste existing FAQs, policies, or internal notes directly.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-zinc-100">
                Title
              </Label>
              <Input
                placeholder="Knowledge note title"
                className="mt-0 h-10 cursor-text rounded-lg border-white/10 bg-white/[0.04] text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-500/40 focus-visible:ring-violet-500/15"
                value={docsTitle}
                onChange={(e) => setDocsTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-zinc-100">
                Content <span className="text-zinc-400">*</span>
              </Label>
              <Textarea
                placeholder="Paste your FAQs, policy text, or internal notes..."
                className="min-h-28 max-h-[320px] cursor-text resize-none overflow-y-auto rounded-lg border-white/10 bg-white/[0.04] text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-500/40 focus-visible:ring-violet-500/15 [field-sizing:fixed]"
                value={docsContent}
                onChange={(e) => setDocsContent(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent
            value="upload"
            className="mt-0 space-y-5 animate-in fade-in duration-300"
          >
            <input
              type="file"
              id="csv-file-input"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 10 * 1024 * 1024) {
                    setError("File size must be less than 10MB");
                    return;
                  }

                  if (
                    !file.name.endsWith(".csv") &&
                    file.type !== "text/csv"
                  ) {
                    setError("Only CSV files are allowed");
                    return;
                  }

                  setUploadedFile(file);
                  setError(null);
                }
              }}
            />

            <div
              className="h-60 cursor-pointer rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center transition-colors hover:border-white/20"
              onClick={() => {
                document.getElementById("csv-file-input")?.click();
              }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800">
                <Upload className="h-6 w-6 text-zinc-400" />
              </div>
              <p className="text-sm font-medium text-white">
                {uploadedFile
                  ? uploadedFile.name
                  : "Click to upload or drag and drop"}
              </p>
              <p className="mt-1 text-xs text-zinc-500">CSV (max 10MB)</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
      <div className="p-6 border-t border-white/5 bg-black/20 flex justify-end gap-3">
<Button variant="ghost" onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white hover:bg-white/5">Cancel</Button>
<Button
  className={`bg-white min-w-27.5 text-black hover:bg-zinc-200 ${
    isLoading ? "opacity-50 cursor-not-allowed" : ""
  }`}
  onClick={handleImportWrapper}
  disabled={isLoading}
>
  {isLoading ? (
    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
  ) : (
    "Import Source"
  )}
</Button>
        </div>
    </DialogContent>
  </Dialog>
};

export default AddKnowledgeModal
