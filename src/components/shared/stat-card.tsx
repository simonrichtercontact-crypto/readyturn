import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  iconClassName?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  description,
  iconClassName,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("hover:shadow-soft transition-shadow duration-200", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {label}
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
              {value}
            </p>
            {description && (
              <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              iconClassName || "bg-primary/10"
            )}
          >
            <Icon className={cn("h-5 w-5", iconClassName ? "" : "text-primary")} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
