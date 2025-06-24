// Base configuration for the movie application
export const BASE_CONFIG = {
  // API Configuration
  API_BASE_URL: 'http://localhost:5000',
  API_ENDPOINTS: {
    MOVIES: '/api/movies',
    SEARCH: '/api/movies/search',
  },

  // Download Providers
  DOWNLOAD_PROVIDERS: {
    DRIVELEECH: 'https://driveleech.net/file/',
    GOOGLE_DRIVE: 'https://drive.google.com/',
    MEGA: 'https://mega.nz/',
    TORRENT: 'magnet:?xt=urn:btih:',
  },

  // Movie Categories
  CATEGORIES: [
    'Action',
    'Adventure',
    'Comedy',
    'Drama',
    'Horror',
    'Sci-Fi',
    'Thriller',
    'Romance',
    'Documentary',
    'Animation',
    'IMAX',
    '4K HDR',
    '2160p HEVC',
    '1080p 10Bit',
    'Dual Audio Movies',
    'English Movies',
  ],

  // Video Qualities
  VIDEO_QUALITIES: [
    { label: '480p', value: '480p' },
    { label: '720p', value: '720p' },
    { label: '1080p', value: '1080p' },
    { label: '4K', value: '4k' },
    { label: '2160p', value: '2160p' },
  ],

  // Audio Formats
  AUDIO_FORMATS: [
    'English',
    'Hindi',
    'Dual Audio',
    'Hindi DD5.1 + English AC3.5.1',
    'English DDP 5.1',
    'Hindi DDP 5.1',
    'English TrueHD Atmos 7.1',
  ],

  // Video Formats
  VIDEO_FORMATS: [
    'MP4',
    'MKV',
    'AVI',
    'MOV',
    'WEBM',
    'HEVC',
    'H.265',
    'x265',
  ],

  // Default Settings
  DEFAULTS: {
    MOVIES_PER_PAGE: 12,
    MAX_DOWNLOAD_LINKS: 4,
    MAX_MIRROR_LINKS: 3,
  },

  // Validation Rules
  VALIDATION: {
    MIN_YEAR: 1888,
    MAX_YEAR: new Date().getFullYear() + 1,
    MIN_RATING: 0,
    MAX_RATING: 10,
    MIN_TITLE_LENGTH: 1,
    MAX_TITLE_LENGTH: 200,
  },
};

// Helper functions
export const getApiUrl = (endpoint: string) => `${BASE_CONFIG.API_BASE_URL}${endpoint}`;

export const getDownloadProviderUrl = (provider: string, fileId: string) => {
  return `${BASE_CONFIG.DOWNLOAD_PROVIDERS[provider as keyof typeof BASE_CONFIG.DOWNLOAD_PROVIDERS]}${fileId}`;
};

export const validateMovieData = (data: any) => {
  const { VALIDATION } = BASE_CONFIG;
  
  // Check required fields
  if (!data.title || data.title.length < VALIDATION.MIN_TITLE_LENGTH || data.title.length > VALIDATION.MAX_TITLE_LENGTH) {
    return { valid: false, message: 'Invalid title length' };
  }
  
  if (!data.year || data.year < VALIDATION.MIN_YEAR || data.year > VALIDATION.MAX_YEAR) {
    return { valid: false, message: 'Invalid year' };
  }
  
  if (!data.rating || data.rating < VALIDATION.MIN_RATING || data.rating > VALIDATION.MAX_RATING) {
    return { valid: false, message: 'Invalid rating' };
  }

  if (!data.poster || data.poster.trim() === '') {
    return { valid: false, message: 'Poster URL is required' };
  }

  if (!data.backdrop || data.backdrop.trim() === '') {
    return { valid: false, message: 'Backdrop URL is required' };
  }

  if (!data.trailerUrl || data.trailerUrl.trim() === '') {
    return { valid: false, message: 'Trailer URL is required' };
  }

  if (!data.category || data.category.trim() === '') {
    return { valid: false, message: 'Category is required' };
  }

  if (!data.downloadLinks || !Array.isArray(data.downloadLinks) || data.downloadLinks.length === 0) {
    return { valid: false, message: 'At least one download link is required' };
  }

  // Check if at least one download link is complete
  const hasCompleteLink = data.downloadLinks.some((link: any) => 
    link.quality && link.url && link.size && link.audio && link.format
  );

  if (!hasCompleteLink) {
    return { valid: false, message: 'At least one complete download link is required (quality, url, size, audio, format)' };
  }
  
  return { valid: true };
}; 