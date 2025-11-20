"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";

export default function Home() {
  const [query, setQuery] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const router = useRouter();

  // Redirect to search page
  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = query.trim();
    if (!q) return;

    router.push(`/results?q=${encodeURIComponent(q)}`);
    setSuggestions([]); // Hide suggestions on search
  };

  // Mock API – replace with real API later
  const fetchSuggestions = (text: string) => {
    if (!text.trim()) {
      setSuggestions([]);
      return;
    }

    const mockData = [
      "Cake recipe",
      "Creamy Pasta recipe",
      "CSS Tutorial",
      "What is HTML?",
      "Are people really left or right handed?",
      "Machine Learning",
      "Will AI replace Humans?",
      "Top restaurants in Delhi",
      "Top Hotels in Delhi",
      "Places to visit in Japan",
    ];

    setSuggestions(
      mockData.filter((item) => item.toLowerCase().includes(text.toLowerCase()))
    );
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
        {/* Theme Toggle */}
        <div className="fixed top-6 right-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsDark(!isDark)}
            className="rounded-full border-border hover:bg-muted"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Main Content */}
        <main className="flex flex-col items-center justify-center flex-1 px-4">
          <div className="w-full max-w-2xl space-y-12 animate-in fade-in duration-500">
            {/* Logo */}
            <div className="flex justify-center py-6">
              <img
                src="/helix-logo.png"
                alt="Helix Logo"
                className="w-40 sm:w-48 md:w-56 lg:w-64 xl:w-72 h-auto"
              />
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition duration-300 blur-sm"></div>

                <div className="relative bg-card border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />

                    <input
                      type="text"
                      value={query}
                      onChange={(e) => {
                        const val = e.target.value;
                        setQuery(val);
                        fetchSuggestions(val);
                        setActiveIndex(-1);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          setActiveIndex((prev) =>
                            prev < suggestions.length - 1 ? prev + 1 : prev
                          );
                        } else if (e.key === "ArrowUp") {
                          e.preventDefault();
                          setActiveIndex((prev) =>
                            prev > 0 ? prev - 1 : prev
                          );
                        } else if (e.key === "Enter") {
                          if (activeIndex >= 0) {
                            setQuery(suggestions[activeIndex]);
                            setSuggestions([]);
                          }
                          handleSearch(e);
                        }
                      }}
                      placeholder="Search anything..."
                      className="flex-1 bg-transparent border-none outline-none text-foreground placeholder-muted-foreground"
                    />
                  </div>
                </div>

                {/* Suggestions Dropdown */}
                {suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-20">
                    {suggestions.map((s, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setQuery(s);
                          setSuggestions([]);
                          handleSearch();
                        }}
                        className={`px-4 py-3 cursor-pointer text-sm hover:bg-muted transition flex items-center gap-3 ${
                          activeIndex === i ? "bg-muted" : ""
                        }`}
                      >
                        <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <span className="text-foreground">{s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>

            {/* Actions */}
            <div className="flex justify-center gap-3">
              <Button
                onClick={handleSearch}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 font-medium transition-all duration-200"
              >
                Search
              </Button>

              <Button
                onClick={() => router.push("/about-helix")}
                variant="outline"
                className="border-border rounded-full px-8 font-medium hover:bg-muted bg-transparent"
              >
                About Helix
              </Button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
