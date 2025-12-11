import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Star, Navigation } from 'lucide-react';
import { GlassCard } from '../atoms';
import { cn } from '../../utils/cn';

/**
 * EarningsCard Component - Bento Grid Earnings Display for Captains
 * 
 * Displays earnings and stats in a beautiful bento grid layout.
 * 
 * @param {number} todayEarnings - Today's earnings
 * @param {number} todayRides - Today's ride count
 * @param {number} weekEarnings - This week's earnings
 * @param {number} rating - Driver rating
 * @param {string} className - Additional classes
 */
function EarningsCard({
  todayEarnings = 0,
  todayRides = 0,
  weekEarnings = 0,
  rating = 0,
  className = "",
}) {
  // Animated number counter
  const useCountUp = (target, duration = 1000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let startTime;
      let animationFrame;

      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        setCount(Math.floor(progress * target));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }, [target, duration]);

    return count;
  };

  const animatedTodayEarnings = useCountUp(todayEarnings);
  const animatedWeekEarnings = useCountUp(weekEarnings);
  const animatedTodayRides = useCountUp(todayRides);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      {/* Today's Earnings - Large Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="col-span-2"
      >
        <GlassCard variant="light" className="bg-gradient-to-br from-emerald-50 to-emerald-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-emerald-700">Today's Earnings</span>
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="text-4xl font-bold text-emerald-900">
            {formatCurrency(animatedTodayEarnings)}
          </div>
        </GlassCard>
      </motion.div>

      {/* Today's Rides */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard variant="light" className="h-full">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <Navigation className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 flex flex-col justify-end">
              <div className="text-3xl font-bold text-gray-900">{animatedTodayRides}</div>
              <span className="text-sm text-gray-600 mt-1">Rides today</span>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Rating */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard variant="light" className="h-full">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            </div>
            <div className="flex-1 flex flex-col justify-end">
              <div className="text-3xl font-bold text-gray-900">
                {rating.toFixed(1)}
              </div>
              <span className="text-sm text-gray-600 mt-1">Your rating</span>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Week's Earnings */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="col-span-2"
      >
        <GlassCard variant="light">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">This Week</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(animatedWeekEarnings)}
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-semibold">
                <TrendingUp className="w-3 h-3" />
                <span>
                  {todayEarnings > 0 && weekEarnings > 0 
                    ? `${Math.round((todayEarnings / weekEarnings) * 100)}%`
                    : '0%'
                  }
                </span>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

export default EarningsCard;
