const LAST_UPDATED = "June 11, 2026";

export default function Privacy() {
  const localOnly = [
    "Helpful-vote choices are stored in your browser using localStorage.",
    "Share and copy buttons use your browser's built-in share or clipboard features.",
    "The Suggest a resource dialog currently prepares text for you to copy or share; it does not submit that suggestion to the site server.",
  ];

  const serverSide = [
    "If admin or authenticated areas are used, the server may set a session cookie to keep that session active.",
    "Some backend routes are built for submissions such as resume audits or job postings. If those flows are made public on the site, this policy should be updated alongside them.",
  ];

  return (
    <div className="site-container py-10 sm:py-14">
      <div className="page-frame page-frame-compact info-page">
        <section className="info-hero max-w-3xl space-y-5">
          <p className="eyebrow">Privacy</p>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[var(--foreground)] sm:text-5xl">
            Privacy, in plain language.
          </h1>
          <p className="text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
            futile.in is designed to be browseable without an account. The
            current product keeps data collection light and local where
            possible.
          </p>
          <p className="text-sm leading-7 text-[var(--muted-foreground)]">
            Last updated: {LAST_UPDATED}
          </p>
        </section>

        <section className="info-grid mt-12 grid gap-6 lg:grid-cols-2">
          <div className="card info-card space-y-5 p-7 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
              What stays in your browser
            </h2>
            <div className="space-y-3">
              {localOnly.map((item) => (
                <p key={item} className="list-line">
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="card info-card space-y-5 p-7 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
              What may involve the server
            </h2>
            <div className="space-y-3">
              {serverSide.map((item) => (
                <p key={item} className="list-line">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="info-grid mt-6 grid gap-6 lg:grid-cols-2">
          <div className="card info-card space-y-5 p-7 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
              Analytics and third parties
            </h2>
            <p className="text-base leading-8 text-[var(--muted-foreground)]">
              The current client does not include third-party ad trackers or
              analytics scripts. If that changes later, this page should name
              what is added and why.
            </p>
            <p className="text-base leading-8 text-[var(--muted-foreground)]">
              Many guide links go to external websites like YouTube, official
              docs, books, or job boards. Once you leave futile.in, those sites
              follow their own privacy practices.
            </p>
          </div>

          <div className="card info-card space-y-5 p-7 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
              Policy updates
            </h2>
            <p className="text-base leading-8 text-[var(--muted-foreground)]">
              If the site starts collecting form submissions, payments, uploaded
              files, or broader account data, this page should be updated before
              those features are promoted publicly.
            </p>
            <p className="text-base leading-8 text-[var(--muted-foreground)]">
              Until then, the main rule is simple: keep browsing open, keep data
              collection minimal, and avoid surprise tracking.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
