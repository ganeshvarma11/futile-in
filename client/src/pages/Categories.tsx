import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { categories, getGuidesForCategory } from "@/data/site";

type StatusFilter = "All" | "Live" | "Coming soon";

export default function Categories() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const categoryInsights = useMemo(
    () =>
      categories
        .map((category) => {
          const relatedGuides = getGuidesForCategory(category.slug);
          const resourceCount = relatedGuides.reduce(
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
            primaryGuide: relatedGuides[0] ?? null,
            guideCount: relatedGuides.length,
            resourceCount,
            isLive: relatedGuides.length > 0,
            searchIndex: [
              category.name,
              category.description,
              category.forWho,
              ...relatedGuides.flatMap((guide) => [
                guide.title,
                guide.summary,
                ...guide.searchTerms,
              ]),
            ]
              .join(" ")
              .toLowerCase(),
          };
        })
        .sort((left, right) => {
          if (left.isLive !== right.isLive) {
            return Number(right.isLive) - Number(left.isLive);
          }

          return left.name.localeCompare(right.name);
        }),
    []
  );

  const filteredCategories = useMemo(() => {
    const cleanedQuery = query.trim().toLowerCase();

    return categoryInsights.filter((category) => {
      const matchesQuery =
        !cleanedQuery || category.searchIndex.includes(cleanedQuery);
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Live" ? category.isLive : !category.isLive);

      return matchesQuery && matchesStatus;
    });
  }, [categoryInsights, query, statusFilter]);

  const totalLiveCategories = categoryInsights.filter(
    (category) => category.isLive
  ).length;
  const totalGuides = categoryInsights.reduce(
    (count, category) => count + category.guideCount,
    0
  );
  const totalResources = categoryInsights.reduce(
    (count, category) => count + category.resourceCount,
    0
  );

  return (
    <div className="site-container categories-page py-10 sm:py-14">
      <section className="categories-header">
        <p className="eyebrow">Categories</p>
        <h1 className="categories-title">Browse guides by category.</h1>
        <p className="categories-description">
          Open a category guide.
        </p>
        <p className="categories-meta">
          {totalLiveCategories} live categories • {totalResources} links
        </p>
      </section>

      <section className="categories-toolbar-section">
        <div className="categories-toolbar">
          <label className="search-shell categories-search-shell">
            <Search size={18} className="text-[var(--muted-foreground)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search categories"
              className="search-input"
              aria-label="Search categories"
            />
          </label>

          <div
            className="categories-filter-row"
            role="tablist"
            aria-label="Category status filter"
          >
            {(["All", "Live", "Coming soon"] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setStatusFilter(filter)}
                className={`categories-filter-pill ${
                  statusFilter === filter ? "categories-filter-pill-active" : ""
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="categories-list">
        {filteredCategories.map((category) => (
          <article key={category.slug} className="categories-list-row">
            <div className="categories-list-header">
              <div className="categories-list-top">
                <h2 className="categories-list-title">{category.name}</h2>
                <span
                  className={`categories-list-status ${
                    category.isLive ? "categories-list-status-live" : ""
                  }`}
                >
                  {category.isLive ? "Live" : "Coming soon"}
                </span>
              </div>

              {category.primaryGuide ? (
                <Link
                  href={`/guides/${category.primaryGuide.slug}`}
                  className="category-card-button categories-list-open"
                >
                  Open
                </Link>
              ) : (
                <span className="categories-list-soon">Soon</span>
              )}
            </div>

            <p className="categories-list-description">{category.description}</p>

            <p className="categories-list-submeta">
              {category.resourceCount} links
            </p>
          </article>
        ))}

        {filteredCategories.length === 0 ? (
          <div className="card categories-empty-state">
            <p className="eyebrow">No matches</p>
            <p className="categories-empty-copy">
              Try a broader search like DSA, jobs, web, or interview.
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
