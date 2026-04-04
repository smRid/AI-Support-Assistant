"use client";

import SectionFormFields from "@/components/dashboard/sections/sectionFormFields";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus, Sheet } from "lucide-react";
import { useState } from "react";

type SectionStatus = "active" | "draft" | "disabled";
type Tone = "strict" | "neutral" | "friendly" | "empathetic";

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

interface KnowledgeSource {
    id: string;
    name: string;
    type: string;
    status: string;
}

interface FormData {
    name: string;
    description: string;
    tone: Tone;
    allowedTopics: string;
    blockedTopics: string;
    fallbackBehavior: string;
}

const INITIAL_FORM_DATA: FormData = {
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

const isPreviewMode = selectedSection?.id !== "new";


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

        <Button className="h-10 rounded-xl bg-white px-4 text-black hover:bg-zinc-200">
          <Plus className="mr-2 size-4" />
          Create Section
        </Button>

        <Card className="border-white/5 bg-[#0A0A0E]">
  <CardContent className="p-0">

  </CardContent>
</Card>
<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
  <SheetContent className="w-full sm:max-w-lg border-l border-white/10 bg-[#0A0A0E] p-0 shadow-2xl flex flex-col h-full">
    {selectedSection && (
  <>
    <SheetHeader className="p-6 border-b border-white/5">
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

     <div className="flex-1 overflow-y-auto p-6 space-y-8">
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
  </>
)}
  </SheetContent>
</Sheet>
      </div>
    </div>
  );
}
