"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Play, AlertOctagon, Ban } from "lucide-react";
import { updateTurnoverStatus } from "@/lib/actions/turnovers";
import { useToast } from "@/hooks/use-toast";
import type { TurnoverStatus } from "@/types/database";
import { cn } from "@/lib/utils";

interface StatusUpdaterProps {
  turnoverID: string;
  currentStatus: TurnoverStatus;
}

const statusOptions: {
  value: TurnoverStatus;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  className: string;
}[] = [
  {
    value: "not_started",
    label: "Not Started",
    description: "Work hasn't begun yet",
    icon: Ban,
    className: "border-slate-200 hover:border-slate-400 data-[active=true]:border-slate-400 data-[active=true]:bg-slate-50",
  },
  {
    value: "in_progress",
    label: "In Progress",
    description: "Work is underway",
    icon: Play,
    className: "border-blue-200 hover:border-blue-400 data-[active=true]:border-blue-400 data-[active=true]:bg-blue-50",
  },
  {
    value: "blocked",
    label: "Blocked",
    description: "Something is preventing progress",
    icon: AlertOctagon,
    className: "border-red-200 hover:border-red-400 data-[active=true]:border-red-400 data-[active=true]:bg-red-50",
  },
  {
    value: "ready",
    label: "Ready",
    description: "Unit is ready to lease",
    icon: CheckCircle2,
    className: "border-emerald-200 hover:border-emerald-400 data-[active=true]:border-emerald-400 data-[active=true]:bg-emerald-50",
  },
];

export function StatusUpdater({ turnoverID, currentStatus }: StatusUpdaterProps) {
  const [loading, setLoading] = useState<TurnoverStatus | null>(null);
  const [status, setStatus] = useState(currentStatus);
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: TurnoverStatus) => {
    if (newStatus === status) return;
    setLoading(newStatus);
    const result = await updateTurnoverStatus(turnoverID, newStatus);
    if (result?.error) {
      toast({ variant: "destructive", title: "Error", description: result.error });
    } else {
      setStatus(newStatus);
      toast({
        variant: "success",
        title: "Status updated",
        description: `Turnover marked as ${newStatus.replace("_", " ")}`,
      });
    }
    setLoading(null);
  };

  return (
    <div className="space-y-2">
      {statusOptions.map((option) => {
        const isActive = status === option.value;
        const isLoading = loading === option.value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            onClick={() => handleStatusChange(option.value)}
            disabled={!!loading}
            data-active={isActive}
            className={cn(
              "w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-all duration-150",
              option.className,
              isActive ? "ring-2 ring-offset-1 ring-current" : "",
              "disabled:opacity-60 disabled:cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            ) : (
              <Icon className="h-4 w-4 shrink-0" />
            )}
            <div>
              <p className="text-sm font-medium">{option.label}</p>
              <p className="text-xs text-muted-foreground">{option.description}</p>
            </div>
            {isActive && (
              <span className="ml-auto text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                Current
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
