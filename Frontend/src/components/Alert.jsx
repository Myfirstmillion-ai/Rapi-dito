import { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X,
  Loader2
} from "lucide-react";
import Button from "./Button";
import { Z_INDEX } from "../utils/zIndex";

/**
 * Alert - Premium Modal Alert System
 * Process 2 - Phase 4: Driver HUD, Stats Dashboard & Alert System
 * 
 * CRITICAL WHITE SCREEN PREVENTION:
 * - ALL data access uses optional chaining (?.)
 * - ALL displays have fallback values
 * - NEVER throws unhandled errors
 * - Logs errors in development only
 * 
 * Features:
 * - Tesla-inspired dark glass aesthetic
 * - Multiple alert types (success, error, warning, info, loading)
 * - Spring physics animations
 * - Accessibility compliant (ARIA)
 * - Keyboard navigation (Escape to close)
 * - Auto-dismiss option
 */

// ===== VALIDATION HELPERS =====
const isValidString = (value) => typeof value === 'string' && value.length > 0;
const isValidFunction = (value) => typeof value === 'function';
const isValidBoolean = (value) => typeof value === 'boolean';
const isValidNumber = (value) => typeof value === 'number' && !isNaN(value) && value > 0;

// Development-only logging
const logValidationError = (propName, expectedType, receivedValue) => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `[Alert] Invalid prop "${propName}": expected ${expectedType}, received ${typeof receivedValue}`,
      { received: receivedValue }
    );
  }
};

// Safe string helper
const safeString = (value, fallback = '') => {
  if (isValidString(value)) return value;
  if (value === null || value === undefined) return fallback;
  return String(value) || fallback;
};

// ===== ALERT TYPE CONFIGURATIONS =====
const ALERT_TYPES = {
  success: {
    icon: CheckCircle2,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/20 border-emerald-500/30',
    glowColor: 'shadow-emerald-500/20',
    accentColor: 'from-emerald-500/10',
    buttonClass: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
  },
  error: {
    icon: AlertCircle,
    iconColor: 'text-rose-400',
    iconBg: 'bg-rose-500/20 border-rose-500/30',
    glowColor: 'shadow-rose-500/20',
    accentColor: 'from-rose-500/10',
    buttonClass: 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700'
  },
  failure: {
    icon: AlertCircle,
    iconColor: 'text-rose-400',
    iconBg: 'bg-rose-500/20 border-rose-500/30',
    glowColor: 'shadow-rose-500/20',
    accentColor: 'from-rose-500/10',
    buttonClass: 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700'
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/20 border-amber-500/30',
    glowColor: 'shadow-amber-500/20',
    accentColor: 'from-amber-500/10',
    buttonClass: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
  },
  info: {
    icon: Info,
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-500/20 border-cyan-500/30',
    glowColor: 'shadow-cyan-500/20',
    accentColor: 'from-cyan-500/10',
    buttonClass: 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700'
  },
  loading: {
    icon: Loader2,
    iconColor: 'text-white/60',
    iconBg: 'bg-white/10 border-white/20',
    glowColor: 'shadow-white/10',
    accentColor: 'from-white/5',
    buttonClass: 'bg-white/10 hover:bg-white/20',
    isAnimated: true
  }
};

