import { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { THEME } from '../styles/swissLuxury';

/**
 * Theme Context for Swiss Luxury Design System
 * Provides dark/light mode support with system preference detection
 */

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // Initialize with system preference or saved preference
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Get current theme colors
  const theme = useMemo(() => isDark ? THEME.dark : THEME.light, [isDark]);

  // Toggle theme
  const toggleTheme = () => {
    setIsDark(prev => {
      const newValue = !prev;
      localStorage.setItem('theme', newValue ? 'dark' : 'light');
      return newValue;
    });
  };

  // Set specific theme
  const setTheme = (dark) => {
    setIsDark(dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  };

  // Listen to system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually set a preference
      const saved = localStorage.getItem('theme');
      if (!saved) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Update HTML class for Tailwind dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const value = {
    isDark,
    theme,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback for components not wrapped in ThemeProvider
    const isDark = typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false;
    return {
      isDark,
      theme: isDark ? THEME.dark : THEME.light,
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
  return context;
}

export default useTheme;
