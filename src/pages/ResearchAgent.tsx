import { useEffect, useRef, useState } from "react";
import { Sparkles, Globe, TrendingUp, Lightbulb, Code, PenSquare, MoreHorizontal } from "lucide-react";
import { useConversation } from "@/hooks/useConversation";
import { ConversationSidebar } from "@/components/research/ConversationSidebar";
import { ChatMessage } from "@/components/research/ChatMessage";
import { ChatInput } from "@/components/research/ChatInput";

const SUGGESTIONS = [
  { icon: TrendingUp, label: "Market analysis", prompt: "Analyze the current state of the AI market in 2026 — key players, trends, and opportunities" },
  { icon: Code, label: "Tech comparison", prompt: "Compare React, Vue, and Svelte in 2026 — performance, ecosystem, and developer experience" },
  { icon: Globe, label: "Industry research", prompt: "What are the biggest trends in renewable energy and climate tech right now?" },
  { icon: Lightbulb, label: "Strategy advice", prompt: "What are the best practices for launching a SaaS product in a competitive market?" },
];

export default function ResearchAgent() {
  const {
    conversations,
    activeConversationId,
    messages,
    isLoading,
    loadConversations,
    loadMessages,
    sendMessage,
    stopGeneration,
    newChat,
    deleteConversation,
  } = useConversation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isHome = messages.length === 0 && !activeConversationId;

  useEffect(() => { loadConversations(); }, [loadConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen flex flex-col bg-background relative">
      <ConversationSidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={(id) => { loadMessages(id); setSidebarOpen(false); }}
        onNew={() => { newChat(); setSidebarOpen(false); }}
        onDelete={deleteConversation}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "md:ml-72" : ""}`}>
        {/* Top bar */}
        <div className="h-12 flex items-center justify-between px-4 pl-14">
          <span className="text-sm font-semibold text-foreground">Mindibly</span>
          <div className="flex items-center gap-1">
            <button
              onClick={newChat}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <PenSquare className="h-4 w-4" />
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {isHome ? (
          /* ===== HOME SCREEN ===== */
          <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
            <div className="mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>

            <h1 className="text-2xl font-semibold mb-1 text-foreground">
              What can I help you research?
            </h1>
            <p className="text-muted-foreground text-sm mb-8">
              AI-powered research, analysis, and insights
            </p>

            <div className="w-full max-w-2xl mb-6">
              <ChatInput onSend={sendMessage} onStop={stopGeneration} isLoading={isLoading} variant="home" />
            </div>

            <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => sendMessage(s.prompt)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border/60 bg-card hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-all hover:shadow-sm"
                >
                  <s.icon className="h-4 w-4 text-primary/70" />
                  {s.label}
                </button>
              ))}
            </div>

            <p className="text-[11px] text-muted-foreground/50 mt-8">
              Responses are AI-generated. Verify important information.
            </p>
          </div>
        ) : (
          /* ===== CHAT VIEW ===== */
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
                {messages.map((msg, i) => (
                  <ChatMessage key={i} message={msg} />
                ))}
                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-primary-foreground animate-pulse" />
                    </div>
                    <div className="flex items-center gap-1 pt-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <ChatInput onSend={sendMessage} onStop={stopGeneration} isLoading={isLoading} />
          </>
        )}
      </div>
    </div>
  );
}
