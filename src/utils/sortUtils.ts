import { Movie } from '../types';
import { SortOption, SortOrder } from '../components/SortBy';

export const sortMovies = (movies: Movie[], sortBy: SortOption, sortOrder: SortOrder): Movie[] => {
  const sortedMovies = [...movies];

  switch (sortBy) {
    case 'latest':
      return sortedMovies.sort((a, b) => {
        // Sort by _id (assuming newer movies have higher _id values)
        const aId = a._id || '';
        const bId = b._id || '';
        return sortOrder === 'desc' ? bId.localeCompare(aId) : aId.localeCompare(bId);
      });

    case 'rating':
      return sortedMovies.sort((a, b) => {
        const aRating = parseFloat(a.rating?.toString() || '0');
        const bRating = parseFloat(b.rating?.toString() || '0');
        return sortOrder === 'desc' ? bRating - aRating : aRating - bRating;
      });

    case 'title':
      return sortedMovies.sort((a, b) => {
        const aTitle = (a.title || '').toLowerCase();
        const bTitle = (b.title || '').toLowerCase();
        return sortOrder === 'asc' ? aTitle.localeCompare(bTitle) : bTitle.localeCompare(aTitle);
      });

    case 'year':
      return sortedMovies.sort((a, b) => {
        const aYear = parseInt(a.year?.toString() || '0');
        const bYear = parseInt(b.year?.toString() || '0');
        return sortOrder === 'desc' ? bYear - aYear : aYear - bYear;
      });

    case 'quality':
      return sortedMovies.sort((a, b) => {
        const aQuality = getHighestQuality(a.downloadLinks || []);
        const bQuality = getHighestQuality(b.downloadLinks || []);
        return sortOrder === 'desc' ? bQuality - aQuality : aQuality - bQuality;
      });

    default:
      return sortedMovies;
  }
};

// Helper function to get the highest quality score
const getHighestQuality = (downloadLinks: any[]): number => {
  if (!downloadLinks || downloadLinks.length === 0) return 0;

  const qualityScores: { [key: string]: number } = {
    '4k': 8,
    '2160p': 8,
    '2k': 7,
    '1080p': 6,
    '720p': 4,
    '480p': 2,
    '360p': 1
  };

  let highestScore = 0;
  downloadLinks.forEach(link => {
    const quality = link.quality?.toLowerCase() || '';
    for (const [key, score] of Object.entries(qualityScores)) {
      if (quality.includes(key)) {
        highestScore = Math.max(highestScore, score);
        break;
      }
    }
  });

  return highestScore;
};

// Helper function to get quality label for display
export const getQualityLabel = (score: number): string => {
  if (score >= 8) return '4K';
  if (score >= 7) return '2K';
  if (score >= 6) return '1080p';
  if (score >= 4) return '720p';
  if (score >= 2) return '480p';
  return 'Unknown';
}; 