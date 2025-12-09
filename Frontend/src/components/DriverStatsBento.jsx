import { useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Car, 
  Star, 
  Clock, 
  MapPin,
  Zap,
  Target,
  Award,
  ChevronRight,
  X
} from "lucide-react";

/**
 * DriverStatsBento - Tesla-Inspired Bento Grid Dashboard
 * Process 2 - Phase 4: Driver HUD, Stats Dashboard & Alert System
 * 
 * CRITICAL WHITE SCREEN PREVENTION:
 * - ALL data access uses optional chaining (?.)
 * - ALL displays have fallback values
 * - NEVER throws unhandled errors
 * - Logs errors in development only
 * 
 * Design Philosophy:
 * - Dark theme HUD aesthetic
 * - Bento grid layout (Japanese lunch box inspired)
 * - Visual hierarchy through size variation
 * - Scannable at a glance while driving
 */

// ===== VALIDATION HELPERS =====
const isValidNumber = (value) => typeof value === 'number' && !isNaN(value) && isFinite(value);
const isValidString = (value) => typeof value === 'string' && value.length > 0;
const isValidArray = (value) => Array.isArray(value);
const isValidObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isValidFunction = (value) => typeof value === 'function';
const isValidBoolean = (value) => typeof value === 'boolean';

// Development-only logging
const logValidationError = (componentName, propName, expectedType, receivedValue) => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `[${componentName}] Invalid prop "${propName}": expected ${expectedType}, received ${typeof receivedValue}`,
      { received: receivedValue }
    );
  }
};

// ===== SAFE DATA EXTRACTION HELPERS =====
const safeNumber = (value, fallback = 0) => {
  if (isValidNumber(value)) return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (isValidNumber(parsed)) return parsed;
  }
  return fallback;
};

const safeString = (value, fallback = '') => {
  if (isValidString(value)) return value;
  if (value === null || value === undefined) return fallback;
  return String(value) || fallback;
};

const safeArray = (value, fallback = []) => {
  if (isValidArray(value)) return value;
  return fallback;
};

// ===== FORMAT HELPERS =====
const formatCurrency = (amount, options = {}) => {
  const { 
    abbreviate = true, 
    locale = 'es-CO', 
    currency = 'COP' 
  } = options;
  
  const safeAmount = safeNumber(amount, 0);
  
  if (abbreviate && safeAmount >= 1000000) {
    return `$${(safeAmount / 1000000).toFixed(1)}M`;
  }
  if (abbreviate && safeAmount >= 1000) {
    return `$${(safeAmount / 1000).toFixed(1)}K`;
  }
  
  try {
    return `$${safeAmount.toLocaleString(locale, { maximumFractionDigits: 0 })}`;
  } catch {
    return `$${safeAmount}`;
  }
};

const formatPercentage = (value, decimals = 1) => {
  const safeValue = safeNumber(value, 0);
  return `${safeValue.toFixed(decimals)}%`;
};

