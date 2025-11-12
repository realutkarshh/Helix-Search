"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader } from "lucide-react"

export default function LuckyPage() {
  const router = useRouter()

  useEffect(() => {
    const randomQueries = [
      "react hooks tutorial",
      "web design inspiration",
      "javascript best practices",
      "nextjs deployment",
      "tailwind css tips",
      "typescript advanced",
      "web performance optimization",
      "css grid layout",
      "api design patterns",
      "database optimization",
    ]

    const randomQuery = randomQueries[Math.floor(Math.random() * randomQueries.length)]
    const randomCategory = ["all", "images", "news", "videos"][Math.floor(Math.random() * 4)]

    router.push(`/results?q=${encodeURIComponent(randomQuery)}&category=${randomCategory}`)
  }, [router])

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader className="h-8 w-8 text-primary animate-spin" />
        <p className="text-muted-foreground">Taking you to a random result...</p>
      </div>
    </div>
  )
}
