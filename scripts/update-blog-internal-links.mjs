#!/usr/bin/env node
/**
 * One-off content fix: point blog links at specific feature pages, repoint links
 * to the login-only /split-later, and drop leftover [VERIFIKASI] draft markers.
 *
 * Run after /collect-money/cara-pakai is live, since one edit links to it.
 *
 * Dry run (default) prints every edit and writes nothing:
 *   node scripts/update-blog-internal-links.mjs
 *
 * Apply (needs an admin JWT; sends PUT /api/blogs/:id with only content):
 *   ADMIN_TOKEN=xxx node scripts/update-blog-internal-links.mjs --apply
 *
 * Before applying, the current content of every edited post is saved to
 * scripts/blog-links-backup-<timestamp>.json. Restore with:
 *   ADMIN_TOKEN=xxx node scripts/update-blog-internal-links.mjs --restore <backup.json>
 */

import fs from "node:fs";
import path from "node:path";

const API_URL = process.env.API_URL || "https://splitbillbe.netlify.app";
const TOKEN = process.env.ADMIN_TOKEN;
const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const RESTORE_FILE = args.includes("--restore") ? args[args.indexOf("--restore") + 1] : null;

// The CMS editor's link markup. prepareBlogContent strips target/rel at render.
const open = (href) => `<a target="_blank" rel="noopener noreferrer nofollow" href="${href}">`;
const link = (href, text) => `${open(href)}${text}</a>`;

const BARE = "http://Splitbill.my.id";
const BARE_LOWER = "http://splitbill.my.id";
const WWW = "http://www.splitbill.my.id";

// Replaces `before + oldHref` when it occurs exactly once, keeping the anchor text.
const relink = (before, oldHref, href) => ({ find: `${before}${open(oldHref)}`, replace: `${before}${open(href)}` });
// Links `text` when `${pre}${text}` occurs exactly once.
const wrap = (pre, text, href) => ({ find: `${pre}${text}`, replace: `${pre}${link(href, text)}` });
// Replaces every occurrence; `count` guards against the content having changed.
const all = (find, replace, count) => ({ find, replace, count });

const EDITS = {
  "tips-atur-uang-kas-liburan-kelompok": [
    relink("yang jauh lebih praktis di ", BARE, "/split-bill-liburan"),
    relink("Cobain langsung fiturnya secara gratis di ", BARE, "/split-later/cara-pakai"),
  ],
  "hitung-patungan-tanpa-download-aplikasi": [relink("Buka ", WWW, "/split-bill")],
  "cara-hitung-pajak-restoran-service-charge-adil": [relink("Kamu bisa pakai ", WWW, "/split-bill")],
  "pengganti-line-split-bill-lebih-praktis": [relink("atau laptop di ", WWW, "/split-bill")],
  "fitur-split-later-splitbill": [
    relink("Masuk ke ", WWW, "/split-later/cara-pakai"),
    relink("Cobain fitur <strong>Split Later</strong> di ", BARE, "/split-later/cara-pakai"),
  ],
  "first-date-split-bill-atau-bayarin": [relink("Dan di sinilah ", BARE, "/split-bill")],
  "cara-split-bill-multiple-struk": [
    relink("Buka ", WWW, "/split-bill"),
    relink("yang penting ada </em>", BARE, "/split-later/cara-pakai"),
  ],
  "alternatif-line-split-bill": [
    {
      find: `${open(BARE_LOWER)}splitbill.my.id</a> di browser HP atau laptop kamu`,
      replace: `${open("/split-bill")}splitbill.my.id</a> di browser HP atau laptop kamu`,
    },
    relink("langsung aja buka 👉 ", BARE_LOWER, "/split-bill"),
  ],
  "alternatif-line-splitbill-masih-bisa-dipakai": [
    all("https://markdownlivepreview.com", "", 9),
    all(" [VERIFIKASI]", "", 2),
  ],
  "split-later-feature-split-bill": [
    all("https://splitbill.my.id/split-later?utm_source=blog", "/split-later/cara-pakai", 4),
  ],
  "split-bill-cara-gampang-bagi-tagihan": [wrap("<p>", "scan struk otomatis pakai AI", "/split-bill")],
  "fitur-split-bill-otomatis-anti-ribet": [wrap("Tinggal ", "scan struk, pilih item", "/split-bill")],
  "tips-split-bill-hemat-bukber": [wrap("Gunakan aplikasi seperti ", "<strong>SplitBill</strong>", "/split-bill")],
  "aktivitas-yang-cocok-pakai-split-bill": [
    wrap("pakai aplikasi ", "<strong>split bill otomatis</strong>", "/split-bill"),
    wrap("menggunakan ", "<strong>aplikasi split bill traveling</strong>", "/split-bill-liburan"),
  ],
  "cara-hitung-pajak-split-bill-rata-vs-proporsional": [
    wrap("gunakan ", "aplikasi split bill otomatis", "/split-bill"),
  ],
  "cara-menagih-hutang-ke-teman-tanpa-tidak-enak": [
    wrap("bantuan teknologi seperti ", "SplitBill", "/collect-money/cara-pakai"),
  ],
};

