import { NextRequest, NextResponse } from "next/server";
import { isUPSCRelevant } from "../../../lib/upscFilter";
import { transformArticle } from "../../../lib/upscTransform";
import { detectRuleTags } from "../../../lib/upscRules";
import { generateUPSCStudyNote } from "../../../lib/upscAI";

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const article = {
      title: body.title ?? "",
      description: body.description ?? "",
      content: body.content ?? "",
    };

    if (!article.title && !article.description && !article.content) {
      return NextResponse.json(
        { error: "Article data is required" },
        { status: 400 }
      );
    }

    const tags = detectRuleTags(article);
    const studyNote = await generateUPSCStudyNote(article, tags);

    return NextResponse.json({
      success: true,
      input: article,
      rule_tags: {
        topic: tags.topic,
        gs_paper: tags.gsPaper,
        category: tags.category,
      },
      study_note: studyNote,
    });
  } catch (error: any) {
    console.error("UPSC enrich error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to enrich article",
        details: error?.response?.data || null,
      },
      { status: 500 }
    );
  }
}