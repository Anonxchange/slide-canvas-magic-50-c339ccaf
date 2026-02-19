import { useState, useRef, useEffect } from "react";
import { ArrowUp, Square, Plus, Mic, AudioLines, ImageIcon, Paperclip, Camera, X } from "lucide-react";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

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
        {/* Plus button with menu */}
        <div className="relative flex-shrink-0 mb-0.5" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`w-10 h-10 rounded-full border border-border flex items-center justify-center transition-colors ${menuOpen ? "text-primary border-primary/40 bg-primary/5" : "text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5"}`}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </button>

          {menuOpen && (
            <div className="absolute bottom-12 left-0 w-52 bg-popover border border-border rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <button
                onClick={() => { setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] text-foreground hover:bg-accent/50 transition-colors"
              >
                <Paperclip className="h-4.5 w-4.5 text-muted-foreground" />
                Attach file
              </button>
              <button
                onClick={() => { setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] text-foreground hover:bg-accent/50 transition-colors"
              >
                <Camera className="h-4.5 w-4.5 text-muted-foreground" />
                Camera
              </button>
              {onGenerateImage && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    if (imagesRemaining > 0) setImageMode(true);
                  }}
                  disabled={imagesRemaining <= 0}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-[15px] hover:bg-accent/50 transition-colors ${imagesRemaining <= 0 ? "text-muted-foreground/40 cursor-not-allowed" : "text-foreground"}`}
                >
                  <ImageIcon className="h-4.5 w-4.5 text-muted-foreground" />
                  <span className="flex-1 text-left">Generate image</span>
                  <span className="text-xs text-muted-foreground">{imagesRemaining} left</span>
                </button>
              )}
            </div>
          )}
        </div>

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
            className={`w-full resize-none bg-transparent px-4 pr-24 text-[16px] text-foreground focus:outline-none placeholder:text-muted-foreground/50 ${isHome ? "py-4" : "py-3.5"} ${imageMode ? "pt-2" : ""}`}
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
