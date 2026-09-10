import React from 'react';
import { PageMode } from '../types';
import {
  Satellite,
  Layers,
  Activity,
  History,
  FileText,
  Sliders,
  Compass,
  User,
  Sparkles,
  BarChart2,
  LogIn,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageMode;
  onNavigate: (page: PageMode) => void;
  user: { name: string; role: string; email: string } | null;
  onLogout: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  user,
  onLogout,
  onOpenAuth
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#070b14]/90 backdrop-blur-md border-b border-cyan-950/40 text-white">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform">
              <Satellite className="w-5 h-5 text-white animate-spin-slow" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-wider text-base bg-gradient-to-r from-cyan-400 via-teal-200 to-white bg-clip-text text-transparent font-mono">
                  SatQuery AI
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 font-mono border border-cyan-800/40">
                  SIH 2026
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block font-mono -mt-0.5">
                Optical & SAR Multi-Modal Earth AI
              </p>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onNavigate('landing')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentPage === 'landing'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentPage === 'dashboard'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('analysis')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentPage === 'analysis'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-fuchsia-400" />
              Optical-SAR Analysis
            </button>
            <button
              onClick={() => onNavigate('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentPage === 'history'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <History className="w-3.5 h-3.5 text-amber-400" />
              History
            </button>
            <button
              onClick={() => onNavigate('reports')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentPage === 'reports'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              Reports
            </button>
            <button
              onClick={() => onNavigate('benchmark')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentPage === 'benchmark'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5 text-blue-400" />
              Benchmark
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentPage === 'settings'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              Settings
            </button>
          </nav>
        </div>

        {/* Right Section Actions & User */}
        <div className="flex items-center gap-3">
          {/* 3D Space Quick Trigger Button */}
          <button
            onClick={() => onNavigate('space3d')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium transition-all border ${
              currentPage === 'space3d'
                ? 'bg-gradient-to-r from-fuchsia-600 to-amber-600 text-white border-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.5)]'
                : 'bg-black/50 text-cyan-300 border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-950/40'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">3D Space Lab</span>
            <span className="text-[10px] px-1 py-0.2 bg-fuchsia-500/20 text-fuchsia-300 rounded border border-fuchsia-500/30">
              WebGL
            </span>
          </button>

          {/* Quick Launch Dashboard CTA */}
          {currentPage !== 'dashboard' && (
            <button
              onClick={() => onNavigate('dashboard')}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Studio</span>
            </button>
          )}

          {/* User Auth Info or Login Trigger */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-xs font-bold text-cyan-300 font-mono">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden xl:block text-left text-xs font-mono">
                <div className="text-slate-200 font-semibold leading-tight">{user.name}</div>
                <div className="text-[10px] text-cyan-400/80 leading-tight">{user.role}</div>
              </div>
              <button
                onClick={onLogout}
                title="Sign out"
                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <button
                onClick={() => onOpenAuth('login')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs text-slate-200 hover:text-white hover:bg-slate-800 transition-colors font-medium"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/50 transition-colors"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
