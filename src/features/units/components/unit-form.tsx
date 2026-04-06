"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { createUnit, updateUnit } from "@/lib/actions/units";
import { unitSchema, type UnitFormData } from "@/lib/validations/unit";
import type { Unit } from "@/types/database";

interface UnitFormProps {
  unit?: Unit;
  properties: { id: string; name: string }[];
  defaultPropertyId?: string;
}

export function UnitForm({ unit, properties, defaultPropertyId }: UnitFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!unit;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues: unit
      ? {
          property_id: unit.property_id,
          unit_number: unit.unit_number,
          bedrooms: unit.bedrooms ?? undefined,
          bathrooms: unit.bathrooms ?? undefined,
          square_feet: unit.square_feet ?? undefined,
          market_rent: unit.market_rent ?? undefined,
          notes: unit.notes || "",
          status: unit.status,
        }
      : {
          property_id: defaultPropertyId || "",
          status: "occupied",
        },
  });

  const onSubmit = async (data: UnitFormData) => {
    setError(null);
    const result = isEditing
      ? await updateUnit(unit.id, data)
      : await createUnit(data);

    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={isEditing ? `Edit Unit ${unit.unit_number}` : "Add Unit"}
        description={
          isEditing ? "Update unit details below." : "Add a new unit to a property."
        }
      >
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Button>
      </PageHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 max-w-2xl">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Unit Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="property_id">Property *</Label>
                <select
                  id="property_id"
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  {...register("property_id")}
                  disabled={isEditing}
                >
                  <option value="">Select a property</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                {errors.property_id && (
                  <p className="text-xs text-destructive">{errors.property_id.message}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="unit_number">Unit number *</Label>
                  <Input
                    id="unit_number"
                    placeholder="e.g. 1A, 204, PH-1"
                    {...register("unit_number")}
                  />
                  {errors.unit_number && (
                    <p className="text-xs text-destructive">{errors.unit_number.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    {...register("status")}
                  >
                    <option value="occupied">Occupied</option>
                    <option value="vacant">Vacant</option>
                    <option value="make_ready">Make Ready</option>
                    <option value="ready">Ready</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="e.g. 2"
                    {...register("bedrooms")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="e.g. 1.5"
                    {...register("bathrooms")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="square_feet">Square feet</Label>
                  <Input
                    id="square_feet"
                    type="number"
                    min="0"
                    placeholder="e.g. 900"
                    {...register("square_feet")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="market_rent">Market rent ($/mo)</Label>
                  <Input
                    id="market_rent"
                    type="number"
                    min="0"
                    step="50"
                    placeholder="e.g. 1500"
                    {...register("market_rent")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <Textarea
                  id="notes"
                  placeholder="Any notes about this unit..."
                  className="h-20"
                  {...register("notes")}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Add Unit"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
