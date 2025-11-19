export interface SearchResult {
  id: string;
  url: string;
  title: string;
  snippet: string;
  score: number;
  favicon: string;
  
}

export interface SearchResponse {
  query: string;
  count: number;
  results: SearchResult[];
}
