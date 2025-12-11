/**
 * Swiss Luxury Minimalist iOS Design System
 *
 * A premium design language inspired by:
 * - Swiss typography principles
 * - iOS design language
 * - Luxury automotive interfaces
 *
 * Features:
 * - Full dark/light mode support
 * - Floating island components
 * - Soft shadows and rounded corners
 * - Premium typography hierarchy
 * - Physics-based animations
 */

// Color palette for both modes
export const THEME = {
  light: {
    // Backgrounds
    bg: '#FFFFFF',
    bgSecondary: '#F8FAFC',
    bgTertiary: '#F1F5F9',

    // Surfaces (floating islands)
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    surfaceHover: '#F8FAFC',
    surfaceActive: '#F1F5F9',

    // Text hierarchy
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    textInverse: '#FFFFFF',

    // Accent colors
    accent: '#10B981',
    accentHover: '#059669',
    accentLight: 'rgba(16, 185, 129, 0.1)',
    accentMedium: 'rgba(16, 185, 129, 0.2)',

    // Borders & Dividers
    border: 'rgba(0, 0, 0, 0.08)',
    borderHover: 'rgba(0, 0, 0, 0.12)',
    borderAccent: 'rgba(16, 185, 129, 0.3)',
    divider: 'rgba(0, 0, 0, 0.06)',

    // Shadows
    shadowSoft: '0 2px 8px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.04)',
    shadowMedium: '0 4px 12px rgba(0, 0, 0, 0.08), 0 8px 32px rgba(0, 0, 0, 0.08)',
    shadowStrong: '0 8px 24px rgba(0, 0, 0, 0.12), 0 16px 48px rgba(0, 0, 0, 0.12)',
    shadowAccent: '0 4px 16px rgba(16, 185, 129, 0.25)',
    shadowFloat: '0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04)',

    // Status colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(255, 255, 255, 0.8)',
  },

  dark: {
    // Backgrounds
    bg: '#0A0A0A',
    bgSecondary: '#111111',
    bgTertiary: '#1A1A1A',

    // Surfaces (floating islands)
    surface: '#141414',
    surfaceElevated: '#1C1C1E',
    surfaceHover: '#242424',
    surfaceActive: '#2C2C2E',

    // Text hierarchy
    textPrimary: '#FFFFFF',
    textSecondary: '#A1A1AA',
    textTertiary: '#71717A',
    textInverse: '#0A0A0A',

    // Accent colors
    accent: '#10B981',
    accentHover: '#34D399',
    accentLight: 'rgba(16, 185, 129, 0.12)',
    accentMedium: 'rgba(16, 185, 129, 0.2)',

    // Borders & Dividers
    border: 'rgba(255, 255, 255, 0.08)',
    borderHover: 'rgba(255, 255, 255, 0.12)',
    borderAccent: 'rgba(16, 185, 129, 0.4)',
    divider: 'rgba(255, 255, 255, 0.06)',

    // Shadows
    shadowSoft: '0 2px 8px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2)',
    shadowMedium: '0 4px 12px rgba(0, 0, 0, 0.4), 0 8px 32px rgba(0, 0, 0, 0.3)',
    shadowStrong: '0 8px 24px rgba(0, 0, 0, 0.5), 0 16px 48px rgba(0, 0, 0, 0.4)',
    shadowAccent: '0 4px 16px rgba(16, 185, 129, 0.3)',
    shadowFloat: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06)',

    // Status colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.7)',
    overlayLight: 'rgba(0, 0, 0, 0.8)',
  }
};

// Get theme based on current mode
export const getTheme = (isDark = false) => isDark ? THEME.dark : THEME.light;

// Physics-based spring animation configs
export const SPRING = {
  // Snappy response for UI elements
  snappy: {
    type: "spring",
    stiffness: 400,
    damping: 30,
    mass: 0.8,
  },
  // Smooth for modals and panels
  smooth: {
    type: "spring",
    stiffness: 300,
    damping: 35,
    mass: 1,
  },
  // Bouncy for playful interactions
  bouncy: {
    type: "spring",
    stiffness: 500,
    damping: 25,
    mass: 0.5,
  },
  // Gentle for subtle movements
  gentle: {
    type: "spring",
    stiffness: 200,
    damping: 40,
    mass: 1.2,
  },
};

// Premium easing functions
export const EASING = {
  premium: [0.16, 1, 0.3, 1],
  smooth: [0.4, 0, 0.2, 1],
  decelerate: [0, 0, 0.2, 1],
  accelerate: [0.4, 0, 1, 1],
};

// Border radius tokens
export const RADIUS = {
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '20px',
  xl: '24px',
  '2xl': '28px',
  '3xl': '32px',
  full: '9999px',
};

// Spacing tokens
export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
  '5xl': '48px',
};

// Typography tokens
export const TYPOGRAPHY = {
  // Display sizes
  display: {
    fontSize: '3.5rem',
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  heading1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
  },
  heading2: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1.25,
    letterSpacing: '-0.01em',
  },
  heading3: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  heading4: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  // Body sizes
  bodyLarge: {
    fontSize: '1.125rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  body: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  bodySmall: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  // Caption and labels
  caption: {
    fontSize: '0.75rem',
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0.02em',
  },
  label: {
    fontSize: '0.625rem',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
};

// Haptic feedback helper
export const triggerHaptic = (intensity = 'light') => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    const patterns = {
      light: [5],
      medium: [10],
      heavy: [20],
      success: [10, 50, 10],
      error: [20, 50, 20, 50, 20],
    };
    navigator.vibrate(patterns[intensity] || patterns.light);
  }
};

// Check for reduced motion preference
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Check for dark mode preference
export const prefersDarkMode = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Animation variants for common patterns
export const VARIANTS = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 40 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  bottomSheet: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
  },
};

// Stagger children helper
export const staggerContainer = (staggerDelay = 0.05) => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.1,
    },
  },
});

export default {
  THEME,
  getTheme,
  SPRING,
  EASING,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
  VARIANTS,
  triggerHaptic,
  prefersReducedMotion,
  prefersDarkMode,
  staggerContainer,
};
