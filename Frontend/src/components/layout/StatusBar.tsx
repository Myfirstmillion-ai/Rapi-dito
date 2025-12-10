import { useEffect } from 'react';
import type { StatusBarProps } from './types';

export function StatusBar({
  style = 'light',
  backgroundColor,
}: StatusBarProps) {
  useEffect(() => {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    
    if (backgroundColor) {
      metaThemeColor.setAttribute('content', backgroundColor);
    } else {
      metaThemeColor.setAttribute('content', style === 'dark' ? '#FAFAFA' : '#0A0A0A');
    }
  }, [style, backgroundColor]);

  return null;
}