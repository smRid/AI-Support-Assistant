import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

interface KnowledgeSourceOption {
  id: string;
  name: string;
  type: string;
}

interface SectionFormFieldsProps {
  formData: SectionFormData;
  setFormData: (data: SectionFormData) => void;
  selectedSources: string[];
  setSelectedSources: (sources: string[]) => void;
  knowledgeSources: KnowledgeSourceOption[];
  isLoadingSources: boolean;
  isDisabled: boolean;
}

const SectionFormFields = ({
  formData,
  setFormData,
  selectedSources,
  setSelectedSources,
  knowledgeSources,
  isLoadingSources,
  isDisabled,
}: SectionFormFieldsProps) => {
  const handleAddSource = (sourceId: string | null) => {
    if (!sourceId) {
      return;
    }

    if (selectedSources.includes(sourceId)) {
      return;
    }

    setSelectedSources([...selectedSources, sourceId]);
  };

  const handleRemoveSource = (sourceId: string) => {
    setSelectedSources(selectedSources.filter((id) => id !== sourceId));
  };

  const TONE_OPTIONS = [
  {
    value: "strict",
    label: "Strict",
    badge: "Fact-based",
    description: "Only answer if fully confident. No small talk.",
  },
  {
      value: "neutral",
      label: "Neutral",
      description: "Professional, concise, and direct.",
    },
    {
      value: "friendly",
      label: "Friendly",
      description: "Warm and conversational. Good for general FAQ.",
    },
    {
      value: "empathetic",
      label: "Empathetic",
      description: "Support-first, apologetic, and calming.",
    },
];

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h4 className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
          Basics
        </h4>

        <div className="space-y-2">
          <Label className="text-zinc-300">Section Name</Label>
          <Input
            placeholder="e.g. Billing Policy"
            className="h-10 border-white/10 bg-white/[0.03] text-white placeholder:text-zinc-500"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            disabled={isDisabled}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-zinc-300">Description</Label>
          <Textarea
            placeholder="When should the AI use this?"
            className="min-h-14 resize-none border-white/10 bg-white/[0.03] text-white placeholder:text-zinc-500"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            disabled={isDisabled}
          />
          <p className="text-xs text-zinc-500">
            Used by the routing model to decide when to activate this section.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
            Data Sources
          </h4>
          <span className="text-xs text-zinc-500">
            {selectedSources.length} attached
          </span>
        </div>

        <Select
          disabled={isDisabled || isLoadingSources}
          onValueChange={handleAddSource}
          value={null}
        >
          <SelectTrigger className="h-10 w-full rounded-xl border-white/10 bg-white/[0.03] text-white shadow-none">
            <SelectValue
              placeholder={
                isLoadingSources
                  ? "Loading sources..."
                  : "Select knowledge sources..."
              }
            />
          </SelectTrigger>

          <SelectContent className="overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0E] p-1 text-white shadow-2xl">
            {knowledgeSources.length > 0 ? (
              knowledgeSources.map((source) => (
                <SelectItem
                  key={source.id}
                  value={source.id}
                  className="rounded-md px-2.5 py-2 text-sm text-white focus:bg-white focus:text-black"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="shrink-0 text-xs capitalize text-zinc-500">
                      [{source.type}]
                    </span>
                    <span className="truncate">{source.name}</span>
                  </div>
                </SelectItem>
              ))
            ) : (
              <div className="px-2.5 py-2 text-sm text-zinc-500">
                No knowledge sources found.
              </div>
            )}
          </SelectContent>
        </Select>

        {selectedSources.length > 0 ? (
          <div className="space-y-2">
            {selectedSources.map((sourceId) => {
              const source = knowledgeSources.find((item) => item.id === sourceId);

              if (!source) {
                return null;
              }

              return (
                <div
                  key={sourceId}
                  className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.03] px-3 py-2"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="text-xs capitalize text-zinc-500">
                      [{source.type}]
                    </span>
                    <span className="truncate text-sm text-zinc-200">
                      {source.name}
                    </span>
                  </div>

                  {!isDisabled && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSource(sourceId)}
                      className="rounded p-1 text-zinc-500 transition-colors hover:bg-white/[0.04] hover:text-white"
                      aria-label={`Remove ${source.name}`}
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
      <div className="space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
          Tone
        </h4>

        <RadioGroup
          value={formData.tone}
          onValueChange={(value) =>
            setFormData({ ...formData, tone: value as Tone })
          }
          className="grid grid-cols-1 gap-2"
          disabled={isDisabled}
        >
          {TONE_OPTIONS.map((option) => {
            const isActive = formData.tone === option.value;

            return (
              <Label
                key={option.value}
                htmlFor={option.value}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-3 transition-colors ${
                  isActive
                    ? "border-white/10 bg-white/[0.06]"
                    : "border-white/5 bg-white/[0.03] hover:bg-white/[0.05]"
                } ${isDisabled ? "cursor-not-allowed opacity-70" : ""}`}
              >
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  className="mt-0.5 border-white/20 text-indigo-500 data-checked:border-white data-checked:bg-white"
                  disabled={isDisabled}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-200">
                      {option.label}
                    </span>
                    {option.badge && (
                      <span className="rounded-sm border border-red-500/10 bg-red-500/10 px-1.5 py-0.5 text-[10px] text-red-400">
                        {option.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs leading-5 text-zinc-500">
                    {option.description}
                  </p>
                </div>
              </Label>
            );
          })}
        </RadioGroup>

        <div className="space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
          Scope Rules
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-zinc-300">Allowed Topics</Label>
            <Input
              className="border-white/10 bg-white/[0.03] text-white placeholder:text-zinc-500"
              placeholder="e.g. pricing, refunds"
              value={formData.allowedTopics}
              onChange={(e) =>
                setFormData({ ...formData, allowedTopics: e.target.value })
              }
              disabled={isDisabled}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-zinc-300">Blocked Topics</Label>
            <Input
              className="border-white/10 bg-white/[0.03] text-white placeholder:text-zinc-500"
              placeholder="e.g. competitors"
              value={formData.blockedTopics}
              onChange={(e) =>
                setFormData({ ...formData, blockedTopics: e.target.value })
              }
              disabled={isDisabled}
            />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default SectionFormFields;
