"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, GripVertical, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createTemplate, deleteTemplate, applyTemplate } from "@/lib/actions/templates";
import { useToast } from "@/hooks/use-toast";

type TemplateItem = { title: string; priority: string; sort_order: number };
type Template = { id: string; name: string; description?: string; items: TemplateItem[] };

interface TemplateManagerProps {
  templates: Template[];
  turnoverID?: string; // if set, shows "Apply" buttons
}

export function TemplateManager({ templates, turnoverID }: TemplateManagerProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [applying, setApplying] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  async function handleApply(templateId: string, name: string) {
    if (!turnoverID) return;
    setApplying(templateId);
    const result = await applyTemplate(templateId, turnoverID);
    setApplying(null);
    if (result?.error) {
      toast({ variant: "destructive", title: "Error", description: result.error });
    } else {
      toast({ variant: "success", title: `Applied "${name}"`, description: `${result.count} tasks added` });
    }
  }

  async function handleDelete(templateId: string) {
    setDeleting(templateId);
    startTransition(async () => {
      const result = await deleteTemplate(templateId);
      setDeleting(null);
      if (result?.error) {
        toast({ variant: "destructive", title: "Error", description: result.error });
      } else {
        toast({ variant: "success", title: "Template deleted" });
      }
    });
  }

  return (
    <div className="space-y-4">
      {templates.length === 0 && !showCreate && (
        <div className="py-8 text-center rounded-xl border border-dashed border-border">
          <p className="text-sm text-muted-foreground mb-3">No templates yet. Create your first one.</p>
        </div>
      )}

      {templates.map((t) => (
        <div key={t.id} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground">{t.name}</p>
              {t.description && <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>}
              <p className="text-xs text-muted-foreground mt-1">{t.items?.length ?? 0} tasks</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {t.items?.slice(0, 4).map((item, i) => (
                  <span key={i} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                    {item.title}
                  </span>
                ))}
                {(t.items?.length ?? 0) > 4 && (
                  <span className="text-xs text-muted-foreground px-2 py-0.5">
                    +{t.items.length - 4} more
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {turnoverID && (
                <Button
                  size="sm"
                  variant="default"
                  disabled={applying === t.id}
                  onClick={() => handleApply(t.id, t.name)}
                >
                  {applying === t.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Apply"}
                </Button>
              )}
              <Button
                size="icon-sm"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                disabled={deleting === t.id}
                onClick={() => handleDelete(t.id)}
              >
                {deleting === t.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>
        </div>
      ))}

      {showCreate ? (
        <CreateTemplateForm onClose={() => setShowCreate(false)} />
      ) : (
        <Button variant="outline" size="sm" onClick={() => setShowCreate(true)} className="w-full">
          <Plus className="h-3.5 w-3.5" /> New Template
        </Button>
      )}
    </div>
  );
}

function CreateTemplateForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<TemplateItem[]>([
    { title: "", priority: "medium", sort_order: 0 },
  ]);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  function addItem() {
    setItems((prev) => [...prev, { title: "", priority: "medium", sort_order: prev.length }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof TemplateItem, value: string | number) {
    setItems((prev) => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  }

  async function handleSave() {
    if (!name.trim()) return toast({ variant: "destructive", title: "Name is required" });
    const validItems = items.filter((i) => i.title.trim());
    if (validItems.length === 0) return toast({ variant: "destructive", title: "Add at least one task" });

    setSaving(true);
    const fd = new FormData();
    fd.set("name", name.trim());
    fd.set("description", description.trim());
    fd.set("items", JSON.stringify(validItems.map((item, i) => ({ ...item, sort_order: i }))));

    const result = await createTemplate(fd);
    setSaving(false);

    if (result?.error) {
      toast({ variant: "destructive", title: "Error", description: result.error });
    } else {
      toast({ variant: "success", title: "Template created" });
      onClose();
    }
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-sm">New Template</p>
        <Button variant="ghost" size="icon-sm" onClick={onClose}><X className="h-4 w-4" /></Button>
      </div>

      <div className="space-y-2">
        <Label>Template name *</Label>
        <Input placeholder="e.g. Standard Make-Ready" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Description <span className="text-muted-foreground font-normal">(optional)</span></Label>
        <Input placeholder="e.g. Used for all 1BR apartments" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>Tasks *</Label>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input
                placeholder={`Task ${index + 1}`}
                value={item.title}
                onChange={(e) => updateItem(index, "title", e.target.value)}
                className="flex-1"
              />
              <select
                value={item.priority}
                onChange={(e) => updateItem(index, "priority", e.target.value)}
                className="h-9 rounded-lg border border-input bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <Button variant="ghost" size="icon-sm" onClick={() => removeItem(index)} disabled={items.length === 1}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={addItem} className="w-full mt-1">
          <Plus className="h-3.5 w-3.5" /> Add task
        </Button>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : "Save Template"}
        </Button>
      </div>
    </div>
  );
}

// Modal version for use inside turnover page
export function ApplyTemplateDialog({
  open, onClose, templates, turnoverID,
}: {
  open: boolean;
  onClose: () => void;
  templates: Template[];
  turnoverID: string;
}) {
  const [applying, setApplying] = useState<string | null>(null);
  const { toast } = useToast();

  async function handleApply(templateId: string, name: string) {
    setApplying(templateId);
    const result = await applyTemplate(templateId, turnoverID);
    setApplying(null);
    if (result?.error) {
      toast({ variant: "destructive", title: "Error", description: result.error });
    } else {
      toast({ variant: "success", title: `Applied "${name}"`, description: `${result.count} tasks added` });
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Apply Template</DialogTitle>
        </DialogHeader>
        {templates.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-sm text-muted-foreground">No templates yet.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Go to <strong>Templates</strong> in the sidebar to create one.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {templates.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors">
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.items?.length ?? 0} tasks</p>
                </div>
                <Button
                  size="sm"
                  disabled={applying === t.id}
                  onClick={() => handleApply(t.id, t.name)}
                >
                  {applying === t.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Apply"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
