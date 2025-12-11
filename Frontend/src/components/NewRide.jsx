import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Navigation,
  User,
  Phone,
  MessageCircle,
  CreditCard,
  Clock,
  CheckCircle2,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import MessageBadge from "./ui/MessageBadge";
import { SPRING, triggerHaptic, prefersReducedMotion } from "../styles/swissLuxury";

/**
 * NewRide - Swiss Luxury Minimalist iOS Style (Captain/Driver View)
 *
 * Premium ride request panel for drivers with:
 * - Floating island design
 * - Light/Dark mode support
 * - Passenger info display
 * - Route preview
 * - Accept/Verify/End actions
 * - Physics-based animations
 */

function NewRide({
  rideData,
  otp,
  setOtp,
  showBtn,
  showPanel,
  setShowPanel,
  showPreviousPanel,
  loading,
  acceptRide,
  verifyOTP,
  endRide,
  cancelRide,
  error,
  unreadMessages = 0,
}) {
  const reducedMotion = useMemo(() => prefersReducedMotion(), []);

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "$0";
    return `COP $${amount.toLocaleString("es-CO")}`;
  };

  // Get status display
  const getStatusInfo = () => {
    switch (showBtn) {
      case "accept":
        return { text: "Nueva solicitud", color: "emerald" };
      case "otp":
        return { text: "Ingresa el OTP", color: "blue" };
      case "end-ride":
        return { text: "Viaje en curso", color: "emerald" };
      default:
        return { text: "Pendiente", color: "gray" };
    }
  };

  const statusInfo = getStatusInfo();

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

              {/* Content */}
              <div className="px-5 pb-6 overflow-y-auto max-h-[calc(85vh-40px)]">
                {/* Header with Status Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      Detalles del viaje
                    </h2>
                    <div
                      className={`
                        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          statusInfo.color === "emerald"
                            ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400"
                            : statusInfo.color === "blue"
                            ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                        }
                      `}
                    >
                      <span className="relative flex h-2 w-2">
                        <span
                          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                            statusInfo.color === "emerald"
                              ? "bg-emerald-400"
                              : statusInfo.color === "blue"
                              ? "bg-blue-400"
                              : "bg-gray-400"
                          }`}
                        />
                        <span
                          className={`relative inline-flex rounded-full h-2 w-2 ${
                            statusInfo.color === "emerald"
                              ? "bg-emerald-500"
                              : statusInfo.color === "blue"
                              ? "bg-blue-500"
                              : "bg-gray-500"
                          }`}
                        />
                      </span>
                      {statusInfo.text}
                    </div>
                  </div>
                </div>

                {/* Passenger Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-3xl bg-gray-50 dark:bg-[#2C2C2E] mb-4"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                      <User size={24} className="text-white" />
                    </div>

                    {/* Passenger Info */}
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium mb-0.5">
                        Pasajero
                      </p>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {rideData?.user?.fullname?.firstname}{" "}
                        {rideData?.user?.fullname?.lastname}
                      </h3>
                    </div>

                    {/* Contact Buttons */}
                    {(showBtn === "otp" || showBtn === "end-ride") && (
                      <div className="flex gap-2">
                        <motion.a
                          href={`/captain/chat/${rideData?._id}`}
                          whileTap={{ scale: 0.9 }}
                          className="relative w-11 h-11 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          <MessageCircle size={18} className="text-gray-700 dark:text-gray-300" />
                          {unreadMessages > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                              <span className="text-[10px] font-bold text-white">
                                {unreadMessages > 9 ? "9+" : unreadMessages}
                              </span>
                            </div>
                          )}
                        </motion.a>
                        <motion.a
                          href={`tel:${rideData?.user?.phone}`}
                          whileTap={{ scale: 0.9 }}
                          className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center hover:bg-emerald-600 transition-colors"
                          style={{ boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)" }}
                        >
                          <Phone size={18} className="text-white" />
                        </motion.a>
                      </div>
                    )}
                  </div>
                </motion.div>

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
                      <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {rideData?.pickup}
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
                      <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {rideData?.destination}
                      </p>
                    </div>
                  </div>

                  {/* Fare & Info */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Clock size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ~{rideData?.duration || 10} min
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {((rideData?.distance || 0) / 1000).toFixed(1)} km
                        </span>
                      </div>
                    </div>
                    <h2 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(rideData?.fare)}
                    </h2>
                  </div>
                </div>

                {/* OTP Input Section */}
                {showBtn === "otp" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700/30"
                  >
                    <p className="text-xs text-blue-700 dark:text-blue-400 uppercase tracking-wide font-medium mb-3 text-center">
                      Ingresa el código que te dio el pasajero
                    </p>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="000000"
                      className="w-full text-center text-3xl font-black tracking-[0.5em] py-4 bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-700/50 focus:border-blue-500 dark:focus:border-blue-400 rounded-2xl outline-none text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 transition-colors"
                    />
                    {error && (
                      <div className="flex items-center gap-2 mt-3 text-red-500">
                        <AlertCircle size={16} />
                        <span className="text-sm font-medium">{error}</span>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  {showBtn === "accept" && (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        acceptRide();
                        triggerHaptic("success");
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
                        <CheckCircle2 size={20} />
                      )}
                      <span>Aceptar Viaje</span>
                    </motion.button>
                  )}

                  {showBtn === "otp" && (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        verifyOTP();
                        triggerHaptic("success");
                      }}
                      disabled={loading || otp.length !== 6}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60 transition-all shadow-lg"
                      style={{
                        boxShadow: "0 4px 16px rgba(59, 130, 246, 0.35)",
                      }}
                    >
                      {loading ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <Navigation size={20} />
                      )}
                      <span>Iniciar Viaje</span>
                    </motion.button>
                  )}

                  {showBtn === "end-ride" && (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        endRide();
                        triggerHaptic("success");
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
                        <CheckCircle2 size={20} />
                      )}
                      <span>Finalizar Viaje</span>
                    </motion.button>
                  )}

                  {/* Cancel Button */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      cancelRide();
                      triggerHaptic("heavy");
                    }}
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold flex items-center justify-center gap-2 disabled:opacity-60 transition-colors"
                  >
                    <X size={18} />
                    <span>Cancelar</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default NewRide;
