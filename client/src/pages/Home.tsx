import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ShareButton from "@/components/ShareButton";
import { categories, getGuidesForCategory, guides } from "@/data/site";
import { Link, useLocation } from "wouter";

type SearchResult = {
  id: string;
  label: string;
  href: string;
  kind: "Guide" | "Category";
  description: string;
  score: number;
};

const homeDescriptionOverrides: Record<string, string> = {
  dsa: "Placements, interviews, and problem solving.",
  "web-development": "Frontend, backend, JavaScript, and project paths.",
  "coding-resources": "Programming foundations and practice resources.",
  java: "Java learning, DSA, backend basics, and interview prep.",
  python: "Python learning, DSA, backend basics, and interview prep.",
  javascript: "JavaScript learning, browser basics, Node.js, and interview prep.",
  cpp: "C++ learning, STL, DSA, competitive programming, and interview prep.",
  "sql-dbms": "SQL learning, DBMS basics, practice, and interview prep.",
  "core-cs-interview-prep": "OS, CN, OOP, and core CS interview revision.",
  "aptitude-reasoning": "Quant and reasoning for placements and exams.",
  "fresher-jobs": "Internships and entry-level job resources.",
};

const scoreMatch = (parts: string[], query: string) =>
  parts.reduce((score, part) => {
    const value = part.toLowerCase();
    if (value === query) return score + 120;
    if (value.startsWith(query)) return score + 80;
    if (value.includes(` ${query}`)) return score + 52;
    if (value.includes(query)) return score + 28;
    return score;
  }, 0);

