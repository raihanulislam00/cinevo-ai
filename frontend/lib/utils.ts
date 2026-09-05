import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatDuration(seconds: number) { if (!seconds) return "0 sec"; return `${Math.floor(seconds / 60) ? `${Math.floor(seconds / 60)}m ` : ""}${seconds % 60}s`; }
export function formatDate(value: string) { return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value)); }