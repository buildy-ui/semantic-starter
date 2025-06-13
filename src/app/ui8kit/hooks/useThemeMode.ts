import { useState, useEffect } from 'react';

export function useThemeMode() {
  const [mode, setMode] = useState<'utility' | 'semantic'>('utility');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlMode = params.get('ui8kit') as 'utility' | 'semantic' || 'utility';
    setMode(urlMode);
  }, []);

  const switchMode = (newMode: 'utility' | 'semantic') => {
    const url = new URL(window.location.href);
    url.searchParams.set('ui8kit', newMode);
    
    // Reload the page with the new parameter
    window.location.href = url.toString();
  };

  const toggleMode = () => {
    const newMode = mode === 'utility' ? 'semantic' : 'utility';
    switchMode(newMode);
  };

  return { mode, toggleMode, switchMode };
}
