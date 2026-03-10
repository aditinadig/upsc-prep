import Groq from "groq-sdk";
import type { ArticleInput, RuleTags } from "./upscRules";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

console.log("Groq API Key loaded:", groq);

export type UPSCStudyNote = {
  summary: string;
  why_it_matters: string;
  background: string;
  timeline: string[];
  key_entities: string[];
  key_terms: string[];
  prelims_facts: string[];
  mains_angles: string[];
  related_concepts: string[];
  related_current_developments: string[];
  possible_questions: string[];
};

function buildPrompt(
  mainArticle: ArticleInput,
  relatedArticles: ArticleInput[],
  tags: RuleTags,
) {
  const relatedArticlesText = relatedArticles
    .map(
      (article, index) => `
Related Article ${index + 1}:
Title: ${article.title ?? ""}
Description: ${article.description ?? ""}
Content: ${article.content ?? ""}
`,
    )
    .join("\n");

  return `
You are helping build a UPSC Civil Services exam preparation platform.

Using the main article and the related articles below, create an enhanced UPSC study pack.

Return ONLY valid JSON in this exact structure:

{
  "summary": "",
  "why_it_matters": "",
  "background": "",
  "timeline": [],
  "key_entities": [],
  "key_terms": [],
  "prelims_facts": [],
  "mains_angles": [],
  "related_concepts": [],
  "related_current_developments": [],
  "possible_questions": []
}

Rules:
- Use simple, clear language for UPSC students
- Focus on exam relevance
- Do not invent facts
- Use only what is reasonably supported by the given material
- If background or timeline is weak, keep it short instead of making things up
- possible_questions should contain likely UPSC-style questions, not answers

Detected tags:
Topic: ${tags.topic}
GS Paper: ${tags.gsPaper}
Category: ${tags.category}

Main Article:
Title: ${mainArticle.title ?? ""}
Description: ${mainArticle.description ?? ""}
Content: ${mainArticle.content ?? ""}

${relatedArticlesText}
`;
}

export async function generateUPSCStudyPack(
  mainArticle: ArticleInput,
  relatedArticles: ArticleInput[],
  tags: RuleTags,
): Promise<UPSCStudyNote> {
  const prompt = buildPrompt(mainArticle, relatedArticles, tags);

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.2,
  });

  const content = completion.choices[0]?.message?.content || "";

  const cleanedContent = content
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  try {
    return JSON.parse(cleanedContent);
  } catch (err) {
    console.error("Groq enhanced JSON parse failed:", content);

    return {
      summary: mainArticle.description || mainArticle.title || "",
      why_it_matters: `Relevant for ${tags.topic} under ${tags.gsPaper}.`,
      background: "",
      timeline: [],
      key_entities: [],
      key_terms: [],
      prelims_facts: [],
      mains_angles: [],
      related_concepts: [],
      related_current_developments: [],
      possible_questions: [],
    };
  }
}
