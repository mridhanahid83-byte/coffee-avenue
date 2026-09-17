import { redirect } from "next/navigation";
import { isSetupComplete } from "@/lib/actions/setup";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  if (!(await isSetupComplete())) {
    redirect("/setup");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)] text-lg font-bold text-[var(--accent-foreground)]">
            FT
          </div>
          <h1 className="text-xl font-semibold text-[var(--foreground)]">FameTerra Agency OS</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Sign in to your FameTerra Digital Agency account</p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-[11px] text-[var(--muted-2)]">
          Accounts are created by your administrator. Contact them if you need access.
        </p>
      </div>
    </div>
  );
}
