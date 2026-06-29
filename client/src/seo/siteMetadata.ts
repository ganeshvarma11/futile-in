import { categories, getCategoryBySlug, getGuideBySlug, guides } from "@/data/site";

export const SITE_NAME = "futile.in";
export const SITE_URL = "https://www.futile.in";
export const DEFAULT_THEME_COLOR = "#f6f3ed";
export const DEFAULT_DESCRIPTION =
  "Structured free learning guides that help confused learners decide what to learn and where to start.";
export const DEFAULT_TITLE = `${SITE_NAME} | Free learning guides for confused beginners`;
export const DEFAULT_ROBOTS = "index, follow";

export type JsonLd = Record<string, unknown>;

export type RouteMetadata = {
  path: string;
  title: string;
  description: string;
  canonicalUrl: string;
  robots: string;
  ogType: "website" | "article";
  schema: JsonLd[];
  statusCode: number;
};

type StaticRouteDefinition = {
  path: string;
  changefreq: "daily" | "weekly" | "monthly";
  priority: string;
  sourceKey: string;
  title: string;
  description: string;
  schema: JsonLd[];
};

const STATIC_ROUTES: StaticRouteDefinition[] = [
  {
    path: "/",
    changefreq: "daily",
    priority: "1.0",
    sourceKey: "client/src/data/site.ts",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        description: DEFAULT_DESCRIPTION,
        inLanguage: "en-IN",
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/categories?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  },
  {
    path: "/about",
    changefreq: "monthly",
    priority: "0.6",
    sourceKey: "client/src/pages/About.tsx",
    title: `About ${SITE_NAME} | Why the guides are curated this way`,
    description:
      "Learn how futile.in curates beginner-friendly learning guides, reduces noise, and helps people choose better starting points.",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: `About ${SITE_NAME}`,
        url: `${SITE_URL}/about`,
        description:
          "How futile.in curates focused learning guides for confused beginners.",
      },
    ],
  },
  {
    path: "/categories",
    changefreq: "weekly",
    priority: "0.9",
    sourceKey: "client/src/pages/Categories.tsx",
    title: `Guide Categories | ${SITE_NAME}`,
    description:
      "Browse live learning guide categories for DSA, web development, fresher jobs, aptitude, Java, Python, SQL, and more.",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Guide categories",
        url: `${SITE_URL}/categories`,
        description:
          "Category overview page for the live guides available on futile.in.",
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: categories.length,
          itemListElement: categories.map((category, index) => {
            const guide = guides.find((entry) => entry.categorySlug === category.slug);
            return {
              "@type": "ListItem",
              position: index + 1,
              name: category.name,
              url: guide
                ? `${SITE_URL}/guides/${guide.slug}`
                : `${SITE_URL}/categories`,
            };
          }),
        },
      },
    ],
  },
  {
    path: "/channels",
    changefreq: "monthly",
    priority: "0.5",
    sourceKey: "client/src/pages/Channels.tsx",
    title: `Channels and Updates | ${SITE_NAME}`,
    description:
      "Follow the futile.in update channels for fresher jobs, curated resources, and project updates beyond the website.",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "futile.in channels",
        url: `${SITE_URL}/channels`,
        description:
          "Channel links where futile.in shares updates, jobs, and resources.",
      },
    ],
  },
  {
    path: "/feedback",
    changefreq: "monthly",
    priority: "0.4",
    sourceKey: "client/src/pages/Feedback.tsx",
    title: `Feedback and Guide Requests | ${SITE_NAME}`,
    description:
      "Suggest a new guide, report a broken link, request a category, or share feedback for futile.in.",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "futile.in feedback",
        url: `${SITE_URL}/feedback`,
        description:
          "Ways to send guide suggestions, broken-link reports, and general feedback.",
      },
    ],
  },
  {
    path: "/privacy",
    changefreq: "monthly",
    priority: "0.3",
    sourceKey: "client/src/pages/Privacy.tsx",
    title: `Privacy Policy | ${SITE_NAME}`,
    description:
      "Read the futile.in privacy policy in plain language, including what stays in your browser and what may involve the server.",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Privacy policy",
        url: `${SITE_URL}/privacy`,
        description:
          "Privacy details for futile.in and how the site handles browsing data.",
      },
    ],
  },
];

const STATIC_ROUTE_MAP = new Map(
  STATIC_ROUTES.map((route) => [route.path, route] as const)
);

export type SitemapEntry = {
  path: string;
  changefreq: "daily" | "weekly" | "monthly";
  priority: string;
  sourceKey: string;
};

function limitDescription(value: string, maxLength: number = 165) {
  if (value.length <= maxLength) {
    return value;
  }

  const shortened = value.slice(0, maxLength - 1);
  const safeCutoff = shortened.lastIndexOf(" ");

  return `${(safeCutoff > 80 ? shortened.slice(0, safeCutoff) : shortened).trim()}...`;
}

