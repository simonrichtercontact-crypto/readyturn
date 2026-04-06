import { cn, priorityConfig } from "@/lib/utils";
import type { TurnoverPriority, TaskPriority } from "@/types/database";

interface PriorityBadgeProps {
  priority: TurnoverPriority | TaskPriority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        config.bg,
        config.color,
        className
      )}
    >
      {priority === "urgent" && (
        <span className="mr-1 h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
      )}
      {config.label}
    </span>
  );
}
