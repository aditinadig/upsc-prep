export function cleanHTML(text: string | null | undefined) {
  if (!text) return "";

  return text
    .replace(/<[^>]*>/g, "")   // remove HTML tags
    .replace(/\s+/g, " ")      // normalize spaces
    .trim();
}