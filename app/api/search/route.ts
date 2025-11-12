import { type NextRequest, NextResponse } from "next/server"
import { mockResults } from "@/lib/mock-data"

const cache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

function getCachedData(key: string) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

function setCachedData(key: string, data: unknown) {
  cache.set(key, { data, timestamp: Date.now() })
}

async function fetchGeneralResults(query: string) {
  const cachedData = getCachedData(`general-${query}`)
  if (cachedData) return cachedData

  try {
    const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      throw new Error(`DuckDuckGo API returned ${response.status}`)
    }

    const data = (await response.json()) as Record<string, unknown>
    const results: Array<{ title: string; description: string; url: string; source: string }> = []

    // Add abstract result if available
    if (data.AbstractText && data.AbstractSource) {
      results.push({
        title: (data.Heading as string) || query,
        description: (data.AbstractText as string).substring(0, 160),
        url: (data.AbstractURL as string) || `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
        source: data.AbstractSource as string,
      })
    }

    // Add related topics
    if (Array.isArray(data.RelatedTopics) && data.RelatedTopics.length > 0) {
      const relatedTopics = (data.RelatedTopics as Array<Record<string, unknown>>).slice(0, 6)
      relatedTopics.forEach((topic) => {
        if (topic.Text) {
          const textContent = (topic.Text as string).split("\n")
          results.push({
            title: textContent[0],
            description: textContent.slice(1).join(" ").substring(0, 160) || "Related topic",
            url: (topic.FirstURL as string) || `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
            source: "DuckDuckGo",
          })
        }
      })
    }

    // Ensure we have results
    if (results.length === 0) {
      results.push(
        {
          title: `Search results for "${query}"`,
          description: "No direct results found. Try a different search query.",
          url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
          source: "DuckDuckGo",
        },
        {
          title: `${query} - Wikipedia`,
          description: "Find comprehensive information about this topic.",
          url: `https://en.wikipedia.org/wiki/${query.replace(/ /g, "_")}`,
          source: "Wikipedia",
        },
      )
    }

    setCachedData(`general-${query}`, results.slice(0, 8))
    return results.slice(0, 8)
  } catch (error) {
    console.error("Error fetching general results:", error)
    return []
  }
}

async function fetchImageResults(query: string) {
  const cachedData = getCachedData(`images-${query}`)
  if (cachedData) return cachedData

  try {
    const response = await fetch(`https://lexica.art/api/v1/search?q=${encodeURIComponent(query)}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      throw new Error(`Lexica API returned ${response.status}`)
    }

    const data = (await response.json()) as Record<string, unknown>
    const images = (data.images as Array<Record<string, unknown>>) || []

    const results = images.slice(0, 12).map((img) => ({
      title: (img.prompt as string)?.substring(0, 60) || "AI Generated Image",
      description: (img.model as string) || "Lexica AI",
      url: (img.src as string) || "",
      source: "Lexica.art",
      thumbnail: img.src as string,
    }))

    // Fallback if Lexica returns no results
    if (results.length === 0) {
      const fallbackResults = []
      for (let i = 1; i <= 12; i++) {
        fallbackResults.push({
          title: `${query} image ${i}`,
          description: "High-quality royalty-free image",
          url: `https://source.unsplash.com/600x400/?${encodeURIComponent(query)}&random=${i}`,
          source: "Unsplash",
          thumbnail: `https://source.unsplash.com/300x300/?${encodeURIComponent(query)}&random=${i}`,
        })
      }
      setCachedData(`images-${query}`, fallbackResults)
      return fallbackResults
    }

    setCachedData(`images-${query}`, results)
    return results
  } catch (error) {
    console.error("Error fetching image results:", error)
    const fallbackResults = []
    for (let i = 1; i <= 12; i++) {
      fallbackResults.push({
        title: `${query} image ${i}`,
        description: "High-quality royalty-free image",
        url: `https://source.unsplash.com/600x400/?${encodeURIComponent(query)}&random=${i}`,
        source: "Unsplash",
        thumbnail: `https://source.unsplash.com/300x300/?${encodeURIComponent(query)}&random=${i}`,
      })
    }
    return fallbackResults
  }
}

