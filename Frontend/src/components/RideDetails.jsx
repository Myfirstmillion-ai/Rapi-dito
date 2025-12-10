import { useState, useRef, useCallback } from "react";
import {
  CreditCard,
  MapPinMinus,
  MapPinPlus,
  PhoneCall,
  SendHorizontal,
  ArrowLeft,
  AlertTriangle,
  X,
} from "lucide-react";
import Button from "./Button";
import MessageBadge from "./ui/MessageBadge";

/**
 * RideDetails - Swiss Minimalist Luxury Active Trip Card
 * 
 * Features:
 * - Floating Island card (not attached to bottom edge)
 * - Big, bold driver info (Car Plate, Driver Name)
 * - Slide to Cancel safety mechanism
 * - Minimalist solid background with deep shadows
 */

// Slide to cancel handle width constant (w-12 = 48px + padding = 56px total)
const SLIDE_HANDLE_WIDTH = 56;

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
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);
  const sliderRef = useRef(null);
  const sliderTrackRef = useRef(null);

  // Handle slide to cancel
  const handleSlideStart = useCallback((e) => {
    if (loading) return;
    const startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const track = sliderTrackRef.current;
    const trackWidth = track?.offsetWidth || 200;
    
    const handleMove = (moveEvent) => {
      const currentX = moveEvent.type === 'touchmove' 
        ? moveEvent.touches[0].clientX 
        : moveEvent.clientX;
      const diff = currentX - startX;
      const progress = Math.max(0, Math.min(1, diff / (trackWidth - SLIDE_HANDLE_WIDTH)));
      setSlideProgress(progress);
      
      if (progress >= 0.9) {
        handleSlideEnd();
        cancelRide();
      }
    };
    
    const handleEnd = () => {
      setSlideProgress(0);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
    
    const handleSlideEnd = () => {
      setSlideProgress(0);
    };
    
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleEnd);
  }, [loading, cancelRide]);
  
  return (
    <div
      className={`${showPanel ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"} 
        transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] 
        fixed bottom-0 left-0 right-0 z-20 px-4`}
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)' }}
    >
      {/* Floating Island Card */}
      <div 
        className="bg-slate-900 rounded-[28px] shadow-2xl overflow-hidden"
        style={{ 
          boxShadow: '0 -4px 40px rgba(0, 0, 0, 0.3), 0 8px 32px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-white/20 rounded-full" />
        </div>

        <div className="px-5 pb-5 max-h-[70dvh] overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          {/* Back Button - Only show before ride is created */}
          {!rideCreated && !confirmedRideData && showPreviousPanel && (
            <button
              onClick={() => {
                setShowPanel(false);
                showPreviousPanel(true);
              }}
              className="mb-4 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">Cambiar vehículo</span>
            </button>
          )}

          {/* Driver Details - Premium Floating Island Style */}
          {confirmedRideData?._id ? (
            <div className="space-y-4">
              {/* Driver Profile - BIG and BOLD */}
              <div className="flex items-center gap-4">
                {/* Driver Photo */}
                <div className="flex-shrink-0">
                  {confirmedRideData?.captain?.profileImage ? (
                    <img 
                      src={confirmedRideData.captain.profileImage} 
                      alt={confirmedRideData?.captain?.fullname?.firstname}
                      className="w-20 h-20 rounded-2xl object-cover shadow-xl"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-xl">
                      <span className="text-2xl font-black text-white">
                        {confirmedRideData?.captain?.fullname?.firstname?.[0]?.toUpperCase() || 'C'}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Driver Name & Rating */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-black text-white truncate">
                    {confirmedRideData?.captain?.fullname?.firstname}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-white font-bold">
                      {confirmedRideData?.captain?.rating?.toFixed(1) || "5.0"}
                    </span>
                    <span className="text-white/40 text-sm">• Verificado</span>
                  </div>
                </div>
              </div>

              {/* License Plate - MASSIVE and PROMINENT */}
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Placa del vehículo</p>
                    <p className="text-slate-400 text-xs mt-0.5">Verifica antes de abordar</p>
                  </div>
                  <div className="bg-slate-900 px-5 py-3 rounded-xl">
                    <span className="text-2xl font-black text-white tracking-wider font-mono">
                      {confirmedRideData?.captain?.vehicle?.number || "---"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Vehicle Info Compact */}
              <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                <img
                  src={selectedVehicle === "car" ? "/Uber-PNG-Photos.png" : `/${selectedVehicle}.webp`}
                  className="h-12 w-auto"
                  alt="Vehículo"
                />
                <div className="flex-1">
                  <p className="text-white font-bold capitalize">
                    {confirmedRideData?.captain?.vehicle?.color}{" "}
                    {confirmedRideData?.captain?.vehicle?.type === "car" ? "Carro" : "Moto"}
                  </p>
                  <p className="text-white/50 text-sm">
                    {confirmedRideData?.captain?.vehicle?.brand} {confirmedRideData?.captain?.vehicle?.model}
                  </p>
                </div>
              </div>

              {/* OTP Code */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-400 text-xs font-bold uppercase">Código de verificación</p>
                    <p className="text-white/50 text-xs mt-0.5">Muéstralo al conductor</p>
                  </div>
                  <span className="text-3xl font-black text-white tracking-wider">
                    {confirmedRideData?.otp}
                  </span>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Button
                    type="link"
                    path={`/user/chat/${confirmedRideData?._id}`}
                    title="Mensaje"
                    icon={<SendHorizontal strokeWidth={2} size={18} />}
                    classes="bg-white/10 hover:bg-white/15 font-semibold text-sm text-white w-full rounded-xl shadow-lg transition-all h-12"
                  />
                  {unreadMessages > 0 && (
                    <MessageBadge count={unreadMessages} className="-top-1 -right-1" />
                  )}
                </div>
                <a
                  href={"tel:" + confirmedRideData?.captain?.phone}
                  className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all shadow-lg"
                >
                  <PhoneCall size={20} strokeWidth={2.5} className="text-white" />
                </a>
              </div>
            </div>
          ) : (
            /* Pre-confirmation View */
            <div className="flex items-center justify-center py-6">
              <img
                src={selectedVehicle === "car" ? "/Uber-PNG-Photos.png" : `/${selectedVehicle}.webp`}
                className="h-20 w-auto drop-shadow-xl"
                alt="Vehículo"
              />
            </div>
          )}

          {/* Route Summary - Compact */}
          <div className="mt-4 bg-white/5 rounded-xl p-4 space-y-3">
            {/* Pickup */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <MapPinMinus size={14} className="text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{pickupLocation.split(", ")[0]}</p>
              </div>
            </div>
            
            {/* Connector */}
            <div className="flex items-center gap-3 pl-4">
              <div className="w-px h-4 bg-white/20" />
            </div>
            
            {/* Destination */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                <MapPinPlus size={14} className="text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{destinationLocation.split(", ")[0]}</p>
              </div>
            </div>

            {/* Fare */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div className="flex items-center gap-2">
                <CreditCard size={16} className="text-white/40" />
                <span className="text-white/60 text-sm">Efectivo</span>
              </div>
              <span className="text-xl font-bold text-white">
                ${Math.floor(fare[selectedVehicle] / 1000)}K
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-5">
            {rideCreated || confirmedRideData ? (
              /* Slide to Cancel - High Safety Design */
              <div className="relative">
                {/* Cancel Confirmation Modal */}
                {showCancelConfirm && (
                  <div className="absolute inset-0 bg-slate-900 rounded-xl p-4 flex flex-col items-center justify-center z-10 animate-fade-in">
                    <AlertTriangle className="w-8 h-8 text-red-400 mb-2" />
                    <p className="text-white font-bold mb-1">¿Cancelar viaje?</p>
                    <p className="text-white/50 text-sm mb-4 text-center">Se puede aplicar una tarifa de cancelación</p>
                    <div className="flex gap-3 w-full">
                      <button
                        onClick={() => setShowCancelConfirm(false)}
                        className="flex-1 h-12 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/15 transition-all"
                      >
                        No, continuar
                      </button>
                      <button
                        onClick={cancelRide}
                        disabled={loading}
                        className="flex-1 h-12 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all disabled:opacity-50"
                      >
                        {loading ? 'Cancelando...' : 'Sí, cancelar'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Slide to Cancel Track */}
                <div 
                  ref={sliderTrackRef}
                  className="relative h-14 bg-red-500/10 border-2 border-red-500/30 rounded-full overflow-hidden"
                >
                  {/* Progress Fill */}
                  <div 
                    className="absolute inset-y-0 left-0 bg-red-500/20 transition-all duration-75"
                    style={{ width: `${slideProgress * 100}%` }}
                  />
                  
                  {/* Slide Handle */}
                  <div
                    ref={sliderRef}
                    onMouseDown={handleSlideStart}
                    onTouchStart={handleSlideStart}
                    className="absolute top-1 bottom-1 left-1 w-12 bg-red-500 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg transition-transform"
                    style={{ 
                      transform: `translateX(${slideProgress * (sliderTrackRef.current?.offsetWidth - SLIDE_HANDLE_WIDTH || 0)}px)`,
                    }}
                  >
                    <X className="w-5 h-5 text-white" />
                  </div>
                  
                  {/* Text */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className={`text-sm font-semibold transition-opacity ${slideProgress > 0.3 ? 'opacity-0' : 'text-red-400'}`}>
                      Desliza para cancelar →
                    </span>
                  </div>
                </div>
                
                {/* Alternative: Tap to show confirmation */}
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="w-full mt-2 text-center text-red-400/60 text-xs hover:text-red-400 transition-colors"
                >
                  O toca aquí para cancelar
                </button>
              </div>
            ) : (
              /* Confirm Ride Button */
              <button
                onClick={createRide}
                disabled={loading}
                className="w-full h-14 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 
                  hover:from-emerald-400 hover:to-emerald-500 
                  active:scale-[0.98] transition-all duration-200
                  flex items-center justify-center gap-2
                  shadow-xl shadow-emerald-500/30
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="text-lg font-bold text-white">Confirmar Viaje</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RideDetails;
