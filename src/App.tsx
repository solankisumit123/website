import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import HowToDownloadPage from './pages/HowToDownloadPage';
import MoviePage from './pages/MoviePage';
import SearchPage from './pages/SearchPage';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import AdBanner from './components/AdBanner';

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    <main className="pt-16">
      {children}
    </main>
  </>
);

function App() {
  return (
    <AuthProvider>
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div className="min-h-screen bg-slate-900">
        <Routes>
          <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
          <Route path="/category/:category" element={<MainLayout><CategoryPage /></MainLayout>} />
          <Route path="/movie/:id" element={<MainLayout><MoviePage /></MainLayout>} />
          <Route path="/search" element={<MainLayout><SearchPage /></MainLayout>} />
          <Route path="/how-to-download" element={<MainLayout><HowToDownloadPage /></MainLayout>} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPage />
                </ProtectedRoute>
              } 
            />
          {/* Redirect all other paths to the home page */}
          <Route path="*" element={<MainLayout><HomePage /></MainLayout>} />
        </Routes>
        <AdBanner />
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;