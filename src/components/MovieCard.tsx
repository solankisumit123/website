import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Star, Download, Image as ImageIcon, Tag } from 'lucide-react';

interface QualityObj {
  label: string;
  size?: string;
}

interface MovieCardProps {
  id: string;
  title: string;
  year: number;
  poster: string;
  rating: number;
  qualities: (string | QualityObj)[];
  category: string;
}

const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  year,
  poster,
  rating,
  qualities,
  category,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const getBestQuality = () => {
    if (!qualities || qualities.length === 0) return null;

    const qualityStrings = qualities.map(q => (typeof q === 'string' ? q.toLowerCase() : q.label.toLowerCase()));

    const qualityPriority = ['4k', '2160p', '1080p', '720p', '480p'];
    
    for (const priority of qualityPriority) {
      if (qualityStrings.includes(priority)) {
        if (priority === '2160p') return '4K';
        return priority.toUpperCase();
      }
    }

    // Fallback to the first available quality if none from priority list match
    const firstQuality = qualities[0];
    return typeof firstQuality === 'string' ? firstQuality.toUpperCase() : firstQuality.label.toUpperCase();
  };

  const getCategoryColor = (cat: string): string => {
    const category = cat.toLowerCase();
    if (category.includes('action')) return 'bg-red-500';
    if (category.includes('comedy')) return 'bg-yellow-500';
    if (category.includes('drama')) return 'bg-purple-500';
    if (category.includes('horror')) return 'bg-gray-700';
    if (category.includes('sci-fi')) return 'bg-blue-500';
    if (category.includes('thriller')) return 'bg-orange-500';
    if (category.includes('romance')) return 'bg-pink-500';
    if (category.includes('documentary')) return 'bg-green-500';
    if (category.includes('animation')) return 'bg-indigo-500';
    return 'bg-slate-600'; // default color
  };

  const bestQuality = getBestQuality();

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  return (
    <Link to={`/movie/${id}`} className="group block relative overflow-hidden rounded-2xl bg-slate-800/80 backdrop-blur-md shadow-xl transition-all duration-300 hover:shadow-blue-500/30 hover:-translate-y-2">
      <div className="relative w-full aspect-[2/3] flex items-center justify-center bg-slate-900">
        {/* Loading State */}
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Fallback for Error */}
        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 p-4">
            <ImageIcon className="w-16 h-16 text-slate-700 mb-4" />
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-300 mb-2">{title}</h3>
              <p className="text-sm text-slate-500">Poster not available</p>
            </div>
          </div>
        ) : (
          <img
            src={poster}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}

        {/* Overlay Gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-60"></div>

        {/* Category Badge */}
        <div className="absolute top-2 left-2 z-10">
          <div className={`flex items-center gap-1 ${getCategoryColor(category)} text-white text-xs font-bold px-2 py-1 rounded shadow-lg backdrop-blur-sm`}>
            <Tag className="h-3 w-3" />
            <span>{category}</span>
          </div>
        </div>

        {/* Quality and Rating */}
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          {bestQuality && (
            <span className="bg-blue-600 text-white text-sm font-bold px-2 py-1 rounded shadow-lg backdrop-blur-sm">
              {bestQuality}
            </span>
          )}
          {rating && (
            <div className="flex items-center bg-yellow-500 text-black text-sm font-bold px-2 py-1 rounded shadow-lg backdrop-blur-sm">
              <Star className="h-3 w-3 mr-1" />
              {rating}
            </div>
          )}
        </div>

        {/* Logo Overlay in bottom-right */}
        <div className="absolute bottom-2 right-2 z-10">
          <img src="/image/ChatGPT Image Jun 23, 2025, 02_51_32 PM.png" alt="Logo" className="h-8 w-8 rounded-full shadow-lg border-2 border-white bg-white/80 object-contain" />
        </div>

        <div className="absolute bottom-2 left-2 z-10">
          <div className="bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm shadow-lg">
            <Calendar className="h-3 w-3" />
            <span>{year}</span>
          </div>
        </div>
      </div>

      {/* Movie Info Section with improved contrast */}
      <div className="p-5 bg-gradient-to-b from-slate-800 to-slate-900">
        <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 leading-tight min-h-[3.5rem] group-hover:text-blue-400 transition-colors duration-200">
          {title}
        </h3>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1 text-slate-300">
            <Calendar className="h-4 w-4" />
            <span>{year}</span>
          </div>
          <div className="flex items-center space-x-1 text-slate-300">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>{rating}</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              Available in {qualities?.length || 0} quality{qualities?.length !== 1 ? 'ies' : 'y'}
            </span>
            <div className="flex items-center space-x-1 text-emerald-400">
              <Download className="h-3 w-3" />
              <span className="text-xs font-bold">READY</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;