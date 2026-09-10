import React, { createContext, useContext, useState, useEffect } from 'react';

interface SidebarContextType {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
  setIsCollapsed: (val: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  openMobile: () => void;
  closeMobile: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  toggleCollapsed: () => {},
  setIsCollapsed: () => {},
  isMobileOpen: false,
  setIsMobileOpen: () => {},
  openMobile: () => {},
  closeMobile: () => {}
});

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('satquery_sidebar_collapsed');
        if (saved !== null) {
          return saved === 'true';
        }
      } catch {
        // Ignore storage access errors
      }
    }
    return false;
  });

  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // Sync collapse state with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('satquery_sidebar_collapsed', String(isCollapsed));
    } catch {
      // Ignore storage errors
    }
  }, [isCollapsed]);

  // Escape key closes mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen]);

  const toggleCollapsed = () => setIsCollapsed((prev) => !prev);
  const openMobile = () => setIsMobileOpen(true);
  const closeMobile = () => setIsMobileOpen(false);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        toggleCollapsed,
        setIsCollapsed,
        isMobileOpen,
        setIsMobileOpen,
        openMobile,
        closeMobile
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
