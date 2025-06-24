import React from 'react';
import { 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut, 
  HelpCircle, 
  MessageSquare,
  Activity,
  TrendingUp,
  Download
} from 'lucide-react';

type Props = {
  activeSection: string;
  notifications?: number;
  userName?: string;
  userAvatar?: string;
  onLogout?: () => void;
  onSidebarOpen?: () => void;
};

const AdminHeaderBar: React.FC<Props> = ({ 
  activeSection, 
  notifications = 3, 
  userName = "Admin User",
  userAvatar,
  onLogout,
  onSidebarOpen
}) => {
  const getSectionTitle = () => {
    const titles: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'movies': 'Movie Management',
      'add-movie': 'Add New Movie',
      'categories': 'Category Management',
      'analytics': 'Analytics & Reports',
      'users': 'User Management',
      'downloads': 'Download Statistics',
      'featured': 'Featured Content',
      'trending': 'Trending Analysis',
      'reports': 'Reports & Insights',
      'database': 'Database Management',
      'security': 'Security Settings',
      'settings': 'System Settings'
    };
    return titles[activeSection] || 'Admin Panel';
  };

  return (
    <header className="w-full h-16 bg-slate-800 border-b border-slate-700 flex items-center px-6 justify-between sticky top-0 z-40 shadow-lg">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Sidebar toggle for mobile */}
        <button
          className="lg:hidden p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-700"
          onClick={onSidebarOpen}
          aria-label="Open sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10">
            <img src="/image/ChatGPT Image Jun 23, 2025, 02_51_32 PM.png" alt="Admin Logo" className="w-full h-full object-contain rounded-full border-2 border-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-white">{getSectionTitle()}</h1>
            <p className="text-sm text-slate-400">Movie Management System</p>
          </div>
        </div>
      </div>

      {/* Center Section - Quick Stats */}
      <div className="hidden lg:flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm">
          <Activity className="w-4 h-4 text-green-400" />
          <span className="text-slate-300">System Status:</span>
          <span className="text-green-400 font-medium">Online</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <span className="text-slate-300">Today's Views:</span>
          <span className="text-blue-400 font-medium">1,234</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Download className="w-4 h-4 text-purple-400" />
          <span className="text-slate-300">Downloads:</span>
          <span className="text-purple-400 font-medium">567</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
          <Bell className="w-5 h-5 text-slate-300" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {notifications > 9 ? '9+' : notifications}
            </span>
          )}
        </button>

        {/* Messages */}
        <button className="relative p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
          <MessageSquare className="w-5 h-5 text-slate-300" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
            2
          </span>
        </button>

        {/* Help */}
        <button className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
          <HelpCircle className="w-5 h-5 text-slate-300" />
        </button>

        {/* User Profile */}
        <div className="relative group">
          <button className="flex items-center gap-3 p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
            {userAvatar ? (
              <img 
                src={userAvatar} 
                alt={userName} 
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
            <span className="text-slate-300 font-medium hidden sm:block">{userName}</span>
          </button>

          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="p-2">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-md transition-colors">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-md transition-colors">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <hr className="border-slate-700 my-1" />
              <button 
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-slate-700 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeaderBar; 