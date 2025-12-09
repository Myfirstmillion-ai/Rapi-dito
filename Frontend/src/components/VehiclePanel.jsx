import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Users, Check, ChevronLeft, AlertCircle } from "lucide-react";
import { Z_INDEX } from "../utils/zIndex";

/**
 * VehiclePanel - Horizontal Vehicle Carousel
 * Process 2 - Phase 3: Ride Logic & Interactive Panels
 * 
 * Native iOS Apple Maps inspired vehicle selection
 * 
 * CRITICAL VALIDATION: All props must be validated before rendering
 * - Never crash on missing/invalid data
 * - Provide graceful fallbacks
 * - Log errors in development only
 * 
 * Features:
 * - Bottom sheet with spring physics
 * - Horizontal scrolling carousel
 * - Spotlight effect on selected vehicle
 * - Massive price typography (text-4xl)
 * - Comprehensive error handling
 */

// Validation helpers
const isValidBoolean = (value) => typeof value === 'boolean';
const isValidFunction = (value) => typeof value === 'function';
const isValidNumber = (value) => typeof value === 'number' && !isNaN(value);
const isValidString = (value) => typeof value === 'string';
const isValidObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

// Development-only logging
const logValidationError = (propName, expectedType, receivedValue) => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `[VehiclePanel] Invalid prop "${propName}": expected ${expectedType}, received ${typeof receivedValue}`,
      { received: receivedValue }
    );
  }
};

// Vehicle data with emojis - constant and validated
const VEHICLES = [
  {
    id: 1,
    name: "Rapidito",
    description: "Económico",
    type: "car",
    emoji: "🚗",
    image: "/Uber-PNG-Photos.png",
    capacity: "4 personas",
    eta: "3 min",
    color: "from-emerald-500 to-emerald-600"
  },
  {
    id: 2,
    name: "Moto",
    description: "Súper rápido",
    type: "bike",
    emoji: "🏍️",
    image: "/bike.webp",
    capacity: "1 persona",
    eta: "2 min",
    color: "from-blue-500 to-blue-600"
  }
];

