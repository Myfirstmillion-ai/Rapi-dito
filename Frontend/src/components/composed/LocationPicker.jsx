import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, X, Clock } from 'lucide-react';
import BottomSheet from '../ui/BottomSheet';
import { Button, Input, Spinner } from '../atoms';
import { STAGGER_CONTAINER, STAGGER_ITEM, triggerHaptic } from '../../design-system';
import { cn } from '../../utils/cn';

/**
 * LocationPicker Component - Full-Screen Location Selection
 * 
 * A comprehensive location picker with pickup and destination inputs,
 * suggestion list, and current location functionality.
 * 
 * @param {boolean} isOpen - Controls visibility
 * @param {function} onClose - Close handler
 * @param {string} pickupValue - Pickup location value
 * @param {string} destinationValue - Destination location value
 * @param {function} onPickupChange - Pickup input change handler
 * @param {function} onDestinationChange - Destination input change handler
 * @param {function} onPickupSelect - Pickup location select handler
 * @param {function} onDestinationSelect - Destination location select handler
 * @param {function} onUseCurrentLocation - Current location handler
 * @param {Array} suggestions - Location suggestions array
 * @param {boolean} isLoadingSuggestions - Loading state for suggestions
 */
function LocationPicker({
  isOpen,
  onClose,
  pickupValue = "",
  destinationValue = "",
  onPickupChange,
  onDestinationChange,
  onPickupSelect,
  onDestinationSelect,
  onUseCurrentLocation,
  suggestions = [],
  isLoadingSuggestions = false,
}) {
  const [activeInput, setActiveInput] = useState('pickup'); // 'pickup' or 'destination'

  const handleSuggestionClick = (suggestion) => {
    triggerHaptic('medium');
    
    if (activeInput === 'pickup') {
      onPickupSelect?.(suggestion);
    } else {
      onDestinationSelect?.(suggestion);
    }
  };

  const handleCurrentLocation = () => {
    triggerHaptic('success');
    onUseCurrentLocation?.(activeInput);
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      height="90vh"
      showCloseButton={false}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Where to?</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Location Inputs */}
        <div className="relative space-y-3">
          {/* Visual Connector Line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-emerald-500 to-red-500" />
          
          {/* Pickup Input */}
          <div className="relative">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
              <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-md" />
            </div>
            
            <Input
              value={pickupValue}
              onChange={(e) => {
                setActiveInput('pickup');
                onPickupChange?.(e.target.value);
              }}
              onFocus={() => setActiveInput('pickup')}
              placeholder="Pickup location"
              className={cn(
                "pl-10 bg-gray-50 border-2 transition-all",
                activeInput === 'pickup' ? 'border-emerald-500 bg-white' : 'border-transparent'
              )}
            />
          </div>

          {/* Destination Input */}
          <div className="relative">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
              <MapPin className="w-4 h-4 text-red-500" fill="currentColor" />
            </div>
            
            <Input
              value={destinationValue}
              onChange={(e) => {
                setActiveInput('destination');
                onDestinationChange?.(e.target.value);
              }}
              onFocus={() => setActiveInput('destination')}
              placeholder="Where to?"
              className={cn(
                "pl-10 bg-gray-50 border-2 transition-all",
                activeInput === 'destination' ? 'border-red-500 bg-white' : 'border-transparent'
              )}
            />
          </div>
        </div>

        {/* Use Current Location Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleCurrentLocation}
          className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl hover:from-emerald-100 hover:to-emerald-200 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
            <Navigation className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-emerald-900">Use current location</p>
            <p className="text-sm text-emerald-700">Enable location services</p>
          </div>
        </motion.button>

        {/* Suggestions List */}
        <div className="space-y-2">
          {isLoadingSuggestions ? (
            <div className="flex items-center justify-center py-8">
              <Spinner />
            </div>
          ) : suggestions.length > 0 ? (
            <motion.div
              variants={STAGGER_CONTAINER}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion.id || index}
                  variants={STAGGER_ITEM}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-start gap-3 p-3 bg-white hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors text-left"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    {suggestion.type === 'recent' ? (
                      <Clock className="w-5 h-5 text-gray-500" />
                    ) : (
                      <MapPin className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {suggestion.name || suggestion.address}
                    </p>
                    {suggestion.description && (
                      <p className="text-sm text-gray-500 truncate">
                        {suggestion.description}
                      </p>
                    )}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Start typing to see suggestions</p>
            </div>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}

export default LocationPicker;
