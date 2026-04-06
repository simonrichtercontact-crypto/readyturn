import { z } from "zod";

export const turnoverSchema = z.object({
  property_id: z.string().uuid("Please select a property"),
  unit_id: z.string().uuid("Please select a unit"),
  move_out_date: z.string().min(1, "Move out date is required"),
  target_ready_date: z.string().min(1, "Target ready date is required"),
  status: z.enum(["not_started", "in_progress", "blocked", "ready"]).default("not_started"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  notes: z.string().optional(),
});

export type TurnoverFormData = z.infer<typeof turnoverSchema>;
