import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export function formatTime(date: Date | string | null | undefined) {
  if (!date) return "—";
  const d = new Date(date);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

export function formatDate(date: Date | string | null | undefined) {
  if (!date) return "—";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatDateTime(date: Date | string | null | undefined) {
  if (!date) return "—";
  const d = new Date(date);
  return `${formatDate(d)}, ${formatTime(d)}`;
}
