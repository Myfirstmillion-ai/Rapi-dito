/**
 * Badge Component - Atomic Design System
 * 
 * Status badge with multiple variants and optional dot indicator.
 * Perfect for labels, status indicators, and counts.
 * 
 * Features:
 * - Multiple variants: success, error, warning, info, default, neutral
 * - Size options: xs, sm, md, lg
 * - Optional dot indicator
 * - Pill-shaped design
 * - Smooth animations
 */

import { motion } from 'framer-motion';
import { BadgeProps } from './types';
import { cn } from '../../utils/cn';

const badgeVariants = {
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 ring-1 ring-emerald-600/20',
  error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 ring-1 ring-red-600/20',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 ring-1 ring-amber-600/20',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 ring-1 ring-blue-600/20',
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 ring-1 ring-gray-600/20',
  neutral: 'bg-white/80 text-gray-900 dark:bg-gray-900/80 dark:text-white ring-1 ring-gray-900/10 dark:ring-white/10'
};

const badgeSizes = {
  xs: 'px-2 py-0.5 text-xs',
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base'
};

const dotColors = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-blue-500',
  default: 'bg-gray-500',
  neutral: 'bg-gray-900 dark:bg-white'
};

function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className
}: BadgeProps) {
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20
      }}
      className={cn(
        // Base styles
        'inline-flex items-center gap-1.5',
        'font-semibold',
        'rounded-full',
        'whitespace-nowrap',
        'transition-all duration-200',
        
        // Variant and size
        badgeVariants[variant],
        badgeSizes[size],
        
        // Custom className
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            dotColors[variant]
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </motion.span>
  );
}

export default Badge;
