import { MapPin, Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Console from "../utils/console";
import { SPRING, triggerHaptic } from "../styles/swissLuxury";

/**
 * LocationSuggestions - Swiss Luxury Minimalist iOS Style
 *
 * Premium location suggestions with:
 * - Floating card design
 * - Light/Dark mode support
 * - Smooth stagger animations
 * - Haptic feedback
 */

function LocationSuggestions({
  suggestions = [],
  setSuggestions,
  setPickupLocation,
  setDestinationLocation,
  input,
}) {
  const handleSelect = (suggestion) => {
    Console.log(suggestion);
    triggerHaptic("light");

    if (input === "pickup") {
      setPickupLocation(suggestion);
      setSuggestions([]);
    }
    if (input === "destination") {
      setDestinationLocation(suggestion);
      setSuggestions([]);
    }
  };

  return (
    <div className="space-y-2">
      {suggestions.map((suggestion, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{
            ...SPRING.snappy,
            delay: index * 0.04,
          }}
          whileHover={{ scale: 1.01, x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelect(suggestion)}
          className="cursor-pointer group"
        >
          <div className="flex items-center gap-3 p-3.5 bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700/80 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 rounded-2xl transition-all duration-200">
            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/40 transition-colors">
              <MapPin size={18} className="text-emerald-600 dark:text-emerald-400" />
            </div>

            {/* Suggestion Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                {suggestion}
              </p>
            </div>

            {/* Chevron */}
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight size={16} className="text-emerald-500" />
            </div>
          </div>
        </motion.div>
      ))}

      {/* Empty State */}
      {suggestions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-8 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <MapPin size={24} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Escribe para buscar ubicaciones
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default LocationSuggestions;
