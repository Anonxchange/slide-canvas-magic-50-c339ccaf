import { useState, useRef, useEffect } from "react";
import { ArrowUp, Square } from "lucide-react";

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
        <div className={`flex-1 relative rounded-2xl border border-border/60 bg-card shadow-sm ${isHome ? "shadow-md" : ""}`}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            rows={1}
            className={`w-full resize-none bg-transparent px-4 pr-12 text-sm focus:outline-none placeholder:text-muted-foreground/60 ${isHome ? "py-4" : "py-3"}`}
            disabled={disabled}
            autoFocus={isHome}
          />
          <div className="absolute right-2 bottom-2">
            {isLoading ? (
              <button
                onClick={onStop}
                className="w-8 h-8 rounded-xl bg-destructive text-destructive-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <Square className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || disabled}
                className="w-8 h-8 rounded-xl bg-foreground text-background flex items-center justify-center disabled:opacity-30 hover:opacity-80 transition-opacity"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
