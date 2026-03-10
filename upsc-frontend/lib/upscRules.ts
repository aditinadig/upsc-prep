export type ArticleInput = {
  title?: string;
  description?: string;
  content?: string;
};

export type RuleTags = {
  topic: string;
  gsPaper: string;
  category: string;
};

function getCombinedText(article: ArticleInput) {
  return [
    article.title ?? "",
    article.description ?? "",
    article.content ?? "",
  ]
    .join(" ")
    .toLowerCase();
}

export function detectTopic(article: ArticleInput): string {
  const text = getCombinedText(article);

  if (
    text.includes("constitution") ||
    text.includes("parliament") ||
    text.includes("supreme court") ||
    text.includes("high court") ||
    text.includes("judiciary") ||
    text.includes("bill") ||
    text.includes("act") ||
    text.includes("ordinance") ||
    text.includes("election commission")
  ) {
    return "Polity and Governance";
  }

  if (
    text.includes("rbi") ||
    text.includes("inflation") ||
    text.includes("repo rate") ||
    text.includes("gdp") ||
    text.includes("fiscal") ||
    text.includes("tax") ||
    text.includes("bank") ||
    text.includes("trade") ||
    text.includes("economy")
  ) {
    return "Indian Economy";
  }

  if (
    text.includes("climate") ||
    text.includes("biodiversity") ||
    text.includes("forest") ||
    text.includes("wildlife") ||
    text.includes("pollution") ||
    text.includes("emissions") ||
    text.includes("air quality") ||
    text.includes("cop")
  ) {
    return "Environment and Ecology";
  }

  if (
    text.includes("india and ") ||
    text.includes("agreement") ||
    text.includes("summit") ||
    text.includes("united nations") ||
    text.includes("unsc") ||
    text.includes("g20") ||
    text.includes("brics") ||
    text.includes("canada") ||
    text.includes("china") ||
    text.includes("usa") ||
    text.includes("brazil") ||
    text.includes("iran")
  ) {
    return "International Relations";
  }

  if (
    text.includes("isro") ||
    text.includes("space") ||
    text.includes("ai") ||
    text.includes("technology") ||
    text.includes("deepfake") ||
    text.includes("semiconductor") ||
    text.includes("research")
  ) {
    return "Science and Technology";
  }

  if (
    text.includes("army") ||
    text.includes("navy") ||
    text.includes("air force") ||
    text.includes("defence") ||
    text.includes("security") ||
    text.includes("terrorism") ||
    text.includes("border")
  ) {
    return "Security and Defence";
  }

  if (
    text.includes("health") ||
    text.includes("education") ||
    text.includes("poverty") ||
    text.includes("nutrition") ||
    text.includes("women") ||
    text.includes("child") ||
    text.includes("employment")
  ) {
    return "Social Issues";
  }

  return "Current Affairs";
}

export function detectGSPaper(topic: string): string {
  const map: Record<string, string> = {
    "Polity and Governance": "GS2",
    "International Relations": "GS2",
    "Indian Economy": "GS3",
    "Environment and Ecology": "GS3",
    "Science and Technology": "GS3",
    "Security and Defence": "GS3",
    "Social Issues": "GS2",
    "Current Affairs": "GS2",
  };

  return map[topic] ?? "GS2";
}

export function detectCategory(article: ArticleInput): string {
  const text = getCombinedText(article);

  if (
    text.includes("scheme") ||
    text.includes("policy") ||
    text.includes("government") ||
    text.includes("ministry") ||
    text.includes("cabinet")
  ) {
    return "Governance";
  }

  if (
    text.includes("trade") ||
    text.includes("tax") ||
    text.includes("bank") ||
    text.includes("economy") ||
    text.includes("inflation")
  ) {
    return "Economy";
  }

  if (
    text.includes("climate") ||
    text.includes("forest") ||
    text.includes("wildlife") ||
    text.includes("pollution")
  ) {
    return "Environment";
  }

  if (
    text.includes("agreement") ||
    text.includes("foreign") ||
    text.includes("summit") ||
    text.includes("diplomatic") ||
    text.includes("canada") ||
    text.includes("brazil") ||
    text.includes("iran")
  ) {
    return "International Relations";
  }

  if (
    text.includes("court") ||
    text.includes("constitution") ||
    text.includes("bill") ||
    text.includes("parliament")
  ) {
    return "Polity";
  }

  if (
    text.includes("ai") ||
    text.includes("space") ||
    text.includes("technology") ||
    text.includes("deepfake")
  ) {
    return "Science and Technology";
  }

  return "General";
}

export function detectRuleTags(article: ArticleInput): RuleTags {
  const topic = detectTopic(article);
  const gsPaper = detectGSPaper(topic);
  const category = detectCategory(article);

  return {
    topic,
    gsPaper,
    category,
  };
}