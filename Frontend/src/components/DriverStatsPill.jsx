import { motion, AnimatePresence } from "framer-motion";
import { Star, Clock, Award, TrendingUp, X, DollarSign } from "lucide-react";
import { useMemo } from "react";
import { SPRING, triggerHaptic, prefersReducedMotion } from "../styles/swissLuxury";

/**
 * DriverStatsPill - Swiss Luxury Minimalist iOS Style
 *
 * Premium floating stats pill with:
 * - Light/Dark mode support
 * - Floating island design
 * - Physics-based expand/collapse
 * - Soft shadows and rounded corners
 */

function DriverStatsPill({ stats, position = "top-right", onExpand }) {
  const {
    rating = 4.8,
    totalRides = 1247,
    completionRate = 98,
    activeTime = "4.5h",
  } = stats || {};

  const reducedMotion = useMemo(() => prefersReducedMotion(), []);

  // Position classes
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  return (
    <motion.div
      initial={reducedMotion ? {} : { opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={SPRING.snappy}
      whileHover={reducedMotion ? {} : { scale: 1.05 }}
      whileTap={reducedMotion ? {} : { scale: 0.98 }}
      onClick={() => {
        triggerHaptic("light");
        onExpand?.();
      }}
      className={`fixed ${positionClasses[position]} z-40 cursor-pointer`}
    >
      <div
        className="rounded-full px-4 py-2.5 flex items-center gap-3 bg-white dark:bg-[#1C1C1E] border border-gray-200 dark:border-gray-800"
        style={{
          boxShadow:
            "0 8px 24px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.04)",
          paddingTop:
            position.includes("top")
              ? "max(10px, env(safe-area-inset-top))"
              : "10px",
          paddingBottom:
            position.includes("bottom")
              ? "max(10px, env(safe-area-inset-bottom))"
              : "10px",
        }}
      >
        {/* Rating - Primary Stat */}
        <motion.div
          className="flex items-center gap-1.5"
          whileHover={{ scale: 1.1 }}
          transition={SPRING.snappy}
        >
          <div className="w-7 h-7 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <Star
              size={14}
              className="fill-yellow-500 text-yellow-500"
            />
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {rating}
          </span>
        </motion.div>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />

        {/* Total Rides */}
        <div className="flex items-center gap-1">
          <Award size={14} className="text-gray-400 dark:text-gray-500" />
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            {totalRides.toLocaleString()}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />

        {/* Completion Rate */}
        <div className="flex items-center gap-1">
          <TrendingUp size={14} className="text-emerald-500" />
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            {completionRate}%
          </span>
        </div>
      </div>

      {/* Online indicator */}
      <motion.div
        className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ boxShadow: "0 0 8px rgba(16, 185, 129, 0.6)" }}
      />
    </motion.div>
  );
}

/**
 * DriverStatsPillExpanded - Full stats view modal
 */
export function DriverStatsPillExpanded({ stats, onCollapse }) {
  const {
    rating = 4.8,
    totalRides = 1247,
    completionRate = 98,
    activeTime = "4.5h",
    todayRides = 12,
    earnings = 145000,
  } = stats || {};

  const reducedMotion = useMemo(() => prefersReducedMotion(), []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
      >
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCollapse}
          className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
        />

        {/* Expanded Card */}
        <motion.div
          initial={reducedMotion ? {} : { scale: 0.8, y: -50 }}
          animate={{ scale: 1, y: 0 }}
          exit={reducedMotion ? {} : { scale: 0.8, y: -50 }}
          transition={SPRING.smooth}
          className="relative w-full max-w-sm rounded-3xl p-6 bg-white dark:bg-[#1C1C1E] border border-gray-200 dark:border-gray-800"
          style={{
            boxShadow:
              "0 24px 48px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* Close Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onCollapse}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
          >
            <X size={16} className="text-gray-500 dark:text-gray-400" />
          </motion.button>

          {/* Header */}
          <div className="mb-6 text-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Tus estadísticas
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Rendimiento en tiempo real
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Rating Card - Featured */}
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...SPRING.snappy, delay: 0.1 }}
              className="col-span-2 rounded-2xl p-4 bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-800/10 border border-yellow-200 dark:border-yellow-900/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center">
                    <Star
                      size={24}
                      className="fill-yellow-500 text-yellow-500"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-0.5">
                      Calificación
                    </p>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                      {rating}
                    </h2>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {totalRides.toLocaleString()} viajes
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Today's Rides */}
            <StatCard
              icon={Clock}
              label="Hoy"
              value={todayRides}
              unit="viajes"
              delay={0.2}
              reducedMotion={reducedMotion}
            />

            {/* Active Time */}
            <StatCard
              icon={TrendingUp}
              label="Activo"
              value={activeTime}
              delay={0.25}
              reducedMotion={reducedMotion}
            />

            {/* Completion Rate */}
            <StatCard
              icon={Award}
              label="Completados"
              value={`${completionRate}%`}
              delay={0.3}
              reducedMotion={reducedMotion}
            />

            {/* Earnings */}
            <StatCard
              icon={DollarSign}
              label="Ganancia hoy"
              value={`$${Math.round(earnings / 1000)}K`}
              delay={0.35}
              reducedMotion={reducedMotion}
            />
          </div>

          {/* Close hint */}
          <motion.p
            initial={reducedMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs text-gray-400 dark:text-gray-500"
          >
            Toca fuera para cerrar
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * StatCard - Individual stat display
 */
function StatCard({ icon: Icon, label, value, unit, delay = 0, reducedMotion }) {
  return (
    <motion.div
      initial={reducedMotion ? {} : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...SPRING.snappy, delay }}
      className="rounded-2xl p-3 bg-gray-50 dark:bg-[#2C2C2E] border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="text-gray-400 dark:text-gray-500" />
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {label}
        </p>
      </div>
      <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-0.5">
        {value}
      </h3>
      {unit && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{unit}</p>
      )}
    </motion.div>
  );
}

export default DriverStatsPill;
