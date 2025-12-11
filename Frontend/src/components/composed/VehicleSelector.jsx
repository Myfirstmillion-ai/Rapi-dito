import { motion } from 'framer-motion';
import { Check, Users, Clock } from 'lucide-react';
import { GlassCard } from '../atoms';
import { SCALE_TAP, triggerHaptic } from '../../design-system';
import { cn } from '../../utils/cn';

/**
 * VehicleSelector Component - Horizontal Carousel of Vehicle Cards
 * 
 * Displays available vehicles in a scrollable carousel with
 * pricing, capacity, and selection state.
 * 
 * @param {Array} vehicles - Array of vehicle objects
 * @param {string} selectedVehicle - ID of selected vehicle
 * @param {function} onSelect - Selection handler
 * @param {Object} fare - Fare information object
 */
function VehicleSelector({
  vehicles = [],
  selectedVehicle = null,
  onSelect,
  fare = null,
}) {
  // Default vehicles if none provided
  const defaultVehicles = [
    {
      id: 'mini',
      type: 'Rapi-dito Mini',
      icon: '🚗',
      capacity: 4,
      eta: '2 min',
      price: 2500,
      priceMultiplier: 1,
      description: 'Affordable rides',
    },
    {
      id: 'sedan',
      type: 'Rapi-dito Sedan',
      icon: '🚙',
      capacity: 4,
      eta: '3 min',
      price: 3500,
      priceMultiplier: 1.4,
      description: 'Comfortable rides',
    },
    {
      id: 'suv',
      type: 'Rapi-dito SUV',
      icon: '🚐',
      capacity: 6,
      eta: '5 min',
      price: 5000,
      priceMultiplier: 2,
      description: 'Extra space',
    },
    {
      id: 'premium',
      type: 'Rapi-dito Premium',
      icon: '✨',
      capacity: 4,
      eta: '4 min',
      price: 7500,
      priceMultiplier: 3,
      description: 'Luxury experience',
    },
  ];

  const vehicleList = vehicles.length > 0 ? vehicles : defaultVehicles;

  const handleSelect = (vehicle) => {
    triggerHaptic('medium');
    onSelect?.(vehicle);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4 px-4">
        <h3 className="text-lg font-bold text-gray-900">Choose a ride</h3>
        {fare && (
          <p className="text-sm text-gray-500 mt-1">
            {fare.distance} • {fare.duration}
          </p>
        )}
      </div>

      {/* Vehicle Cards Carousel */}
      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-3 px-4">
          {vehicleList.map((vehicle) => {
            const isSelected = selectedVehicle === vehicle.id;
            const displayPrice = fare 
              ? fare.basePrice * vehicle.priceMultiplier 
              : vehicle.price;

            return (
              <motion.div
                key={vehicle.id}
                whileTap={SCALE_TAP}
                onClick={() => handleSelect(vehicle)}
                className="flex-shrink-0 w-72"
              >
                <GlassCard
                  variant="light"
                  className={cn(
                    "relative cursor-pointer transition-all duration-300 hover:shadow-xl",
                    isSelected 
                      ? "ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/20" 
                      : "ring-1 ring-gray-200"
                  )}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg"
                    >
                      <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    </motion.div>
                  )}

                  {/* Content */}
                  <div className="space-y-3">
                    {/* Vehicle Info */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{vehicle.icon}</div>
                        <div>
                          <h4 className="font-bold text-gray-900">{vehicle.type}</h4>
                          <p className="text-sm text-gray-500">{vehicle.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Details Row */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{vehicle.capacity}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{vehicle.eta}</span>
                      </div>
                    </div>

                    {/* Price Display */}
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-end justify-between">
                        <span className="text-sm text-gray-500">Estimated fare</span>
                        <div className="text-right">
                          <div className={cn(
                            "font-bold text-2xl transition-colors",
                            isSelected ? "text-emerald-600" : "text-gray-900"
                          )}>
                            {formatPrice(displayPrice)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Helper Text */}
      <div className="mt-2 px-4">
        <p className="text-xs text-gray-500 text-center">
          Swipe to see more options • Prices may vary based on demand
        </p>
      </div>
    </div>
  );
}

export default VehicleSelector;
