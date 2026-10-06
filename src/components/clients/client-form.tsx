"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createClient, updateClient, type ClientFormState } from "@/lib/actions/clients";

type CsOption = { id: string; fullName: string };

const STATUSES = ["LEAD", "PROPOSAL", "ONBOARDING", "ACTIVE", "PAUSED", "COMPLETED", "LOST", "ARCHIVED"];

export function ClientForm({
  mode,
  csOptions,
  initial,
}: {
  mode: "create" | "edit";
  csOptions: CsOption[];
  initial?: {
    id: string;
    clientName: string;
    companyName: string | null;
    contactPerson: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    facebook: string | null;
    instagram: string | null;
    industry: string | null;
    services: string | null;
    packageName: string | null;
    monthlyFee: string | null;
    startDate: string | null;
    renewalDate: string | null;
    assignedCsId: string | null;
    notes: string | null;
    status: string;
  };
}) {
  const action = mode === "create" ? createClient : updateClient;
  const [state, formAction, pending] = useActionState<ClientFormState, FormData>(action, {});
  const router = useRouter();

  useEffect(() => {
    if (state.success && state.clientId) {
      router.push(`/clients/${state.clientId}`);
      router.refresh();
    }
  }, [state, router]);

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={formAction} className="flex flex-col gap-5">
          {initial && <input type="hidden" name="id" value={initial.id} />}

          <Section title="Basics">
            <Field label="Client name" name="clientName" defaultValue={initial?.clientName} required />
            <Field label="Company name" name="companyName" defaultValue={initial?.companyName ?? ""} />
            <Field label="Contact person" name="contactPerson" defaultValue={initial?.contactPerson ?? ""} />
            <Field label="Industry" name="industry" defaultValue={initial?.industry ?? ""} />
          </Section>

          <Section title="Contact">
            <Field label="Phone" name="phone" defaultValue={initial?.phone ?? ""} />
            <Field label="Email" name="email" type="email" defaultValue={initial?.email ?? ""} />
            <Field label="Website" name="website" defaultValue={initial?.website ?? ""} />
            <Field label="Facebook" name="facebook" defaultValue={initial?.facebook ?? ""} />
            <Field label="Instagram" name="instagram" defaultValue={initial?.instagram ?? ""} />
          </Section>

          <Section title="Engagement">
            <Field label="Services" name="services" defaultValue={initial?.services ?? ""} />
            <Field label="Package" name="packageName" defaultValue={initial?.packageName ?? ""} />
            <Field label="Monthly fee" name="monthlyFee" type="number" step="0.01" defaultValue={initial?.monthlyFee ?? ""} />
            <Field label="Start date" name="startDate" type="date" defaultValue={initial?.startDate ?? ""} />
            <Field label="Renewal date" name="renewalDate" type="date" defaultValue={initial?.renewalDate ?? ""} />
            <div>
              <Label htmlFor="assignedCsId">Assigned CS</Label>
              <Select id="assignedCsId" name="assignedCsId" defaultValue={initial?.assignedCsId ?? ""}>
                <option value="">Unassigned</option>
                {csOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select id="status" name="status" defaultValue={initial?.status ?? "LEAD"}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0) + s.slice(1).toLowerCase()}
                  </option>
                ))}
              </Select>
            </div>
          </Section>

          <div>
            <Label htmlFor="notes">Internal notes</Label>
            <Textarea id="notes" name="notes" rows={3} defaultValue={initial?.notes ?? ""} />
          </div>

          {state.error && (
            <p className="rounded-md border border-[var(--danger)]/30 bg-[var(--danger-soft)] px-3 py-2 text-xs text-[var(--danger)]">
              {state.error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : mode === "create" ? "Create client" : "Save changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted-2)]">{title}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  step,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  type?: string;
  required?: boolean;
  step?: string;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} defaultValue={defaultValue ?? ""} required={required} step={step} />
    </div>
  );
}
