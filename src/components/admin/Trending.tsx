import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Star, 
  Eye, 
  Download, 
  MessageCircle, 
  Bell, 
  Plus, 
  Edit, 
  Trash2, 
  Send, 
  Filter,
  Search,
  Calendar,
  Users,
  Activity,
  Zap,
  Target,
  BarChart3,
  RefreshCw,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

interface TrendingMovie {
  id: string;
  title: string;
  poster: string;
  year: number;
  rating: number;
  views: number;
  downloads: number;
  trendScore: number;
  category: string;
  addedDate: string;
  isActive: boolean;
}

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

const Trending: React.FC = () => {
  const [trendingMovies, setTrendingMovies] = useState<TrendingMovie[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<'trending' | 'notifications' | 'messages'>('trending');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<TrendingMovie | null>(null);
  const [newMessage, setNewMessage] = useState({ to: '', subject: '', content: '' });

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockTrendingMovies: TrendingMovie[] = [
      {
        id: '1',
        title: 'The Matrix Resurrections',
        poster: 'https://via.placeholder.com/150x225/374151/FFFFFF?text=Matrix',
        year: 2024,
        rating: 8.5,
        views: 15420,
        downloads: 8923,
        trendScore: 95,
        category: 'Sci-Fi',
        addedDate: '2024-01-15',
        isActive: true
      },
      {
        id: '2',
        title: 'Dune: Part Two',
        poster: 'https://via.placeholder.com/150x225/374151/FFFFFF?text=Dune',
        year: 2024,
        rating: 9.2,
        views: 18750,
        downloads: 12450,
        trendScore: 98,
        category: 'Sci-Fi',
        addedDate: '2024-01-14',
        isActive: true
      },
      {
        id: '3',
        title: 'Oppenheimer',
        poster: 'https://via.placeholder.com/150x225/374151/FFFFFF?text=Oppenheimer',
        year: 2023,
        rating: 8.8,
        views: 22340,
        downloads: 15670,
        trendScore: 92,
        category: 'Drama',
        addedDate: '2024-01-13',
        isActive: true
      },
      {
        id: '4',
        title: 'Barbie',
        poster: 'https://via.placeholder.com/150x225/374151/FFFFFF?text=Barbie',
        year: 2023,
        rating: 7.9,
        views: 19870,
        downloads: 11230,
        trendScore: 89,
        category: 'Comedy',
        addedDate: '2024-01-12',
        isActive: true
      },
      {
        id: '5',
        title: 'Mission: Impossible - Dead Reckoning',
        poster: 'https://via.placeholder.com/150x225/374151/FFFFFF?text=MI7',
        year: 2023,
        rating: 8.1,
        views: 16540,
        downloads: 9870,
        trendScore: 87,
        category: 'Action',
        addedDate: '2024-01-11',
        isActive: true
      }
    ];

    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'success',
        title: 'Trending Update',
        message: 'The Matrix Resurrections has reached #1 trending position',
        timestamp: '2024-01-15 14:30:22',
        isRead: false
      },
      {
        id: '2',
        type: 'warning',
        title: 'High Traffic Alert',
        message: 'Server load is high due to increased movie downloads',
        timestamp: '2024-01-15 14:25:15',
        isRead: false
      },
      {
        id: '3',
        type: 'info',
        title: 'New Feature',
        message: 'Trending algorithm has been updated for better accuracy',
        timestamp: '2024-01-15 14:20:08',
        isRead: true
      },
      {
        id: '4',
        type: 'error',
        title: 'API Error',
        message: 'Failed to fetch trending data from external service',
        timestamp: '2024-01-15 14:15:33',
        isRead: false
      }
    ];

    const mockMessages: Message[] = [
      {
        id: '1',
        from: 'admin@example.com',
        to: 'content@example.com',
        subject: 'Trending Movies Update',
        content: 'Please review the new trending movies list and update the homepage accordingly.',
        timestamp: '2024-01-15 14:30:22',
        isRead: false,
        priority: 'high'
      },
      {
        id: '2',
        from: 'analytics@example.com',
        to: 'admin@example.com',
        subject: 'Weekly Trending Report',
        content: 'Here is the weekly trending analysis report for your review.',
        timestamp: '2024-01-15 14:25:15',
        isRead: true,
        priority: 'medium'
      },
      {
        id: '3',
        from: 'support@example.com',
        to: 'admin@example.com',
        subject: 'User Feedback',
        content: 'Users are requesting more trending movies in the action category.',
        timestamp: '2024-01-15 14:20:08',
        isRead: false,
        priority: 'low'
      }
    ];

    setTrendingMovies(mockTrendingMovies);
    setNotifications(mockNotifications);
    setMessages(mockMessages);
  }, []);

  const handleAddTrending = () => {
    setShowAddForm(true);
    setEditingMovie(null);
  };

  const handleEditTrending = (movie: TrendingMovie) => {
    setEditingMovie(movie);
    setShowAddForm(true);
  };

  const handleDeleteTrending = (id: string) => {
    if (confirm('Are you sure you want to remove this movie from trending?')) {
      setTrendingMovies(prev => prev.filter(movie => movie.id !== id));
    }
  };

  const handleToggleActive = (id: string) => {
    setTrendingMovies(prev => prev.map(movie => 
      movie.id === id ? { ...movie, isActive: !movie.isActive } : movie
    ));
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.to && newMessage.subject && newMessage.content) {
      const message: Message = {
        id: Date.now().toString(),
        from: 'admin@example.com',
        to: newMessage.to,
        subject: newMessage.subject,
        content: newMessage.content,
        timestamp: new Date().toISOString(),
        isRead: false,
        priority: 'medium'
      };
      setMessages(prev => [message, ...prev]);
      setNewMessage({ to: '', subject: '', content: '' });
    }
  };

  const handleMarkMessageRead = (id: string) => {
    setMessages(prev => prev.map(message => 
      message.id === id ? { ...message, isRead: true } : message
    ));
  };

  const filteredTrendingMovies = trendingMovies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadNotifications = notifications.filter(n => !n.isRead).length;
  const unreadMessages = messages.filter(m => !m.isRead).length;

  const getTrendingStats = () => {
    const totalViews = trendingMovies.reduce((sum, movie) => sum + movie.views, 0);
    const totalDownloads = trendingMovies.reduce((sum, movie) => sum + movie.downloads, 0);
    const avgRating = trendingMovies.reduce((sum, movie) => sum + movie.rating, 0) / trendingMovies.length;
    const activeTrending = trendingMovies.filter(movie => movie.isActive).length;

    return { totalViews, totalDownloads, avgRating: avgRating.toFixed(1), activeTrending };
  };

  const stats = getTrendingStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Trending Movies</h1>
            <p className="text-orange-100">Monitor and manage trending movies, notifications, and messaging</p>
          </div>
          <div className="hidden md:block">
            <TrendingUp className="w-16 h-16 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Views</p>
              <p className="text-2xl font-bold text-white">{stats.totalViews.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Downloads</p>
              <p className="text-2xl font-bold text-white">{stats.totalDownloads.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Avg Rating</p>
              <p className="text-2xl font-bold text-white">{stats.avgRating}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Active Trending</p>
              <p className="text-2xl font-bold text-white">{stats.activeTrending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="border-b border-slate-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('trending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'trending'
                  ? 'border-orange-500 text-orange-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trending Movies
              </div>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'notifications'
                  ? 'border-orange-500 text-orange-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
                {unreadNotifications > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadNotifications}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'messages'
                  ? 'border-orange-500 text-orange-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Messages
                {unreadMessages > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadMessages}
                  </span>
                )}
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Trending Movies Tab */}
          {activeTab === 'trending' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search trending movies..."
                      className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-slate-400"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddTrending}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Trending
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrendingMovies.map((movie) => (
                  <div key={movie.id} className="bg-slate-700 rounded-lg overflow-hidden border border-slate-600 hover:border-orange-500 transition-all duration-200">
                    <div className="relative">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                        #{movie.trendScore}
                      </div>
                      <div className="absolute top-2 left-2">
                        <button
                          onClick={() => handleToggleActive(movie.id)}
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            movie.isActive
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                          }`}
                        >
                          {movie.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-white text-lg mb-2">{movie.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                        <span>{movie.year}</span>
                        <span>•</span>
                        <span>{movie.category}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span>{movie.rating}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-slate-400">Views</p>
                          <p className="text-white font-medium">{movie.views.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Downloads</p>
                          <p className="text-white font-medium">{movie.downloads.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex justify-between gap-2">
                        <button
                          onClick={() => handleEditTrending(movie)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTrending(movie.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">System Notifications</h3>
                <button
                  onClick={() => setNotifications([])}
                  className="text-sm text-slate-400 hover:text-white"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border ${
                      notification.isRead ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-700 border-slate-500'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === 'success' ? 'bg-green-500' :
                          notification.type === 'warning' ? 'bg-yellow-500' :
                          notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                        }`}></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-white">{notification.title}</h4>
                            {!notification.isRead && (
                              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">New</span>
                            )}
                          </div>
                          <p className="text-slate-400 text-sm mb-2">{notification.message}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {notification.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkNotificationRead(notification.id)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Message List */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-semibold text-white">Messages</h3>
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        message.isRead ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-700 border-slate-500'
                      } hover:border-orange-500`}
                      onClick={() => handleMarkMessageRead(message.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-white">{message.subject}</h4>
                            {!message.isRead && (
                              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">New</span>
                            )}
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              message.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                              message.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {message.priority}
                            </span>
                          </div>
                          <p className="text-slate-400 text-sm mb-2 line-clamp-2">{message.content}</p>
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>From: {message.from}</span>
                            <span>{message.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compose Message */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Compose Message</h3>
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">To</label>
                    <input
                      type="email"
                      value={newMessage.to}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, to: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                      placeholder="recipient@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                    <input
                      type="text"
                      value={newMessage.subject}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                      placeholder="Message subject"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                    <textarea
                      value={newMessage.content}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white resize-none"
                      placeholder="Type your message here..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trending; 