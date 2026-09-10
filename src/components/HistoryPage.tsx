import React, { useState } from 'react';
import { PageMode } from '../types';
import { Sidebar } from './Sidebar';
import { useTheme } from '../context/ThemeContext';
import { useSidebar } from '../context/SidebarContext';
import {
  History as HistoryIcon,
  Search,
  Download,
  Moon,
  Sun,
  ArrowRight,
  Menu
} from 'lucide-react';

interface HistoryPageProps {
  currentPage: PageMode;
  onNavigate: (page: PageMode) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  currentPage,
  onNavigate
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { openMobile } = useSidebar();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  return (
    <div
      className={`h-screen w-full flex bg-transparent overflow-hidden select-none font-sans transition-colors ${
        isDarkMode ? 'text-slate-100' : 'text-slate-900'
      }`}
    >
      {/* Persistent Left Sidebar */}
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto bg-transparent">
        {/* Top Header */}
        <header
          className={`h-16 px-4 sm:px-8 border-b flex items-center justify-between flex-shrink-0 backdrop-blur-xl transition-colors ${
            isDarkMode
              ? 'border-slate-700/35 bg-[#081223]/55 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)]'
              : 'border-slate-200/80 bg-white/75 text-slate-950 shadow-xs'
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={openMobile}
              className={`md:hidden p-2 rounded-xl border transition-colors cursor-pointer ${
                isDarkMode
                  ? 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:text-black shadow-xs'
              }`}
              aria-label="Open navigation menu"
              title="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1
                className={`text-xl sm:text-2xl font-bold tracking-tight leading-tight ${
                  isDarkMode ? 'text-white' : 'text-slate-950'
                }`}
              >
                History
              </h1>
              <p
                className={`text-xs font-mono mt-0.5 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Query and analysis history audit log
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`w-11 h-6 rounded-full border p-0.5 flex items-center transition-colors relative cursor-pointer ${
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'
              }`}
              title="Toggle Theme"
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform ${
                  isDarkMode
                    ? 'translate-x-5 text-cyan-400 bg-slate-900 border border-slate-600'
                    : 'translate-x-0 text-amber-500 bg-white border border-slate-300 shadow-xs'
                }`}
              >
                {isDarkMode ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
              </div>
            </button>
          </div>
        </header>

        {/* Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Controls Bar */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border backdrop-blur-xl transition-all ${
              isDarkMode
                ? 'bg-[#081223]/55 border-slate-700/35 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                : 'bg-white/75 border-slate-200/80 shadow-xs'
            }`}
          >
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className={`w-4 h-4 absolute left-3 top-2.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search queries or run IDs..."
                className={`w-full rounded-lg pl-9 pr-3 py-1.5 text-xs font-mono focus:outline-none transition-colors ${
                  isDarkMode
                    ? 'bg-slate-950/70 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400'
                    : 'bg-white border border-slate-300 text-slate-950 placeholder-slate-400 focus:border-cyan-600 shadow-inner'
                }`}
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 font-mono text-xs overflow-x-auto w-full sm:w-auto">
              {['ALL', 'Single Image', 'Bi-Temporal', 'Optical-SAR'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                    selectedFilter === filter
                      ? isDarkMode
                        ? 'bg-slate-800 border border-slate-700 text-white font-semibold'
                        : 'bg-slate-900 text-white font-semibold shadow-xs'
                      : isDarkMode
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-black hover:bg-slate-100'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                alert('No recorded logs to export yet.');
              }}
              className={`px-3.5 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 cursor-pointer flex-shrink-0 transition-colors ${
                isDarkMode
                  ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                  : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-black border-slate-300 shadow-xs'
              }`}
            >
              <Download className={`w-3.5 h-3.5 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
              <span>Export Audit</span>
            </button>
          </div>

          {/* History Empty State matching visual design language */}
          <section
            className={`p-12 rounded-2xl border backdrop-blur-xl flex flex-col items-center justify-center text-center min-h-[360px] transition-all ${
              isDarkMode
                ? 'bg-[#081223]/50 border-slate-700/35 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.35)]'
                : 'bg-white/75 border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.05)]'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full border flex items-center justify-center mb-4 ${
                isDarkMode
                  ? 'border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                  : 'border-cyan-300 bg-cyan-50/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  isDarkMode
                    ? 'bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.9)] animate-pulse'
                    : 'bg-cyan-600 animate-pulse'
                }`}
              />
            </div>

            <h3
              className={`text-base font-bold tracking-wide font-mono mb-2 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              NO RECORDED ANALYSES YET
            </h3>

            <p
              className={`text-xs max-w-md leading-relaxed mb-6 font-mono ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Completed vision-language queries initiated from the Command Center and Analyze
              workstation will appear here with timestamped reasoning paths.
            </p>

            <button
              onClick={() => onNavigate('analysis')}
              className={`px-5 py-2.5 rounded-full font-semibold text-xs tracking-wide font-mono border transition-all flex items-center gap-2 cursor-pointer ${
                isDarkMode
                  ? 'bg-slate-900 hover:bg-slate-850 text-cyan-300 border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-900 hover:bg-black text-white border-slate-900 shadow-sm'
              }`}
            >
              <span>Go to Analyze</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </section>
        </main>
      </div>
    </div>
  );
};
