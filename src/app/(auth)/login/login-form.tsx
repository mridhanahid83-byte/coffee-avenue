"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { loginAction, type LoginFormState } from "@/lib/actions/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const initialState: LoginFormState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const router = useRouter();
  const submittedRef = useRef(false);

  useEffect(() => {
    if (submittedRef.current && !pending && !state.error) {
      router.push("/dashboard");
      router.refresh();
    }
  }, [state, pending, router]);

  return (
    <Card>
      <CardContent className="pt-6">
        <form
          action={(formData) => {
            submittedRef.current = true;
            formAction(formData);
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@fameterra.com" required autoComplete="email" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="Your password" required autoComplete="current-password" />
          </div>

          {state.error && (
            <p className="rounded-md border border-[var(--danger)]/30 bg-[var(--danger-soft)] px-3 py-2 text-xs text-[var(--danger)]">
              {state.error}
            </p>
          )}

          <Button type="submit" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
