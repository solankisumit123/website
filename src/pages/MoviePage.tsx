import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getApiUrl, BASE_CONFIG } from '../config/base';
import { Movie, DownloadLink } from '../types';
import { Play, Download, Star, Calendar, Tag, ExternalLink } from 'lucide-react';

const MoviePage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Function to sort qualities by resolution (highest first)
  const getSortedDownloadLinks = (downloadLinks: DownloadLink[]) => {
    const qualityOrder = ['4k', '2k', '1080p', '720p', '480p'];
    return downloadLinks.sort((a, b) => {
      const aIndex = qualityOrder.indexOf(a.quality.toLowerCase());
      const bIndex = qualityOrder.indexOf(b.quality.toLowerCase());
      return aIndex - bIndex; // Lower index = higher quality
    });
  };

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) {
        setError('Movie ID is required');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(getApiUrl(`${BASE_CONFIG.API_ENDPOINTS.MOVIES}/${id}`));
        if (!res.ok) {
          throw new Error('Failed to fetch movie');
        }
        const data = await res.json();
        setMovie(data.movie || data);
      } catch (err) {
        console.error('Error fetching movie:', err);
        setError('Failed to load movie');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // Extract YouTube video ID from trailer URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-4">Loading movie...</div>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-400 mb-4">
            {error || 'Movie not found.'}
          </div>
          <button 
            onClick={() => window.history.back()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const youtubeVideoId = movie.trailerUrl ? getYouTubeVideoId(movie.trailerUrl) : null;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Hero Section with Backdrop */}
      {movie.backdrop && (
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <img
            src={movie.backdrop}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">{movie.title}</h1>
              <div className="flex items-center gap-6 text-lg">
                {movie.year && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>{movie.year}</span>
                  </div>
                )}
                {movie.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span>{movie.rating}/10</span>
                  </div>
                )}
                {movie.category && (
                  <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    <span className="px-3 py-1 bg-blue-600 rounded-full text-sm">{movie.category}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Poster and Info */}
          <div className="lg:col-span-1">
            {movie.poster && (
              <div className="mb-6">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full rounded-lg shadow-2xl border-4 border-slate-700" 
                />
              </div>
            )}

            {/* Movie Info Card */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Movie Information</h3>
              <div className="space-y-3">
                {movie.year && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">Year:</span>
                    <span>{movie.year}</span>
                  </div>
                )}
                {movie.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-gray-300">Rating:</span>
                    <span>{movie.rating}/10</span>
                  </div>
                )}
                {movie.category && (
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">Category:</span>
                    <span className="px-2 py-1 bg-blue-600 rounded text-sm">{movie.category}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Trailer and Downloads */}
          <div className="lg:col-span-2">
            {/* Trailer Section */}
            {youtubeVideoId && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Play className="h-6 w-6 text-red-500" />
                  Official Trailer
                </h2>
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                    title={`${movie.title} Trailer`}
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {/* Download Section with Background */}
            {movie.downloadLinks && movie.downloadLinks.length > 0 ? (
              <div className="relative">
                {/* Background Image for Download Section */}
                {movie.backdrop && (
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <img
                      src={movie.backdrop}
                      alt=""
                      className="w-full h-full object-cover opacity-10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90"></div>
                  </div>
                )}
                
                {/* Download Content */}
                <div className="relative z-10 bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-center justify-center">
                    <Download className="h-8 w-8 text-green-500" />
                    Download Links
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {getSortedDownloadLinks(movie.downloadLinks).map((link, idx) => (
                      <div key={idx} className={`bg-slate-900/80 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 hover:shadow-2xl group ${
                        idx === 0 
                          ? 'border-green-500 hover:border-green-400 hover:shadow-green-500/30 scale-105' 
                          : 'border-slate-600 hover:border-slate-500 hover:shadow-green-500/20'
                      }`}>
                        <div className="text-center mb-4">
                          {idx === 0 && (
                            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">
                              ⭐ BEST QUALITY
                            </div>
                          )}
                          <div className={`font-bold text-2xl mb-3 group-hover:text-green-300 transition-colors ${
                            idx === 0 ? 'text-green-400' : 'text-green-400'
                          }`}>
                            {link.quality.toUpperCase()}
                          </div>
                          {link.audio && (
                            <div className="text-sm text-gray-300 mb-2 bg-slate-800/50 px-3 py-1 rounded-full inline-block">
                              🔊 {link.audio}
                            </div>
                          )}
                          {link.format && (
                            <div className="text-sm text-gray-300 mb-2 bg-slate-800/50 px-3 py-1 rounded-full inline-block">
                              📁 {link.format}
                            </div>
                          )}
                          {link.size && (
                            <div className="text-green-400 font-bold text-xl mb-4 bg-slate-800/70 px-4 py-2 rounded-lg">
                              💾 {link.size}
                            </div>
                          )}
                        </div>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group-hover:scale-105 shadow-lg hover:shadow-green-500/30"
                        >
                          <Download className="h-6 w-6" />
                          <span>Download {link.quality}</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-800 rounded-lg">
                <Download className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-lg text-gray-400 mb-2">No download links available</p>
                <p className="text-sm text-gray-500">Please check back later or contact the administrator.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePage; 