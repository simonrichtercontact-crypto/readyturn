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
import { createProperty, updateProperty } from "@/lib/actions/properties";
import { propertySchema, type PropertyFormData } from "@/lib/validations/property";
import type { Property } from "@/types/database";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
];

interface PropertyFormProps {
  property?: Property;
}

export function PropertyForm({ property }: PropertyFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!property;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: property
      ? {
          name: property.name,
          address_line_1: property.address_line_1,
          address_line_2: property.address_line_2 || "",
          city: property.city,
          state: property.state,
          postal_code: property.postal_code,
          notes: property.notes || "",
        }
      : undefined,
  });

  const onSubmit = async (data: PropertyFormData) => {
    setError(null);
    const result = isEditing
      ? await updateProperty(property.id, data)
      : await createProperty(data);

    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={isEditing ? "Edit Property" : "Add Property"}
        description={
          isEditing
            ? "Update property details below."
            : "Add a new property to your portfolio."
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
              <CardTitle className="text-base">Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Property name *</Label>
                <Input
                  id="name"
                  placeholder="Riverside Apartments"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="address_line_1">Street address *</Label>
                <Input
                  id="address_line_1"
                  placeholder="1200 Riverside Drive"
                  {...register("address_line_1")}
                />
                {errors.address_line_1 && (
                  <p className="text-xs text-destructive">{errors.address_line_1.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_line_2">
                  Address line 2{" "}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Input
                  id="address_line_2"
                  placeholder="Suite 100"
                  {...register("address_line_2")}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2 sm:col-span-1">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="Austin"
                    {...register("city")}
                  />
                  {errors.city && (
                    <p className="text-xs text-destructive">{errors.city.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <select
                    id="state"
                    className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    {...register("state")}
                  >
                    <option value="">Select state</option>
                    {US_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="text-xs text-destructive">{errors.state.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postal_code">ZIP code *</Label>
                  <Input
                    id="postal_code"
                    placeholder="78701"
                    {...register("postal_code")}
                  />
                  {errors.postal_code && (
                    <p className="text-xs text-destructive">{errors.postal_code.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Additional Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="notes">
                  Notes{" "}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Any notes about this property..."
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
                "Add Property"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
