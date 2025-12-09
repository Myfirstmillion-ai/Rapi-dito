import { useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, Target } from "lucide-react";
import { Z_INDEX } from "../utils/zIndex";

/**
 * MapControls - Swiss Minimalist Floating Controls
 * 
 * Swiss Design Principles:
 * - Emerald circular buttons (48px)
 * - Position: Absolute right-4 top-20, stack vertically with 8px gap
 * - Shadow: Subtle emerald-tinted
 * - Smooth animations on press (scale 0.95)
 */

function MapControls({ 
  onZoomIn, 
  onZoomOut, 
  onRecenter,
  isLocating = false 
}) {
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

  // Stagger animation for children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
        delayChildren: prefersReducedMotion ? 0 : 0.3
      }
    }
  };

  const itemVariants = {
    hidden: prefersReducedMotion ? {} : { opacity: 0, x: 20 },
    show: prefersReducedMotion ? {} : { opacity: 1, x: 0 }
  };

  // Swiss button style - Deep slate background
  const buttonBaseStyle = {
    background: '#1e293b', // slate-800
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)'
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="absolute right-4 flex flex-col gap-2"
      style={{ 
        zIndex: Z_INDEX.floatingControls,
        paddingRight: 'env(safe-area-inset-right, 0px)',
        top: 'calc(env(safe-area-inset-top, 16px) + 64px)' // Responsive positioning below header
      }}
    >
      {/* Zoom In Button */}
      <motion.button
        variants={itemVariants}
        whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
        onClick={onZoomIn}
        className="w-12 h-12 rounded-full flex items-center justify-center transition-colors hover:bg-slate-700 active:bg-slate-600"
        style={buttonBaseStyle}
        aria-label="Acercar mapa"
      >
        <Plus className="w-5 h-5 text-slate-300" />
      </motion.button>

      {/* Zoom Out Button */}
      <motion.button
        variants={itemVariants}
        whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
        onClick={onZoomOut}
        className="w-12 h-12 rounded-full flex items-center justify-center transition-colors hover:bg-slate-700 active:bg-slate-600"
        style={buttonBaseStyle}
        aria-label="Alejar mapa"
      >
        <Minus className="w-5 h-5 text-slate-300" />
      </motion.button>

      {/* Recenter Button - Emerald accent */}
      <motion.button
        variants={itemVariants}
        whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
        onClick={onRecenter}
        disabled={isLocating}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
          isLocating 
            ? 'opacity-70 cursor-wait' 
            : 'hover:shadow-lg'
        }`}
        style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
        }}
        aria-label="Centrar en mi ubicación"
      >
        <Target 
          className={`w-5 h-5 text-white ${isLocating ? 'animate-pulse' : ''}`} 
        />
      </motion.button>
    </motion.div>
  );
}

export default MapControls;
