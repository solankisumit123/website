import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Film, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  // const { isAuthenticated, isAdmin } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const categories = [
    { name: 'Home', path: '/' },
    { name: '2160pHEVC ', path: '/category/2160p-hevc' },
    { name: '4K HDR', path: '/category/4k-hdr' },
    { name: '1080p 10Bit', path: '/category/1080p-10bit' },
    { name: 'Dual Audio Movies', path: '/category/dual-audio-movies' },
    { name: 'English Movies', path: '/category/english-movies' },
    { name: 'IMAX', path: '/category/imax' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4 flex-shrink-0">
            <div className="h-14 w-14">
              <img src="/image/ChatGPT Image Jun 23, 2025, 02_51_32 PM.png" alt="Movie Logo" className="h-full w-full object-contain rounded-full border-2 border-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white leading-none">Movie Hub</span>
              <p className="text-xs text-gray-400 mt-1">Download Hub</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className={`text-gray-300 hover:text-white transition-colors duration-200 font-medium text-sm whitespace-nowrap ${
                  category.name === 'Home' ? 'text-blue-400 hover:text-blue-300' : ''
                } ${
                  category.name.includes('4K') || category.name.includes('HEVC') 
                    ? 'text-green-400 hover:text-green-300' 
                    : ''
                } ${
                  category.name === 'IMAX' ? 'text-yellow-400 hover:text-yellow-300' : ''
                }`}
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Right side: Search and Admin */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies, series..."
                  className="bg-gray-800 text-white placeholder-gray-400 rounded-lg pl-4 pr-4 py-2 w-48 lg:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </form>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900 border-t border-gray-700">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search movies, series..."
                    className="bg-gray-800 text-white placeholder-gray-400 rounded-lg pl-4 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                  />
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </form>

              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={category.path}
                  className={`block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md ${
                    category.name === 'Home' ? 'text-blue-400' : ''
                  } ${
                    category.name.includes('4K') || category.name.includes('HEVC') 
                      ? 'text-green-400' 
                      : ''
                  } ${
                    category.name === 'IMAX' ? 'text-yellow-400' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;