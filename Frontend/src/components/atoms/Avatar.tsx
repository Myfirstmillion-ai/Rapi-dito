/**
 * Avatar Component - Atomic Design System
 * 
 * User avatar with image support, fallback initials,
 * and multiple size variants.
 * 
 * Features:
 * - Multiple sizes: xs, sm, md, lg, xl
 * - Image support with fallback
 * - Initial letter fallback
 * - Default user icon fallback
 * - Perfect circle design
 * - Border with gradient
 * - Smooth animations
 */

import { motion } from 'framer-motion';
import { AvatarProps } from './types';
import { cn } from '../../utils/cn';
import { User } from 'lucide-react';

const avatarSizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-2xl'
};

const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32
};

function Avatar({
  src,
  alt = 'Avatar',
  size = 'md',
  fallback,
  className
}: AvatarProps) {
  const getInitial = (text: string): string => {
    return text.charAt(0).toUpperCase();
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20
      }}
      className={cn(
        // Base styles
        'relative inline-flex items-center justify-center',
        'rounded-full',
        'overflow-hidden',
        'ring-2 ring-white dark:ring-gray-800',
        'shadow-lg',
        
        // Size
        avatarSizes[size],
        
        // Custom className
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Hide image on error to show fallback
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : fallback ? (
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-semibold">
          {getInitial(fallback)}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 text-gray-600 dark:text-gray-300">
          <User size={iconSizes[size]} strokeWidth={2} />
        </div>
      )}
    </motion.div>
  );
}

export default Avatar;
