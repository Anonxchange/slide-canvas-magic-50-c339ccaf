import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { User, Sparkles, Volume2, Copy, Star, Check } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/lib/streamChat";

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center mt-1 shadow-sm">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      <div className={`${isUser ? "max-w-[70%]" : "max-w-[85%] min-w-0"}`}>
        {isUser ? (
          <div className="bg-accent text-accent-foreground rounded-2xl rounded-br-md px-4 py-3 shadow-sm">
            <p className="text-sm whitespace-pre-wrap font-medium">{message.content}</p>
          </div>
        ) : (
          <div>
            <div className="bg-secondary rounded-2xl rounded-bl-md px-5 py-4 shadow-sm border border-border/40">
              <div className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 text-foreground/90 [&_h1]:text-base [&_h1]:font-bold [&_h2]:text-sm [&_h2]:font-semibold [&_h3]:text-sm [&_h3]:font-semibold [&_p]:text-sm [&_li]:text-sm [&_a]:text-primary [&_a]:no-underline [&_a]:hover:underline [&_code]:font-mono [&_code]:text-xs [&_code]:text-muted-foreground [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            </div>
            {/* Action buttons */}
            <div className="flex items-center gap-1 mt-1.5 ml-1">
              <button
                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                title="Play TTS"
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>Play</span>
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                title="Copy"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
              <button
                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                title="Save"
              >
                <Star className="h-3.5 w-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
          <User className="w-4 h-4 text-primary" />
        </div>
      )}
    </div>
  );
}
