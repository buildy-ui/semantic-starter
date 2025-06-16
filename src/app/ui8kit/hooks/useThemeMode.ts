import { useState, useEffect } from 'react';

const THEME_MODE_KEY = 'ui8kit-theme-mode';

export function useThemeMode() {
  const [mode, setMode] = useState<'utility' | 'semantic'>('utility');

  useEffect(() => {
    // Read from localStorage on initialization
    const savedMode = localStorage.getItem(THEME_MODE_KEY) as 'utility' | 'semantic';
    
    if (savedMode && (savedMode === 'utility' || savedMode === 'semantic')) {
      setMode(savedMode);
    } else {
      setMode('utility');
      localStorage.setItem(THEME_MODE_KEY, 'utility');
    }
  }, []);

  const switchMode = (newMode: 'utility' | 'semantic') => {
    setMode(newMode);
    localStorage.setItem(THEME_MODE_KEY, newMode);
    
    // Notify the ui8kit system about the change
    window.dispatchEvent(new CustomEvent('themeMode', { detail: newMode }));
  };

  const toggleMode = () => {
    const newMode = mode === 'utility' ? 'semantic' : 'utility';
    switchMode(newMode);
  };

  // Synchronization between tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === THEME_MODE_KEY && e.newValue) {
        const newMode = e.newValue as 'utility' | 'semantic';
        if (newMode === 'utility' || newMode === 'semantic') {
          setMode(newMode);
          window.dispatchEvent(new CustomEvent('themeMode', { detail: newMode }));
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { mode, toggleMode, switchMode };
}
