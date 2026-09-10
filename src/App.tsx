/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PageMode } from './types';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { AnalysisPage } from './components/AnalysisPage';
import { HistoryPage } from './components/HistoryPage';
import { ReportPage } from './components/ReportPage';
import { SettingsPage } from './components/SettingsPage';
import { CosmicBackground } from './components/CosmicBackground';
import { ThemeProvider } from './context/ThemeContext';
import { SidebarProvider } from './context/SidebarContext';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageMode>('landing');
  const [user, setUser] = useState<{ name: string; role: string; email: string } | null>(null);
  const [activeFile, setActiveFile] = useState<File | null>(null);

  const handleImageUploaded = (file: File) => {
    setActiveFile(file);
    setCurrentPage('analysis');
  };

  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-transparent text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500 selection:text-black">
        {/* Persistent Environmental Cosmic Layer */}
        <CosmicBackground />

        {/* Main View Router */}
        <div className="flex-1 relative z-10">
          {currentPage === 'landing' && (
            <LandingPage onNavigate={setCurrentPage} />
          )}

          {currentPage === 'login' && (
            <AuthPage
              initialMode="login"
              onSuccess={(authenticatedUser) => {
                setUser(authenticatedUser);
                setCurrentPage('dashboard');
              }}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'signup' && (
            <AuthPage
              initialMode="signup"
              onSuccess={(authenticatedUser) => {
                setUser(authenticatedUser);
                setCurrentPage('dashboard');
              }}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'dashboard' && (
            <Dashboard
              currentPage={currentPage}
              onNavigate={setCurrentPage}
              onImageUploaded={handleImageUploaded}
            />
          )}

          {currentPage === 'analysis' && (
            <AnalysisPage
              currentPage={currentPage}
              onNavigate={setCurrentPage}
              preloadedFile={activeFile}
            />
          )}

          {currentPage === 'history' && (
            <HistoryPage
              currentPage={currentPage}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'reports' && (
            <ReportPage
              currentPage={currentPage}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'settings' && (
            <SettingsPage
              currentPage={currentPage}
              onNavigate={setCurrentPage}
            />
          )}
        </div>
      </div>
    </SidebarProvider>
  </ThemeProvider>
  );
}
