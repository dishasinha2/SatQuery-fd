import React, { useState } from 'react';
import { PageMode } from '../types';
import { Sidebar } from './Sidebar';
import { useTheme } from '../context/ThemeContext';
import { useSidebar } from '../context/SidebarContext';
import {
  FileText,
  Printer,
  Download,
  Moon,
  Sun,
  ArrowRight,
  ShieldCheck,
  Menu
} from 'lucide-react';

interface ReportPageProps {
  currentPage: PageMode;
  onNavigate: (page: PageMode) => void;
}

export const ReportPage: React.FC<ReportPageProps> = ({
  currentPage,
  onNavigate
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { openMobile } = useSidebar();
  const [reportFormat, setReportFormat] = useState<'PDF' | 'GeoJSON' | 'JSON'>('PDF');

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
                Reports
              </h1>
              <p
                className={`text-xs font-mono mt-0.5 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Mission intelligence reports and exports
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
          {/* Format selection cards */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                id: 'PDF' as const,
                title: 'PDF Intelligence Brief',
                desc: 'Printable executive summary with visual scene crops and grounding confidence.'
              },
              {
                id: 'GeoJSON' as const,
                title: 'GeoJSON Feature Layer',
                desc: 'Standardized spatial vector contours and bounding coordinates for GIS software.'
              },
              {
                id: 'JSON' as const,
                title: 'Execution Trace Audit',
                desc: 'Machine-readable log of pipeline stages, weights, and validation checks.'
              }
            ].map((fmt) => (
              <div
                key={fmt.id}
                onClick={() => setReportFormat(fmt.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all border backdrop-blur-xl ${
                  reportFormat === fmt.id
                    ? isDarkMode
                      ? 'bg-[#081223]/80 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'bg-white border-slate-900 shadow-sm'
                    : isDarkMode
                    ? 'bg-[#081223]/50 border-slate-700/35 hover:border-slate-600'
                    : 'bg-white/75 border-slate-200/80 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`font-bold text-xs font-mono ${
                      isDarkMode ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    {fmt.title}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      reportFormat === fmt.id
                        ? isDarkMode ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'bg-slate-900'
                        : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                    }`}
                  />
                </div>
                <p
                  className={`text-xs font-sans leading-relaxed ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {fmt.desc}
                </p>
              </div>
            ))}
          </section>

          {/* Empty State matching design language */}
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
              NO REPORT GENERATED YET
            </h3>

            <p
              className={`text-xs max-w-md leading-relaxed mb-6 font-mono ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Execute a multimodal query in the Analyze workstation to generate exportable
              evidence briefs and spatial vector layers.
            </p>

            <button
              onClick={() => onNavigate('analysis')}
              className={`px-5 py-2.5 rounded-full font-semibold text-xs tracking-wide font-mono border transition-all flex items-center gap-2 cursor-pointer ${
                isDarkMode
                  ? 'bg-slate-900 hover:bg-slate-850 text-cyan-300 border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-900 hover:bg-black text-white border-slate-900 shadow-sm'
              }`}
            >
              <span>Launch Analyze Workstation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </section>
        </main>
      </div>
    </div>
  );
};
