import { z } from "zod";

export const unitSchema = z.object({
  property_id: z.string().uuid("Please select a property"),
  unit_number: z.string().min(1, "Unit number is required"),
  bedrooms: z.coerce.number().min(0).max(20).optional().nullable(),
  bathrooms: z.coerce.number().min(0).max(20).optional().nullable(),
  square_feet: z.coerce.number().min(0).max(100000).optional().nullable(),
  market_rent: z.coerce.number().min(0).optional().nullable(),
  notes: z.string().optional(),
  status: z.enum(["occupied", "vacant", "make_ready", "ready"]).default("occupied"),
});

export type UnitFormData = z.infer<typeof unitSchema>;
