import { Plus, MessageSquare, Trash2, PanelLeftClose, PanelLeft } from "lucide-react";
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

export function ConversationSidebar({ conversations, activeId, onSelect, onNew, onDelete, isOpen, onToggle }: ConversationSidebarProps) {
  return (
    <>
      {/* Toggle button - always visible */}
      <button
        onClick={onToggle}
        className="fixed top-3 left-3 z-50 w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
      >
        {isOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-40 bg-card/95 backdrop-blur-md border-r border-border/50 flex flex-col transition-transform duration-300 ease-out w-64 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-14 flex items-center justify-between px-3 pl-14">
          <button
            onClick={onNew}
            className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <Plus className="h-4 w-4" />
            New chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
          {conversations.length > 0 && (
            <p className="px-3 py-2 text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider">
              Recent
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
              <MessageSquare className="h-4 w-4 flex-shrink-0 opacity-60" />
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
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/20 md:hidden" onClick={onToggle} />
      )}
    </>
  );
}
