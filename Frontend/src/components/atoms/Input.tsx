/**
 * Input Component - Atomic Design System
 * 
 * Premium glassmorphic input field with validation support,
 * icons, and smooth animations.
 * 
 * Features:
 * - Glassmorphism styling
 * - Multiple sizes: xs, sm, md, lg, xl
 * - Icon support (left or right)
 * - Error and helper text
 * - Label with proper accessibility
 * - Smooth focus animations
 * - Dark mode support
 */

import { useId } from 'react';
import { motion } from 'framer-motion';
import { InputProps } from './types';
import { cn } from '../../utils/cn';
import { AlertCircle } from 'lucide-react';

const inputSizes = {
  xs: 'h-8 px-3 text-xs',
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-5 text-base',
  lg: 'h-14 px-6 text-lg',
  xl: 'h-16 px-7 text-xl'
};

function Input({
  label,
  error,
  helperText,
  size = 'md',
  icon,
  iconPosition = 'left',
  className,
  id,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const hasError = !!error;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        )}

        <motion.div
          whileFocus={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <input
            id={inputId}
            className={cn(
            // Base styles
            'w-full rounded-2xl',
            'bg-white/10 dark:bg-white/5',
            'backdrop-blur-sm',
            'border-2 border-transparent',
            'text-gray-900 dark:text-white',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            
            // Transitions
            'transition-all duration-200',
            
            // Focus state
            'focus:outline-none',
            'focus:bg-white/20 dark:focus:bg-white/10',
            'focus:border-emerald-500 dark:focus:border-emerald-400',
            'focus:ring-4 focus:ring-emerald-500/10',
            
            // Hover state
            'hover:bg-white/15 dark:hover:bg-white/8',
            
            // Error state
            hasError && [
              'border-red-500 dark:border-red-400',
              'focus:border-red-500 dark:focus:border-red-400',
              'focus:ring-red-500/10',
              'bg-red-50/50 dark:bg-red-900/20'
            ],
            
            // Disabled state
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800',
            
            // Icon padding
            icon && iconPosition === 'left' && 'pl-12',
            icon && iconPosition === 'right' && 'pr-12',
            
            // Size
            inputSizes[size],
            
            // Custom className
            className
          )}
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${inputId}-error`
              : helperText
              ? `${inputId}-helper`
              : undefined
          }
          {...props}
        />
        </motion.div>

        {icon && iconPosition === 'right' && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        )}

        {hasError && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 dark:text-red-400">
            <AlertCircle size={20} />
          </div>
        )}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          id={`${inputId}-error`}
          className="mt-2 text-sm font-medium text-red-500 dark:text-red-400 flex items-center gap-1"
          role="alert"
        >
          {error}
        </motion.p>
      )}

      {!error && helperText && (
        <p
          id={`${inputId}-helper`}
          className="mt-2 text-sm text-gray-500 dark:text-gray-400"
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

export default Input;