export default function Home() {
  const [query, setQuery] = useState("");
  const [, navigate] = useLocation();

  const searchResults = useMemo<SearchResult[]>(() => {
    const cleaned = query.trim().toLowerCase();
    if (!cleaned) return [];

    const guideResults = guides
      .flatMap(guide => {
        const score = scoreMatch(
          [
            guide.title,
            guide.summary,
            guide.categorySlug,
            ...guide.searchTerms,
          ],
          cleaned
        );

        return score > 0
          ? [{
              id: guide.slug,
              label: guide.title,
              href: `/guides/${guide.slug}`,
              kind: "Guide" as const,
              description: guide.summary,
              score,
            }]
          : [];
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    const categoryResults = categories
      .flatMap(category => {
        const firstGuide = getGuidesForCategory(category.slug)[0];
        const score = scoreMatch(
          [category.name, category.description, category.forWho],
          cleaned
        );

        if (score === 0) return [];

        return [{
          id: category.slug,
          label: category.name,
          href: firstGuide
            ? `/guides/${firstGuide.slug}`
            : `/categories#${category.slug}`,
          kind: "Category" as const,
          description: category.description,
          score,
        }];
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return [...guideResults, ...categoryResults]
      .sort((a, b) => b.score - a.score)
      .slice(0, 7);
  }, [query]);

  const liveCategories = useMemo(
    () =>
      categories
        .map(category => {
          const categoryGuides = getGuidesForCategory(category.slug);
          const firstGuide = categoryGuides[0];
          const resourceCount = categoryGuides.reduce(
            (count, guide) =>
              count +
              guide.groups.reduce(
                (groupCount, group) => groupCount + group.items.length,
                0
              ),
            0
          );

          return {
            ...category,
            guideCount: categoryGuides.length,
            resourceCount,
            homeDescription:
              homeDescriptionOverrides[category.slug] ?? category.description,
            href: firstGuide
              ? `/guides/${firstGuide.slug}`
              : `/categories#${category.slug}`,
          };
        })
        .filter(category => category.guideCount > 0),
    []
  );

  const totalResourceCount = useMemo(
    () =>
      guides.reduce(
        (count, guide) =>
          count +
          guide.groups.reduce(
            (groupCount, group) => groupCount + group.items.length,
            0
          ),
        0
      ),
    []
  );
  const homeShareUrl =
    typeof window === "undefined" ? "/" : window.location.href;
  const featuredCategories = liveCategories.slice(0, 5);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (searchResults[0]) {
      navigate(searchResults[0].href);
      return;
    }

    navigate("/categories");
  };

  return (
    <div className="site-container py-10 sm:py-14">
      <div className="page-frame home-frame">
        <section className="home-hero">
          <div className="home-hero-header">
            <div className="space-y-3">
              <p className="eyebrow">Curated categories</p>
              <h1 className="home-hero-title">
                Free learning guides by category.
              </h1>
              <p className="home-hero-description">
                Search, browse, and open the right starting point without
                digging through dozens of tabs first.
              </p>
            </div>
            <ShareButton
              title="futile.in"
              url={homeShareUrl}
              text="Free learning guides by category."
              idleLabel="Share page"
              className="home-share-button"
            />
          </div>

          <div className="home-section-strip">
            <p className="home-section-label">Sections</p>
            <div className="home-section-pills">
              {featuredCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={category.href}
                  className="home-section-pill"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative mt-2 max-w-4xl">
            <div className="search-shell home-search-shell">
              <Search size={18} className="text-[var(--muted-foreground)]" />
              <input
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Search DSA, fresher jobs, aptitude, interview..."
                className="search-input"
                aria-label="Search guides and categories"
              />
              <button type="submit" className="search-button">
                Open
              </button>
            </div>

            {query.trim() ? (
              <div className="search-results">
                {searchResults.length > 0 ? (
                  <>
                    <div className="search-tip">
                      Press Enter to open <span>{searchResults[0].label}</span>
                    </div>
                    {searchResults.map(result => (
                      <Link
                        key={result.id}
                        href={result.href}
                        className="search-result"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[var(--foreground)]">
                            {result.label}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                            {result.description}
                          </p>
                        </div>
                        <span className="soft-badge">{result.kind}</span>
                      </Link>
                    ))}
                  </>
                ) : (
                  <div className="search-empty">
                    No exact match yet. Browse categories instead.
                  </div>
                )}
              </div>
            ) : null}
          </form>

          <div className="home-meta-panel">
            <div className="home-stat">
              <span className="home-stat-value">{liveCategories.length}</span>
              <span className="home-stat-label">Live categories</span>
            </div>
            <div className="home-stat">
              <span className="home-stat-value">{guides.length}</span>
              <span className="home-stat-label">Guides</span>
            </div>
            <div className="home-stat">
              <span className="home-stat-value">{totalResourceCount}</span>
              <span className="home-stat-label">Curated resources</span>
            </div>
            <Link href="/categories" className="secondary-link home-browse-link">
              Browse all categories
            </Link>
          </div>
        </section>

        <section className="home-category-section">
          <div className="section-heading home-category-heading">
            <div className="space-y-2">
              <p className="eyebrow">Categories</p>
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--foreground)] sm:text-3xl">
                Open a category.
              </h2>
            </div>
            <p className="home-category-intro">
              Each category opens a small guide instead of a giant dump of links.
            </p>
          </div>

          <div className="home-category-grid">
            {liveCategories.map(category => (
              <article
                key={category.slug}
                className="category-card home-category-card"
              >
                <div className="home-category-card-head">
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                    {category.name}
                  </h3>
                  <ShareButton
                    title={`${category.name} • futile.in`}
                    url={
                      typeof window === "undefined"
                        ? category.href
                        : `${window.location.origin}${category.href}`
                    }
                    text={category.description}
                    idleLabel="Share"
                    className="home-category-share-button"
                  />
                </div>

                <p className="home-category-card-description text-sm leading-7 text-[var(--muted-foreground)]">
                  {category.homeDescription}
                </p>

                <div className="home-category-card-meta">
                  <span>{category.guideCount} guide</span>
                  <span>{category.resourceCount} resources</span>
                </div>

                <div className="category-card-footer">
                  <Link href={category.href} className="category-card-button">
                    View guide
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
