/**
 * Spinner Component - Atomic Design System
 * 
 * Animated loading spinner with multiple sizes and color schemes.
 * Uses smooth SVG animations with Framer Motion.
 * 
 * Features:
 * - Multiple sizes: xs, sm, md, lg, xl
 * - Color schemes: emerald, blue, red, gray, amber
 * - Smooth rotation animation
 * - Accessible with proper ARIA attributes
 */

import { motion } from 'framer-motion';
import { SpinnerProps } from './types';
import { cn } from '../../utils/cn';

const spinnerSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

const spinnerColors = {
  emerald: 'text-emerald-500',
  blue: 'text-blue-500',
  red: 'text-red-500',
  gray: 'text-gray-500',
  amber: 'text-amber-500'
};

function Spinner({ size = 'md', color = 'emerald', className }: SpinnerProps) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
      className={cn(
        'inline-block',
        spinnerSizes[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <svg
        className={cn('animate-spin', spinnerColors[color])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </motion.div>
  );
}

export default Spinner;
