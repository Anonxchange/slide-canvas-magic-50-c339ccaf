import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { streamChat, type ChatMessage } from "@/lib/streamChat";
import { toast } from "sonner";

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

export function useConversation() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const loadConversations = useCallback(async () => {
    const { data } = await supabase
      .from("conversations")
      .select("id, title, created_at")
      .order("updated_at", { ascending: false });
    if (data) setConversations(data);
  }, []);

  const loadMessages = useCallback(async (conversationId: string) => {
    const { data } = await supabase
      .from("messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    if (data) setMessages(data.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })));
    setActiveConversationId(conversationId);
  }, []);

  const createConversation = useCallback(async (title: string) => {
    const { data } = await supabase
      .from("conversations")
      .insert({ title })
      .select("id, title, created_at")
      .single();
    if (data) {
      setConversations((prev) => [data, ...prev]);
      setActiveConversationId(data.id);
      setMessages([]);
      return data.id;
    }
    return null;
  }, []);

  const deleteConversation = useCallback(async (id: string) => {
    await supabase.from("conversations").delete().eq("id", id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
      setMessages([]);
    }
  }, [activeConversationId]);

  const sendMessage = useCallback(async (input: string) => {
    let convId = activeConversationId;
    if (!convId) {
      const title = input.slice(0, 60) + (input.length > 60 ? "..." : "");
      convId = await createConversation(title);
      if (!convId) return;
    }

    const userMsg: ChatMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    // Save user message
    await supabase.from("messages").insert({ conversation_id: convId, role: "user", content: input });

    let assistantContent = "";
    const controller = new AbortController();
    abortRef.current = controller;

    const upsertAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    try {
      await streamChat({
        messages: updatedMessages,
        onDelta: upsertAssistant,
        onDone: async () => {
          setIsLoading(false);
          // Save assistant message
          if (assistantContent && convId) {
            await supabase.from("messages").insert({
              conversation_id: convId,
              role: "assistant",
              content: assistantContent,
            });
            // Update conversation timestamp
            await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", convId);
          }
        },
        signal: controller.signal,
      });
    } catch (e: any) {
      if (e.name !== "AbortError") {
        console.error(e);
        toast.error(e.message || "Failed to get response");
      }
      setIsLoading(false);
    }
  }, [activeConversationId, messages, createConversation]);

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
  }, []);

  const newChat = useCallback(() => {
    setActiveConversationId(null);
    setMessages([]);
  }, []);

  return {
    conversations,
    activeConversationId,
    messages,
    isLoading,
    loadConversations,
    loadMessages,
    createConversation,
    deleteConversation,
    sendMessage,
    stopGeneration,
    newChat,
  };
}
