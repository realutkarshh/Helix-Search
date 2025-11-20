"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Moon, Sun, ArrowLeft, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import Image from "next/image";

type Category = "all" | "images" | "news" | "videos";

interface RealAPIResult {
  id: string;
  url: string;
  title: string;
  snippet: string;
  score: number;
  favicon: string;
  site_name: string;
  image: string;
}

const categories: { id: Category; label: string }[] = [
  { id: "all", label: "WEB" },
  { id: "images", label: "IMAGES" },
  { id: "news", label: "NEWS" },
  { id: "videos", label: "VIDEOS" },
];

const relatedSearches: Record<string, string[]> = {
  "artificial intelligence": [
    "Artificial Neural Networks",
    "Will AI replace Humans ?",
    "Machine Learning",
    "AI Foundations",
  ],
  react: ["nextjs", "react hooks", "typescript", "zustand"],
  python: ["fastapi", "django", "uvicorn", "asyncio"],
  javascript: ["event loop", "nodejs", "promises", "async await"],
  html: ["css", "semantic tags", "accessibility", "seo basics"],
  default: [
    "web development",
    "software engineering",
    "frontend roadmap",
    "apis",
  ],
};

function getRelatedSearches(query: string) {
  const key = query.toLowerCase().trim();
  return relatedSearches[key] || relatedSearches.default;
}

