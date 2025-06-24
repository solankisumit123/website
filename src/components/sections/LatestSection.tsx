import React from 'react';
import { Clock } from 'lucide-react';
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

interface LatestSectionProps {
  movies: Movie[];
}

const LatestSection: React.FC<LatestSectionProps> = ({ movies }) => {
  return (
    <section className="mb-12">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center space-x-2">
        <Clock className="h-6 w-6 text-green-500" />
        <span>Latest Releases</span>
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

export default LatestSection; 