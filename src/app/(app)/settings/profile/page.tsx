import { requireSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { ProfileInfoForm, ChangePasswordForm } from "@/components/settings/profile-forms";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ forceChange?: string }>;
}) {
  const session = await requireSession();
  const params = await searchParams;

  const employee = await prisma.employee.findUniqueOrThrow({ where: { id: session.user.id } });

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <div>
        <h1 className="text-lg font-semibold text-[var(--foreground)]">My Profile</h1>
        <p className="text-sm text-[var(--muted)]">Manage your personal details and password.</p>
      </div>
      <ProfileInfoForm fullName={employee.fullName} email={employee.email} phone={employee.phone} />
      <ChangePasswordForm forceChange={params.forceChange === "1" || employee.mustChangePassword} />
    </div>
  );
}
