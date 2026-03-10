export async function fetchRelatedNews(query: string) {
  const apiKey = process.env.NEWS_API_KEY;

  const url = new URL("https://newsapi.org/v2/everything");
  url.searchParams.set("q", query);
  url.searchParams.set("language", "en");
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("pageSize", "10");
  url.searchParams.set("apiKey", apiKey || "");

  const res = await fetch(url.toString());
  const data = await res.json();

  return data.articles || [];
}