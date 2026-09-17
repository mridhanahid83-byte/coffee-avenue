"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { completeSetup, type SetupFormState } from "@/lib/actions/setup";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const initialState: SetupFormState = {};

export function SetupForm() {
  const [state, formAction, pending] = useActionState(completeSetup, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push("/login?setup=1");
    }
  }, [state.success, router]);

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" name="fullName" placeholder="Jane Doe" required autoComplete="name" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="admin@fameterra.com" required autoComplete="email" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="At least 8 characters" required minLength={8} autoComplete="new-password" />
          </div>

          {state.error && (
            <p className="rounded-md border border-[var(--danger)]/30 bg-[var(--danger-soft)] px-3 py-2 text-xs text-[var(--danger)]">
              {state.error}
            </p>
          )}

          <Button type="submit" disabled={pending} className="mt-2">
            {pending ? "Creating account…" : "Create Super Admin account"}
          </Button>

          <p className="text-center text-[11px] text-[var(--muted-2)]">
            This setup can only be completed once. After this, new accounts must be created by an administrator.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
