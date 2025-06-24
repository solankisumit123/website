import React from 'react';
import { 
  Film, 
  Plus, 
  Settings, 
  Users, 
  BarChart3, 
  Database, 
  Shield, 
  Activity,
  Home,
  Search,
  Download,
  Star,
  TrendingUp,
  Calendar,
  FileText,
  Monitor,
  ShieldCheck,
  KeyRound,
  ClipboardList,
  MailCheck,
  LogIn,
  LogOut,
  UserCog,
  FileBarChart2,
  RefreshCw
} from 'lucide-react';

type Props = {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
};

const AdminSidebar: React.FC<Props> = ({ theme, setTheme, activeSection, setActiveSection, isOpen = true, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'text-blue-400' },
    { id: 'movies', label: 'Movies', icon: Film, color: 'text-green-400' },
    { id: 'add-movie', label: 'Add Movie', icon: Plus, color: 'text-purple-400' },
    { id: 'categories', label: 'Categories', icon: FileText, color: 'text-yellow-400' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-red-400' },
    { id: 'users', label: 'Users', icon: Users, color: 'text-indigo-400' },
    { id: 'downloads', label: 'Downloads', icon: Download, color: 'text-pink-400' },
    { id: 'featured', label: 'Featured', icon: Star, color: 'text-orange-400' },
    { id: 'trending', label: 'Trending', icon: TrendingUp, color: 'text-emerald-400' },
    { id: 'reports', label: 'Reports', icon: Activity, color: 'text-cyan-400' },
    { id: 'system-status', label: 'System Status', icon: Monitor, color: 'text-teal-400' },
    { id: 'database', label: 'Database', icon: Database, color: 'text-violet-400' },
    { id: 'security', label: 'Security', icon: Shield, color: 'text-rose-400' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-400' },
    { id: 'rbac', label: 'RBAC', icon: UserCog, color: 'text-blue-400' },
    { id: 'permissions', label: 'Permissions', icon: KeyRound, color: 'text-purple-400' },
    { id: 'activity-log', label: 'Activity Log', icon: ClipboardList, color: 'text-green-400' },
    { id: 'password-reset', label: 'Password Reset', icon: RefreshCw, color: 'text-yellow-400' },
    { id: 'email-verification', label: 'Email Verification', icon: MailCheck, color: 'text-pink-400' },
    { id: 'session-management', label: 'Session Management', icon: LogIn, color: 'text-orange-400' },
    { id: 'security-reports', label: 'Security Reports', icon: FileBarChart2, color: 'text-red-400' },
  ];

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  return (
    <aside
      className={`
        w-64 bg-slate-900 border-r border-slate-700 flex flex-col min-h-screen shadow-xl fixed left-0 top-0 z-50
        transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12">
            <img src="/image/ChatGPT Image Jun 23, 2025, 02_51_32 PM.png" alt="4K Movie Logo" className="w-full h-full object-contain rounded-full border-2 border-white" />
          </div>
          <div className="flex flex-col">
            <span className="flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-orange-500 leading-none">4K</span>
              <span className="text-2xl font-extrabold text-white leading-none">MOVIE</span>
            </span>
            <span className="text-xs text-slate-400 mt-1">Admin Panel</span>
          </div>
        </div>
        {/* Mobile close button */}
        <button
          className="lg:hidden rounded-lg p-2 bg-slate-800 hover:bg-slate-700 transition-colors ml-2"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <span className="text-white text-xl">×</span>
        </button>
        <button
          className="hidden lg:block rounded-lg p-2 bg-slate-800 hover:bg-slate-700 transition-colors ml-2"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border-l-4 border-white' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white hover:border-l-4 hover:border-slate-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.color}`} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>System Online</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">v2.1.0 - Admin Panel</p>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar; 