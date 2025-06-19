import { Button } from '@ui8kit/ui/button';
import { useEffect, useState } from 'react';

export function DarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Initialize theme on mount
    const dark = localStorage.getItem('darkmode') === 'dark' ||
      (!('darkmode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggleDarkMode = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('darkmode', next ? 'dark' : 'light');
  };

  return (
    <Button
      id="darkmode"
      variant="ghost"
      className={`!px-3 !h-10 !rounded-full hover:!bg-muted hover:!text-muted-foreground`}
      aria-label="Toggle dark mode"
      onClick={toggleDarkMode}
    >
      {/* Sun in to light theme */}
      <span 
        className="latty latty-sun sun-icon" 
        style={{ display: isDark ? 'none' : 'inline-block' }}
      ></span>
      {/* Moon in to dark theme */}
      <span 
        className="latty latty-moon moon-icon" 
        style={{ display: isDark ? 'inline-block' : 'none' }}
      ></span>
    </Button>
  );
}