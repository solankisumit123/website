export interface DownloadLink {
  quality: string;
  url: string;
  size: string;
  audio: string;
  format: string;
  mirrors?: string[];
}

export interface Movie {
  _id?: string;
  title: string;
  year: number;
  poster: string;
  backdrop: string;
  rating: number;
  trailerUrl: string;
  downloadLinks: DownloadLink[];
  category: string;
} 