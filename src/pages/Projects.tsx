import { useState } from "react";
import { Plus, Search, FolderOpen, Menu, Trash2, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface Project {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  tab: "yours" | "team" | "shared";
}

const TABS = [
  { id: "yours" as const, label: "Your projects" },
  { id: "team" as const, label: "Team" },
  { id: "shared" as const, label: "Shared with you" },
];

export default function Projects() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"yours" | "team" | "shared">("yours");
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = projects.filter(
    (p) =>
      p.tab === activeTab &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!newName.trim()) return;
    const project: Project = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      description: newDesc.trim(),
      updatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      tab: "yours",
    };
    setProjects((prev) => [project, ...prev]);
    setNewName("");
    setNewDesc("");
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border">
        <button onClick={() => navigate("/")} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold">Projects</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Plus className="h-5 w-5" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <Input
                placeholder="Project name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
              <Input
                placeholder="Description (optional)"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
              <Button onClick={handleCreate} className="w-full" disabled={!newName.trim()}>
                Create Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted border-border"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 py-3">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 pb-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-6">
              <FolderOpen className="h-16 w-16 text-muted-foreground/40 mx-auto" strokeWidth={1} />
            </div>
            <p className="text-muted-foreground max-w-xs leading-relaxed">
              Create a project to organize and customize chats around a topic or set of documents.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-foreground truncate">{project.name}</h3>
                  {project.description && (
                    <p className="text-sm text-muted-foreground truncate mt-0.5">{project.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground/60 mt-1">{project.updatedAt}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ml-2">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDelete(project.id)} className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
