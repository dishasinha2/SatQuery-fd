import React, { useRef } from 'react';
import { PageMode } from '../types';
import { Sidebar } from './Sidebar';
import { useTheme } from '../context/ThemeContext';
import { useSidebar } from '../context/SidebarContext';
import {
  Upload,
  ArrowRight,
  Activity,
  Moon,
  Sun,
  Menu
} from 'lucide-react';

interface DashboardProps {
  currentPage: PageMode;
  onNavigate: (page: PageMode) => void;
  onImageUploaded?: (file: File) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentPage,
  onNavigate,
  onImageUploaded
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { openMobile } = useSidebar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (onImageUploaded) {
        onImageUploaded(e.target.files[0]);
      }
      onNavigate('analysis');
    }
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
        {/* Top Header matching Reference Image 2 */}
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
                Command Center
              </h1>
              <p
                className={`text-xs font-mono mt-0.5 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Your SatQuery AI workspace
              </p>
            </div>
          </div>

          {/* Theme Toggle Pill on the right */}
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

        {/* Workspace Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Card 1: ANALYSIS WORKSPACE (Matches Reference Image 2) */}
          <section
            className={`relative p-6 sm:p-8 rounded-2xl border backdrop-blur-xl overflow-hidden transition-all ${
              isDarkMode
                ? 'bg-[#081223]/55 border-slate-700/35 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_8px_32px_rgba(0,0,0,0.35)]'
                : 'bg-white/75 border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]'
            }`}
          >
            {/* Faint watermark graphic */}
            <div
              className={`absolute top-1/2 right-12 -translate-y-1/2 w-64 h-64 rounded-full border pointer-events-none opacity-20 ${
                isDarkMode ? 'border-slate-800/40' : 'border-slate-300'
              }`}
            />
            <div
              className={`absolute top-1/2 right-16 -translate-y-1/2 w-48 h-48 rounded-full border border-dashed pointer-events-none opacity-20 ${
                isDarkMode ? 'border-cyan-500/20' : 'border-cyan-700/30'
              }`}
            />

            <div className="relative z-10 max-w-2xl">
              {/* Cyan Tracked Label */}
              <div
                className={`text-[11px] font-mono tracking-widest uppercase font-semibold mb-3 ${
                  isDarkMode ? 'text-cyan-400' : 'text-cyan-700'
                }`}
              >
                ANALYSIS WORKSPACE
              </div>

              {/* Bold Title */}
              <h2
                className={`text-2xl sm:text-3xl font-bold tracking-tight mb-3 ${
                  isDarkMode ? 'text-white' : 'text-slate-950'
                }`}
              >
                Ask a question of your imagery.
              </h2>

              {/* Description Paragraph verbatim from reference */}
              <p
                className={`text-sm leading-relaxed mb-6 font-normal ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Upload remote sensing imagery and query it in plain language — SatQuery AI routes
                the question to the right vision model and returns a grounded, evidence-backed answer.
              </p>

              {/* Action Buttons matching reference */}
              <div className="flex flex-wrap items-center gap-3.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".tif,.tiff,.geotiff,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`px-5 py-2.5 rounded-full font-semibold text-xs tracking-wide font-mono border transition-all flex items-center gap-2 cursor-pointer ${
                    isDarkMode
                      ? 'bg-slate-900/80 hover:bg-slate-850 text-cyan-300 border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-900 hover:bg-black text-white border-slate-900 shadow-sm'
                  }`}
                >
                  <Upload className={`w-3.5 h-3.5 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-300'}`} />
                  <span>UPLOAD IMAGERY</span>
                </button>

                <button
                  onClick={() => onNavigate('analysis')}
                  className={`px-4 py-2.5 rounded-full font-medium text-xs font-mono border transition-all flex items-center gap-1.5 cursor-pointer ${
                    isDarkMode
                      ? 'bg-slate-900/40 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700 hover:border-slate-600'
                      : 'bg-white hover:bg-slate-100 text-slate-800 hover:text-black border-slate-300 shadow-xs'
                  }`}
                >
                  <span>Go to Analyze</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>

          {/* 2-Column Cards Grid matching Reference Image 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 2: RECENT ANALYSIS */}
            <section
              className={`p-6 sm:p-7 rounded-2xl border backdrop-blur-xl flex flex-col justify-between min-h-[260px] transition-all ${
                isDarkMode
                  ? 'bg-[#081223]/50 border-slate-700/35 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.3)]'
                  : 'bg-white/75 border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)]'
              }`}
            >
              <div
                className={`text-[11px] font-mono tracking-wider uppercase font-semibold ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                RECENT ANALYSIS
              </div>

              {/* Empty State Centered with Glowing Blue Ring & Dot */}
              <div className="my-auto py-6 flex flex-col items-center justify-center text-center">
                {/* Glowing blue dot inside circular ring matching screenshot */}
                <div
                  className={`w-10 h-10 rounded-full border flex items-center justify-center mb-4 ${
                    isDarkMode
                      ? 'border-cyan-500/30 shadow-[0_0_16px_rgba(6,182,212,0.25)]'
                      : 'border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)] bg-cyan-50/50'
                  }`}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      isDarkMode
                        ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.9)] animate-pulse'
                        : 'bg-cyan-600 animate-pulse'
                    }`}
                  />
                </div>

                <h3
                  className={`text-sm font-bold tracking-wide font-mono mb-1.5 ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  NO ANALYSES YET
                </h3>

                <p
                  className={`text-xs max-w-xs leading-relaxed ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  Start by uploading remote sensing imagery and asking a natural-language question.
                </p>
              </div>

              <div />
            </section>

            {/* Card 3: SYSTEM */}
            <section
              className={`p-6 sm:p-7 rounded-2xl border backdrop-blur-xl flex flex-col justify-between min-h-[260px] transition-all ${
                isDarkMode
                  ? 'bg-[#081223]/50 border-slate-700/35 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.3)]'
                  : 'bg-white/75 border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`text-[11px] font-mono tracking-wider uppercase font-semibold ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  SYSTEM
                </div>
                {/* Checking badge */}
                <div
                  className={`px-2.5 py-0.5 rounded text-[10px] font-mono border ${
                    isDarkMode
                      ? 'text-slate-400 bg-slate-800/40 border-slate-700/60'
                      : 'text-slate-600 bg-slate-100 border-slate-300'
                  }`}
                >
                  Checking
                </div>
              </div>

              {/* Heartbeat / Pulse waveform icon & Status */}
              <div className="my-auto py-6 flex flex-col items-center justify-center text-center">
                <div
                  className={`w-10 h-10 flex items-center justify-center mb-3 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  <Activity className="w-7 h-7" />
                </div>

                <h3
                  className={`text-sm font-bold tracking-wide font-mono mb-1.5 ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  SYSTEM STATUS
                </h3>

                <p
                  className={`text-xs max-w-xs leading-relaxed ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Live system health will appear here when provided by the backend.
                </p>
              </div>

              <div />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};
