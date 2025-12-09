import { useMemo, useCallback, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, X } from "lucide-react";
import { Z_INDEX } from "../utils/zIndex";

/**
 * LookingForDriver - Swiss Minimalist Luxury Design
 * Deep slate backgrounds, emerald accents, Inter font styling
 * 
 * Features:
 * - Radar animation with concentric pulsing rings
 * - Countdown timer
 * - Auto-cancel at 0
 * - Swiss typography (tight tracking, medium weight)
 * - 60fps transform-only animations
 */

// Validation helpers
const isValidBoolean = (value) => typeof value === 'boolean';
const isValidFunction = (value) => typeof value === 'function';
const isValidNumber = (value) => typeof value === 'number' && !isNaN(value);

// Development-only logging
const logValidationError = (propName, expectedType, receivedValue) => {
  if (import.meta.env.MODE !== 'production') {
    console.warn(
      `[LookingForDriver] Invalid prop "${propName}": expected ${expectedType}, received ${typeof receivedValue}`,
      { received: receivedValue }
    );
  }
};

function LookingForDriver({ 
  isVisible = false, 
  onCancel,
  statusText = "Conectando...",
  subText = "Buscando conductor cercano",
  timeoutSeconds = 30
}) {
  // ===== PROP VALIDATION =====
  const safeIsVisible = isValidBoolean(isVisible) ? isVisible : false;
  const safeStatusText = typeof statusText === 'string' ? statusText : "Conectando...";
  const safeSubText = typeof subText === 'string' ? subText : "Buscando conductor cercano";
  const safeTimeoutSeconds = isValidNumber(timeoutSeconds) && timeoutSeconds > 0 ? timeoutSeconds : 30;
  
  // ===== LOCAL STATE =====
  const [countdown, setCountdown] = useState(safeTimeoutSeconds);
  
  // Validate callback function
  const safeOnCancel = useCallback(() => {
    if (isValidFunction(onCancel)) {
      onCancel();
    } else {
      logValidationError('onCancel', 'function', onCancel);
    }
  }, [onCancel]);

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Reset countdown when visibility changes
  useEffect(() => {
    if (safeIsVisible) {
      setCountdown(safeTimeoutSeconds);
    }
  }, [safeIsVisible, safeTimeoutSeconds]);

  // Countdown timer with auto-cancel
  useEffect(() => {
    if (!safeIsVisible) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          safeOnCancel();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [safeIsVisible, safeOnCancel]);

  // Spring animation config for smooth motion
  const springConfig = {
    type: "spring",
    damping: 30,
    stiffness: 300
  };

  // Don't render if not visible
  if (!safeIsVisible) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center"
      style={{ 
        zIndex: Z_INDEX.alerts,
        background: 'rgba(15, 23, 42, 0.95)', // Deep slate-950/95
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
      role="status"
      aria-live="polite"
      aria-label="Buscando conductor"
    >
      {/* Radar animation - Swiss style */}
      <div className="relative flex items-center justify-center">
        {/* Radar rings - emerald with ping animation */}
        <div 
          className="absolute h-64 w-64 rounded-full border opacity-20"
          style={{ 
            borderColor: '#10b981',
            animation: prefersReducedMotion ? 'none' : 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
          }}
        />
        <div 
          className="absolute h-48 w-48 rounded-full border opacity-30"
          style={{ 
            borderColor: '#10b981',
            animation: prefersReducedMotion ? 'none' : 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
            animationDelay: '0.5s'
          }}
        />
        <div 
          className="absolute h-32 w-32 rounded-full border opacity-40"
          style={{ 
            borderColor: '#10b981',
            animation: prefersReducedMotion ? 'none' : 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
            animationDelay: '1s'
          }}
        />
        
        {/* Center icon - Emerald gradient */}
        <motion.div
          initial={prefersReducedMotion ? {} : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={springConfig}
          className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full"
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            boxShadow: '0 0 40px rgba(16, 185, 129, 0.5)'
          }}
        >
          <Target className="h-10 w-10 text-white" strokeWidth={2.5} />
        </motion.div>
      </div>
      
      {/* Text - Swiss typography */}
      <div className="absolute bottom-32 left-0 right-0 text-center px-6">
        <motion.h2 
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-semibold text-white"
          style={{ 
            letterSpacing: '-0.025em',
            fontWeight: 600
          }}
        >
          {safeStatusText}
        </motion.h2>
        <motion.p 
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-2 text-sm font-medium"
          style={{ 
            color: '#94a3b8', // slate-400
            letterSpacing: '-0.025em'
          }}
        >
          {safeSubText}
        </motion.p>
        <motion.p 
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-xs"
          style={{ 
            color: '#64748b', // slate-500
            letterSpacing: '-0.025em'
          }}
        >
          {countdown}s
        </motion.p>
      </div>
      
      {/* Cancel button - Swiss pill */}
      <motion.button
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={safeOnCancel}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 rounded-full px-8 py-3 text-sm font-medium transition-all active:scale-95"
        style={{
          background: '#1e293b', // slate-800
          color: '#cbd5e1', // slate-300
          letterSpacing: '-0.025em'
        }}
        aria-label="Cancelar búsqueda de conductor"
      >
        <X className="w-4 h-4" />
        Cancelar búsqueda
      </motion.button>
    </div>
  );
}

export default LookingForDriver;