export const Alert = ({ 
  heading = '', 
  text = '', 
  isVisible = false, 
  onClose, 
  type = 'info',
  confirmText = 'Okay',
  cancelText = '',
  onConfirm,
  onCancel,
  autoDismiss = 0, // milliseconds, 0 = no auto-dismiss
  showCloseButton = true,
  isLoading = false
}) => {
  // ===== PROP VALIDATION =====
  const safeIsVisible = isValidBoolean(isVisible) ? isVisible : false;
  const safeHeading = safeString(heading, 'Alerta');
  const safeText = safeString(text);
  const safeConfirmText = safeString(confirmText, 'Okay');
  const safeCancelText = safeString(cancelText);
  const safeShowCloseButton = isValidBoolean(showCloseButton) ? showCloseButton : true;
  const safeIsLoading = isValidBoolean(isLoading) ? isLoading : false;
  const safeAutoDismiss = isValidNumber(autoDismiss) ? autoDismiss : 0;
  
  // Validate type
  const safeType = ALERT_TYPES[type] ? type : 'info';
  const typeConfig = ALERT_TYPES[safeType];
  
  // Validate callbacks
  const safeOnClose = useCallback(() => {
    if (isValidFunction(onClose)) {
      onClose();
    } else {
      logValidationError('onClose', 'function', onClose);
    }
  }, [onClose]);

  const safeOnConfirm = useCallback(() => {
    if (isValidFunction(onConfirm)) {
      onConfirm();
    } else if (isValidFunction(onClose)) {
      onClose();
    }
  }, [onConfirm, onClose]);

  const safeOnCancel = useCallback(() => {
    if (isValidFunction(onCancel)) {
      onCancel();
    } else if (isValidFunction(onClose)) {
      onClose();
    }
  }, [onCancel, onClose]);

  // ===== LOCAL STATE =====
  const [shouldRender, setShouldRender] = useState(false);

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Handle visibility changes
  useEffect(() => {
    if (safeIsVisible) {
      setShouldRender(true);
    } else {
      // Delay unmount to allow exit animation
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [safeIsVisible]);

  // Handle auto-dismiss
  useEffect(() => {
    if (safeIsVisible && safeAutoDismiss > 0 && safeType !== 'loading') {
      const timer = setTimeout(safeOnClose, safeAutoDismiss);
      return () => clearTimeout(timer);
    }
  }, [safeIsVisible, safeAutoDismiss, safeOnClose, safeType]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && safeIsVisible && safeType !== 'loading') {
        safeOnClose();
      }
    };

    if (safeIsVisible) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [safeIsVisible, safeOnClose, safeType]);

  // Spring animation config
  const springConfig = {
    type: "spring",
    damping: 25,
    stiffness: 300
  };

  if (!shouldRender) return null;

  const IconComponent = typeConfig.icon;

  return (
    <AnimatePresence>
      {safeIsVisible && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex: Z_INDEX.alerts }}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="alert-heading"
          aria-describedby="alert-text"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={safeType !== 'loading' ? safeOnClose : undefined}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Alert Card */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
            transition={springConfig}
            className="relative w-full max-w-md overflow-hidden"
          >
            {/* Glass Card */}
            <div 
              className={`
                relative rounded-3xl overflow-hidden
                bg-slate-900/95 backdrop-blur-xl
                border border-white/10
                shadow-2xl ${typeConfig.glowColor}
              `}
            >
              {/* Accent gradient at top */}
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${typeConfig.accentColor} to-transparent`} />
              
              {/* Close button */}
              {safeShowCloseButton && safeType !== 'loading' && (
                <button
                  onClick={safeOnClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
                  aria-label="Cerrar alerta"
                >
                  <X size={16} className="text-white/60" />
                </button>
              )}

              {/* Content */}
              <div className="p-6 pt-8">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className={`w-16 h-16 rounded-2xl ${typeConfig.iconBg} border flex items-center justify-center`}>
                    <IconComponent 
                      size={32} 
                      className={`${typeConfig.iconColor} ${typeConfig.isAnimated ? 'animate-spin' : ''}`}
                    />
                  </div>
                </div>

                {/* Heading */}
                <h2 
                  id="alert-heading"
                  className="text-xl font-bold text-white text-center mb-2"
                >
                  {safeHeading}
                </h2>

                {/* Text */}
                {safeText && (
                  <p 
                    id="alert-text"
                    className="text-sm text-white/60 text-center mb-6 text-pretty"
                  >
                    {safeText}
                  </p>
                )}

                {/* Buttons */}
                {safeType !== 'loading' && (
                  <div className={`flex gap-3 ${safeCancelText ? 'flex-row' : 'flex-col'}`}>
                    {safeCancelText && (
                      <Button
                        title={safeCancelText}
                        onClick={safeOnCancel}
                        variant="secondary"
                        fullWidth
                      />
                    )}
                    <Button
                      title={safeConfirmText}
                      onClick={safeOnConfirm}
                      loading={safeIsLoading}
                      fullWidth
                      variant="primary"
                    />
                  </div>
                )}

                {/* Loading indicator */}
                {safeType === 'loading' && (
                  <div className="flex justify-center">
                    <div className="w-8 h-1 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-white/60 rounded-full"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        style={{ width: '50%' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Alert;