"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, Moon, Sun, ArrowLeft, Play, Loader, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"

type Category = "all" | "images" | "news" | "videos"

interface Result {
  title: string
  description: string
  url: string
  source?: string
  thumbnail?: string
  rating?: number
  duration?: string
}

const categories: { id: Category; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "images", label: "IMAGES" },
  { id: "news", label: "NEWS" },
  { id: "videos", label: "VIDEOS" },
]

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i < fullStars
              ? "fill-yellow-400 text-yellow-400"
              : i === fullStars && hasHalfStar
                ? "fill-yellow-400 text-yellow-400 opacity-50"
                : "text-muted-foreground"
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{rating}</span>
    </div>
  )
}

export default function ResultsPage() {
  const [isDark, setIsDark] = useState(false)
  const [activeCategory, setActiveCategory] = useState<Category>("all")
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""
  const [inputValue, setInputValue] = useState(query)

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&category=${activeCategory}`)
        const data = await response.json()
        setResults(data.results || [])
      } catch (error) {
        console.error("Error fetching results:", error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    if (query) {
      fetchResults()
    }
  }, [query, activeCategory])

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (inputValue.trim()) {
      router.push(`/results?q=${encodeURIComponent(inputValue)}`)
    }
  }

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
            {/* Top Row: Logo, Search Bar, Theme Toggle */}
            <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
              {/* Logo with Back Button */}
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <button
                  onClick={() => router.push("/")}
                  className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition-colors"
                  aria-label="Back to home"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                </button>
                {/* <h1
                  className="text-lg sm:text-xl font-bold cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap"
                  onClick={() => router.push("/")}
                >
                  SearchIt
                </h1> */}
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex-1 max-w-full sm:max-w-2xl min-w-0">
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

              {/* Theme Toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsDark(!isDark)}
                className="rounded-full border-border hover:bg-muted flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
              </Button>
            </div>

            {/* Category Tabs - Below Search Bar */}
            <div className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto scrollbar-hide -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`py-2.5 sm:py-3 px-1 text-xs sm:text-sm font-medium transition-all duration-300 relative whitespace-nowrap ${
                    activeCategory === category.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-current={activeCategory === category.id ? "page" : undefined}
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
            {/* Results container with optimal width */}
            <div className={activeCategory === "images" ? "" : "max-w-full lg:max-w-3xl"}>
              <div className="mb-4 sm:mb-6">
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Showing <span className="font-semibold text-foreground">{activeCategory.toUpperCase()}</span> results
                  for <span className="font-semibold text-foreground">"{query}"</span>
                </p>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <Loader className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-muted-foreground text-sm">Loading {activeCategory} results...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Results Grid/List */}
                  {results.length > 0 ? (
                    <div className={activeCategory === "images" ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4" : "space-y-4 sm:space-y-6"}>
                      {results.map((result, index) => (
                        <article
                          key={index}
                          className={`group cursor-pointer animate-in fade-in-up duration-500 ${
                            activeCategory === "images" ? "" : ""
                          }`}
                          style={{
                            animationDelay: `${index * 50}ms`,
                            animationFillMode: "both",
                          }}
                        >
                          {activeCategory === "images" ? (
                            <div className="space-y-2">
                              <div className="relative bg-muted rounded-lg overflow-hidden aspect-square">
                                <img
                                  src={result.thumbnail || "/placeholder.svg"}
                                  alt={result.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <h3 className="text-xs sm:text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                                {result.title}
                              </h3>
                              <p className="text-xs text-muted-foreground truncate">{result.source}</p>
                            </div>
                          ) : activeCategory === "videos" ? (
                            <div className="p-3 sm:p-4 rounded-lg hover:bg-muted/50 transition-colors duration-200 border border-border/50">
                              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <div className="relative bg-muted rounded-lg overflow-hidden flex-shrink-0 w-full sm:w-40 md:w-48 h-40 sm:h-24 md:h-28">
                                  <img
                                    src={result.thumbnail || "/placeholder.svg"}
                                    alt={result.title}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <Play className="h-8 w-8 sm:h-6 sm:w-6 text-white" />
                                  </div>
                                  {result.duration && (
                                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                                      {result.duration}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-muted-foreground mb-1 group-hover:text-primary transition-colors truncate">
                                    {result.url}
                                  </p>
                                  <h2 className="text-sm sm:text-base font-semibold text-primary mb-1 group-hover:underline transition-all line-clamp-2">
                                    {result.title}
                                  </h2>
                                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{result.description}</p>
                                  {result.source && <p className="text-xs text-muted-foreground mt-2">{result.source}</p>}
                                </div>
                              </div>
                            </div>
                          ) : activeCategory === "news" ? (
                            <div className="p-3 sm:p-4 rounded-lg hover:bg-muted/50 transition-colors duration-200 border border-border/50">
                              <p className="text-xs text-muted-foreground mb-1 font-medium">{result.source}</p>
                              <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                {result.title}
                              </h2>
                              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
                                {result.description}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2 truncate">{result.url}</p>
                            </div>
                          ) : (
                            <div className="p-3 sm:p-4 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                              <p className="text-xs text-muted-foreground mb-1 group-hover:text-primary transition-colors truncate">
                                {result.url}
                              </p>
                              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-primary mb-2 group-hover:underline transition-all line-clamp-2">
                                {result.title}
                              </h2>
                              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 sm:line-clamp-3 mb-2">
                                {result.description}
                              </p>
                              {result.rating && <StarRating rating={result.rating} />}
                            </div>
                          )}
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground text-sm">No results found for your query.</p>
                    </div>
                  )}

                  {/* Results Footer */}
                  {results.length > 0 && (
                    <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border text-center">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        SearchIt • {results.length} {activeCategory} results found
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
