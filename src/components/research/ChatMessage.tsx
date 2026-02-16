import ReactMarkdown from "react-markdown";
import { User, Sparkles } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/lib/streamChat";

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mt-1">
          <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
      )}
      <div className={`${isUser ? "max-w-[70%]" : "max-w-[85%] min-w-0"}`}>
        {isUser ? (
          <div className="bg-muted rounded-2xl rounded-br-md px-4 py-2.5">
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 text-foreground/90">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center mt-1">
          <User className="w-3.5 h-3.5 text-foreground/70" />
        </div>
      )}
    </div>
  );
}
