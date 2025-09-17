// app/api/telegram/route.ts

import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET; // value you set when calling setWebhook

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-telegram-bot-api-secret-token");
  if (TELEGRAM_SECRET && secret !== TELEGRAM_SECRET) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const update = await req.json();

  // Quick ACK to Telegram (respond within a few seconds)
  // Do minimal processing here. If heavy work needed, enqueue to a job queue or external service.
  try {
    // Example: handle different update types
    if (update.message) {
      const chatId = update.message.chat.id;
      const text = update.message.text ?? "";
      console.log("Received message:", chatId, text);

      // (Optional) reply synchronously — but best to call your own background worker
      // Example: send a reply using Telegram sendMessage
      // await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ chat_id: chatId, text: "Thanks, got your message!" })
      // });
    } else if (update.callback_query) {
      // handle button callback
    } else if (update.edited_message) {
      // handle edits
    }
    // handle other update types...
  } catch (err) {
    console.error("Error processing telegram update:", err);
    // still respond 200 so Telegram won't keep retrying rapidly for transient processing errors
  }

  return NextResponse.json({ ok: true });
}
