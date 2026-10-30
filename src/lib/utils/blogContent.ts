import { slugify } from "@/lib/utils/index";

export interface BlogHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

// The page already renders the post title as its only H1, so any H1 inside
// the CMS body is demoted to H2.
const demoteH1 = (html: string) => html.replace(/<(\/?)h1(?=[\s>])/gi, "<$1h2");

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  ndash: "–",
  mdash: "—",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
};

// Single pass, so an escaped "&amp;lt;" becomes "&lt;", not "<".
const decodeEntities = (text: string) =>
  text.replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === "#") {
      const n = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) && n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : match;
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? match;
  });

// Links to this site as pasted into the CMS: bare or http domains, and a
// relative link that picked up the Markdown previewer's domain on paste.
const SITE_ORIGIN = /^(?:https?:)?\/\/(?:(?:www\.)?splitbill\.my\.id|markdownlivepreview\.com)(?=[/?#]|$)/i;
const NEW_TAB_ATTRS = /\s(?:target|rel)=(?:"[^"]*"|'[^']*')/gi;

const toSitePath = (href: string): string | null => {
  const path = href.startsWith("/") && !href.startsWith("//") ? href : href.replace(SITE_ORIGIN, "");
  if (path === href && !href.startsWith("/")) return null;
  if (path.startsWith("//")) return null;

  const url = new URL(decodeEntities(path) || "/", "https://www.splitbill.my.id");
  for (const key of [...url.searchParams.keys()]) {
    if (key.startsWith("utm_")) url.searchParams.delete(key);
  }
  return `${url.pathname}${url.search.replace(/&/g, "&amp;")}${url.hash}`;
};

// The CMS editor marks every link new-tab + nofollow, which drops the link
// signal internal pages need and sends crawlers through redirects. Same-site
// links become plain relative links; external ones are left alone.
const normalizeSiteLinks = (html: string) =>
  html.replace(/<a\b[^>]*>/gi, (tag) => {
    const href = tag.match(/\shref=(?:"([^"]*)"|'([^']*)')/i);
    const path = href && toSitePath(href[1] ?? href[2]);
    if (!href || !path) return tag;
    return tag.replace(NEW_TAB_ATTRS, "").replace(href[0], ` href="${path}"`);
  });

const ID_ATTR = /\sid=["']([^"']+)["']/i;

// Ids are compared decoded: the DOM id (what the TOC href and getElementById
// match) is the attribute value with its entities resolved.
const idsIn = (html: string) =>
  Array.from(html.matchAll(/\sid=["']([^"']+)["']/gi), (m) => decodeEntities(m[1]));

/**
 * Normalises CMS HTML for the article page: makes same-site links relative,
 * demotes H1s and gives every H2/H3 a unique id so the table of contents can
 * link to it. A CMS-set heading id is kept unless an earlier heading or any
 * non-heading element already uses it; generated ids also avoid every id that
 * appears anywhere in the body.
 */
export const prepareBlogContent = (content: string): { html: string; headings: BlogHeading[] } => {
  const source = normalizeSiteLinks(demoteH1(content));
  const headings: BlogHeading[] = [];
  const reserved = new Set(idsIn(source));
  const nonHeadingIds = new Set(idsIn(source.replace(/<h[23](?=[\s>])[^>]*>/gi, "")));
  const used = new Set<string>();

  const uniqueId = (base: string) => {
    let id = base;
    for (let n = 2; used.has(id) || reserved.has(id); n++) id = `${base}-${n}`;
    return id;
  };

  const html = source.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (match, level: string, attrs: string, inner: string) => {
      const text = decodeEntities(inner.replace(/<[^>]+>/g, "")).trim();
      if (!text) return match;

      const rawId = attrs.match(ID_ATTR)?.[1];
      const existingId = rawId ? decodeEntities(rawId) : undefined;
      let id: string;
      let nextAttrs = attrs;
      if (existingId && !used.has(existingId) && !nonHeadingIds.has(existingId)) {
        id = existingId;
      } else {
        id = uniqueId(slugify(text) || `bagian-${headings.length + 1}`);
        nextAttrs = existingId ? attrs.replace(ID_ATTR, ` id="${id}"`) : ` id="${id}"${attrs}`;
      }
      used.add(id);
      headings.push({ id, text, level: Number(level) as 2 | 3 });

      return nextAttrs === attrs ? match : `<h${level}${nextAttrs}>${inner}</h${level}>`;
    },
  );

  return { html, headings };
};
