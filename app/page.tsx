"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"

export default function Home() {
  const [query, setQuery] = useState("")
  const [isDark, setIsDark] = useState(false)
  const router = useRouter()

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (query.trim()) {
      router.push(`/results?q=${encodeURIComponent(query)}`)
    }
  }

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
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        {/* Main Content */}
        <main className="flex flex-col items-center justify-center flex-1 px-4">
          <div className="w-full max-w-2xl space-y-12 animate-in fade-in duration-500">
            {/* Logo */}
            <div className="text-center space-y-2">
              <h1 className="text-5xl font-bold tracking-tight text-pretty">Helix</h1>
              <p className="text-muted-foreground text-lg">Find what matters</p>
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
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search anything..."
                      className="flex-1 bg-transparent border-none outline-none text-foreground placeholder-muted-foreground"
                      aria-label="Search query"
                    />
                  </div>
                </div>
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
                onClick={() => router.push("/lucky")}
                variant="outline"
                className="border-border rounded-full px-8 font-medium hover:bg-muted bg-transparent"
              >
                I'm Feeling Lucky
              </Button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
