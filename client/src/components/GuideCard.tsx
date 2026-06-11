import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import type { Guide } from "@/data/site";

type GuideCardProps = {
  guide: Guide;
};

export default function GuideCard({ guide }: GuideCardProps) {
  return (
    <Link href={`/guides/${guide.slug}`} className="guide-card">
      <div className="flex items-start justify-between gap-4">
        <span className="soft-badge">{guide.forWho}</span>
        <ArrowUpRight size={16} className="text-[var(--muted-foreground)]" />
      </div>
      <div className="space-y-3">
        <h3 className="text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
          {guide.title}
        </h3>
        <p className="text-sm leading-6 text-[var(--muted-foreground)]">
          {guide.summary}
        </p>
      </div>
      <p className="text-sm leading-6 text-[var(--foreground)]/80">
        <span className="font-semibold text-[var(--foreground)]">
          Best place to start:
        </span>{" "}
        {guide.bestPlaceToStart}
      </p>
    </Link>
  );
}
