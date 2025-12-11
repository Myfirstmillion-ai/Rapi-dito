import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { SocketDataContext } from '../../contexts/SocketContext';
import { LuxuryMap } from '../../components/maps';
import { SearchBar, QuickActions } from '../../components/composed';
import { IconButton, Badge } from '../../components/atoms';
import { AppShell } from '../../components/layout';
import RideBookingFlow from './RideBookingFlow';
import ActiveRideScreen from './ActiveRideScreen';
import { FADE_VARIANTS, SLIDE_UP_VARIANTS, RIDE_STATUS } from '../../design-system';

/**
 * UserHomeScreen - Main User Entry Point
 * 
 * Manages the complete user ride experience with state transitions:
 * - idle: Default state with search bar
 * - booking: Location and vehicle selection flow
 * - matching: Finding a driver
 * - in_ride: Active ride tracking
 * - completed: Ride finished
 */
function UserHomeScreen() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { socket } = useContext(SocketDataContext);
  
  const [rideState, setRideState] = useState('idle'); // idle, booking, matching, in_ride, completed
  const [currentRide, setCurrentRide] = useState(null);
  const [currentDriver, setCurrentDriver] = useState(null);
  const [rideStatus, setRideStatus] = useState(RIDE_STATUS.IDLE);
  const [notifications, setNotifications] = useState(0);

  // Listen for socket events
  useEffect(() => {
    if (!socket) return;

    // Driver found event
    socket.on('ride-confirmed', (data) => {
      console.log('Ride confirmed:', data);
      setCurrentDriver(data.driver);
      setRideStatus(RIDE_STATUS.DRIVER_FOUND);
      setRideState('in_ride');
    });

    // Driver location updates
    socket.on('driver-location-updated', (data) => {
      console.log('Driver location updated:', data);
      if (currentDriver) {
        setCurrentDriver(prev => ({
          ...prev,
          location: data.location,
        }));
      }
    });

    // Ride started
    socket.on('ride-started', (data) => {
      console.log('Ride started:', data);
      setRideStatus(RIDE_STATUS.RIDE_STARTED);
    });

    // Ride completed
    socket.on('ride-ended', (data) => {
      console.log('Ride ended:', data);
      setRideStatus(RIDE_STATUS.RIDE_COMPLETED);
    });

    return () => {
      socket.off('ride-confirmed');
      socket.off('driver-location-updated');
      socket.off('ride-started');
      socket.off('ride-ended');
    };
  }, [socket, currentDriver]);

  // Handle search bar click
  const handleSearchClick = () => {
    setRideState('booking');
  };

  // Handle ride booking completion
  const handleBookingComplete = (rideData) => {
    console.log('Booking completed:', rideData);
    setCurrentRide(rideData);
    setRideState('matching');
    setRideStatus(RIDE_STATUS.SEARCHING);
    
    // Simulate finding a driver (in real app, this would be a socket event)
    setTimeout(() => {
      const mockDriver = {
        id: '1',
        name: 'Juan Pérez',
        rating: 4.8,
        totalRides: 1250,
        phone: '+57 300 123 4567',
        avatar: null,
        vehicle: {
          model: 'Toyota Corolla',
          color: 'Silver',
          plate: 'ABC-123',
        },
        location: {
          lat: 7.8146,
          lng: -72.4430,
        },
      };
      
      setCurrentDriver(mockDriver);
      setRideStatus(RIDE_STATUS.DRIVER_ARRIVING);
      setCurrentRide(prev => ({
        ...prev,
        otp: '1234',
      }));
    }, 3000);
  };

  // Handle booking cancellation
  const handleBookingCancel = () => {
    setRideState('idle');
    setCurrentRide(null);
  };

  // Handle ride cancellation
  const handleRideCancel = () => {
    if (confirm('Are you sure you want to cancel this ride?')) {
      setRideState('idle');
      setRideStatus(RIDE_STATUS.CANCELLED);
      setCurrentRide(null);
      setCurrentDriver(null);
      
      // Emit cancel event to socket
      if (socket && currentRide) {
        socket.emit('cancel-ride', { rideId: currentRide.id });
      }
    }
  };

  // Handle ride completion
  const handleRideComplete = () => {
    setRideState('idle');
    setRideStatus(RIDE_STATUS.IDLE);
    setCurrentRide(null);
    setCurrentDriver(null);
    
    // Navigate to rating screen (or show rating modal)
    // navigate('/rate-ride');
  };

  // Handle driver call
  const handleCallDriver = () => {
    if (currentDriver?.phone) {
      window.location.href = `tel:${currentDriver.phone}`;
    }
  };

  // Handle driver message
  const handleMessageDriver = () => {
    if (currentDriver) {
      navigate(`/chat/${currentDriver.id}`);
    }
  };

  // Quick actions configuration
  const quickActions = [
    {
      label: 'Ride History',
      icon: User,
      onClick: () => navigate('/ride-history'),
      variant: 'secondary',
    },
    {
      label: 'Notifications',
      icon: Bell,
      badge: notifications > 0 ? notifications : null,
      onClick: () => navigate('/notifications'),
      variant: 'secondary',
    },
  ];

  // Render based on state
  if (rideState === 'in_ride' || rideState === 'matching') {
    return (
      <ActiveRideScreen
        ride={currentRide}
        driver={currentDriver}
        status={rideStatus}
        onCancel={handleRideCancel}
        onComplete={handleRideComplete}
        onCall={handleCallDriver}
        onMessage={handleMessageDriver}
      />
    );
  }

  return (
    <AppShell>
      {/* Map Background */}
      <div className="absolute inset-0">
        <LuxuryMap 
          userLocation={{ lat: 7.8146, lng: -72.4430 }}
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
              onClick={() => navigate('/menu')}
              variant="default"
            />
            
            <div className="flex-1 text-center">
              <h1 className="text-white text-lg font-bold drop-shadow-lg">
                Welcome, {user?.fullName?.split(' ')[0] || 'User'}
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

      {/* Main Content - Search Bar */}
      <AnimatePresence>
        {rideState === 'idle' && (
          <motion.div
            variants={SLIDE_UP_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute bottom-0 left-0 right-0 z-30 pb-safe px-4 mb-4"
          >
            <div className="space-y-4">
              {/* Search Bar */}
              <SearchBar
                placeholder="Where to?"
                onClick={handleSearchClick}
                onFocus={handleSearchClick}
                showQuickActions={false}
              />
              
              {/* Quick Actions */}
              <QuickActions 
                actions={quickActions}
                layout="grid"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Flow */}
      <RideBookingFlow
        isActive={rideState === 'booking'}
        onComplete={handleBookingComplete}
        onCancel={handleBookingCancel}
      />
    </AppShell>
  );
}

export default UserHomeScreen;
