import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-container py-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.9fr_0.9fr]">
          <div className="max-w-md">
            <p className="brand-mark site-footer-brand">
              futile<span className="brand-mark-accent">.</span>in
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
              Structured free learning guides for people who are tired of
              searching more than studying.
            </p>
            <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
              Suggest a guide, report a broken link, request a category, or
              share feedback.
            </p>
            <Link href="/feedback" className="mt-4 inline-flex text-sm font-semibold">
              Open feedback page
            </Link>
          </div>

          <div>
            <p className="footer-label">Navigate</p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-[var(--muted-foreground)]">
              <Link href="/">Home</Link>
              <Link href="/categories">Categories</Link>
              <Link href="/channels">Channels</Link>
              <Link href="/about">About</Link>
              <Link href="/feedback">Feedback</Link>
              <Link href="/privacy">Privacy</Link>
            </div>
          </div>

          <div>
            <p className="footer-label">Principles</p>
            <div className="mt-4 space-y-2 text-sm leading-7 text-[var(--muted-foreground)]">
              <p>Open access. No sign-up walls.</p>
              <p>Useful guidance, not productivity theater.</p>
              <p>Curated learning, not a content dump.</p>
            </div>
          </div>
        </div>

        <div className="section-divider mt-8 flex flex-col gap-3 pt-6 text-sm text-[var(--muted-foreground)] md:flex-row md:items-center md:justify-between">
          <p>&copy; {currentYear} futile.in</p>
          <p>Built to reduce confusion, not increase it.</p>
        </div>
      </div>
    </footer>
  );
}
