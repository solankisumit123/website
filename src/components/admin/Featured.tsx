import React, { useState } from 'react';
import { Plus, Star, Eye, Calendar } from 'lucide-react';

const Featured: React.FC = () => {
  const [featured, setFeatured] = useState([
    { id: 1, title: 'Avengers: Endgame', rating: 8.4, views: '2.5M', date: '2024-06-01' },
    { id: 2, title: 'Spider-Man: No Way Home', rating: 8.2, views: '1.8M', date: '2024-06-02' },
    { id: 3, title: 'Black Panther: Wakanda Forever', rating: 7.9, views: '1.2M', date: '2024-06-03' },
  ]);

  const handleAddFeatured = () => {
    console.log('Add Featured clicked');
    // TODO: Implement add featured functionality
    alert('Add Featured functionality will be implemented here');
  };

  const handleToggleFeatured = (movieId: number) => {
    console.log('Toggle Featured clicked:', movieId);
    // TODO: Implement toggle featured functionality
    alert(`Toggle Featured ${movieId} functionality will be implemented here`);
  };

  const handleRemoveFeatured = (movieId: number) => {
    console.log('Remove Featured clicked:', movieId);
    if (window.confirm('Are you sure you want to remove this from featured?')) {
      setFeatured(featured.filter(movie => movie.id !== movieId));
      alert(`Movie ${movieId} removed from featured successfully!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Featured Movies</h1>
            <p className="text-yellow-100">Manage featured content and promotions</p>
          </div>
          <div className="hidden md:block">
            <Star className="w-16 h-16 text-yellow-200" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <Star className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{featured.length}</p>
              <p className="text-slate-400 text-sm">Featured Movies</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <Eye className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">5.5M</p>
              <p className="text-slate-400 text-sm">Total Views</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <Star className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">8.2</p>
              <p className="text-slate-400 text-sm">Avg Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Movies List */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Featured Content</h2>
            <button 
              onClick={handleAddFeatured}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Featured
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {featured.map((movie) => (
              <div key={movie.id} className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{movie.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          {movie.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {movie.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {movie.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleToggleFeatured(movie.id)}
                      className="p-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleRemoveFeatured(movie.id)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured; 