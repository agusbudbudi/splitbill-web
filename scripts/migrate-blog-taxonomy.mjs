#!/usr/bin/env node
/**
 * One-off migration: collapse blog tags (92 -> 10) and categories (15 -> 5).
 *
 * Dry run (default) prints old -> new per post and writes nothing:
 *   node scripts/migrate-blog-taxonomy.mjs
 *   ADMIN_TOKEN=xxx node scripts/migrate-blog-taxonomy.mjs        # also includes drafts
 *
 * Apply (needs an admin JWT; sends PUT /api/blogs/:id with only tags + category):
 *   ADMIN_TOKEN=xxx node scripts/migrate-blog-taxonomy.mjs --apply
 *
 * Before applying, the current tags/category of every post are saved to
 * scripts/blog-taxonomy-backup-<timestamp>.json. Restore with:
 *   ADMIN_TOKEN=xxx node scripts/migrate-blog-taxonomy.mjs --restore <backup.json>
 */

import fs from "node:fs";
import path from "node:path";

const API_URL = process.env.API_URL || "https://splitbillbe.netlify.app";
const TOKEN = process.env.ADMIN_TOKEN;
const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const RESTORE_FILE = args.includes("--restore") ? args[args.indexOf("--restore") + 1] : null;

// New tag -> old tags (matched case-insensitively).
const TAG_MAP = {
  "Aplikasi Split Bill": [
    "aplikasi split bill", "aplikasi split bill gratis", "aplikasi split bill tanpa unduh",
    "split bill app", "web app split bill", "website split bill gratis", "split bill online",
    "split bill tanpa aplikasi", "split bill tanpa install", "hitung patungan lewat browser",
    "kalkulator split bill", "patungan online", "perbandingan", "bagi tagihan online",
    "fitur split bill", "split bill e-wallet", "split bill gopay", "fitur split bill shopeepay",
  ],
  "Cara Split Bill": [
    "cara split bill", "cara split bill online", "cara hitung split bill", "cara bagi tagihan grup",
    "cara patungan adil", "split bill adil", "split bill proporsional", "bagi tagihan restoran adil",
    "split bill restoran", "patungan makan", "split bill adalah", "arti split bill",
  ],
  "Pajak & Service Charge": [
    "cara hitung pajak split bill", "hitung pajak split bill", "kalkulator pajak restoran",
    "pajak restoran", "pb1", "pb1 restoran", "service charge", "service charge restoran",
  ],
  "Scan Struk": [
    "scan bill", "scan struk ai", "upload receipt", "kumpulin struk", "cara split bill banyak struk",
    "split bill multiple struk", "patungan banyak transaksi", "split bill otomatis",
  ],
  "Liburan Bareng": [
    "aplikasi patungan liburan", "patungan liburan", "patungan trip", "split bill liburan",
    "split bill trip", "kalkulator split bill liburan", "liburan bareng teman", "traveling bareng",
    "catat utang liburan kelompok",
  ],
  "Alternatif LINE Split Bill": [
    "alternatif line split bill", "alternatif line splitbill", "line splitbill",
    "line split bill tutup", "pengganti line split bill",
  ],
  "Split Later": ["split later", "fitur split later", "split bill nanti"],
  "Etika Patungan": [
    "etika split bill", "split bill awkward", "pertemanan", "menagih hutang", "first date bayarin",
    "first date split bill", "kencan pertama bayar siapa", "tips first date",
  ],
  "Tips Keuangan": [
    "tips keuangan", "gen-z keuangan", "manajemen uang", "hemat", "nabung bareng",
    "expense tracker", "group expense", "lunch strategy", "tips kantor",
  ],
  Nongkrong: ["nongkrong", "nongkrong hemat", "bukber"],
};

// Too generic (or just the brand) to tell posts apart; removed.
const DROP_TAGS = new Set(["split bill", "patungan", "bagi tagihan", "gaya hidup", "splitbill.my.id"]);

// New category -> old categories.
const CATEGORY_MAP = {
  "Tips & Cara Pakai": ["Tips & Cara Pakai", "Tips Split Bill", "Tips & Trik"],
  "Gaya Hidup": ["Gaya Hidup & Liburan", "Lifestyle", "Lifestyle & Tips", "Tips & Lifestyle"],
  "Edukasi Keuangan": ["Edukasi Keuangan", "Lifestyle & Tips Keuangan"],
  "Rekomendasi Aplikasi": ["Rekomendasi Aplikasi", "Alternatif Split Bill", "Tips & Rekomendasi"],
  "Update Fitur": ["Fitur Baru", "Product Update", "Product Feature"],
};

const tagLookup = new Map(
  Object.entries(TAG_MAP).flatMap(([next, olds]) => olds.map((o) => [o.toLowerCase(), next])),
);
const categoryLookup = new Map(
  Object.entries(CATEGORY_MAP).flatMap(([next, olds]) => olds.map((o) => [o.toLowerCase(), next])),
);

