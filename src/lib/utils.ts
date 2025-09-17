import { logOutCurrentUser } from "@/actions/user";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function base64ToImageFile(base64String: string, fileName: string) {
  const [header, data] = base64String.split(",");
  const mimeMatch = header.match(/:(.*?);/);
  const mimeString = mimeMatch ? mimeMatch[1] : "";
  const byteString = atob(data);
  const ab = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    ab[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([ab], { type: mimeString });

  const imageFile = new File([blob], fileName, { type: blob.type });

  return imageFile;
}

export const checkPathnames = (pathname, paths: string[]): boolean => {
  if (!pathname) return false;
  return paths.some((path) => {
    return pathname.includes(path);
  });
};

export const logoutUser = async () => {
  const loggedOut = await logOutCurrentUser();
  if (loggedOut?.success) {
    toast.success("You have been logged out successfully.");
    window.location.href = "/sign-in";
  } else {
    toast.error("Failed to log out. Please try again.");
    console.error("Logout failed");
  }
};

// lib/telegram.ts
export async function sendTelegramMessage(
  text: string,
  reply_markup: any = {},
  chatId: number | string = "-1002924181780",
) {
  const BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
  if (!BOT_TOKEN) throw new Error("BOT_TOKEN missing");

  const res = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        reply_markup,
        parse_mode: "MarkdownV2",
      }),
    },
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Telegram error: ${JSON.stringify(err)}`);
  }

  return res.json();
}
