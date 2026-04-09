import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { LandingPage } from './pages/LandingPage';
import { SignInPage, SignUpPage } from './pages/AuthPages';
import Dashboard from './components/Dashboard';
import './styles/globals.css';
import './App.css';

function AppContent() {
  const { currentPage, isInitializing, appError } = useAppContext();

  if (appError) {
    return (
      <div className="app-loading-shell">
        <div className="app-loading-card app-error-card">
          <h1>Unable to load the app</h1>
          <p>{appError}</p>
        </div>
      </div>
    );
  }

  if (isInitializing) {
    return (
      <div className="app-loading-shell">
        <div className="app-loading-card">
          <div className="app-loading-pill" />
          <h1>Loading workspace</h1>
          <p>Connecting your session and campaign data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {currentPage === 'landing' && <LandingPage />}
      {currentPage === 'signin' && <SignInPage />}
      {currentPage === 'signup' && <SignUpPage />}
      {(currentPage === 'dashboard' || currentPage === 'campaign' || currentPage === 'results') && <Dashboard />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
