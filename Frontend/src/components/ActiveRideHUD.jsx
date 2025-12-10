import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Navigation, 
  MapPin, 
  Phone, 
  MessageSquare, 
  X, 
  ChevronUp,
  Shield,
  CheckCircle2
} from 'lucide-react';

/**
 * ActiveRideHUD - Swiss Minimalist Luxury Heads-Up Display
 * Bottom sheet for captain's active ride management
 * 
 * Design Philosophy:
 * - Clean dark glass aesthetic
 * - Clear information hierarchy
 * - Elegant action buttons
 * - Minimal distraction
 */

const RIDE_STATUS = {
  NAVIGATING_TO_PICKUP: 'navigating_to_pickup',
  WAITING_FOR_OTP: 'waiting_for_otp',
  IN_RIDE: 'in_ride'
};

function ActiveRideHUD({
  rideData,
  rideStatus = RIDE_STATUS.NAVIGATING_TO_PICKUP,
  otp,
  onOtpChange,
  onVerifyOtp,
  onEndRide,
  onCancelRide,
  onCall,
  onMessage,
  loading = false,
  error = '',
  unreadMessages = 0
}) {
  const [isExpanded, setIsExpanded] = useState(true);

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

  // Get user initials
  const userInitials = useMemo(() => {
    const first = rideData?.user?.fullname?.firstname?.[0] || '';
    const last = rideData?.user?.fullname?.lastname?.[0] || '';
    return (first + last).toUpperCase() || 'U';
  }, [rideData]);

  // Get status-specific content
  const getStatusContent = () => {
    switch (rideStatus) {
      case RIDE_STATUS.NAVIGATING_TO_PICKUP:
        return {
          title: 'Hacia el pasajero',
          subtitle: rideData?.pickup?.split(',')[0] || 'Recogida',
          icon: Navigation,
          color: 'emerald'
        };
      case RIDE_STATUS.WAITING_FOR_OTP:
        return {
          title: 'Verificar código',
          subtitle: 'Solicita el código al pasajero',
          icon: Shield,
          color: 'amber'
        };
      case RIDE_STATUS.IN_RIDE:
        return {
          title: 'En viaje',
          subtitle: rideData?.destination?.split(',')[0] || 'Destino',
          icon: MapPin,
          color: 'blue'
        };
      default:
        return {
          title: 'Viaje activo',
          subtitle: '',
          icon: Navigation,
          color: 'emerald'
        };
    }
  };

  const statusContent = getStatusContent();
  const StatusIcon = statusContent.icon;

  // Color classes based on status
  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      text: 'text-emerald-600 dark:text-emerald-400',
      bar: 'bg-emerald-500',
      button: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-500/25'
    },
    amber: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
      text: 'text-amber-600 dark:text-amber-400',
      bar: 'bg-amber-500',
      button: 'from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-amber-500/25'
    },
    blue: {
      bg: 'bg-blue-500/10 dark:bg-blue-500/20',
      text: 'text-blue-600 dark:text-blue-400',
      bar: 'bg-blue-500',
      button: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-500/25'
    }
  };

  const colors = colorClasses[statusContent.color];

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={prefersReducedMotion ? {} : { y: 100, opacity: 0 }}
      transition={springConfig}
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Main Container */}
      <div className="mx-3 mb-3 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Status indicator bar at top */}
        <div className={`h-1 ${colors.bar}`} />

        {/* Compact Header - Always visible */}
        <div 
          className="px-5 py-4 flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            {/* Status Icon */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.bg}`}>
              <StatusIcon className={`w-5 h-5 ${colors.text}`} />
            </div>

            {/* Status Text */}
            <div>
              <p className="text-base font-bold text-gray-900 dark:text-white">{statusContent.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[180px]">{statusContent.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Fare Badge */}
            <div className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                ${Math.floor((rideData?.fare || 0) / 1000)}K
              </span>
            </div>

            {/* Expand/Collapse Icon */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronUp className="w-5 h-5 text-gray-400" />
            </motion.div>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5">
                
                {/* Passenger Info Card */}
                <div className="rounded-2xl p-4 bg-gray-50 dark:bg-gray-800 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Passenger Avatar */}
                      {rideData?.user?.profileImage ? (
                        <img
                          src={rideData.user.profileImage}
                          alt="Passenger"
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold bg-gradient-to-br from-emerald-500 to-emerald-600">
                          {userInitials}
                        </div>
                      )}

                      <div>
                        <p className="text-base font-bold text-gray-900 dark:text-white">
                          {rideData?.user?.fullname?.firstname} {rideData?.user?.fullname?.lastname?.[0]}.
                        </p>
                        {rideData?.user?.rating && (
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500 text-sm">★</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{rideData.user.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onMessage?.(rideData?._id)}
                        className="relative w-11 h-11 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        {unreadMessages > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-red-500">
                            {unreadMessages}
                          </span>
                        )}
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onCall?.(rideData?.user?.phone)}
                        className="w-11 h-11 rounded-xl flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 transition-colors"
                      >
                        <Phone className="w-5 h-5 text-white" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* OTP Input Section */}
                {rideStatus === RIDE_STATUS.WAITING_FOR_OTP && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 text-center">Ingresa el código de 6 dígitos</p>
                    <input
                      type="number"
                      value={otp}
                      onChange={(e) => onOtpChange?.(e.target.value)}
                      placeholder="• • • • • •"
                      maxLength={6}
                      className={`w-full py-4 px-4 rounded-2xl text-center text-2xl font-bold tracking-[0.5em] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition-all border-2 ${
                        error ? 'border-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-amber-500'
                      }`}
                    />
                    {error && (
                      <p className="text-center mt-2 text-sm font-medium text-red-500">
                        {error}
                      </p>
                    )}
                  </div>
                )}

                {/* Route Display */}
                <div className="rounded-2xl p-3 bg-gray-50 dark:bg-gray-800 mb-4">
                  {/* Pickup */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <p className="text-sm text-gray-600 dark:text-gray-300 flex-1 truncate">
                      {rideData?.pickup?.split(',')[0]}
                    </p>
                  </div>

                  {/* Destination */}
                  <div className="flex items-center gap-3">
                    <MapPin className="w-3 h-3 text-red-500" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white flex-1 truncate">
                      {rideData?.destination?.split(',')[0]}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {/* Cancel Button */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={onCancelRide}
                    className="flex-1 py-3.5 rounded-2xl font-semibold text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                    <span>Cancelar</span>
                  </motion.button>

                  {/* Primary Action Button */}
                  {rideStatus === RIDE_STATUS.WAITING_FOR_OTP ? (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={onVerifyOtp}
                      disabled={loading || !otp || otp.length < 6}
                      className={`flex-[2] py-3.5 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 bg-gradient-to-r ${colors.button} shadow-lg transition-all`}
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Shield className="w-5 h-5" />
                          <span>Verificar OTP</span>
                        </>
                      )}
                    </motion.button>
                  ) : rideStatus === RIDE_STATUS.IN_RIDE ? (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={onEndRide}
                      disabled={loading}
                      className={`flex-[2] py-3.5 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 bg-gradient-to-r ${colors.button} shadow-lg transition-all`}
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Finalizar Viaje</span>
                        </>
                      )}
                    </motion.button>
                  ) : null}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default ActiveRideHUD;
export { RIDE_STATUS };
