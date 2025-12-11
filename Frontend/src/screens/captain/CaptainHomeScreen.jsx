import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Power, Menu, Bell, TrendingUp, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCaptain } from '../../contexts/CaptainContext';
import { SocketDataContext } from '../../contexts/SocketContext';
import { LuxuryMap } from '../../components/maps';
import { EarningsCard, QuickActions } from '../../components/composed';
import { IconButton, GlassCard, Badge } from '../../components/atoms';
import { AppShell } from '../../components/layout';
import RideRequestOverlay from './RideRequestOverlay';
import CaptainActiveRide from './CaptainActiveRide';
import { FADE_VARIANTS, SLIDE_UP_VARIANTS, triggerHaptic } from '../../design-system';

/**
 * CaptainHomeScreen - Captain Dashboard
 * 
 * Main screen for captains with:
 * - Online/Offline toggle
 * - Earnings bento grid
 * - Map preview
 * - Ride request notifications
 * - Quick actions
 */
function CaptainHomeScreen() {
  const navigate = useNavigate();
  const { captain } = useCaptain();
  const { socket } = useContext(SocketDataContext);
  
  const [isOnline, setIsOnline] = useState(false);
  const [currentRide, setCurrentRide] = useState(null);
  const [ridePhase, setRidePhase] = useState('idle'); // idle, request, to_pickup, waiting, to_destination, completed
  const [pendingRequest, setPendingRequest] = useState(null);
  const [notifications, setNotifications] = useState(0);

  // Mock earnings data
  const [earnings] = useState({
    today: 125000,
    todayRides: 8,
    week: 750000,
    rating: 4.8,
  });

  // Listen for socket events
  useEffect(() => {
    if (!socket || !isOnline) return;

    // New ride request
    socket.on('new-ride-request', (data) => {
      console.log('New ride request:', data);
      setPendingRequest(data);
      setRidePhase('request');
      triggerHaptic('heavy');
    });

    // Ride cancelled by user
    socket.on('ride-cancelled', () => {
      console.log('Ride cancelled by user');
      setCurrentRide(null);
      setRidePhase('idle');
      setPendingRequest(null);
    });

    return () => {
      socket.off('new-ride-request');
      socket.off('ride-cancelled');
    };
  }, [socket, isOnline]);

  // Toggle online/offline status
  const handleToggleOnline = () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    triggerHaptic('medium');
    
    // Emit status to socket
    if (socket) {
      socket.emit('captain-status', { 
        status: newStatus ? 'online' : 'offline',
        location: captain?.location,
      });
    }

    // Show notification
    console.log(`Captain is now ${newStatus ? 'online' : 'offline'}`);
  };

  // Handle accepting ride request
  const handleAcceptRequest = (request) => {
    console.log('Accepting ride request:', request);
    setCurrentRide(request);
    setRidePhase('to_pickup');
    setPendingRequest(null);
    
    // Emit acceptance to socket
    if (socket) {
      socket.emit('accept-ride', { 
        rideId: request.id,
        captainId: captain?.id,
      });
    }
  };

  // Handle rejecting ride request
  const handleRejectRequest = () => {
    console.log('Rejecting ride request');
    setRidePhase('idle');
    setPendingRequest(null);
    
    // Emit rejection to socket
    if (socket && pendingRequest) {
      socket.emit('reject-ride', { 
        rideId: pendingRequest.id,
      });
    }
  };

  // Handle starting trip (after OTP verification)
  const handleStartTrip = () => {
    console.log('Starting trip');
    setRidePhase('to_destination');
    
    if (socket && currentRide) {
      socket.emit('ride-started', { rideId: currentRide.id });
    }
  };

  // Handle completing trip
  const handleCompleteTrip = () => {
    console.log('Completing trip');
    setRidePhase('completed');
    
    if (socket && currentRide) {
      socket.emit('ride-ended', { rideId: currentRide.id });
    }
    
    // Return to idle after a delay
    setTimeout(() => {
      setCurrentRide(null);
      setRidePhase('idle');
      // Navigate to rating or earnings screen
    }, 2000);
  };

  // Quick actions configuration
  const quickActions = [
    {
      label: 'Earnings',
      icon: TrendingUp,
      onClick: () => navigate('/captain/earnings'),
      variant: 'primary',
    },
    {
      label: 'Ride History',
      icon: Navigation,
      onClick: () => navigate('/ride-history'),
      variant: 'secondary',
    },
  ];

  // Show active ride screen if in ride
  if (ridePhase === 'to_pickup' || ridePhase === 'waiting' || ridePhase === 'to_destination') {
    return (
      <CaptainActiveRide
        ride={currentRide}
        phase={ridePhase}
        onStartTrip={handleStartTrip}
        onCompleteTrip={handleCompleteTrip}
        onCall={() => console.log('Call passenger')}
        onMessage={() => navigate(`/chat/${currentRide?.passenger?.id}`)}
      />
    );
  }

  return (
    <>
      <AppShell>
        {/* Map Background */}
        <div className="absolute inset-0">
          <LuxuryMap 
            userLocation={captain?.location || { lat: 7.8146, lng: -72.4430 }}
            showUserMarker
          />
        </div>

        {/* Header */}
        <AnimatePresence>
          <motion.div
            variants={FADE_VARIANTS}
            initial="hidden"
            animate="visible"
            className="absolute top-0 left-0 right-0 z-30 pt-safe px-4 py-4"
          >
            <div className="flex items-center justify-between">
              <IconButton
                icon={Menu}
                onClick={() => navigate('/captain/menu')}
                variant="default"
              />
              
              <div className="flex-1 text-center">
                <h1 className="text-white text-lg font-bold drop-shadow-lg">
                  Captain Mode
                </h1>
              </div>
              
              <div className="relative">
                <IconButton
                  icon={Bell}
                  onClick={() => navigate('/notifications')}
                  variant="default"
                />
                {notifications > 0 && (
                  <Badge
                    variant="error"
                    className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-[10px]"
                  >
                    {notifications}
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Main Content */}
        <AnimatePresence>
          <motion.div
            variants={SLIDE_UP_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute bottom-0 left-0 right-0 z-30 pb-safe px-4 mb-4"
          >
            <div className="space-y-4">
              {/* Online/Offline Toggle */}
              <GlassCard variant="light">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">
                      {isOnline ? "You're Online" : "You're Offline"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {isOnline ? 'Accepting ride requests' : 'Go online to receive rides'}
                    </p>
                  </div>
                  
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleToggleOnline}
                    className={`
                      relative w-16 h-16 rounded-full flex items-center justify-center
                      transition-all duration-300 shadow-lg
                      ${isOnline 
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/50' 
                        : 'bg-gradient-to-br from-gray-400 to-gray-500'
                      }
                    `}
                  >
                    <Power className="w-8 h-8 text-white" />
                    {isOnline && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-emerald-500 opacity-20"
                      />
                    )}
                  </motion.button>
                </div>
              </GlassCard>

              {/* Earnings Card */}
              {isOnline && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <EarningsCard
                    todayEarnings={earnings.today}
                    todayRides={earnings.todayRides}
                    weekEarnings={earnings.week}
                    rating={earnings.rating}
                  />
                </motion.div>
              )}

              {/* Quick Actions */}
              <QuickActions 
                actions={quickActions}
                layout="grid"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </AppShell>

      {/* Ride Request Overlay */}
      <RideRequestOverlay
        isOpen={ridePhase === 'request'}
        request={pendingRequest}
        onAccept={handleAcceptRequest}
        onReject={handleRejectRequest}
        timeout={30}
      />
    </>
  );
}

export default CaptainHomeScreen;
