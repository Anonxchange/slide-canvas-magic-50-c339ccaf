import { useState } from "react";
import { Menu, Plus, Lightbulb, Trash2, MoreVertical, FileCode2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface Artifact {
  id: string;
  name: string;
  createdAt: string;
}

const INSPIRATION = [
  "Buy/Sell Toggle Design",
  "Crypto Trading App",
  "Social Trading Feed",
  "Modern Fintech Landing",
  "Device Verification Screen",
  "Dashboard Analytics",
];

export default function Artifacts() {
  const navigate = useNavigate();
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [newName, setNewName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreate = () => {
    if (!newName.trim()) return;
    const artifact: Artifact = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    setArtifacts((prev) => [artifact, ...prev]);
    setNewName("");
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setArtifacts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border">
        <button onClick={() => navigate("/")} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold">Artifacts</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Plus className="h-5 w-5" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>New Artifact</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <Input
                placeholder="Artifact name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
              <Button onClick={handleCreate} className="w-full" disabled={!newName.trim()}>
                Create Artifact
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Get Inspired Banner */}
      <div className="px-4 pt-4">
        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            <span className="font-medium text-foreground">Get inspired</span>
          </div>
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-10 h-7 rounded-md bg-muted border border-border" />
            ))}
          </div>
        </div>
      </div>

      {/* Artifacts Grid */}
      <div className="px-4 pt-4 pb-8">
        {artifacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FileCode2 className="h-16 w-16 text-muted-foreground/40 mb-6" strokeWidth={1} />
            <p className="text-muted-foreground max-w-xs leading-relaxed">
              Create artifacts to save and organize code snippets, designs, and components.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {artifacts.map((artifact) => (
              <div
                key={artifact.id}
                className="rounded-xl border border-border bg-card overflow-hidden cursor-pointer group"
              >
                <div className="aspect-[4/3] bg-muted flex items-center justify-center relative">
                  <FileCode2 className="h-8 w-8 text-muted-foreground/30" />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded-md bg-background/80 text-muted-foreground hover:text-foreground transition-colors">
                          <MoreVertical className="h-3.5 w-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDelete(artifact.id)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm text-foreground truncate">{artifact.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{artifact.createdAt}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
