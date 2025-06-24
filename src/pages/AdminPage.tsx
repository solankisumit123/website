import React, { useState, useEffect, useCallback, ChangeEvent, FormEvent } from 'react';
import { getApiUrl, BASE_CONFIG, validateMovieData } from '../config/base';
import AddQualityForm from '../components/AddQualityForm';
import Pagination from '../components/Pagination';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeaderBar from '../components/admin/AdminHeaderBar';
import Dashboard from '../components/admin/Dashboard';
import Analytics from '../components/admin/Analytics';
import { Movie, DownloadLink } from '../types';
import { Film, Star, LayoutGrid, ChevronDown, ChevronUp, Edit, Trash2, Save, X, Plus, Search, RefreshCw } from 'lucide-react';
import Categories from '../components/admin/Categories';
import Users from '../components/admin/Users';
import AdminUsers from '../components/admin/AdminUsers';
import Downloads from '../components/admin/Downloads';
import Featured from '../components/admin/Featured';
import Trending from '../components/admin/Trending';
import Reports from '../components/admin/Reports';
import Database from '../components/admin/Database';
import Security from '../components/admin/Security';
import Settings from '../components/admin/Settings';
import SystemStatus from '../components/admin/SystemStatus';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import RBAC from '../components/admin/RBAC';
import Permissions from '../components/admin/Permissions';
import ActivityLog from '../components/admin/ActivityLog';
import PasswordReset from '../components/admin/PasswordReset';
import EmailVerification from '../components/admin/EmailVerification';
import SessionManagement from '../components/admin/SessionManagement';
import SecurityReports from '../components/admin/SecurityReports';

const initialLinks: DownloadLink[] = [
  { quality: '480p', url: '', size: '', audio: '', format: '', mirrors: [] },
  { quality: '720p', url: '', size: '', audio: '', format: '', mirrors: [] },
  { quality: '1080p', url: '', size: '', audio: '', format: '', mirrors: [] },
  { quality: '4k', url: '', size: '', audio: '', format: '', mirrors: [] },
];

// Helper function for year suggestion
const suggestYear = (title: string): string => {
  const yearMatch = title.match(/\((\d{4})\)/);
  if (yearMatch) {
    return yearMatch[1];
  }
  return new Date().getFullYear().toString();
};

// Helper function to auto-detect category from download links
const autoDetectCategory = (downloadLinks: DownloadLink[]): string => {
  const has4K = downloadLinks.some(link => 
    link.quality && (
      link.quality.toLowerCase() === '4k' || 
      link.quality.toLowerCase() === '2160p' ||
      link.quality.toLowerCase().includes('4k') ||
      link.quality.toLowerCase().includes('2160p')
    )
  );

  const has1080p = downloadLinks.some(link => 
    link.quality && (
      link.quality.toLowerCase() === '1080p' || 
      link.quality.toLowerCase().includes('1080p') ||
      link.quality.toLowerCase().includes('1080')
    )
  );

  const hasHEVC = downloadLinks.some(link => 
    link.format && (
      link.format.toLowerCase().includes('hevc') ||
      link.format.toLowerCase().includes('h.265') ||
      link.format.toLowerCase().includes('h265') ||
      link.format.toLowerCase().includes('x265')
    )
  );

  const hasDualAudio = downloadLinks.some(link => 
    link.audio && (
      link.audio.toLowerCase().includes('dual') ||
      link.audio.toLowerCase().includes('multi') ||
      link.audio.toLowerCase().includes('hindi') ||
      link.audio.toLowerCase().includes('english') ||
      link.audio.toLowerCase().includes('tamil') ||
      link.audio.toLowerCase().includes('telugu')
    )
  );

  const hasEnglishAudio = downloadLinks.some(link => 
    link.audio && (
      link.audio.toLowerCase().includes('english') ||
      link.audio.toLowerCase().includes('eng') ||
      link.audio.toLowerCase().includes('original') ||
      link.audio.toLowerCase().includes('original audio')
    )
  );

  // Priority order: 4K HDR > 2160p HEVC > 1080p 10Bit > Dual Audio > English Movies
  if (has4K) {
    return '4k-hdr';
  } else if (hasHEVC) {
    return '2160p-hevc';
  } else if (has1080p) {
    return '1080p-10bit';
  } else if (hasDualAudio) {
    return 'dual-audio-movies';
  } else if (hasEnglishAudio) {
    return 'english-movies';
  }

  return '';
};

const AdminPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [editingInTable, setEditingInTable] = useState<string | null>(null);
  const [tableEditData, setTableEditData] = useState<Partial<Movie>>({});
  
  // Admin section state
  const [activeSection, setActiveSection] = useState('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  const [isStatsVisible, setIsStatsVisible] = useState(true);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [isDownloadLinksVisible, setIsDownloadLinksVisible] = useState(false);
  const [isWebSeriesVisible, setIsWebSeriesVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const MOVIES_PER_PAGE = 10;

  const [newMovie, setNewMovie] = useState<Movie>({
    title: '',
    year: new Date().getFullYear(),
    poster: '',
    backdrop: '',
    rating: 0,
    trailerUrl: '',
    downloadLinks: [
      { quality: '480p', url: '', size: '', audio: '', format: '', mirrors: [] },
      { quality: '720p', url: '', size: '', audio: '', format: '', mirrors: [] },
      { quality: '1080p', url: '', size: '', audio: '', format: '', mirrors: [] },
      { quality: '4k', url: '', size: '', audio: '', format: '', mirrors: [] },
    ],
    category: '',
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching movies from:', getApiUrl(BASE_CONFIG.API_ENDPOINTS.MOVIES));
      
      const res = await fetch(getApiUrl(BASE_CONFIG.API_ENDPOINTS.MOVIES));
      console.log('Fetch response status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to fetch movies' }));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Fetched movies data:', data);
      
      const sortedMovies = (data.movies || data).sort((a: any, b: any) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      setMovies(sortedMovies);
      setError(''); // Clear any previous errors
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error fetching movies:', err);
      setError(`Failed to fetch movies: ${errorMessage}`);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchMovies(); 
  }, [fetchMovies]);

  // Auto-refresh movies every 30 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeSection === 'movies' || activeSection === 'dashboard') {
        console.log('Auto-refreshing movies...');
        fetchMovies();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchMovies, activeSection]);

  // Search and filter logic
  const filteredMovies = movies.filter(movie => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      movie.title?.toLowerCase().includes(query) ||
      movie.category?.toLowerCase().includes(query) ||
      movie.year?.toString().includes(query) ||
      movie.rating?.toString().includes(query) ||
      movie.downloadLinks?.some(link => 
        link.quality?.toLowerCase().includes(query) ||
        link.audio?.toLowerCase().includes(query) ||
        link.format?.toLowerCase().includes(query)
      )
    );
  });

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const resetForm = useCallback(() => {
    setNewMovie({
      title: '',
      year: new Date().getFullYear(),
      poster: '',
      backdrop: '',
      rating: 0,
      trailerUrl: '',
      downloadLinks: [
        { quality: '480p', url: '', size: '', audio: '', format: '', mirrors: [] },
        { quality: '720p', url: '', size: '', audio: '', format: '', mirrors: [] },
        { quality: '1080p', url: '', size: '', audio: '', format: '', mirrors: [] },
        { quality: '4k', url: '', size: '', audio: '', format: '', mirrors: [] },
      ],
      category: '',
    });
    setEditingMovie(null);
    setIsAddFormVisible(false);
    setCurrentPage(1); // Reset to first page when resetting form
    setError('');
    setSuccessMessage('');
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const parsedValue = name === 'year' || name === 'rating' ? parseFloat(value) || 0 : value;
    setNewMovie(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleDownloadLinkChange = (idx: number, field: keyof DownloadLink, value: string) => {
    setNewMovie(prev => ({
      ...prev,
      downloadLinks: prev.downloadLinks.map((link, i) => 
        i === idx ? { ...link, [field]: value } : link
      )
    }));
  };

  const handleMirrorLinkChange = (linkIdx: number, mirrorIdx: number, value: string) => {
    setNewMovie(prev => ({
      ...prev,
      downloadLinks: prev.downloadLinks.map((link, i) => 
        i === linkIdx ? {
          ...link,
          mirrors: (link.mirrors || []).map((mirror, j) => 
            j === mirrorIdx ? value : mirror
          )
        } : link
      )
    }));
  };

  const addMirrorLink = (linkIdx: number) => {
    setNewMovie(prev => ({
      ...prev,
      downloadLinks: prev.downloadLinks.map((link, i) => 
        i === linkIdx ? {
          ...link,
          mirrors: [...(link.mirrors || []), '']
        } : link
      )
    }));
  };

  const removeMirrorLink = (linkIdx: number, mirrorIdx: number) => {
    setNewMovie(prev => ({
      ...prev,
      downloadLinks: prev.downloadLinks.map((link, i) => 
        i === linkIdx ? {
          ...link,
          mirrors: (link.mirrors || []).filter((_, j) => j !== mirrorIdx)
        } : link
      )
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      // Duplicate check (by title, case-insensitive, trimmed)
      if (!editingMovie) {
        const newTitle = newMovie.title.trim().toLowerCase();
        const duplicate = movies.some(m => m.title.trim().toLowerCase() === newTitle);
        if (duplicate) {
          setError('This movie already exists. Please check before adding.');
          setLoading(false);
          return;
        }
      }

      // Filter out empty download links
      const filteredDownloadLinks = newMovie.downloadLinks.filter(link => 
        link.quality && link.url && link.size && link.audio && link.format
      );

      const movieDataToSubmit = {
        ...newMovie,
        downloadLinks: filteredDownloadLinks
      };

      console.log('Submitting movie data:', movieDataToSubmit);

      const validation = validateMovieData(movieDataToSubmit);
      console.log('Validation result:', validation);
      
      if (!validation.valid) {
        setError(validation.message || 'Validation error');
        setLoading(false);
        return;
      }

      const url = editingMovie
        ? getApiUrl(`${BASE_CONFIG.API_ENDPOINTS.MOVIES}/${editingMovie._id}`)
        : getApiUrl(BASE_CONFIG.API_ENDPOINTS.MOVIES);
      
      const method = editingMovie ? 'PUT' : 'POST';

      console.log(`Making ${method} request to:`, url);

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movieDataToSubmit)
      });
      
      const data = await res.json();
      console.log('Response:', res.status, data);

      if (!res.ok) {
        throw new Error(data.message || `HTTP error! status: ${res.status}`);
      }

      setSuccessMessage(editingMovie ? 'Movie updated successfully!' : 'Movie added successfully!');
      resetForm();
      setEditingMovie(null);
      setIsAddFormVisible(false);
      setCurrentPage(1);
      
      // Refresh movies list immediately
      await fetchMovies();
      
      // Redirect to home page after adding a movie
      if (!editingMovie) {
        window.sessionStorage.setItem('movieAdded', 'true');
        window.location.href = '/';
      }

    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error submitting movie:', err);
      setError(`Failed to ${editingMovie ? 'update' : 'add'} movie: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditClick = (movie: Movie) => {
    setEditingMovie(movie);
    setNewMovie(movie);
    setIsAddFormVisible(true);
    setActiveSection('add-movie');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Table inline editing functions
  const startTableEdit = (movie: Movie) => {
    setEditingInTable(movie._id || '');
    setTableEditData({
      title: movie.title,
      year: movie.year,
      category: movie.category,
      rating: movie.rating,
      poster: movie.poster,
      backdrop: movie.backdrop,
      trailerUrl: movie.trailerUrl
    });
  };

  const cancelTableEdit = () => {
    setEditingInTable(null);
    setTableEditData({});
  };

  const handleTableEditChange = (field: keyof Movie, value: string | number) => {
    setTableEditData(prev => ({ ...prev, [field]: value }));
  };

  const saveTableEdit = async (movieId: string) => {
    if (!movieId) {
      setError('Movie ID is missing');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      console.log('Saving table edit for movie:', movieId, 'with data:', tableEditData);
      
      const url = getApiUrl(`${BASE_CONFIG.API_ENDPOINTS.MOVIES}/${movieId}`);
      console.log('Making PUT request to:', url);
      
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tableEditData),
      });

      const responseData = await res.json();
      console.log('Response:', res.status, responseData);

      if (!res.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${res.status}`);
      }

      setSuccessMessage('Movie updated successfully!');
      setEditingInTable(null);
      setTableEditData({});
      setCurrentPage(1);
      
      // Refresh movies list immediately
      await fetchMovies();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error saving table edit:', err);
      setError(`Failed to update movie: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteMovie = async (movieId: string) => {
    if (!movieId || !confirm('Are you sure you want to delete this movie? This action cannot be undone.')) return;
    
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const url = getApiUrl(`${BASE_CONFIG.API_ENDPOINTS.MOVIES}/${movieId}`);
      console.log('Making DELETE request to:', url);
      
      const res = await fetch(url, {
        method: 'DELETE',
      });

      const responseData = await res.json().catch(() => ({}));
      console.log('Delete response:', res.status, responseData);

      if (!res.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${res.status}`);
      }

      setSuccessMessage('Movie deleted successfully!');
      setCurrentPage(1);
      
      // Refresh movies list immediately
      await fetchMovies();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error deleting movie:', err);
      setError(`Failed to delete movie: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteQualityFromMovie = async (movieId: string, quality: string) => {
    if (!confirm(`Are you sure you want to delete ${quality} quality from this movie?`)) return;
    
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const url = getApiUrl(`${BASE_CONFIG.API_ENDPOINTS.MOVIES}/${movieId}/quality/${quality}`);
      console.log('Making DELETE request to:', url);
      
      const res = await fetch(url, {
        method: 'DELETE',
      });

      const responseData = await res.json().catch(() => ({}));
      console.log('Delete quality response:', res.status, responseData);

      if (!res.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${res.status}`);
      }

      setSuccessMessage(`Quality ${quality} removed from movie successfully!`);
      setCurrentPage(1);
      
      // Refresh movies list immediately
      await fetchMovies();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error deleting quality:', err);
      setError(`Failed to delete quality: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleQualityAdded = useCallback(async () => {
    setSuccessMessage('Quality added successfully! You can add another.');
    setCurrentPage(1);
    
    // Refresh the movies list first
    await fetchMovies();
    
    // If we're editing a movie, refresh its data
    if (editingMovie?._id) {
      try {
        const res = await fetch(getApiUrl(`${BASE_CONFIG.API_ENDPOINTS.MOVIES}/${editingMovie._id}`));
        if (res.ok) {
          const refreshedMovie = await res.json();
          setEditingMovie(refreshedMovie);
          setNewMovie(refreshedMovie);
        }
      } catch (err) {
        console.error('Error refreshing movie data:', err);
      }
    }
  }, [editingMovie, fetchMovies]);
  
  const quickAddQuality = (movie: Movie) => {
    setEditingMovie(movie);
    setNewMovie(movie);
    setIsAddFormVisible(false);
    setActiveSection('add-movie');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate unique categories for stats
  const uniqueCategories = [...new Set(movies.map(m => m.category).filter(Boolean))].length;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <><Dashboard movies={movies} setActiveSection={setActiveSection} /><FutureEnhancements /></>;
      case 'movies':
        return renderMovieManagement();
      case 'add-movie':
        return renderAddMovieForm();
      case 'categories':
        return <Categories />;
      case 'analytics':
        return <Analytics movies={movies} />;
      case 'users':
        return <Users />;
      case 'downloads':
        return <Downloads />;
      case 'featured':
        return <Featured />;
      case 'trending':
        return <Trending />;
      case 'reports':
        return <Reports />;
      case 'system-status':
        return <SystemStatus />;
      case 'database':
        return <Database />;
      case 'security':
        return <Security />;
      case 'settings':
        return <Settings />;
      case 'rbac':
        return <RBAC />;
      case 'permissions':
        return <Permissions />;
      case 'activity-log':
        return <ActivityLog />;
      case 'password-reset':
        return <PasswordReset />;
      case 'email-verification':
        return <EmailVerification />;
      case 'session-management':
        return <SessionManagement />;
      case 'security-reports':
        return <SecurityReports />;
      default:
        return <Dashboard movies={movies} setActiveSection={setActiveSection} />;
    }
  };

  const renderAddMovieForm = () => (
    <div className="space-y-6">
      {/* Main Form */}
      <div className="bg-slate-800 rounded-lg shadow-lg mb-8">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-2xl font-bold">
            {editingMovie ? `Edit Movie: ${editingMovie.title}` : 'Add New Movie'}
          </h2>
        </div>
        
        <div className="p-4">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2 font-medium">Movie Title</label>
              <input 
                name="title" 
                value={newMovie.title} 
                onChange={handleChange} 
                className="form-input w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Enter movie title..." 
                required 
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Release Year</label>
              <div className="flex gap-2">
                <input 
                  name="year" 
                  type="number" 
                  value={newMovie.year} 
                  onChange={handleChange} 
                  className="form-input flex-1 p-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="2024" 
                  required 
                />
                <button
                  type="button"
                  onClick={() => setNewMovie(prev => ({ ...prev, year: new Date().getFullYear() }))}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Now
                </button>
                <button
                  type="button"
                  onClick={() => setNewMovie(prev => ({ ...prev, year: parseInt(suggestYear(prev.title)) || new Date().getFullYear() }))}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Suggest
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Category</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select 
                    name="category" 
                    value={newMovie.category} 
                    onChange={handleChange} 
                    className="form-select w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required
                  >
                    <option value="">Select Category</option>
                    {BASE_CONFIG.CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2 font-medium">Poster Image URL</label>
              <input 
                name="poster" 
                value={newMovie.poster} 
                onChange={handleChange} 
                className="form-input w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="https://..." 
                required 
              />
            </div>
                
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2 font-medium">Backdrop Image URL</label>
              <input 
                name="backdrop" 
                value={newMovie.backdrop} 
                onChange={handleChange} 
                className="form-input w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="https://..." 
                required 
              />
            </div>
                
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Rating (out of 10)</label>
              <input 
                name="rating" 
                type="number" 
                value={newMovie.rating} 
                onChange={handleChange} 
                className="form-input w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="e.g., 8.6" 
                step="0.1" 
                min="0" 
                max="10" 
                required 
              />
            </div>
                
            <div>
              <label className="block text-gray-300 mb-2 font-medium">YouTube Trailer URL</label>
              <input 
                name="trailerUrl" 
                value={newMovie.trailerUrl} 
                onChange={handleChange} 
                className="form-input w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="https://youtube.com/watch?v=..." 
                required 
              />
            </div>
                
            <div className="md:col-span-2 mt-4">
              <label className="block text-gray-300 mb-4 font-medium text-lg">Download Links (by Quality)</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-700/50 p-4 rounded-lg">
                {newMovie.downloadLinks.map((link, idx) => (
                  <div key={link.quality} className="space-y-2 bg-slate-800 p-4 rounded-lg shadow">
                    <label className="text-md font-bold text-blue-400">{link.quality.toUpperCase()}</label>
                    <input 
                      value={link.url} 
                      onChange={e => handleDownloadLinkChange(idx, 'url', e.target.value)} 
                      className="form-input w-full p-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder={`${link.quality.toUpperCase()} Link`} 
                    />
                    <input 
                      value={link.size} 
                      onChange={e => handleDownloadLinkChange(idx, 'size', e.target.value)} 
                      className="form-input w-full p-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="Size (e.g., 1GB)" 
                    />
                    <input 
                      value={link.audio} 
                      onChange={e => handleDownloadLinkChange(idx, 'audio', e.target.value)} 
                      className="form-input w-full p-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="Audio" 
                    />
                    <input 
                      value={link.format} 
                      onChange={e => handleDownloadLinkChange(idx, 'format', e.target.value)} 
                      className="form-input w-full p-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="Format" 
                    />
                  </div>
                ))}
              </div>
            </div>
                
            <div className="md:col-span-2 text-right mt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                {loading ? 'Saving...' : (editingMovie ? 'Update Movie' : 'Add Movie')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderMovieManagement = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Movie Management</h1>
            <p className="text-green-100">Manage all movies in your database with full CRUD operations</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => fetchMovies()}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 disabled:bg-green-900 text-white rounded-lg transition-colors"
              title="Refresh movies list"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <div className="hidden md:block">
              <Film className="w-16 h-16 text-green-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">Search & Filter</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies by title, category, year, rating, quality, audio, or format..."
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-slate-400"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="mt-3 text-sm text-slate-400">
              Found {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''} matching "{searchQuery}"
            </div>
          )}
        </div>
        
        {/* Movies Grid */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
              <h3 className="text-xl font-bold text-white mb-2">Loading Movies</h3>
              <p className="text-slate-400">Please wait while we fetch your movie data...</p>
            </div>
          ) : filteredMovies.length === 0 ? (
            <div className="text-center py-12">
              <Film className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Movies Found</h3>
              <p className="text-slate-400 mb-4">
                {searchQuery 
                  ? `No movies match your search "${searchQuery}"`
                  : "No movies in your database yet. Add your first movie to get started."
                }
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setActiveSection('add-movie')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Add Your First Movie
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredMovies.map(movie => (
                <div key={movie._id} className="bg-slate-700 rounded-lg shadow-lg overflow-hidden border border-slate-600 hover:border-green-500 transition-all duration-200 transform hover:scale-105">
                  <div className="relative w-full aspect-[2/3] bg-slate-800">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/300x450/374151/FFFFFF?text=No+Image';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                      {movie.rating}/10
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white text-sm mb-2 line-clamp-2" style={{ minHeight: '2.5em' }}>
                      {movie.title}
                    </h3>
                    <div className="text-xs text-slate-400 mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                          {movie.year}
                        </span>
                        <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">
                          {movie.category}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {movie.downloadLinks.slice(0, 3).map((link, idx) => (
                          <span key={idx} className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                            {link.quality}
                          </span>
                        ))}
                        {movie.downloadLinks.length > 3 && (
                          <span className="bg-slate-500/20 text-slate-400 px-2 py-1 rounded text-xs">
                            +{movie.downloadLinks.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => quickAddQuality(movie)}
                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        title="Add Quality"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        onClick={() => handleEditClick(movie)}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        title="Edit Full Movie"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => startTableEdit(movie)}
                        className="p-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                        title="Quick Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteMovie(movie._id || '')}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        title="Delete Movie"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const FutureEnhancements = () => (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mt-8">
      <h2 className="text-2xl font-bold text-white mb-4">Future Enhancements</h2>
      <ul className="list-disc pl-6 text-slate-300 space-y-2">
        <li>Role-based access control (RBAC)</li>
        <li>Permission management</li>
        <li>User activity logging</li>
        <li>Password reset functionality</li>
        <li>Email verification</li>
        <li>Session management dashboard</li>
        <li>Security audit reports</li>
      </ul>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <AdminSidebar 
        theme={theme} 
        setTheme={setTheme} 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300 lg:ml-64" style={{ marginLeft: sidebarOpen ? 0 : undefined }}>
        {/* Header */}
        <AdminHeaderBar 
          activeSection={activeSection}
          notifications={3}
          userName={user?.name || 'Admin User'}
          onLogout={handleLogout}
          onSidebarOpen={() => setSidebarOpen(true)}
        />
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-2 sm:p-6 bg-slate-900">
          {error && <div className="mb-4 p-4 bg-red-600 text-white rounded-lg">{error}</div>}
          {successMessage && <div className="mb-4 p-4 bg-green-600 text-white rounded-lg">{successMessage}</div>}
          
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;