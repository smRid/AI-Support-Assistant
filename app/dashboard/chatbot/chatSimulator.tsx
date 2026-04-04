import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, RefreshCw, Send, User } from 'lucide-react';
import React, { RefObject } from 'react'
import { cn } from '@/lib/utils';

interface ChatSimulatorProps {
  messages: any[];
  primaryColor: string;
  sections: Section[];
  input: string;
  setInput: (val: string) => void;
  handleSend: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleSectionClick: (name: string) => void;
  activeSection: string | null;
  isTyping: boolean;
  handleReset: () => void;
  scrollRef: RefObject<HTMLDivElement | null>;
}

const ChatSimulator = ({messages,
  primaryColor,
  sections,
  input,
  setInput,
  handleSend,
  handleKeyDown,
  handleSectionClick,
  activeSection,
  isTyping,
  handleReset,
  scrollRef}: ChatSimulatorProps) => {
  const displayMessages =
    messages.length > 0
      ? messages
      : [
          {
            role: "assistant",
            content: "Hi there, How can I help you today?",
          },
        ];

  return (
    <Card className="relative flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border-white/5 bg-[#0A0A0E] shadow-2xl">
        <div className="flex h-14 items-center justify-between border-b border-white/5 bg-[#121216] px-6">
            <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-zinc-300">Test Environment</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-zinc-500 hover:text-zinc-300">
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
                Reset
            </Button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col bg-[#0A0A0E]">
            <ScrollArea className="min-h-0 flex-1 overflow-hidden">
  <div className="space-y-6 px-5 py-6">
    {displayMessages.map((msg, i) => (
      <div
        key={i}
        className={cn(
          "flex w-full flex-col",
          msg.role === "user" ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "flex max-w-[80%] gap-3",
            msg.role === "user" ? "flex-row-reverse" : "flex-row"
          )}
        >
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/5",
              msg.role === "user" ? "bg-zinc-800" : "text-white"
            )}
            style={
              msg.role !== "user" ? { backgroundColor: primaryColor } : {}
            }
          >
            {msg.role === "user" ? (
              <User className="w-4 h-4 text-zinc-400" />
            ) : (
              <Bot className="w-4 h-4 text-white" />
            )}
          </div>

            <div className="space-y-2">
              <div
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                  msg.role === "user"
                    ? "rounded-tr-sm bg-zinc-800 text-zinc-200"
                    : "rounded-tl-sm bg-white text-zinc-900"
                )}
              >
                {msg.content}
              </div>
              {msg.isWelcome && sections.length > 0 ? (
                <div className="ml-1 flex flex-wrap gap-2 pt-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => handleSectionClick(section.name)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs transition-colors",
                        activeSection === section.name
                          ? "border-white/15 bg-white/10 text-white"
                          : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200"
                      )}
                    >
                      {section.name}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
        </div>
      </div>
    ))}
    {isTyping && (
      <div className="flex w-full items-start">
        <div className="flex max-w-[80%] gap-3">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: primaryColor }}
          >
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-zinc-900 shadow-sm">
            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />
          </div>
        </div>
      </div>
    )}
    <div ref={scrollRef} />
  </div>
</ScrollArea>

<div className="border-t border-white/5 bg-[#0E0E12] p-4">
  <div className="relative rounded-2xl border border-white/5 bg-[#121216]">
    <Textarea
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={handleKeyDown}
      disabled={!activeSection}
      placeholder={
        activeSection
          ? "Type a message..."
          : "Please select a category above to start..."
      }
      className="min-h-[72px] max-h-[160px] resize-none border-0 bg-transparent px-5 py-5 pr-16 text-sm text-white placeholder:text-zinc-500 focus-visible:border-0 focus-visible:ring-0"
    />
    <Button
  size="icon"
  onClick={handleSend}
  disabled={!activeSection || !input.trim()}
  className={cn(
    "absolute right-4 bottom-4 h-8 w-8 rounded-xl border border-white/5 transition-colors",
    !activeSection || !input.trim()
      ? "bg-zinc-800/80 text-zinc-500"
      : "text-white shadow-lg"
  )}
  style={
    activeSection && input.trim()
      ? { backgroundColor: primaryColor, color: "white" }
      : {}
  }
>
  <Send className="w-4 h-4" />
</Button>
  </div>
</div>
        </div>
    </Card>
  )
}

export default ChatSimulator