const authHeaders = TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {};

async function fetchAllBlogs() {
  const all = [];
  for (let page = 1; ; page++) {
    // API caps limit at 50; status=all only takes effect for admins.
    const res = await fetch(`${API_URL}/api/blogs?page=${page}&limit=50&status=all`, {
      headers: authHeaders,
    });
    if (!res.ok) throw new Error(`GET /api/blogs page ${page}: ${res.status} ${await res.text()}`);
    const json = await res.json();
    all.push(...(json.data || []));
    if (page >= (json.pagination?.totalPages || 1)) break;
  }
  return all;
}

async function putBlog(id, body) {
  const res = await fetch(`${API_URL}/api/blogs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
}

function migrate(blog) {
  const unmapped = [];
  const tags = [];
  for (const tag of blog.tags || []) {
    const key = tag.trim().toLowerCase();
    if (DROP_TAGS.has(key)) continue;
    const next = tagLookup.get(key);
    if (!next) unmapped.push(tag);
    const value = next || tag.trim();
    if (!tags.includes(value)) tags.push(value);
  }
  const category = categoryLookup.get((blog.category || "").trim().toLowerCase());
  return { tags, category: category || blog.category, unmapped, unmappedCategory: !category };
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

async function restore(file) {
  if (!TOKEN) throw new Error("ADMIN_TOKEN is required for --restore");
  const backup = JSON.parse(fs.readFileSync(file, "utf8"));
  let ok = 0;
  for (const entry of backup) {
    try {
      await putBlog(entry._id, { tags: entry.tags, category: entry.category });
      ok++;
      console.log(`  ✓ ${entry.slug}`);
    } catch (err) {
      console.log(`  ✗ ${entry.slug}: ${err.message}`);
    }
  }
  console.log(`\nRestored ${ok}/${backup.length}`);
}

async function main() {
  if (RESTORE_FILE) return restore(RESTORE_FILE);
  if (APPLY && !TOKEN) throw new Error("ADMIN_TOKEN is required for --apply");

  const blogs = await fetchAllBlogs();
  console.log(`${blogs.length} posts from ${API_URL}${TOKEN ? " (admin: incl. drafts)" : " (published only)"}\n`);

  const plan = [];
  const warnings = [];
  for (const blog of blogs) {
    const next = migrate(blog);
    const changed = !same(next.tags, blog.tags || []) || next.category !== blog.category;
    if (next.unmapped.length) warnings.push(`${blog.slug}: unmapped tags kept as-is → ${next.unmapped.join(", ")}`);
    if (next.unmappedCategory) warnings.push(`${blog.slug}: unmapped category kept → ${blog.category}`);

    console.log(`${changed ? "●" : "○"} ${blog.slug}${blog.status === "draft" ? " [draft]" : ""}`);
    if (next.category !== blog.category) console.log(`    category: ${blog.category} → ${next.category}`);
    console.log(`    tags: [${(blog.tags || []).join(", ")}]`);
    console.log(`       → [${next.tags.join(", ")}]`);
    if (changed) plan.push({ blog, next });
  }

  const tagCounts = {};
  const catCounts = {};
  for (const blog of blogs) {
    const next = migrate(blog);
    next.tags.forEach((t) => (tagCounts[t] = (tagCounts[t] || 0) + 1));
    catCounts[next.category] = (catCounts[next.category] || 0) + 1;
  }
  console.log("\nResulting tags:");
  Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).forEach(([t, n]) => console.log(`  ${n}  ${t}`));
  console.log("\nResulting categories:");
  Object.entries(catCounts).sort((a, b) => b[1] - a[1]).forEach(([c, n]) => console.log(`  ${n}  ${c}`));
  if (warnings.length) {
    console.log("\nWarnings:");
    warnings.forEach((w) => console.log(`  ! ${w}`));
  }
  console.log(`\n${plan.length} of ${blogs.length} posts would change.`);

  if (!APPLY) {
    console.log("Dry run only. Re-run with ADMIN_TOKEN=... --apply to write.");
    return;
  }

  const backupFile = path.join(
    path.dirname(new URL(import.meta.url).pathname),
    `blog-taxonomy-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`,
  );
  fs.writeFileSync(
    backupFile,
    JSON.stringify(blogs.map((b) => ({ _id: b._id, slug: b.slug, tags: b.tags || [], category: b.category })), null, 2),
  );
  console.log(`\nBackup written: ${backupFile}\nApplying...`);

  let ok = 0;
  for (const { blog, next } of plan) {
    try {
      await putBlog(blog._id, { tags: next.tags, category: next.category });
      ok++;
      console.log(`  ✓ ${blog.slug}`);
    } catch (err) {
      console.log(`  ✗ ${blog.slug}: ${err.message}`);
    }
  }
  console.log(`\nUpdated ${ok}/${plan.length}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
