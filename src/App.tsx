import { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';

function App() {
  const [page, setPage] = useState<'home' | 'dashboard'>('home');

  const handleNavigateToDashboard = () => {
    setPage('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (page === 'dashboard') {
    return <DashboardPage onNavigateHome={handleNavigateHome} />;
  }

  return <LandingPage onNavigateToDashboard={handleNavigateToDashboard} />;
}

export default App;
