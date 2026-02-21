import { Plus, MessageSquare, Trash2, PanelLeftClose, PanelLeft, FolderOpen, Blocks, User, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { Conversation } from "@/hooks/useConversation";

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  isGuest?: boolean;
}

const NAV_ITEMS = [
  { icon: MessageSquare, label: "Chats" },
  { icon: FolderOpen, label: "Projects" },
  { icon: Blocks, label: "Artifacts" },
];

export function ConversationSidebar({ conversations, activeId, onSelect, onNew, onDelete, isOpen, onToggle, isGuest }: ConversationSidebarProps) {
  return (
    <>
      {/* Toggle button - desktop only */}
      <button
        onClick={onToggle}
        className="fixed top-3 left-3 z-50 w-9 h-9 rounded-lg hidden md:flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
      >
        {isOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
      </button>

      {/* Desktop: sidebar as a flex column that pushes content. Mobile: overlay */}
      <div
        className={`
          h-full bg-card border-r border-border flex flex-col shrink-0 transition-all duration-300 ease-out
          /* Desktop: inline, push content */
          hidden md:flex
          ${isOpen ? "w-72" : "w-0 overflow-hidden border-r-0"}
        `}
      >
        <SidebarContent
          conversations={conversations}
          activeId={activeId}
          onSelect={onSelect}
          onNew={onNew}
          onDelete={onDelete}
        />
      </div>

      {/* No mobile sidebar - mobile has no sidebar */}
    </>
  );
}

function SidebarContent({ conversations, activeId, onSelect, onNew, onDelete }: {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <>
      {/* Brand header */}
      <div className="h-14 flex items-center justify-between px-4 pl-14 shrink-0">
        <span className="text-lg font-bold text-foreground tracking-tight font-['Inter']">Mindibly</span>
        <button
          onClick={onNew}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation sections */}
      <div className="px-3 space-y-0.5 mb-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors font-['Inter']"
          >
            <item.icon className="h-[18px] w-[18px]" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-border/40" />

      {/* Recents */}
      <div className="flex-1 overflow-y-auto px-3 pt-3 pb-2 space-y-0.5">
        {conversations.length > 0 && (
          <p className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-widest font-['Inter']">
            Recents
          </p>
        )}
        {conversations.map((c) => (
          <div
            key={c.id}
            className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer text-sm transition-all font-['Inter'] ${
              activeId === c.id
                ? "bg-muted font-medium text-foreground"
                : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => onSelect(c.id)}
          >
            <span className="truncate flex-1">{c.title}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-background hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
        {conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground/50">
            <MessageSquare className="h-8 w-8 mb-2" />
            <p className="text-xs font-['Inter']">No conversations yet</p>
          </div>
        )}
      </div>

      {/* Bottom user area */}
      <BottomUserArea />
    </>
  );
}

function BottomUserArea() {
  const { user, isGuest, signOut } = useAuth();
  const navigate = useNavigate();

  if (isGuest) {
    return (
      <div className="border-t border-border/40 px-4 py-3 shrink-0">
        <button
          onClick={() => navigate("/auth")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-primary hover:bg-primary/5 transition-colors font-['Inter']"
        >
          <LogIn className="h-4 w-4" />
          Sign in / Sign up
        </button>
      </div>
    );
  }

  return (
    <div className="border-t border-border/40 px-4 py-3 flex items-center gap-3 shrink-0">
      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
        <User className="h-4 w-4 text-primary" />
      </div>
      <span className="text-sm text-foreground truncate flex-1 font-['Inter']">
        {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
      </span>
      <button
        onClick={signOut}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}
