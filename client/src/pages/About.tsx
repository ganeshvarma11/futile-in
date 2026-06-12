import { Link } from "wouter";

export default function About() {
  const principles = [
    "Keep beginner pages small enough to use in one sitting.",
    "Prefer primary, official, or long-trusted resources over noisy reposts.",
    "Explain why a resource is worth opening before asking for your time.",
    "Reduce confusion first. Add volume only when it clearly helps.",
  ];

  const notTryingToBe = [
    "A course platform",
    "A social feed",
    "A productivity dashboard",
    "A giant list of everything on the internet",
  ];

  return (
    <div className="site-container info-page py-16 sm:py-20">
      <section className="info-hero max-w-3xl space-y-5">
        <p className="eyebrow">About</p>
        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[var(--foreground)] sm:text-5xl">
          What futile is trying to do.
        </h1>
        <p className="text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
          futile.in is a small guide site for confused beginners. The idea is
          simple: fewer tabs, clearer starting points, and cleaner category
          pages for people who want to study instead of endlessly researching
          what to study.
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
            What this is not
          </h2>
          <div className="space-y-3">
            {notTryingToBe.map((item) => (
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
            How to use the site
          </h2>
          <p className="text-base leading-8 text-[var(--muted-foreground)]">
            Pick one category, open one guide, and start with the first group
            that matches your level. If a page makes you open too many options
            at once, that page still needs work.
          </p>
          <p className="text-base leading-8 text-[var(--muted-foreground)]">
            If you want the thinking behind the curation, the{" "}
            <Link href="/method" className="secondary-link">
              Method page
            </Link>{" "}
            explains the rule we use when deciding what stays and what gets cut.
          </p>
        </div>
      </section>
    </div>
  );
}
