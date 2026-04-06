import Link from "next/link";
import { Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpgradeBannerProps {
  title: string;
  description: string;
  variant?: "inline" | "block";
}

export function UpgradeBanner({ title, description, variant = "block" }: UpgradeBannerProps) {
  if (variant === "inline") {
    return (
      <div className="flex items-center justify-between gap-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Lock className="h-4 w-4 text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-900">{title}</p>
            <p className="text-xs text-amber-700">{description}</p>
          </div>
        </div>
        <Button size="sm" asChild className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white">
          <Link href="/billing">
            <Zap className="h-3.5 w-3.5" />
            Upgrade
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
        <Zap className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground max-w-xs mx-auto">{description}</p>
      <Button className="mt-5" asChild>
        <Link href="/billing">
          <Zap className="h-4 w-4" />
          Upgrade Plan
        </Link>
      </Button>
    </div>
  );
}
