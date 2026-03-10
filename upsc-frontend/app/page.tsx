/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

type NewsArticle = {
  title?: string;
  description?: string;
  content?: string;
  category?: string;
  publishedAt?: string;
  source?: string;
};

type StudyNote = {
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

type EnrichResponse = {
  success: boolean;
  input: NewsArticle;
  rule_tags: {
    topic: string;
    gs_paper: string;
    category: string;
  };
  related_articles: NewsArticle[];
  study_note: StudyNote;
};

export default function HomePage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState("");

  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [notesError, setNotesError] = useState("");
  const [enrichedData, setEnrichedData] = useState<EnrichResponse | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    try {
      setLoadingNews(true);
      setNewsError("");

      const res = await fetch("/api/upsc-news");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to fetch news");
      }

      setArticles(data.articles || []);
    } catch (error: any) {
      setNewsError(error?.message || "Something went wrong while fetching news");
    } finally {
      setLoadingNews(false);
    }
  }

  async function handleCardClick(article: NewsArticle) {
    try {
      setSelectedArticle(article);
      setEnrichedData(null);
      setNotesError("");
      setLoadingNotes(true);

      const res = await fetch("/api/upsc-news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: article.title ?? "",
          description: article.description ?? "",
          content: article.content ?? "",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.error || "Failed to generate UPSC notes");
      }

      setEnrichedData(data);
    } catch (error: any) {
      setNotesError(error?.message || "Failed to generate UPSC notes");
    } finally {
      setLoadingNotes(false);
    }
  }

  function closeModal() {
    setSelectedArticle(null);
    setEnrichedData(null);
    setNotesError("");
    setLoadingNotes(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">UPSC Current Affairs</h1>
          <p className="mt-2 text-sm text-slate-600">
            Click any news card to generate AI-powered exam notes.
          </p>
        </div>

        {loadingNews && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-3 h-6 w-3/4 rounded bg-slate-200" />
                <div className="mb-2 h-4 w-full rounded bg-slate-200" />
                <div className="mb-2 h-4 w-5/6 rounded bg-slate-200" />
                <div className="h-4 w-2/3 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {!loadingNews && newsError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            {newsError}
          </div>
        )}

        {!loadingNews && !newsError && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article, index) => (
              <button
                key={`${article.title}-${index}`}
                onClick={() => handleCardClick(article)}
                className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                    {article.category || "Current Affairs"}
                  </span>
                  <span className="text-xs text-slate-400">View AI Notes</span>
                </div>

                <h2 className="line-clamp-3 text-lg font-semibold leading-snug text-slate-900 group-hover:text-indigo-700">
                  {article.title || "Untitled article"}
                </h2>

                <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600">
                  {article.description || "No description available."}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  AI UPSC Notes
                </p>
                <h2 className="text-xl font-bold leading-snug text-slate-900">
                  {selectedArticle.title}
                </h2>
              </div>

              <button
                onClick={closeModal}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="px-6 py-6">
              {loadingNotes && (
                <div className="space-y-5">
                  <div className="animate-pulse rounded-2xl border border-slate-200 p-5">
                    <div className="mb-3 h-5 w-1/3 rounded bg-slate-200" />
                    <div className="mb-2 h-4 w-full rounded bg-slate-200" />
                    <div className="mb-2 h-4 w-11/12 rounded bg-slate-200" />
                    <div className="h-4 w-3/4 rounded bg-slate-200" />
                  </div>
                  <div className="animate-pulse rounded-2xl border border-slate-200 p-5">
                    <div className="mb-3 h-5 w-1/4 rounded bg-slate-200" />
                    <div className="mb-2 h-4 w-full rounded bg-slate-200" />
                    <div className="h-4 w-5/6 rounded bg-slate-200" />
                  </div>
                </div>
              )}

              {!loadingNotes && notesError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                  {notesError}
                </div>
              )}

              {!loadingNotes && !notesError && enrichedData && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <InfoCard label="Topic" value={enrichedData.rule_tags.topic} />
                    <InfoCard label="GS Paper" value={enrichedData.rule_tags.gs_paper} />
                    <InfoCard label="Category" value={enrichedData.rule_tags.category} />
                  </div>

                  <Section title="Summary">
                    <p className="text-sm leading-7 text-slate-700">
                      {enrichedData.study_note.summary}
                    </p>
                  </Section>

                  <Section title="Why it matters">
                    <p className="text-sm leading-7 text-slate-700">
                      {enrichedData.study_note.why_it_matters}
                    </p>
                  </Section>

                  <Section title="Background">
                    <p className="text-sm leading-7 text-slate-700">
                      {enrichedData.study_note.background}
                    </p>
                  </Section>

                  <Section title="Timeline">
                    <List items={enrichedData.study_note.timeline} />
                  </Section>

                  <Section title="Key entities">
                    <List items={enrichedData.study_note.key_entities} />
                  </Section>

                  <Section title="Key terms">
                    <List items={enrichedData.study_note.key_terms} />
                  </Section>

                  <Section title="Prelims facts">
                    <List items={enrichedData.study_note.prelims_facts} />
                  </Section>

                  <Section title="Mains angles">
                    <List items={enrichedData.study_note.mains_angles} />
                  </Section>

                  <Section title="Related concepts">
                    <div className="flex flex-wrap gap-2">
                      {enrichedData.study_note.related_concepts.map((concept, i) => (
                        <span
                          key={`${concept}-${i}`}
                          className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </Section>

                  <Section title="Related current developments">
                    <List items={enrichedData.study_note.related_current_developments} />
                  </Section>

                  <Section title="Possible questions">
                    <List items={enrichedData.study_note.possible_questions} />
                  </Section>

                  <Section title="Related articles used">
                    <div className="space-y-3">
                      {enrichedData.related_articles?.length ? (
                        enrichedData.related_articles.map((article, index) => (
                          <div
                            key={`${article.title}-${index}`}
                            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                          >
                            <p className="text-sm font-semibold text-slate-900">
                              {article.title || "Untitled article"}
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                              {article.description || "No description available."}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">No related articles found.</p>
                      )}
                    </div>
                  </Section>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value || "-"}</p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-3 text-base font-semibold text-slate-900">{title}</h3>
      {children}
    </div>
  );
}

function List({ items }: { items: string[] }) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-slate-500">No points generated.</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex gap-3 text-sm leading-7 text-slate-700">
          <span className="mt-2 h-2 w-2 rounded-full bg-indigo-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}