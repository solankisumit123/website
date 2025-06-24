import React from 'react';
import MovieCard from './MovieCard';

interface Movie {
  id: string;
  title: string;
  year: number;
  poster: string;
  rating: number;
  qualities: string[];
  category: string;
}

interface MovieGridProps {
  movies: Movie[];
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
    {movies.map(movie => (
      <div key={movie.id} className="transform hover:scale-105 transition-all duration-300">
        <MovieCard {...movie} />
      </div>
    ))}
  </div>
);

export default MovieGrid; 