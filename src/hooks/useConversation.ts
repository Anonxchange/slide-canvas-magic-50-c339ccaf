import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { streamChat, type ChatMessage } from "@/lib/streamChat";
import { toast } from "sonner";

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

const IMAGE_GEN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-image`;

export function useConversation() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageGenCount, setImageGenCount] = useState(0);
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
    if (data) {
      setMessages(data.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })));
      // Count existing image generations
      const imgCount = data.filter(m => m.role === "assistant" && m.content.includes("[GENERATED_IMAGE]")).length;
      setImageGenCount(imgCount);
    }
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
      setImageGenCount(0);
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
      setImageGenCount(0);
    }
  }, [activeConversationId]);

  const generateImage = useCallback(async (prompt: string) => {
    if (imageGenCount >= 4) {
      toast.error("Image limit reached (4 per conversation). Start a new chat for more.");
      return;
    }

    let convId = activeConversationId;
    if (!convId) {
      const title = "Image: " + prompt.slice(0, 50) + (prompt.length > 50 ? "..." : "");
      convId = await createConversation(title);
      if (!convId) return;
    }

    const userMsg: ChatMessage = { role: "user", content: `🎨 Generate image: ${prompt}` };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    await supabase.from("messages").insert({ conversation_id: convId, role: "user", content: userMsg.content });

    try {
      const resp = await fetch(IMAGE_GEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ prompt, conversationId: convId }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Image generation failed" }));
        throw new Error(err.error);
      }

      const data = await resp.json();
      const content = data.imageUrl
        ? `[GENERATED_IMAGE]\n![Generated Image](${data.imageUrl})\n\n${data.text || ""}`
        : data.text || "Sorry, I couldn't generate an image for that prompt.";

      const assistantMsg: ChatMessage = { role: "assistant", content };
      setMessages((prev) => [...prev, assistantMsg]);
      setImageGenCount((c) => c + 1);

      await supabase.from("messages").insert({ conversation_id: convId, role: "assistant", content });
      await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", convId);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Image generation failed");
    } finally {
      setIsLoading(false);
    }
  }, [activeConversationId, imageGenCount, createConversation]);

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
          if (assistantContent && convId) {
            await supabase.from("messages").insert({
              conversation_id: convId,
              role: "assistant",
              content: assistantContent,
            });
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
    setImageGenCount(0);
  }, []);

  return {
    conversations,
    activeConversationId,
    messages,
    isLoading,
    imageGenCount,
    loadConversations,
    loadMessages,
    createConversation,
    deleteConversation,
    sendMessage,
    generateImage,
    stopGeneration,
    newChat,
  };
}