const formatTime = (minutes) => {
  const safeMinutes = safeNumber(minutes, 0);
  if (safeMinutes < 60) return `${Math.round(safeMinutes)} min`;
  const hours = Math.floor(safeMinutes / 60);
  const mins = Math.round(safeMinutes % 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

const formatDistance = (km) => {
  const safeKm = safeNumber(km, 0);
  if (safeKm < 1) return `${Math.round(safeKm * 1000)} m`;
  return `${safeKm.toFixed(1)} km`;
};

// ===== STAT CARD COMPONENT =====
function StatCard({ 
  title = 'Stat', 
  value = '—', 
  subtitle = '', 
  icon: Icon = DollarSign,
  trend = null, // { value: number, isPositive: boolean }
  size = 'normal', // 'small' | 'normal' | 'large' | 'featured'
  color = 'emerald', // 'emerald' | 'cyan' | 'amber' | 'rose' | 'purple'
  onClick = null,
  isLoading = false,
  className = ''
}) {
  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Color variants
  const colorVariants = {
    emerald: {
      icon: 'text-emerald-400',
      iconBg: 'bg-emerald-500/20 border-emerald-500/30',
      glow: 'shadow-emerald-500/20',
      trend: 'text-emerald-400',
      accent: 'from-emerald-500/10 to-transparent'
    },
    cyan: {
      icon: 'text-cyan-400',
      iconBg: 'bg-cyan-500/20 border-cyan-500/30',
      glow: 'shadow-cyan-500/20',
      trend: 'text-cyan-400',
      accent: 'from-cyan-500/10 to-transparent'
    },
    amber: {
      icon: 'text-amber-400',
      iconBg: 'bg-amber-500/20 border-amber-500/30',
      glow: 'shadow-amber-500/20',
      trend: 'text-amber-400',
      accent: 'from-amber-500/10 to-transparent'
    },
    rose: {
      icon: 'text-rose-400',
      iconBg: 'bg-rose-500/20 border-rose-500/30',
      glow: 'shadow-rose-500/20',
      trend: 'text-rose-400',
      accent: 'from-rose-500/10 to-transparent'
    },
    purple: {
      icon: 'text-purple-400',
      iconBg: 'bg-purple-500/20 border-purple-500/30',
      glow: 'shadow-purple-500/20',
      trend: 'text-purple-400',
      accent: 'from-purple-500/10 to-transparent'
    }
  };

  // Size variants
  const sizeVariants = {
    small: {
      padding: 'p-3',
      iconSize: 16,
      iconContainer: 'w-8 h-8',
      titleSize: 'text-[10px]',
      valueSize: 'text-lg',
      subtitleSize: 'text-[9px]',
      minHeight: 'min-h-[80px]'
    },
    normal: {
      padding: 'p-4',
      iconSize: 20,
      iconContainer: 'w-10 h-10',
      titleSize: 'text-xs',
      valueSize: 'text-2xl',
      subtitleSize: 'text-[10px]',
      minHeight: 'min-h-[100px]'
    },
    large: {
      padding: 'p-5',
      iconSize: 24,
      iconContainer: 'w-12 h-12',
      titleSize: 'text-sm',
      valueSize: 'text-3xl',
      subtitleSize: 'text-xs',
      minHeight: 'min-h-[120px]'
    },
    featured: {
      padding: 'p-6',
      iconSize: 28,
      iconContainer: 'w-14 h-14',
      titleSize: 'text-sm',
      valueSize: 'text-4xl',
      subtitleSize: 'text-sm',
      minHeight: 'min-h-[140px]'
    }
  };

  const colors = colorVariants[color] || colorVariants.emerald;
  const sizes = sizeVariants[size] || sizeVariants.normal;

  const cardContent = (
    <div 
      className={`
        relative overflow-hidden rounded-2xl bg-slate-900/80 backdrop-blur-lg
        border border-white/10 ${sizes.padding} ${sizes.minHeight}
        transition-all duration-300 group
        ${onClick ? 'cursor-pointer hover:bg-slate-800/80 hover:border-white/20' : ''}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          onClick();
        }
      }}
    >
      {/* Accent gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.accent} opacity-50`} />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          {/* Icon */}
          <div className={`${sizes.iconContainer} rounded-xl ${colors.iconBg} border flex items-center justify-center flex-shrink-0`}>
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Icon size={sizes.iconSize} className={colors.icon} />
            )}
          </div>
          
          {/* Trend indicator */}
          {trend && !isLoading && (
            <div className={`flex items-center gap-0.5 ${trend.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend.isPositive ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              <span className="text-[10px] font-bold">
                {trend.value > 0 ? '+' : ''}{safeNumber(trend.value, 0).toFixed(0)}%
              </span>
            </div>
          )}
        </div>
        
        {/* Title */}
        <p className={`${sizes.titleSize} text-white/50 font-semibold uppercase tracking-wider mb-1`}>
          {safeString(title, 'Stat')}
        </p>
        
        {/* Value */}
        <div className="flex-1 flex items-center">
          {isLoading ? (
            <div className="w-24 h-6 bg-white/10 rounded animate-pulse" />
          ) : (
            <h3 className={`${sizes.valueSize} font-black text-white leading-none`}>
              {safeString(value, '—')}
            </h3>
          )}
        </div>
        
        {/* Subtitle */}
        {subtitle && !isLoading && (
          <p className={`${sizes.subtitleSize} text-white/40 mt-1`}>
            {safeString(subtitle)}
          </p>
        )}
        
        {/* Click indicator */}
        {onClick && (
          <ChevronRight 
            size={16} 
            className="absolute bottom-3 right-3 text-white/20 group-hover:text-white/40 transition-colors" 
          />
        )}
      </div>
    </div>
  );

  if (prefersReducedMotion) {
    return cardContent;
  }

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.02, y: -2 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
    >
      {cardContent}
    </motion.div>
  );
}

// ===== MAIN COMPONENT =====
function DriverStatsBento({
  captain = null,
  earnings = null,
  rides = null,
  isVisible = true,
  onClose = null,
  onStatClick = null,
  className = ''
}) {
  // ===== PROP VALIDATION =====
  const safeIsVisible = isValidBoolean(isVisible) ? isVisible : true;
  
  // Safely extract captain data
  const safeCaptain = useMemo(() => {
    if (!isValidObject(captain)) {
      logValidationError('DriverStatsBento', 'captain', 'object', captain);
      return {};
    }
    return captain;
  }, [captain]);

  // Safely extract earnings data
  const safeEarnings = useMemo(() => {
    if (!isValidObject(earnings)) {
      return { today: 0, week: 0, month: 0, total: 0 };
    }
    return {
      today: safeNumber(earnings.today, 0),
      week: safeNumber(earnings.week, 0),
      month: safeNumber(earnings.month, 0),
      total: safeNumber(earnings.total, 0)
    };
  }, [earnings]);

  // Safely extract rides data
  const safeRides = useMemo(() => {
    if (!isValidObject(rides)) {
      return { accepted: 0, completed: 0, cancelled: 0, total: 0 };
    }
    return {
      accepted: safeNumber(rides.accepted, 0),
      completed: safeNumber(rides.completed, 0),
      cancelled: safeNumber(rides.cancelled, 0),
      total: safeNumber(rides.total, 0)
    };
  }, [rides]);

  // Validate callbacks
  const safeOnClose = useCallback(() => {
    if (isValidFunction(onClose)) {
      onClose();
    }
  }, [onClose]);

  const safeOnStatClick = useCallback((statId) => {
    if (isValidFunction(onStatClick)) {
      onStatClick(statId);
    }
  }, [onStatClick]);

  // ===== CALCULATE STATS =====
  const calculatedStats = useMemo(() => {
    // Calculate today's earnings from captain data as fallback
    const calculateTodaysEarnings = () => {
      const captainRides = safeArray(safeCaptain?.rides, []);
      if (captainRides.length === 0) return { total: 0, trips: 0 };
      
      let todaysTotal = 0;
      let todaysTrips = 0;
      
      try {
        const today = new Date();
        const todayWithoutTime = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );

        captainRides.forEach((ride) => {
          if (ride?.status === "completed") {
            const rideDate = new Date(ride?.updatedAt || ride?.createdAt);
            const rideDateWithoutTime = new Date(
              rideDate.getFullYear(),
              rideDate.getMonth(),
              rideDate.getDate()
            );

            if (rideDateWithoutTime.getTime() === todayWithoutTime.getTime()) {
              todaysTotal += safeNumber(ride?.fare, 0);
              todaysTrips++;
            }
          }
        });
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[DriverStatsBento] Error calculating today\'s earnings:', error);
        }
      }

      return { total: todaysTotal, trips: todaysTrips };
    };

    const fallbackData = calculateTodaysEarnings();
    
    // Rating
    const rating = safeNumber(
      safeCaptain?.rating?.average || safeCaptain?.rating, 
      0
    );
    
    // Acceptance rate
    const totalRideRequests = safeRides.total || (safeRides.accepted + safeRides.cancelled) || 1;
    const acceptanceRate = (safeRides.accepted / totalRideRequests) * 100;
    
    // Completion rate
    const totalAccepted = safeRides.accepted || 1;
    const completionRate = (safeRides.completed / totalAccepted) * 100;
    
    // Online time (mock - would come from backend)
    const onlineHours = safeNumber(safeCaptain?.onlineHoursToday, 0);
    
    // Distance traveled (mock - would come from backend)
    const distanceToday = safeNumber(safeCaptain?.distanceToday, 0);

    return {
      todaysEarnings: safeEarnings.today || fallbackData.total,
      todaysTrips: safeRides.accepted || fallbackData.trips,
      weeklyEarnings: safeEarnings.week,
      monthlyEarnings: safeEarnings.month,
      rating,
      totalRides: safeRides.total || safeCaptain?.rides?.length || 0,
      acceptanceRate: Math.min(100, Math.max(0, acceptanceRate)),
      completionRate: Math.min(100, Math.max(0, completionRate)),
      onlineHours,
      distanceToday
    };
  }, [safeCaptain, safeEarnings, safeRides]);

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Don't render if not visible
  if (!safeIsVisible) return null;

  return (
    <div 
      className={`w-full max-w-4xl mx-auto p-4 ${className}`}
      role="region"
      aria-label="Panel de estadísticas del conductor"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">
            📊 Estadísticas
          </h2>
          <p className="text-xs text-white/50">
            Rendimiento de hoy
          </p>
        </div>
        {isValidFunction(onClose) && (
          <button
            onClick={safeOnClose}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Cerrar panel"
          >
            <X size={20} className="text-white/60" />
          </button>
        )}
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Featured: Today's Earnings (spans 2 columns) */}
        <div className="col-span-2">
          <StatCard
            title="Ganancias Hoy"
            value={formatCurrency(calculatedStats.todaysEarnings)}
            subtitle={`${calculatedStats.todaysTrips} ${calculatedStats.todaysTrips === 1 ? 'viaje' : 'viajes'} completados`}
            icon={DollarSign}
            size="featured"
            color="emerald"
            trend={calculatedStats.todaysEarnings > 0 ? { value: 12, isPositive: true } : null}
            onClick={() => safeOnStatClick('earnings')}
          />
        </div>

        {/* Rating */}
        <StatCard
          title="Calificación"
          value={calculatedStats.rating > 0 ? `${calculatedStats.rating.toFixed(1)} ⭐` : '—'}
          subtitle="Promedio"
          icon={Star}
          size="normal"
          color="amber"
          onClick={() => safeOnStatClick('rating')}
        />

        {/* Total Rides */}
        <StatCard
          title="Viajes Totales"
          value={calculatedStats.totalRides.toLocaleString('es-CO')}
          subtitle="Histórico"
          icon={Car}
          size="normal"
          color="cyan"
          onClick={() => safeOnStatClick('rides')}
        />

        {/* Weekly Earnings */}
        <StatCard
          title="Esta Semana"
          value={formatCurrency(calculatedStats.weeklyEarnings)}
          icon={TrendingUp}
          size="small"
          color="emerald"
        />

        {/* Monthly Earnings */}
        <StatCard
          title="Este Mes"
          value={formatCurrency(calculatedStats.monthlyEarnings)}
          icon={Target}
          size="small"
          color="purple"
        />

        {/* Acceptance Rate */}
        <StatCard
          title="Aceptación"
          value={formatPercentage(calculatedStats.acceptanceRate, 0)}
          subtitle="Tasa de aceptación"
          icon={Zap}
          size="small"
          color={calculatedStats.acceptanceRate >= 80 ? 'emerald' : 'rose'}
        />

        {/* Completion Rate */}
        <StatCard
          title="Completados"
          value={formatPercentage(calculatedStats.completionRate, 0)}
          subtitle="Tasa de finalización"
          icon={Award}
          size="small"
          color={calculatedStats.completionRate >= 90 ? 'emerald' : 'amber'}
        />
      </div>

      {/* Quick Stats Row */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        {/* Online Time */}
        <div className="bg-slate-900/60 backdrop-blur-lg rounded-xl border border-white/10 p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
            <Clock size={16} className="text-cyan-400" />
          </div>
          <div>
            <p className="text-[10px] text-white/50 uppercase tracking-wider">Tiempo Online</p>
            <p className="text-sm font-bold text-white">
              {formatTime(calculatedStats.onlineHours * 60)}
            </p>
          </div>
        </div>

        {/* Distance */}
        <div className="bg-slate-900/60 backdrop-blur-lg rounded-xl border border-white/10 p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
            <MapPin size={16} className="text-purple-400" />
          </div>
          <div>
            <p className="text-[10px] text-white/50 uppercase tracking-wider">Distancia Hoy</p>
            <p className="text-sm font-bold text-white">
              {formatDistance(calculatedStats.distanceToday)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverStatsBento;
