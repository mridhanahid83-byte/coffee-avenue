"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createContentItem, updateContentItem, type ContentFormState } from "@/lib/actions/content";

const CONTENT_TYPES = ["Static", "Carousel", "Template", "Reel", "Motion", "Story", "Banner", "Other"];
const STAGES = [
  ["BRIEF", "Brief"],
  ["COPY", "Copy"],
  ["DESIGN", "Design"],
  ["INTERNAL_REVIEW", "Internal Review"],
  ["CLIENT_APPROVAL", "Client Approval"],
  ["REVISION", "Revision"],
  ["APPROVED", "Approved"],
  ["PUBLISHED", "Published"],
];

type Option = { id: string; name: string };

export function ContentForm({
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
    title: string;
    contentType: string;
    stage: string;
    copyStatus: string | null;
    designStatus: string | null;
    internalReview: string | null;
    clientApproval: string | null;
    revisionNotes: string | null;
    publishingStatus: string | null;
    assigneeId: string | null;
    deadline: string | null;
    publishedDate: string | null;
  };
}) {
  const action = mode === "create" ? createContentItem : updateContentItem;
  const [state, formAction, pending] = useActionState<ContentFormState, FormData>(action, {});
  const router = useRouter();

  useEffect(() => {
    if (state.success && state.contentId) {
      router.push(`/content/${state.contentId}`);
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
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={initial?.title} required />
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
              <Label htmlFor="contentType">Content type</Label>
              <Select id="contentType" name="contentType" defaultValue={initial?.contentType ?? ""} required>
                <option value="" disabled>
                  Select type
                </option>
                {CONTENT_TYPES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="stage">Pipeline stage</Label>
              <Select id="stage" name="stage" defaultValue={initial?.stage ?? "BRIEF"}>
                {STAGES.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="assigneeId">Assigned to</Label>
              <Select id="assigneeId" name="assigneeId" defaultValue={initial?.assigneeId ?? ""}>
                <option value="">Unassigned</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.fullName}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input id="deadline" name="deadline" type="date" defaultValue={initial?.deadline ?? ""} />
            </div>
            <div>
              <Label htmlFor="publishedDate">Published date</Label>
              <Input id="publishedDate" name="publishedDate" type="date" defaultValue={initial?.publishedDate ?? ""} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Copy status" name="copyStatus" defaultValue={initial?.copyStatus} />
            <Field label="Design status" name="designStatus" defaultValue={initial?.designStatus} />
            <Field label="Internal review" name="internalReview" defaultValue={initial?.internalReview} />
            <Field label="Client approval" name="clientApproval" defaultValue={initial?.clientApproval} />
            <Field label="Publishing status" name="publishingStatus" defaultValue={initial?.publishingStatus} />
          </div>

          <div>
            <Label htmlFor="revisionNotes">Revision notes</Label>
            <Textarea id="revisionNotes" name="revisionNotes" rows={2} defaultValue={initial?.revisionNotes ?? ""} />
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
              {pending ? "Saving…" : mode === "create" ? "Create content" : "Save changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string | null }) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} defaultValue={defaultValue ?? ""} />
    </div>
  );
}
