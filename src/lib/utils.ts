import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num?: number | null): string {
  if (num === undefined || num === null || isNaN(num)) {
    return '0';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

export function formatCurrency(amount?: number | null, currency: string = "USD"): string {
  const safeAmount = amount === undefined || amount === null || isNaN(amount) ? 0 : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(safeAmount);
}

export function formatTokens(tokens?: number | null): string {
  const safeTokens = tokens === undefined || tokens === null || isNaN(tokens) ? 0 : tokens;
  return new Intl.NumberFormat("en-US").format(safeTokens);
}

export function timeAgo(date?: string | Date | null): string {
  if (!date) return "recently";
  const past = new Date(date).getTime();
  if (isNaN(past)) return "recently";
  const now = Date.now();
  const diffInSeconds = Math.max(0, Math.floor((now - past) / 1000));

  if (diffInSeconds < 60) return "just now";
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

