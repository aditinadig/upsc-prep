/* eslint-disable @typescript-eslint/no-explicit-any */
import { isUPSCRelevant } from "./upscFilter";

export function filterRelatedArticles(
  mainTitle: string,
  articles: any[]
) {
  return articles
    .filter((a) => a?.title && a.title !== mainTitle)
    .filter(isUPSCRelevant)
    .slice(0, 5);
}