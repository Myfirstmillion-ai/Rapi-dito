import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, Phone, MessageSquare, CheckCircle, MapPin } from 'lucide-react';
import { LuxuryMap } from '../../components/maps';
import { GlassCard, Button, Input, Avatar } from '../../components/atoms';
import { SLIDE_UP_VARIANTS, triggerHaptic } from '../../design-system';

/**
 * CaptainActiveRide Component - Captain Navigation Mode
 * 
 * Shows different UI based on ride phase:
 * - to_pickup: Navigating to pickup location
 * - waiting: Arrived, waiting for passenger
 * - to_destination: Trip in progress
 * - completed: Trip finished
 * 
 * @param {Object} ride - Current ride object
 * @param {string} phase - Current phase of ride
 * @param {function} onStartTrip - Start trip handler (after OTP verification)
 * @param {function} onCompleteTrip - Complete trip handler
 * @param {function} onCall - Call passenger handler
 * @param {function} onMessage - Message passenger handler
 */
function CaptainActiveRide({
  ride = {},
  phase = 'to_pickup',
  onStartTrip,
  onCompleteTrip,
  onCall,
  onMessage,
}) {
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [eta, setEta] = useState('5 min');
  const [distance, setDistance] = useState('2.3 km');

  const { passenger = {}, pickup = {}, destination = {}, otp = '' } = ride;

  // Simulate ETA updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Mock ETA countdown
      setEta(prev => {
        const mins = parseInt(prev);
        if (mins > 0) {
          return `${mins - 1} min`;
        }
        return 'Arriving';
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleVerifyOtp = async () => {
    if (otpInput.length !== 4) {
      setOtpError('Please enter 4-digit OTP');
      return;
    }

    setIsVerifying(true);
    
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (otpInput === otp) {
      triggerHaptic('success');
      setOtpError('');
      onStartTrip?.();
    } else {
      triggerHaptic('error');
      setOtpError('Invalid OTP. Please try again.');
      setIsVerifying(false);
    }
  };

  const handleCompleteTrip = () => {
    triggerHaptic('success');
    onCompleteTrip?.();
  };

  const handleCall = () => {
    triggerHaptic('medium');
    if (passenger?.phone) {
      window.location.href = `tel:${passenger.phone}`;
    }
    onCall?.();
  };

  const handleMessage = () => {
    triggerHaptic('medium');
    onMessage?.();
  };

  const phaseConfig = {
    to_pickup: {
      title: 'Navigate to Pickup',
      subtitle: `${eta} • ${distance}`,
      destination: pickup,
      showOtpInput: false,
      showCompleteButton: false,
    },
    waiting: {
      title: 'Arrived at Pickup',
      subtitle: 'Waiting for passenger',
      destination: pickup,
      showOtpInput: true,
      showCompleteButton: false,
    },
    to_destination: {
      title: 'Trip in Progress',
      subtitle: `${eta} to destination`,
      destination: destination,
      showOtpInput: false,
      showCompleteButton: true,
    },
    completed: {
      title: 'Trip Completed',
      subtitle: 'Thank you!',
      destination: destination,
      showOtpInput: false,
      showCompleteButton: false,
    },
  };

  const config = phaseConfig[phase] || phaseConfig.to_pickup;

  return (
    <div className="relative w-full h-screen-dvh">
      {/* Full-Screen Map */}
      <div className="absolute inset-0">
        <LuxuryMap
          userLocation={ride.captainLocation}
          destination={config.destination?.coordinates}
          showRoute
          showNavigation
        />
      </div>

      {/* Top Status Bar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="absolute top-0 left-0 right-0 z-40 pt-safe px-4 py-4"
      >
        <GlassCard variant="light">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <Navigation className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{config.title}</h3>
              <p className="text-sm text-gray-600">{config.subtitle}</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Bottom Panel */}
      <AnimatePresence>
        <motion.div
          variants={SLIDE_UP_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute bottom-0 left-0 right-0 z-40 pb-safe"
        >
          <div className="bg-white rounded-t-3xl shadow-2xl p-6 space-y-4">
            {/* Passenger Info */}
            <div className="flex items-center gap-4">
              <Avatar
                src={passenger.avatar}
                alt={passenger.name}
                fallback={passenger.name?.charAt(0)}
                size="lg"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{passenger.name || 'Passenger'}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {passenger.rating && (
                    <>
                      <span>⭐ {passenger.rating.toFixed(1)}</span>
                      <span>•</span>
                    </>
                  )}
                  <span>{passenger.trips || 0} trips</span>
                </div>
              </div>
              
              {/* Contact Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleCall}
                  className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <Phone className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={handleMessage}
                  className="w-12 h-12 rounded-full bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-emerald-700" />
                </button>
              </div>
            </div>

            {/* Destination Address */}
            <GlassCard variant="subtle">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">
                    {phase === 'to_pickup' || phase === 'waiting' ? 'Pickup Location' : 'Destination'}
                  </p>
                  <p className="font-medium text-gray-900">
                    {config.destination?.address || 'Location'}
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* OTP Input (only in waiting phase) */}
            {config.showOtpInput && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter passenger OTP
                  </label>
                  <Input
                    type="text"
                    maxLength={4}
                    value={otpInput}
                    onChange={(e) => {
                      setOtpInput(e.target.value.replace(/\D/g, ''));
                      setOtpError('');
                    }}
                    placeholder="1234"
                    className="text-center text-2xl font-bold tracking-widest"
                  />
                  {otpError && (
                    <p className="text-red-500 text-sm mt-1">{otpError}</p>
                  )}
                </div>
                
                <Button
                  title={isVerifying ? "Verifying..." : "Start Trip"}
                  onClick={handleVerifyOtp}
                  variant="primary"
                  classes="w-full"
                  loading={isVerifying}
                  disabled={otpInput.length !== 4 || isVerifying}
                />
              </div>
            )}

            {/* Complete Trip Button */}
            {config.showCompleteButton && (
              <Button
                title="Complete Trip"
                onClick={handleCompleteTrip}
                variant="primary"
                classes="w-full"
                icon={<CheckCircle className="w-5 h-5" />}
              />
            )}

            {/* Navigation Button */}
            {phase !== 'completed' && (
              <button
                onClick={() => {
                  // Open Google Maps navigation
                  const coords = config.destination?.coordinates;
                  if (coords) {
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`,
                      '_blank'
                    );
                  }
                }}
                className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Navigation className="w-5 h-5" />
                Open in Maps
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default CaptainActiveRide;
