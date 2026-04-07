"use client";

import React, { useRef, useState } from 'react'

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

interface Conversation {
  id: string;
  user: string;
  lastMessage: string;
  time: string;
  email?: string;
  visitor_ip?: string;
}

const ConversationPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [replyContent, setReplyContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-black animate-in fade-in duration-500">
      <div className="w-[350px] md:w-[400px] flex flex-col border-r border-white/5 bg-[#050509]">
        <div className="p-4 border-b border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-white">Inbox</h1>
            <div className="text-xs text-zinc-500">1 conversations</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConversationPage