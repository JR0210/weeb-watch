export interface Pagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface ImageUrls {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface Images {
  jpg: ImageUrls;
  webp: ImageUrls;
}

export interface TrailerImages {
  image_url: string | null;
  small_image_url: string | null;
  medium_image_url: string | null;
  large_image_url: string | null;
  maximum_image_url: string | null;
}

export interface Trailer {
  youtube_id: string | null;
  url: string | null;
  embed_url: string | null;
  images: TrailerImages;
}

export interface Title {
  type: string;
  title: string;
}

export interface AiredProp {
  day: number | null;
  month: number | null;
  year: number | null;
}

export interface Aired {
  from: string;
  to: string | null;
  prop: {
    from: AiredProp;
    to: AiredProp;
  };
  string: string;
}

export interface Producer {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Theme {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface AnimeData {
  mal_id: number;
  url: string;
  images: Images;
  trailer: Trailer;
  approved: boolean;
  titles: Title[];
  title: string;
  title_english: string;
  title_japanese: string;
  title_synonyms: string[];
  type: string;
  source: string;
  episodes: number;
  status: string;
  airing: boolean;
  aired: Aired;
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: string;
  season: string | null;
  year: number | null;
  broadcast: {
    day: string | null;
    time: string | null;
    timezone: string | null;
    string: string | null;
  };
  producers: Producer[];
  licensors: any[];
  studios: any[];
  genres: any[];
  explicit_genres: any[];
  themes: Theme[];
  demographics: any[];
}

export interface ApiResponse {
  pagination: Pagination;
  data: AnimeData[];
}
