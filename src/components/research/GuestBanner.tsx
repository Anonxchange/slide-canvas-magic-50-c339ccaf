import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function GuestBanner() {
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  if (dismissed) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 pt-3">
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-primary/5 border border-primary/15 text-sm">
        <Sparkles className="h-4 w-4 text-primary shrink-0" />
        <span className="text-muted-foreground flex-1">
          <button onClick={() => navigate("/auth")} className="text-primary font-medium hover:underline">
            Sign up
          </button>{" "}
          to save conversations, generate images, and unlock all features.
        </span>
        <button onClick={() => setDismissed(true)} className="text-muted-foreground hover:text-foreground shrink-0">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
