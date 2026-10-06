import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral: "bg-[var(--surface-2)] text-[var(--muted)] border-[var(--border)]",
        accent: "bg-[var(--accent-soft)] text-[var(--accent)] border-transparent",
        success: "bg-[var(--success-soft)] text-[var(--success)] border-transparent",
        warning: "bg-[var(--warning-soft)] text-[var(--warning)] border-transparent",
        danger: "bg-[var(--danger-soft)] text-[var(--danger)] border-transparent",
        info: "bg-[var(--info-soft)] text-[var(--info)] border-transparent",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { Badge, badgeVariants };
