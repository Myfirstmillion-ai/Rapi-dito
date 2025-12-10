/**
 * Divider Component - Atomic Design System
 * 
 * Elegant separator for content sections with optional label.
 * Supports horizontal and vertical orientations.
 * 
 * Features:
 * - Horizontal and vertical orientations
 * - Optional text label
 * - Subtle gradient effect
 * - Dark mode support
 */

import { DividerProps } from './types';
import { cn } from '../../utils/cn';

function Divider({
  orientation = 'horizontal',
  label,
  className
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn(
          'w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent dark:via-gray-700',
          'self-stretch',
          className
        )}
      />
    );
  }

  // Horizontal divider
  if (label) {
    return (
      <div
        role="separator"
        aria-label={label}
        className={cn('relative flex items-center', className)}
      >
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-200 to-gray-200 dark:via-gray-700 dark:to-gray-700" />
        <span className="mx-4 text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {label}
        </span>
        <div className="flex-grow h-px bg-gradient-to-l from-transparent via-gray-200 to-gray-200 dark:via-gray-700 dark:to-gray-700" />
      </div>
    );
  }

  return (
    <div
      role="separator"
      className={cn(
        'h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-700',
        className
      )}
    />
  );
}

export default Divider;
