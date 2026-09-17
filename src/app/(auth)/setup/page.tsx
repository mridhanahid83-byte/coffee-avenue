import { redirect } from "next/navigation";
import { isSetupComplete } from "@/lib/actions/setup";
import { SetupForm } from "./setup-form";

// This page gates whether the app can be entered at all, based on live
// database state. It must never be statically frozen at build time.
export const dynamic = "force-dynamic";

export default async function SetupPage() {
  if (await isSetupComplete()) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)] text-lg font-bold text-[var(--accent-foreground)]">
            FT
          </div>
          <h1 className="text-xl font-semibold text-[var(--foreground)]">FameTerra Agency OS</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">First-time setup — create the Super Admin account</p>
        </div>
        <SetupForm />
      </div>
    </div>
  );
}
