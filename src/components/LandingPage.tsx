import React, { useState } from 'react';
import { PageMode } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  Atom,
  ArrowRight,
  Moon,
  Sun,
  Shield,
  Layers,
  Radio,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: PageMode) => void;
  onSelectScenario?: (scenarioId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [showAboutModal, setShowAboutModal] = useState(false);

  return (
    <div className="min-h-screen bg-transparent text-slate-100 selection:bg-cyan-500 selection:text-black relative overflow-x-hidden flex flex-col justify-between">
      {/* ========================================================================= */}
      {/* FLOATING TOP CAPSULE NAVBAR (As seen in Reference Image 1)               */}
      {/* ========================================================================= */}
      <div className="w-full pt-4 px-4 fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <header
          className={`max-w-4xl mx-auto h-13 px-5 rounded-full backdrop-blur-xl border flex items-center justify-between pointer-events-auto transition-colors ${
            isDarkMode
              ? 'bg-[#081120]/80 border-slate-700/60 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
              : 'bg-white/85 border-slate-300/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)]'
          }`}
        >
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div
              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors ${
                isDarkMode
                  ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-400'
                  : 'bg-cyan-50 border-cyan-300 text-cyan-700'
              }`}
            >
              <Atom className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span
                className={`font-bold text-xs tracking-wider font-mono leading-none ${
                  isDarkMode ? 'text-white' : 'text-black'
                }`}
              >
                SATQUERY
              </span>
              <span
                className={`text-[10px] font-mono font-semibold tracking-wider -mt-0.5 ${
                  isDarkMode ? 'text-cyan-400' : 'text-cyan-700'
                }`}
              >
                AI
              </span>
            </div>
          </div>

          {/* Right Navigation & Actions */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs font-mono">
            <button
              onClick={() => setShowAboutModal(true)}
              className={`transition-colors cursor-pointer ${
                isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-black font-medium'
              }`}
            >
              About Us
            </button>

            {/* Dark / Light Toggle Switch */}
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

            <button
              onClick={() => onNavigate('login')}
              className={`transition-colors cursor-pointer ${
                isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-black font-medium'
              }`}
            >
              Login
            </button>

            <button
              onClick={() => onNavigate('signup')}
              className={`px-4 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                isDarkMode
                  ? 'border border-slate-600 hover:border-cyan-400 bg-slate-900/60 hover:bg-slate-800 text-white'
                  : 'border border-slate-900 bg-slate-900 hover:bg-black text-white shadow-xs'
              }`}
            >
              Sign Up
            </button>
          </div>
        </header>
      </div>

      {/* ========================================================================= */}
      {/* HERO SECTION (Matches Reference Image 1)                                  */}
      {/* ========================================================================= */}
      <main className="relative min-h-screen w-full flex flex-col justify-center px-6 sm:px-12 lg:px-20 pt-20 pb-16 overflow-hidden">
        {/* Hero Content aligned to the left */}
        <div className="relative z-20 max-w-3xl">
          {/* Small tracked uppercase label */}
          <div
            className={`text-xs sm:text-sm font-mono tracking-widest uppercase font-semibold mb-3 ${
              isDarkMode ? 'text-cyan-400' : 'text-cyan-800'
            }`}
          >
            EARTH OBSERVATION INTELLIGENCE
          </div>

          {/* Heading: SATQUERY AI (Black in light mode, white/cyan in dark mode) */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-6 font-sans">
            <span className={`block transition-colors ${isDarkMode ? 'text-white' : 'text-black'}`}>
              SATQUERY
            </span>
            <span className={`block mt-1 transition-colors ${isDarkMode ? 'text-cyan-400' : 'text-black'}`}>
              AI
            </span>
          </h1>

          {/* Subtitle verbatim from reference */}
          <p
            className={`text-base sm:text-lg font-normal max-w-xl leading-relaxed mb-9 transition-colors ${
              isDarkMode ? 'text-slate-300' : 'text-slate-800'
            }`}
          >
            An Interactive Vision-Language Assistant for Multimodal Remote Sensing Image Analysis through Text Queries.
          </p>

          {/* Action Buttons matching reference */}
          <div className="flex flex-wrap items-center gap-5">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-6 py-3 rounded-full font-medium text-xs sm:text-sm tracking-wider font-mono border transition-all flex items-center gap-2 hover:scale-105 cursor-pointer ${
                isDarkMode
                  ? 'bg-slate-950/80 hover:bg-slate-900 text-white border-cyan-500/50 hover:border-cyan-400 shadow-[0_0_24px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-900 hover:bg-black text-white border-slate-900 shadow-[0_6px_20px_rgba(0,0,0,0.15)]'
              }`}
            >
              <span>ENTER COMMAND CENTER</span>
              <ArrowRight className={`w-4 h-4 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-300'}`} />
            </button>

            <button
              onClick={() => setShowAboutModal(true)}
              className={`text-xs sm:text-sm font-mono uppercase tracking-wider underline underline-offset-8 transition-colors cursor-pointer ${
                isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-800 hover:text-black font-semibold'
              }`}
            >
              LEARN MORE
            </button>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* CLEAN OVERVIEW FOOTER SECTION                                             */}
      {/* ========================================================================= */}
      <footer
        className={`relative z-20 w-full border-t backdrop-blur-md py-6 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between text-xs font-mono gap-4 transition-colors ${
          isDarkMode
            ? 'border-slate-800/60 bg-slate-950/60 text-slate-400'
            : 'border-slate-200 bg-white/80 text-slate-600 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-2">
          <Atom className={`w-4 h-4 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-700'}`} />
          <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>SatQuery AI</span>
          <span>&bull; Multimodal Remote Sensing Intelligence</span>
        </div>

        <div className="flex items-center gap-5">
          {['dashboard', 'analysis', 'history', 'reports', 'settings'].map((pg) => (
            <button
              key={pg}
              onClick={() => onNavigate(pg as PageMode)}
              className={`transition-colors cursor-pointer capitalize ${
                isDarkMode ? 'hover:text-cyan-400 text-slate-400' : 'hover:text-cyan-700 text-slate-700 font-medium'
              }`}
            >
              {pg === 'dashboard' ? 'Command Center' : pg === 'analysis' ? 'Analyze' : pg}
            </button>
          ))}
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* ABOUT MODAL (Clean Info Briefing)                                         */}
      {/* ========================================================================= */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div
            className={`relative w-full max-w-xl rounded-2xl border p-6 sm:p-8 shadow-2xl font-mono text-xs transition-colors ${
              isDarkMode
                ? 'bg-slate-900 border-slate-700/80 text-slate-200'
                : 'bg-white/95 border-slate-300 text-slate-900 shadow-2xl'
            }`}
          >
            <div className={`flex items-center justify-between border-b pb-4 mb-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2">
                <Atom className={`w-5 h-5 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-700'}`} />
                <span className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  About SatQuery AI
                </span>
              </div>
              <button
                onClick={() => setShowAboutModal(false)}
                className={`px-2 py-1 rounded cursor-pointer ${
                  isDarkMode ? 'text-slate-400 hover:text-white bg-slate-800' : 'text-slate-600 hover:text-black bg-slate-100'
                }`}
              >
                ✕
              </button>
            </div>

            <p className={`font-sans text-sm leading-relaxed mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              SatQuery AI is an interactive vision-language workstation specifically engineered
              for multimodal remote sensing analysis. It bridges natural language queries with
              optical multi-spectral imagery and synthetic aperture radar (SAR) backscatter.
            </p>

            <div className="space-y-2.5 my-4">
              <div
                className={`p-3 rounded-lg border flex items-start gap-2.5 ${
                  isDarkMode
                    ? 'bg-slate-950/60 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <Layers className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-700'}`} />
                <div>
                  <div className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Multimodal Fusion
                  </div>
                  <div className={`text-[11px] font-sans ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Single Image, Bi-Temporal Change Detection, and Optical-SAR Cross Attention.
                  </div>
                </div>
              </div>

              <div
                className={`p-3 rounded-lg border flex items-start gap-2.5 ${
                  isDarkMode
                    ? 'bg-slate-950/60 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <Radio className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <div>
                  <div className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Grounded Evidence
                  </div>
                  <div className={`text-[11px] font-sans ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Every answer is tethered to spatial evidence and confidence verification.
                  </div>
                </div>
              </div>
            </div>

            <div className={`pt-4 border-t flex justify-end gap-3 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <button
                onClick={() => setShowAboutModal(false)}
                className={`px-4 py-2 rounded-lg cursor-pointer ${
                  isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowAboutModal(false);
                  onNavigate('dashboard');
                }}
                className={`px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer ${
                  isDarkMode ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : 'bg-slate-900 hover:bg-black text-white'
                }`}
              >
                <span>Go to Command Center</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
