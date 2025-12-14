/**
 * Luxury Design System - Barrel Export
 * Mobile-First Premium Design Foundation
 * 
 * This file exports all design system components for easy import.
 * Usage: import { COLORS, getGlassStyles } from '@/design-system';
 */

// Export all tokens
export {
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
} from './tokens';

// Export token types
export type {
  ColorToken,
  SpacingToken,
  TypographyToken,
  ShadowToken,
  BorderRadiusToken,
  BackdropBlurToken,
  SpringConfig,
  EasingToken,
  DurationToken,
  ZIndexToken,
} from './tokens';

// Export all theme utilities
export {
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
} from './theme';

// Export theme utility types
export type { GlassStyle } from './theme';

// Default export
export { default as tokens } from './tokens';
export { default as theme } from './theme';
