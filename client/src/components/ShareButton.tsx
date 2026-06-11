import { Check, Link2, Share2 } from "lucide-react";
import { useState } from "react";

type ShareButtonProps = {
  title: string;
  url: string;
  text?: string;
  idleLabel?: string;
  className?: string;
};

export default function ShareButton({
  title,
  url,
  text,
  idleLabel = "Share",
  className = "",
}: ShareButtonProps) {
  const [status, setStatus] = useState<"idle" | "shared" | "copied">("idle");

  const setTemporaryStatus = (nextStatus: "shared" | "copied") => {
    setStatus(nextStatus);
    window.setTimeout(() => setStatus("idle"), 1800);
  };

  const handleShare = async () => {
    try {
      if (
        navigator.share &&
        typeof window !== "undefined" &&
        window.innerWidth < 768
      ) {
        await navigator.share({
          title,
          text,
          url,
        });
        setTemporaryStatus("shared");
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setTemporaryStatus("copied");
        return;
      }

      if (navigator.share) {
        await navigator.share({
          title,
          text,
          url,
        });
        setTemporaryStatus("shared");
      } else {
        return;
      }
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        setTemporaryStatus("copied");
      } catch {
        return;
      }
    }
  };

  const icon =
    status === "idle" ? (
      <Share2 size={15} />
    ) : status === "shared" ? (
      <Check size={15} />
    ) : (
      <Link2 size={15} />
    );

  const label =
    status === "idle" ? idleLabel : status === "shared" ? "Shared" : "Copied";

  return (
    <button
      type="button"
      onClick={handleShare}
      data-status={status}
      className={`dashboard-share-button ${className}`.trim()}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
