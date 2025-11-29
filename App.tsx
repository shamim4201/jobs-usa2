
import React, { useState } from 'react';
import type { Page, User } from './types';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import InvitePage from './pages/InvitePage';
import JobDetailsPage from './pages/JobDetailsPage';
import AdsPlanPage from './pages/AdsPlanPage';
import BottomNav from './components/BottomNav';
import AdminLayout from './layouts/AdminLayout';
import { DataProvider } from './context/DataContext';
import GoogleAnalytics from './components/GoogleAnalytics';
import SeoUpdater from './components/SeoUpdater';
import LiveChatWidget from './components/LiveChatWidget'; // New Import

const getInitialPage = (): Page => {
  const params = new URLSearchParams(window.location.search);
  const page = params.get('page') as Page;
  if (page && ['home', 'jobs', 'invite', 'settings', 'register', 'job-details', 'ads-plan'].includes(page)) {
    return page;
  }
  return 'home';
}

const getInitialJobId = (): number | null => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('jobId');
  return id ? parseInt(id) : null;
}

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(getInitialPage());
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(getInitialJobId());

  const handleLogin = (user: User) => {
    setLoggedInUser(user);
    if (user.role !== 'admin') {
        // If regular user logs in, stay on settings page (which now shows Dashboard)
        setCurrentPage('settings'); 
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setCurrentPage('settings'); // Go back to login form
  };

  const handleJobClick = (jobId: number) => {
    setSelectedJobId(jobId);
    setCurrentPage('job-details');
    window.scrollTo(0, 0); // Scroll to top
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} onJobClick={handleJobClick} user={loggedInUser} />;
      case 'jobs':
        return <JobsPage onJobClick={handleJobClick} />;
      case 'invite':
        return <InvitePage />;
      case 'settings':
        return <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} loggedInUser={loggedInUser} onLogout={handleLogout} />;
      case 'register':
        return <RegisterPage onNavigate={setCurrentPage} />;
      case 'job-details':
        return <JobDetailsPage jobId={selectedJobId} onNavigate={setCurrentPage} user={loggedInUser} />;
      case 'ads-plan':
        return <AdsPlanPage onNavigate={setCurrentPage} user={loggedInUser} />;
      default:
        return <HomePage onNavigate={setCurrentPage} onJobClick={handleJobClick} user={loggedInUser} />;
    }
  };

  if (loggedInUser?.role === 'admin') {
    return <AdminLayout user={loggedInUser} onLogout={handleLogout} />;
  }

  return (
    <div className="font-sans antialiased text-gray-800 min-h-screen pb-16 bg-transparent relative">
      <main>{renderPage()}</main>
      
      {/* User Live Chat Widget */}
      <LiveChatWidget user={loggedInUser} />

      <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <GoogleAnalytics />
      <SeoUpdater />
      <AppContent />
    </DataProvider>
  );
};

export default App;
