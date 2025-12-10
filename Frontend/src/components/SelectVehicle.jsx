import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Users, Check, Car, Bike } from "lucide-react";

/**
 * SelectVehicle - Swiss Minimalist Luxury Vehicle Selection
 * Bottom Sheet with spring physics matching LocationSearchPanel
 * 
 * Design Philosophy:
 * - Clean white/dark adaptive backgrounds
 * - Premium rounded corners (3xl)
 * - Subtle shadows and borders
 * - Clear typography hierarchy
 */

const vehicles = [
  {
    id: 1,
    name: "Rapidito",
    description: "Viaje cómodo y seguro",
    type: "car",
    image: "/Uber-PNG-Photos.png",
    icon: Car,
    capacity: "4 personas",
    eta: "3-5 min",
  },
  {
    id: 2,
    name: "Moto",
    description: "Rápido y económico",
    type: "bike",
    image: "/bike.webp",
    icon: Bike,
    capacity: "1 persona",
    eta: "2-4 min",
  },
];

function SelectVehicle({
  selectedVehicle,
  showPanel,
  setShowPanel,
  showPreviousPanel,
  showNextPanel,
  fare,
}) {
  const [currentlySelected, setCurrentlySelected] = useState(null);

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Spring animation config matching LocationSearchPanel
  const springConfig = {
    type: "spring",
    damping: 30,
    stiffness: 300
  };

  // Reset selection when panel closes
  useEffect(() => {
    if (!showPanel) {
      setCurrentlySelected(null);
    }
  }, [showPanel]);

  const handleClose = () => {
    setShowPanel(false);
    showPreviousPanel?.(true);
  };

  const handleSelect = (vehicle) => {
    setCurrentlySelected(vehicle.id);
    setTimeout(() => {
      selectedVehicle(vehicle.type);
      setShowPanel(false);
      showNextPanel(true);
    }, 200);
  };

  return (
    <AnimatePresence>
      {showPanel && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
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
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Elige tu viaje
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Selecciona el vehículo que prefieras
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Cerrar panel"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Vehicle Options */}
            <div className="px-5 pb-6 space-y-3">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  fare={fare}
                  isSelected={currentlySelected === vehicle.id}
                  onClick={() => handleSelect(vehicle)}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * VehicleCard - Premium selectable vehicle option
 */
function VehicleCard({ vehicle, fare, isSelected, onClick, prefersReducedMotion }) {
  const IconComponent = vehicle.icon;
  
  return (
    <motion.div
      whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      onClick={onClick}
      className={`
        relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'bg-emerald-50 dark:bg-emerald-900/30 ring-2 ring-emerald-500' 
          : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
        }
      `}
    >
      {/* Vehicle Image */}
      <div className={`
        relative w-20 h-16 rounded-xl flex items-center justify-center overflow-hidden
        ${isSelected ? 'bg-emerald-100 dark:bg-emerald-800/50' : 'bg-gray-100 dark:bg-gray-700'}
      `}>
        <img
          src={vehicle.image}
          className={`w-16 h-auto object-contain transition-transform duration-300 ${
            isSelected ? 'scale-110' : 'scale-100'
          }`}
          alt={vehicle.name}
        />
        
        {/* Selected Checkmark */}
        {isSelected && (
          <motion.div
            initial={prefersReducedMotion ? {} : { scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg"
          >
            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
          </motion.div>
        )}
      </div>

      {/* Vehicle Info */}
      <div className="flex-1 min-w-0">
        <h3 className={`text-base font-bold ${
          isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-900 dark:text-white'
        }`}>
          {vehicle.name}
        </h3>
        <p className={`text-sm ${
          isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'
        }`}>
          {vehicle.description}
        </p>
        
        {/* Meta Info Badges */}
        <div className="flex items-center gap-2 mt-2">
          <div className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
            isSelected 
              ? 'bg-emerald-200/50 dark:bg-emerald-700/50 text-emerald-700 dark:text-emerald-200' 
              : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
          }`}>
            <Clock className="w-3 h-3" />
            <span>{vehicle.eta}</span>
          </div>
          <div className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
            isSelected 
              ? 'bg-emerald-200/50 dark:bg-emerald-700/50 text-emerald-700 dark:text-emerald-200' 
              : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
          }`}>
            <Users className="w-3 h-3" />
            <span>{vehicle.capacity}</span>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="text-right flex-shrink-0">
        <p className={`text-2xl font-bold ${
          isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'
        }`}>
          ${Math.floor((fare?.[vehicle.type] || 0) / 1000)}K
        </p>
        <p className={`text-xs ${
          isSelected ? 'text-emerald-500 dark:text-emerald-500' : 'text-gray-400 dark:text-gray-500'
        }`}>
          COP$ {(fare?.[vehicle.type] || 0).toLocaleString('es-CO')}
        </p>
      </div>
    </motion.div>
  );
}

export default SelectVehicle;
