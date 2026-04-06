import { Metadata } from "next";
import { PropertyForm } from "@/features/properties/components/property-form";

export const metadata: Metadata = { title: "Add Property" };

export default function NewPropertyPage() {
  return <PropertyForm />;
}
