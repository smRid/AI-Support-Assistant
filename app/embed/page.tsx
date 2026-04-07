'use client'

import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { AlertCircle, ChevronDown, MessageCircle, Send } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'

interface ChatBotMetadata {
  id: string;
  color: string;
  welcome_message: string;
}

interface Section {
  id: string;
  name: string;
  source_ids: string[];
}

const EmbedPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [metadata, setMetadata] = useState<ChatBotMetadata | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  document.body.style.backgroundColor = "transparent";
  document.documentElement.style.backgroundColor = "transparent";

    if (typeof window !== undefined) {
    window.parent.postMessage(
        {
        type: "resize",
        width: "60px",
        height: "60px",
        borderRadius: "30px",
        },
        "*"
    );
    }

  }, [])

  const toggleOpen = () => {
    const newState = !isOpen;
    setIsOpen(newState);

    if (newState) {
    window.parent.postMessage(
        {
        type: "resize",
        width: "380px",
        height: "520px",
        borderRadius: "12px",
        },
        "*"
    );
    }else {
        window.parent.postMessage(
            { type: "resize", width: "60px", height: "60px", borderRadius: "30px" },
            "*"
        );
    }
    }

    useEffect(() => {
  if (!token) {
    setError("Missing session token");
    setLoading(false);
    return;
  }
  const fetchConfig = async () => {
  try {
    const res = await fetch(`/api/widget/config?token=${token}`);
    if (!res.ok) throw new Error("Failed to load widget configuration");

    const data = await res.json();
    setMetadata(data.metadata);
    setSections(data.sections || []);

    // Initialize Chat
    setMessages([
      {
        role: "assistant",
        content: data.metadata.welcome_message || "Hi! How can I help you?",
        isWelcome: true,
        section: null,
      },
    ]);
  } catch (err) {
    console.error(err);
    setError("Unable to load chat. Please try again later.");
  } finally {
    setLoading(false);
  }
};

fetchConfig();

}, [])

const handleSectionClick = (sectionName: string) => {
  setActiveSection(sectionName);
  const userMsg = { role: "user", content: sectionName, section: null };
  setMessages((prev) => [...prev, userMsg]);
  setInput("");
  setIsTyping(true);

  setTimeout(() => {
  setIsTyping(false);
  const aiMsg = {
    role: "assistant",
    content: `You can ask me any question related to "${sectionName}"`,
    section: sectionName,
  };
  setMessages((prev) => [...prev, aiMsg]);
}, 800);

};

useEffect(() => {
  if (scrollViewportRef.current) {
    scrollViewportRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [messages, isTyping, isOpen]); // Scroll when opened too

const handleSend = async () => {
  const trimmedInput = input.trim();
  const selectedSectionName =
    activeSection ?? (sections.length === 1 ? sections[0].name : null);
  const shouldPickTopicFirst = sections.length > 1 && !selectedSectionName;

  if (!trimmedInput || isTyping || shouldPickTopicFirst || !token) {
    return;
  }

  const currentSection = sections.find(
    (section) => section.name === selectedSectionName
  );
  const sourceIds = Array.isArray(currentSection?.source_ids)
    ? currentSection.source_ids
    : [];

  const userMsg = {
    role: "user",
    content: trimmedInput,
    section: selectedSectionName,
  };
  const requestMessages = [...messages, userMsg].map(({ role, content }) => ({
    role,
    content,
  }));

  setMessages((prev) => [...prev, userMsg]);
  setInput("");
  setIsTyping(true);

  try {
    const res = await fetch("/api/widget/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        messages: requestMessages,
        knowledge_source_ids: sourceIds,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(
        typeof errorData?.error === "string"
          ? errorData.error
          : "Failed to generate response"
      );
    }

    const data = await res.json();
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          typeof data.response === "string" && data.response.trim()
            ? data.response
            : "I'm sorry, I couldn't generate a response.",
        section: selectedSectionName,
      },
    ]);
  } catch (err) {
    console.error("Widget chat error:", err);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "I'm sorry, I couldn't respond just now. Please try again.",
        section: selectedSectionName,
      },
    ]);
  } finally {
    setIsTyping(false);
  }

}

const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
};

const primaryColor = metadata?.color || "#4f46e5";
const visibleSections =
  sections.length > 0
    ? sections
    : [{ id: "fallback-faq", name: "FAQ", source_ids: [] }];
const resolvedSectionName =
  activeSection ?? (sections.length === 1 ? sections[0].name : null);
const shouldPickTopicFirst = sections.length > 1 && !resolvedSectionName;
const canSend = !isTyping && input.trim().length > 0 && !shouldPickTopicFirst;

