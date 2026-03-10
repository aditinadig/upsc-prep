import { NextResponse } from "next/server";
import { isUPSCRelevant } from "../../../lib/upscFilter";
import { transformArticle } from "../../../lib/upscTransform";

export async function GET() {
  const apiKey = process.env.NEWS_API_KEY;

  const response = await fetch(
    `https://newsapi.org/v2/everything?q=India&pageSize=30&apiKey=${apiKey}`
  );

  const data = await response.json();

  const articles = data.articles || [];

  const filtered = articles
    .filter(isUPSCRelevant)
    .map(transformArticle);

  return NextResponse.json({
    count: filtered.length,
    articles: filtered
  });
}