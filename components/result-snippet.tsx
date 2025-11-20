"use client";

import { useRef } from "react";

interface Result {
  id: string;
  url: string;
  title: string;
  snippet: string;
  score: number;
  favicon: string;
  site_name: string;
  image: string;
}

interface Props {
  r: Result;
  i: number;
  openInfo: number | null;
  setOpenInfo: (v: number | null) => void;
  infoRef: React.RefObject<HTMLDivElement>;
  children?: React.ReactNode; // For injecting "People also search for"
}

export default function ResultSnippet({
  r,
  i,
  openInfo,
  setOpenInfo,
  infoRef,
  children,
}: Props) {
  return (
    <>
      <article
        className="p-5 rounded-2xl border border-border bg-card hover:bg-muted/40 
        transition cursor-pointer group flex gap-6 relative"
      >
        {/* INFO BUTTON */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenInfo(openInfo === i ? null : i);
          }}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground 
          flex items-center justify-center"
        >
          <span className="material-symbols-outlined small">help</span>
        </button>

        {/* LEFT CONTENT */}
        <div className="flex-1 min-w-0">
          <div className="flex gap-2 mb-2 items-center">
            <img
              src={r.favicon}
              onError={(e) => (e.currentTarget.style.display = "none")}
              className="w-6 h-6 rounded-sm object-contain"
            />

            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium text-foreground">{r.site_name}</span>
              <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                {new URL(r.url).hostname}
              </span>
            </div>
          </div>

          <h2
            onClick={() => window.open(r.url, "_blank")}
            className="text-lg font-semibold text-blue-600 dark:text-blue-400 
            group-hover:underline leading-snug mb-1"
          >
            {r.title}
          </h2>

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {r.snippet}
          </p>
        </div>

        {/* RIGHT IMAGE */}
        {r.image && (
          <img
            src={r.image}
            onError={(e) => (e.currentTarget.style.display = "none")}
            className="w-28 h-28 rounded-xl object-cover border border-border hidden sm:block"
          />
        )}

        {/* INFO POPUP */}
        {openInfo === i && (
          <div
            ref={infoRef}
            className="absolute top-12 right-3 bg-popover border border-border 
            shadow-lg rounded-lg p-3 w-60 text-xs z-50"
          >
            <p className="font-semibold mb-1 text-foreground">Why this result?</p>

            <p className="text-muted-foreground mb-2">
              Score: <span className="font-semibold">{r.score.toFixed(3)}</span>
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

      {children}
    </>
  );
}
