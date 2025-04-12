export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  category: 'education' | 'guidance' | 'opportunities' | 'schools' | 'universities';
  tags: string[];
}

export interface NewsState {
  articles: NewsArticle[];
  featuredArticles: NewsArticle[];
  isLoading: boolean;
  error: string | null;
}
