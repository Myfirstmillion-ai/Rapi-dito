import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X } from "lucide-react";

/**
 * LookingForDriver - Swiss Minimalist Luxury Search Overlay
 * Full-screen elegant loading state with pulsing animation
 * 
 * Design Philosophy:
 * - Clean backdrop with blur
 * - Centered elegant search animation
 * - Premium typography
 * - Subtle cancel option
 */
function LookingForDriver({ isVisible = false, onCancel }) {
  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Spring animation config
  const springConfig = {
    type: "spring",
    damping: 30,
    stiffness: 300
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Full screen backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            role="presentation"
            aria-hidden="true"
          />

          {/* Centered Content */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            transition={springConfig}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-label="Buscando conductor"
          >
            {/* Main Card */}
            <div 
              className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto"
            >
              {/* Content */}
              <div className="p-8 text-center">
                {/* Pulsing Animation Container */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                  {/* Outer pulse ring */}
                  <div 
                    className="absolute inset-0 rounded-full bg-emerald-500/20"
                    style={{
                      animation: prefersReducedMotion 
                        ? 'none' 
                        : 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }}
                  />
                  
                  {/* Middle pulse ring */}
                  <div 
                    className="absolute inset-3 rounded-full bg-emerald-500/30"
                    style={{
                      animation: prefersReducedMotion 
                        ? 'none' 
                        : 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                      animationDelay: '0.5s'
                    }}
                  />
                  
                  {/* Inner pulse ring */}
                  <div 
                    className="absolute inset-6 rounded-full bg-emerald-500/40"
                    style={{
                      animation: prefersReducedMotion 
                        ? 'none' 
                        : 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                      animationDelay: '1s'
                    }}
                  />
                  
                  {/* Center Icon */}
                  <motion.div
                    animate={prefersReducedMotion ? {} : { rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
                  >
                    <Loader2 className="w-6 h-6 text-white" />
                  </motion.div>
                </div>

                {/* Status Text */}
                <motion.h2
                  animate={prefersReducedMotion ? {} : { opacity: [1, 0.7, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  Buscando conductor
                </motion.h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Conectando con conductores cercanos...
                </p>

                {/* Progress Bar */}
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-6">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{ width: '50%' }}
                  />
                </div>

                {/* Cancel Button */}
                {onCancel && (
                  <button
                    onClick={onCancel}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar búsqueda</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* CSS for pulse-ring animation */}
          <style>{`
            @keyframes pulse-ring {
              0% {
                transform: scale(0.8);
                opacity: 1;
              }
              100% {
                transform: scale(2);
                opacity: 0;
              }
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}

export default LookingForDriver;
