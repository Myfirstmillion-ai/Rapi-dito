import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Navigation,
  Phone,
  MessageCircle,
  CreditCard,
  ChevronLeft,
  Loader2,
  X,
  User,
  Star,
  Shield,
  Car,
} from "lucide-react";
import MessageBadge from "./ui/MessageBadge";
import { SPRING, triggerHaptic, prefersReducedMotion } from "../styles/swissLuxury";

/**
 * RideDetails - Swiss Luxury Minimalist iOS Style
 *
 * Premium ride confirmation panel with:
 * - Floating island design
 * - Light/Dark mode support
 * - Driver info card
 * - Route display
 * - Physics-based animations
 */

function RideDetails({
  pickupLocation,
  destinationLocation,
  selectedVehicle,
  fare,
  showPanel,
  setShowPanel,
  showPreviousPanel,
  createRide,
  cancelRide,
  loading,
  rideCreated,
  confirmedRideData,
  unreadMessages = 0,
}) {
  const reducedMotion = useMemo(() => prefersReducedMotion(), []);

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "$0";
    return `COP $${amount.toLocaleString("es-CO")}`;
  };

  // Vehicle display name
  const vehicleDisplay = selectedVehicle === "car" ? "Carro" : "Moto";

  return (
    <AnimatePresence>
      {showPanel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !loading && setShowPanel(false)}
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
                if ((offset.y > 120 || velocity.y > 400) && !loading) {
                  setShowPanel(false);
                  triggerHaptic("light");
                }
              }}
              className="bg-white dark:bg-[#1C1C1E] rounded-[32px] overflow-hidden max-h-[85vh]"
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

              {/* Scrollable Content */}
              <div className="px-5 pb-6 overflow-y-auto max-h-[calc(85vh-40px)]">
                {/* Back Button */}
                {!rideCreated && !confirmedRideData && showPreviousPanel && (
                  <motion.button
                    initial={reducedMotion ? {} : { opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowPanel(false);
                      showPreviousPanel(true);
                      triggerHaptic("light");
                    }}
                    className="mb-4 flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ChevronLeft size={18} strokeWidth={2.5} />
                    <span className="text-sm font-semibold">Cambiar vehículo</span>
                  </motion.button>
                )}

                {/* Loading State */}
                {rideCreated && !confirmedRideData && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-8 rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/20 relative overflow-hidden"
                  >
                    {/* Pulse Rings */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {[1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          animate={{
                            scale: [1, 2.5],
                            opacity: [0.4, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.4,
                            ease: "easeOut",
                          }}
                          className="absolute w-16 h-16 rounded-full border-2 border-emerald-500"
                        />
                      ))}
                    </div>

                    <div className="relative z-10 text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500 flex items-center justify-center"
                      >
                        <Loader2 size={28} className="text-white" />
                      </motion.div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        Conectando con conductores
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Esto puede tomar unos segundos
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Driver Info Card - When Ride Confirmed */}
                {confirmedRideData?._id && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4"
                  >
                    {/* Driver Profile Card */}
                    <div className="p-5 rounded-3xl bg-gray-50 dark:bg-[#2C2C2E] mb-4">
                      <div className="flex items-center gap-4 mb-4">
                        {/* Avatar */}
                        <div className="relative">
                          {confirmedRideData.captain?.profileImage ? (
                            <img
                              src={confirmedRideData.captain.profileImage}
                              alt="Conductor"
                              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/30"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                              <User size={28} className="text-white" />
                            </div>
                          )}
                          {/* Online Indicator */}
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#2C2C2E]" />
                        </div>

                        {/* Driver Info */}
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium mb-0.5">
                            Tu conductor
                          </p>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {confirmedRideData.captain?.fullname?.firstname}{" "}
                            {confirmedRideData.captain?.fullname?.lastname}
                          </h3>
                          {confirmedRideData.captain?.rating && (
                            <div className="flex items-center gap-1 mt-1">
                              <Star
                                size={14}
                                className="fill-yellow-400 text-yellow-400"
                              />
                              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {confirmedRideData.captain.rating.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Vehicle Info Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-3 rounded-2xl bg-white dark:bg-[#1C1C1E]">
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium mb-1">
                            Vehículo
                          </p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {confirmedRideData.captain?.vehicle?.type === "car"
                              ? "Carro"
                              : "Moto"}
                          </p>
                        </div>
                        <div className="p-3 rounded-2xl bg-white dark:bg-[#1C1C1E]">
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium mb-1">
                            Color
                          </p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">
                            {confirmedRideData.captain?.vehicle?.color}
                          </p>
                        </div>
                      </div>

                      {/* License Plate - Prominent */}
                      <div className="p-4 rounded-2xl bg-gray-900 dark:bg-black flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">
                            Placa
                          </p>
                          <p className="text-xs text-emerald-400">
                            Verifica antes de abordar
                          </p>
                        </div>
                        <div className="px-4 py-2 bg-white rounded-xl">
                          <span className="text-xl font-black tracking-widest text-gray-900">
                            {confirmedRideData.captain?.vehicle?.number || "---"}
                          </span>
                        </div>
                      </div>

                      {/* OTP Code */}
                      <div className="mt-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/20 border border-emerald-200 dark:border-emerald-700/30 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-emerald-700 dark:text-emerald-400 uppercase tracking-wide font-medium mb-0.5">
                            Código de verificación
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Muéstralo al conductor
                          </p>
                        </div>
                        <div className="px-5 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                          <span className="text-2xl font-black tracking-wider text-gray-900 dark:text-white">
                            {confirmedRideData.otp}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Buttons */}
                    <div className="flex gap-3 mb-4">
                      <motion.a
                        href={`/user/chat/${confirmedRideData._id}`}
                        whileTap={{ scale: 0.95 }}
                        className="relative flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        <MessageCircle size={20} />
                        <span>Mensaje</span>
                        {unreadMessages > 0 && (
                          <MessageBadge count={unreadMessages} />
                        )}
                      </motion.a>

                      <motion.a
                        href={`tel:${confirmedRideData.captain?.phone}`}
                        whileTap={{ scale: 0.95 }}
                        className="w-14 h-14 flex items-center justify-center rounded-2xl bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-lg"
                        style={{
                          boxShadow: "0 4px 12px rgba(16, 185, 129, 0.35)",
                        }}
                      >
                        <Phone size={22} className="text-white" />
                      </motion.a>
                    </div>
                  </motion.div>
                )}

                {/* Route Display */}
                <div className="p-4 rounded-3xl bg-gray-50 dark:bg-[#2C2C2E] mb-4">
                  {/* Pickup */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium mb-1">
                        Recogida
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {pickupLocation?.split(", ")[0]}
                      </p>
                    </div>
                  </div>

                  {/* Connector */}
                  <div className="flex flex-col items-center gap-1 pl-5 py-1">
                    <div className="w-0.5 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                    <div className="w-0.5 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                    <div className="w-0.5 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                  </div>

                  {/* Destination */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 rounded-sm bg-gray-500 dark:bg-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium mb-1">
                        Destino
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {destinationLocation?.split(", ")[0]}
                      </p>
                    </div>
                  </div>

                  {/* Fare Display */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <CreditCard
                        size={18}
                        className="text-gray-400 dark:text-gray-500"
                      />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Efectivo
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                      {formatCurrency(fare?.[selectedVehicle])}
                    </h2>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {rideCreated || confirmedRideData ? (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        cancelRide();
                        triggerHaptic("heavy");
                      }}
                      disabled={loading}
                      className="w-full py-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60 transition-colors shadow-lg"
                      style={{
                        boxShadow: "0 4px 16px rgba(239, 68, 68, 0.35)",
                      }}
                    >
                      {loading ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <X size={20} />
                      )}
                      <span>Cancelar Viaje</span>
                    </motion.button>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        createRide();
                        triggerHaptic("heavy");
                      }}
                      disabled={loading}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60 transition-all shadow-lg"
                      style={{
                        boxShadow: "0 4px 16px rgba(16, 185, 129, 0.35)",
                      }}
                    >
                      {loading ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <Navigation size={20} />
                      )}
                      <span>Confirmar Viaje</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default RideDetails;
