"use client";

import { ChevronLeft, Sparkles } from "lucide-react";
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
    kind: "input",
  },
  {
    id: "website-url",
    title: "What is your website URL?",
    description: "We will use this as the primary source of knowledge for your chatbot.",
    placeholder: "https://acme.com",
    field: "websiteUrl",
    kind: "input",
  },
  {
    id: "external-links",
    title: "Any extra links we should learn from?",
    description: "Add docs, FAQs, or Notion links to give your assistant more context.",
    placeholder: "https://docs.acme.com\nhttps://notion.so/your-playbook",
    field: "externalLinks",
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
      setIsSubmitting(true);
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
                {step.kind === "textarea" ? (
                  <textarea
                    ref={inputRef as React.Ref<HTMLTextAreaElement>}
                    value={currentValue}
                    onChange={(event) => updateField(event.target.value)}
                    placeholder={step.placeholder}
                    className="min-h-32 w-full rounded-2xl border border-white/18 bg-black/20 px-5 py-4 text-base text-white outline-none placeholder:text-zinc-600 focus-visible:border-indigo-400/60 focus-visible:ring-3 focus-visible:ring-indigo-500/20"
                  />
                ) : (
                  <input
                    ref={inputRef as React.Ref<HTMLInputElement>}
                    value={currentValue}
                    onChange={(event) => updateField(event.target.value)}
                    placeholder={step.placeholder}
                    className="h-14 w-full rounded-2xl border border-white/18 bg-black/20 px-5 text-base text-white outline-none placeholder:text-zinc-600 focus-visible:border-indigo-400/60 focus-visible:ring-3 focus-visible:ring-indigo-500/20"
                  />
                )}

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
                    className="h-11 rounded-full bg-white px-5 text-sm font-semibold text-black hover:bg-zinc-200 disabled:bg-white/10 disabled:text-zinc-500"
                  >
                    {currentStep === steps.length - 1 ? "Finish setup" : "Continue"}
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
