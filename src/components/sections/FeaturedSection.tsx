import React from 'react';
import { Star } from 'lucide-react';
import MovieCard from '../MovieCard';

interface Movie {
  id: string;
  title: string;
  year: number;
  poster: string;
  rating: number;
  qualities: string[];
  category: string;
}

interface FeaturedSectionProps {
  movies: Movie[];
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({ movies }) => {
  return (
    <section className="mb-12">
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 mb-8 min-h-[300px]">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Welcome to UHD Flix
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-6 max-w-2xl">
            Your ultimate destination for high-quality movie downloads. Discover the latest releases in stunning 4K UHD quality.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-white font-semibold">4K UHD Quality</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-white font-semibold">Latest Releases</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-white font-semibold">Multiple Formats</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Movies Carousel */}
      <div className="relative">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Star className="h-6 w-6 text-yellow-500" />
          <span>Featured Movies</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {movies.map((movie) => (
            <div key={movie.id} className="transform hover:scale-105 transition-all duration-300">
              <MovieCard {...movie} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection; 