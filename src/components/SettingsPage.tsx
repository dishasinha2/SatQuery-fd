import React, { useState } from 'react';
import { PageMode } from '../types';
import { Sidebar } from './Sidebar';
import { useTheme } from '../context/ThemeContext';
import { useSidebar } from '../context/SidebarContext';
import {
  Sliders,
  Shield,
  Activity,
  Cpu,
  Moon,
  Sun,
  Save,
  Check,
  RefreshCw,
  Menu
} from 'lucide-react';

interface SettingsPageProps {
  currentPage: PageMode;
  onNavigate: (page: PageMode) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  currentPage,
  onNavigate
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { openMobile } = useSidebar();
  const [opticalWeight, setOpticalWeight] = useState(50);
  const [confidenceThreshold, setConfidenceThreshold] = useState(75);
  const [cloudMaskThreshold, setCloudMaskThreshold] = useState(20);
  const [isSaved, setIsSaved] = useState(false);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleCheckHealth = () => {
    setIsCheckingHealth(true);
    setTimeout(() => setIsCheckingHealth(false), 800);
  };

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
                Settings
              </h1>
              <p
                className={`text-xs font-mono mt-0.5 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                System configurations and model preferences
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
        <main className="flex-1 p-6 sm:p-8 max-w-5xl w-full mx-auto space-y-6">
          {/* Card 1: System Health */}
          <section
            className={`p-6 rounded-2xl border backdrop-blur-xl space-y-4 transition-all ${
              isDarkMode
                ? 'bg-[#081223]/55 border-slate-700/35 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                : 'bg-white/75 border-slate-200/80 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-500" />
                <h2
                  className={`text-xs font-mono font-bold uppercase tracking-wider ${
                    isDarkMode ? 'text-white' : 'text-slate-950'
                  }`}
                >
                  System Health & Connection
                </h2>
              </div>
              <button
                onClick={handleCheckHealth}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono cursor-pointer transition-colors border ${
                  isDarkMode
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                <RefreshCw className={`w-3 h-3 ${isCheckingHealth ? 'animate-spin' : ''}`} />
                <span>Re-check</span>
              </button>
            </div>

            <div
              className={`p-4 rounded-xl border space-y-2 transition-colors ${
                isDarkMode
                  ? 'bg-slate-950/60 border-slate-800/80'
                  : 'bg-slate-50/90 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>STATUS</span>
                <span className="flex items-center gap-1.5 text-amber-500 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>Health is not assumed (Frontend Standalone Mode)</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>ENVIRONMENT</span>
                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-800'}>
                  Client-Side High Performance WebGL &amp; Canvas
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>BACKEND CONNECTION</span>
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                  None required (Pure Frontend Execution)
                </span>
              </div>
            </div>
          </section>

          {/* Card 2: Multimodal Model Routing */}
          <section
            className={`p-6 rounded-2xl border backdrop-blur-xl space-y-5 transition-all ${
              isDarkMode
                ? 'bg-[#081223]/55 border-slate-700/35 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                : 'bg-white/75 border-slate-200/80 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2">
              <Cpu className={`w-4 h-4 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
              <h2
                className={`text-xs font-mono font-bold uppercase tracking-wider ${
                  isDarkMode ? 'text-white' : 'text-slate-950'
                }`}
              >
                Multimodal Vision Routing
              </h2>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <div
                  className={`flex justify-between mb-1.5 ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  <span>Cross-Modal Fusion Weight</span>
                  <span className={isDarkMode ? 'text-cyan-400' : 'text-cyan-700 font-semibold'}>
                    {opticalWeight}% Optical / {100 - opticalWeight}% SAR
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={opticalWeight}
                  onChange={(e) => setOpticalWeight(Number(e.target.value))}
                  className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-cyan-500 ${
                    isDarkMode ? 'bg-slate-800' : 'bg-slate-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div
                  className={`p-3.5 rounded-xl border ${
                    isDarkMode
                      ? 'bg-slate-950/60 border-slate-800/80'
                      : 'bg-slate-50/90 border-slate-200'
                  }`}
                >
                  <div className={`text-[11px] mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Optical Feature Backbone
                  </div>
                  <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    RemoteClip-SwinB / 16px Patch
                  </div>
                </div>
                <div
                  className={`p-3.5 rounded-xl border ${
                    isDarkMode
                      ? 'bg-slate-950/60 border-slate-800/80'
                      : 'bg-slate-50/90 border-slate-200'
                  }`}
                >
                  <div className={`text-[11px] mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    SAR Radar Backscatter Encoder
                  </div>
                  <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    C-Band Complex Polarization (VV+VH)
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Card 3: Abstention Policy & Grounding */}
          <section
            className={`p-6 rounded-2xl border backdrop-blur-xl space-y-5 transition-all ${
              isDarkMode
                ? 'bg-[#081223]/55 border-slate-700/35 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                : 'bg-white/75 border-slate-200/80 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield className={`w-4 h-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <h2
                className={`text-xs font-mono font-bold uppercase tracking-wider ${
                  isDarkMode ? 'text-white' : 'text-slate-950'
                }`}
              >
                Evidence Grounding &amp; Abstention Policy
              </h2>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <div
                  className={`flex justify-between mb-1.5 ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  <span>Epistemic Abstention Threshold</span>
                  <span className={isDarkMode ? 'text-cyan-400' : 'text-cyan-700 font-semibold'}>
                    {confidenceThreshold}%
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-cyan-500 ${
                    isDarkMode ? 'bg-slate-800' : 'bg-slate-200'
                  }`}
                />
                <p
                  className={`text-[11px] font-sans mt-1 ${
                    isDarkMode ? 'text-slate-500' : 'text-slate-500'
                  }`}
                >
                  Queries scoring below this threshold trigger an explicit &quot;Cannot Answer&quot; abstention.
                </p>
              </div>

              <div
                className={`flex items-center justify-between pt-4 border-t ${
                  isDarkMode ? 'border-slate-800/80' : 'border-slate-200'
                }`}
              >
                <div>
                  <div
                    className={`font-semibold ${
                      isDarkMode ? 'text-slate-200' : 'text-slate-900'
                    }`}
                  >
                    Cloud Masking Filter
                  </div>
                  <div
                    className={`text-[11px] font-sans ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Flag optical occlusions and fallback to SAR penetration automatically.
                  </div>
                </div>
                <button
                  onClick={() => setCloudMaskThreshold(cloudMaskThreshold > 0 ? 0 : 20)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                    cloudMaskThreshold > 0
                      ? isDarkMode ? 'bg-cyan-600' : 'bg-cyan-600'
                      : isDarkMode ? 'bg-slate-800' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      cloudMaskThreshold > 0 ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSave}
              className={`px-6 py-2.5 rounded-full font-mono font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                isDarkMode
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-900 hover:bg-black text-white shadow-md'
              }`}
            >
              {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{isSaved ? 'Preferences Saved' : 'Save Configurations'}</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};
