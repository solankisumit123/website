import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import SortBy, { SortOption, SortOrder } from '../components/SortBy';
import { sortMovies } from '../utils/sortUtils';
import Pagination from '../components/Pagination';
import { Film, Zap, Search, Star, Download, Play, Calendar, Clock, Users, Eye } from 'lucide-react';
import MovieGrid from '../components/MovieGrid';
import { getApiUrl, BASE_CONFIG } from '../config/base';
import { Movie, DownloadLink } from '../types';

// Interface for MovieGrid component
interface GridMovie {
  id: string;
  title: string;
  year: number;
  poster: string;
  rating: number;
  qualities: string[];
  category: string;
}

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  const MOVIES_PER_PAGE = 8;
  const safeCategory = category || '';

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await fetch(getApiUrl(BASE_CONFIG.API_ENDPOINTS.MOVIES));
        if (!res.ok) {
          throw new Error('Failed to fetch movies');
        }
        const data = await res.json();
        const allMovies = data.movies || data;
        
        // Filter movies based on category
        let filteredMovies: Movie[] = [];
        
        if (safeCategory === '4k-hdr') {
          // Filter movies that have 4K or 2160p quality
          filteredMovies = allMovies.filter((movie: Movie) => 
            movie.downloadLinks?.some(link => 
              link.quality.toLowerCase() === '4k' || 
              link.quality.toLowerCase() === '2160p' ||
              link.quality.toLowerCase().includes('4k') ||
              link.quality.toLowerCase().includes('2160p')
            )
          );
        } else if (safeCategory === '1080p-10bit') {
          // Filter movies that have 1080p quality
          filteredMovies = allMovies.filter((movie: Movie) => 
            movie.downloadLinks?.some(link => 
              link.quality.toLowerCase() === '1080p' || 
              link.quality.toLowerCase().includes('1080p') ||
              link.quality.toLowerCase().includes('1080')
            )
          );
        } else if (safeCategory === 'dual-audio-movies') {
          // Filter movies that have multiple audio tracks
          filteredMovies = allMovies.filter((movie: Movie) => 
            movie.downloadLinks?.some(link => 
              link.audio && (
                link.audio.toLowerCase().includes('dual') ||
                link.audio.toLowerCase().includes('multi') ||
                link.audio.toLowerCase().includes('hindi') ||
                link.audio.toLowerCase().includes('english') ||
                link.audio.toLowerCase().includes('tamil') ||
                link.audio.toLowerCase().includes('telugu')
              )
            )
          );
        } else if (safeCategory === 'english-movies') {
          // Filter movies that are in English
          filteredMovies = allMovies.filter((movie: Movie) => 
            movie.downloadLinks?.some(link => 
              link.audio && (
                link.audio.toLowerCase().includes('english') ||
                link.audio.toLowerCase().includes('eng') ||
                link.audio.toLowerCase().includes('original') ||
                link.audio.toLowerCase().includes('original audio')
              )
            ) || movie.category?.toLowerCase() === 'english-movies'
          );
        } else if (safeCategory === '2160p-hevc') {
          // Filter movies that have 4K/2160p quality (any format)
          filteredMovies = allMovies.filter((movie: Movie) => 
            movie.downloadLinks?.some(link => 
              link.quality && (
                link.quality.toLowerCase() === '4k' ||
                link.quality.toLowerCase() === '2160p' ||
                link.quality.toLowerCase().includes('4k') ||
                link.quality.toLowerCase().includes('2160p') ||
                link.quality.toLowerCase().includes('2160')
              )
            )
          );
        } else if (safeCategory === '2160p-hevc-4k-hdr') {
          // Filter movies that have 2160p HEVC quality
          filteredMovies = allMovies.filter((movie: Movie) => 
            movie.downloadLinks?.some(link => 
              (link.quality && (
                link.quality.toLowerCase() === '2160p' ||
                link.quality.toLowerCase().includes('2160p') ||
                link.quality.toLowerCase().includes('2160')
              )) &&
              (link.format && (
                link.format.toLowerCase().includes('hevc') ||
                link.format.toLowerCase().includes('h.265') ||
                link.format.toLowerCase().includes('h265') ||
                link.format.toLowerCase().includes('x265')
              ))
            )
          );
        } else if (safeCategory) {
          // Filter by regular category
          filteredMovies = allMovies.filter((movie: Movie) => 
            movie.category?.toLowerCase() === safeCategory?.toLowerCase()
          );
        } else {
          filteredMovies = allMovies;
        }
        
        setMovies(filteredMovies);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [safeCategory]);

  const handleSortChange = (newSortBy: SortOption, newSortOrder: SortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1); // Reset to first page on sort change
  };

  const sortedMovies = sortMovies(movies, sortBy, sortOrder);

  // Pagination logic
  const totalPages = Math.ceil(sortedMovies.length / MOVIES_PER_PAGE);
  const paginatedMovies = sortedMovies.slice(
    (currentPage - 1) * MOVIES_PER_PAGE,
    currentPage * MOVIES_PER_PAGE
  );

  // Convert Movie type to GridMovie type
  const gridMovies: GridMovie[] = paginatedMovies.map(movie => ({
    id: movie._id || '',
    title: movie.title,
    year: movie.year,
    poster: movie.poster,
    rating: movie.rating,
    qualities: movie.downloadLinks?.map(link => link.quality) || [],
    category: movie.category
  }));

  const getCategoryTitle = (cat: string) => {
    const categoryMap: { [key: string]: string } = {
      '4k-hdr': '4K HDR Movies',
      '1080p-10bit': '1080p 10Bit Movies',
      '2160p-hevc': '4K Movies',
      '2160p-hevc-4k-hdr': '2160p HEVC 4K HDR Movies',
      'dual-audio-movies': 'Dual Audio Movies',
      'english-movies': 'English Movies',
      'imax': 'IMAX Movies',
      'bollywood': 'Bollywood Movies',
      'hollywood': 'Hollywood Movies',
      'south-indian': 'South Indian Movies',
      'hindi-dubbed': 'Hindi Dubbed Movies',
      'web-series': 'Web Series',
      'anime': 'Anime',
      'documentaries': 'Documentaries'
    };
    
    return categoryMap[cat || ''] || cat?.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') || 'Movies';
  };

  const getCategoryDescription = (cat: string) => {
    const descriptionMap: { [key: string]: string } = {
      '4k-hdr': 'Experience the ultimate visual quality with our collection of 4K HDR movies. Crystal clear resolution with enhanced color and contrast for the best viewing experience.',
      '1080p-10bit': 'High-quality 1080p movies with 10-bit color depth for superior picture quality and smooth color gradients.',
      '2160p-hevc': 'Ultra-high definition 4K movies in various formats. Experience crystal clear resolution and stunning visual quality.',
      '2160p-hevc-4k-hdr': 'Ultra-high definition 4K movies with HEVC compression and HDR for the ultimate viewing experience.',
      'dual-audio-movies': 'Movies available in multiple audio languages for your convenience.',
      'english-movies': 'Latest and classic English movies in high quality.',
      'imax': 'IMAX enhanced movies for an immersive cinematic experience.',
      'bollywood': 'Latest Bollywood movies and classics from the Indian film industry.',
      'hollywood': 'Blockbuster Hollywood movies and timeless classics.',
      'south-indian': 'Movies from South Indian cinema including Tamil, Telugu, Malayalam, and Kannada films.',
      'hindi-dubbed': 'International movies dubbed in Hindi for Indian audiences.',
      'web-series': 'Binge-worthy web series and TV shows.',
      'anime': 'Japanese animation and anime series.',
      'documentaries': 'Educational and entertaining documentaries from around the world.'
    };
    
    return descriptionMap[cat || ''] || `Explore our collection of ${getCategoryTitle(cat)}.`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-400">Loading movies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          {safeCategory === '4k-hdr' ? (
            <div className="bg-gradient-to-r from-green-400 to-blue-500 p-2 rounded-lg">
              <Zap className="h-8 w-8 text-white" />
            </div>
          ) : safeCategory === '1080p-10bit' ? (
            <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-2 rounded-lg">
              <Film className="h-8 w-8 text-white" />
            </div>
          ) : safeCategory === 'dual-audio-movies' ? (
            <div className="bg-gradient-to-r from-orange-400 to-red-500 p-2 rounded-lg">
              <Film className="h-8 w-8 text-white" />
            </div>
          ) : safeCategory === 'english-movies' ? (
            <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-2 rounded-lg">
              <Film className="h-8 w-8 text-white" />
            </div>
          ) : safeCategory === '2160p-hevc' ? (
            <div className="bg-gradient-to-r from-cyan-400 to-teal-500 p-2 rounded-lg">
              <Zap className="h-8 w-8 text-white" />
            </div>
          ) : safeCategory === '2160p-hevc-4k-hdr' ? (
            <div className="bg-gradient-to-r from-cyan-400 to-teal-500 p-2 rounded-lg">
              <Zap className="h-8 w-8 text-white" />
            </div>
          ) : (
            <Film className="h-8 w-8 text-blue-400" />
          )}
          <h1 className={`text-3xl md:text-4xl font-bold ${
            safeCategory === '4k-hdr' 
              ? 'bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent'
              : safeCategory === '1080p-10bit'
              ? 'bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent'
              : safeCategory === 'dual-audio-movies'
              ? 'bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent'
              : safeCategory === 'english-movies'
              ? 'bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent'
              : safeCategory === '2160p-hevc'
              ? 'bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent'
              : safeCategory === '2160p-hevc-4k-hdr'
              ? 'bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent'
              : 'text-white'
          }`}>
            {getCategoryTitle(safeCategory)}
          </h1>
        </div>
        <p className="text-gray-400 text-lg max-w-4xl">
          {getCategoryDescription(safeCategory)}
        </p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
              {sortedMovies.length} {sortedMovies.length === 1 ? 'Movie' : 'Movies'}
            </span>
            {safeCategory === '4k-hdr' && (
              <span className="px-3 py-1 bg-gradient-to-r from-green-400 to-blue-500 text-white text-sm rounded-full">
                4K HDR
              </span>
            )}
            {safeCategory === '1080p-10bit' && (
              <span className="px-3 py-1 bg-gradient-to-r from-purple-400 to-pink-500 text-white text-sm rounded-full">
                1080p 10Bit
              </span>
            )}
            {safeCategory === '2160p-hevc' && (
              <span className="px-3 py-1 bg-gradient-to-r from-cyan-400 to-teal-500 text-white text-sm rounded-full">
                4K
              </span>
            )}
            {safeCategory === 'dual-audio-movies' && (
              <span className="px-3 py-1 bg-gradient-to-r from-orange-400 to-red-500 text-white text-sm rounded-full">
                Dual Audio
              </span>
            )}
            {safeCategory === 'english-movies' && (
              <span className="px-3 py-1 bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-sm rounded-full">
                English
              </span>
            )}
          </div>
          <SortBy
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />
        </div>
      </div>

      {/* Movies Grid */}
      {sortedMovies.length > 0 ? (
        <>
          <MovieGrid movies={gridMovies} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <div className="text-center text-gray-400 py-12">
          <p className="text-lg">No movies found in this category.</p>
          <p className="text-sm mt-2">Try adding some movies through the admin panel.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;