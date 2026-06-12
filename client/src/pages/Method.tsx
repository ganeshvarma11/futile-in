export default function Method() {
  const principles = [
    "We keep guides small. Most topic pages stay between 4 and 8 resources.",
    "We prefer official, primary, or long-standing sources over forwarded summaries.",
    "We tell you why a resource is here, not just what it is.",
    "We review pages and date them so trust is visible, not implied.",
  ];

  const whatWeAvoid = [
    "No fake productivity dashboards.",
    "No signups just to browse.",
    "No endless blog clutter.",
    "No trying to look useful by listing everything.",
  ];

  return (
    <div className="site-container info-page py-16 sm:py-20">
      <section className="info-hero max-w-3xl space-y-5">
        <p className="eyebrow">Method</p>
        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[var(--foreground)] sm:text-5xl">
          How futile curates.
        </h1>
        <p className="text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
          The job of this product is not to impress you with research volume. It
          is to reduce confusion and help you start with better confidence.
        </p>
      </section>

      <section className="info-grid mt-12 grid gap-6 lg:grid-cols-2">
        <div className="card info-card space-y-5 p-7 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
            What we optimize for
          </h2>
          <div className="space-y-3">
            {principles.map((item) => (
              <p key={item} className="list-line">
                {item}
              </p>
            ))}
          </div>
        </div>

        <div className="card info-card space-y-5 p-7 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
            What we deliberately avoid
          </h2>
          <div className="space-y-3">
            {whatWeAvoid.map((item) => (
              <p key={item} className="list-line">
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="info-card mt-6 card p-7 sm:p-8">
        <div className="max-w-4xl space-y-5">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
            The curation rule
          </h2>
          <p className="text-base leading-8 text-[var(--muted-foreground)]">
            If a confused beginner cannot understand what to do next within 30
            seconds, the page is not finished yet. Every guide should answer four
            questions fast: what this topic is, who it is for, where to start,
            and which few resources are worth trusting first.
          </p>
          <p className="text-base leading-8 text-[var(--muted-foreground)]">
            That is why the site stays small on purpose. Fewer links. Better
            labeling. Stronger reasons. Less wandering.
          </p>
        </div>
      </section>
    </div>
  );
}
