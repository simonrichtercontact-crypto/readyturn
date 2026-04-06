import { z } from "zod";

export const propertySchema = z.object({
  name: z.string().min(1, "Property name is required"),
  address_line_1: z.string().min(1, "Address is required"),
  address_line_2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
  postal_code: z.string().min(5, "Postal code is required"),
  notes: z.string().optional(),
});

export type PropertyFormData = z.infer<typeof propertySchema>;
