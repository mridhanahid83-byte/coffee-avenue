import { redirect } from "next/navigation";
import { isSetupComplete } from "@/lib/actions/setup";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function RootPage() {
  if (!(await isSetupComplete())) {
    redirect("/setup");
  }
  const session = await auth();
  redirect(session?.user ? "/dashboard" : "/login");
}
