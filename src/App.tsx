import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/AppLayout';
import { AuthPage } from './pages/AuthPage';

function AppContent() {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <AppLayout />;
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
