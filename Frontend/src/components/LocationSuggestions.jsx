import { useCallback, useMemo } from "react";
import { MapPin, Clock, ChevronRight } from "lucide-react";
import Console from "../utils/console";
import { motion } from "framer-motion";

/**
 * LocationSuggestions - Address Suggestions List
 * Process 2 - Phase 3: Ride Logic & Interactive Panels
 * 
 * CRITICAL VALIDATION: All props must be validated before rendering
 * - Never crash on missing/invalid data
 * - Provide graceful fallbacks
 * - Log errors in development only
 * 
 * Features:
 * - Staggered animations for suggestions
 * - Glass morphism design
 * - Recent searches indicator
 * - Keyboard navigation support
 */

// Validation helpers
const isValidArray = (value) => Array.isArray(value);
const isValidFunction = (value) => typeof value === 'function';
const isValidString = (value) => typeof value === 'string';

// Development-only logging
const logValidationError = (propName, expectedType, receivedValue) => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `[LocationSuggestions] Invalid prop "${propName}": expected ${expectedType}, received ${typeof receivedValue}`,
      { received: receivedValue }
    );
  }
};

function LocationSuggestions({
  suggestions = [],
  setSuggestions,
  setPickupLocation,
  setDestinationLocation,
  input = 'destination',
}) {
  // ===== PROP VALIDATION =====
  const safeSuggestions = useMemo(() => {
    if (!isValidArray(suggestions)) {
      logValidationError('suggestions', 'array', suggestions);
      return [];
    }
    return suggestions;
  }, [suggestions]);
  
  const safeInput = useMemo(() => {
    if (!['pickup', 'destination'].includes(input)) {
      logValidationError('input', '"pickup" or "destination"', input);
      return 'destination';
    }
    return input;
  }, [input]);
  
  // Validate callback functions with safe fallbacks
  const safeClearSuggestions = useCallback(() => {
    if (isValidFunction(setSuggestions)) {
      setSuggestions([]);
    }
  }, [setSuggestions]);
  
  const safeSetPickupLocation = useCallback((suggestion) => {
    if (isValidFunction(setPickupLocation)) {
      setPickupLocation(suggestion);
    } else {
      logValidationError('setPickupLocation', 'function', setPickupLocation);
    }
  }, [setPickupLocation]);
  
  const safeSetDestinationLocation = useCallback((suggestion) => {
    if (isValidFunction(setDestinationLocation)) {
      setDestinationLocation(suggestion);
    } else {
      logValidationError('setDestinationLocation', 'function', setDestinationLocation);
    }
  }, [setDestinationLocation]);

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Handle suggestion selection
  const handleSelect = useCallback((suggestion) => {
    Console.log("Location selected:", suggestion);
    
    if (safeInput === "pickup") {
      safeSetPickupLocation(suggestion);
    } else {
      safeSetDestinationLocation(suggestion);
    }
    
    safeClearSuggestions();
  }, [safeInput, safeSetPickupLocation, safeSetDestinationLocation, safeClearSuggestions]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e, suggestion) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(suggestion);
    }
  }, [handleSelect]);

  // Parse suggestion text for display
  const parseSuggestionText = useCallback((suggestion) => {
    if (!suggestion) return { title: '', subtitle: '' };
    
    if (isValidString(suggestion)) {
      const parts = suggestion.split(',');
      return {
        title: parts[0]?.trim() || suggestion,
        subtitle: parts.slice(1).join(',').trim() || ''
      };
    }
    
    if (typeof suggestion === 'object') {
      return {
        title: suggestion.title || suggestion.name || suggestion.place_name || String(suggestion),
        subtitle: suggestion.subtitle || suggestion.address || ''
      };
    }
    
    return { title: String(suggestion), subtitle: '' };
  }, []);

  // If no suggestions, don't render
  if (safeSuggestions.length === 0) {
    return null;
  }

  return (
    <div 
      className="space-y-1.5" 
      role="listbox" 
      aria-label="Sugerencias de ubicación"
    >
      {safeSuggestions.map((suggestion, index) => {
        const { title, subtitle } = parseSuggestionText(suggestion);
        
        return (
          <motion.div
            key={`suggestion-${index}-${title}`}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
            transition={{ 
              duration: 0.25, 
              delay: index * 0.03,
              ease: [0.34, 1.56, 0.64, 1]
            }}
            whileHover={prefersReducedMotion ? {} : { scale: 1.01, x: 4 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
            onClick={() => handleSelect(suggestion)}
            onKeyDown={(e) => handleKeyDown(e, suggestion)}
            className="cursor-pointer relative group"
            role="option"
            tabIndex={0}
            aria-selected="false"
          >
            {/* Premium Glass Row */}
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md hover:bg-white/10 border border-white/10 hover:border-emerald-400/30 rounded-2xl py-3.5 px-3 transition-all duration-300 shadow-sm hover:shadow-lg">
              {/* Icon with Glass Badge */}
              <motion.div 
                className="backdrop-blur-sm p-2.5 rounded-xl border flex-shrink-0 transition-all bg-emerald-500/20 border-emerald-400/30 hover:bg-emerald-500/30 hover:border-emerald-400/50"
                whileHover={prefersReducedMotion ? {} : { rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                aria-hidden="true"
              >
                <MapPin size={18} className="text-emerald-400" />
              </motion.div>

              {/* Suggestion Text */}
              <div className="flex-1 min-w-0">
                <h2 
                  className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors leading-relaxed truncate"
                >
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-xs text-white/50 truncate">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Chevron hint */}
              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <ChevronRight size={14} className="text-emerald-400" />
              </div>
            </div>

            {/* Subtle glow on hover */}
            <div 
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              aria-hidden="true"
            />
          </motion.div>
        );
      })}
    </div>
  );
}

export default LocationSuggestions;
