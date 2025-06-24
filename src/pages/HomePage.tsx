import React, { useState, useEffect } from 'react';
import { BASE_CONFIG, getApiUrl } from '../config/base';
import MovieCard from '../components/MovieCard';
import SortBy, { SortOption, SortOrder } from '../components/SortBy';
import { sortMovies } from '../utils/sortUtils';
import Pagination from '../components/Pagination';
import { Download, Award, TrendingUp, Zap, Play, Star, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Movie, DownloadLink } from '../types';

const MovieDownloadSection = ({ movie }: { movie: any }) => {
  if (!movie.downloadLinks || movie.downloadLinks.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800 p-6 rounded-lg my-8">
      <h3 className="text-2xl font-bold text-white mb-4">Download Links for {movie.title}</h3>
      <div className="space-y-4">
        {movie.downloadLinks.map((link: any, index: number) => (
          <div key={index} className="bg-slate-700 p-4 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-bold text-white">{link.quality} <span className="text-gray-400 font-normal">{link.format} - {link.audio}</span></p>
              <p className="text-sm text-red-400 font-bold">[{link.size}]</p>
            </div>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

const HeroSection = ({ featuredMovies }: { featuredMovies: any[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredMovies.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredMovies.length]);

  if (featuredMovies.length === 0) return null;

  const currentMovie = featuredMovies[currentIndex];

  return (
    <div className="relative h-[420px] md:h-[520px] lg:h-[600px] overflow-hidden rounded-2xl mb-12 flex items-center justify-center bg-slate-900">
      {/* Backdrop Image */}
      {currentMovie.backdrop && (
        <img
          src={currentMovie.backdrop}
          alt={currentMovie.title}
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 blur-sm transition-all duration-1000"
        />
      )}
      {/* Glassmorphic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-transparent backdrop-blur-xl z-10" />
      {/* Animated Logo & Title */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full">
        <div className="flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:scale-105">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Movie Hub</h1>
          <p className="text-lg text-gray-300 mt-2 font-medium tracking-wide">Your Movie Download Hub</p>
        </div>
        {/* Movie Info */}
        <div className="mt-8 bg-slate-800/80 rounded-xl p-6 shadow-lg max-w-2xl w-full flex flex-col items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center drop-shadow-lg">{currentMovie.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mb-4 text-lg justify-center">
            {currentMovie.year && (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{currentMovie.year}</span>
              </div>
            )}
            {currentMovie.rating && (
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span>{currentMovie.rating}/10</span>
              </div>
            )}
            {currentMovie.category && (
              <span className="px-3 py-1 bg-orange-600 rounded-full text-sm font-bold text-white shadow-md">
                {currentMovie.category}
              </span>
            )}
          </div>
          <div className="flex gap-4 justify-center">
            <Link
              to={`/movie/${currentMovie._id}`}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2 shadow-md hover:shadow-orange-500/40"
            >
              <Play className="h-5 w-5" />
              Watch Now
            </Link>
            <button className="bg-slate-700/80 hover:bg-slate-600/80 text-white font-bold py-3 px-8 rounded-lg transition-colors border border-white/20 shadow-md">
              Download
            </button>
          </div>
        </div>
      </div>
      {/* Carousel Indicators */}
      {featuredMovies.length > 1 && (
        <div className="absolute bottom-4 right-8 flex gap-2 z-30">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors border-2 border-white ${
                index === currentIndex ? 'bg-orange-500' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FeaturedMoviesSection = ({ movies }: { movies: any[] }) => {
  const featuredMovies = movies.filter(movie => movie.category === 'featured').slice(0, 4);
  
  if (featuredMovies.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <Award className="h-8 w-8 text-yellow-500" />
        Featured Movies
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredMovies.map(movie => {
          const is4K = movie.qualities && movie.qualities.some((q: any) => typeof q === 'string' ? q.toLowerCase().includes('4k') : q.label.toLowerCase().includes('4k'));
          return (
            <div key={movie._id} className="group relative overflow-hidden rounded-2xl bg-slate-800/80 backdrop-blur-md shadow-xl transition-all duration-300 hover:shadow-orange-500/30 hover:-translate-y-2 hover:scale-105 border border-slate-700 flex flex-col justify-end">
              {/* 4K Logo Badge */}
              {is4K && (
                <div className="absolute top-3 left-3 z-20 flex flex-col items-center">
                  <div className="h-8 w-8 mb-1">
                    <img src="/image/ChatGPT Image Jun 23, 2025, 02_51_32 PM.png" alt="4K Logo" className="h-full w-full object-contain rounded-full border-2 border-white shadow-md" />
                  </div>
                  <span className="flex items-baseline space-x-1">
                    <span className="text-base font-extrabold text-orange-500 leading-none">4K</span>
                    <span className="text-base font-extrabold text-white leading-none">MOVIE</span>
                  </span>
                </div>
              )}
              {/* Backdrop as background */}
              {movie.backdrop && (
                <div className="absolute inset-0">
                  <img
                    src={movie.backdrop}
                    alt=""
                    className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300 rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-800/50 to-transparent rounded-2xl"></div>
                </div>
              )}
              {/* Content */}
              <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-orange-500 transition-colors duration-200 line-clamp-2">
                  {movie.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
                  {movie.year && <span>{movie.year}</span>}
                  {movie.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{movie.rating}</span>
                    </div>
                  )}
                </div>
                <Link
                  to={`/movie/${movie._id}`}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-center shadow-md hover:shadow-orange-500/40"
                >
                  Watch Now
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notify, setNotify] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  const MOVIES_PER_PAGE = 8;

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await fetch(getApiUrl(BASE_CONFIG.API_ENDPOINTS.MOVIES));
        const data = await res.json();
        setMovies(data.movies || data);
        if (window.sessionStorage.getItem('movieAdded')) {
          setNotify('Movie added successfully!');
          window.sessionStorage.removeItem('movieAdded');
          setTimeout(() => setNotify(''), 3000);
        }
      } catch {
        setMovies([]);
      }
      setLoading(false);
    };
    fetchMovies();
  }, []);

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

  const selectedMovie = sortedMovies.find(movie => movie._id === selectedMovieId);
  const featuredMovies = sortedMovies.filter(movie => movie.category === 'featured').slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {notify && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <Award className="h-5 w-5" />
          {notify}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with Backdrop Images */}
        <HeroSection featuredMovies={featuredMovies} />
        
        {/* Featured Movies Section */}
        <FeaturedMoviesSection movies={sortedMovies} />

        {/* Latest Movies Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              Latest Movies
            </h2>
            <div className="flex items-center gap-4">
              <p className="text-gray-400">{sortedMovies.length} movies</p>
              <SortBy
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-400 text-lg">Loading movies...</p>
            </div>
          ) : sortedMovies.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {paginatedMovies.map(movie => (
                  <div key={movie._id} onClick={() => {
                    setSelectedMovieId(movie._id || null);
                    setNotify(`Added ${movie.title} to download queue!`);
                  }}>
                    <MovieCard
                      id={movie._id || ''}
                      title={movie.title}
                      year={movie.year}
                      poster={movie.poster}
                      rating={movie.rating}
                      qualities={movie.downloadLinks?.map(link => link.quality) || []}
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
              {selectedMovie && (
                <MovieDownloadSection key={`${selectedMovie._id}-download`} movie={selectedMovie} />
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-slate-800 rounded-2xl p-12">
                <Zap className="h-16 w-16 text-gray-500 mx-auto mb-6" />
                <p className="text-xl text-gray-400 mb-3">No movies found.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;