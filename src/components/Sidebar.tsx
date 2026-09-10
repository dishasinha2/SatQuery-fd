import React from 'react';
import { PageMode } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useSidebar } from '../context/SidebarContext';
import {
  Monitor,
  CheckSquare,
  History,
  FileText,
  Settings,
  Atom,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

interface SidebarProps {
  currentPage: PageMode;
  onNavigate: (page: PageMode) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const { isDarkMode } = useTheme();
  const { isCollapsed, toggleCollapsed, isMobileOpen, closeMobile } = useSidebar();

  const navItems = [
    {
      id: 'dashboard' as PageMode,
      label: 'Command Center',
      tooltip: 'Dashboard',
      icon: Monitor
    },
    {
      id: 'analysis' as PageMode,
      label: 'Analyze',
      tooltip: 'Analyze',
      icon: CheckSquare
    },
    {
      id: 'history' as PageMode,
      label: 'History',
      tooltip: 'History',
      icon: History
    },
    {
      id: 'reports' as PageMode,
      label: 'Reports',
      tooltip: 'Reports',
      icon: FileText
    }
  ];

  const handleNavClick = (page: PageMode) => {
    onNavigate(page);
    closeMobile();
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden transition-opacity duration-200 cursor-pointer"
          aria-label="Close navigation backdrop"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 md:z-30 flex flex-col justify-between h-full select-none flex-shrink-0 transition-[width,transform] duration-300 ease-in-out backdrop-blur-xl ${
          // Mobile open/close transform
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${
          // Desktop expanded vs collapsed width
          isCollapsed ? 'md:w-[72px]' : 'md:w-[260px]'
        } w-[260px] ${
          // Translucent Glass Surfaces
          isDarkMode
            ? 'bg-[#081223]/60 border-r border-slate-700/35 text-slate-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),4px_0_24px_rgba(0,0,0,0.3)]'
            : 'bg-white/75 border-r border-slate-200/80 text-slate-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),4px_0_20px_rgba(0,0,0,0.04)]'
        }`}
      >
        <div className="p-3 sm:p-3.5 flex flex-col h-full">
          {/* Top Header: Brand Logo + Collapse Toggle */}
          <div className="flex items-center justify-between gap-2 mb-5 pb-2">
            <button
              onClick={() => handleNavClick('landing')}
              className={`flex items-center gap-2.5 text-left group focus:outline-hidden cursor-pointer min-w-0 transition-opacity ${
                isCollapsed ? 'md:justify-center md:w-full' : ''
              }`}
              title="Return to SatQuery AI Landing"
            >
              <div
                className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all flex-shrink-0 ${
                  isDarkMode
                    ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-400 group-hover:border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : 'bg-cyan-50 border-cyan-300 text-cyan-700 group-hover:border-cyan-500 shadow-xs'
                }`}
              >
                <Atom className="w-5 h-5" />
              </div>
              <div className={`overflow-hidden transition-all duration-200 ${isCollapsed ? 'md:hidden' : 'block'}`}>
                <div
                  className={`font-bold text-xs tracking-wider font-mono leading-none truncate ${
                    isDarkMode ? 'text-white' : 'text-black'
                  }`}
                >
                  SATQUERY
                </div>
                <div
                  className={`text-[10px] font-mono font-semibold tracking-wider mt-0.5 ${
                    isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
                  }`}
                >
                  AI
                </div>
              </div>
            </button>

            {/* Desktop Collapse / Expand Toggle Button */}
            <div className="hidden md:flex items-center">
              <button
                onClick={toggleCollapsed}
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50 ${
                  isDarkMode
                    ? 'bg-slate-900/50 border-slate-700/60 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-black hover:border-slate-300 hover:bg-slate-100 shadow-xs'
                }`}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                ) : (
                  <ChevronLeft className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Mobile Close Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={closeMobile}
                aria-label="Close navigation"
                title="Close navigation"
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isDarkMode
                    ? 'bg-slate-900/50 border-slate-700/60 text-slate-400 hover:text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-black'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5 flex-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => handleNavClick(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full flex items-center rounded-xl text-xs font-medium transition-all text-left cursor-pointer relative ${
                      isCollapsed ? 'md:justify-center md:px-0 md:h-10' : 'px-3 py-2.5'
                    } ${
                      isActive
                        ? isDarkMode
                          ? 'bg-slate-800/70 border border-slate-600/60 text-white shadow-xs'
                          : 'bg-white/90 border border-slate-300 text-slate-950 font-semibold shadow-xs'
                        : isDarkMode
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent'
                        : 'text-slate-700 hover:text-slate-950 hover:bg-white/60 border border-transparent'
                    }`}
                  >
                    {/* Visual active indicator notch (not relying on color alone) */}
                    {isActive && (
                      <span
                        className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-md transition-all ${
                          isCollapsed ? 'md:h-6 md:w-1.25' : 'h-5'
                        } ${
                          isDarkMode
                            ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                            : 'bg-cyan-600 shadow-xs'
                        }`}
                      />
                    )}

                    <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? isDarkMode
                              ? 'text-cyan-400 font-bold'
                              : 'text-cyan-700 font-bold'
                            : isDarkMode
                            ? 'text-slate-400 group-hover:text-slate-200'
                            : 'text-slate-500 group-hover:text-slate-900'
                        }`}
                      />
                    </div>

                    <span
                      className={`ml-2.5 truncate font-sans ${
                        isCollapsed ? 'md:hidden' : 'block'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>

                  {/* Accessible Hover Tooltip when Collapsed */}
                  {isCollapsed && (
                    <div
                      role="tooltip"
                      className={`hidden md:block absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 z-50 shadow-xl border ${
                        isDarkMode
                          ? 'bg-[#081223] border-cyan-500/40 text-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.6)]'
                          : 'bg-white border-slate-300 text-slate-900 shadow-md'
                      }`}
                    >
                      {item.tooltip}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Divider */}
            <div className="pt-2 pb-1">
              <div
                className={`border-t ${
                  isDarkMode ? 'border-slate-800/80' : 'border-slate-200'
                }`}
              />
            </div>

            {/* Settings Link */}
            <div className="relative group">
              <button
                onClick={() => handleNavClick('settings')}
                aria-current={currentPage === 'settings' ? 'page' : undefined}
                className={`w-full flex items-center rounded-xl text-xs font-medium transition-all text-left cursor-pointer relative ${
                  isCollapsed ? 'md:justify-center md:px-0 md:h-10' : 'px-3 py-2.5'
                } ${
                  currentPage === 'settings'
                    ? isDarkMode
                      ? 'bg-slate-800/70 border border-slate-600/60 text-white shadow-xs'
                      : 'bg-white/90 border border-slate-300 text-slate-950 font-semibold shadow-xs'
                    : isDarkMode
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-white/60 border border-transparent'
                }`}
              >
                {currentPage === 'settings' && (
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-md transition-all ${
                      isCollapsed ? 'md:h-6 md:w-1.25' : 'h-5'
                    } ${
                      isDarkMode
                        ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                        : 'bg-cyan-600 shadow-xs'
                    }`}
                  />
                )}

                <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
                  <Settings
                    className={`w-4 h-4 transition-colors ${
                      currentPage === 'settings'
                        ? isDarkMode
                          ? 'text-cyan-400 font-bold'
                          : 'text-cyan-700 font-bold'
                        : isDarkMode
                        ? 'text-slate-400 group-hover:text-slate-200'
                        : 'text-slate-500 group-hover:text-slate-900'
                    }`}
                  />
                </div>

                <span
                  className={`ml-2.5 truncate font-sans ${
                    isCollapsed ? 'md:hidden' : 'block'
                  }`}
                >
                  Settings
                </span>
              </button>

              {/* Tooltip for Settings */}
              {isCollapsed && (
                <div
                  role="tooltip"
                  className={`hidden md:block absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 z-50 shadow-xl border ${
                    isDarkMode
                      ? 'bg-[#081223] border-cyan-500/40 text-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.6)]'
                      : 'bg-white border-slate-300 text-slate-900 shadow-md'
                  }`}
                >
                  Settings
                </div>
              )}
            </div>
          </nav>

          {/* Bottom Status Card */}
          <div className="relative group mt-auto pt-2">
            <div
              className={`border rounded-xl backdrop-blur-sm transition-all ${
                isCollapsed
                  ? 'md:p-2 md:flex md:items-center md:justify-center'
                  : 'p-3'
              } ${
                isDarkMode
                  ? 'bg-slate-900/50 border-slate-700/60'
                  : 'bg-white/80 border-slate-200 shadow-xs'
              }`}
            >
              <button
                onClick={() => handleNavClick('settings')}
                className={`flex items-start gap-2 text-left w-full cursor-pointer focus:outline-hidden ${
                  isCollapsed ? 'md:justify-center' : ''
                }`}
                title="System Status (view in Settings)"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1 flex-shrink-0 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                <div className={`${isCollapsed ? 'md:hidden' : 'block'} min-w-0`}>
                  <div
                    className={`text-[11px] font-semibold leading-tight truncate ${
                      isDarkMode ? 'text-slate-100' : 'text-slate-900'
                    }`}
                  >
                    Status in Settings
                  </div>
                  <div
                    className={`text-[10px] leading-tight mt-0.5 truncate ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Health is not assumed
                  </div>
                </div>
              </button>
            </div>

            {/* Tooltip for Status when Collapsed */}
            {isCollapsed && (
              <div
                role="tooltip"
                className={`hidden md:block absolute left-full ml-3 bottom-2 px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 z-50 shadow-xl border ${
                  isDarkMode
                    ? 'bg-[#081223] border-cyan-500/40 text-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.6)]'
                    : 'bg-white border-slate-300 text-slate-900 shadow-md'
                }`}
              >
                Status available in Settings
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
