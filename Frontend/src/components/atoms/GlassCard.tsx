/**
 * GlassCard Component - Atomic Design System
 * 
 * Premium glassmorphism card with backdrop blur and depth.
 * Perfect for modern UI designs with layered content.
 * 
 * Features:
 * - Three intensity levels: light, medium, heavy
 * - Multiple padding sizes
 * - Hoverable variant with scale effect
 * - Smooth animations with Framer Motion
 * - Click support for interactive cards
 */

import { motion } from 'framer-motion';
import { GlassCardProps } from './types';
import { cn } from '../../utils/cn';

const glassIntensity = {
  light: 'bg-white/5 backdrop-blur-sm border-white/10',
  medium: 'bg-white/10 backdrop-blur-md border-white/20',
  heavy: 'bg-white/20 backdrop-blur-lg border-white/30'
};

const paddingSizes = {
  xs: 'p-3',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10'
};

function GlassCard({
  children,
  intensity = 'medium',
  padding = 'md',
  hoverable = false,
  onClick,
  className
}: GlassCardProps) {
  const isInteractive = hoverable || !!onClick;

  return (
    <motion.div
      whileHover={isInteractive ? { scale: 1.02, y: -4 } : {}}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20
      }}
      onClick={onClick}
      className={cn(
        // Base styles
        'rounded-2xl border',
        'shadow-lg',
        'transition-all duration-200',
        
        // Glass effect
        glassIntensity[intensity],
        
        // Padding
        paddingSizes[padding],
        
        // Interactive styles
        isInteractive && [
          'cursor-pointer',
          'hover:shadow-xl',
          'active:scale-[0.98]'
        ],
        
        // Focus styles for keyboard navigation
        onClick && [
          'focus:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-emerald-500',
          'focus-visible:ring-offset-2'
        ],
        
        // Custom className
        className
      )}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </motion.div>
  );
}

export default GlassCard;
