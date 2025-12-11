import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { getGlassStyle } from '../../design-system';
import type { FloatingActionBarProps } from './types';

export function FloatingActionBar({
  children,
  position = 'bottom',
  safeArea = true,
  blur = true,
  className,
}: FloatingActionBarProps) {
  const positionClasses = {
    bottom: 'bottom-0 left-0 right-0',
    top: 'top-0 left-0 right-0',
  };

  return (
    <motion.div
      initial={{ y: position === 'bottom' ? 100 : -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        'fixed z-50 mx-4',
        positionClasses[position],
        safeArea && (position === 'bottom' ? 'mb-[env(safe-area-inset-bottom)]' : 'mt-[env(safe-area-inset-top)]'),
        className
      )}
      style={{ 
        marginBottom: position === 'bottom' ? 'max(16px, env(safe-area-inset-bottom))' : undefined,
        marginTop: position === 'top' ? 'max(16px, env(safe-area-inset-top))' : undefined,
      }}
    >
      <div 
        className={cn(
          'flex items-center justify-center gap-3 p-4 rounded-xl shadow-lg',
          blur && 'backdrop-blur-md',
        )}
        style={blur ? getGlassStyle('heavy') : {}}
      >
        {children}
      </div>
    </motion.div>
  );
}