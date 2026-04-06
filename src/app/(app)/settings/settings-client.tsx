"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, User, Building2, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { updateProfile, updateCompany } from "@/lib/actions/settings";
import { forgotPassword } from "@/lib/actions/auth";
import { useToast } from "@/hooks/use-toast";

interface SettingsClientProps {
  userEmail: string;
  defaultName: string;
  defaultCompanyName: string;
}

export function SettingsClient({ userEmail, defaultName, defaultCompanyName }: SettingsClientProps) {
  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account and company preferences.
        </p>
      </div>
      <Separator />
      <ProfileSection defaultName={defaultName} />
      <CompanySection defaultCompanyName={defaultCompanyName} />
      <SecuritySection userEmail={userEmail} />
    </div>
  );
}

function ProfileSection({ defaultName }: { defaultName: string }) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { fullName: defaultName },
  });

  const onSubmit = async (data: { fullName: string }) => {
    setError(null);
    setSuccess(false);
    const result = await updateProfile({ fullName: data.fullName });
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      toast({ variant: "success", title: "Profile updated" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <User className="h-4.5 w-4.5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="success">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>Profile updated successfully.</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" placeholder="Your full name" {...register("fullName")} />
          </div>
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function CompanySection({ defaultCompanyName }: { defaultCompanyName: string }) {
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { name: defaultCompanyName },
  });

  const onSubmit = async (data: { name: string }) => {
    setError(null);
    const result = await updateCompany({ name: data.name });
    if (result?.error) {
      setError(result.error);
    } else {
      toast({ variant: "success", title: "Company updated" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100">
            <Building2 className="h-4.5 w-4.5 text-violet-600" />
          </div>
          <div>
            <CardTitle className="text-base">Company</CardTitle>
            <CardDescription>Update your company name</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="companyName">Company name</Label>
            <Input id="companyName" placeholder="Your company name" {...register("name")} />
          </div>
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function SecuritySection({ userEmail }: { userEmail: string }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePasswordReset = async () => {
    setLoading(true);
    const result = await forgotPassword({ email: userEmail });
    if (result?.success) {
      setSent(true);
      toast({ variant: "success", title: "Password reset email sent" });
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100">
            <Lock className="h-4.5 w-4.5 text-amber-600" />
          </div>
          <div>
            <CardTitle className="text-base">Security</CardTitle>
            <CardDescription>Manage your password</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Password</p>
            <p className="text-xs text-muted-foreground">
              Send a reset link to <span className="font-medium">{userEmail}</span>
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePasswordReset}
            disabled={loading || sent}
          >
            {sent ? (
              <><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Sent</>
            ) : loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
            ) : (
              "Reset Password"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
