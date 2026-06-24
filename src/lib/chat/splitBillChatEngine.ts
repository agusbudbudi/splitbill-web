/**
 * splitBillChatEngine.ts
 *
 * Pure factory functions that produce agent ChatMessage payloads.
 * No side-effects, no store access — easy to unit-test and extend.
 */
import type { ChatMessage, MessageType } from "@/store/useSplitBillChatStore";

type MessagePayload = Omit<ChatMessage, "id" | "timestamp">;

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function agentText(content: string, imageUrl?: string): MessagePayload {
  return { role: "agent", type: "text", content, imageUrl };
}

export function agentCard(
  content: string,
  type: MessageType,
  imageUrl?: string
): MessagePayload {
  return { role: "agent", type, content, imageUrl };
}

export function userText(content: string): MessagePayload {
  return { role: "user", type: "text", content };
}

// ─── Greeting (sent on first open) ───────────────────────────────────────────
export const GREETING_MESSAGES: MessagePayload[] = [
  agentText(
    "Halo! 👋 Kenalin, aku **Agent Billy**, asisten pribadi kamu buat urusan bagi-bagi tagihan (split bill) biar nggak ribet!",
    "/img/greetings-agent-billy.png"
  ),
  agentText(
    "Di sini, kita bakal selesaikan bareng-bareng secara santai: mulai dari nambahin temen, scan struk belanjaan/makanan pake AI, bagi-bagi itemnya, sampai ketahuan siapa bayar berapa. Praktis banget kan? ✨"
  ),
  agentCard(
    "Langkah pertama, **siapa aja nih teman-teman yang ikut makan atau patungan bareng kamu?** Yuk, tambahkan nama mereka di bawah ini 👇",
    "friend_picker"
  ),
];

// ─── After friends confirmed ──────────────────────────────────────────────────
export function friendsConfirmedMessages(names: string[]): MessagePayload[] {
  return [
    agentText(
      `Asyik, seru nih! Jadi ada **${names.join(", ")}** yang bakal patungan kali ini. Catat! 📝`
    ),
    agentCard(
      "Nah, sekarang giliran **foto atau upload struk belanjaan/makan malam kalian**. Biar Billy yang panggilin AI buat baca dan catat semua itemnya secara otomatis! 📸👇",
      "receipt_scan"
    ),
  ];
}

// ─── After receipt scanned ────────────────────────────────────────────────────
export function receiptConfirmedMessages(
  itemCount: number,
  merchantName: string | null
): MessagePayload[] {
  return [
    agentText(
      `Wah, beres! Billy berhasil nemuin **${itemCount} item**${merchantName ? ` dari **${merchantName}**` : ""} di struk kamu. 🧾✨`
    ),
    agentCard(
      "Sekarang, yuk kita bagi-bagi: **siapa makan/beli item apa** dan tentukan juga **siapa yang bayar tagihan utamanya** dulu ya! Silakan diatur dengan klik nama temenmu di bawah ini 👇",
      "item_assign"
    ),
  ];
}

// ─── After items assigned (with tax) ─────────────────────────────────────────
export function taxPromptMessages(): MessagePayload[] {
  return [
    agentText("Hore, semua item udah berhasil dibagi rata ke masing-masing orang! ✅"),
    agentCard(
      "Oh ya, Billy lihat ada pajak atau biaya tambahan lainnya di struk ini. Mau dibagi secara **rata (sama rata)** atau **proporsional** (sesuai porsi belanjaan masing-masing)? Pilihlah yang paling adil menurut kamu! 👇",
      "tax_method"
    ),
  ];
}

// ─── After items assigned (no tax) ───────────────────────────────────────────
export function noTaxActivityPromptMessages(): MessagePayload[] {
  return [
    agentText("Sip, pembagian item udah selesai semua! ✅"),
    agentCard(
      "Biar gampang diingat nanti, **apa nama kegiatannya?** (Misal: Makan Ramen, Liburan Bali, dll.) 👇",
      "activity_input"
    ),
  ];
}

// ─── After tax method set ─────────────────────────────────────────────────────
export function activityPromptMessages(): MessagePayload[] {
  return [
    agentText("Oke, biaya tambahan udah Billy catat! 👌"),
    agentCard(
      "Biar gampang diingat nanti, **apa nama kegiatannya?** (Misal: Makan Ramen, Liburan Bali, dll.) 👇",
      "activity_input"
    ),
  ];
}

// ─── After activity name set ──────────────────────────────────────────────────
export function activitySetMessages(activityName: string): MessagePayload[] {
  return [
    userText(`Namanya: ${activityName} 👍`),
    agentText(`Mantap! Kegiatan ini dinamai **${activityName}**.`),
    agentCard(
      "Terakhir (opsional), **mau dibayar ke mana?** Pilih dompet kamu biar teman-teman gampang transfernya. Kamu bisa lewati dulu, tambah metode baru di atas, atau mengaturnya nanti di langkah akhir wizard. 👇",
      "payment_picker"
    ),
  ];
}

// ─── After payment method set / skipped ───────────────────────────────────────
export function paymentSetMessages(count: number): MessagePayload[] {
  return [
    userText(count > 0 ? `Pilih ${count} metode pembayaran 👍` : "Lewati dulu pembayaran"),
    agentText(
      count > 0
        ? `Oke, Billy sudah simpan **${count} metode pembayaran** pilihanmu.`
        : "Siap, metode pembayaran dilewati dulu."
    ),
    agentCard(
      "Semua hitungan sudah beres nih! Berikut adalah **ringkasan pembayaran** final yang udah Billy hitung dengan teliti. Silakan dicek kembali! 👇",
      "summary"
    ),
  ];
}

// ─── After summary shown — ask for review ─────────────────────────────────────
export function reviewPromptMessages(): MessagePayload[] {
  return [
    agentText(
      "Senang bisa bantu kamu split bill hari ini! 🎉\n\nSebelum kamu pergi, boleh minta **feedback singkat** tentang pengalaman pakai Agent Billy? Cuma 1 menit kok, dan sangat berarti buat Billy berkembang! ⭐"
    ),
    agentCard(
      "Bayar makan habis begadang...<br>Untung Split Bill bikin tenang...<br>Kalau ada masukan atau bintang...<br>Kasih ke Billy ya, biar makin cemerlang...😎👇",
      "review_input"
    ),
  ];
}

// ─── After review submitted/skipped ──────────────────────────────────────────
export function reviewDoneMessages(skipped: boolean): MessagePayload[] {
  if (skipped) {
    return [
      agentText("No worries, mungkin lain kali ya! 😊 Sampai jumpa di split bill berikutnya. Klik **Lihat Ringkasan Lengkap** di atas untuk melihat semua detail. 🙌"),
    ];
  }
  return [
    agentText("Terima kasih banyak! Feedback kamu sangat berarti untuk Billy 🙏❤️\n\nKlik **Lihat Ringkasan Lengkap** di atas untuk melihat semua detail pembagian bill kamu!"),
  ];
}

