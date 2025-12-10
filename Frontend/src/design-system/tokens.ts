/**
 * Luxury Design System Tokens
 * Mobile-First Premium Design Foundation
 * 
 * This file serves as the single source of truth for all design tokens
 * used across the application. It matches the Tailwind configuration
 * and provides TypeScript types for type safety.
 */

// ===== COLOR TOKENS =====

export const COLORS = {
  luxury: {
    black: '#000000',
    surface1: '#0A0A0A',
    surface2: '#141414',
    surface3: '#1E1E1E',
    white: '#FFFFFF',
    accentPrimary: '#10B981',
    accentSecondary: '#3B82F6',
    accentTertiary: '#8B5CF6',
  },
  glass: {
    light: 'rgba(255, 255, 255, 0.1)',
    lightMedium: 'rgba(255, 255, 255, 0.2)',
    medium: 'rgba(255, 255, 255, 0.3)',
    mediumStrong: 'rgba(255, 255, 255, 0.4)',
    dark: 'rgba(0, 0, 0, 0.3)',
    darkMedium: 'rgba(0, 0, 0, 0.5)',
    darkStrong: 'rgba(0, 0, 0, 0.7)',
  },
} as const;

// ===== SPACING TOKENS =====

export const SPACING = {
  xs: '0.5rem',     // 8px
  sm: '1rem',       // 16px
  md: '1.5rem',     // 24px
  lg: '2rem',       // 32px
  xl: '3rem',       // 48px
  '2xl': '4rem',    // 64px
} as const;

// ===== TYPOGRAPHY TOKENS =====

export const TYPOGRAPHY = {
  fontFamily: {
    luxury: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
    luxuryDisplay: ['SF Pro Display', 'Inter', '-apple-system', 'system-ui', 'sans-serif'],
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '-0.01em',
    wide: '0.02em',
  },
  lineHeight: {
    tight: '1.2',
    normal: '1.4',
    relaxed: '1.6',
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
} as const;

// ===== SHADOW TOKENS =====

export const SHADOWS = {
  luxuryGlow: '0 0 40px rgba(16, 185, 129, 0.4), 0 0 80px rgba(16, 185, 129, 0.2)',
  luxuryInner: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)',
  luxurySm: '0 2px 8px rgba(0, 0, 0, 0.12)',
  luxuryMd: '0 4px 16px rgba(0, 0, 0, 0.16)',
  luxuryLg: '0 8px 32px rgba(0, 0, 0, 0.24)',
  luxuryXl: '0 16px 64px rgba(0, 0, 0, 0.32)',
} as const;

// ===== BORDER RADIUS TOKENS =====

export const BORDER_RADIUS = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  pill: '9999px',
} as const;

// ===== BACKDROP BLUR TOKENS =====

export const BACKDROP_BLUR = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '40px',
} as const;

// ===== ANIMATION/SPRING CONFIGURATION =====

export const SPRING_CONFIG = {
  default: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
    mass: 1,
  },
  gentle: {
    type: 'spring' as const,
    stiffness: 120,
    damping: 20,
    mass: 1,
  },
  wobbly: {
    type: 'spring' as const,
    stiffness: 180,
    damping: 12,
    mass: 1,
  },
  stiff: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 40,
    mass: 1,
  },
  slow: {
    type: 'spring' as const,
    stiffness: 80,
    damping: 20,
    mass: 1,
  },
} as const;

// ===== EASING CURVES =====

export const EASING = {
  premium: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  luxurySpring: 'cubic-bezier(0.16, 1, 0.3, 1)',
  decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
  accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
} as const;

// ===== DURATION TOKENS =====

export const DURATION = {
  fast: '200ms',
  normal: '300ms',
  slow: '400ms',
  slower: '600ms',
} as const;

// ===== Z-INDEX TOKENS =====

export const Z_INDEX = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  toast: 50,
  tooltip: 100,
} as const;

// ===== TYPE DEFINITIONS =====

export type ColorToken = typeof COLORS;
export type SpacingToken = typeof SPACING;
export type TypographyToken = typeof TYPOGRAPHY;
export type ShadowToken = typeof SHADOWS;
export type BorderRadiusToken = typeof BORDER_RADIUS;
export type BackdropBlurToken = typeof BACKDROP_BLUR;
export type SpringConfig = typeof SPRING_CONFIG;
export type EasingToken = typeof EASING;
export type DurationToken = typeof DURATION;
export type ZIndexToken = typeof Z_INDEX;

// ===== DEFAULT EXPORT =====

export default {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  SHADOWS,
  BORDER_RADIUS,
  BACKDROP_BLUR,
  SPRING_CONFIG,
  EASING,
  DURATION,
  Z_INDEX,
} as const;
