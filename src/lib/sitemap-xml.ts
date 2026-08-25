/**
 * Sitemap serializer.
 *
 * Next's built-in `sitemap.ts` metadata convention cannot be used here, for
 * two reasons that both show up as hard schema-validation failures (see
 * `resolveSitemap` in
 * node_modules/next/dist/build/webpack/loaders/metadata/resolve-route-data.js):
 *
 * 1. **Element order.** `tUrl` in the official sitemaps.org 0.9 schema is an
 *    `xsd:sequence` of `loc`, `lastmod?`, `changefreq?`, `priority?` and only
 *    *then* `<xsd:any namespace="##other"/>` — extension elements must come
 *    last. Next emits `xhtml:link` and `image:image` straight after `<loc>`,
 *    before `lastmod`, so every `<url>` carrying either extension fails to
 *    validate ("Element 'lastmod': This element is not expected").
 *
 * 2. **No escaping.** Next interpolates every value into the markup raw. That
 *    is survivable for plain page URLs, but `canonicalImageUrl` produces
 *    `/_next/image/?url=...&w=...&q=...`, whose `&` separators are malformed
 *    entity references, and `<image:caption>` carries admin-typed free text.
 *
 * So this module does the serialization itself: correct ordering, escaping at
 * the boundary (never in the data layer — `canonicalImageUrl`'s output also
 * goes through `JSON.stringify` for JSON-LD, where an `&amp;` would corrupt
 * the URL), and indentation so the raw file stays readable.
 */

export type ChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never';

/** One `<image:image>` entry. Field order here mirrors the order the Google
 *  image-sitemap schema requires them to be serialized in. */
export interface SitemapImage {
  loc: string;
  caption?: string;
  title?: string;
}

export interface SitemapEntry {
  loc: string;
  lastModified?: Date | string;
  changeFrequency?: ChangeFrequency;
  /** 0.0–1.0. */
  priority?: number;
  /** hreflang → absolute URL, emitted as `<xhtml:link rel="alternate">`. */
  alternates?: Record<string, string>;
  images?: SitemapImage[];
}

/**
 * Characters XML 1.0 cannot represent at all — not even as a numeric entity.
 * Card titles and labels are free text typed into the admin panel, so a stray
 * control character from a paste is a real possibility, and it would take the
 * whole document down rather than mangling one field.
 */
// eslint-disable-next-line no-control-regex
const INVALID_XML_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g;

function escapeText(value: string): string {
  return value
    .replace(INVALID_XML_CHARS, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(value: string): string {
  return escapeText(value).replace(/"/g, '&quot;');
}

/** W3C Datetime, as the `tLastmod` union requires. */
function formatLastmod(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : value;
}

function tag(indent: string, name: string, value: string): string {
  return `${indent}<${name}>${escapeText(value)}</${name}>\n`;
}

function serializeImage(image: SitemapImage): string {
  // Child order is fixed by the schema: loc, caption, geo_location, title,
  // license.
  let xml = '    <image:image>\n';
  xml += tag('      ', 'image:loc', image.loc);
  if (image.caption) xml += tag('      ', 'image:caption', image.caption);
  if (image.title) xml += tag('      ', 'image:title', image.title);
  xml += '    </image:image>\n';
  return xml;
}

function serializeEntry(entry: SitemapEntry): string {
  let xml = '  <url>\n';
  xml += tag('    ', 'loc', entry.loc);

  if (entry.lastModified !== undefined) {
    xml += tag('    ', 'lastmod', formatLastmod(entry.lastModified));
  }
  if (entry.changeFrequency) {
    xml += tag('    ', 'changefreq', entry.changeFrequency);
  }
  if (typeof entry.priority === 'number') {
    xml += tag('    ', 'priority', entry.priority.toFixed(1));
  }

  // Extension elements last — see the ordering note at the top of this file.
  for (const [hreflang, href] of Object.entries(entry.alternates ?? {})) {
    xml +=
      `    <xhtml:link rel="alternate" hreflang="${escapeAttr(hreflang)}"` +
      ` href="${escapeAttr(href)}" />\n`;
  }

  // A page can legitimately render the same photo twice (a card reused in two
  // sections, say); the sitemap should still name it once.
  const seen = new Set<string>();
  for (const image of entry.images ?? []) {
    if (seen.has(image.loc)) continue;
    seen.add(image.loc);
    xml += serializeImage(image);
  }

  xml += '  </url>\n';
  return xml;
}

export function serializeSitemap(entries: SitemapEntry[]): string {
  const hasAlternates = entries.some(
    (entry) => Object.keys(entry.alternates ?? {}).length > 0,
  );
  const hasImages = entries.some((entry) => entry.images?.length);

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
  if (hasImages) {
    xml += '\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"';
  }
  if (hasAlternates) {
    xml += '\n        xmlns:xhtml="http://www.w3.org/1999/xhtml"';
  }
  xml += '>\n';
  for (const entry of entries) xml += serializeEntry(entry);
  xml += '</urlset>\n';
  return xml;
}
