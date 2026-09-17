"use client";

import { useActionState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateOwnProfile, changePasswordAction, type ProfileFormState, type ChangePasswordState } from "@/lib/actions/auth";

export function ProfileInfoForm({ fullName, email, phone }: { fullName: string; email: string; phone: string | null }) {
  const [state, formAction, pending] = useActionState<ProfileFormState, FormData>(updateOwnProfile, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>My profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" name="fullName" defaultValue={fullName} required />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={email} disabled />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" defaultValue={phone ?? ""} />
          </div>
          {state.error && <p className="text-xs text-[var(--danger)]">{state.error}</p>}
          {state.success && <p className="text-xs text-[var(--success)]">Profile updated.</p>}
          <div className="flex justify-end">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function ChangePasswordForm({ forceChange }: { forceChange?: boolean }) {
  const [state, formAction, pending] = useActionState<ChangePasswordState, FormData>(changePasswordAction, {});
  const { update } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      update({ mustChangePassword: false }).then(() => router.refresh());
    }
  }, [state.success, update, router]);

  return (
    <Card id="password">
      <CardHeader>
        <CardTitle>Change password</CardTitle>
      </CardHeader>
      <CardContent>
        {forceChange && (
          <p className="mb-4 rounded-md border border-[var(--warning)]/30 bg-[var(--warning-soft)] px-3 py-2 text-xs text-[var(--warning)]">
            You&apos;re using a temporary password. Please set a new password to continue.
          </p>
        )}
        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="currentPassword">Current password</Label>
            <Input id="currentPassword" name="currentPassword" type="password" required autoComplete="current-password" />
          </div>
          <div>
            <Label htmlFor="newPassword">New password</Label>
            <Input id="newPassword" name="newPassword" type="password" required minLength={8} autoComplete="new-password" />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" />
          </div>
          {state.error && <p className="text-xs text-[var(--danger)]">{state.error}</p>}
          {state.success && <p className="text-xs text-[var(--success)]">Password changed successfully.</p>}
          <div className="flex justify-end">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Change password"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
