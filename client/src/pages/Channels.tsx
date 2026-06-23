import { ArrowUpRight, Instagram, Radio, Send } from "lucide-react";

const channelRows = [
  {
    title: "Futile Jobs",
    eyebrow: "WhatsApp channel",
    description:
      "Quick job openings, fresher-friendly updates, and useful hiring links.",
    href: "https://whatsapp.com/channel/0029Vb3ad7eI7BeC37Ccy52S",
    cta: "Open job updates",
    icon: Radio,
  },
  {
    title: "futile.in",
    eyebrow: "WhatsApp channel",
    description:
      "Resources, learning tips, website links, and the best things worth opening from the site.",
    href: "https://whatsapp.com/channel/0029VaxdvXbKwqSXSm2SyH3x",
    cta: "Open resources channel",
    icon: Send,
  },
  {
    title: "@futile.in",
    eyebrow: "Instagram",
    description:
      "The main discovery account where new people usually find the project first.",
    href: "https://instagram.com/futile.in",
    cta: "Open Instagram",
    icon: Instagram,
  },
  {
    title: "@futilein",
    eyebrow: "X",
    description:
      "Reserved for future short-form updates, observations, and quick posting.",
    href: "https://x.com/futilein",
    cta: "Open X profile",
    icon: ArrowUpRight,
  },
];

export default function Channels() {
  return (
    <div className="site-container py-10 sm:py-14">
      <div className="page-frame page-frame-compact channels-page">
        <section className="info-hero max-w-3xl space-y-5">
          <p className="eyebrow">Channels</p>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[var(--foreground)] sm:text-5xl">
            Follow the update streams, not just the website.
          </h1>
          <p className="text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
            The website is where guides stay organized. The channels are where
            new openings, useful links, and short updates show up faster.
          </p>
        </section>

        <section className="channels-list" aria-label="Channel links">
          {channelRows.map((card) => {
            const Icon = card.icon;

            return (
              <article key={card.title} className="channels-row">
                <div className="channels-row-copy">
                  <div className="channels-row-topline">
                    <Icon size={18} />
                    <span className="channels-row-eyebrow">{card.eyebrow}</span>
                  </div>
                  <h2 className="channels-row-title">{card.title}</h2>
                  <p className="channels-row-description">
                    {card.description}
                  </p>
                </div>

                <div className="channels-row-action">
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noreferrer"
                    className="channels-row-link"
                  >
                    <span>{card.cta}</span>
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
