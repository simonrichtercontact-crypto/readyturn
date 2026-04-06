import { formatRelativeTime } from "@/lib/utils";
import type { ActivityLog } from "@/types/database";
import {
  CheckCircle2,
  PlusCircle,
  RefreshCw,
  Trash2,
  Upload,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const actionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  created: PlusCircle,
  updated: RefreshCw,
  deleted: Trash2,
  completed: CheckCircle2,
  status_changed: RefreshCw,
  uploaded: Upload,
  blocked: AlertCircle,
};

const actionColors: Record<string, string> = {
  created: "text-blue-500 bg-blue-50",
  updated: "text-slate-500 bg-slate-50",
  deleted: "text-red-500 bg-red-50",
  completed: "text-emerald-500 bg-emerald-50",
  status_changed: "text-amber-500 bg-amber-50",
  uploaded: "text-purple-500 bg-purple-50",
  blocked: "text-red-500 bg-red-50",
};

interface ActivityFeedProps {
  activities: ActivityLog[];
  className?: string;
  compact?: boolean;
}

export function ActivityFeed({ activities, className, compact = false }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No activity yet
      </p>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      {activities.map((activity, index) => {
        const Icon = actionIcons[activity.action_type] || RefreshCw;
        const colorClass = actionColors[activity.action_type] || "text-slate-500 bg-slate-50";

        return (
          <div
            key={activity.id}
            className={cn(
              "flex items-start gap-3",
              compact ? "py-2" : "py-3"
            )}
          >
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex items-center justify-center rounded-full shrink-0",
                  compact ? "h-6 w-6" : "h-7 w-7",
                  colorClass
                )}
              >
                <Icon className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
              </div>
              {index < activities.length - 1 && (
                <div className="mt-1 w-px flex-1 bg-border min-h-[12px]" />
              )}
            </div>

            <div className="flex-1 min-w-0 pb-1">
              <p className={cn("text-foreground leading-snug", compact ? "text-xs" : "text-sm")}>
                {activity.message}
              </p>
              <p className={cn("mt-0.5 text-muted-foreground", compact ? "text-[10px]" : "text-xs")}>
                {formatRelativeTime(activity.created_at)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
