import { useEffect, useRef } from "react";
import { Brain, Sparkles } from "lucide-react";
import { useConversation } from "@/hooks/useConversation";
import { ConversationSidebar } from "@/components/research/ConversationSidebar";
import { ChatMessage } from "@/components/research/ChatMessage";
import { ChatInput } from "@/components/research/ChatInput";

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

  useEffect(() => { loadConversations(); }, [loadConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen flex bg-background">
      <ConversationSidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={(id) => loadMessages(id)}
        onNew={newChat}
        onDelete={deleteConversation}
      />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b px-6 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Brain className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold">Research Agent</h1>
            <p className="text-xs text-muted-foreground">AI-powered research & knowledge assistant</p>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">What would you like to research?</h2>
              <p className="text-muted-foreground max-w-md text-sm">
                Ask any question and I'll analyze, summarize, and provide actionable insights. 
                Try topics like market trends, technology comparisons, or industry analysis.
              </p>
              <div className="grid grid-cols-2 gap-2 mt-6 max-w-lg">
                {[
                  "Compare React vs Vue in 2026",
                  "Latest AI regulation trends",
                  "Best practices for startup fundraising",
                  "Summarize key blockchain developments",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs text-left px-3 py-2 rounded-lg border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} />
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4 text-primary-foreground animate-pulse" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <ChatInput onSend={sendMessage} onStop={stopGeneration} isLoading={isLoading} />
      </div>
    </div>
  );
}