function VehiclePanel({
  isOpen = false,
  onClose,
  onBack,
  onConfirm,
  fare = { car: 0, bike: 0 },
  routeInfo = { distance: '', duration: '' },
  selectedVehicleType = 'car',
  onSelectVehicle,
  loading = false
}) {
  // ===== PROP VALIDATION =====
  const safeIsOpen = isValidBoolean(isOpen) ? isOpen : false;
  const safeLoading = isValidBoolean(loading) ? loading : false;
  
  // Validate fare object
  const safeFare = useMemo(() => {
    if (!isValidObject(fare)) {
      logValidationError('fare', 'object', fare);
      return { car: 0, bike: 0 };
    }
    return {
      car: isValidNumber(fare.car) ? fare.car : 0,
      bike: isValidNumber(fare.bike) ? fare.bike : 0
    };
  }, [fare]);
  
  // Validate routeInfo object
  const safeRouteInfo = useMemo(() => {
    if (!isValidObject(routeInfo)) {
      logValidationError('routeInfo', 'object', routeInfo);
      return { distance: '', duration: '' };
    }
    return {
      distance: isValidString(routeInfo.distance) ? routeInfo.distance : '',
      duration: isValidString(routeInfo.duration) ? routeInfo.duration : ''
    };
  }, [routeInfo]);
  
  // Validate selectedVehicleType
  const safeSelectedVehicleType = useMemo(() => {
    const validTypes = VEHICLES.map(v => v.type);
    if (!validTypes.includes(selectedVehicleType)) {
      logValidationError('selectedVehicleType', `one of [${validTypes.join(', ')}]`, selectedVehicleType);
      return 'car';
    }
    return selectedVehicleType;
  }, [selectedVehicleType]);
  
  // Validate callback functions
  const safeOnClose = useCallback(() => {
    if (isValidFunction(onClose)) {
      onClose();
    } else {
      logValidationError('onClose', 'function', onClose);
    }
  }, [onClose]);
  
  const safeOnBack = useCallback(() => {
    if (isValidFunction(onBack)) {
      onBack();
    }
  }, [onBack]);
  
  const safeOnSelectVehicle = useCallback((vehicleType) => {
    if (isValidFunction(onSelectVehicle)) {
      onSelectVehicle(vehicleType);
    } else {
      logValidationError('onSelectVehicle', 'function', onSelectVehicle);
    }
  }, [onSelectVehicle]);
  
  const safeOnConfirm = useCallback((vehicleType) => {
    if (isValidFunction(onConfirm)) {
      onConfirm(vehicleType);
    } else {
      logValidationError('onConfirm', 'function', onConfirm);
    }
  }, [onConfirm]);

  // ===== LOCAL STATE =====
  const [selected, setSelected] = useState(safeSelectedVehicleType);
  const scrollRef = useRef(null);

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Update selection when prop changes
  useEffect(() => {
    if (safeSelectedVehicleType) {
      setSelected(safeSelectedVehicleType);
    }
  }, [safeSelectedVehicleType]);

  // Spring animation config
  const springConfig = {
    type: "spring",
    damping: 30,
    stiffness: 300
  };

  const handleSelect = useCallback((vehicleType) => {
    setSelected(vehicleType);
    safeOnSelectVehicle(vehicleType);
  }, [safeOnSelectVehicle]);

  const handleConfirm = useCallback(() => {
    safeOnConfirm(selected);
  }, [safeOnConfirm, selected]);

  // Format price for display with validation
  // Note: price of 0 shows as $— (no price available), negative is invalid
  const formatPrice = useCallback((price) => {
    if (!isValidNumber(price) || price < 0) return '$—';
    if (price === 0) return '$0'; // Free ride case
    const thousands = Math.floor(price / 1000);
    return `$${thousands}K`;
  }, []);

  return (
    <AnimatePresence>
      {safeIsOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={safeOnClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            style={{ zIndex: Z_INDEX.sidebar }}
            aria-hidden="true"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={prefersReducedMotion ? {} : { y: '100%' }}
            animate={{ y: 0 }}
            exit={prefersReducedMotion ? {} : { y: '100%' }}
            transition={springConfig}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl"
            style={{ 
              zIndex: Z_INDEX.sidebarPanel,
              paddingBottom: 'env(safe-area-inset-bottom, 0px)' 
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Panel de selección de vehículo"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4">
              <div className="flex items-center gap-3">
                {isValidFunction(onBack) && (
                  <button
                    onClick={safeOnBack}
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Volver"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                )}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Elige tu viaje
                  </h2>
                  {(safeRouteInfo.distance || safeRouteInfo.duration) && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {[safeRouteInfo.distance, safeRouteInfo.duration].filter(Boolean).join(' • ')}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={safeOnClose}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Cerrar panel"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Vehicle Carousel */}
            <div 
              ref={scrollRef}
              className="flex gap-4 px-6 pb-6 overflow-x-auto scrollbar-hide"
              style={{ 
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch'
              }}
              role="radiogroup"
              aria-label="Selección de vehículo"
            >
              {VEHICLES.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  isSelected={selected === vehicle.type}
                  onClick={() => handleSelect(vehicle.type)}
                  price={safeFare[vehicle.type] || 0}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </div>

            {/* Confirm Button */}
            <div className="px-5 pb-6">
              <motion.button
                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                onClick={handleConfirm}
                disabled={safeLoading}
                className="w-full h-16 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-lg shadow-2xl shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all hover:shadow-xl"
                aria-busy={safeLoading}
              >
                {safeLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Confirmar Viaje</span>
                    <span className="text-emerald-200">→</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * VehicleCard - Individual vehicle option with spotlight effect
 * Validates all props internally
 */
function VehicleCard({ vehicle, isSelected = false, onClick, price = 0, prefersReducedMotion = false }) {
  // Validate vehicle object
  if (!vehicle || typeof vehicle !== 'object') {
    return null;
  }
  
  // Validate required vehicle properties with fallbacks
  const safeVehicle = {
    id: vehicle.id || 0,
    name: vehicle.name || 'Vehículo',
    description: vehicle.description || '',
    type: vehicle.type || 'car',
    emoji: vehicle.emoji || '🚗',
    capacity: vehicle.capacity || '1 persona',
    eta: vehicle.eta || '-- min',
    color: vehicle.color || 'from-gray-500 to-gray-600'
  };
  
  const safePrice = typeof price === 'number' && !isNaN(price) ? price : 0;
  const safeIsSelected = typeof isSelected === 'boolean' ? isSelected : false;
  
  return (
    <motion.div
      whileHover={prefersReducedMotion ? {} : { y: -4 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      onClick={onClick}
      className={`
        relative flex-shrink-0 w-40 rounded-3xl p-4 cursor-pointer transition-all duration-300
        ${safeIsSelected 
          ? `bg-gradient-to-br ${safeVehicle.color} ring-4 ring-emerald-400 shadow-2xl` 
          : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
        }
      `}
      style={{ 
        scrollSnapAlign: 'start',
        ...(safeIsSelected && {
          boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)'
        })
      }}
      role="radio"
      aria-checked={safeIsSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
    >
      {/* Selected Checkmark */}
      {safeIsSelected && (
        <motion.div
          initial={prefersReducedMotion ? {} : { scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-lg"
        >
          <Check className="w-4 h-4 text-emerald-600" strokeWidth={3} />
        </motion.div>
      )}

      {/* Glow Effect when Selected */}
      {safeIsSelected && (
        <div 
          className="absolute inset-0 rounded-3xl blur-xl opacity-50 -z-10"
          style={{
            background: `radial-gradient(circle at center, rgba(16, 185, 129, 0.6) 0%, transparent 70%)`
          }}
        />
      )}

      {/* Emoji Icon */}
      <div className="text-5xl mb-3 text-center" aria-hidden="true">
        {safeVehicle.emoji}
      </div>

      {/* Vehicle Name */}
      <h3 className={`text-base font-bold mb-0.5 ${safeIsSelected ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
        {safeVehicle.name}
      </h3>
      
      {/* Description */}
      <p className={`text-xs mb-3 ${safeIsSelected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
        {safeVehicle.description}
      </p>

      {/* Meta Info */}
      <div className="space-y-1.5 mb-3">
        <div className={`flex items-center gap-1.5 text-xs ${safeIsSelected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
          <Users className="w-3 h-3" aria-hidden="true" />
          <span>{safeVehicle.capacity}</span>
        </div>
        <div className={`flex items-center gap-1.5 text-xs ${safeIsSelected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
          <Clock className="w-3 h-3" aria-hidden="true" />
          <span>{safeVehicle.eta}</span>
        </div>
      </div>

      {/* Price - MASSIVE */}
      <div className={`text-4xl font-black ${safeIsSelected ? 'text-white' : 'text-emerald-500'}`}>
        {safePrice === 0 ? '$0' : (safePrice > 0 ? `$${Math.floor(safePrice / 1000)}K` : '$—')}
      </div>
      
      {/* Full price in COP */}
      {safePrice >= 0 && (
        <p className={`text-xs mt-0.5 ${safeIsSelected ? 'text-white/70' : 'text-gray-400'}`}>
          COP$ {safePrice.toLocaleString('es-CO')}
        </p>
      )}
    </motion.div>
  );
}

export default VehiclePanel;
