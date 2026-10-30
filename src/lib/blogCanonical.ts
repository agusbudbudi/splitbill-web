// Posts that compete for the same search intent, mapped to the post that should
// rank. Canonical instead of a redirect: every post stays readable and this is
// undone by deleting a line. Replaces the CMS canonicalUrl, which some posts
// have set to the bare homepage.
const CANONICAL_POST_BY_SLUG: Record<string, string> = {
  "alternatif-line-splitbill-masih-bisa-dipakai": "alternatif-line-split-bill",
  "pengganti-line-split-bill-lebih-praktis": "alternatif-line-split-bill",
  "cara-hitung-pajak-restoran-service-charge-adil": "cara-hitung-split-bill-pajak-service-charge",
  "cara-hitung-pajak-split-bill-rata-vs-proporsional": "cara-hitung-split-bill-pajak-service-charge",
  "hitung-patungan-tanpa-download-aplikasi": "split-bill-online-tanpa-aplikasi",
  "split-later-feature-split-bill": "fitur-split-later-splitbill",
};

export const canonicalPostSlug = (slug: string) => CANONICAL_POST_BY_SLUG[slug] ?? slug;
