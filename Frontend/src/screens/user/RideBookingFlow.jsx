import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  LocationPicker,
  VehicleSelector,
  RideConfirmation,
} from '../../components/composed';

/**
 * RideBookingFlow Component - Unified Booking Flow
 * 
 * Manages the complete ride booking flow through different steps:
 * 1. Location selection (pickup & destination)
 * 2. Vehicle selection
 * 3. Ride confirmation
 * 
 * @param {boolean} isActive - Controls flow visibility
 * @param {function} onComplete - Called when ride is confirmed
 * @param {function} onCancel - Called when flow is cancelled
 */
function RideBookingFlow({
  isActive,
  onComplete,
  onCancel,
}) {
  const [step, setStep] = useState('location'); // 'location', 'vehicle', 'confirm'
  const [pickupLocation, setPickupLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Mock fare data
  const [fareData] = useState({
    basePrice: 5000,
    distance: '8.5 km',
    duration: '15 min',
  });

  // Handle location input changes (with debounced API call simulation)
  const handlePickupChange = (value) => {
    setPickupLocation(value);
    
    if (value.length > 2) {
      setIsLoadingSuggestions(true);
      
      // Simulate API call
      setTimeout(() => {
        setSuggestions([
          { id: 1, name: 'Centro Comercial', description: 'San Antonio, Táchira', type: 'place' },
          { id: 2, name: 'Plaza Bolívar', description: 'Centro, San Antonio', type: 'place' },
          { id: 3, name: 'Terminal de Buses', description: 'Av. Principal', type: 'place' },
        ]);
        setIsLoadingSuggestions(false);
      }, 500);
    } else {
      setSuggestions([]);
    }
  };

  const handleDestinationChange = (value) => {
    setDestinationLocation(value);
    
    if (value.length > 2) {
      setIsLoadingSuggestions(true);
      
      // Simulate API call
      setTimeout(() => {
        setSuggestions([
          { id: 4, name: 'Universidad Nacional', description: 'Campus Norte', type: 'place' },
          { id: 5, name: 'Hospital Central', description: 'Av. Libertador', type: 'place' },
          { id: 6, name: 'Aeropuerto', description: '12 km del centro', type: 'place' },
        ]);
        setIsLoadingSuggestions(false);
      }, 500);
    } else {
      setSuggestions([]);
    }
  };

  // Handle location selection
  const handlePickupSelect = (suggestion) => {
    setPickupLocation(suggestion.name);
    setSuggestions([]);
  };

  const handleDestinationSelect = (suggestion) => {
    setDestinationLocation(suggestion.name);
    setSuggestions([]);
    
    // Auto-advance to vehicle selection if both locations are set
    if (pickupLocation) {
      setTimeout(() => {
        setStep('vehicle');
      }, 300);
    }
  };

  // Handle current location
  const handleUseCurrentLocation = (inputType) => {
    const currentLocationText = 'Your current location';
    
    if (inputType === 'pickup') {
      setPickupLocation(currentLocationText);
    } else {
      setDestinationLocation(currentLocationText);
    }
    
    setSuggestions([]);
  };

  // Handle vehicle selection
  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    
    // Auto-advance to confirmation
    setTimeout(() => {
      setStep('confirm');
    }, 300);
  };

  // Handle ride confirmation
  const handleConfirmRide = () => {
    const rideData = {
      pickup: pickupLocation,
      destination: destinationLocation,
      vehicle: selectedVehicle,
      fare: fareData.basePrice * (selectedVehicle?.priceMultiplier || 1),
    };
    
    onComplete?.(rideData);
  };

  // Handle flow cancellation
  const handleClose = () => {
    setStep('location');
    setPickupLocation('');
    setDestinationLocation('');
    setSelectedVehicle(null);
    setSuggestions([]);
    onCancel?.();
  };

  return (
    <>
      {/* Step 1: Location Picker */}
      <LocationPicker
        isOpen={isActive && step === 'location'}
        onClose={handleClose}
        pickupValue={pickupLocation}
        destinationValue={destinationLocation}
        onPickupChange={handlePickupChange}
        onDestinationChange={handleDestinationChange}
        onPickupSelect={handlePickupSelect}
        onDestinationSelect={handleDestinationSelect}
        onUseCurrentLocation={handleUseCurrentLocation}
        suggestions={suggestions}
        isLoadingSuggestions={isLoadingSuggestions}
      />

      {/* Step 2: Vehicle Selector */}
      <AnimatePresence>
        {isActive && step === 'vehicle' && (
          <div className="fixed inset-x-0 bottom-0 z-50">
            <div className="bg-white rounded-t-3xl shadow-2xl pb-safe">
              <div className="pt-6 pb-4">
                <VehicleSelector
                  selectedVehicle={selectedVehicle?.id}
                  onSelect={handleVehicleSelect}
                  fare={fareData}
                />
                
                {/* Back Button */}
                <div className="px-4 mt-4">
                  <button
                    onClick={() => setStep('location')}
                    className="w-full py-3 text-center text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    ← Back to locations
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Step 3: Ride Confirmation */}
      <RideConfirmation
        isOpen={isActive && step === 'confirm'}
        onClose={() => setStep('vehicle')}
        onConfirm={handleConfirmRide}
        pickup={pickupLocation}
        destination={destinationLocation}
        vehicleType={selectedVehicle?.type}
        fare={fareData.basePrice * (selectedVehicle?.priceMultiplier || 1)}
        estimatedTime={fareData.duration}
      />
    </>
  );
}

export default RideBookingFlow;
