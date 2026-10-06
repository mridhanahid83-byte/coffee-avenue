"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createCampaign, updateCampaign, type CampaignFormState } from "@/lib/actions/campaigns";

type Option = { id: string; name: string };
const STATUSES = ["PLANNED", "ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"];

export function CampaignForm({
  mode,
  clients,
  employees,
  initial,
}: {
  mode: "create" | "edit";
  clients: Option[];
  employees: { id: string; fullName: string }[];
  initial?: {
    id: string;
    clientId: string;
    name: string;
    platform: string | null;
    objective: string | null;
    budget: string | null;
    startDate: string | null;
    endDate: string | null;
    responsibleId: string | null;
    status: string;
    notes: string | null;
    reportLink: string | null;
  };
}) {
  const action = mode === "create" ? createCampaign : updateCampaign;
  const [state, formAction, pending] = useActionState<CampaignFormState, FormData>(action, {});
  const router = useRouter();

  useEffect(() => {
    if (state.success && state.campaignId) {
      router.push(`/campaigns/${state.campaignId}`);
      router.refresh();
    }
  }, [state, router]);

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={formAction} className="flex flex-col gap-4">
          {initial && <input type="hidden" name="id" value={initial.id} />}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Campaign name</Label>
              <Input id="name" name="name" defaultValue={initial?.name} required />
            </div>
            <div>
              <Label htmlFor="clientId">Client</Label>
              <Select id="clientId" name="clientId" defaultValue={initial?.clientId} required>
                <option value="" disabled>
                  Select client
                </option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="platform">Platform</Label>
              <Input id="platform" name="platform" defaultValue={initial?.platform ?? ""} placeholder="Meta, Google, TikTok…" />
            </div>
            <div>
              <Label htmlFor="objective">Objective</Label>
              <Input id="objective" name="objective" defaultValue={initial?.objective ?? ""} placeholder="Awareness, leads, sales…" />
            </div>
            <div>
              <Label htmlFor="budget">Budget</Label>
              <Input id="budget" name="budget" type="number" step="0.01" defaultValue={initial?.budget ?? ""} />
            </div>
            <div>
              <Label htmlFor="responsibleId">Responsible</Label>
              <Select id="responsibleId" name="responsibleId" defaultValue={initial?.responsibleId ?? ""}>
                <option value="">Unassigned</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.fullName}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="startDate">Start date</Label>
              <Input id="startDate" name="startDate" type="date" defaultValue={initial?.startDate ?? ""} />
            </div>
            <div>
              <Label htmlFor="endDate">End date</Label>
              <Input id="endDate" name="endDate" type="date" defaultValue={initial?.endDate ?? ""} />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select id="status" name="status" defaultValue={initial?.status ?? "PLANNED"}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0) + s.slice(1).toLowerCase()}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="reportLink">Report link</Label>
              <Input id="reportLink" name="reportLink" defaultValue={initial?.reportLink ?? ""} placeholder="https://…" />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
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
              {pending ? "Saving…" : mode === "create" ? "Create campaign" : "Save changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
