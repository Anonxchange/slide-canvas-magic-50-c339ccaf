import { useState, useRef, useEffect } from "react";
import { ArrowUp, Square, Plus, Mic, AudioLines } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isLoading: boolean;
  disabled?: boolean;
  variant?: "home" | "chat";
}

export function ChatInput({ onSend, onStop, isLoading, disabled, variant = "chat" }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isHome = variant === "home";

  return (
    <div className={isHome ? "" : "border-t border-border/50 bg-background/80 backdrop-blur-sm p-4"}>
      <div className={`mx-auto flex items-end gap-2 ${isHome ? "max-w-2xl" : "max-w-3xl"}`}>
        {/* Plus button */}
        <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors flex-shrink-0 mb-0.5">
          <Plus className="h-5 w-5" />
        </button>

        <div className={`flex-1 relative rounded-2xl border border-border bg-card shadow-sm focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all ${isHome ? "shadow-md" : ""}`}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Mindibly anything..."
            rows={1}
            className={`w-full resize-none bg-transparent px-4 pr-28 text-[16px] text-foreground focus:outline-none placeholder:text-muted-foreground/50 font-['Inter'] ${isHome ? "py-4" : "py-3.5"}`}
            disabled={disabled}
            autoFocus={isHome}
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
            {/* Mic button */}
            <button className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 active:shadow-[0_0_12px_hsl(224,76%,48%,0.4)] transition-all">
              <Mic className="h-4 w-4" />
            </button>

            {isLoading ? (
              <button
                onClick={onStop}
                className="w-9 h-9 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <Square className="h-3.5 w-3.5" />
              </button>
            ) : input.trim() ? (
              <button
                onClick={handleSubmit}
                disabled={disabled}
                className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-30 hover:bg-[hsl(224,76%,55%)] hover:scale-105 transition-all shadow-sm"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            ) : (
              <button className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-[hsl(224,76%,55%)] hover:scale-105 active:shadow-[0_0_12px_hsl(224,76%,48%,0.4)] transition-all shadow-sm">
                <AudioLines className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
