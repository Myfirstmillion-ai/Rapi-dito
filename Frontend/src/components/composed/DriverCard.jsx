import { motion } from 'framer-motion';
import { Phone, MessageSquare, Star, Car } from 'lucide-react';
import { GlassCard, Avatar, IconButton, Badge } from '../atoms';
import { triggerHaptic } from '../../design-system';
import { cn } from '../../utils/cn';

/**
 * DriverCard Component - Driver Information Display
 * 
 * Shows driver details with compact and full variants.
 * 
 * @param {Object} driver - Driver object with name, rating, vehicle, etc.
 * @param {string} otp - One-time password for ride verification
 * @param {string} variant - 'compact' or 'full'
 * @param {function} onCall - Call button handler
 * @param {function} onMessage - Message button handler
 * @param {string} className - Additional classes
 */
function DriverCard({
  driver = {},
  otp = "",
  variant = 'full',
  onCall,
  onMessage,
  className = "",
}) {
  const {
    name = "Driver",
    rating = 4.5,
    totalRides = 0,
    vehicle = {},
    avatar,
    phone,
  } = driver;

  const {
    model = "Unknown",
    color = "Black",
    plate = "ABC-123",
  } = vehicle;

  const handleCall = () => {
    triggerHaptic('medium');
    onCall?.();
  };

  const handleMessage = () => {
    triggerHaptic('medium');
    onMessage?.();
  };

  if (variant === 'compact') {
    return (
      <GlassCard variant="light" className={cn("flex items-center gap-4", className)}>
        {/* Avatar */}
        <Avatar 
          src={avatar} 
          alt={name} 
          fallback={name.charAt(0)}
          size="md"
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 truncate">{name}</h4>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating.toFixed(1)}</span>
            <span className="text-gray-400">•</span>
            <span>{totalRides} trips</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <IconButton 
            icon={Phone}
            onClick={handleCall}
            variant="ghost"
            size="sm"
          />
          <IconButton 
            icon={MessageSquare}
            onClick={handleMessage}
            variant="ghost"
            size="sm"
          />
        </div>
      </GlassCard>
    );
  }

  // Full variant
  return (
    <GlassCard variant="light" className={cn("space-y-4", className)}>
      {/* Driver Info */}
      <div className="flex items-center gap-4">
        <Avatar 
          src={avatar} 
          alt={name} 
          fallback={name.charAt(0)}
          size="lg"
        />
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600">{totalRides} trips</span>
          </div>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="bg-gray-900 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold">{color} {model}</p>
            <div className="mt-1 inline-flex items-center gap-2 bg-white/20 backdrop-blur-lg px-3 py-1 rounded-lg">
              <span className="text-white font-bold tracking-wider">{plate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Display */}
      {otp && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 text-center"
        >
          <p className="text-sm text-emerald-700 mb-2">Your ride OTP</p>
          <div className="text-4xl font-bold text-emerald-900 tracking-widest">
            {otp}
          </div>
          <p className="text-xs text-emerald-600 mt-2">
            Share this with your driver
          </p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleCall}
          className="flex-1 flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl py-3 transition-colors"
        >
          <Phone className="w-5 h-5" />
          <span className="font-semibold">Call</span>
        </button>
        
        <button
          onClick={handleMessage}
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-3 transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="font-semibold">Message</span>
        </button>
      </div>
    </GlassCard>
  );
}

export default DriverCard;
