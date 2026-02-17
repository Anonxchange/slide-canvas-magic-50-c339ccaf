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
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} w-full mb-8 group`}>
      <div className={`${isUser ? "max-w-[80%]" : "max-w-full"} min-w-0`}>
        {isUser ? (
          <div className="bg-[#f4f4f4] dark:bg-[#2f2f2f] text-[#0d0d0d] dark:text-[#ececec] rounded-[24px] px-5 py-3 shadow-none border-none">
            <p className="text-[16px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
        ) : (
          <div className="w-full">
            <div className="bg-transparent px-0 py-1">
              <div className="prose prose-md max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 text-[#0d0d0d] dark:text-[#ececec] [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:text-base [&_h3]:font-semibold [&_p]:text-[16px] [&_p]:leading-[1.6] [&_li]:text-[16px] [&_a]:text-primary [&_a]:no-underline [&_a]:hover:underline [&_code]:font-mono [&_code]:text-[14px] [&_code]:text-[#eb5757] [&_code]:bg-[#fdf6f6] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded dark:[&_code]:bg-[#2f2f2f] dark:[&_code]:text-[#ececec]">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            </div>
            {/* Action buttons */}
            <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Copy"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
