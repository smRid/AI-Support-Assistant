"use client";

import AddKnowledgeModal from "@/components/dashboard/knowledge/addKnowledgeModal";
import KnowledgeTable from "@/components/dashboard/knowledge/knowledgeTable";
import QuickActions from "@/components/dashboard/knowledge/quickActions";
import SourceDetailsSheet from "@/components/dashboard/knowledge/sourceDetailsSheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

const getErrorMessage = async (response: Response) => {
  try {
    const payload = await response.json();

    if (payload && typeof payload.error === "string") {
      return payload.error;
    }
  } catch {
    // Ignore JSON parse failures and use the fallback message.
  }

  return "Failed to store source";
};

const KnowledgePage = () => {
  const [defaultTab, setDefaultTab] = useState("website");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [knowledgeStoringLoader, setKnowledgeStoringLoader] = useState(false);
  const [knowledgeSourcesLoader, setKnowledgeSourcesLoader] = useState(true);
  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>(
    []
  );
  const [selectedSource, setSelectedSource] = useState<KnowledgeSource | null>(
    null
  );

  const loadKnowledgeSources = async () => {
    setKnowledgeSourcesLoader(true);

    try {
      const response = await fetch("/api/knowledge/fetch", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load knowledge sources.");
      }

      const data = await response.json();
      setKnowledgeSources(data.sources ?? []);
    } catch (error) {
      console.error(error);
      setKnowledgeSources([]);
    } finally {
      setKnowledgeSourcesLoader(false);
    }
  };

  useEffect(() => {
    void loadKnowledgeSources();
  }, []);

  const openModal = (tab: string) => {
    setDefaultTab(tab);
    setIsAddOpen(true);
  };

  const handleSourceClick = (source: KnowledgeSource) => {
    setSelectedSource(source);
    setIsSheetOpen(true);
  };

  const handleImportSource = async (data: any) => {
    setKnowledgeStoringLoader(true);

    try {
      let response;

      if (data.type === "upload" && data.file) {
        const formData = new FormData();
        formData.append("type", "upload");
        formData.append("file", data.file);

        response = await fetch("/api/knowledge/store", {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch("/api/knowledge/store", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      await loadKnowledgeSources();
      setIsAddOpen(false);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setKnowledgeStoringLoader(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl animate-in space-y-8 p-6 fade-in duration-500 md:p-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Knowledge Base
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage your website sources, documents, and uploads here.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => openModal("website")}
            className="h-10 rounded-xl bg-white px-4 text-black hover:bg-zinc-200"
          >
            <Plus className="mr-2 size-4" />
            Add Knowledge
          </Button>
        </div>
      </div>

      <QuickActions onOpenModal={openModal} />

      <KnowledgeTable
        sources={knowledgeSources}
        onSourceClick={handleSourceClick}
        isLoading={knowledgeSourcesLoader}
      />

      <AddKnowledgeModal
        isOpen={isAddOpen}
        setIsOpen={setIsAddOpen}
        defaultTab={defaultTab}
        setDefaultTab={setDefaultTab}
        onImport={handleImportSource}
        isLoading={knowledgeStoringLoader}
        existingSources={knowledgeSources}
      />

      <SourceDetailsSheet
        isOpen={isSheetOpen}
        setIsOpen={setIsSheetOpen}
        selectedSource={selectedSource}
      />
    </div>
  );
};

export default KnowledgePage;
