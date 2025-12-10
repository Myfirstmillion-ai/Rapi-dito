/**
 * Alert Component - Atomic Design System
 * 
 * Premium notification/alert component with status variants,
 * icons, and smooth animations.
 * 
 * Features:
 * - Status variants: success, error, warning, info
 * - Optional title and dismiss button
 * - Icon support with default icons per status
 * - Smooth animations with Framer Motion
 * - Full accessibility support
 * - Glassmorphism styling
 */

import { motion, AnimatePresence } from 'framer-motion';
import { AlertProps } from './types';
import { cn } from '../../utils/cn';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useState } from 'react';

const alertVariants = {
  success: {
    container: 'bg-emerald-50/80 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
    icon: 'text-emerald-600 dark:text-emerald-400',
    title: 'text-emerald-900 dark:text-emerald-100',
    message: 'text-emerald-700 dark:text-emerald-300',
    defaultIcon: CheckCircle2
  },
  error: {
    container: 'bg-red-50/80 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400',
    title: 'text-red-900 dark:text-red-100',
    message: 'text-red-700 dark:text-red-300',
    defaultIcon: XCircle
  },
  warning: {
    container: 'bg-amber-50/80 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    icon: 'text-amber-600 dark:text-amber-400',
    title: 'text-amber-900 dark:text-amber-100',
    message: 'text-amber-700 dark:text-amber-300',
    defaultIcon: AlertTriangle
  },
  info: {
    container: 'bg-blue-50/80 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    title: 'text-blue-900 dark:text-blue-100',
    message: 'text-blue-700 dark:text-blue-300',
    defaultIcon: Info
  }
};

function Alert({
  status = 'info',
  title,
  message,
  onClose,
  dismissible = false,
  icon,
  className
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  const variant = alertVariants[status];
  const DefaultIcon = variant.defaultIcon;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 200);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25
          }}
          role="alert"
          aria-live="polite"
          className={cn(
            'relative rounded-2xl border-2 p-4',
            'backdrop-blur-sm',
            'shadow-lg',
            variant.container,
            className
          )}
        >
          <div className="flex gap-3">
            {/* Icon */}
            <div className={cn('flex-shrink-0 mt-0.5', variant.icon)}>
              {icon || <DefaultIcon size={24} strokeWidth={2.5} />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {title && (
                <h3 className={cn('font-bold text-base mb-1', variant.title)}>
                  {title}
                </h3>
              )}
              <div className={cn('text-sm leading-relaxed', variant.message)}>
                {message}
              </div>
            </div>

            {/* Dismiss button */}
            {dismissible && (
              <button
                onClick={handleClose}
                className={cn(
                  'flex-shrink-0 p-1 rounded-lg',
                  'transition-colors duration-200',
                  'hover:bg-black/5 dark:hover:bg-white/5',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                  variant.icon
                )}
                aria-label="Close alert"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Alert;
