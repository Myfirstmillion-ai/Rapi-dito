/**
 * Button Component - Atomic Design System
 * 
 * Premium button with Framer Motion animations, multiple variants,
 * loading states, and full accessibility support.
 * 
 * Features:
 * - Multiple variants: primary, secondary, tertiary, danger, ghost, outline
 * - Size options: xs, sm, md, lg, xl
 * - Loading state with spinner
 * - Icon support (left or right)
 * - Smooth animations with Framer Motion
 * - Full keyboard accessibility
 * - Touch-optimized (min 44px height)
 */

import { motion } from 'framer-motion';
import { ButtonProps } from './types';
import { cn } from '../../utils/cn';
import Spinner from './Spinner';

const buttonVariants = {
  primary: [
    'bg-gradient-to-b from-emerald-500 to-emerald-600',
    'hover:from-emerald-600 hover:to-emerald-700',
    'text-white shadow-lg shadow-emerald-500/25',
    'hover:shadow-xl hover:shadow-emerald-500/30',
    'focus-visible:ring-emerald-500'
  ].join(' '),
  
  secondary: [
    'bg-gradient-to-b from-gray-50 to-gray-100',
    'dark:from-gray-800 dark:to-gray-900',
    'text-gray-900 dark:text-white',
    'border border-gray-200 dark:border-gray-700',
    'hover:from-gray-100 hover:to-gray-150',
    'dark:hover:from-gray-700 dark:hover:to-gray-800',
    'shadow-sm hover:shadow-md',
    'focus-visible:ring-gray-500'
  ].join(' '),
  
  tertiary: [
    'bg-white/10 dark:bg-white/5',
    'backdrop-blur-sm',
    'text-gray-900 dark:text-white',
    'hover:bg-white/20 dark:hover:bg-white/10',
    'border border-white/20 dark:border-white/10',
    'focus-visible:ring-gray-400'
  ].join(' '),
  
  danger: [
    'bg-gradient-to-b from-red-500 to-red-600',
    'hover:from-red-600 hover:to-red-700',
    'text-white shadow-lg shadow-red-500/25',
    'hover:shadow-xl hover:shadow-red-500/30',
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
    'focus-visible:ring-gray-900 dark:focus-visible:ring-white'
  ].join(' ')
};

const buttonSizes = {
  xs: 'px-3 py-1.5 text-xs min-h-[32px]',
  sm: 'px-4 py-2 text-sm min-h-[40px]',
  md: 'px-6 py-3 text-base min-h-[48px]',
  lg: 'px-8 py-4 text-lg min-h-[56px]',
  xl: 'px-10 py-5 text-xl min-h-[64px]'
};

function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.02 } : undefined}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17
      }}
      disabled={isDisabled}
      className={cn(
        // Base styles
        'inline-flex items-center justify-center gap-2',
        'font-semibold rounded-xl',
        'transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        
        // Disabled state
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        
        // Variant and size
        buttonVariants[variant],
        buttonSizes[size],
        
        // Full width
        fullWidth && 'w-full',
        
        // Custom className
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size={size === 'xs' || size === 'sm' ? 'sm' : 'md'} />
          {loadingText || children}
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="flex-shrink-0" aria-hidden="true">
              {icon}
            </span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="flex-shrink-0" aria-hidden="true">
              {icon}
            </span>
          )}
        </>
      )}
    </motion.button>
  );
}

export default Button;
