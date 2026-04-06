import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  assigned_to_name: z.string().optional(),
  due_date: z.string().optional().nullable(),
  status: z.enum(["not_started", "in_progress", "done", "blocked"]).default("not_started"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
});

export type TaskFormData = z.infer<typeof taskSchema>;
