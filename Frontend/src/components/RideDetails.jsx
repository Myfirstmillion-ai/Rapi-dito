import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  MapPin,
  Phone,
  MessageSquare,
  ChevronLeft,
  X,
  Loader2,
  Star,
  Car,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";
import MessageBadge from "./ui/MessageBadge";

/**
 * RideDetails - Swiss Minimalist Luxury Ride Information Panel
 * Bottom sheet with driver/ride details matching LocationSearchPanel
 * 
 * Design Philosophy:
 * - Clean white/dark adaptive backgrounds
 * - Premium rounded corners (3xl)
 * - Clear information hierarchy
 * - Elegant action buttons
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
  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Spring animation config
  const springConfig = {
    type: "spring",
    damping: 30,
    stiffness: 300
  };

  const handleClose = () => {
    setShowPanel(false);
  };

  const handleBack = () => {
    setShowPanel(false);
    showPreviousPanel?.(true);
  };

  // Determine if we should show the "searching" state
  const isSearching = rideCreated && !confirmedRideData;
  
  // Determine if driver is assigned
  const hasDriver = confirmedRideData?._id;

  return (
    <AnimatePresence>
      {showPanel && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={prefersReducedMotion ? {} : { y: '100%' }}
            animate={{ y: 0 }}
            exit={prefersReducedMotion ? {} : { y: '100%' }}
            transition={springConfig}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4">
              <div className="flex items-center gap-3">
                {!rideCreated && !confirmedRideData && (
                  <button
                    onClick={handleBack}
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Volver"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                )}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {hasDriver ? 'Tu conductor' : isSearching ? 'Buscando conductor' : 'Confirmar viaje'}
                  </h2>
                  {!hasDriver && !isSearching && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Revisa los detalles de tu viaje
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Cerrar panel"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="px-5 pb-6 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 100px)' }}>
              
              {/* Searching State */}
              {isSearching && (
                <SearchingState prefersReducedMotion={prefersReducedMotion} />
              )}

              {/* Driver Card - When driver is assigned */}
              {hasDriver && (
                <DriverCard 
                  driver={confirmedRideData.captain}
                  otp={confirmedRideData.otp}
                  rideId={confirmedRideData._id}
                  unreadMessages={unreadMessages}
                  prefersReducedMotion={prefersReducedMotion}
                />
              )}

              {/* Vehicle Preview - Before driver assigned */}
              {!hasDriver && !isSearching && (
                <VehiclePreview 
                  vehicleType={selectedVehicle}
                  prefersReducedMotion={prefersReducedMotion}
                />
              )}

              {/* Route Card */}
              <RouteCard 
                pickup={pickupLocation}
                destination={destinationLocation}
              />

              {/* Fare Card */}
              <FareCard 
                fare={fare?.[selectedVehicle] || 0}
              />

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                {rideCreated || confirmedRideData ? (
                  <CancelButton 
                    onClick={cancelRide}
                    loading={loading}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                ) : (
                  <ConfirmButton 
                    onClick={createRide}
                    loading={loading}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * SearchingState - Elegant searching animation
 */
function SearchingState({ prefersReducedMotion }) {
  return (
    <div className="mb-6 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
      <div className="flex flex-col items-center text-center">
        {/* Pulsing Animation */}
        <div className="relative w-16 h-16 mb-4">
          <div 
            className="absolute inset-0 rounded-full bg-emerald-500/20"
            style={{
              animation: prefersReducedMotion ? 'none' : 'pulse 2s ease-in-out infinite'
            }}
          />
          <div 
            className="absolute inset-2 rounded-full bg-emerald-500/30"
            style={{
              animation: prefersReducedMotion ? 'none' : 'pulse 2s ease-in-out infinite',
              animationDelay: '0.3s'
            }}
          />
          <motion.div
            animate={prefersReducedMotion ? {} : { rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center"
          >
            <Loader2 className="w-5 h-5 text-white" />
          </motion.div>
        </div>
        
        <h3 className="text-base font-semibold text-emerald-700 dark:text-emerald-300 mb-1">
          Conectando con conductores
        </h3>
        <p className="text-sm text-emerald-600 dark:text-emerald-400">
          Esto puede tomar unos segundos
        </p>
        
        {/* Progress bar */}
        <div className="w-full h-1 bg-emerald-200 dark:bg-emerald-800 rounded-full mt-4 overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500 rounded-full"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: '40%' }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * DriverCard - Premium driver information display
 */
function DriverCard({ driver, otp, rideId, unreadMessages }) {
  // Memoize derived values to avoid recalculation on every render
  const driverName = useMemo(() => 
    `${driver?.fullname?.firstname || ''} ${driver?.fullname?.lastname || ''}`.trim(),
    [driver?.fullname?.firstname, driver?.fullname?.lastname]
  );
  const driverInitials = useMemo(() => 
    `${driver?.fullname?.firstname?.[0] || ''}${driver?.fullname?.lastname?.[0] || ''}`.toUpperCase(),
    [driver?.fullname?.firstname, driver?.fullname?.lastname]
  );
  
  return (
    <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
      {/* Driver Info Row */}
      <div className="flex items-center gap-4 mb-4">
        {/* Avatar */}
        {driver?.profileImage ? (
          <img
            src={driver.profileImage}
            alt={driverName}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/30"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center ring-2 ring-emerald-500/30">
            <span className="text-xl font-bold text-white">{driverInitials || 'C'}</span>
          </div>
        )}
        
        {/* Name & Rating */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {driverName || 'Conductor'}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <Star className="w-3 h-3 text-yellow-500" fill="currentColor" />
              <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">
                {driver?.rating?.toFixed(1) || '5.0'}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Verificado</span>
          </div>
        </div>
        
        {/* Contact Actions */}
        <div className="flex gap-2">
          <Link
            to={`/user/chat/${rideId}`}
            className="relative w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            {unreadMessages > 0 && (
              <MessageBadge count={unreadMessages} className="-top-1 -right-1" />
            )}
          </Link>
          <a
            href={`tel:${driver?.phone}`}
            className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center hover:bg-emerald-600 transition-colors"
          >
            <Phone className="w-5 h-5 text-white" />
          </a>
        </div>
      </div>
      
      {/* Vehicle Info */}
      <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-xl mb-3">
        <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <Car className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
            {driver?.vehicle?.color} {driver?.vehicle?.type === "car" ? "Carro" : "Moto"}
          </p>
          {(driver?.vehicle?.brand || driver?.vehicle?.model) && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {driver?.vehicle?.brand} {driver?.vehicle?.model}
            </p>
          )}
        </div>
        {/* License Plate */}
        <div className="px-3 py-2 bg-gray-900 dark:bg-white rounded-lg">
          <span className="text-sm font-bold text-white dark:text-gray-900 tracking-wider font-mono">
            {driver?.vehicle?.number || '---'}
          </span>
        </div>
      </div>
      
      {/* OTP Code */}
      <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Código de verificación</p>
            <p className="text-[10px] text-emerald-500 dark:text-emerald-500">Muéstralo al conductor</p>
          </div>
        </div>
        <div className="px-4 py-2 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
          <span className="text-xl font-bold text-gray-900 dark:text-white tracking-widest">
            {otp}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * VehiclePreview - Simple vehicle type preview
 */
function VehiclePreview({ vehicleType, prefersReducedMotion }) {
  const imageSrc = vehicleType === "car" ? "/Uber-PNG-Photos.png" : `/${vehicleType}.webp`;
  
  return (
    <motion.div 
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl"
    >
      <div className="flex items-center justify-center">
        <img
          src={imageSrc}
          className="h-16 w-auto"
          alt={vehicleType === "car" ? "Carro" : "Moto"}
        />
      </div>
    </motion.div>
  );
}

/**
 * RouteCard - Pickup and destination display
 */
function RouteCard({ pickup, destination }) {
  // Memoize parsed location strings to avoid redundant string processing
  const { pickupMain, pickupSecondary } = useMemo(() => {
    const parts = pickup?.split(", ") || [''];
    return {
      pickupMain: parts[0] || '',
      pickupSecondary: parts.slice(1).join(", ") || ''
    };
  }, [pickup]);
  
  const { destMain, destSecondary } = useMemo(() => {
    const parts = destination?.split(", ") || [''];
    return {
      destMain: parts[0] || '',
      destSecondary: parts.slice(1).join(", ") || ''
    };
  }, [destination]);
  
  return (
    <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
      {/* Pickup */}
      <div className="flex items-start gap-3 mb-3">
        <div className="mt-1 w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Recogida</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{pickupMain}</p>
          {pickupSecondary && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{pickupSecondary}</p>
          )}
        </div>
      </div>
      
      {/* Connector */}
      <div className="ml-1.5 border-l-2 border-dashed border-gray-300 dark:border-gray-600 h-4 my-1" />
      
      {/* Destination */}
      <div className="flex items-start gap-3">
        <MapPin className="mt-1 w-3 h-3 text-red-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Destino</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{destMain}</p>
          {destSecondary && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{destSecondary}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * FareCard - Payment information display
 */
function FareCard({ fare }) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-300">Efectivo</span>
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          COP$ {fare?.toLocaleString('es-CO') || 0}
        </span>
      </div>
    </div>
  );
}

/**
 * ConfirmButton - Primary action button
 */
function ConfirmButton({ onClick, loading, prefersReducedMotion }) {
  return (
    <motion.button
      whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={loading}
      className="w-full h-14 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold text-base shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          <span>Confirmar Viaje</span>
          <span className="text-emerald-200">→</span>
        </>
      )}
    </motion.button>
  );
}

/**
 * CancelButton - Secondary destructive action
 */
function CancelButton({ onClick, loading, prefersReducedMotion }) {
  return (
    <motion.button
      whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={loading}
      className="w-full h-14 rounded-full bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          <X className="w-5 h-5" />
          <span>Cancelar Viaje</span>
        </>
      )}
    </motion.button>
  );
}

export default RideDetails;