const authHeaders = TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {};

async function getBlog(slug) {
  const res = await fetch(`${API_URL}/api/blogs/${slug}`, { headers: authHeaders });
  if (!res.ok) throw new Error(`GET /api/blogs/${slug}: ${res.status} ${await res.text()}`);
  return (await res.json()).data;
}

async function putContent(id, content) {
  const res = await fetch(`${API_URL}/api/blogs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
}

const countOf = (content, find) => content.split(find).length - 1;

function applyEdits(content, edits) {
  let next = content;
  const problems = [];
  for (const { find, replace, count = 1 } of edits) {
    const found = countOf(next, find);
    if (found !== count) {
      problems.push(`expected ${count}, found ${found}: ${find.slice(0, 90)}`);
      continue;
    }
    next = next.split(find).join(replace);
    console.log(`    ✓ ${count}x ${find.slice(0, 80)}\n      → ${replace.slice(0, 80)}`);
  }
  return { next, problems };
}

async function restore(file) {
  if (!TOKEN) throw new Error("ADMIN_TOKEN is required for --restore");
  const backup = JSON.parse(fs.readFileSync(file, "utf8"));
  let ok = 0;
  for (const entry of backup) {
    try {
      await putContent(entry._id, entry.content);
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

  const plan = [];
  const failures = [];
  for (const [slug, edits] of Object.entries(EDITS)) {
    console.log(`● ${slug}`);
    const blog = await getBlog(slug);
    const { next, problems } = applyEdits(blog.content, edits);
    problems.forEach((problem) => failures.push(`${slug}: ${problem}`));
    plan.push({ blog, next });
  }

  if (failures.length) {
    console.log(`\n${failures.length} edit(s) did not match, nothing written:`);
    failures.forEach((failure) => console.log(`  ✗ ${failure}`));
    process.exit(1);
  }
  console.log(`\nAll edits match across ${plan.length} posts.`);
  if (!APPLY) return console.log("Dry run. Re-run with --apply to write.");

  const backupFile = path.join(
    "scripts",
    `blog-links-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`,
  );
  fs.writeFileSync(
    backupFile,
    JSON.stringify(plan.map(({ blog }) => ({ _id: blog._id, slug: blog.slug, content: blog.content })), null, 2),
  );
  console.log(`Backup: ${backupFile}`);

  let ok = 0;
  for (const { blog, next } of plan) {
    try {
      await putContent(blog._id, next);
      ok++;
      console.log(`  ✓ ${blog.slug}`);
    } catch (err) {
      console.log(`  ✗ ${blog.slug}: ${err.message}`);
    }
  }
  console.log(`\nUpdated ${ok}/${plan.length}. Restore with --restore ${backupFile}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
