/**
 * IconButton Component - Atomic Design System
 * 
 * Premium icon-only button with circular design,
 * smooth animations, and accessibility.
 * 
 * Features:
 * - Multiple sizes: xs, sm, md, lg, xl
 * - Multiple variants: primary, secondary, tertiary, danger, ghost, outline
 * - Smooth hover and tap animations
 * - Required aria-label for accessibility
 * - Perfect circle design
 */

import { motion } from 'framer-motion';
import { IconButtonProps } from './types';
import { cn } from '../../utils/cn';

const iconButtonVariants = {
  primary: [
    'bg-gradient-to-b from-emerald-500 to-emerald-600',
    'hover:from-emerald-600 hover:to-emerald-700',
    'text-white shadow-lg shadow-emerald-500/25',
    'focus-visible:ring-emerald-500'
  ].join(' '),
  
  secondary: [
    'bg-gradient-to-b from-gray-50 to-gray-100',
    'dark:from-gray-800 dark:to-gray-900',
    'text-gray-900 dark:text-white',
    'border border-gray-200 dark:border-gray-700',
    'shadow-sm',
    'focus-visible:ring-gray-500'
  ].join(' '),
  
  tertiary: [
    'bg-white/10 dark:bg-white/5',
    'backdrop-blur-sm',
    'text-gray-900 dark:text-white',
    'hover:bg-white/20 dark:hover:bg-white/10',
    'border border-white/20',
    'focus-visible:ring-gray-400'
  ].join(' '),
  
  danger: [
    'bg-gradient-to-b from-red-500 to-red-600',
    'hover:from-red-600 hover:to-red-700',
    'text-white shadow-lg shadow-red-500/25',
    'focus-visible:ring-red-500'
  ].join(' '),
  
  ghost: [
    'bg-transparent',
    'text-gray-700 dark:text-gray-300',
    'hover:bg-gray-100 dark:hover:bg-gray-800',
    'focus-visible:ring-gray-400'
  ].join(' '),
  
  outline: [
    'bg-transparent border-2',
    'border-gray-900 dark:border-white',
    'text-gray-900 dark:text-white',
    'hover:bg-gray-900 dark:hover:bg-white',
    'hover:text-white dark:hover:text-gray-900',
    'focus-visible:ring-gray-900'
  ].join(' ')
};

const iconButtonSizes = {
  xs: 'w-8 h-8 p-1.5',
  sm: 'w-10 h-10 p-2',
  md: 'w-12 h-12 p-2.5',
  lg: 'w-14 h-14 p-3',
  xl: 'w-16 h-16 p-3.5'
};

function IconButton({
  icon,
  size = 'md',
  variant = 'primary',
  'aria-label': ariaLabel,
  disabled,
  className,
  ...props
}: IconButtonProps) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.1 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17
      }}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        // Base styles
        'inline-flex items-center justify-center',
        'rounded-full',
        'transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        
        // Disabled state
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        
        // Variant and size
        iconButtonVariants[variant],
        iconButtonSizes[size],
        
        // Custom className
        className
      )}
      {...props}
    >
      <span className="flex items-center justify-center" aria-hidden="true">
        {icon}
      </span>
    </motion.button>
  );
}

export default IconButton;
