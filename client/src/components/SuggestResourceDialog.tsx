import { Copy, Send, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type SuggestResourceDialogProps = {
  guideTitle: string;
  groupOptions: Array<{ id: string; title: string }>;
};

type SuggestionFormState = {
  sectionId: string;
  title: string;
  url: string;
  languages: string;
  note: string;
};

const emptyState = (sectionId: string): SuggestionFormState => ({
  sectionId,
  title: "",
  url: "",
  languages: "",
  note: "",
});

export default function SuggestResourceDialog({
  guideTitle,
  groupOptions,
}: SuggestResourceDialogProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "copied" | "shared">("idle");
  const [form, setForm] = useState<SuggestionFormState>(
    emptyState(groupOptions[0]?.id ?? ""),
  );

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const suggestionText = useMemo(() => {
    const section =
      groupOptions.find((group) => group.id === form.sectionId)?.title ?? "General";

    return [
      `Guide: ${guideTitle}`,
      `Section: ${section}`,
      `Resource: ${form.title || "-"}`,
      `Link: ${form.url || "-"}`,
      `Languages: ${form.languages || "-"}`,
      `Why include it: ${form.note || "-"}`,
    ].join("\n");
  }, [form, groupOptions, guideTitle]);

  const setField = (field: keyof SuggestionFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetAndClose = () => {
    setOpen(false);
    setStatus("idle");
    setForm(emptyState(groupOptions[0]?.id ?? ""));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(suggestionText);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 1800);
    } catch {
      return;
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Suggestion for ${guideTitle}`,
          text: suggestionText,
        });
        setStatus("shared");
        window.setTimeout(() => setStatus("idle"), 1800);
        return;
      }

      await handleCopy();
    } catch {
      return;
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="dashboard-suggest-trigger"
      >
        Suggest a resource
      </button>

      {open
        ? createPortal(
            <div
              className="dashboard-modal-overlay"
              role="presentation"
              onClick={resetAndClose}
            >
              <div
                className="dashboard-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="suggest-resource-title"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="dashboard-modal-header">
                  <div>
                    <p className="dashboard-eyebrow">Community input</p>
                    <h3 id="suggest-resource-title" className="dashboard-modal-title">
                      Suggest a resource
                    </h3>
                    <p className="dashboard-modal-copy">
                      Share a strong link and we can review it for this guide.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resetAndClose}
                    className="dashboard-modal-close"
                    aria-label="Close suggest resource dialog"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form className="dashboard-suggest-form">
                  <label className="dashboard-form-field">
                    <span>Section</span>
                    <select
                      value={form.sectionId}
                      onChange={(event) => setField("sectionId", event.target.value)}
                    >
                      {groupOptions.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.title}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="dashboard-form-field">
                    <span>Resource name</span>
                    <input
                      value={form.title}
                      onChange={(event) => setField("title", event.target.value)}
                      placeholder="Ex: NeetCode 150"
                    />
                  </label>

                  <label className="dashboard-form-field">
                    <span>Link</span>
                    <input
                      value={form.url}
                      onChange={(event) => setField("url", event.target.value)}
                      placeholder="https://..."
                    />
                  </label>

                  <label className="dashboard-form-field">
                    <span>Languages</span>
                    <input
                      value={form.languages}
                      onChange={(event) => setField("languages", event.target.value)}
                      placeholder="Java, Python, C++"
                    />
                  </label>

                  <label className="dashboard-form-field">
                    <span>Why is it useful?</span>
                    <textarea
                      value={form.note}
                      onChange={(event) => setField("note", event.target.value)}
                      placeholder="Best for beginners, interview prep, topic revision..."
                      rows={4}
                    />
                  </label>
                </form>

                <div className="dashboard-modal-footer">
                  <p className="dashboard-modal-status">
                    {status === "idle"
                      ? "No login needed. Copy or share the suggestion details."
                      : status === "copied"
                        ? "Suggestion copied."
                        : "Suggestion ready to share."}
                  </p>

                  <div className="dashboard-modal-actions">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="dashboard-modal-button dashboard-modal-button-muted"
                    >
                      <Copy size={15} />
                      Copy
                    </button>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="dashboard-modal-button"
                    >
                      <Send size={15} />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
