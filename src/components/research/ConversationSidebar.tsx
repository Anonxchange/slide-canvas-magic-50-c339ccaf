import { Plus, MessageSquare, Trash2, PanelLeftClose, PanelLeft, FolderOpen, Blocks, User } from "lucide-react";
import type { Conversation } from "@/hooks/useConversation";

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const NAV_ITEMS = [
  { icon: MessageSquare, label: "Chats" },
  { icon: FolderOpen, label: "Projects" },
  { icon: Blocks, label: "Artifacts" },
];

export function ConversationSidebar({ conversations, activeId, onSelect, onNew, onDelete, isOpen, onToggle }: ConversationSidebarProps) {
  return (
    <>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="fixed top-3 left-3 z-50 w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
      >
        {isOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-40 bg-card/95 backdrop-blur-md border-r border-border/50 flex flex-col transition-transform duration-300 ease-out w-72 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand header */}
        <div className="h-14 flex items-center justify-between px-4 pl-14">
          <span className="text-lg font-bold text-foreground tracking-tight">Mindibly</span>
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
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
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
            <p className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-widest">
              Recents
            </p>
          )}
          {conversations.map((c) => (
            <div
              key={c.id}
              className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer text-sm transition-all ${
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
              <p className="text-xs">No conversations yet</p>
            </div>
          )}
        </div>

        {/* Bottom user area */}
        <div className="border-t border-border/40 px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm text-muted-foreground truncate">Guest User</span>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/20 md:hidden" onClick={onToggle} />
      )}
    </>
  );
}
