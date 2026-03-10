const UPSC_KEYWORDS = [
  "parliament",
  "constitution",
  "supreme court",
  "high court",
  "bill",
  "act",
  "cabinet",
  "ministry",
  "government",
  "policy",
  "scheme",
  "commission",
  "rbi",
  "inflation",
  "gdp",
  "economy",
  "agriculture",
  "farmer",
  "climate",
  "biodiversity",
  "forest",
  "wildlife",
  "cop",
  "united nations",
  "g20",
  "brics",
  "india",
  "defence",
  "space",
  "isro",
  "health",
  "education",
  "poverty",
  "employment"
];

export function isUPSCRelevant(article: {
  title?: string;
  description?: string;
  content?: string;
}) {
  const text = [
    article.title ?? "",
    article.description ?? "",
    article.content ?? ""
  ].join(" ").toLowerCase();

  return UPSC_KEYWORDS.some((keyword) => text.includes(keyword));
}