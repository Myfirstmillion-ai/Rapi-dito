import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Navigation, Calendar, DollarSign, Star, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlassCard, Avatar, IconButton, Badge, Spinner } from '../../components/atoms';
import { AppShell } from '../../components/layout';
import { STAGGER_CONTAINER, STAGGER_ITEM } from '../../design-system';

/**
 * RideHistoryScreen - Past Rides List
 * 
 * Displays ride history with filter tabs and details.
 */
function RideHistoryScreen() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all'); // all, completed, cancelled
  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load ride history
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockRides = [
        {
          id: '1',
          status: 'completed',
          date: new Date('2024-12-10T14:30:00'),
          pickup: { address: 'Plaza Bolívar, San Antonio' },
          destination: { address: 'Centro Comercial, San Antonio' },
          driver: {
            name: 'Juan Pérez',
            avatar: null,
            rating: 4.8,
            vehicle: 'Toyota Corolla',
          },
          fare: 15000,
          distance: '5.2 km',
          duration: '12 min',
          vehicleType: 'Rapi-dito Sedan',
        },
        {
          id: '2',
          status: 'completed',
          date: new Date('2024-12-09T18:15:00'),
          pickup: { address: 'Terminal de Buses' },
          destination: { address: 'Universidad Nacional' },
          driver: {
            name: 'María García',
            avatar: null,
            rating: 4.9,
            vehicle: 'Chevrolet Spark',
          },
          fare: 12500,
          distance: '3.8 km',
          duration: '8 min',
          vehicleType: 'Rapi-dito Mini',
        },
        {
          id: '3',
          status: 'cancelled',
          date: new Date('2024-12-08T10:00:00'),
          pickup: { address: 'Hospital Central' },
          destination: { address: 'Aeropuerto' },
          driver: null,
          fare: 0,
          reason: 'Cancelled by user',
        },
        {
          id: '4',
          status: 'completed',
          date: new Date('2024-12-07T20:45:00'),
          pickup: { address: 'Restaurante El Buen Sabor' },
          destination: { address: 'Residencias Los Álamos' },
          driver: {
            name: 'Carlos Rodríguez',
            avatar: null,
            rating: 4.7,
            vehicle: 'Nissan Versa',
          },
          fare: 18000,
          distance: '6.5 km',
          duration: '15 min',
          vehicleType: 'Rapi-dito Sedan',
        },
      ];
      
      setRides(mockRides);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredRides = rides.filter(ride => {
    if (activeFilter === 'all') return true;
    return ride.status === activeFilter;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today, ${new Intl.DateTimeFormat('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(date)}`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return new Intl.DateTimeFormat('es-CO', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date);
    }
  };

  const handleRideClick = (ride) => {
    navigate(`/ride-details/${ride.id}`);
  };

  return (
    <AppShell>
      <div className="flex flex-col h-screen-dvh bg-gray-50">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex-shrink-0 bg-white border-b border-gray-200 pt-safe"
        >
          <div className="flex items-center gap-3 px-4 py-4">
            <IconButton
              icon={ArrowLeft}
              onClick={() => navigate(-1)}
              variant="ghost"
              size="sm"
            />
            <h1 className="text-xl font-bold text-gray-900">Ride History</h1>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 px-4 pb-3">
            {[
              { id: 'all', label: 'All' },
              { id: 'completed', label: 'Completed' },
              { id: 'cancelled', label: 'Cancelled' },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`
                  px-4 py-2 rounded-full font-medium text-sm transition-all
                  ${activeFilter === filter.id
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Rides List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Spinner />
            </div>
          ) : filteredRides.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <Navigation className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No rides found</h3>
              <p className="text-gray-500">
                {activeFilter === 'all' 
                  ? "You haven't taken any rides yet"
                  : `No ${activeFilter} rides`
                }
              </p>
            </div>
          ) : (
            <motion.div
              variants={STAGGER_CONTAINER}
              initial="hidden"
              animate="visible"
              className="p-4 space-y-3"
            >
              {filteredRides.map((ride) => (
                <motion.div
                  key={ride.id}
                  variants={STAGGER_ITEM}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRideClick(ride)}
                >
                  <GlassCard variant="light" className="cursor-pointer hover:shadow-lg transition-shadow">
                    {/* Status Badge */}
                    <div className="flex items-start justify-between mb-3">
                      <Badge
                        variant={ride.status === 'completed' ? 'success' : 'error'}
                        className="capitalize"
                      >
                        {ride.status}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(ride.date)}</span>
                      </div>
                    </div>

                    {/* Route */}
                    <div className="space-y-2 mb-3">
                      <div className="flex gap-2">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        </div>
                        <p className="flex-1 text-sm text-gray-700 font-medium">
                          {ride.pickup.address}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="flex-1 text-sm text-gray-700 font-medium">
                          {ride.destination.address}
                        </p>
                      </div>
                    </div>

                    {/* Driver Info (if completed) */}
                    {ride.status === 'completed' && ride.driver && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-3">
                        <Avatar
                          src={ride.driver.avatar}
                          alt={ride.driver.name}
                          fallback={ride.driver.name.charAt(0)}
                          size="sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {ride.driver.name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>⭐ {ride.driver.rating}</span>
                            <span>•</span>
                            <span>{ride.driver.vehicle}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Ride Details */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {ride.distance && (
                          <>
                            <span>{ride.distance}</span>
                            <span>•</span>
                          </>
                        )}
                        {ride.duration && (
                          <span>{ride.duration}</span>
                        )}
                      </div>
                      
                      {ride.fare > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">
                            {formatCurrency(ride.fare)}
                          </span>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Cancellation Reason */}
                    {ride.status === 'cancelled' && ride.reason && (
                      <div className="mt-2 text-sm text-gray-500 italic">
                        {ride.reason}
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

export default RideHistoryScreen;
