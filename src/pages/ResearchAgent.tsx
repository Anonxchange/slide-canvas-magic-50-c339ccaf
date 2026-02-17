Let’s fix it import { useEffect, useRef } from "react";
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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isHome = messages.length === 0 && !activeConversationId;

  useEffect(() => { 
    loadConversations(); 
  }, [loadConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen flex bg-background font-sans">
      
      {/* Sidebar Always Visible */}
      <ConversationSidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={(id) => loadMessages(id)}
        onNew={newChat}
        onDelete={deleteConversation}
      />

      <div className="flex-1 flex flex-col overflow-hidden h-screen">
        
        {/* Top bar */}
        <div className="h-14 flex items-center justify-between px-6 shrink-0 bg-background z-20 sticky top-0 border-b">
          {/* Adjusted spacing from sidebar */}
          <span className="text-lg font-semibold text-foreground ml-6">
            Mindibly
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={newChat}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <PenSquare className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>

        {isHome ? (
          /* ===== HOME SCREEN ===== */
          <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 overflow-y-auto min-h-0">
            <div className="mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
                <Sparkles className="w-7 h-7 text-primary-foreground" />
              </div>
            </div>

            <h1 className="text-2xl font-bold mb-1 text-foreground">
              What can I help you research?
            </h1>
            <p className="text-muted-foreground text-sm mb-8">
              AI-powered research, analysis, and insights
            </p>

            <div className="w-full max-w-2xl mb-6">
              <ChatInput 
                onSend={sendMessage} 
                onStop={stopGeneration} 
                isLoading={isLoading} 
                variant="home" 
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => sendMessage(s.prompt)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-card hover:bg-primary/5 hover:border-primary/30 text-sm text-muted-foreground hover:text-primary transition-all shadow-sm"
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
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
                {messages.map((msg, i) => (
                  <div key={i} className="group">
                    <ChatMessage message={msg} />
                  </div>
                ))}

                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex items-center gap-1.5 pt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <ChatInput 
              onSend={sendMessage} 
              onStop={stopGeneration} 
              isLoading={isLoading} 
            />
          </>
        )}
      </div>
    </div>
  );
}