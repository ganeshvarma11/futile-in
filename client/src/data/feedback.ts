export const feedbackFormUrl =
  "https://forms.gle/HNTUpps1KbHrqz7TA";

export const feedbackEmail = "futilein.ops@gmail.com";

const feedbackEmailSubject = "Feedback for futile.in";

const feedbackEmailBody = [
  "Hi futile.in,",
  "",
  "I want to:",
  "- suggest a new guide",
  "- report a broken link",
  "- request a category",
  "- share feedback or a useful insight",
  "",
  "Page URL:",
  "Guide or category:",
  "Details:",
].join("\n");

export const feedbackMailtoHref = `mailto:${feedbackEmail}?subject=${encodeURIComponent(
  feedbackEmailSubject,
)}&body=${encodeURIComponent(feedbackEmailBody)}`;
