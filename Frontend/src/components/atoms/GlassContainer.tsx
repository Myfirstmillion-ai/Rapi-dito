/**
 * GlassContainer Component - Atomic Design System
 * 
 * Full-screen glassmorphism container for layering content
 * over backgrounds (e.g., maps, images, videos).
 * 
 * Features:
 * - Backdrop blur effect
 * - Semi-transparent background
 * - Perfect for overlay panels
 * - Dark mode support
 */

import { GlassContainerProps } from './types';
import { cn } from '../../utils/cn';

function GlassContainer({ children, className }: GlassContainerProps) {
  return (
    <div
      className={cn(
        // Glass effect
        'bg-white/80 dark:bg-gray-900/80',
        'backdrop-blur-xl',
        
        // Border
        'border border-white/20 dark:border-gray-700/20',
        
        // Shadow
        'shadow-2xl',
        
        // Smooth transitions
        'transition-all duration-300',
        
        // Custom className
        className
      )}
    >
      {children}
    </div>
  );
}

export default GlassContainer;
