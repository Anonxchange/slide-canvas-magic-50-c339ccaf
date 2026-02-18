import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check, Volume2, ThumbsUp, ThumbsDown, Share } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/lib/streamChat";

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.rate = 1;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const handleThumbsUp = () => {
    console.log("Thumbs up!");
  };

  const handleThumbsDown = () => {
    console.log("Thumbs down!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ text: message.content }).catch(() => {});
    } else {
      navigator.clipboard.writeText(message.content);
    }
  };

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} w-full mb-8 group`}>
      <div className={`${isUser ? "max-w-[80%]" : "max-w-full"} min-w-0`}>
        {isUser ? (
          <div className="bg-[#f4f4f4] dark:bg-[#2f2f2f] text-[#0d0d0d] dark:text-[#ececec] rounded-[24px] px-5 py-3.5 shadow-none border-none">
            <p className="text-[17px] leading-relaxed whitespace-pre-wrap font-['Inter']">{message.content}</p>
          </div>
        ) : (
          <div className="w-full">
            <div className="bg-transparent px-0 py-1">
              <div className="prose prose-lg max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 text-[#0d0d0d] dark:text-[#ececec] font-['Inter'] [&_h1]:text-[24px] [&_h1]:font-bold [&_h1]:mb-3 [&_h2]:text-[20px] [&_h2]:font-semibold [&_h2]:mb-2.5 [&_h3]:text-[18px] [&_h3]:font-semibold [&_h3]:mb-2 [&_p]:text-[17px] [&_p]:leading-[1.7] [&_p]:mb-3 [&_li]:text-[17px] [&_li]:leading-[1.7] [&_ul]:mb-3 [&_ol]:mb-3 [&_a]:text-primary [&_a]:no-underline [&_a]:hover:underline [&_code]:font-mono [&_code]:text-[15px] [&_code]:text-[#eb5757] [&_code]:bg-[#fdf6f6] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded dark:[&_code]:bg-[#2f2f2f] dark:[&_code]:text-[#ececec] [&_strong]:font-semibold [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_table]:text-[16px] [&_pre]:text-[15px] [&_pre]:bg-[#f4f4f4] [&_pre]:rounded-xl [&_pre]:p-4 dark:[&_pre]:bg-[#1e1e1e]">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5 mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={handleCopy} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Copy">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
              <button onClick={handleSpeak} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Listen">
                <Volume2 className="h-4 w-4" />
              </button>
              <button onClick={handleThumbsUp} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Like">
                <ThumbsUp className="h-4 w-4" />
              </button>
              <button onClick={handleThumbsDown} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Dislike">
                <ThumbsDown className="h-4 w-4" />
              </button>
              <button onClick={handleShare} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Share">
                <Share className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
