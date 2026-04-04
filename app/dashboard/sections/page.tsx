"use client";

import SectionFormFields from "@/components/dashboard/sections/sectionFormFields";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface Section {
  id: string;
  name: string;
  description: string;
  sourceCount: number;
  source_ids?: string[];
  tone: Tone;
  scopeLabel: string;
  allowed_topics?: string;
  blocked_topics?: string;
  status: SectionStatus;
}

const INITIAL_FORM_DATA: SectionFormData = {
  name: "",
  description: "",
  tone: "neutral",
  allowedTopics: "",
  blockedTopics: "",
  fallbackBehavior: "escalate",
};

export default function SectionsPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [formData, setFormData] = useState<SectionFormData>(INITIAL_FORM_DATA);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>(
    []
  );
  const [isLoadingSources, setIsLoadingSources] = useState(true);

  useEffect(() => {
    const fetchKnowledgeSources = async () => {
      try {
        const res = await fetch("/api/knowledge/fetch", {
          cache: "no-store",
        });
        const data = await res.json();
        setKnowledgeSources(data.sources || []);
      } catch (error) {
        console.error("Failed to fetch knowledge sources:", error);
      } finally {
        setIsLoadingSources(false);
      }
    };

    void fetchKnowledgeSources();
  }, []);

  const handleCreateSection = async () => {
    setSelectedSection({
      id: "new",
      name: "",
      description: "",
      sourceCount: 0,
      tone: "neutral",
      scopeLabel: "",
      status: "draft",
    });
    setSelectedSources([]);
    setFormData(INITIAL_FORM_DATA);
    setIsSheetOpen(true);
  };

  const handleDeleteSection = async () => {
    setIsSaving(true);
    setSelectedSection(null);
    setSelectedSources([]);
    setFormData(INITIAL_FORM_DATA);
    setIsSheetOpen(false);
    setIsSaving(false);
  };

  const isPreviewMode = selectedSection?.id !== "new";
  const isNewSection = selectedSection?.id === "new";
  const showDangerZone = selectedSection != null && selectedSection.id !== "new";

  return (
    <div className="mx-auto max-w-7xl animate-in space-y-8 p-6 fade-in duration-500 md:p-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Sections
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Define behavior and tone for different topics.
          </p>
        </div>

        <Button
          onClick={() => void handleCreateSection()}
          className="h-10 rounded-xl bg-white px-4 text-black hover:bg-zinc-200"
        >
          <Plus className="mr-2 size-4" />
          Create Section
        </Button>
      </div>

      <Card className="min-h-[42px] rounded-2xl border border-white/5 bg-[#0A0A0E]">
        <CardContent className="p-0" />
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="flex h-full w-full flex-col overflow-hidden border-l border-white/10 bg-[#0A0A0E] p-0 shadow-2xl sm:max-w-lg">
          {selectedSection && (
            <>
              <SheetHeader className="border-b border-white/5 p-6">
                <SheetTitle className="text-xl text-white">
                  {selectedSection.id === "new"
                    ? "Create Section"
                    : "View Section"}
                </SheetTitle>
                <SheetDescription className="text-zinc-500">
                  {selectedSection.id === "new"
                    ? "Configure how the AI behaves for this specific topic."
                    : "Review section configuration and data sources."}
                </SheetDescription>
              </SheetHeader>
              <div className="min-h-0 flex-1 overflow-y-auto p-6">
                <SectionFormFields
                  formData={formData}
                  setFormData={setFormData}
                  selectedSources={selectedSources}
                  setSelectedSources={setSelectedSources}
                  knowledgeSources={knowledgeSources}
                  isLoadingSources={isLoadingSources}
                  isDisabled={isPreviewMode}
                />
              </div>
              {isNewSection ? (
                <SheetFooter className="shrink-0 border-t border-white/5 bg-[#0A0A0E] p-6">
                  <Button className="h-11 w-full rounded-xl bg-white text-black hover:bg-zinc-200">
                    Create Section
                  </Button>
                </SheetFooter>
              ) : null}
              {showDangerZone ? (
                <>
                  <SheetFooter className="shrink-0 border-t border-white/5 bg-[#0A0A0E] p-6">
                    <Button className="h-11 w-full rounded-xl bg-white text-black hover:bg-zinc-200">
                      Save Changes
                    </Button>
                  </SheetFooter>
                  <div className="border-t border-red-500/10 bg-red-500/5 p-6">
                    <h5 className="mb-1 text-sm font-medium text-red-400">
                      Danger Zone
                    </h5>
                    <p className="mb-3 text-xs text-red-500/70">
                      Deleting this section will remove all associated routing
                      rules.
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400"
                      onClick={() => void handleDeleteSection()}
                      disabled={isSaving}
                    >
                      {isSaving ? "Deleting..." : "Delete Section"}
                    </Button>
                  </div>
                </>
              ) : null}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
