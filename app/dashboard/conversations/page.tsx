"use client";

import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Loader2, Search } from 'lucide-react';
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

  const filteredConversations = conversations.filter(
    (c) =>
        c.user?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-black animate-in fade-in duration-500">
      <div className="w-[350px] md:w-[400px] flex flex-col border-r border-white/5 bg-[#050509]">
        <div className="p-4 border-b border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-white">Inbox</h1>
            <div className="text-xs text-zinc-500">{filteredConversations.length} conversations</div>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search ..."
              className="pl-9 bg-[#0A0A0E] border-white/10 text-sm focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
  <div className="flex flex-col">
    {isLoadingList ? (
  <div className="flex items-center justify-center py-10">
    <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
  </div>
) : filteredConversations.length === 0 ? (
  <div className="text-center py-10 text-zinc-500 text-sm">
    No conversations found
  </div>
) : (
  filteredConversations?.map((conversation) => 
<button
  key={conversation.id}
  onClick={() => setSelectedId(conversation.id)}
  className={cn(
    "flex flex-col items-start gap-2 p-4 text-left transition-colors border-b border-white/5 hover:bg-white/2",
    selectedId === conversation.id
      ? "bg-white/4 border-l-2 border-l-indigo-500 border-b-transparent"
      : "border-l-2 border-l-transparent"
  )}
>
  <div className="flex w-full flex-col gap-1">
  <div className="flex items-center justify-between">
    <span
      className={cn(
        "font-medium text-sm truncate max-w-[180px]",
        selectedId === conversation.id
          ? "text-white"
          : "text-zinc-300"
      )}
    >
      {conversation.user}
    </span>
    <span className="text-[10px] text-zinc-500 shrink-0">
  {conversation.time}
</span>
<span className="text-xs text-zinc-500 line-clamp-1 w-full">
  {conversation.lastMessage}
</span>
  </div>
</div>
</button>
  )
)}
  </div>
</ScrollArea>
      </div>
      <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0e]">

</div>
    </div>
  )
}

export default ConversationPage