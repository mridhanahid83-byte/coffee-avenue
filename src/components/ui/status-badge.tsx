import { Badge, type BadgeProps } from "@/components/ui/badge";

type Tone = NonNullable<BadgeProps["variant"]>;

const MAPS: Record<string, Record<string, { label: string; tone: Tone }>> = {
  employeeStatus: {
    ACTIVE: { label: "Active", tone: "success" },
    INACTIVE: { label: "Inactive", tone: "neutral" },
    SUSPENDED: { label: "Suspended", tone: "danger" },
  },
  employeeType: {
    FULL_TIME: { label: "Full Time", tone: "neutral" },
    PART_TIME: { label: "Part Time", tone: "neutral" },
    INTERN: { label: "Intern", tone: "info" },
    FREELANCER: { label: "Freelancer", tone: "neutral" },
    OTHER: { label: "Other", tone: "neutral" },
  },
  clientStatus: {
    LEAD: { label: "Lead", tone: "neutral" },
    PROPOSAL: { label: "Proposal", tone: "info" },
    ONBOARDING: { label: "Onboarding", tone: "info" },
    ACTIVE: { label: "Active", tone: "success" },
    PAUSED: { label: "Paused", tone: "warning" },
    COMPLETED: { label: "Completed", tone: "accent" },
    LOST: { label: "Lost", tone: "danger" },
    ARCHIVED: { label: "Archived", tone: "neutral" },
  },
  taskStatus: {
    NOT_STARTED: { label: "Not Started", tone: "neutral" },
    IN_PROGRESS: { label: "In Progress", tone: "info" },
    WAITING_CLIENT: { label: "Waiting for Client", tone: "warning" },
    WAITING_REVIEW: { label: "Waiting for Review", tone: "warning" },
    REVISION: { label: "Revision", tone: "danger" },
    COMPLETED: { label: "Completed", tone: "success" },
    CANCELLED: { label: "Cancelled", tone: "neutral" },
  },
  taskPriority: {
    LOW: { label: "Low", tone: "neutral" },
    MEDIUM: { label: "Medium", tone: "info" },
    HIGH: { label: "High", tone: "warning" },
    URGENT: { label: "Urgent", tone: "danger" },
  },
  approvalStatus: {
    NOT_SUBMITTED: { label: "Not Submitted", tone: "neutral" },
    PENDING: { label: "Pending", tone: "warning" },
    APPROVED: { label: "Approved", tone: "success" },
    REJECTED: { label: "Rejected", tone: "danger" },
  },
  attendanceStatus: {
    PRESENT: { label: "Present", tone: "success" },
    LATE: { label: "Late", tone: "warning" },
    ABSENT: { label: "Absent", tone: "danger" },
    LEAVE: { label: "Leave", tone: "info" },
    HALF_DAY: { label: "Half Day", tone: "warning" },
    HOLIDAY: { label: "Holiday", tone: "accent" },
  },
  leaveStatus: {
    PENDING: { label: "Pending", tone: "warning" },
    APPROVED: { label: "Approved", tone: "success" },
    REJECTED: { label: "Rejected", tone: "danger" },
  },
  contentStage: {
    BRIEF: { label: "Brief", tone: "neutral" },
    COPY: { label: "Copy", tone: "info" },
    DESIGN: { label: "Design", tone: "info" },
    INTERNAL_REVIEW: { label: "Internal Review", tone: "warning" },
    CLIENT_APPROVAL: { label: "Client Approval", tone: "warning" },
    REVISION: { label: "Revision", tone: "danger" },
    APPROVED: { label: "Approved", tone: "success" },
    PUBLISHED: { label: "Published", tone: "accent" },
  },
  campaignStatus: {
    PLANNED: { label: "Planned", tone: "neutral" },
    ACTIVE: { label: "Active", tone: "success" },
    PAUSED: { label: "Paused", tone: "warning" },
    COMPLETED: { label: "Completed", tone: "accent" },
    CANCELLED: { label: "Cancelled", tone: "neutral" },
  },
};

export function StatusBadge({ type, value }: { type: keyof typeof MAPS; value: string }) {
  const entry = MAPS[type]?.[value] ?? { label: value, tone: "neutral" as Tone };
  return <Badge variant={entry.tone}>{entry.label}</Badge>;
}
