import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Database, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Cpu, 
  HardDrive, 
  Network, 
  Shield,
  RefreshCw,
  TrendingUp,
  Users,
  Film,
  Download
} from 'lucide-react';

interface SystemMetric {
  name: string;
  value: string | number;
  status: 'healthy' | 'warning' | 'error';
  icon: React.ComponentType<any>;
  description: string;
}

interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  user?: string;
}

const SystemStatus: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock system metrics - in real app, these would come from API
  const [systemMetrics] = useState<SystemMetric[]>([
    {
      name: 'Server Status',
      value: 'Online',
      status: 'healthy',
      icon: Server,
      description: 'Main application server is running'
    },
    {
      name: 'Database',
      value: 'Connected',
      status: 'healthy',
      icon: Database,
      description: 'MongoDB connection is active'
    },
    {
      name: 'API Response',
      value: '245ms',
      status: 'healthy',
      icon: Activity,
      description: 'Average API response time'
    },
    {
      name: 'CPU Usage',
      value: '23%',
      status: 'healthy',
      icon: Cpu,
      description: 'Current CPU utilization'
    },
    {
      name: 'Memory Usage',
      value: '67%',
      status: 'warning',
      icon: HardDrive,
      description: 'RAM usage is moderate'
    },
    {
      name: 'Network',
      value: '1.2GB/s',
      status: 'healthy',
      icon: Network,
      description: 'Current bandwidth usage'
    },
    {
      name: 'Security',
      value: 'Protected',
      status: 'healthy',
      icon: Shield,
      description: 'All security protocols active'
    },
    {
      name: 'Uptime',
      value: '99.8%',
      status: 'healthy',
      icon: Clock,
      description: 'System availability this month'
    }
  ]);

  const [activityLogs] = useState<ActivityLog[]>([
    {
      id: '1',
      timestamp: '2024-01-15 14:30:22',
      type: 'success',
      message: 'New movie "The Matrix Resurrections" added successfully',
      user: 'admin@example.com'
    },
    {
      id: '2',
      timestamp: '2024-01-15 14:25:15',
      type: 'info',
      message: 'Database backup completed',
      user: 'system'
    },
    {
      id: '3',
      timestamp: '2024-01-15 14:20:08',
      type: 'warning',
      message: 'High memory usage detected on server-02',
      user: 'monitoring'
    },
    {
      id: '4',
      timestamp: '2024-01-15 14:15:33',
      type: 'success',
      message: 'User registration: john.doe@example.com',
      user: 'system'
    },
    {
      id: '5',
      timestamp: '2024-01-15 14:10:45',
      type: 'error',
      message: 'Failed to process download request for movie ID: 12345',
      user: 'user@example.com'
    },
    {
      id: '6',
      timestamp: '2024-01-15 14:05:12',
      type: 'info',
      message: 'Scheduled maintenance completed',
      user: 'system'
    }
  ]);

  const [stats] = useState({
    totalMovies: 1247,
    totalUsers: 15420,
    totalDownloads: 89234,
    activeUsers: 342
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500/10 border-green-500/20';
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'error': return 'bg-red-500/10 border-red-500/20';
      default: return 'bg-gray-500/10 border-gray-500/20';
    }
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">System Status</h1>
          <p className="text-slate-400">Monitor system health and performance metrics</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Last Updated */}
      <div className="text-sm text-slate-400">
        Last updated: {lastUpdated.toLocaleString()}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Film className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Movies</p>
              <p className="text-2xl font-bold text-white">{stats.totalMovies.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Downloads</p>
              <p className="text-2xl font-bold text-white">{stats.totalDownloads.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Active Users</p>
              <p className="text-2xl font-bold text-white">{stats.activeUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Metrics */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">System Metrics</h2>
          <p className="text-slate-400 text-sm">Real-time system performance indicators</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${getStatusBg(metric.status)}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className={`w-5 h-5 ${getStatusColor(metric.status)}`} />
                    <span className="font-medium text-white">{metric.name}</span>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
                  <p className="text-sm text-slate-400">{metric.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activity Logs */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
          <p className="text-slate-400 text-sm">Latest system events and user actions</p>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {activityLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                {getLogIcon(log.type)}
                <div className="flex-1">
                  <p className="text-white text-sm">{log.message}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-slate-400">{log.timestamp}</span>
                    {log.user && (
                      <span className="text-xs text-slate-400">by {log.user}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* API Endpoints Status */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">API Endpoints</h2>
          <p className="text-slate-400 text-sm">Status of all API endpoints</p>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {[
              { endpoint: '/api/movies', status: 'healthy', response: '200 OK' },
              { endpoint: '/api/users', status: 'healthy', response: '200 OK' },
              { endpoint: '/api/downloads', status: 'healthy', response: '200 OK' },
              { endpoint: '/api/analytics', status: 'warning', response: '503 Service Unavailable' },
              { endpoint: '/api/notifications', status: 'healthy', response: '200 OK' }
            ].map((api, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(api.status).replace('text-', 'bg-')}`}></div>
                  <span className="text-white font-mono text-sm">{api.endpoint}</span>
                </div>
                <span className="text-slate-400 text-sm">{api.response}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus; 