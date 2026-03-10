export function buildTopicQuery(article: {
  title?: string;
  description?: string;
}, tags: {
  topic: string;
  category: string;
}) {
  const title = (article.title || "").toLowerCase();

  if (title.includes("canada") && title.includes("nuclear")) {
    return "India Canada nuclear energy uranium";
  }

  if (tags.topic === "International Relations") {
    return `${article.title || "India foreign relations"}`;
  }

  if (tags.topic === "Indian Economy") {
    return `${article.title || "India economy policy"}`;
  }

  return article.title || tags.topic;
}