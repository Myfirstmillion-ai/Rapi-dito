import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, CreditCard } from 'lucide-react';
import BottomSheet from '../ui/BottomSheet';
import { Button, Divider } from '../atoms';
import { triggerHaptic } from '../../design-system';

/**
 * RideConfirmation Component - Ride Confirmation Bottom Panel
 * 
 * Displays ride summary and confirmation before booking.
 * 
 * @param {boolean} isOpen - Controls visibility
 * @param {function} onClose - Close handler
 * @param {function} onConfirm - Confirm button handler
 * @param {string} pickup - Pickup location text
 * @param {string} destination - Destination location text
 * @param {string} vehicleType - Selected vehicle type
 * @param {number} fare - Total fare amount
 * @param {string} estimatedTime - Estimated trip time
 */
function RideConfirmation({
  isOpen,
  onClose,
  onConfirm,
  pickup = "",
  destination = "",
  vehicleType = "",
  fare = 0,
  estimatedTime = "",
}) {
  const handleConfirm = () => {
    triggerHaptic('success');
    onConfirm?.();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm your ride"
      height="auto"
    >
      <div className="space-y-6">
        {/* Route Summary */}
        <div className="space-y-4">
          {/* Pickup */}
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>
            <div className="flex-1 pt-2">
              <p className="text-sm text-gray-500">Pickup</p>
              <p className="font-medium text-gray-900">{pickup || 'Not selected'}</p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1 pt-2">
              <p className="text-sm text-gray-500">Destination</p>
              <p className="font-medium text-gray-900">{destination || 'Not selected'}</p>
            </div>
          </div>
        </div>

        <Divider />

        {/* Vehicle & Time */}
        <div className="space-y-3">
          {vehicleType && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <Navigation className="w-5 h-5" />
                <span className="text-sm">Vehicle</span>
              </div>
              <span className="font-semibold text-gray-900">{vehicleType}</span>
            </div>
          )}

          {estimatedTime && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span className="text-sm">Estimated time</span>
              </div>
              <span className="font-semibold text-gray-900">{estimatedTime}</span>
            </div>
          )}
        </div>

        <Divider />

        {/* Fare Display */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <CreditCard className="w-5 h-5" />
              <span className="text-sm">Payment method</span>
            </div>
            <span className="font-medium text-gray-900">Cash</span>
          </div>

          {/* Total Fare - Massive Display */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6">
            <div className="text-center">
              <p className="text-sm text-emerald-700 mb-1">Total Fare</p>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-5xl font-bold text-emerald-900"
              >
                {formatPrice(fare)}
              </motion.div>
              <p className="text-xs text-emerald-600 mt-2">
                Final price may vary based on actual route
              </p>
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <Button
          title="Confirm Ride"
          onClick={handleConfirm}
          variant="primary"
          classes="w-full text-lg py-4"
          disabled={!pickup || !destination || !vehicleType}
        />

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center">
          By confirming, you agree to our{' '}
          <a href="/terms" className="text-emerald-600 hover:underline">
            Terms of Service
          </a>
        </p>
      </div>
    </BottomSheet>
  );
}

export default RideConfirmation;