export function normalizePath(pathname: string) {
  const [rawPath] = pathname.split("?");
  const cleaned = rawPath.trim() || "/";

  if (cleaned === "/") {
    return "/";
  }

  return cleaned.endsWith("/") ? cleaned.slice(0, -1) || "/" : cleaned;
}

export function toAbsoluteUrl(pathname: string) {
  const normalizedPath = normalizePath(pathname);
  return normalizedPath === "/" ? `${SITE_URL}/` : `${SITE_URL}${normalizedPath}`;
}

function createBreadcrumbSchema(items: Array<{ name: string; path: string }>): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path),
    })),
  };
}

function getGuideMetadata(pathname: string): RouteMetadata | null {
  const match = /^\/guides\/([^/]+)$/.exec(pathname);
  if (!match) {
    return null;
  }

  const guide = getGuideBySlug(match[1]);
  if (!guide) {
    return null;
  }

  const category = getCategoryBySlug(guide.categorySlug);
  const canonicalUrl = toAbsoluteUrl(pathname);
  const title = `${guide.title} for beginners | ${SITE_NAME}`;
  const description = limitDescription(
    `${guide.summary} For ${guide.forWho.toLowerCase()}`
  );
  const totalResources = guide.groups.reduce(
    (count, group) => count + group.items.length,
    0
  );

  return {
    path: pathname,
    title,
    description,
    canonicalUrl,
    robots: DEFAULT_ROBOTS,
    ogType: "article",
    statusCode: 200,
    schema: [
      createBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Categories", path: "/categories" },
        { name: guide.title, path: pathname },
      ]),
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: guide.title,
        url: canonicalUrl,
        description,
        inLanguage: "en-IN",
        keywords: guide.searchTerms.join(", "),
        about: {
          "@type": "Thing",
          name: category?.name ?? guide.title,
        },
        audience: {
          "@type": "Audience",
          audienceType: guide.forWho,
        },
        isPartOf: {
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
        },
        mainEntity: {
          "@type": "ItemList",
          name: `${guide.title} sections`,
          numberOfItems: guide.groups.length,
          itemListOrder: "https://schema.org/ItemListOrderAscending",
          itemListElement: guide.groups.map((group, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: group.title,
            description: group.description,
          })),
        },
        hasPart: guide.groups.map((group) => ({
          "@type": "WebPageElement",
          name: group.title,
          description: group.description,
        })),
        mentions: {
          "@type": "Thing",
          name: `${totalResources} curated resources`,
        },
      },
    ],
  };
}

function getNotFoundMetadata(pathname: string): RouteMetadata {
  return {
    path: pathname,
    title: `Page not found | ${SITE_NAME}`,
    description:
      "The page you requested could not be found on futile.in.",
    canonicalUrl: toAbsoluteUrl(pathname === "/404" ? "/404" : pathname),
    robots: "noindex, follow",
    ogType: "website",
    statusCode: 404,
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Page not found",
        url: toAbsoluteUrl(pathname === "/404" ? "/404" : pathname),
        description: "404 page for futile.in.",
      },
    ],
  };
}

export function getRouteMetadata(pathname: string): RouteMetadata {
  const normalizedPath = normalizePath(pathname);
  const guideMetadata = getGuideMetadata(normalizedPath);

  if (guideMetadata) {
    return guideMetadata;
  }

  const staticRoute = STATIC_ROUTE_MAP.get(normalizedPath);
  if (staticRoute) {
    return {
      path: normalizedPath,
      title: staticRoute.title,
      description: limitDescription(staticRoute.description),
      canonicalUrl: toAbsoluteUrl(normalizedPath),
      robots: DEFAULT_ROBOTS,
      ogType: "website",
      statusCode: 200,
      schema:
        normalizedPath === "/"
          ? staticRoute.schema
          : [
              createBreadcrumbSchema([
                { name: "Home", path: "/" },
                {
                  name:
                    normalizedPath === "/categories"
                      ? "Categories"
                      : normalizedPath === "/channels"
                      ? "Channels"
                      : normalizedPath === "/feedback"
                      ? "Feedback"
                      : normalizedPath === "/privacy"
                      ? "Privacy"
                      : "About",
                  path: normalizedPath,
                },
              ]),
              ...staticRoute.schema,
            ],
    };
  }

  return getNotFoundMetadata(normalizedPath);
}

export function getPrerenderRoutes() {
  return [
    ...STATIC_ROUTES.map((route) => route.path),
    ...guides.map((guide) => `/guides/${guide.slug}`),
    "/404",
  ];
}

export function getSitemapEntries(): SitemapEntry[] {
  return [
    ...STATIC_ROUTES.map((route) => ({
      path: route.path,
      changefreq: route.changefreq,
      priority: route.priority,
      sourceKey: route.sourceKey,
    })),
    ...guides.map((guide) => ({
      path: `/guides/${guide.slug}`,
      changefreq: "weekly" as const,
      priority: guide.featured ? "0.9" : "0.8",
      sourceKey: "client/src/data/site.ts",
    })),
  ];
}
