import { ExternalLink, Mail } from "lucide-react";
import { feedbackFormUrl, feedbackMailtoHref } from "@/data/feedback";

const feedbackTypes = [
  {
    title: "Suggest a new guide",
    copy: "Share a topic, guide, or resource set that deserves a clearer starting point.",
  },
  {
    title: "Report a broken link",
    copy: "Flag links that are dead, moved, paywalled, or no longer useful for beginners.",
  },
  {
    title: "Request a category",
    copy: "Ask for a new category if a common learning path is missing from the site.",
  },
  {
    title: "Share useful feedback",
    copy: "Tell us what felt confusing, what worked, or what would make a page easier to use.",
  },
];

const feedbackTips = [
  "Include the page URL if your note is about a specific guide or category.",
  "For broken links, add the resource name and what happened when you opened it.",
  "For guide suggestions, explain why the resource is worth a beginner's time.",
];

export default function Feedback() {
  return (
    <div className="site-container py-10 sm:py-14">
      <div className="page-frame page-frame-compact info-page">
        <section className="info-hero max-w-3xl space-y-5">
          <p className="eyebrow">Feedback</p>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[var(--foreground)] sm:text-5xl">
            Improve futile.in.
          </h1>
          <p className="text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
            Suggest a new guide, report a broken link, request a category, or
            share useful feedback without needing an account.
          </p>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap">
            <a
              href={feedbackFormUrl}
              target="_blank"
              rel="noreferrer"
              className="primary-link"
            >
              <ExternalLink size={16} />
              Open feedback form
            </a>
            <a href={feedbackMailtoHref} className="secondary-link">
              <Mail size={16} />
              Email feedback
            </a>
          </div>

          <div className="card max-w-3xl p-5 text-sm leading-7 text-[var(--muted-foreground)] sm:p-6">
            <p>
              No login needed. Use the form for structured submissions or email
              for quick notes and useful links.
            </p>
            <p className="mt-3">
              The form opens in Google Forms and the email option goes directly
              to futilein.ops@gmail.com.
            </p>
          </div>
        </section>

        <section className="info-grid mt-12 grid gap-6 lg:grid-cols-2">
          {feedbackTypes.map((item) => (
            <div key={item.title} className="card info-card space-y-4 p-7 sm:p-8">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                {item.title}
              </h2>
              <p className="text-base leading-8 text-[var(--muted-foreground)]">
                {item.copy}
              </p>
            </div>
          ))}
        </section>

        <section className="info-card mt-6 card p-7 sm:p-8">
          <div className="max-w-4xl space-y-5">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
              What works best
            </h2>
            <div className="space-y-3">
              {feedbackTips.map((item) => (
                <p key={item} className="list-line">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
