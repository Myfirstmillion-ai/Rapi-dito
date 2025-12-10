import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Users, Check, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * VehiclePanel - Swiss Minimalist Luxury Vehicle Selection Panel
 * Design System: Matches LocationSearchPanel.jsx exactly
 * 
 * Features:
 * - AnimatePresence with spring physics
 * - Backdrop with blur effect
 * - Clean white/dark mode adaptive design
 * - Premium vehicle cards (list format)
 * - Elegant confirm button
 */

// Vehicle data
const vehicles = [
  {
    id: 1,
    name: "Rapidito",
    description: "Cómodo y seguro",
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

  // Spring animation config (matches LocationSearchPanel)
  const springConfig = {
    type: "spring",
    damping: 30,
    stiffness: 300
  };

  // Stagger animation for vehicle list
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.05,
        delayChildren: prefersReducedMotion ? 0 : 0.1
      }
    }
  };

  const itemVariants = {
    hidden: prefersReducedMotion ? {} : { opacity: 0, x: -20 },
    show: prefersReducedMotion ? {} : { opacity: 1, x: 0 }
  };

  const handleSelect = (vehicleType) => {
    setSelected(vehicleType);
    onSelectVehicle?.(vehicleType);
  };

  const handleConfirm = () => {
    onConfirm?.(selected);
  };

  const selectedVehicleData = vehicles.find(v => v.type === selected);
  const currentFare = fare[selected] || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Matches LocationSearchPanel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Bottom Sheet - Matches LocationSearchPanel */}
          <motion.div
            initial={prefersReducedMotion ? {} : { y: '100%' }}
            animate={{ y: 0 }}
            exit={prefersReducedMotion ? {} : { y: '100%' }}
            transition={springConfig}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl overflow-hidden"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            {/* Drag Handle - Matches LocationSearchPanel */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>

            {/* Header - Matches LocationSearchPanel */}
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

            {/* Vehicle List - Staggered Animation */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="px-5 pb-4 space-y-3"
            >
              {vehicles.map((vehicle) => (
                <motion.div
                  key={vehicle.id}
                  variants={itemVariants}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.01, x: 4 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                  onClick={() => handleSelect(vehicle.type)}
                  className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
                    selected === vehicle.type
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 ring-2 ring-emerald-500'
                      : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {/* Vehicle Image */}
                  <div className="w-20 h-16 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="h-14 w-auto object-contain"
                    />
                  </div>
                  
                  {/* Vehicle Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        {vehicle.name}
                      </h3>
                      {selected === vehicle.type && (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {vehicle.description}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                        <Clock className="w-3 h-3" />
                        {vehicle.eta}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                        <Users className="w-3 h-3" />
                        {vehicle.capacity}
                      </span>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-black text-emerald-500">
                      ${Math.floor((fare[vehicle.type] || 0) / 1000)}K
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      COP
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </motion.div>
              ))}
            </motion.div>

            {/* Fare Summary */}
            <div className="px-5 pb-4">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total estimado</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                      ${currentFare?.toLocaleString('es-CO') || 0}
                      <span className="text-sm font-normal text-gray-400 ml-1">COP</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tiempo est.</p>
                    <p className="text-lg font-bold text-emerald-500">
                      {selectedVehicleData?.eta || '3 min'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirm Button - Premium Style */}
            <div className="px-5 pb-6">
              <motion.button
                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                onClick={handleConfirm}
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Confirmar Viaje</span>
                    <ChevronRight className="w-5 h-5" />
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

export default VehiclePanel;
