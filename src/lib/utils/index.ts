import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatToIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatRelativeTime(dateInput: string | Date | undefined) {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  const timeStr = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (diffInDays === 0) {
    return `Tadi pukul ${timeStr}`;
  } else if (diffInDays === 1) {
    return `Kemarin pukul ${timeStr}`;
  } else {
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
    });
  }
}

export function formatDate(
  dateInput: string | Date | undefined,
  includeTime = false,
) {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return date.toLocaleDateString("id-ID", options);
}

export function getDefaultActivityName(date: Date = new Date()) {
  return `Split Bill ${date.toLocaleDateString("id-ID", { day: "numeric", month: "long" })}`;
}

export function getAvatarUrl(user?: { email?: string | null; image?: string | null } | null) {
  if (user?.image) {
    return user.image;
  }
  const seed = user?.email || "default";
  return `https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4&scale=100&seed=${encodeURIComponent(seed)}`;
}

/** Dicebear avatar for a participant/friend name (split-bill people, chips, avatar grids). */
export function getFriendAvatarUrl(name: string, size: number = 64) {
  return `https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=${size}&scale=100&seed=${encodeURIComponent(name)}`;
}
