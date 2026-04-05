"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import ChatSimulator from "./chatSimulator";
import { useEffect, useRef, useState } from "react";
import AppearanceConfig from "./appearanceConfig";
import EmbedCodeConfig from "./embedCodeConfig";

interface ChatBotMetadata {
  id: string;
  user_email: string;
  color: string;
  welcome_message: string;
  created_at: string;
  source_ids: string[];
}

export default function DashboardChatbotPage() {

  const [metadata, setMetadata] = useState<ChatBotMetadata | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [chatError, setChatError] = useState<string | null>(null);
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  const [primaryColor, setPrimaryColor] = useState("#4f46e5");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const metaRes = await fetch("/api/chatbot/metadata/fetch");
      const metaData = await metaRes.json();
      setMetadata(metaData);

      if (metaData) {
        setPrimaryColor(metaData.color || "#4f46e5");
        setWelcomeMessage(
          metaData.welcome_message || "Hi! How can I help you?"
        );
        setMessages([
          {
            role: "assistant",
            content: metaData.welcome_message || "Hi! How can I help you?",
            isWelcome: true,
            section: null,
          },
        ]);
      }
      const sectionsRes = await fetch("/api/section/fetch");
      if (sectionsRes.ok) {
        const sectionsData = await sectionsRes.json();
        setSections(sectionsData || []);
      }
    } catch (error) {
      console.error("Error fetching chatbot data:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

const getFriendlyChatErrorMessage = (error: unknown) => {
  const message = error instanceof Error ? error.message : "";

  if (/quota|billing|429/i.test(message)) {
    return "Chat is temporarily unavailable because the AI usage limit has been reached. Please try again later or update the API billing.";
  }

  if (/unauthorized|401/i.test(message)) {
    return "Your session expired. Please sign in again to continue chatting.";
  }

  return "I couldn't get a response just now. Please try again in a moment.";
};

const handleInputChange = (value: string) => {
  if (chatError) {
    setChatError(null);
  }

  setInput(value);
};

const handleSend = async () => {
  const trimmedInput = input.trim();

  if (!trimmedInput || !activeSection || isTyping) {
    return;
  }

  setChatError(null);

  const currentSection = sections.find((s) => s.name === activeSection);
  const sourceIds = Array.isArray(currentSection?.source_ids)
    ? currentSection.source_ids
    : [];

  const userMsg = {
    role: "user",
    content: trimmedInput,
    section: activeSection,
  };
  const requestMessages = [...messages, userMsg].map(({ role, content }) => ({
    role,
    content,
  }));

  setMessages((prev) => [...prev, userMsg]);
  setInput("");
  setIsTyping(true);

  try {
    const res = await fetch('/api/chat/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: requestMessages,
        knowledge_source_ids: sourceIds
      })
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
      { role: "assistant", content: data.response, section: null },
    ]);
  } catch (error) {
    setChatError(getFriendlyChatErrorMessage(error));
  } finally {
    setIsTyping(false);
  }

};

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSectionClick = async (sectionName: string) => {
    setChatError(null);
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
  
  const handleReset = async () => {
    setChatError(null);
    setActiveSection(null);
    setMessages([
      {
        role: "assistant",
        content: welcomeMessage,
        isWelcome: true,
        section: null,
      },
    ]);
  };

const handleSave = async () => {
  setIsSaving(true);
  try {
    const res = await fetch("/api/chatbot/metadata/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        color: primaryColor,
        welcome_message: welcomeMessage,
      }),
    });

    if (res.ok) {
      const updated = await res.json();
      setMetadata(updated);
    } else {
      console.error("Failed to save changes");
    }
  } catch (error) {
    console.error("Failed to save:", error);
  } finally {
    setIsSaving(false);
  }
};

  const hasChanges = metadata
  ? primaryColor !== (metadata.color || "#4f46e5") ||
    welcomeMessage !== (metadata.welcome_message || "Hi! How can I help you?")
  : false;

  if (loading) {
    return (
      <div className="p-8 text-zinc-500">Loading chatbot configuration...</div>
    );
  }

  return (
    <div className="mx-auto box-border flex h-[calc(100vh-1px)] min-h-0 max-w-7xl animate-in flex-col gap-8 overflow-hidden p-6 fade-in duration-500 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Chatbot Playground
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Test your assistant, customize appearance, and deploy it.
        </p>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="flex min-h-0 flex-col space-y-4 lg:col-span-7">
          <ChatSimulator
            messages={messages}
            primaryColor={primaryColor}
            sections={sections}
            input={input}
            setInput={handleInputChange}
            handleSend={handleSend}
            handleKeyDown={handleKeyDown}
            handleSectionClick={handleSectionClick}
            activeSection={activeSection}
            isTyping={isTyping}
            chatError={chatError}
            handleReset={handleReset}
            scrollRef={scrollViewportRef}
          />
        </div>
        <div className="lg:col-span-5 h-full min-h-0 overflow-hidden flex flex-col">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-6 pb-8">
              <AppearanceConfig
                primaryColor={primaryColor}
                setPrimaryColor={setPrimaryColor}
                welcomeMessage={welcomeMessage}
                setWelcomeMessage={setWelcomeMessage}
                handleSave={handleSave}
                isSaving={isSaving}
                hasChanges={hasChanges}
              />
              <EmbedCodeConfig chatbotId={metadata?.id} />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
