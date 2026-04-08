"use client";

import Image from "next/image";
import {
  type KeyboardEvent,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from "react";
import { Loader2, MoreHorizontal, Search, Send, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type MessageRole = "user" | "assistant";

interface Message {
  id: string;
  role: MessageRole | string;
  content: string;
  created_at: string | null;
}

interface Conversation {
  id: string;
  user: string | null;
  lastMessage: string;
  time: string;
  visitor_ip?: string | null;
}

interface ConversationsResponse {
  conversations?: Conversation[];
  error?: string;
}

interface MessagesResponse {
  messages?: Message[];
  error?: string;
}

interface ReplyResponse {
  success?: boolean;
  error?: string;
}

async function requestJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(input, init);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      typeof errorData?.error === "string"
        ? errorData.error
        : "Request failed."
    );
  }

  return response.json() as Promise<T>;
}

async function fetchConversationsData() {
  const data = await requestJson<ConversationsResponse>("/api/conversations");
  return Array.isArray(data.conversations) ? data.conversations : [];
}

async function fetchConversationMessages(conversationId: string) {
  const data = await requestJson<MessagesResponse>(
    `/api/conversations/${conversationId}/messages`
  );
  return Array.isArray(data.messages) ? data.messages : [];
}

async function postConversationReply(conversationId: string, content: string) {
  await requestJson<ReplyResponse>(`/api/conversations/${conversationId}/reply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
}

function getConversationLabel(name: string | null | undefined) {
  const trimmed = name?.trim();
  return trimmed ? trimmed : "Visitor";
}

function getConversationCountLabel(count: number) {
  return `${count} conversation${count === 1 ? "" : "s"}`;
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

function formatMessageTime(createdAt: string | null) {
  if (!createdAt) {
    return "";
  }

  return new Date(createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ConversationListItem({
  conversation,
  isActive,
  onSelect,
}: {
  conversation: Conversation;
  isActive: boolean;
  onSelect: (conversationId: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(conversation.id)}
      className={cn(
        "group w-full border-l-2 px-5 py-4 text-left transition-all duration-200",
        isActive
          ? "border-l-[#6172ff] bg-[linear-gradient(90deg,rgba(97,114,255,0.18),rgba(97,114,255,0.03))]"
          : "border-l-transparent hover:bg-white/[0.03]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className={cn(
              "truncate text-base font-semibold tracking-tight",
              isActive ? "text-white" : "text-zinc-200"
            )}
          >
            #{getConversationLabel(conversation.user)}
          </p>
          <p className="mt-1 truncate text-sm text-zinc-500">
            {conversation.lastMessage || "Started conversation"}
          </p>
        </div>
        <span className="shrink-0 pt-0.5 text-xs text-zinc-500">
          {conversation.time || "Now"}
        </span>
      </div>
    </button>
  );
}

function ThreadMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const messageTime = formatMessageTime(message.created_at);

  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex max-w-[88%] items-start gap-3 md:max-w-[72%]",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        {isUser ? (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.06]">
            <User className="size-4 text-zinc-300" />
          </div>
        ) : (
          <div className="relative mt-0.5 shrink-0">
            <Image
              src="/chatbot_profile.png"
              alt="Support Agent"
              width={40}
              height={40}
              className="size-10 rounded-full object-cover"
            />
            <div className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-[#06070a] bg-emerald-400" />
          </div>
        )}

        <div className={cn("flex flex-col", isUser ? "items-end" : "items-start")}>
          <div
            className={cn(
              "rounded-[24px] px-5 py-4 text-[15px] leading-7 shadow-[0_18px_50px_rgba(0,0,0,0.24)]",
              isUser
                ? "rounded-tr-md bg-[#313139]/92 text-zinc-100"
                : "rounded-tl-md border border-white/[0.08] bg-[#09090d]/95 text-zinc-200"
            )}
          >
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          </div>
          <span className="px-1 pt-2 text-[10px] text-zinc-600">
            {messageTime}
          </span>
        </div>
      </div>
    </div>
  );
}

function ThreadLoadingState({ label }: { label: string }) {
  return (
    <div className="flex min-h-[260px] items-center justify-center">
      <div className="flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-3 text-sm text-zinc-400">
        <Loader2 className="size-4 animate-spin" />
        <span>{label}</span>
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-md text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
        <User className="size-6 text-zinc-400" />
      </div>
      <h2 className="mt-5 text-xl font-semibold tracking-tight text-white">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-zinc-500">{description}</p>
    </div>
  );
}

export default function ConversationPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [replyContent, setReplyContent] = useState("");

  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [listError, setListError] = useState<string | null>(null);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [replyError, setReplyError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadConversations() {
      setIsLoadingList(true);
      setListError(null);

      try {
        const data = await fetchConversationsData();
        if (!cancelled) {
          setConversations(data);
        }
      } catch (error) {
        if (!cancelled) {
          setConversations([]);
          setListError(
            getErrorMessage(error, "Failed to load conversations.")
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingList(false);
        }
      }
    }

    void loadConversations();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (conversations.length === 0) {
      setSelectedId(null);
      return;
    }

    const hasSelectedConversation = conversations.some(
      (conversation) => conversation.id === selectedId
    );

    if (!selectedId || !hasSelectedConversation) {
      setSelectedId(conversations[0].id);
    }
  }, [conversations, selectedId]);

  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      setMessagesError(null);
      return;
    }

    const conversationId = selectedId;
    let cancelled = false;

    async function loadMessages() {
      setIsLoadingMessages(true);
      setMessagesError(null);

      try {
        const data = await fetchConversationMessages(conversationId);
        if (!cancelled) {
          setMessages(data);
        }
      } catch (error) {
        if (!cancelled) {
          setMessages([]);
          setMessagesError(
            getErrorMessage(error, "Failed to load this conversation.")
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingMessages(false);
        }
      }
    }

    void loadMessages();

    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: isSending ? "smooth" : "auto",
        block: "end",
      });
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [messages, isLoadingMessages, isSending, selectedId]);

  const normalizedQuery = deferredSearchQuery.trim().toLowerCase();
  const filteredConversations = conversations.filter((conversation) => {
    if (!normalizedQuery) {
      return true;
    }

    return [conversation.user, conversation.lastMessage, conversation.visitor_ip]
      .filter(Boolean)
      .some((value) =>
        value?.toLowerCase().includes(normalizedQuery)
      );
  });

  const selectedConversation =
    conversations.find((conversation) => conversation.id === selectedId) ?? null;

  const canSend =
    Boolean(selectedId) && replyContent.trim().length > 0 && !isSending;

  const handleSendReply = async () => {
    const trimmedReply = replyContent.trim();
    const conversationId = selectedId;

    if (!conversationId || !trimmedReply || isSending) {
      return;
    }

    const optimisticMessage: Message = {
      id: `local-${Date.now()}`,
      role: "assistant",
      content: trimmedReply,
      created_at: new Date().toISOString(),
    };

    const previousMessages = messages;
    const previousConversations = conversations;

    setReplyError(null);
    setIsSending(true);
    setReplyContent("");
    setMessages((currentMessages) => [...currentMessages, optimisticMessage]);
    setConversations((currentConversations) =>
      currentConversations.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              lastMessage: trimmedReply,
              time: "Just now",
            }
          : conversation
      )
    );

    try {
      await postConversationReply(conversationId, trimmedReply);
    } catch (error) {
      setMessages(previousMessages);
      setConversations(previousConversations);
      setReplyContent(trimmedReply);
      setReplyError(getErrorMessage(error, "Failed to send reply."));
    } finally {
      setIsSending(false);
    }
  };

  const handleReplyKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSendReply();
    }
  };

  return (
    <div className="flex h-screen min-h-0 flex-col overflow-hidden bg-[#050509] md:flex-row">
      <section className="flex min-h-[300px] w-full flex-col border-b border-white/[0.06] bg-[#050509] md:min-h-0 md:w-[380px] md:max-w-[420px] md:border-b-0 md:border-r">
        <div className="border-b border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent)] px-5 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-[1.75rem] font-semibold tracking-tight text-white">
                Inbox
              </h1>
            </div>
            <div className="text-sm text-zinc-500">
              {getConversationCountLabel(conversations.length)}
            </div>
          </div>

          <div className="relative mt-5">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search..."
              className="h-12 rounded-2xl border-white/[0.08] bg-[#0a0a0f] pl-11 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] placeholder:text-zinc-500 focus-visible:border-white/[0.12] focus-visible:ring-white/10"
            />
          </div>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <div className="py-2">
            {isLoadingList ? (
              <ThreadLoadingState label="Loading conversations..." />
            ) : listError ? (
              <div className="px-5 py-10 text-center text-sm text-rose-300">
                {listError}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-zinc-500">
                No conversations match your search.
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <ConversationListItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={selectedId === conversation.id}
                  onSelect={setSelectedId}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </section>

      <section className="flex min-h-0 flex-1 flex-col bg-[#06070a]">
        {selectedConversation ? (
          <>
            <div className="flex h-[72px] items-center justify-between border-b border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] px-5 md:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.05]">
                  <User className="size-4 text-zinc-300" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-lg font-semibold tracking-tight text-white">
                      #{getConversationLabel(selectedConversation.user)}
                    </h2>
                    {selectedConversation.visitor_ip ? (
                      <span className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[11px] font-medium text-zinc-500">
                        {selectedConversation.visitor_ip}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-zinc-500">
                    Live conversation thread
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-xl border border-transparent text-zinc-400 hover:border-white/[0.08] hover:bg-white/[0.04] hover:text-white"
                aria-label="Conversation actions"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </div>

            <ScrollArea className="min-h-0 flex-1">
              <div className="relative min-h-full">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(89,102,255,0.08),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.035),transparent_22%),linear-gradient(180deg,#07080b_0%,#050509_100%)]" />

                <div className="relative mx-auto flex min-h-full w-full max-w-6xl flex-col px-4 py-6 md:px-8 md:py-8">
                  {isLoadingMessages ? (
                    <ThreadLoadingState label="Loading messages..." />
                  ) : messagesError ? (
                    <div className="flex min-h-[260px] items-center justify-center">
                      <p className="text-sm text-rose-300">{messagesError}</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center py-20">
                      <EmptyState
                        title="No messages yet"
                        description="This conversation is empty right now. When a visitor writes in, the thread will appear here."
                      />
                    </div>
                  ) : (
                    <div className="space-y-6 pb-6">
                      {messages.map((message) => (
                        <ThreadMessage key={message.id} message={message} />
                      ))}
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </ScrollArea>

            <div className="border-t border-white/[0.06] bg-[#090a0d]/95 px-4 py-4 md:px-6">
              <div className="mx-auto w-full max-w-6xl">
                {replyError ? (
                  <p className="mb-3 text-sm text-rose-300">{replyError}</p>
                ) : null}

                <div className="relative rounded-[28px] border border-white/[0.08] bg-[#121318] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-colors focus-within:border-white/[0.14] focus-within:ring-2 focus-within:ring-white/10">
                  <Textarea
                    rows={1}
                    value={replyContent}
                    onChange={(event) => setReplyContent(event.target.value)}
                    onKeyDown={handleReplyKeyDown}
                    placeholder="Write a reply..."
                    className="min-h-0 max-h-32 resize-none border-0 bg-transparent px-0 py-1 pr-16 text-[15px] leading-6 text-white placeholder:text-zinc-500 focus-visible:ring-0"
                  />

                  <Button
                    type="button"
                    size="icon"
                    onClick={() => void handleSendReply()}
                    disabled={!canSend}
                    className={cn(
                      "absolute right-3 top-1/2 size-11 -translate-y-1/2 rounded-2xl border border-white/[0.08] shadow-[0_10px_24px_rgba(0,0,0,0.26)] transition-all",
                      canSend
                        ? "bg-[#5f6dff] text-white hover:brightness-110"
                        : "bg-[#24252d] text-zinc-500"
                    )}
                    aria-label="Send reply"
                  >
                    {isSending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Send className="size-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center px-6">
            <EmptyState
              title="Select a conversation"
              description="Choose a thread from the inbox to view the full conversation and send replies."
            />
          </div>
        )}
      </section>
    </div>
  );
}