async function parseRSSFeed(
  url: string,
  source: string,
  query: string,
): Promise<Array<{ title: string; description: string; url: string; source: string }>> {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      throw new Error(`RSS feed returned ${response.status}`)
    }

    const xmlText = await response.text()

    const titleRegex = /<title[^>]*>([^<]+)<\/title>/g
    const descRegex = /<description>([^<]*)<\/description>/g
    const linkRegex = /<link[^>]*>([^<]+)<\/link>/g

    const titles: string[] = []
    const descriptions: string[] = []
    const links: string[] = []

    let match
    while ((match = titleRegex.exec(xmlText)) !== null) {
      titles.push(match[1])
    }
    while ((match = descRegex.exec(xmlText)) !== null) {
      descriptions.push(match[1])
    }
    while ((match = linkRegex.exec(xmlText)) !== null) {
      links.push(match[1])
    }

    const results: Array<{ title: string; description: string; url: string; source: string }> = []
    const queryLower = query.toLowerCase()

    // Add first few articles
    for (let i = 1; i < Math.min(5, titles.length); i++) {
      const title = titles[i]?.trim() || ""
      const desc =
        descriptions[i]
          ?.trim()
          ?.replace(/<[^>]*>/g, "")
          .substring(0, 150) || ""
      const url = links[i]?.trim() || ""

      if (title && url) {
        // Prioritize articles matching query, but include others too
        if (title.toLowerCase().includes(queryLower) || results.length < 3) {
          results.push({
            title: title.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">"),
            description: desc.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">"),
            url: url,
            source: source,
          })
        }
      }
    }

    return results
  } catch (error) {
    console.error(`Error parsing RSS feed ${source}:`, error)
    return []
  }
}

async function fetchNewsResults(query: string) {
  const cachedData = getCachedData(`news-${query}`)
  if (cachedData) return cachedData

  const newsFeeds = [
    { url: "https://feeds.bbci.co.uk/news/rss.xml", source: "BBC News" },
    { url: "https://feeds.reuters.com/reuters/businessNews", source: "Reuters" },
    { url: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms", source: "Times of India" },
  ]

  try {
    const feedPromises = newsFeeds.map((feed) => parseRSSFeed(feed.url, feed.source, query))
    const feedResults = await Promise.all(feedPromises)
    const results = feedResults.flat().slice(0, 9)

    // Ensure we have results
    if (results.length === 0) {
      return [
        {
          title: `Latest news about ${query}`,
          description: "Check BBC News for the latest updates.",
          url: `https://www.bbc.com/news`,
          source: "BBC News",
        },
        {
          title: `Reuters: ${query}`,
          description: "International news coverage from Reuters.",
          url: `https://www.reuters.com/`,
          source: "Reuters",
        },
        {
          title: `Times of India`,
          description: "Latest news and updates.",
          url: `https://timesofindia.indiatimes.com/`,
          source: "Times of India",
        },
      ]
    }

    setCachedData(`news-${query}`, results)
    return results
  } catch (error) {
    console.error("Error fetching news results:", error)
    return []
  }
}

async function fetchVideoResults(query: string) {
  const cachedData = getCachedData(`videos-${query}`)
  if (cachedData) return cachedData

  try {
    const response = await fetch(`https://piped.video/api/v1/search?q=${encodeURIComponent(query)}&filter=videos`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      throw new Error(`Piped API returned ${response.status}`)
    }

    const data = (await response.json()) as Record<string, unknown>
    const items = (data.items as Array<Record<string, unknown>>) || []

    const results = items
      .filter((item) => item.type === "video")
      .slice(0, 10)
      .map((video) => {
        const videoId = (video.url as string)?.replace(/^.*\/watch\?v=/, "").split("&")[0] || ""
        return {
          title: (video.title as string) || "Video",
          description: `${video.uploaderName || "Unknown"} • ${video.duration || "0:00"}`,
          url: `https://piped.video/watch?v=${videoId}`,
          source: "Piped (YouTube)",
          thumbnail: (video.thumbnail as string) || "/placeholder.svg",
        }
      })

    if (results.length === 0) {
      throw new Error("No video results")
    }

    setCachedData(`videos-${query}`, results)
    return results
  } catch (error) {
    console.error("Error fetching video results:", error)
    return [
      {
        title: `${query} on YouTube`,
        description: "Find videos about your search query",
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
        source: "YouTube",
        thumbnail: "/placeholder.svg",
      },
      {
        title: `${query} tutorials and guides`,
        description: "Educational content and tutorials",
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}+tutorial`,
        source: "YouTube",
        thumbnail: "/placeholder.svg",
      },
    ]
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const q = searchParams.get("q") || ""
  const category = (searchParams.get("category") || "all") as string

  if (!q || q.trim().length === 0) {
    return NextResponse.json({ results: [], error: "Query parameter required" }, { status: 400 })
  }

  try {
    let results: unknown[] = []

    if (category === "all") {
      results = mockResults.all
    } else if (category === "images") {
      results = mockResults.images
    } else if (category === "news") {
      results = mockResults.news
    } else if (category === "videos") {
      results = mockResults.videos
    } else {
      results = mockResults.all
    }

    return NextResponse.json({ results, category, query: q })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ results: [], error: "Failed to fetch results" }, { status: 500 })
  }
}
