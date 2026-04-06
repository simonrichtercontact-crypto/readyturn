"use client";

import { useRouter, useSearchParams } from "next/navigation";

const PRIORITY_FILTERS = [
  { value: "", label: "All priorities" },
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export function TurnoverFilters({
  properties,
}: {
  properties: { id: string; name: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/turnovers?${params.toString()}`);
  }

  return (
    <div className="ml-auto pb-1 flex gap-2">
      <select
        className="h-8 rounded-lg border border-input bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
        defaultValue={searchParams.get("priority") || ""}
        onChange={(e) => updateParam("priority", e.target.value)}
      >
        {PRIORITY_FILTERS.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>
      <select
        className="h-8 rounded-lg border border-input bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
        defaultValue={searchParams.get("property") || ""}
        onChange={(e) => updateParam("property", e.target.value)}
      >
        <option value="">All properties</option>
        {properties.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  );
}
