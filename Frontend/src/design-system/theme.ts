/**
 * Luxury Design System Theme Utilities
 * Mobile-First Premium Design Helpers
 * 
 * This file provides utility functions for working with the design system,
 * including glass styles, shadows, haptic feedback, and motion configuration.
 */

import { COLORS, SHADOWS, BACKDROP_BLUR, SPRING_CONFIG, EASING } from './tokens';

// ===== GLASS STYLE UTILITIES =====

export interface GlassStyle {
  background: string;
  backdropFilter: string;
  WebkitBackdropFilter: string;
  border: string;
}

/**
 * Get glass morphism styles for premium UI elements
 * @param variant - The intensity of the glass effect
 * @returns CSS-in-JS style object
 */
export function getGlassStyles(
  variant: 'light' | 'medium' | 'strong' = 'medium'
): GlassStyle {
  const variants = {
    light: {
      background: COLORS.glass.light,
      backdropFilter: `blur(${BACKDROP_BLUR.sm}) saturate(180%)`,
      WebkitBackdropFilter: `blur(${BACKDROP_BLUR.sm}) saturate(180%)`,
      border: `1px solid ${COLORS.glass.lightMedium}`,
    },
    medium: {
      background: COLORS.glass.lightMedium,
      backdropFilter: `blur(${BACKDROP_BLUR.md}) saturate(180%)`,
      WebkitBackdropFilter: `blur(${BACKDROP_BLUR.md}) saturate(180%)`,
      border: `1px solid ${COLORS.glass.medium}`,
    },
    strong: {
      background: COLORS.glass.medium,
      backdropFilter: `blur(${BACKDROP_BLUR.xl}) saturate(200%)`,
      WebkitBackdropFilter: `blur(${BACKDROP_BLUR.xl}) saturate(200%)`,
      border: `1px solid ${COLORS.glass.mediumStrong}`,
    },
  };

  return variants[variant];
}

/**
 * Get dark glass styles for captain/driver interfaces
 */
export function getDarkGlassStyles(): GlassStyle {
  return {
    background: COLORS.glass.darkStrong,
    backdropFilter: `blur(${BACKDROP_BLUR.lg}) saturate(150%)`,
    WebkitBackdropFilter: `blur(${BACKDROP_BLUR.lg}) saturate(150%)`,
    border: `1px solid ${COLORS.glass.light}`,
  };
}

// ===== SHADOW UTILITIES =====

/**
 * Get shadow styles based on elevation level
 * @param elevation - The elevation level (sm, md, lg, xl)
 * @returns CSS box-shadow string
 */
export function getShadow(elevation: 'sm' | 'md' | 'lg' | 'xl' = 'md'): string {
  const shadowMap = {
    sm: SHADOWS.luxurySm,
    md: SHADOWS.luxuryMd,
    lg: SHADOWS.luxuryLg,
    xl: SHADOWS.luxuryXl,
  };

  return shadowMap[elevation];
}

/**
 * Get glow shadow for accent elements
 */
export function getGlowShadow(): string {
  return SHADOWS.luxuryGlow;
}

// ===== HAPTIC FEEDBACK =====

/**
 * Trigger haptic feedback on supported devices
 * @param style - The type of haptic feedback (light, medium, heavy)
 * Note: Primarily supported on Android Chrome. iOS Safari does not support the vibration API.
 * For iOS haptic feedback, consider using a native bridge or PWA capabilities.
 */
export function triggerHaptic(style: 'light' | 'medium' | 'heavy' = 'medium'): void {
  // Check if the Vibration API is available (primarily Android Chrome)
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
    };
    navigator.vibrate(patterns[style]);
  }
}

// ===== SPRING CONFIGURATION UTILITIES =====

/**
 * Get Framer Motion spring configuration
 * @param preset - The spring preset (default, gentle, wobbly, stiff, slow)
 * @param respectReducedMotion - Whether to respect user's reduced motion preference
 * @returns Framer Motion spring config or simple transition config
 */
export function getSpringConfig(
  preset: keyof typeof SPRING_CONFIG = 'default',
  respectReducedMotion: boolean = true
) {
  // Check for reduced motion preference
  const prefersReducedMotion =
    respectReducedMotion &&
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Return a simple, non-spring transition
    return {
      type: 'tween' as const,
      duration: 0.3,
      ease: EASING.premium,
    };
  }

  return SPRING_CONFIG[preset];
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ===== EASING UTILITIES =====

/**
 * Get CSS easing function for transitions
 * @param type - The easing type
 * @returns CSS easing string
 */
export function getEasing(
  type: keyof typeof EASING = 'premium'
): string {
  return EASING[type];
}

// ===== RESPONSIVE UTILITIES =====

/**
 * Check if the current device is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Check if the current device is tablet
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 768 && window.innerWidth < 1024;
}

/**
 * Check if the current device is desktop
 */
export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 1024;
}

// ===== COLOR UTILITIES =====

/**
 * Get accent color based on variant
 * @param variant - primary, secondary, or tertiary
 * @returns Hex color string
 */
export function getAccentColor(
  variant: 'primary' | 'secondary' | 'tertiary' = 'primary'
): string {
  const map = {
    primary: COLORS.luxury.accentPrimary,
    secondary: COLORS.luxury.accentSecondary,
    tertiary: COLORS.luxury.accentTertiary,
  };
  return map[variant];
}

/**
 * Get surface color based on level
 * @param level - 1, 2, or 3 (higher = lighter)
 * @returns Hex color string
 */
export function getSurfaceColor(level: 1 | 2 | 3 = 1): string {
  const map = {
    1: COLORS.luxury.surface1,
    2: COLORS.luxury.surface2,
    3: COLORS.luxury.surface3,
  };
  return map[level];
}

// ===== SAFE AREA UTILITIES =====

/**
 * Get safe area insets as CSS custom properties
 */
export function getSafeAreaInsets() {
  return {
    top: 'env(safe-area-inset-top, 0px)',
    right: 'env(safe-area-inset-right, 0px)',
    bottom: 'env(safe-area-inset-bottom, 0px)',
    left: 'env(safe-area-inset-left, 0px)',
  };
}

// ===== DEFAULT EXPORT =====

export default {
  getGlassStyles,
  getDarkGlassStyles,
  getShadow,
  getGlowShadow,
  triggerHaptic,
  getSpringConfig,
  prefersReducedMotion,
  getEasing,
  isMobile,
  isTablet,
  isDesktop,
  getAccentColor,
  getSurfaceColor,
  getSafeAreaInsets,
};
