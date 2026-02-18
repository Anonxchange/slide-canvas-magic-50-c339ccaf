import { useState, useRef, useEffect } from "react";
import { ArrowUp, Square, Plus, Mic, AudioLines, ImageIcon } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  onGenerateImage?: (prompt: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  variant?: "home" | "chat";
  imageGenCount?: number;
}

export function ChatInput({ onSend, onStop, onGenerateImage, isLoading, disabled, variant = "chat", imageGenCount = 0 }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [imageMode, setImageMode] = useState(false);
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
    if (imageMode && onGenerateImage) {
      onGenerateImage(trimmed);
    } else {
      onSend(trimmed);
    }
    setInput("");
    setImageMode(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isHome = variant === "home";
  const imagesRemaining = 4 - imageGenCount;

  return (
    <div className={isHome ? "" : "border-t border-border/50 bg-background/80 backdrop-blur-sm p-4"}>
      <div className={`mx-auto flex items-end gap-2 ${isHome ? "max-w-2xl" : "max-w-3xl"}`}>
        {/* Plus button */}
        <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors flex-shrink-0 mb-0.5">
          <Plus className="h-5 w-5" />
        </button>

        <div className={`flex-1 relative rounded-2xl border ${imageMode ? "border-primary/50 ring-2 ring-primary/20" : "border-border"} bg-card shadow-sm focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all ${isHome ? "shadow-md" : ""}`}>
          {imageMode && (
            <div className="flex items-center gap-2 px-4 pt-2.5 pb-0">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ImageIcon className="h-3 w-3" /> Image mode
              </span>
              <span className="text-xs text-muted-foreground">{imagesRemaining} remaining</span>
              <button onClick={() => setImageMode(false)} className="text-xs text-muted-foreground hover:text-foreground ml-auto">✕</button>
            </div>
          )}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={imageMode ? "Describe the image you want..." : "Ask Mindibly anything..."}
            rows={1}
            className={`w-full resize-none bg-transparent px-4 pr-32 text-[16px] text-foreground focus:outline-none placeholder:text-muted-foreground/50 ${isHome ? "py-4" : "py-3.5"} ${imageMode ? "pt-2" : ""}`}
            disabled={disabled}
            autoFocus={isHome}
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
            {/* Image gen button */}
            {onGenerateImage && (
              <button
                onClick={() => setImageMode(!imageMode)}
                disabled={imagesRemaining <= 0}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${imageMode ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/5"} ${imagesRemaining <= 0 ? "opacity-30 cursor-not-allowed" : ""}`}
                title={imagesRemaining > 0 ? `Generate image (${imagesRemaining} left)` : "Image limit reached"}
              >
                <ImageIcon className="h-4 w-4" />
              </button>
            )}

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
