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
    topic: string;
    gs_paper: string;
    category: string;
    prelims_facts: string[];
    mains_angles: string[];
    related_concepts: string[];
};

function buildPrompt(article: ArticleInput, tags: RuleTags) {
    return `
You are helping build a UPSC Civil Services exam preparation platform.

Convert the news article into concise UPSC study notes.

Return ONLY valid JSON with this structure:

{
  "summary": "",
  "why_it_matters": "",
  "background": "",
  "topic": "",
  "gs_paper": "",
  "category": "",
  "prelims_facts": [],
  "mains_angles": [],
  "related_concepts": []
}

Rules:
- Use simple language suitable for UPSC students
- Do not invent facts
- Keep explanations short and clear
- Focus on exam relevance

Detected tags:
Topic: ${tags.topic}
GS Paper: ${tags.gsPaper}
Category: ${tags.category}

Article Title:
${article.title ?? ""}

Description:
${article.description ?? ""}

Content:
${article.content ?? ""}
`;
}

export async function generateUPSCStudyNote(
    article: ArticleInput,
    tags: RuleTags
): Promise<UPSCStudyNote> {
    const prompt = buildPrompt(article, tags);

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

    console.log("Groq key exists:", !!process.env.GROQ_API_KEY);
    console.log("Article received by AI helper:", article);
    console.log("Tags received by AI helper:", tags);

    try {
        return JSON.parse(content);
    } catch (err) {
        console.error("Groq JSON parse failed:", content);

        console.log("Groq raw content:", content);

        // fallback
        return {
            summary: article.description || article.title || "",
            why_it_matters: `Relevant for ${tags.topic} under ${tags.gsPaper}.`,
            background: "",
            topic: tags.topic,
            gs_paper: tags.gsPaper,
            category: tags.category,
            prelims_facts: [],
            mains_angles: [],
            related_concepts: [],
        };
    }
}