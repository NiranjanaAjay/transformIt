import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { LandingPage } from './pages/LandingPage';
import { SignInPage, SignUpPage } from './pages/AuthPages';
import Dashboard from './components/Dashboard';
import './styles/globals.css';
import './App.css';

function AppContent() {
  const { currentPage } = useAppContext();

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
