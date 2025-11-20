"use client";

import React from "react";
import { ArrowLeft } from 'lucide-react';


export default function AboutPage() {
  const popularQueries: string[] = [
    "Learn CSS",
    "Best restaurants in Delhi",
    "Places to visit in Japan",
    "Boredom is good or bad?",
    "What is Machine Learning",
    "Will AI replace humans?",
  ];

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 text-[#202124]">
      {/* HEADER WITH BACK BUTTON */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-4xl font-semibold">About 
          <div className="flex justify-center py-6">
              <img
                src="/helix-logo.png"
                alt="Helix Logo"
                className="w-35 sm:w-48 md:w-56 lg:w-64 xl:w-72 h-auto"
              />
            </div>
        </h1>

        <a
          href="/"
          className="text-gray-900 text-sm border px-4 py-2 rounded-lg hover:bg-blue-50 transition flex items-center gap-1"
        >
        <ArrowLeft />
        </a>
      </div>

      {/* WARNING BANNER */}
      <div className="p-4 bg-yellow-100 text-yellow-900 text-sm rounded-lg mb-8">
        <strong>Note:</strong> Helix Search is still in active development.
        Results may be inaccurate or incomplete. Do not rely on the output for
        critical use cases.
      </div>

      {/* INTRO */}
      <p className="text-lg leading-relaxed mb-8">
        Helix Search is an independently built search engine created by{" "}
        <strong>Utkarsh Singh</strong>. It includes a custom Go-based crawler, a
        Python-powered indexer, and a Flask ranking engine. Helix aims to
        deliver clean, relevant, and efficient search results.
      </p>

      {/* CRAWLING SECTION */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Web Crawling Coverage</h2>
        <p className="leading-relaxed mb-3">
          Helix uses a custom high-performance crawler written in{" "}
          <strong>GoLang</strong>, capable of extracting content from trusted
          domains efficiently.
        </p>

        <ul className="list-disc ml-6 space-y-2 text-[15px]">
          <li>
            <strong>1,400+ websites crawled</strong>
          </li>
          <li>
            <strong>1,00,000+ keywords indexed</strong>
          </li>
        </ul>

        <p className="mt-4 mb-2 font-medium">Allowed Seed Domains:</p>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm leading-relaxed">
          educative.io, geeksforgeeks.org, datacamp.com, eazydiner.com,
          cntraveller.in, bbc.com, timesofindia.indiatimes.com, hbr.org,
          timeanddate.com, artificialintelligence-news.com, recipetineats.com,
          docs.python.org, allrecipes.com, w3schools.com, britannica.com
        </div>
      </section>

      {/* INDEXING SECTION */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">How Indexing Works</h2>
        <p className="leading-relaxed mb-3">
          The indexer is written in <strong>Python</strong>. After crawling,
          pages are processed and analyzed using multiple text-processing steps.
        </p>

        <ul className="list-disc ml-6 space-y-2 text-[15px]">
          <li>Extracts meaningful words from each page</li>
          <li>Removes stop-words for cleaner relevance</li>
          <li>Counts how many documents each term appears in</li>
          <li>Stores term frequencies and metadata for ranking</li>
        </ul>
      </section>

      {/* RANKING SECTION */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">How Search Ranking Works</h2>
        <p className="leading-relaxed mb-3">
          Helix Search uses a TF-IDF based scoring system along with additional
          ranking factors. When a query is submitted, each document receives a
          score based on relevance and statistical weight.
        </p>

        <h3 className="text-lg font-semibold mb-2">
          Factors Used in Scoring:
        </h3>

        <ul className="list-disc ml-6 space-y-2 text-[15px]">
          <li>TF-IDF relevance</li>
          <li>Keyword match in page title</li>
          <li>Keyword density in snippet</li>
          <li>Document length normalization</li>
        </ul>
      </section>

      {/* SAMPLE JSON RESULT */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Sample Indexed Result</h2>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-auto">
          <pre className="whitespace-pre-wrap break-words text-[13px]">
{`{
  "id": "691e0622585932806ce4ca87",
  "url": "https://campus.w3schools.com/collections/course-catalog/products/css-course",
  "title": "Learn CSS — W3Schools.com",
  "snippet": "Start your web styling journey by learning CSS...",
  "favicon": "https://campus.w3schools.com/.../W3Schools_Logo_RGB_32x32.png",
  "image": "https://campus.w3schools.com/.../1200x1200.png",
  "site_name": "W3Schools.com",
  "score": 5.40516190099935
}`}
          </pre>
        </div>
      </section>

      {/* SCORE EXPLANATION */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">
          How This Score Is Calculated
        </h2>

        <ol className="list-decimal ml-6 space-y-3 leading-relaxed text-[15px]">
          <li>
            <strong>Term Frequency (TF)</strong> — counts how often query words
            appear.
          </li>
          <li>
            <strong>Inverse Document Frequency (IDF)</strong> — gives more weight
            to rare terms.
          </li>
          <li>
            <strong>Title Match Score</strong> — boosts results with relevant
            titles.
          </li>
          <li>
            <strong>Snippet Density</strong> — measures concentration of keywords
            in the preview text.
          </li>
          <li>
            <strong>Document Normalization</strong> — prevents long pages from
            dominating results.
          </li>
        </ol>
      </section>

      {/* POPULAR QUERIES */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3">Try These Popular Queries</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {popularQueries.map((q) => (
            <a
              key={q}
              href={`https://helix-search.vercel.app/results?q=${encodeURIComponent(
                q
              )}`}
              className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <span className="material-symbols-outlined text-[18px]">
                call_made
              </span>
              <span>{q}</span>
            </a>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <p className="text-center text-sm text-[#5f6368] mt-10">
        © {new Date().getFullYear()} Helix Search — Built by Utkarsh Singh
      </p>
    </div>
  );
}
