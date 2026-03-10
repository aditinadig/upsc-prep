/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { isUPSCRelevant } from "../../../lib/upscFilter";
import { transformArticle } from "../../../lib/upscTransform";
import { detectRuleTags } from "../../../lib/upscRules";
import { buildTopicQuery } from "../../../lib/buildTopicQuery";
import { fetchRelatedNews } from "../../../lib/fetchRelatedNews";
import { filterRelatedArticles } from "../../../lib/filterRelatedArticles";
import { generateUPSCStudyPack } from "../../../lib/upscAI";

export async function GET() {
  const apiKey = process.env.NEWS_API_KEY;

  const response = await fetch(
    `https://newsapi.org/v2/everything?q=India&pageSize=30&apiKey=${apiKey}`,
  );

  const data = await response.json();

  const articles = data.articles || [];

  const filtered = articles.filter(isUPSCRelevant).map(transformArticle);

  return NextResponse.json({
    count: filtered.length,
    articles: filtered,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const mainArticle = {
      title: body.title ?? "",
      description: body.description ?? "",
      content: body.content ?? "",
    };

    if (
      !mainArticle.title &&
      !mainArticle.description &&
      !mainArticle.content
    ) {
      return NextResponse.json(
        { success: false, error: "Article data is required" },
        { status: 400 },
      );
    }

    const tags = detectRuleTags(mainArticle);

    const query = buildTopicQuery(mainArticle, {
      topic: tags.topic,
      category: tags.category,
    });

    const relatedNews = await fetchRelatedNews(query);

    const filteredRelated = filterRelatedArticles(
      mainArticle.title || "",
      relatedNews,
    ).map((article: any) => ({
      title: article.title ?? "",
      description: article.description ?? "",
      content: article.content ?? "",
    }));

    const studyPack = await generateUPSCStudyPack(
      mainArticle,
      filteredRelated,
      tags,
    );

    return NextResponse.json({
      success: true,
      input: mainArticle,
      rule_tags: {
        topic: tags.topic,
        gs_paper: tags.gsPaper,
        category: tags.category,
      },
      related_articles: filteredRelated,
      study_note: studyPack,
    });
  } catch (error: any) {
    console.error("UPSC topic pack error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to generate study pack",
      },
      { status: 500 },
    );
  }
}
