import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatDateRange(startDate: Date, endDate: Date | null) {
  const currentYear = new Date().getFullYear();
  const start = new Date(startDate);
  if (!endDate) {
    return start.toLocaleDateString("hu-HU", {
      year: start.getFullYear() === currentYear ? undefined : "numeric",
      month: "short",
      day: "numeric",
    });
  }
  const end = new Date(endDate);

  if (start.getFullYear() === currentYear && end.getFullYear() === currentYear) {
    if (start.getMonth() === end.getMonth()) {
      return `${start.toLocaleDateString("hu-HU", { month: "long" })} ${start.getDate()} - ${end.getDate()}`;
    }
    return `${start.toLocaleDateString("hu-HU", { month: "long", day: "numeric" })} - ${end.toLocaleDateString("hu-HU", { month: "long", day: "numeric" })}`;
  }

  const startFormatted = start.toLocaleDateString("hu-HU", { year: "numeric", month: "long", day: "numeric" });
  const endFormatted = end.toLocaleDateString("hu-HU", { year: "numeric", month: "long", day: "numeric" });
  return `${startFormatted} - ${endFormatted}`;
}

export function formatDate(d: string | Date) {
  const date = new Date(d);
  const currentYear = new Date().getFullYear();
  return date.toLocaleDateString("hu-HU", {
    year: date.getFullYear() === currentYear ? undefined : "numeric",
    month: "long",
    day: "numeric",
  });
}
export function dateDiffInDays(startDate: Date, endDate: Date) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}


export function formatDateTime(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };
  return date.toLocaleString("hu-HU", options);
}