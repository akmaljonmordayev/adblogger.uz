import { Helmet } from "react-helmet-async";

const SITE = {
  name:    "ADBlogger",
  url:     "https://adblogger.uz",
  image:   "https://adblogger.uz/og-image.png",
  twitter: "@adblogger_uz",
  desc:    "O'zbekistonning eng yirik blogger va reklama platformasi. 500+ tasdiqlangan blogger. Reklama joylashtiring yoki daromad oling!",
};

/**
 * @param {Object} props
 * @param {string}  [props.title]        – Page-specific title (appended with " | ADBlogger")
 * @param {string}  [props.description]  – Meta description (max ~160 chars)
 * @param {string}  [props.canonical]    – Canonical path, e.g. "/bloggers"
 * @param {string}  [props.ogImage]      – Absolute URL to OG image
 * @param {boolean} [props.noindex]      – true → noindex,nofollow
 * @param {Object}  [props.schema]       – JSON-LD structured data object
 * @param {boolean} [props.isArticle]    – og:type = article
 */
export default function SEO({
  title,
  description,
  canonical,
  ogImage,
  noindex = false,
  schema,
  isArticle = false,
}) {
  const fullTitle = title
    ? `${title} | ${SITE.name}`
    : `${SITE.name} — O'zbekiston Blogger va Reklama Platformasi`;

  const desc   = description || SITE.desc;
  const image  = ogImage || SITE.image;
  const url    = canonical ? `${SITE.url}${canonical}` : SITE.url;

  return (
    <Helmet>
      {/* ── Basic ── */}
      <html lang="uz" />
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      {noindex
        ? <meta name="robots" content="noindex,nofollow" />
        : <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />
      }

      {/* ── Open Graph ── */}
      <meta property="og:type"        content={isArticle ? "article" : "website"} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url"         content={url} />
      <meta property="og:image"       content={image} />
      <meta property="og:image:alt"   content={fullTitle} />
      <meta property="og:site_name"   content={SITE.name} />
      <meta property="og:locale"      content="uz_UZ" />

      {/* ── Twitter / X ── */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:site"        content={SITE.twitter} />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image"       content={image} />

      {/* ── Structured data ── */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}

/* ─── Breadcrumb helper ──────────────────────────────────────────────────── */
export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": `https://adblogger.uz${item.path}`,
    })),
  };
}
