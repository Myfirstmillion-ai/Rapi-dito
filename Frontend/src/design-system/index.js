/**
 * Luxury Design System - Phase 4
 * Mobile-First Luxury Design Philosophy
 * 
 * This file contains all design tokens, animation configurations,
 * and constants used throughout the luxury components.
 */

// ========================================
// COLORS - Luxury Palette
// ========================================
export const COLORS = {
  // Primary - Emerald Luxury
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  
  // Neutrals - Premium Grays
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Semantic Colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Background Layers
  bg: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
    dark: '#000000',
    glass: 'rgba(255, 255, 255, 0.8)',
    glassDark: 'rgba(0, 0, 0, 0.8)',
  },
  
  // Text
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    tertiary: '#9ca3af',
    inverse: '#ffffff',
  },
};

// ========================================
// ANIMATION CONFIGS
// ========================================

// Spring Configuration (Framer Motion)
export const SPRING_CONFIG = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  mass: 0.8,
};

// Smooth Spring (Less bouncy)
export const SPRING_SMOOTH = {
  type: "spring",
  stiffness: 300,
  damping: 35,
  mass: 1,
};

// Bouncy Spring (More playful)
export const SPRING_BOUNCY = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  mass: 0.6,
};

// Tween Configuration (No spring)
export const TWEEN_CONFIG = {
  type: "tween",
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1], // Premium easing curve
};

// ========================================
// ANIMATION VARIANTS
// ========================================

// Fade In/Out
export const FADE_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

// Slide Up (Bottom Sheet style)
export const SLIDE_UP_VARIANTS = {
  hidden: { y: "100%", opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: SPRING_CONFIG,
  },
  exit: { 
    y: "100%", 
    opacity: 0,
    transition: TWEEN_CONFIG,
  },
};

// Slide Down (From top)
export const SLIDE_DOWN_VARIANTS = {
  hidden: { y: "-100%", opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: SPRING_CONFIG,
  },
  exit: { 
    y: "-100%", 
    opacity: 0,
    transition: TWEEN_CONFIG,
  },
};

// Scale (Zoom in/out)
export const SCALE_VARIANTS = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: SPRING_CONFIG,
  },
  exit: { 
    scale: 0.8, 
    opacity: 0,
    transition: TWEEN_CONFIG,
  },
};

// Scale Tap (Button press feedback)
export const SCALE_TAP = {
  scale: 0.95,
  transition: { duration: 0.1 },
};

// Stagger Children
export const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export const STAGGER_ITEM = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: SPRING_SMOOTH,
  },
};

// Floating Animation (Continuous)
export const FLOAT_VARIANTS = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Pulse Animation (Loading states)
export const PULSE_VARIANTS = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// ========================================
// LAYOUT CONSTANTS
// ========================================

export const SPACING = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
};

export const BORDER_RADIUS = {
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  '2xl': '2rem',    // 32px
  full: '9999px',   // Pill shape
};

export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
};

// ========================================
// GLASSMORPHISM STYLES
// ========================================

export const GLASS_STYLES = {
  light: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  dark: {
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  subtle: {
    background: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(10px) saturate(150%)',
    WebkitBackdropFilter: 'blur(10px) saturate(150%)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
};

// ========================================
// Z-INDEX SYSTEM
// ========================================

export const Z_INDEX = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
  toast: 800,
};

// ========================================
// BREAKPOINTS
// ========================================

export const BREAKPOINTS = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ========================================
// HAPTIC FEEDBACK PATTERNS
// ========================================

export const HAPTIC_PATTERNS = {
  light: [10],
  medium: [20],
  heavy: [30],
  success: [10, 50, 10],
  warning: [20, 50, 20],
  error: [30, 50, 30, 50, 30],
};

// Haptic feedback helper
export const triggerHaptic = (pattern = 'light') => {
  if (navigator.vibrate && HAPTIC_PATTERNS[pattern]) {
    navigator.vibrate(HAPTIC_PATTERNS[pattern]);
  }
};

// ========================================
// TYPOGRAPHY SCALE
// ========================================

export const TYPOGRAPHY = {
  heading: {
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-bold',
    h3: 'text-2xl font-bold',
    h4: 'text-xl font-semibold',
    h5: 'text-lg font-semibold',
    h6: 'text-base font-semibold',
  },
  body: {
    large: 'text-lg',
    base: 'text-base',
    small: 'text-sm',
    tiny: 'text-xs',
  },
  display: {
    xl: 'text-6xl font-bold',
    lg: 'text-5xl font-bold',
    md: 'text-4xl font-bold',
  },
};

// ========================================
// VEHICLE TYPES (for reference)
// ========================================

export const VEHICLE_TYPES = {
  MINI: 'Rapi-dito Mini',
  SEDAN: 'Rapi-dito Sedan',
  SUV: 'Rapi-dito SUV',
  PREMIUM: 'Rapi-dito Premium',
};

// ========================================
// RIDE STATUS CONSTANTS
// ========================================

export const RIDE_STATUS = {
  IDLE: 'idle',
  SEARCHING: 'searching',
  DRIVER_FOUND: 'driver_found',
  DRIVER_ARRIVING: 'driver_arriving',
  RIDE_STARTED: 'ride_started',
  RIDE_COMPLETED: 'ride_completed',
  CANCELLED: 'cancelled',
};

// ========================================
// DEFAULT EXPORT
// ========================================

export default {
  COLORS,
  SPRING_CONFIG,
  SPRING_SMOOTH,
  SPRING_BOUNCY,
  TWEEN_CONFIG,
  FADE_VARIANTS,
  SLIDE_UP_VARIANTS,
  SLIDE_DOWN_VARIANTS,
  SCALE_VARIANTS,
  SCALE_TAP,
  STAGGER_CONTAINER,
  STAGGER_ITEM,
  FLOAT_VARIANTS,
  PULSE_VARIANTS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  GLASS_STYLES,
  Z_INDEX,
  BREAKPOINTS,
  HAPTIC_PATTERNS,
  triggerHaptic,
  TYPOGRAPHY,
  VEHICLE_TYPES,
  RIDE_STATUS,
};
