import React from 'react';
import { Download, TrendingUp, BarChart3, Calendar } from 'lucide-react';

const Downloads: React.FC = () => {
  // Example download stats
  const downloads = [
    { id: 1, movie: 'Avengers: Endgame', count: 1250, quality: '4K', date: '2024-06-01' },
    { id: 2, movie: 'Spider-Man: No Way Home', count: 980, quality: '1080p', date: '2024-06-02' },
    { id: 3, movie: 'Black Panther: Wakanda Forever', count: 850, quality: '4K', date: '2024-06-03' },
    { id: 4, movie: 'Doctor Strange 2', count: 720, quality: '1080p', date: '2024-06-04' },
    { id: 5, movie: 'Thor: Love and Thunder', count: 650, quality: '4K', date: '2024-06-05' },
  ];

  const totalDownloads = downloads.reduce((sum, d) => sum + d.count, 0);
  const avgDownloads = Math.round(totalDownloads / downloads.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Download Statistics</h1>
            <p className="text-green-100">Track movie download performance and trends</p>
          </div>
          <div className="hidden md:block">
            <Download className="w-16 h-16 text-green-200" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <Download className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalDownloads.toLocaleString()}</p>
              <p className="text-slate-400 text-sm">Total Downloads</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{avgDownloads}</p>
              <p className="text-slate-400 text-sm">Average Downloads</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{downloads.length}</p>
              <p className="text-slate-400 text-sm">Active Movies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Downloads Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Download History</h2>
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Last 30 days</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Movie</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Quality</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Downloads</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Date</th>
                <th className="px-6 py-4 text-left text-slate-300 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {downloads.map((download) => (
                <tr key={download.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">{download.movie}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      download.quality === '4K' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {download.quality}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-bold">{download.count.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300 text-sm">{download.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm">+12%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Downloads; 