export default function ResultsPage() {
  const [isDark, setIsDark] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [results, setResults] = useState<RealAPIResult[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const [count, setCount] = useState<number>(0);
  const [openInfo, setOpenInfo] = useState<number | null>(null);
  const infoRef = useRef<HTMLDivElement | null>(null);

  // Close popup on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
        setOpenInfo(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [inputValue, setInputValue] = useState(query);

  useEffect(() => {
    if (!query) return;

    // 🚀 Fetch ONLY for ALL category
    if (activeCategory === "all") {
      const fetchResults = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `https://basic-search-engine.onrender.com/search?q=${encodeURIComponent(
              query
            )}`
          );

          const data = await response.json();
          setResults(data.results || []);
          setCount(data.count || 0);
        } catch (err) {
          console.error("Error fetching results", err);
          setResults([]);
        } finally {
          setLoading(false);
        }
      };

      fetchResults();
    } else {
      // 🚀 Other categories → No API call, show "COMING SOON"
      setResults([]);
      setLoading(false);
    }
  }, [query, activeCategory]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    router.push(`/results?q=${encodeURIComponent(inputValue)}`);
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <button
                  onClick={() => router.push("/")}
                  className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition-colors"
                  aria-label="Back to home"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                </button>
              </div>

              <form
                onSubmit={handleSearch}
                className="flex-1 max-w-full sm:max-w-2xl min-w-0"
              >
                <div className="relative bg-card border border-border rounded-full px-3 sm:px-4 py-2 sm:py-3 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Search..."
                      className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder-muted-foreground min-w-0"
                      aria-label="Search query"
                    />
                  </div>
                </div>
              </form>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsDark(!isDark)}
                className="rounded-full border-border hover:bg-muted flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </Button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto scrollbar-hide -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`py-2.5 sm:py-3 px-1 text-xs sm:text-sm font-medium transition-all duration-300 relative whitespace-nowrap ${
                    activeCategory === category.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-current={
                    activeCategory === category.id ? "page" : undefined
                  }
                >
                  {category.label}
                  {activeCategory === category.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
            <div
              className={
                activeCategory === "images" ? "" : "max-w-full lg:max-w-3xl"
              }
            >
              <div className="mb-4 sm:mb-6">
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Showing{" "}
                  <span className="font-semibold text-foreground">{count}</span>{" "}
                  results for{" "}
                  <span className="font-semibold text-foreground">
                    "{query}"
                  </span>
                </p>
              </div>

              {/* LOADING */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <Loader className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-muted-foreground text-sm">
                      Loading {activeCategory} results...
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* 🚀 FEATURE COMING SOON for non-ALL categories */}
                  {activeCategory !== "all" ? (
                    <div className="text-center py-16">
                      <h2 className="text-xl font-semibold">
                        FEATURE COMING SOON
                      </h2>
                      <p className="text-muted-foreground mt-2 text-sm">
                        Stay tuned! We're working hard on {activeCategory}{" "}
                        search.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* ALL category results */}
                      {results.length > 0 ? (
                        <div className="space-y-6">
                          {results.map((r, i) => (
                            <div key={i}>
                              <article className="py-4 border-b border-border group flex gap-6 cursor-pointer relative">
                                {/* TOP-RIGHT HELP ICON */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenInfo(openInfo === i ? null : i);
                                  }}
                                  className="absolute top-3 right-3 text-muted-foreground hover:text-foreground 
               flex items-center justify-center"
                                >
                                  <span className="material-symbols-outlined small">
                                    help
                                  </span>
                                </button>

                                {/* LEFT CONTENT */}
                                <div className="flex-1 min-w-0">
                                  {/* Favicon + Site Info */}
                                  <div className="flex gap-2 mb-2 items-center">
                                    <img
                                      src={r.favicon}
                                      onError={(e) =>
                                        (e.currentTarget.style.display = "none")
                                      }
                                      className="w-6 h-6 rounded-sm object-contain"
                                    />

                                    <div className="flex flex-col leading-tight">
                                      <span className="text-sm font-normal text-foreground">
                                        {r.site_name}
                                      </span>

                                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                                        {new URL(r.url).hostname}
                                      </span>
                                    </div>
                                  </div>

                                  {/* TITLE */}
                                  <h2
                                    onClick={() => window.open(r.url, "_blank")}
                                    className="text-xl font-normal text-blue-600 group-hover:underline"
                                  >
                                    {r.title}
                                  </h2>

                                  {/* SNIPPET */}
                                  <p className="text-[14px] text-[#4d5156] leading-relaxed line-clamp-3">
                                    {r.snippet}
                                  </p>
                                </div>

                                {/* RIGHT IMAGE */}
                                {r.image && (
                                  <div className="flex flex-col justify-between items-center">
                                    <img
                                      src={r.image}
                                      onError={(e) =>
                                        (e.currentTarget.style.display = "none")
                                      }
                                      className="w-28 h-28 rounded-xl object-cover border border-border hidden sm:block"
                                    />
                                  </div>
                                )}

                                {/* INFO POPUP */}
                                {openInfo === i && (
                                  <div
                                    ref={infoRef}
                                    className="absolute top-12 right-3 bg-popover border border-border 
                 shadow-lg rounded-lg p-3 w-60 text-xs z-50"
                                  >
                                    <p className="font-semibold mb-1 text-foreground">
                                      Why this result?
                                    </p>

                                    <p className="text-muted-foreground mb-2">
                                      Score:{" "}
                                      <span className="font-semibold">
                                        {r.score.toFixed(3)}
                                      </span>
                                    </p>

                                    <p className="font-semibold mb-1 text-foreground">
                                      How is this score calculated?
                                    </p>

                                    <ul className="list-disc ml-4 text-muted-foreground space-y-1">
                                      <li>TF-IDF relevance</li>
                                      <li>Keyword match in title</li>
                                      <li>Keyword density in snippet</li>
                                      <li>Document length normalization</li>
                                    </ul>
                                  </div>
                                )}
                              </article>

                              {/* 🎯 Insert People Also Search For after the 3rd result */}
                              {i === 2 && (
                                <div className="my-10">
                                  <h3 className="text-lg font-semibold mb-4">
                                    People also search for
                                  </h3>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {getRelatedSearches(query).map((term) => {
                                      const parts = term.split(" ");
                                      const first = parts.shift() || "";
                                      const rest = parts.join(" ");

                                      return (
                                        <button
                                          key={term}
                                          onClick={() =>
                                            router.push(
                                              `/results?q=${encodeURIComponent(
                                                term
                                              )}`
                                            )
                                          }
                                          className="w-full flex items-center justify-between px-4 py-3 
              bg-muted hover:bg-muted/70 rounded-xl border border-border
              text-sm transition-all text-left"
                                        >
                                          <span>
                                            <span className="font-semibold">
                                              {first}
                                            </span>
                                            {rest ? " " + rest : ""}
                                          </span>

                                          <Search className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground text-sm">
                            No results found.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
