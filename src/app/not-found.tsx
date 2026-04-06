import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mb-6">
        <LogoMark size={56} />
      </div>
      <p className="text-6xl font-bold text-primary mb-2">404</p>
      <h1 className="text-2xl font-semibold text-foreground mb-2">Page not found</h1>
      <p className="text-muted-foreground text-sm max-w-sm mb-8">
        The page you're looking for doesn't exist or you don't have access to it.
      </p>
      <Button asChild>
        <Link href="/dashboard">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
    </div>
  );
}
