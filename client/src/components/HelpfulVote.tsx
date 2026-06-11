import { Star } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "futile.helpful-votes";

type HelpfulVoteProps = {
  voteKey: string;
  baseCount: number;
};

export default function HelpfulVote({
  voteKey,
  baseCount,
}: HelpfulVoteProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as Record<string, boolean>;
      setActive(Boolean(parsed[voteKey]));
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [voteKey]);

  const handleToggle = () => {
    const next = !active;
    setActive(next);

    const saved = window.localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? (JSON.parse(saved) as Record<string, boolean>) : {};
    parsed[voteKey] = next;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`vote-button ${active ? "vote-button-active" : ""}`}
      aria-pressed={active}
    >
      <Star size={15} className={active ? "fill-current" : ""} />
      <span>{baseCount + (active ? 1 : 0)}</span>
    </button>
  );
}
