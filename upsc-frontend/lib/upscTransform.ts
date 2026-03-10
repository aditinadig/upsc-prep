import { cleanHTML } from "./cleanText";

export function transformArticle(article: any) {
  const title = cleanHTML(article.title);
  const description = cleanHTML(article.description);
  const content = cleanHTML(article.content);

  return {
    title,
    description,
    content,
  };
}