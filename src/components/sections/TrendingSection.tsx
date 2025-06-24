import React from 'react';
import { TrendingUp } from 'lucide-react';
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

interface TrendingSectionProps {
  movies: Movie[];
}

const TrendingSection: React.FC<TrendingSectionProps> = ({ movies }) => {
  return (
    <section className="mb-12">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center space-x-2">
        <TrendingUp className="h-6 w-6 text-red-500" />
        <span>Trending This Week</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {movies.map((movie) => (
          <div key={movie.id} className="transform hover:scale-105 transition-all duration-300">
            <MovieCard {...movie} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingSection; 