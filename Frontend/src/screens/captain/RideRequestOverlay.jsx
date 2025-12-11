import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, DollarSign, User, Clock, X } from 'lucide-react';
import { GlassCard, Button } from '../../components/atoms';
import { FADE_VARIANTS, SCALE_VARIANTS, triggerHaptic } from '../../design-system';

/**
 * RideRequestOverlay Component - Ride Request Takeover Screen
 * 
 * Full-screen overlay when a ride request comes in for captain.
 * Features 30-second countdown timer and ride details.
 * 
 * @param {boolean} isOpen - Controls visibility
 * @param {Object} request - Ride request object
 * @param {function} onAccept - Accept ride handler
 * @param {function} onReject - Reject ride handler
 * @param {number} timeout - Timeout in seconds (default 30)
 */
function RideRequestOverlay({
  isOpen,
  request = {},
  onAccept,
  onReject,
  timeout = 30,
}) {
  const [timeLeft, setTimeLeft] = useState(timeout);
  const [isAccepting, setIsAccepting] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(timeout);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onReject?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, timeout, onReject]);

  const handleAccept = async () => {
    setIsAccepting(true);
    triggerHaptic('success');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    onAccept?.(request);
  };

  const handleReject = () => {
    triggerHaptic('warning');
    onReject?.();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const {
    passenger = {},
    pickup = {},
    destination = {},
    fare = 0,
    distance = '0 km',
    estimatedDuration = '0 min',
  } = request;

  // Calculate circle progress
  const progress = (timeLeft / timeout) * 100;
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={FADE_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[100] bg-gradient-to-br from-gray-900 via-black to-gray-900"
        >
          <div className="h-full flex flex-col items-center justify-center p-6">
            {/* Timer Circle */}
            <motion.div
              variants={SCALE_VARIANTS}
              className="relative mb-8"
            >
              <svg className="w-32 h-32 transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="45"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="8"
                />
                {/* Progress circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="45"
                  fill="none"
                  stroke={timeLeft <= 10 ? "#ef4444" : "#10b981"}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              
              {/* Time display */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-white'}`}>
                    {timeLeft}
                  </div>
                  <div className="text-xs text-gray-400">seconds</div>
                </div>
              </div>
            </motion.div>

            {/* Request Details */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-md space-y-4"
            >
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                New Ride Request
              </h2>

              {/* Passenger Info */}
              <GlassCard variant="dark" className="text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{passenger.name || 'Passenger'}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      {passenger.rating && (
                        <>
                          <span>⭐ {passenger.rating.toFixed(1)}</span>
                          <span>•</span>
                        </>
                      )}
                      <span>{passenger.trips || 0} trips</span>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Route Info */}
              <GlassCard variant="dark" className="text-white space-y-3">
                {/* Pickup */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">Pickup</p>
                    <p className="font-medium">{pickup.address || 'Pickup location'}</p>
                  </div>
                </div>

                {/* Destination */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">Destination</p>
                    <p className="font-medium">{destination.address || 'Destination'}</p>
                  </div>
                </div>
              </GlassCard>

              {/* Trip Details */}
              <div className="grid grid-cols-2 gap-3">
                <GlassCard variant="dark" className="text-white text-center">
                  <Navigation className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                  <p className="text-sm text-gray-400">Distance</p>
                  <p className="font-bold">{distance}</p>
                </GlassCard>

                <GlassCard variant="dark" className="text-white text-center">
                  <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <p className="text-sm text-gray-400">Duration</p>
                  <p className="font-bold">{estimatedDuration}</p>
                </GlassCard>
              </div>

              {/* Fare Display */}
              <GlassCard variant="dark" className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border-emerald-500/30">
                <div className="text-center text-white">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    <p className="text-sm text-emerald-300">Estimated Earning</p>
                  </div>
                  <div className="text-5xl font-bold text-emerald-400">
                    {formatCurrency(fare)}
                  </div>
                </div>
              </GlassCard>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleReject}
                  disabled={isAccepting}
                  className="flex-1 py-4 rounded-2xl bg-gray-800 hover:bg-gray-700 text-white font-bold transition-colors disabled:opacity-50"
                >
                  Decline
                </button>
                
                <button
                  onClick={handleAccept}
                  disabled={isAccepting}
                  className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold transition-all shadow-xl hover:shadow-2xl disabled:opacity-50"
                >
                  {isAccepting ? 'Accepting...' : 'Accept'}
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default RideRequestOverlay;
