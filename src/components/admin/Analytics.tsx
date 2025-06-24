import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Download, 
  Eye, 
  Star,
  Calendar,
  Film,
  Award,
  Activity,
  Target,
  PieChart,
  LineChart,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

type Props = {
  movies: any[];
};

const Analytics: React.FC<Props> = ({ movies }) => {
  // Check if movies data is available
  const hasData = movies && movies.length > 0;
  
  // Calculate analytics data with safety checks
  const totalMovies = movies?.length || 0;
  const featuredMovies = movies?.filter(m => m.category === 'featured').length || 0;
  const avgRating = totalMovies > 0 
    ? (movies.reduce((sum, m) => sum + (m.rating || 0), 0) / totalMovies).toFixed(1)
    : '0.0';
  const totalDownloads = movies?.reduce((sum, movie) => sum + (movie.downloadLinks?.length || 0), 0) || 0;
  
  // Filter out empty categories and ensure we have valid data
  const categories = [...new Set(movies.map(m => m.category).filter(Boolean))];
  const categoryStats = categories.map(category => ({
    name: category,
    count: movies.filter(m => m.category === category).length,
    percentage: totalMovies > 0 
      ? ((movies.filter(m => m.category === category).length / totalMovies) * 100).toFixed(1)
      : '0.0'
  })).sort((a, b) => b.count - a.count); // Sort by count descending

  const yearlyStats = movies.reduce((acc, movie) => {
    const year = movie.year;
    if (year && year > 1900 && year <= new Date().getFullYear()) {
      acc[year] = (acc[year] || 0) + 1;
    }
    return acc;
  }, {} as { [key: string]: number });

  const yearlyData = Object.entries(yearlyStats)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .slice(-5);

  // Filter movies with valid ratings and sort by rating
  const topMovies = movies
    .filter(m => {
      // More lenient filtering - check for any rating value
      const hasRating = m.rating !== undefined && m.rating !== null && m.rating > 0;
      const hasTitle = m.title && m.title.trim() !== '';
      return hasRating && hasTitle;
    })
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 10);

  // Fallback: if no rated movies, show recent movies
  const fallbackMovies = topMovies.length === 0 
    ? movies
        .filter(m => m.title && m.title.trim() !== '')
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice(0, 10)
    : [];

  const metrics = [
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
      title: 'Average Rating',
      value: avgRating,
      change: '+0.3',
      changeType: 'increase',
      icon: Award,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Total Downloads',
      value: totalDownloads,
      change: '+23%',
      changeType: 'increase',
      icon: Download,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  const chartData = [
    { month: 'Jan', movies: 12, downloads: 45, views: 120 },
    { month: 'Feb', movies: 18, downloads: 67, views: 180 },
    { month: 'Mar', movies: 15, downloads: 52, views: 150 },
    { month: 'Apr', movies: 22, downloads: 89, views: 220 },
    { month: 'May', movies: 25, downloads: 95, views: 250 },
    { month: 'Jun', movies: 30, downloads: 120, views: 300 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-purple-100">
              {hasData 
                ? 'Comprehensive insights into your movie platform performance.'
                : 'Loading analytics data...'
              }
            </p>
          </div>
          <div className="hidden md:block">
            <BarChart3 className="w-16 h-16 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Show loading state if no data */}
      {!hasData && (
        <div className="bg-slate-800 rounded-xl p-12 border border-slate-700 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
          <h3 className="text-xl font-bold text-white mb-2">Loading Analytics</h3>
          <p className="text-slate-400">Please wait while we gather your data...</p>
        </div>
      )}

      {/* Analytics Content - Only show if we have data */}
      {hasData && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                      <Icon className={`w-6 h-6 ${metric.color}`} />
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${
                      metric.changeType === 'increase' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {metric.changeType === 'increase' ? (
                        <ArrowUp className="w-4 h-4" />
                      ) : (
                        <ArrowDown className="w-4 h-4" />
                      )}
                      <span>{metric.change}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
                  <p className="text-slate-400 text-sm">{metric.title}</p>
                </div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trends */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Monthly Trends</h2>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="space-y-4">
                {chartData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-slate-300 font-medium">{data.month}</span>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-white font-bold">{data.movies}</div>
                        <div className="text-slate-400 text-xs">Movies</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-bold">{data.downloads}</div>
                        <div className="text-slate-400 text-xs">Downloads</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-bold">{data.views}</div>
                        <div className="text-slate-400 text-xs">Views</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Category Distribution</h2>
                <PieChart className="w-5 h-5 text-blue-400" />
              </div>
              <div className="space-y-3">
                {categoryStats.length > 0 ? (
                  categoryStats.map((category, index) => {
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
                          <span className="text-white font-medium">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold">{category.count}</div>
                          <div className="text-slate-400 text-xs">{category.percentage}%</div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No categories available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Yearly Statistics */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Yearly Movie Releases</h2>
              <Calendar className="w-5 h-5 text-orange-400" />
            </div>
            {yearlyData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {yearlyData.map(([year, count], index) => (
                  <div key={index} className="bg-slate-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">{count as number}</div>
                    <div className="text-slate-400 text-sm">{year}</div>
                    <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${((count as number) / Math.max(...yearlyData.map(([, c]) => c as number))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No yearly data available</p>
              </div>
            )}
          </div>

          {/* Top Performing Movies */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {topMovies.length > 0 ? 'Top Performing Movies' : 'Recent Movies'}
              </h2>
              <Target className="w-5 h-5 text-green-400" />
            </div>
            {(topMovies.length > 0 || fallbackMovies.length > 0) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(topMovies.length > 0 ? topMovies : fallbackMovies).map((movie, index) => (
                  <div key={index} className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white text-sm truncate" title={movie.title}>
                          {movie.title || 'Untitled Movie'}
                        </h3>
                        <p className="text-slate-400 text-xs">
                          {movie.year || 'Unknown Year'} • {movie.category || 'Uncategorized'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-sm font-bold">
                          {movie.rating ? movie.rating.toFixed(1) : 'N/A'}
                        </span>
                      </div>
                      <div className="text-slate-400 text-xs">
                        {movie.downloadLinks?.length || 0} qualities
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="mb-2">No movies available</p>
                <p className="text-xs">Add movies to see them displayed here</p>
              </div>
            )}
          </div>

          {/* Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Growth Rate</h3>
              </div>
              <div className="text-3xl font-bold text-green-400 mb-2">+23.5%</div>
              <p className="text-slate-400 text-sm">Compared to last month</p>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white">User Engagement</h3>
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-2">87.2%</div>
              <p className="text-slate-400 text-sm">Average session duration</p>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Activity className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Conversion Rate</h3>
              </div>
              <div className="text-3xl font-bold text-purple-400 mb-2">12.8%</div>
              <p className="text-slate-400 text-sm">Downloads per visit</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics; 