if(loading) return null;
if(error && isOpen){
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white/5 backdrop-blur-sm">
      <AlertCircle className="w-10 h-10 mb-2" />
      <p>{error}</p>
    </div>
  );
}

if (!isOpen) {
  return (
    <button
      onClick={toggleOpen}
      className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:brightness-110 transition-all text-white"
      style={{ backgroundColor: primaryColor }}
    >
      <MessageCircle className="w-8 h-8" />
    </button>
  );
}

return (
  <div className="flex flex-col h-screen bg-[#0A0A0E] overflow-hidden rounded-xl border border-white/10 shadow-2xl">
    <div className="z-20 flex h-16 items-center justify-between border-b border-white/5 bg-[#0E0E12] px-5 shadow-sm shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <Image
            src="/chatbot_profile.png"
            alt="Support Agent"
            className="h-10 w-10 rounded-full object-cover"
            width={40}
            height={40}
          />
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0E0E12] bg-emerald-500"></div>
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-sm font-semibold leading-none text-white">
            Support
          </h1>
          <span className="mt-1 text-xs font-medium leading-none text-emerald-400">
            Online
          </span>
        </div>
      </div>

      <button
        onClick={toggleOpen}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
        aria-label="Minimize Chat"
      >
        <ChevronDown className="h-5 w-5" />
      </button>
    </div>
    <div className="min-h-0 flex-1 overflow-y-auto bg-zinc-950/30 px-4 py-5">
      <div className="space-y-5 pb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex w-full",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "flex max-w-[88%] items-start gap-3",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              {msg.role !== "user" ? (
                <div className="relative mt-0.5 shrink-0">
                  <Image
                    src="/chatbot_profile.png"
                    alt="Support Agent"
                    className="h-8 w-8 rounded-full object-cover"
                    width={40}
                    height={40}
                  />
                  <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0A0A0E] bg-emerald-500"></div>
                </div>
              ) : null}

              <div className="space-y-2">
                <div
                  className={cn(
                    "w-fit max-w-[240px] rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                    msg.role === "user"
                      ? "rounded-tr-md bg-zinc-800 text-zinc-100"
                      : "rounded-tl-md bg-white text-zinc-900"
                  )}
                >
                  {msg.content}
                </div>
                {msg.isWelcome && visibleSections.length > 0 && (
                  <div className="ml-1 flex flex-wrap items-center gap-2 pt-1">
                    {visibleSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => handleSectionClick(section.name)}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-white/15 hover:bg-white/[0.06] hover:text-white"
                      >
                        {section.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
  <div className="flex w-full justify-start">
    <div className="flex max-w-[85%] gap-3 flex-row">
      <div className="relative mt-0.5 shrink-0">
        <Image
          src="/chatbot_profile.png"
          alt="Support Agent"
          className="h-8 w-8 rounded-full object-cover"
          width={40}
          height={40}
        />
        <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0A0A0E] bg-emerald-500"></div>
      </div>

      <div className="space-y-2">
        <div className="w-fit max-w-[240px] rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-sm bg-white text-zinc-900 rounded-tl-md">
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-400"></div>
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-400 delay-75"></div>
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-400 delay-150"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
        <div ref={scrollViewportRef} />
      </div>
    </div>
    <div className="border-t border-white/5 bg-[#0E0E12] p-4 shrink-0 z-10">
      <div className="relative rounded-2xl border border-white/10 bg-[#141418] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-colors focus-within:border-white/20 focus-within:ring-2 focus-within:ring-white/10">
        <Textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            shouldPickTopicFirst ? "Select a topic above..." : "Type a message..."
          }
          className="min-h-0 max-h-[120px] resize-none overflow-y-auto border-0 bg-transparent px-0 py-0 pr-16 text-[15px] leading-6 text-white placeholder:text-zinc-500 focus-visible:border-0 focus-visible:ring-0"
        />
        <button
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
          className={cn(
            "absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border transition-all disabled:opacity-100",
            !canSend
              ? "border-white/10 bg-[#24242b] text-zinc-500"
              : "border-white/10 text-white shadow-[0_8px_24px_rgba(0,0,0,0.28)] hover:scale-[1.02] hover:brightness-110"
          )}
          style={
            canSend
              ? { backgroundColor: primaryColor, color: "white" }
              : undefined
          }
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-2 text-center">
  <Link
    href={"/"}
    className="text-[10px] text-zinc-600 font-medium hover:text-zinc-500 transition-colors"
  >
    Powered by Arena AI
  </Link>
</div>
    </div>
  </div>
);
};

export default EmbedPage;
