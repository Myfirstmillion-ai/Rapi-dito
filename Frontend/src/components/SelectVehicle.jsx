import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Clock, Users, Zap } from "lucide-react";
import { SPRING, triggerHaptic, prefersReducedMotion } from "../styles/swissLuxury";

/**
 * SelectVehicle - Swiss Luxury Minimalist iOS Style
 *
 * Premium vehicle selection with:
 * - Real vehicle images (not icons)
 * - Floating island design
 * - Light/Dark mode support
 * - Physics-based animations
 * - Soft shadows and rounded corners
 */

// Vehicle data with real images
const vehicles = [
  {
    id: 1,
    name: "Carro",
    description: "Cómodo y seguro para ti",
    type: "car",
    image: "/Uber-PNG-Photos.png",
    capacity: "4 pasajeros",
    eta: "3-5 min",
  },
  {
    id: 2,
    name: "Moto",
    description: "Rápido y económico",
    type: "bike",
    image: "/bike.webp",
    capacity: "1 pasajero",
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
  const [hoveredVehicle, setHoveredVehicle] = useState(null);
  const reducedMotion = useMemo(() => prefersReducedMotion(), []);

  // Reset selection when panel closes
  useEffect(() => {
    if (!showPanel) {
      setCurrentlySelected(null);
    }
  }, [showPanel]);

  // Format currency
  const formatPrice = (price) => {
    if (!price) return "$0";
    return `$${Math.round(price / 1000)}K`;
  };

  const formatFullPrice = (price) => {
    if (!price) return "COP $0";
    return `COP $${price.toLocaleString("es-CO")}`;
  };

  const handleSelect = (vehicle) => {
    setCurrentlySelected(vehicle.id);
    triggerHaptic("medium");

    setTimeout(() => {
      selectedVehicle(vehicle.type);
      setShowPanel(false);
      showNextPanel(true);
      triggerHaptic("success");
    }, 300);
  };

  return (
    <AnimatePresence>
      {showPanel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50"
        >
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPanel(false)}
            className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
          />

          {/* Floating Island Container */}
          <div
            className="absolute bottom-0 left-0 right-0 p-4"
            style={{
              paddingBottom: "max(16px, env(safe-area-inset-bottom))",
            }}
          >
            <motion.div
              initial={reducedMotion ? {} : { y: "100%", scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={reducedMotion ? {} : { y: "100%", scale: 0.95 }}
              transition={SPRING.smooth}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.4 }}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.y > 120 || velocity.y > 400) {
                  setShowPanel(false);
                  triggerHaptic("light");
                }
              }}
              className="bg-white dark:bg-[#1C1C1E] rounded-[32px] overflow-hidden"
              style={{
                boxShadow:
                  "0 -8px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)",
              }}
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600"
                />
              </div>

              {/* Content */}
              <div className="px-5 pb-6">
                {/* Header */}
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    Elige tu viaje
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Selecciona el vehículo que prefieras
                  </p>
                </div>

                {/* Vehicle Cards */}
                <div className="space-y-3">
                  {vehicles.map((vehicle, index) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      fare={fare}
                      isSelected={currentlySelected === vehicle.id}
                      isHovered={hoveredVehicle === vehicle.id}
                      onSelect={() => handleSelect(vehicle)}
                      onHoverStart={() => setHoveredVehicle(vehicle.id)}
                      onHoverEnd={() => setHoveredVehicle(null)}
                      formatPrice={formatPrice}
                      formatFullPrice={formatFullPrice}
                      reducedMotion={reducedMotion}
                      delay={index * 0.08}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * VehicleCard - Premium vehicle selection card with real image
 */
function VehicleCard({
  vehicle,
  fare,
  isSelected,
  isHovered,
  onSelect,
  onHoverStart,
  onHoverEnd,
  formatPrice,
  formatFullPrice,
  reducedMotion,
  delay,
}) {
  return (
    <motion.div
      initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING.snappy, delay }}
      whileHover={reducedMotion ? {} : { scale: 1.02, y: -2 }}
      whileTap={reducedMotion ? {} : { scale: 0.98 }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onClick={onSelect}
      className={`
        relative cursor-pointer rounded-3xl overflow-hidden transition-all duration-300
        ${
          isSelected
            ? "bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-800/20 ring-2 ring-emerald-500"
            : "bg-gray-50 dark:bg-[#2C2C2E] hover:bg-gray-100 dark:hover:bg-[#3C3C3E]"
        }
      `}
      style={{
        boxShadow: isSelected
          ? "0 8px 32px rgba(16, 185, 129, 0.25), 0 0 0 1px rgba(16, 185, 129, 0.3)"
          : "0 2px 8px rgba(0, 0, 0, 0.06)",
      }}
    >
      {/* Selection Check Badge */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={reducedMotion ? {} : { scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={reducedMotion ? {} : { scale: 0, rotate: 180 }}
            transition={SPRING.bouncy}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg"
            style={{ boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)" }}
          >
            <Check size={18} strokeWidth={3} className="text-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Content */}
      <div className="p-4 flex items-center gap-4">
        {/* Vehicle Image - Real Image */}
        <motion.div
          animate={
            isSelected || isHovered
              ? { scale: 1.08, rotate: -3 }
              : { scale: 1, rotate: 0 }
          }
          transition={SPRING.snappy}
          className="relative flex-shrink-0 w-24 h-20"
        >
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-full h-full object-contain drop-shadow-lg"
            style={{
              filter: isSelected
                ? "drop-shadow(0 8px 16px rgba(16, 185, 129, 0.3))"
                : "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))",
            }}
          />
        </motion.div>

        {/* Vehicle Info */}
        <div className="flex-1 min-w-0">
          {/* Name */}
          <h3
            className={`text-lg font-bold mb-0.5 transition-colors ${
              isSelected
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-gray-900 dark:text-white"
            }`}
          >
            {vehicle.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {vehicle.description}
          </p>

          {/* Stats Pills */}
          <div className="flex items-center gap-2">
            {/* Capacity */}
            <div
              className={`
                flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium
                ${
                  isSelected
                    ? "bg-emerald-100 dark:bg-emerald-800/40 text-emerald-700 dark:text-emerald-300"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }
              `}
            >
              <Users size={12} />
              <span>{vehicle.capacity}</span>
            </div>

            {/* ETA */}
            <div
              className={`
                flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium
                ${
                  isSelected
                    ? "bg-emerald-100 dark:bg-emerald-800/40 text-emerald-700 dark:text-emerald-300"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }
              `}
            >
              <Clock size={12} />
              <span>{vehicle.eta}</span>
            </div>
          </div>
        </div>

        {/* Price - Right Side */}
        <div className="flex-shrink-0 text-right">
          {/* Large Price */}
          <motion.div
            animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <h2
              className={`text-2xl font-black leading-none mb-0.5 ${
                isSelected
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {formatPrice(fare?.[vehicle.type])}
            </h2>
          </motion.div>

          {/* Full Price */}
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {formatFullPrice(fare?.[vehicle.type])}
          </p>
        </div>
      </div>

      {/* Bottom Accent Line - Selected State */}
      {isSelected && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={SPRING.snappy}
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400"
        />
      )}
    </motion.div>
  );
}

export default SelectVehicle;
