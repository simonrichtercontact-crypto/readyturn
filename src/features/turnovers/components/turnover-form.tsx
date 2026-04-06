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
import { createTurnover, updateTurnover } from "@/lib/actions/turnovers";
import { turnoverSchema, type TurnoverFormData } from "@/lib/validations/turnover";
import type { Turnover } from "@/types/database";

interface TurnoverFormProps {
  turnover?: Turnover;
  properties: { id: string; name: string }[];
  units: { id: string; unit_number: string; property_id: string }[];
  defaultPropertyId?: string;
  defaultUnitId?: string;
}

export function TurnoverForm({
  turnover,
  properties,
  units,
  defaultPropertyId,
  defaultUnitId,
}: TurnoverFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!turnover;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TurnoverFormData>({
    resolver: zodResolver(turnoverSchema),
    defaultValues: turnover
      ? {
          property_id: turnover.property_id,
          unit_id: turnover.unit_id,
          move_out_date: turnover.move_out_date,
          target_ready_date: turnover.target_ready_date,
          status: turnover.status,
          priority: turnover.priority,
          notes: turnover.notes || "",
        }
      : {
          property_id: defaultPropertyId || "",
          unit_id: defaultUnitId || "",
          status: "not_started",
          priority: "medium",
        },
  });

  const selectedPropertyId = watch("property_id");
  const filteredUnits = units.filter(
    (u) => !selectedPropertyId || u.property_id === selectedPropertyId
  );

  const onSubmit = async (data: TurnoverFormData) => {
    setError(null);
    const result = isEditing
      ? await updateTurnover(turnover.id, data)
      : await createTurnover(data);

    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={isEditing ? "Edit Turnover" : "New Turnover"}
        description={
          isEditing
            ? "Update turnover details."
            : "Create a turnover when a tenant moves out."
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
              <CardTitle className="text-base">Unit Information</CardTitle>
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

              <div className="space-y-2">
                <Label htmlFor="unit_id">Unit *</Label>
                <select
                  id="unit_id"
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  {...register("unit_id")}
                  disabled={isEditing || !selectedPropertyId}
                >
                  <option value="">Select a unit</option>
                  {filteredUnits.map((u) => (
                    <option key={u.id} value={u.id}>
                      Unit {u.unit_number}
                    </option>
                  ))}
                </select>
                {errors.unit_id && (
                  <p className="text-xs text-destructive">{errors.unit_id.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="move_out_date">Move out date *</Label>
                  <Input
                    id="move_out_date"
                    type="date"
                    {...register("move_out_date")}
                  />
                  {errors.move_out_date && (
                    <p className="text-xs text-destructive">{errors.move_out_date.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target_ready_date">Target ready date *</Label>
                  <Input
                    id="target_ready_date"
                    type="date"
                    {...register("target_ready_date")}
                  />
                  {errors.target_ready_date && (
                    <p className="text-xs text-destructive">{errors.target_ready_date.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status & Priority</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    {...register("status")}
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="blocked">Blocked</option>
                    <option value="ready">Ready</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    {...register("priority")}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <Textarea
                  id="notes"
                  placeholder="Any notes about this turnover..."
                  className="h-24"
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
                "Create Turnover"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
