import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { LuxuryMap } from '../../components/maps';
import { RideStatusCard, DriverCard } from '../../components/composed';
import { FADE_VARIANTS } from '../../design-system';

/**
 * ActiveRideScreen Component - Active Ride Tracking
 * 
 * Full-screen map with driver tracking and ride status.
 * 
 * @param {Object} ride - Current ride object
 * @param {Object} driver - Driver information
 * @param {string} status - Current ride status
 * @param {function} onCancel - Cancel ride handler
 * @param {function} onComplete - Ride completion handler
 * @param {function} onCall - Call driver handler
 * @param {function} onMessage - Message driver handler
 */
function ActiveRideScreen({
  ride = {},
  driver = {},
  status = 'searching',
  onCancel,
  onComplete,
  onCall,
  onMessage,
}) {
  const [eta, setEta] = useState('2 min');
  const [distance, setDistance] = useState('0.5 km');

  // Simulate ETA updates
  useEffect(() => {
    if (status === 'driver_arriving' || status === 'ride_started') {
      const interval = setInterval(() => {
        // Mock ETA countdown
        setEta(prev => {
          const mins = parseInt(prev);
          if (mins > 0) {
            return `${mins - 1} min`;
          }
          return prev;
        });
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [status]);

  const getDriverName = () => {
    return driver?.name || 'Your driver';
  };

  return (
    <div className="relative w-full h-screen-dvh">
      {/* Full-Screen Map */}
      <div className="absolute inset-0">
        <LuxuryMap
          pickup={ride.pickup?.coordinates}
          destination={ride.destination?.coordinates}
          driverLocation={driver?.location}
          showRoute={status !== 'searching'}
          trackDriver={status === 'driver_arriving' || status === 'ride_started'}
        />
      </div>

      {/* Status Card at Top */}
      <AnimatePresence>
        <RideStatusCard
          status={status}
          eta={eta}
          distance={distance}
          driverName={getDriverName()}
          onCancel={status === 'searching' || status === 'driver_arriving' ? onCancel : undefined}
        />
      </AnimatePresence>

      {/* Driver Card at Bottom */}
      <AnimatePresence>
        {(status === 'driver_found' || status === 'driver_arriving' || status === 'ride_started') && driver && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-40 pb-safe px-4 mb-4"
          >
            <DriverCard
              driver={driver}
              otp={ride.otp}
              variant="full"
              onCall={onCall}
              onMessage={onMessage}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Searching Overlay */}
      <AnimatePresence>
        {status === 'searching' && (
          <motion.div
            variants={FADE_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 flex items-center justify-center"
          >
            <div className="text-center text-white px-6">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-20 h-20 mx-auto mb-6"
              >
                <div className="w-full h-full rounded-full border-4 border-white border-t-transparent animate-spin" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Finding your ride...</h3>
              <p className="text-white/80">This usually takes less than a minute</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ride Completed Overlay */}
      <AnimatePresence>
        {status === 'ride_completed' && (
          <motion.div
            variants={FADE_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 z-50 flex items-center justify-center"
          >
            <div className="text-center text-white px-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="text-8xl mb-6"
              >
                ✓
              </motion.div>
              <h2 className="text-3xl font-bold mb-4">Ride Completed!</h2>
              <p className="text-white/90 mb-8">Hope you had a great trip</p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onComplete}
                className="bg-white text-emerald-600 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-shadow"
              >
                Done
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ActiveRideScreen;
