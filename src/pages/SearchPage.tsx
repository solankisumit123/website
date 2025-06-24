import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import SortBy, { SortOption, SortOrder } from '../components/SortBy';
import { sortMovies } from '../utils/sortUtils';
import Pagination from '../components/Pagination';
import { Search } from 'lucide-react';
import { Movie } from '../types';
import { getApiUrl, BASE_CONFIG } from '../config/base';
import Fuse from 'fuse.js';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  const MOVIES_PER_PAGE = 8;

  useEffect(() => {
    const fetchAndSearchMovies = async () => {
      if (!query) {
        setMovies([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const res = await fetch(getApiUrl(BASE_CONFIG.API_ENDPOINTS.MOVIES));
        const data = await res.json();
        const allMovies = data.movies || data;
        
        const fuse = new Fuse(allMovies, {
          keys: ['title', 'category'],
          includeScore: true,
          threshold: 0.4, // Adjust this for more or less strictness
        });

        const fuseResults = fuse.search(query);
        const searchResults = fuseResults.map(result => result.item) as Movie[];
        
        setMovies(searchResults);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Please try again later.');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSearchMovies();
  }, [query]);

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

  const getSortedQualities = (downloadLinks: any[]) => {
    const qualityOrder = ['4k', '2k', '1080p', '720p', '480p'];
    return downloadLinks
      ?.map(link => link.quality)
      .sort((a, b) => {
        const aIndex = qualityOrder.indexOf(a?.toLowerCase());
        const bIndex = qualityOrder.indexOf(b?.toLowerCase());
        return aIndex - bIndex;
      }) || [];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Search className="h-8 w-8 text-blue-400" />
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Search Results
          </h1>
        </div>
        {query && (
          <p className="text-gray-400 text-lg">
            Showing results for: <span className="text-white font-semibold">"{query}"</span>
          </p>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-400 text-lg">Searching for movies...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16 text-red-400">{error}</div>
      ) : sortedMovies.length > 0 ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-400">
              Found {sortedMovies.length} result{sortedMovies.length !== 1 ? 's' : ''}
            </p>
            <SortBy
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {paginatedMovies.map((movie) => (
              <div key={movie._id} className="transform hover:scale-105 transition-all duration-300">
                <MovieCard
                  id={movie._id || ''}
                  title={movie.title}
                  year={movie.year}
                  poster={movie.poster}
                  rating={movie.rating}
                  qualities={getSortedQualities(movie.downloadLinks)}
                  category={movie.category}
                />
              </div>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : query ? (
        <div className="text-center py-16">
          <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No results found</h2>
          <p className="text-gray-400 mb-6">
            We couldn't find any movies matching "{query}". Try searching with different keywords.
          </p>
          <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-white mb-3">Search Tips:</h3>
            <ul className="text-gray-300 text-sm space-y-1 text-left">
              <li>• Check your spelling</li>
              <li>• Try different keywords</li>
              <li>• Use the movie's original title</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Start searching</h2>
          <p className="text-gray-400">
            Enter a movie title to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;