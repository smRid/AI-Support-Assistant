"use client";

import {
  ArrowRight,
  Building2,
  ChevronLeft,
  Globe,
  LinkIcon,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FormData = {
  businessName: string;
  websiteUrl: string;
  externalLinks: string;
};

type Step = {
  id: string;
  title: string;
  description: string;
  placeholder: string;
  field: keyof FormData;
  icon: LucideIcon;
  kind: "input" | "textarea";
  optional?: boolean;
};

const steps: Step[] = [
  {
    id: "business-name",
    title: "What is the name of your business?",
    description: "This will be the identity of your Organization.",
    placeholder: "Acme Inc.",
    field: "businessName",
    icon: Building2,
    kind: "input",
  },
  {
    id: "website-url",
    title: "What is your website URL?",
    description: "We will use this as the primary source of knowledge for your chatbot.",
    placeholder: "https://acme.com",
    field: "websiteUrl",
    icon: Globe,
    kind: "input",
  },
  {
    id: "external-links",
    title: "Any extra links we should learn from?",
    description: "Add docs, FAQs, or Notion links to give your assistant more context.",
    placeholder: "https://docs.acme.com\nhttps://notion.so/your-playbook",
    field: "externalLinks",
    icon: LinkIcon,
    kind: "textarea",
    optional: true,
  },
];

export default function InitialForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    websiteUrl: "",
    externalLinks: "",
  });

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const step = steps[currentStep];
  const StepIcon = step.icon;
  const progress = useMemo(
    () => ((currentStep + 1) / steps.length) * 100,
    [currentStep],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 120);

    return () => window.clearTimeout(timeoutId);
  }, [currentStep]);

  const currentValue = formData[step.field];
  const canContinue =
    step.optional || currentValue.trim().length > 0;

  const updateField = (value: string) => {
    setFormData((previous) => ({
      ...previous,
      [step.field]: value,
    }));
  };

  const goNext = () => {
    if (!canContinue || isSubmitting) {
      return;
    }

    if (currentStep === steps.length - 1) {
      void handleSubmit();
      return;
    }

    setCurrentStep((previous) => previous + 1);
  };

  const goBack = () => {
    if (currentStep === 0 || isSubmitting) {
      return;
    }

    setCurrentStep((previous) => previous - 1);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/metadata/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          business_name: formData.businessName,
          website_url: formData.websiteUrl,
          external_links: formData.externalLinks,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to store metadata.");
      }

      await response.json();
      window.location.reload();
    } catch (error) {
      console.error("Metadata submit error:", error);
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (step.kind === "textarea") {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        goNext();
      }

      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      goNext();
    }
  };

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#050509] px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.22),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_24%)]" />

      <div className="absolute inset-x-0 top-0 h-1 bg-white/10">
        <div
          className="h-full bg-indigo-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="absolute right-6 top-8 text-[11px] uppercase tracking-[0.24em] text-zinc-500 md:right-10">
        Setup your account
      </div>

      <div className="relative z-10 w-full max-w-xl">
        {isSubmitting ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
            <div className="mb-8 rounded-3xl border border-indigo-400/20 bg-indigo-500/10 p-5">
              <Sparkles className="size-8 text-indigo-300" />
            </div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">
              Almost there
            </p>
            <h1 className="mb-4 text-3xl font-medium tracking-tight text-white md:text-4xl">
              Your workspace is being prepared
            </h1>
            <p className="max-w-md text-base text-zinc-400">
              We saved your onboarding details. You can connect the next steps when you build the dashboard flow.
            </p>
          </div>
        ) : (
          <div className="rounded-[28px] border border-white/8 bg-white/[0.02] px-6 py-8 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm md:px-10 md:py-12">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={goBack}
                  className={cn(
                    "rounded-full border border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06] hover:text-white",
                    currentStep === 0 && "invisible",
                  )}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="rounded-full border border-indigo-400/15 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>
              {step.optional ? (
                <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Optional
                </span>
              ) : null}
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <h1 className="max-w-lg text-4xl font-medium leading-tight tracking-tight text-white md:text-5xl">
                  {step.title}
                </h1>
                <p className="max-w-xl text-lg leading-8 text-zinc-400">
                  {step.description}
                </p>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  {step.kind === "textarea" ? (
                    <textarea
                      ref={inputRef as React.Ref<HTMLTextAreaElement>}
                      value={currentValue}
                      onChange={(event) => updateField(event.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={step.placeholder}
                      className="min-h-32 w-full rounded-2xl border border-white/18 bg-black/20 px-5 py-4 pr-14 text-base text-white outline-none placeholder:text-zinc-600 focus-visible:border-indigo-400/60 focus-visible:ring-3 focus-visible:ring-indigo-500/20"
                    />
                  ) : (
                    <input
                      ref={inputRef as React.Ref<HTMLInputElement>}
                      type={step.field === "websiteUrl" ? "url" : "text"}
                      value={currentValue}
                      onChange={(event) => updateField(event.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={step.placeholder}
                      className="h-auto w-full rounded-none border-0 border-b border-white/10 bg-transparent py-4 pr-12 text-xl text-white outline-none placeholder:text-zinc-500 transition-colors focus-visible:border-indigo-500 focus-visible:ring-0 md:text-2xl"
                      autoFocus
                    />
                  )}
                  <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-zinc-600">
                    <StepIcon className="h-6 w-6" />
                  </div>
                </div>

                {/* <div className="flex items-center justify-between pt-8">
                    <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-600">
                    {step.kind === "textarea" ? (
                    <>
                        <Command className="w-3 h-3" />
                        <span>+ Enter</span>
                    </>
                    ) : (
                    <span>Press Enter ↵</span>
                    )}
                    <span className="ml-1">to continue</span>
                </div>
                </div> */}

                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-zinc-500">
                    {currentStep === steps.length - 1
                      ? "You can change these details later from the dashboard settings."
                      : "Press Enter to continue through the setup flow."}
                  </p>

                  <Button
                    type="button"
                    onClick={goNext}
                    disabled={!canContinue}
                    className={cn(
                      "h-12 rounded-full px-6 text-sm font-medium transition-all duration-300",
                      !canContinue
                        ? "bg-zinc-800 text-zinc-500 hover:bg-zinc-800 cursor-not-allowed"
                        : "bg-white text-black hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/10",
                    )}
                  >
                    {currentStep === steps.length - 1 ? "Submit" : "Continue"}
                    {currentStep === steps.length - 1 ? (
                      <Sparkles className="ml-2 h-4 w-4" />
                    ) : (
                      <ArrowRight className="ml-2 h-4 w-4" />
                    )}
                  </Button>

                  
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
