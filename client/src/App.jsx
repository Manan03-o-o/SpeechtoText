import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';

// Inner component that uses auth context
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show a clean loading screen while checking saved auth
  if (loading) {
    return (
      <div className="min-h-screen bg-darkBg bg-mesh flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated, else show home
  return isAuthenticated ? <Home /> : <Login />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
