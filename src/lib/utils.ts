import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isPast, isToday, isTomorrow, differenceInDays } from "date-fns";
import type { TurnoverStatus, TurnoverPriority, TaskStatus, TaskPriority, UnitStatus } from "@/types/database";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "MMM d, yyyy");
}

export function formatDateShort(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "MMM d");
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "MMM d, yyyy 'at' h:mm a");
}

export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function getDueDateLabel(date: string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  if (isToday(d)) return "Due today";
  if (isTomorrow(d)) return "Due tomorrow";
  if (isPast(d)) return `${Math.abs(differenceInDays(d, new Date()))}d overdue`;
  return `Due in ${differenceInDays(d, new Date())}d`;
}

export function isOverdue(date: string | null | undefined): boolean {
  if (!date) return false;
  return isPast(new Date(date)) && !isToday(new Date(date));
}

// Status helpers
export const turnoverStatusConfig: Record<TurnoverStatus, { label: string; color: string; bg: string; dot: string }> = {
  not_started: {
    label: "Not Started",
    color: "text-slate-600",
    bg: "bg-slate-100",
    dot: "bg-slate-400",
  },
  in_progress: {
    label: "In Progress",
    color: "text-blue-700",
    bg: "bg-blue-50",
    dot: "bg-blue-500",
  },
  blocked: {
    label: "Blocked",
    color: "text-red-700",
    bg: "bg-red-50",
    dot: "bg-red-500",
  },
  ready: {
    label: "Ready",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    dot: "bg-emerald-500",
  },
};

export const priorityConfig: Record<TurnoverPriority | TaskPriority, { label: string; color: string; bg: string }> = {
  low: {
    label: "Low",
    color: "text-slate-500",
    bg: "bg-slate-50",
  },
  medium: {
    label: "Medium",
    color: "text-amber-700",
    bg: "bg-amber-50",
  },
  high: {
    label: "High",
    color: "text-orange-700",
    bg: "bg-orange-50",
  },
  urgent: {
    label: "Urgent",
    color: "text-red-700",
    bg: "bg-red-50",
  },
};

export const taskStatusConfig: Record<TaskStatus, { label: string; color: string; bg: string; dot: string }> = {
  not_started: {
    label: "Not Started",
    color: "text-slate-600",
    bg: "bg-slate-100",
    dot: "bg-slate-400",
  },
  in_progress: {
    label: "In Progress",
    color: "text-blue-700",
    bg: "bg-blue-50",
    dot: "bg-blue-500",
  },
  done: {
    label: "Done",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    dot: "bg-emerald-500",
  },
  blocked: {
    label: "Blocked",
    color: "text-red-700",
    bg: "bg-red-50",
    dot: "bg-red-500",
  },
};

export const unitStatusConfig: Record<UnitStatus, { label: string; color: string; bg: string }> = {
  occupied: {
    label: "Occupied",
    color: "text-slate-600",
    bg: "bg-slate-100",
  },
  vacant: {
    label: "Vacant",
    color: "text-amber-700",
    bg: "bg-amber-50",
  },
  make_ready: {
    label: "Make Ready",
    color: "text-blue-700",
    bg: "bg-blue-50",
  },
  ready: {
    label: "Ready",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
};

// Number helpers
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatSqFt(sqft: number | null | undefined): string {
  if (!sqft) return "—";
  return `${sqft.toLocaleString()} sq ft`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Bed/Bath label
export function formatBedBath(beds: number | null, baths: number | null): string {
  const bedStr = beds !== null ? `${beds} bed` : null;
  const bathStr = baths !== null ? `${baths} bath` : null;
  return [bedStr, bathStr].filter(Boolean).join(" · ") || "—";
}
