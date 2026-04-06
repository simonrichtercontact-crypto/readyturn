"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Pencil,
  Loader2,
  AlertOctagon,
  User,
  Calendar,
  DollarSign,
  LayoutTemplate,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TaskStatusBadge } from "@/components/shared/status-badge";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { createTask, updateTask, updateTaskStatus, deleteTask } from "@/lib/actions/tasks";
import { updateTaskCost } from "@/lib/actions/costs";
import { taskSchema, type TaskFormData } from "@/lib/validations/task";
import { useToast } from "@/hooks/use-toast";
import { formatDate, isOverdue } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { TurnoverTask } from "@/types/database";
import { ApplyTemplateDialog } from "@/features/templates/components/template-builder";

interface TaskListProps {
  tasks: TurnoverTask[];
  turnoverID: string;
  companyId: string;
  templates?: any[];
  canUseTemplates?: boolean;
}

interface TaskDialogProps {
  task?: TurnoverTask;
  turnoverID: string;
  open: boolean;
  onClose: () => void;
}

function TaskDialog({ task, turnoverID, open, onClose }: TaskDialogProps) {
  const { toast } = useToast();
  const isEditing = !!task;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description || "",
          assigned_to_name: task.assigned_to_name || "",
          due_date: task.due_date || "",
          status: task.status,
          priority: task.priority,
        }
      : { status: "not_started", priority: "medium" },
  });

  const onSubmit = async (data: TaskFormData) => {
    const result = isEditing
      ? await updateTask(task.id, turnoverID, data)
      : await createTask(turnoverID, data);

    if (result?.error) {
      toast({ variant: "destructive", title: "Error", description: result.error });
    } else {
      toast({ variant: "success", title: isEditing ? "Task updated" : "Task added" });
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Task" : "Add Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task title *</Label>
            <Input id="title" placeholder="e.g. Deep clean kitchen" {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Textarea id="description" placeholder="Additional details..." className="h-16" {...register("description")} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="assigned_to_name">Assigned to</Label>
              <Input id="assigned_to_name" placeholder="e.g. Mike Torres" {...register("assigned_to_name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due_date">Due date</Label>
              <Input id="due_date" type="date" {...register("due_date")} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                {...register("priority")}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                {...register("status")}
              >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : isEditing ? "Save Changes" : "Add Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function TaskList({ tasks, turnoverID, templates = [], canUseTemplates = false }: TaskListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TurnoverTask | undefined>();
  const [deletingTask, setDeletingTask] = useState<TurnoverTask | undefined>();
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [costEditId, setCostEditId] = useState<string | null>(null);
  const [costValues, setCostValues] = useState<{ estimated: string; actual: string }>({ estimated: "", actual: "" });
  const [savingCost, setSavingCost] = useState(false);
  const { toast } = useToast();

  async function handleSaveCost(taskId: string) {
    setSavingCost(true);
    const result = await updateTaskCost(
      taskId,
      turnoverID,
      costValues.estimated ? parseFloat(costValues.estimated) : null,
      costValues.actual ? parseFloat(costValues.actual) : null
    );
    setSavingCost(false);
    if (result?.error) {
      toast({ variant: "destructive", title: "Error", description: result.error });
    } else {
      toast({ variant: "success", title: "Cost updated" });
      setCostEditId(null);
    }
  }

  const handleToggle = async (task: TurnoverTask) => {
    setTogglingId(task.id);
    const newStatus = task.status === "done" ? "not_started" : "done";
    const result = await updateTaskStatus(task.id, turnoverID, newStatus);
    if (result?.error) {
      toast({ variant: "destructive", title: "Error", description: result.error });
    }
    setTogglingId(null);
  };

  const handleDelete = async () => {
    if (!deletingTask) return;
    const result = await deleteTask(deletingTask.id, turnoverID);
    if (result?.error) {
      toast({ variant: "destructive", title: "Error", description: result.error });
    } else {
      toast({ variant: "success", title: "Task deleted" });
    }
    setDeletingTask(undefined);
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const order: Record<string, number> = { blocked: 0, in_progress: 1, not_started: 2, done: 3 };
    return (order[a.status] ?? 99) - (order[b.status] ?? 99);
  });

  return (
    <div>
      {tasks.length === 0 ? (
        <div className="py-8 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground mb-3">No tasks yet</p>
          <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="h-3.5 w-3.5" /> Add first task
          </Button>
        </div>
      ) : (
        <div className="space-y-1">
          {sortedTasks.map((task) => {
            const overdue = isOverdue(task.due_date);
            const isDone = task.status === "done";
            const isBlocked = task.status === "blocked";

            return (
              <div
                key={task.id}
                className={cn(
                  "group flex items-start gap-3 rounded-xl p-3 transition-colors",
                  isDone ? "bg-muted/30 opacity-70" : "hover:bg-accent/50",
                  isBlocked ? "bg-red-50/50 border border-red-100" : ""
                )}
              >
                {/* Checkbox */}
                <button
                  onClick={() => handleToggle(task)}
                  disabled={togglingId === task.id}
                  className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary transition-colors"
                >
                  {togglingId === task.id ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : isDone ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : isBlocked ? (
                    <AlertOctagon className="h-5 w-5 text-red-500" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-medium", isDone ? "line-through text-muted-foreground" : "")}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{task.description}</p>
                  )}
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <TaskStatusBadge status={task.status} />
                    <PriorityBadge priority={task.priority} />
                    {task.assigned_to_name && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        {task.assigned_to_name}
                      </span>
                    )}
                    {task.due_date && (
                      <span className={cn("flex items-center gap-1 text-xs", overdue ? "text-red-500 font-medium" : "text-muted-foreground")}>
                        <Calendar className="h-3 w-3" />
                        {overdue ? "Overdue · " : ""}{formatDate(task.due_date)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title="Edit cost"
                    onClick={() => {
                      setCostEditId(task.id);
                      setCostValues({
                        estimated: (task as any).estimated_cost?.toString() ?? "",
                        actual: (task as any).actual_cost?.toString() ?? "",
                      });
                    }}
                  >
                    <DollarSign className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => { setEditingTask(task); setDialogOpen(true); }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeletingTask(task)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cost summary */}
      {tasks.length > 0 && (() => {
        const estimated = tasks.reduce((s, t) => s + ((t as any).estimated_cost ?? 0), 0);
        const actual = tasks.reduce((s, t) => s + ((t as any).actual_cost ?? 0), 0);
        if (estimated === 0 && actual === 0) return null;
        return (
          <div className="mt-3 flex items-center gap-4 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
            <span><strong className="text-foreground">Estimated:</strong> ${estimated.toFixed(2)}</span>
            <span><strong className="text-foreground">Actual:</strong> ${actual.toFixed(2)}</span>
            {estimated > 0 && actual > 0 && (
              <span className={actual > estimated ? "text-red-500 font-medium" : "text-emerald-600 font-medium"}>
                {actual > estimated ? `+$${(actual - estimated).toFixed(2)} over budget` : `-$${(estimated - actual).toFixed(2)} under budget`}
              </span>
            )}
          </div>
        );
      })()}

      <div className="mt-3 flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 text-muted-foreground"
          onClick={() => { setEditingTask(undefined); setDialogOpen(true); }}
        >
          <Plus className="h-4 w-4" />
          Add task
        </Button>
        {canUseTemplates && (
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-muted-foreground"
            onClick={() => setTemplateDialogOpen(true)}
          >
            <LayoutTemplate className="h-4 w-4" />
            Apply Template
          </Button>
        )}
      </div>

      {/* Cost edit dialog */}
      {costEditId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setCostEditId(null)}>
          <div className="bg-card rounded-xl border border-border p-5 w-80 space-y-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <p className="font-semibold text-sm">Edit Cost</p>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Estimated cost ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={costValues.estimated}
                onChange={(e) => setCostValues((v) => ({ ...v, estimated: e.target.value }))}
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Actual cost ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={costValues.actual}
                onChange={(e) => setCostValues((v) => ({ ...v, actual: e.target.value }))}
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setCostEditId(null)}>Cancel</Button>
              <Button size="sm" disabled={savingCost} onClick={() => handleSaveCost(costEditId)}>
                {savingCost ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ApplyTemplateDialog
        open={templateDialogOpen}
        onClose={() => setTemplateDialogOpen(false)}
        templates={templates}
        turnoverID={turnoverID}
      />

      <TaskDialog
        task={editingTask}
        turnoverID={turnoverID}
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditingTask(undefined); }}
      />

      <ConfirmDialog
        open={!!deletingTask}
        onOpenChange={(open) => !open && setDeletingTask(undefined)}
        title="Delete task?"
        description={`Are you sure you want to delete "${deletingTask?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
}
