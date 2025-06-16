import { useState, useEffect } from 'react';
import { isModeFixed } from '../index';

const THEME_MODE_KEY = 'ui8kit-theme-mode';

export function useThemeMode() {
  const [mode, setMode] = useState<'utility' | 'semantic'>('utility');
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    // Check if the mode is fixed
    const fixed = isModeFixed();
    setIsFixed(fixed);
    
    if (fixed) {
      // If the mode is fixed, read from the environment variable
      const fixedMode = import.meta.env.VITE_UI8KIT_MODE as 'utility' | 'semantic';
      if (fixedMode) {
        setMode(fixedMode);
      }
      return;
    }

    // Normal logic for unfixed mode
    const savedMode = localStorage.getItem(THEME_MODE_KEY) as 'utility' | 'semantic';
    
    if (savedMode && (savedMode === 'utility' || savedMode === 'semantic')) {
      setMode(savedMode);
    } else {
      setMode('utility');
      localStorage.setItem(THEME_MODE_KEY, 'utility');
    }
  }, []);

  const switchMode = (newMode: 'utility' | 'semantic') => {
    if (isFixed) {
      console.warn('Theme mode is fixed and cannot be changed');
      return;
    }
    
    setMode(newMode);
    localStorage.setItem(THEME_MODE_KEY, newMode);
    
    // Notify the ui8kit system about the change
    window.dispatchEvent(new CustomEvent('themeMode', { detail: newMode }));
  };

  const toggleMode = () => {
    if (isFixed) {
      console.warn('Theme mode is fixed and cannot be changed');
      return;
    }
    
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

  return { 
    mode, 
    toggleMode, 
    switchMode, 
    isFixed // Return information about whether the mode is fixed
  };
}
