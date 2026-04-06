"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { forgotPassword } from "@/lib/actions/auth";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validations/auth";

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setServerError(null);
    const result = await forgotPassword(data);
    if (result?.error) {
      setServerError(result.error);
      setIsLoading(false);
    } else {
      setSent(true);
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-border bg-card p-10 shadow-card text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
            <Mail className="h-7 w-7 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Email sent</h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            If an account exists for <strong>{getValues("email")}</strong>, you&apos;ll
            receive a password reset link shortly.
          </p>
          <div className="mt-6">
            <Link href="/sign-in">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Reset your password
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading} size="lg">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </form>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
