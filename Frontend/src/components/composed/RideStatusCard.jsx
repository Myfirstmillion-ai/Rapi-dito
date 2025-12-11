import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, X, Clock, Navigation } from 'lucide-react';
import { GlassCard } from '../atoms';
import { PULSE_VARIANTS, triggerHaptic } from '../../design-system';
import { cn } from '../../utils/cn';

/**
 * RideStatusCard Component - Floating Status Card
 * 
 * Shows ride status at top of screen with animations.
 * 
 * @param {string} status - Current ride status (searching, driver_arriving, ride_started, etc.)
 * @param {string} eta - Estimated time of arrival
 * @param {string} distance - Distance to pickup/destination
 * @param {string} driverName - Driver's name
 * @param {function} onCancel - Cancel ride handler
 * @param {string} className - Additional classes
 */
function RideStatusCard({
  status = 'searching',
  eta = "",
  distance = "",
  driverName = "",
  onCancel,
  className = "",
}) {
  const statusConfig = {
    searching: {
      title: 'Finding your ride...',
      subtitle: 'Searching for nearby drivers',
      color: 'emerald',
      icon: Loader2,
      animated: true,
      showCancel: true,
    },
    driver_found: {
      title: 'Driver found!',
      subtitle: `${driverName} is on the way`,
      color: 'emerald',
      icon: Navigation,
      animated: false,
      showCancel: true,
    },
    driver_arriving: {
      title: `${driverName} is arriving`,
      subtitle: `${eta} away • ${distance}`,
      color: 'blue',
      icon: Clock,
      animated: false,
      showCancel: true,
    },
    ride_started: {
      title: 'Trip in progress',
      subtitle: `${eta} to destination • ${distance}`,
      color: 'emerald',
      icon: Navigation,
      animated: false,
      showCancel: false,
    },
  };

  const config = statusConfig[status] || statusConfig.searching;
  const Icon = config.icon;

  const handleCancel = () => {
    triggerHaptic('warning');
    onCancel?.();
  };

  const colorClasses = {
    emerald: {
      bg: 'from-emerald-500 to-emerald-600',
      text: 'text-emerald-600',
      progress: 'bg-emerald-500',
    },
    blue: {
      bg: 'from-blue-500 to-blue-600',
      text: 'text-blue-600',
      progress: 'bg-blue-500',
    },
  };

  const colors = colorClasses[config.color] || colorClasses.emerald;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn("fixed top-4 left-4 right-4 z-50", className)}
    >
      <GlassCard variant="light" className="shadow-2xl">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className={cn(
            "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br",
            colors.bg
          )}>
            {config.animated ? (
              <motion.div variants={PULSE_VARIANTS} animate="animate">
                <Icon className="w-6 h-6 text-white animate-spin" />
              </motion.div>
            ) : (
              <Icon className="w-6 h-6 text-white" />
            )}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-900 truncate">{config.title}</h4>
            <p className="text-sm text-gray-600 truncate">{config.subtitle}</p>
          </div>

          {/* Cancel Button */}
          {config.showCancel && onCancel && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleCancel}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </motion.button>
          )}
        </div>

        {/* Progress Bar for searching */}
        {status === 'searching' && (
          <motion.div
            className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden"
          >
            <motion.div
              className={cn("h-full rounded-full", colors.progress)}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        )}
      </GlassCard>
    </motion.div>
  );
}

export default RideStatusCard;
