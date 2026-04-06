"use client";

import { useEffect } from "react";
import { Zap, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 mb-6">
        <Zap className="h-7 w-7 text-destructive" />
      </div>
      <h1 className="text-2xl font-semibold text-foreground mb-2">Something went wrong</h1>
      <p className="text-muted-foreground text-sm max-w-sm mb-8">
        An unexpected error occurred. Please try again or go back to the dashboard.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={reset}>
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
        <Button asChild>
          <a href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </a>
        </Button>
      </div>
    </div>
  );
}
