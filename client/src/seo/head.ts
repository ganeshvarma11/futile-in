import {
  DEFAULT_THEME_COLOR,
  SITE_NAME,
  SITE_URL,
  type RouteMetadata,
} from "./siteMetadata";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeJsonForHtml(value: unknown) {
  return JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026");
}

export function renderHeadMarkup(metadata: RouteMetadata) {
  const socialDescription = metadata.description;
  const schemaMarkup = metadata.schema
    .map(
      (entry) =>
        `<script type="application/ld+json" data-route-schema="true">${escapeJsonForHtml(
          entry
        )}</script>`
    )
    .join("\n");

  return [
    `<title>${escapeHtml(metadata.title)}</title>`,
    `<meta name="description" content="${escapeHtml(metadata.description)}" />`,
    `<meta name="theme-color" content="${DEFAULT_THEME_COLOR}" />`,
    `<meta name="robots" content="${escapeHtml(metadata.robots)}" />`,
    `<link rel="canonical" href="${escapeHtml(metadata.canonicalUrl)}" />`,
    `<meta property="og:type" content="${metadata.ogType}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${escapeHtml(metadata.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(socialDescription)}" />`,
    `<meta property="og:url" content="${escapeHtml(metadata.canonicalUrl)}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${escapeHtml(metadata.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(socialDescription)}" />`,
    `<meta name="application-name" content="${SITE_NAME}" />`,
    `<meta name="apple-mobile-web-app-title" content="${SITE_NAME}" />`,
    schemaMarkup,
  ]
    .filter(Boolean)
    .join("\n");
}
