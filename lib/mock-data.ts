export interface Result {
  title: string
  description: string
  url: string
  source?: string
  thumbnail?: string
  rating?: number // added rating field for star ratings
  duration?: string // added duration for videos
}

export interface CategoryResults {
  all: Result[]
  images: Result[]
  news: Result[]
  videos: Result[]
}

export const mockResults: CategoryResults = {
  all: [
    {
      title: "Understanding React Hooks - The Complete Guide",
      description:
        "Learn about React Hooks including useState, useEffect, and custom hooks. This comprehensive guide covers all the fundamentals you need to master modern React development.",
      url: "react-academy.dev › hooks › guide",
      source: "React Academy",
      rating: 4.8, // added rating
    },
    {
      title: "Next.js 15: Building Full-Stack Applications",
      description:
        "Explore the latest features of Next.js 15 including App Router, Server Components, and Advanced Caching. Build scalable full-stack applications with ease.",
      url: "nextjs-docs.vercel.app › docs › v15",
      source: "Vercel Documentation",
      rating: 4.9, // added rating
    },
    {
      title: "Tailwind CSS: Utility-First CSS Framework",
      description:
        "Master Tailwind CSS for rapid UI development. Learn responsive design, dark mode, and advanced techniques to build beautiful interfaces faster than ever.",
      url: "tailwindcss.com › docs › installation",
      source: "Tailwind CSS",
    },
    {
      title: "Web Performance Optimization Best Practices",
      description:
        "Improve your website speed and performance. Discover essential techniques for Core Web Vitals, lazy loading, code splitting, and efficient caching strategies.",
      url: "web-performance.guide › optimization › tips",
      source: "Web Performance Guide",
      rating: 4.7, // added rating
    },
    {
      title: "TypeScript Advanced Types and Patterns",
      description:
        "Deep dive into TypeScript advanced features. Learn generics, utility types, discriminated unions, and design patterns for building robust type-safe applications.",
      url: "typescript-advanced.dev › guides › types",
      source: "TypeScript Guides",
      rating: 4.6, // added rating
    },
    {
      title: "Modern CSS Grid and Flexbox Layouts",
      description:
        "Master CSS Grid and Flexbox for creating responsive layouts. Build complex designs with elegant, maintainable CSS that works across all browsers.",
      url: "css-tricks.dev › guides › layout › grid-flex",
      source: "CSS Tricks",
    },
  ],
  images: [
    {
      title: "Beautiful Landscape Photography Collection",
      description: "Stunning natural landscape images from around the world",
      url: "pinterest.com › landscape-photography",
      source: "Pinterest",
      thumbnail: "/vast-mountain-valley.png",
    },
    {
      title: "Modern Web Design Inspiration",
      description: "Contemporary UI and UX design examples for inspiration",
      url: "unsplash.com › web-design",
      source: "Unsplash",
      thumbnail: "/modern-web-design.png",
    },
    {
      title: "Nature and Wildlife Photography",
      description: "High-quality wildlife and nature photographs",
      url: "pexels.com › wildlife",
      source: "Pexels",
      thumbnail: "/wildlife-nature.jpg",
    },
    {
      title: "Abstract Art Digital Collection",
      description: "Contemporary digital and abstract art pieces",
      url: "artstation.com › abstract-art",
      source: "ArtStation",
      thumbnail: "/abstract-digital-composition.png",
    },
  ],
  news: [
    {
      title: "Web Technologies See Rapid Growth in 2025",
      description:
        "Latest developments in JavaScript frameworks and web standards show significant adoption increase. Industry experts predict major shifts in development practices.",
      url: "times-of-india.com › tech › news",
      source: "Times of India",
    },
    {
      title: "Global Tech Summit Discusses AI Integration in Web Development",
      description:
        "Leading technology companies and developers gather to discuss the future of AI-assisted web development. Key announcements from major platforms expected.",
      url: "bbc.com › technology › news",
      source: "BBC News",
    },
    {
      title: "Open Source Community Celebrates Major Release Milestone",
      description:
        "Popular web development frameworks reach significant milestones. Community contributions highlighted as key factor in success.",
      url: "reuters.com › technology › news",
      source: "Reuters",
    },
    {
      title: "Web Security Standards Updated with New Protocols",
      description:
        "International standards organizations release updated security guidelines for web applications. Industry adoption expected within six months.",
      url: "tech-news.org › security",
      source: "Tech News International",
    },
  ],
  videos: [
    {
      title: "React Hooks Deep Dive Tutorial",
      description: "Comprehensive video tutorial covering all React Hooks with practical examples and best practices.",
      url: "youtube.com › watch?v=hooks-tutorial",
      source: "YouTube",
      thumbnail: "/react-hooks-tutorial.png",
      duration: "2h 15m", // added duration
    },
    {
      title: "Next.js Full-Stack Development Course",
      description:
        "Complete course on building full-stack applications with Next.js. Includes deployment and production optimization.",
      url: "youtube.com › watch?v=nextjs-course",
      source: "YouTube",
      thumbnail: "/nextjs-fullstack.jpg",
      duration: "6h", // added duration
    },
    {
      title: "Tailwind CSS Design System Implementation",
      description:
        "Learn to build scalable design systems using Tailwind CSS. Includes component architecture and theming strategies.",
      url: "vimeo.com › tailwind-design-system",
      source: "Vimeo",
      thumbnail: "/tailwind-design-system.jpg",
      duration: "1h 45m", // added duration
    },
    {
      title: "Web Performance Optimization Masterclass",
      description:
        "Expert tips on optimizing web application performance. Covers Core Web Vitals, caching strategies, and monitoring.",
      url: "udemy.com › performance-masterclass",
      source: "Udemy",
      thumbnail: "/web-performance-optimization.png",
      duration: "3h", // added duration
    },
  ],
}
