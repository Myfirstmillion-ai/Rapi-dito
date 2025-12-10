import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Users, Check, ChevronLeft } from "lucide-react";

/**
 * VehiclePanel - Swiss Minimalist Luxury Vehicle Selection
 * Bottom Sheet with horizontal carousel matching LocationSearchPanel
 * 
 * Design Philosophy:
 * - Clean white/dark adaptive backgrounds
 * - Premium rounded corners (3xl)
 * - Horizontal scroll snap carousel
 * - Elegant confirm button
 */

// Vehicle data
const vehicles = [
  {
    id: 1,
    name: "Rapidito",
    description: "Económico",
    type: "car",
    image: "/Uber-PNG-Photos.png",
    capacity: "4 personas",
    eta: "3 min",
  },
  {
    id: 2,
    name: "Moto",
    description: "Súper rápido",
    type: "bike",
    image: "/bike.webp",
    capacity: "1 persona",
    eta: "2 min",
  }
];

function VehiclePanel({
  isOpen,
  onClose,
  onBack,
  onConfirm,
  fare = { car: 0, bike: 0 },
  routeInfo = { distance: '', duration: '' },
  selectedVehicleType,
  onSelectVehicle,
  loading = false
}) {
  const [selected, setSelected] = useState(selectedVehicleType || 'car');

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Update selection when prop changes
  useEffect(() => {
    if (selectedVehicleType) {
      setSelected(selectedVehicleType);
    }
  }, [selectedVehicleType]);

  // Spring animation config matching LocationSearchPanel
  const springConfig = {
    type: "spring",
    damping: 30,
    stiffness: 300
  };

  const handleSelect = (vehicleType) => {
    setSelected(vehicleType);
    onSelectVehicle?.(vehicleType);
  };

  const handleConfirm = () => {
    onConfirm?.(selected);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={prefersReducedMotion ? {} : { y: '100%' }}
            animate={{ y: 0 }}
            exit={prefersReducedMotion ? {} : { y: '100%' }}
            transition={springConfig}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4">
              <div className="flex items-center gap-3">
                {onBack && (
                  <button
                    onClick={onBack}
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
                  {routeInfo.distance && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {routeInfo.distance} • {routeInfo.duration}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Cerrar panel"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Vehicle Carousel */}
            <div 
              className="flex gap-4 px-5 pb-6 overflow-x-auto scrollbar-hide"
              style={{ 
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  isSelected={selected === vehicle.type}
                  onClick={() => handleSelect(vehicle.type)}
                  price={fare[vehicle.type] || 0}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </div>

            {/* Confirm Button */}
            <div className="px-5 pb-6">
              <motion.button
                whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                onClick={handleConfirm}
                disabled={loading}
                className="w-full h-14 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold text-base shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
 * VehicleCard - Premium vehicle selection card for carousel
 */
function VehicleCard({ vehicle, isSelected, onClick, price, prefersReducedMotion }) {
  return (
    <motion.div
      whileHover={prefersReducedMotion ? {} : { y: -2 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      onClick={onClick}
      className={`
        relative flex-shrink-0 w-44 rounded-2xl p-4 cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'bg-emerald-50 dark:bg-emerald-900/30 ring-2 ring-emerald-500 shadow-lg' 
          : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
        }
      `}
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Selected Checkmark */}
      {isSelected && (
        <motion.div
          initial={prefersReducedMotion ? {} : { scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-md"
        >
          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
        </motion.div>
      )}

      {/* Vehicle Image */}
      <div className={`
        w-full h-20 rounded-xl flex items-center justify-center mb-3 transition-colors
        ${isSelected ? 'bg-emerald-100/50 dark:bg-emerald-800/30' : 'bg-gray-100 dark:bg-gray-700'}
      `}>
        <img 
          src={vehicle.image} 
          alt={vehicle.name}
          className={`h-14 w-auto object-contain transition-transform duration-200 ${
            isSelected ? 'scale-105' : 'scale-100'
          }`}
        />
      </div>

      {/* Vehicle Name */}
      <h3 className={`text-base font-bold mb-0.5 ${
        isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-900 dark:text-white'
      }`}>
        {vehicle.name}
      </h3>
      
      {/* Description */}
      <p className={`text-xs mb-3 ${
        isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'
      }`}>
        {vehicle.description}
      </p>

      {/* Meta Info */}
      <div className="space-y-1.5 mb-3">
        <div className={`flex items-center gap-1.5 text-xs ${
          isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'
        }`}>
          <Users className="w-3 h-3" />
          <span>{vehicle.capacity}</span>
        </div>
        <div className={`flex items-center gap-1.5 text-xs ${
          isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'
        }`}>
          <Clock className="w-3 h-3" />
          <span>{vehicle.eta}</span>
        </div>
      </div>

      {/* Price */}
      <div className={`text-2xl font-bold ${
        isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'
      }`}>
        {price > 0 ? `$${Math.floor(price / 1000)}K` : '$—'}
      </div>
      
      {/* Full price in COP */}
      {price > 0 && (
        <p className={`text-xs mt-0.5 ${
          isSelected ? 'text-emerald-500 dark:text-emerald-500' : 'text-gray-400 dark:text-gray-500'
        }`}>
          COP$ {price.toLocaleString('es-CO')}
        </p>
      )}
    </motion.div>
  );
}

export default VehiclePanel;
