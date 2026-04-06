import { cn, turnoverStatusConfig, taskStatusConfig, unitStatusConfig } from "@/lib/utils";
import type { TurnoverStatus, TaskStatus, UnitStatus } from "@/types/database";

interface TurnoverStatusBadgeProps {
  status: TurnoverStatus;
  className?: string;
}

export function TurnoverStatusBadge({ status, className }: TurnoverStatusBadgeProps) {
  const config = turnoverStatusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium",
        config.bg,
        config.color,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}

interface TaskStatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function TaskStatusBadge({ status, className }: TaskStatusBadgeProps) {
  const config = taskStatusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium",
        config.bg,
        config.color,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}

interface UnitStatusBadgeProps {
  status: UnitStatus;
  className?: string;
}

export function UnitStatusBadge({ status, className }: UnitStatusBadgeProps) {
  const config = unitStatusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        config.bg,
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}
