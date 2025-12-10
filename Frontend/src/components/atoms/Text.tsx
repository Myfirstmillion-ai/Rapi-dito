/**
 * Text Component - Atomic Design System
 * 
 * Versatile typography component with multiple variants,
 * sizes, weights, and styling options.
 * 
 * Features:
 * - Multiple HTML elements: p, span, div, label, h1-h6
 * - Size variants: xs, sm, md, lg, xl
 * - Weight options: normal, medium, semibold, bold
 * - Text alignment: left, center, right
 * - Optional gradient text
 * - Dark mode support
 */

import { TextProps } from './types';
import { cn } from '../../utils/cn';

const textSizes = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl'
};

const textWeights = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold'
};

const textAlignments = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right'
};

function Text({
  as: Component = 'p',
  size = 'md',
  weight = 'normal',
  align = 'left',
  color,
  gradient = false,
  children,
  className
}: TextProps) {
  return (
    <Component
      className={cn(
        // Base styles
        'transition-colors duration-200',
        
        // Size, weight, alignment
        textSizes[size],
        textWeights[weight],
        textAlignments[align],
        
        // Color or gradient
        gradient
          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 bg-clip-text text-transparent'
          : color
          ? color
          : 'text-gray-900 dark:text-white',
        
        // Custom className
        className
      )}
    >
      {children}
    </Component>
  );
}

export default Text;
