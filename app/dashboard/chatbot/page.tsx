"use client";

import ChatSimulator from "./chatSimulator";
import { useEffect, useRef, useState } from "react";

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
      const sectionsRes = await fetch("/api/sections/fetch");
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

  const handleSend = async () => {};
  const handleKeyDown = async () => {};
  const handleSectionClick = async () => {};
  const handleReset = async () => {};



  return (
    <div className="mx-auto max-w-7xl animate-in space-y-8 p-6 fade-in duration-500 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Chatbot Playground
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Test your assistant, customize appearance, and deploy it.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0">
        <div className="lg:col-span-7 flex flex-col h-full min-h-0 space-y-4">
          <ChatSimulator
            messages={messages}
            primaryColor={primaryColor}
            sections={sections}
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            handleKeyDown={handleKeyDown}
            handleSectionClick={handleSectionClick}
            activeSection={activeSection}
            isTyping={isTyping}
            handleReset={handleReset}
            scrollRef={scrollViewportRef}
          />
        </div>
      </div>
    </div>
  );
}
