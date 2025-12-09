import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Power, TrendingUp, Zap } from 'lucide-react';

/**
 * CommandDock - Tesla-Inspired Floating Command Bar for Drivers
 * Process 2 - Phase 2: Floating Navigation Architecture
 * 
 * Design Philosophy: Tesla Dashboard meets iOS Dynamic Island
 * Core Principle: Minimal Distraction, Maximum Information Density
 * 
 * Z-Index Layer: z-50 (commandDock)
 * 
 * Structure:
 * └── The Dock (fixed bottom, floating bar)
 *     ├── Left: Captain Avatar + Status Ring (Pulsing when online)
 *     ├── Center: GO ONLINE Button (massive, industrial)
 *     └── Right: Earnings Display (metric typography)
 */

// Z-Index Layer System (Phase 2)
const Z_INDEX = {
  mapBase: 0,
  mapMarkers: 10,
  floatingControls: 20,
  floatingHeader: 30,
  sidebar: 40,
  commandDock: 50,
  modals: 60,
};

const CAPTAIN_COLORS = {
  background: '#000000',
  surface: '#1A1A1A',
  elevated: '#2A2A2A',
  online: '#10B981',
  offline: '#6B7280',
  busy: '#F59E0B',
  warning: '#EF4444',
  glass: 'rgba(0, 0, 0, 0.8)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
};

function CommandDock({ 
  captain, 
  earnings = { today: 0 }, 
  rides = { accepted: 0 },
  isOnline,
  onToggleOnline,
  isBusy = false 
}) {
  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Spring animation config for Tesla-smooth feel
  const springConfig = {
    type: "spring",
    damping: 30,
    stiffness: 300
  };

  // Get captain initials
  const captainInitials = useMemo(() => {
    const first = captain?.fullname?.firstname?.[0] || '';
    const last = captain?.fullname?.lastname?.[0] || '';
    return (first + last).toUpperCase() || 'C';
  }, [captain]);

  // Format earnings for display
  const formattedEarnings = useMemo(() => {
    const amount = earnings?.today || 0;
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toLocaleString('es-CO', { maximumFractionDigits: 0 });
  }, [earnings]);

  // Get status color
  const statusColor = isBusy ? CAPTAIN_COLORS.busy : (isOnline ? CAPTAIN_COLORS.online : CAPTAIN_COLORS.offline);

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...springConfig, delay: 0.2 }}
      className="fixed bottom-0 left-0 right-0"
      style={{ 
        zIndex: Z_INDEX.commandDock,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)' 
      }}
    >
      {/* The Command Dock - Tesla Industrial Design */}
      <div 
        className="mx-4 mb-4 rounded-[28px] overflow-hidden"
        style={{
          background: CAPTAIN_COLORS.glass,
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          border: `1px solid ${CAPTAIN_COLORS.glassBorder}`,
          boxShadow: '0 -4px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
        }}
      >
        {/* Subtle top glow accent */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            
            {/* LEFT: Captain Avatar with Status Ring */}
            <div className="relative flex-shrink-0">
              {/* Pulsing ring when online */}
              <AnimatePresence>
                {isOnline && !isBusy && (
                  <motion.div
                    initial={prefersReducedMotion ? {} : { scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={prefersReducedMotion ? {} : { scale: 0.8, opacity: 0 }}
                    className="absolute -inset-1.5 rounded-full"
                    style={{
                      border: `2px solid ${CAPTAIN_COLORS.online}`,
                      animation: prefersReducedMotion ? 'none' : 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Avatar */}
              {captain?.profileImage ? (
                <img
                  src={captain.profileImage}
                  alt={captain?.fullname?.firstname || 'Captain'}
                  className="w-14 h-14 rounded-full object-cover border-2 shadow-lg"
                  style={{ borderColor: statusColor }}
                />
              ) : (
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-2"
                  style={{ 
                    background: `linear-gradient(135deg, ${CAPTAIN_COLORS.elevated} 0%, ${CAPTAIN_COLORS.surface} 100%)`,
                    borderColor: statusColor
                  }}
                >
                  {captainInitials}
                </div>
              )}

              {/* Status dot */}
              <motion.div
                animate={isOnline && !isBusy ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2"
                style={{ 
                  backgroundColor: statusColor,
                  borderColor: CAPTAIN_COLORS.background,
                  boxShadow: `0 0 8px ${statusColor}`
                }}
              />
            </div>

            {/* CENTER: GO ONLINE Button - Massive Industrial Toggle */}
            <div className="flex-1 flex justify-center">
              <motion.button
                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                onClick={onToggleOnline}
                disabled={isBusy}
                className={`
                  relative px-8 py-3 rounded-full font-bold text-base uppercase tracking-wider
                  transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center gap-2
                `}
                style={{
                  background: isOnline 
                    ? `linear-gradient(135deg, ${CAPTAIN_COLORS.online} 0%, #059669 100%)`
                    : `linear-gradient(135deg, ${CAPTAIN_COLORS.elevated} 0%, ${CAPTAIN_COLORS.surface} 100%)`,
                  color: isOnline ? '#FFFFFF' : '#9CA3AF',
                  boxShadow: isOnline 
                    ? `0 4px 20px ${CAPTAIN_COLORS.online}50, inset 0 1px 0 rgba(255, 255, 255, 0.2)`
                    : '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${isOnline ? CAPTAIN_COLORS.online : CAPTAIN_COLORS.glassBorder}`
                }}
              >
                <Power className="w-5 h-5" />
                <span>{isBusy ? 'EN VIAJE' : (isOnline ? 'ONLINE' : 'OFFLINE')}</span>
                {isOnline && !isBusy && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-white"
                  />
                )}
              </motion.button>
            </div>

            {/* RIGHT: Earnings Display - Metric Typography */}
            <div className="flex-shrink-0 text-right">
              <p 
                className="text-[10px] font-medium uppercase tracking-wider mb-0.5"
                style={{ color: 'rgba(255, 255, 255, 0.4)' }}
              >
                <Zap className="w-3 h-3 inline mr-1" style={{ color: CAPTAIN_COLORS.online }} />
                HOY
              </p>
              <div className="flex items-baseline gap-0.5 justify-end">
                <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>$</span>
                <motion.span
                  key={formattedEarnings}
                  initial={prefersReducedMotion ? {} : { scale: 1.1, color: CAPTAIN_COLORS.online }}
                  animate={{ scale: 1, color: '#FFFFFF' }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl font-bold tracking-tight"
                  style={{
                    textShadow: `0 0 20px ${CAPTAIN_COLORS.online}30`
                  }}
                >
                  {formattedEarnings}
                </motion.span>
              </div>
              <div className="flex items-center justify-end gap-1 mt-0.5">
                <TrendingUp className="w-3 h-3" style={{ color: CAPTAIN_COLORS.online }} />
                <span className="text-[10px] font-medium" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                  {rides?.accepted || 0} viajes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for pulse ring animation */}
      <style>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.5;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </motion.div>
  );
}

export default CommandDock;
