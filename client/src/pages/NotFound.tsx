import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="site-container py-12 sm:py-16">
      <div className="page-frame page-frame-compact">
        <div className="card mx-auto max-w-2xl p-8 text-center sm:p-10">
          <p className="eyebrow">404</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[var(--foreground)] sm:text-5xl">
            This page does not exist.
          </h1>
          <p className="mt-4 text-base leading-8 text-[var(--muted-foreground)]">
            The link may be outdated, or the page may have been removed while
            the product was simplified.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/" className="primary-link">
              <ArrowLeft size={16} />
              Back home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
