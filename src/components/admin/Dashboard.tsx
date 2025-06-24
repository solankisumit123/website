import React from 'react';
import { 
  Film, 
  Users, 
  Download, 
  TrendingUp, 
  Star, 
  Activity, 
  Calendar,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown,
  Eye,
  Clock,
  Award,
  Zap
} from 'lucide-react';

type Props = {
  movies: any[];
  setActiveSection?: (section: string) => void;
};

const Dashboard: React.FC<Props> = ({ movies, setActiveSection }) => {
  // Calculate statistics
  const totalMovies = movies.length;
  const featuredMovies = movies.filter(m => m.category === 'featured').length;
  const totalDownloads = movies.reduce((sum, movie) => {
    return sum + (movie.downloadLinks?.length || 0);
  }, 0);
  
  const categories = [...new Set(movies.map(m => m.category).filter(Boolean))];
  const uniqueCategories = categories.length;
  
  const recentMovies = movies.slice(0, 5);
  const topRatedMovies = movies
    .filter(m => m.rating > 7)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5);

  const stats = [
    {
      title: 'Total Movies',
      value: totalMovies,
      change: '+12%',
      changeType: 'increase',
      icon: Film,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Featured Movies',
      value: featuredMovies,
      change: '+5%',
      changeType: 'increase',
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      title: 'Total Downloads',
      value: totalDownloads,
      change: '+23%',
      changeType: 'increase',
      icon: Download,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Categories',
      value: uniqueCategories,
      change: '+2',
      changeType: 'increase',
      icon: Award,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  const quickActions = [
    { title: 'Add New Movie', icon: Film, color: 'bg-blue-600', section: 'add-movie' },
    { title: 'Manage Categories', icon: Award, color: 'bg-purple-600', section: 'categories' },
    { title: 'View Analytics', icon: BarChart3, color: 'bg-green-600', section: 'analytics' },
    { title: 'System Settings', icon: Activity, color: 'bg-orange-600', section: 'settings' }
  ];

  const handleQuickAction = (section: string) => {
    if (setActiveSection) {
      console.log('Quick Action: Navigating to', section);
      setActiveSection(section);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Admin!</h1>
            <p className="text-blue-100">Here's what's happening with your movie platform today.</p>
          </div>
          <div className="hidden md:block">
            <Zap className="w-16 h-16 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  stat.changeType === 'increase' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.changeType === 'increase' ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-slate-400 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => handleQuickAction(action.section)}
                className={`${action.color} text-white p-4 rounded-lg hover:opacity-90 transition-all duration-200 transform hover:scale-105 flex items-center gap-3 cursor-pointer`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{action.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity & Top Rated */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Movies */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Recent Movies</h2>
            <Clock className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-3">
            {recentMovies.map((movie, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-12 h-16 object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/48x64/374151/FFFFFF?text=No+Image';
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-medium text-white text-sm">{movie.title}</h3>
                  <p className="text-slate-400 text-xs">{movie.year} • {movie.category}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-xs">{movie.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Rated Movies */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Top Rated</h2>
            <Star className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="space-y-3">
            {topRatedMovies.map((movie, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-12 h-16 object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/48x64/374151/FFFFFF?text=No+Image';
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-medium text-white text-sm">{movie.title}</h3>
                  <p className="text-slate-400 text-xs">{movie.year} • {movie.category}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-xs font-bold">{movie.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Category Distribution</h2>
          <PieChart className="w-5 h-5 text-slate-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category, index) => {
            const count = movies.filter(m => m.category === category).length;
            const percentage = ((count / totalMovies) * 100).toFixed(1);
            const colors = [
              'bg-blue-500',
              'bg-green-500',
              'bg-yellow-500',
              'bg-purple-500',
              'bg-red-500',
              'bg-pink-500'
            ];
            
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${colors[index % colors.length]}`}></div>
                  <span className="text-white font-medium">{category}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">{count}</div>
                  <div className="text-slate-400 text-xs">{percentage}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-white font-medium">Database</p>
              <p className="text-green-400 text-sm">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div>
              <p className="text-white font-medium">API Server</p>
              <p className="text-blue-400 text-sm">Running</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div>
              <p className="text-white font-medium">Storage</p>
              <p className="text-yellow-400 text-sm">85% Used</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 