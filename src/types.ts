export interface HiAnimeSearchResult {
  title: string;
  alternativeTitle: string;
  id: string;
  poster: string;
  episodes: {
    sub: number;
    dub: number;
    eps: number;
  };
  type: string;
  duration: string;
}

export interface SearchResponse {
  pageInfo: {
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
  };
  response: HiAnimeSearchResult[];
}

export interface AnimeDetails {
  title: string;
  alternativeTitle: string;
  japanese: string;
  id: string;
  poster: string;
  rating: string;
  type: string;
  episodes: {
    sub: number;
    dub: number;
    eps: number;
  };
  synopsis: string;
  synonyms: string;
  aired: {
    from: string;
    to: string | null;
  };
  premiered: string;
  duration: string;
  status: string;
  MAL_score: string;
  genres: string[];
  studios: string;
  producers: string[];
  moreSeasons: Season[];
  related: RelatedAnime[];
  mostPopular: RelatedAnime[];
  recommended: RecommendedAnime[];
}

export interface Season {
  title: string;
  alternativeTitle: string;
  id: string;
  poster: string;
  isActive: boolean;
}

export interface RelatedAnime {
  title: string;
  alternativeTitle: string;
  id: string;
  poster: string;
  type: string;
  episodes: {
    sub: number;
    dub: number;
    eps: number;
  };
}

export interface RecommendedAnime extends RelatedAnime {
  duration: string;
  is18Plus: boolean;
}

export interface Episode {
  title: string;
  alternativeTitle: string;
  id: string;
  isFiller: boolean;
  episodeNumber: number;
}
