/**
 * Shared TypeScript types for atomic components
 * Phase 2: Atomic Components - Design System Types
 */

import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from 'react';

// ============================================================================
// Base Types
// ============================================================================

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost' | 'outline';
export type Status = 'success' | 'error' | 'warning' | 'info';
export type ColorScheme = 'emerald' | 'blue' | 'red' | 'gray' | 'amber';

// ============================================================================
// Button Types
// ============================================================================

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  size?: Size;
  variant?: Variant;
  'aria-label': string;
  className?: string;
}

// ============================================================================
// Input Types
// ============================================================================

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: Size;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
}

// ============================================================================
// Typography Types
// ============================================================================

export interface TextProps {
  as?: 'p' | 'span' | 'div' | 'label' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: Size;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  color?: string;
  gradient?: boolean;
  children: ReactNode;
  className?: string;
}

// ============================================================================
// Card Types
// ============================================================================

export interface GlassCardProps {
  children: ReactNode;
  intensity?: 'light' | 'medium' | 'heavy';
  padding?: Size;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export interface GlassContainerProps {
  children: ReactNode;
  className?: string;
}

// ============================================================================
// Status & Feedback Types
// ============================================================================

export interface AlertProps {
  status?: Status;
  title?: string;
  message: ReactNode;
  onClose?: () => void;
  dismissible?: boolean;
  icon?: ReactNode;
  className?: string;
}

export interface SpinnerProps {
  size?: Size;
  color?: ColorScheme;
  className?: string;
}

export interface BadgeProps {
  children: ReactNode;
  variant?: Status | 'default' | 'neutral';
  size?: Exclude<Size, 'xl'>;
  dot?: boolean;
  className?: string;
}

// ============================================================================
// Misc Types
// ============================================================================

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: Size;
  fallback?: string;
  className?: string;
}

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  label?: string;
}
