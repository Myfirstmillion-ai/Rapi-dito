import { useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

/**
 * LookingForDriver - Swiss Minimalist Radar Pulse Overlay
 * Premium Native iOS Apple Maps inspired design
 * 
 * Features:
 * - Clean sonar wave effect (3 concentric pulsing rings) centered on map
 * - Minimal floating "Connecting..." pill at bottom
 * - No glassmorphism - solid backgrounds only
 * - Spring physics animations
 */
function LookingForDriver({ isVisible = false, onCancel }) {
  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Spring animation config for smooth motion
  const springConfig = {
    type: "spring",
    damping: 30,
    stiffness: 300
  };

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-30 pointer-events-none">
      {/* Premium Radar Pulse - Centered on user's location pin */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* Outer ring - slowest, largest */}
          <div 
            className="absolute inset-0 rounded-full border-2 border-emerald-500/50"
            style={{
              animation: prefersReducedMotion 
                ? 'none' 
                : 'radar-pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              animationDelay: '0s'
            }}
          />
          
          {/* Middle ring */}
          <div 
            className="absolute inset-6 rounded-full border-2 border-emerald-500/60"
            style={{
              animation: prefersReducedMotion 
                ? 'none' 
                : 'radar-pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              animationDelay: '0.6s'
            }}
          />
          
          {/* Inner ring - fastest */}
          <div 
            className="absolute inset-12 rounded-full border-2 border-emerald-500/70"
            style={{
              animation: prefersReducedMotion 
                ? 'none' 
                : 'radar-pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              animationDelay: '1.2s'
            }}
          />
          
          {/* Center Pin - Solid, premium design */}
          <motion.div
            initial={prefersReducedMotion ? {} : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={springConfig}
            className="relative z-10 w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center"
            style={{
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.5), 0 0 0 4px rgba(16, 185, 129, 0.2)'
            }}
          >
            <MapPin className="w-7 h-7 text-white" fill="white" />
          </motion.div>
        </div>
      </div>

      {/* Minimal Floating Pill - Bottom Center */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        transition={springConfig}
        className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-auto"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div 
          className="flex items-center gap-3 px-6 py-4 rounded-full bg-slate-900 shadow-2xl"
          style={{
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Pulsing dot indicator */}
          <div className="relative flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <div className="absolute w-3 h-3 rounded-full bg-emerald-500 animate-ping opacity-75" />
          </div>
          
          {/* Status Text */}
          <motion.span
            animate={prefersReducedMotion ? {} : { opacity: [1, 0.7, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-base font-semibold text-white"
          >
            Conectando...
          </motion.span>

          {/* Cancel Button - Subtle, integrated */}
          {onCancel && (
            <button
              onClick={onCancel}
              className="ml-2 px-3 py-1.5 rounded-full text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </motion.div>

      {/* CSS for radar-pulse animation */}
      <style>{`
        @keyframes radar-pulse {
          0% {
            transform: scale(0.6);
            opacity: 1;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default LookingForDriver;
