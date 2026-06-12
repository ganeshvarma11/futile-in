import {
  ArrowLeft,
  ArrowUpRight,
  ChevronDown,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import HelpfulVote from "@/components/HelpfulVote";
import ShareButton from "@/components/ShareButton";
import SuggestResourceDialog from "@/components/SuggestResourceDialog";
import { getCategoryBySlug, getGuideBySlug } from "@/data/site";
import NotFound from "@/pages/NotFound";
import { Link } from "wouter";

type GuidePageProps = {
  slug: string;
};

export default function GuidePage({ slug }: GuidePageProps) {
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return <NotFound />;
  }

  const category = getCategoryBySlug(guide.categorySlug);
  const [activeGroupId, setActiveGroupId] = useState(guide.groups[0]?.id ?? "");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(guide.facetAllLabel);
  const [selectedAccess, setSelectedAccess] = useState("All access");
  const [sortBy, setSortBy] = useState("Most popular");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isMobileGroupsOpen, setIsMobileGroupsOpen] = useState(false);
  const guideShareUrl =
    typeof window === "undefined"
      ? `/guides/${guide.slug}`
      : window.location.href;

  useEffect(() => {
    setActiveGroupId(guide.groups[0]?.id ?? "");
    setSearchQuery("");
    setSelectedLanguage(guide.facetAllLabel);
    setSelectedAccess("All access");
    setSortBy("Most popular");
    setIsMobileFiltersOpen(false);
    setIsMobileGroupsOpen(false);
  }, [guide]);

  const totalResourceCount = useMemo(
    () => guide.groups.reduce((count, group) => count + group.items.length, 0),
    [guide.groups]
  );

  const totalCommunitySignals = useMemo(
    () =>
      guide.groups.reduce(
        (count, group) =>
          count +
          group.items.reduce(
            (groupCount, item) => groupCount + item.baseHelpfulCount,
            0
          ),
        0
      ),
    [guide.groups]
  );

  const activeGroup = useMemo(
    () =>
      guide.groups.find(group => group.id === activeGroupId) ?? guide.groups[0],
    [activeGroupId, guide.groups]
  );

  const languageOptions = useMemo(() => {
    if (!activeGroup) return [guide.facetAllLabel];
    const values = new Set<string>();
    activeGroup.items.forEach(item => {
      item.languages.forEach(language => values.add(language));
    });
    return [guide.facetAllLabel, ...Array.from(values).sort()];
  }, [activeGroup, guide.facetAllLabel]);

  const filteredItems = useMemo(() => {
    if (!activeGroup) return [];

    const query = searchQuery.trim().toLowerCase();
    let items = activeGroup.items.filter(item => {
      const matchesQuery =
        !query ||
        [
          item.title,
          item.provider,
          item.note,
          item.kind,
          item.access,
          ...item.languages,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesLanguage =
        selectedLanguage === guide.facetAllLabel ||
        item.languages.includes(selectedLanguage);

      const matchesAccess =
        selectedAccess === "All access" || item.access === selectedAccess;

      return matchesQuery && matchesLanguage && matchesAccess;
    });

    items = [...items].sort((a, b) => {
      if (sortBy === "A-Z") return a.title.localeCompare(b.title);
      if (sortBy === "Z-A") return b.title.localeCompare(a.title);
      return b.baseHelpfulCount - a.baseHelpfulCount;
    });

    return items;
  }, [
    activeGroup,
    guide.facetAllLabel,
    searchQuery,
    selectedLanguage,
    selectedAccess,
    sortBy,
  ]);

  if (!activeGroup) {
    return <NotFound />;
  }

  const activeFilterCount =
    (searchQuery.trim() ? 1 : 0) +
    (selectedLanguage !== guide.facetAllLabel ? 1 : 0) +
    (selectedAccess !== "All access" ? 1 : 0) +
    (sortBy !== "Most popular" ? 1 : 0);
  const accessOptions = ["All access", "Free", "Freemium", "Paid"] as const;
  const sortOptions = ["Most popular", "A-Z", "Z-A"] as const;

  return (
    <div className="dsa-dashboard-page">
      <div className="site-container py-6 sm:py-8">
        <div className="dashboard-topbar">
          <Link href="/" className="dashboard-backlink">
            <ArrowLeft size={15} />
            Back
          </Link>
          <div className="dashboard-topbar-actions">
            <span className="dashboard-pill">{category?.name ?? "Guide"}</span>
            <ShareButton
              title={guide.title}
              url={guideShareUrl}
              text={guide.summary}
              idleLabel="Share resource"
              className="dashboard-share-button-page"
            />
          </div>
        </div>

        <div className="dashboard-layout">
          <aside className="dashboard-sidebar">
            <div className="dashboard-panel dashboard-summary-panel">
              <div className="dashboard-summary-top">
                <div className="space-y-2">
                  <p className="dashboard-eyebrow">Category</p>
                  <h1 className="text-2xl font-semibold tracking-[-0.04em] text-white">
                    {guide.title}
                  </h1>
                </div>

                <div className="dashboard-mobile-group-bar">
                  <div className="dashboard-mobile-group-picker">
                    <button
                      type="button"
                      className="dashboard-mobile-group-trigger"
                      onClick={() => setIsMobileGroupsOpen(open => !open)}
                      aria-expanded={isMobileGroupsOpen}
                      aria-controls="guide-mobile-group-list"
                    >
                      <SlidersHorizontal size={13} />
                      <span className="dashboard-mobile-group-trigger-text">
                        Sections
                      </span>
                      <ChevronDown
                        size={15}
                        className={`dashboard-mobile-group-chevron ${
                          isMobileGroupsOpen
                            ? "dashboard-mobile-group-chevron-open"
                            : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {isMobileGroupsOpen ? (
                <div
                  id="guide-mobile-group-list"
                  className="dashboard-mobile-group-list"
                >
                  {guide.groups.map(group => (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => {
                        setActiveGroupId(group.id);
                        setIsMobileGroupsOpen(false);
                      }}
                      className={`dashboard-mobile-group-chip ${
                        group.id === activeGroup.id
                          ? "dashboard-mobile-group-chip-active"
                          : ""
                      }`}
                    >
                      <span className="dashboard-mobile-group-chip-text">
                        {group.title}
                      </span>
                      <span className="dashboard-mobile-group-chip-count">
                        {group.items.length}
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="dashboard-sidebar-list">
                {guide.groups.map(group => (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setActiveGroupId(group.id)}
                    className={`sidebar-item ${
                      group.id === activeGroup.id ? "sidebar-item-active" : ""
                    }`}
                  >
                    <span>{group.title}</span>
                    <span className="sidebar-item-count">
                      {group.items.length}
                    </span>
                  </button>
                ))}
              </div>

              <div className="dashboard-sidebar-meta">
                <div className="dashboard-sidebar-meta-item">
                  <span className="dashboard-sidebar-meta-value">
                    {totalResourceCount}
                  </span>
                  <span className="dashboard-sidebar-meta-label">
                    Curated links
                  </span>
                </div>
                <div className="dashboard-sidebar-meta-item">
                  <span className="dashboard-sidebar-meta-value">
                    {totalCommunitySignals}
                  </span>
                  <span className="dashboard-sidebar-meta-label">
                    Community uses
                  </span>
                </div>
              </div>

              <SuggestResourceDialog
                guideTitle={guide.title}
                groupOptions={guide.groups.map(group => ({
                  id: group.id,
                  title: group.title,
                }))}
              />
            </div>
          </aside>

          <section className="dashboard-main">
            <div className="dashboard-panel">
              <div className="dashboard-main-header">
                <div>
                  <div className="dashboard-main-header-top">
                    <p className="dashboard-eyebrow">{activeGroup.title}</p>
                    <div className="dashboard-mobile-toolbar-popover">
                      <button
                        type="button"
                        className="dashboard-mobile-toolbar-toggle dashboard-main-header-filter-toggle"
                        onClick={() => setIsMobileFiltersOpen(open => !open)}
                        aria-expanded={isMobileFiltersOpen}
                        aria-controls="guide-mobile-filters"
                      >
                        <span className="dashboard-mobile-toolbar-toggle-main">
                          <SlidersHorizontal size={15} />
                          <span>Filters</span>
                        </span>
                        <span className="dashboard-mobile-toolbar-toggle-meta">
                          {activeFilterCount > 0 ? (
                            <span className="dashboard-mobile-toolbar-count">
                              {activeFilterCount}
                            </span>
                          ) : null}
                          <ChevronDown
                            size={16}
                            className={`dashboard-mobile-toolbar-chevron ${
                              isMobileFiltersOpen
                                ? "dashboard-mobile-toolbar-chevron-open"
                                : ""
                            }`}
                          />
                        </span>
                      </button>

                      <div
                        id="guide-mobile-filters"
                        className={`dashboard-toolbar ${
                          isMobileFiltersOpen ? "dashboard-toolbar-open" : ""
                        }`}
                      >
                        <label className="dashboard-search">
                          <Search size={15} />
                          <input
                            value={searchQuery}
                            onChange={event => setSearchQuery(event.target.value)}
                            placeholder="Search resources"
                            aria-label="Search resources"
                          />
                        </label>

                        <label className="dashboard-filter">
                          <span>{guide.facetLabel}</span>
                          <select
                            value={selectedLanguage}
                            onChange={event => setSelectedLanguage(event.target.value)}
                            aria-label={`Filter by ${guide.facetLabel.toLowerCase()}`}
                          >
                            {languageOptions.map(option => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="dashboard-filter">
                          <span>Access</span>
                          <select
                            value={selectedAccess}
                            onChange={event => setSelectedAccess(event.target.value)}
                            aria-label="Filter by access"
                          >
                            <option value="All access">All access</option>
                            <option value="Free">Free</option>
                            <option value="Freemium">Freemium</option>
                            <option value="Paid">Paid</option>
                          </select>
                        </label>

                        <label className="dashboard-filter">
                          <span>Sort</span>
                          <select
                            value={sortBy}
                            onChange={event => setSortBy(event.target.value)}
                            aria-label="Sort resources"
                          >
                            <option value="Most popular">Most popular</option>
                            <option value="A-Z">A-Z</option>
                            <option value="Z-A">Z-A</option>
                          </select>
                        </label>

                        <div className="dashboard-mobile-filter-groups">
                          <div className="dashboard-mobile-filter-group">
                            <p className="dashboard-mobile-filter-title">
                              {guide.facetLabel}
                            </p>
                            <div className="dashboard-mobile-filter-options">
                              {languageOptions.map(option => (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => setSelectedLanguage(option)}
                                  className={`dashboard-mobile-filter-option ${
                                    selectedLanguage === option
                                      ? "dashboard-mobile-filter-option-active"
                                      : ""
                                  }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="dashboard-mobile-filter-group">
                            <p className="dashboard-mobile-filter-title">
                              Access
                            </p>
                            <div className="dashboard-mobile-filter-options">
                              {accessOptions.map(option => (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => setSelectedAccess(option)}
                                  className={`dashboard-mobile-filter-option ${
                                    selectedAccess === option
                                      ? "dashboard-mobile-filter-option-active"
                                      : ""
                                  }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="dashboard-mobile-filter-group">
                            <p className="dashboard-mobile-filter-title">Sort</p>
                            <div className="dashboard-mobile-filter-options">
                              {sortOptions.map(option => (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => setSortBy(option)}
                                  className={`dashboard-mobile-filter-option ${
                                    sortBy === option
                                      ? "dashboard-mobile-filter-option-active"
                                      : ""
                                  }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">
                    {activeGroup.description}
                  </h2>
                </div>
                <div className="dashboard-pill">
                  {filteredItems.length} resources
                </div>
              </div>

              <div className="resource-table">
                <div className="resource-table-head">
                  <span>Sl.No</span>
                  <span>Resource</span>
                  <span>Stars</span>
                  <span>Share</span>
                  <span>Links</span>
                </div>

                <div className="resource-table-body">
                  {filteredItems.map((item, index) => {
                    const showProvider =
                      !["YouTube", "GitHub"].includes(item.provider) &&
                      item.provider !== item.kind;
                    const itemNumber = String(index + 1).padStart(2, "0");

                    return (
                      <article key={item.id} className="resource-table-row">
                        <div className="resource-cell resource-cell-index">
                          {itemNumber}
                        </div>
                        <div className="resource-cell resource-cell-main">
                          <div className="resource-main-line">
                            <div className="resource-mobile-header">
                              <span className="resource-mobile-index">
                                {itemNumber}
                              </span>
                              <div className="resource-identity">
                                <h3 className="resource-title">{item.title}</h3>
                                {showProvider ? (
                                  <p className="resource-provider">
                                    {item.provider}
                                  </p>
                                ) : null}
                              </div>
                            </div>
                            <div className="resource-badge-row">
                              <span className="dashboard-badge">
                                {item.kind}
                              </span>
                              <span className="dashboard-badge">
                                {item.access}
                              </span>
                              {item.languages.slice(0, 2).map(language => (
                                <span
                                  key={language}
                                  className="dashboard-badge dashboard-badge-muted"
                                >
                                  {language}
                                </span>
                              ))}
                              {item.languages.length > 2 ? (
                                <span className="dashboard-badge dashboard-badge-muted">
                                  +{item.languages.length - 2}
                                </span>
                              ) : null}
                            </div>
                            <p className="resource-note">{item.note}</p>
                          </div>
                        </div>
                        <div className="resource-actions-row">
                          <div className="resource-cell resource-cell-stars">
                            <HelpfulVote
                              voteKey={`${guide.slug}:${item.id}`}
                              baseCount={item.baseHelpfulCount}
                            />
                          </div>
                          <div className="resource-cell resource-cell-share">
                            <ShareButton
                              title={`${item.title} • ${guide.title}`}
                              url={item.url}
                              text={item.note}
                            />
                          </div>
                          <div className="resource-cell resource-cell-link">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="dashboard-text-link"
                            >
                              Link
                              <ArrowUpRight size={15} />
                            </a>
                          </div>
                        </div>
                      </article>
                    );
                  })}

                  {filteredItems.length === 0 ? (
                    <div className="resource-empty-state">
                      No matching resources for this filter yet.
                    </div>
                  ) : null}

                  <SuggestResourceDialog
                    guideTitle={guide.title}
                    groupOptions={guide.groups.map(group => ({
                      id: group.id,
                      title: group.title,
                    }))}
                    initialSectionId={activeGroup.id}
                    triggerClassName="dashboard-suggest-trigger-inline"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
