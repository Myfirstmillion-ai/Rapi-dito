import { useState } from "react";
import {
  CreditCard,
  MapPinMinus,
  MapPinPlus,
  PhoneCall,
  SendHorizontal,
  ChevronDown,
  ChevronUp,
  GripHorizontal,
  Navigation,
  Clock,
  ArrowLeft,
} from "lucide-react";
import Button from "./Button";
import MessageBadge from "./ui/MessageBadge";

// UI Constants
const BUTTON_CLASSES = {
  message: "bg-white/10 hover:bg-white/20 backdrop-blur-xl font-semibold text-sm text-white w-full rounded-xl shadow-lg border border-white/20 transition-all hover:border-white/30",
  call: "flex items-center justify-center px-5 h-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-500/30 border border-emerald-400/20"
};

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
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  
  return (
    <>
      <div
        className={`${
          showPanel ? "bottom-0" : "-bottom-full"
        } ${
          isMinimized ? "max-h-[25dvh]" : "max-h-[65dvh]"
        } transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] fixed left-0 right-0 bg-slate-900/95 backdrop-blur-xl w-full rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)] border-t border-white/10 z-20 overflow-hidden`}
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 20px)' }}
      >
        {/* Premium Drag Handle */}
        <div 
          onClick={toggleMinimize}
          className="flex justify-center py-2.5 cursor-pointer hover:bg-white/5 active:bg-white/10 transition-colors group"
        >
          <div className="flex flex-col items-center gap-1.5">
            <GripHorizontal size={24} className="text-white/30 group-hover:text-white/50 transition-colors" />
            {isMinimized ? (
              <ChevronUp size={18} className="text-white/40 group-hover:text-white/70 transition-colors" />
            ) : (
              <ChevronDown size={18} className="text-white/40 group-hover:text-white/70 transition-colors" />
            )}
          </div>
        </div>

        <div className="px-4 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', maxHeight: 'calc(65dvh - 60px - max(env(safe-area-inset-bottom, 0px), 20px))' }}>
          {/* Back Button - Only show before ride is created */}
          {!rideCreated && !confirmedRideData && !isMinimized && showPreviousPanel && (
            <button
              onClick={() => {
                setShowPanel(false);
                showPreviousPanel(true);
              }}
              className="mb-3 flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Cambiar vehículo</span>
            </button>
          )}
          
          {/* Searching Animation - Premium Radar Pulse Effect */}
          {rideCreated && !confirmedRideData && !isMinimized && (
            <div className="mb-4 relative bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 backdrop-blur-xl border border-emerald-400/20 rounded-[28px] p-6 overflow-hidden">
              {/* Animated gradient background pulse */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 animate-pulse" />

              <div className="relative flex flex-col items-center gap-4">
                {/* Enhanced Radar Pulse Animation - Multiple Ripples */}
                <div className="relative w-20 h-20 flex items-center justify-center">
                  {/* Outer ripple - slowest */}
                  <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" style={{ animationDuration: '2s' }} />
                  {/* Middle ripple - medium */}
                  <div className="absolute inset-3 rounded-full bg-emerald-400/30 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }} />
                  {/* Inner ripple - fastest */}
                  <div className="absolute inset-6 rounded-full bg-emerald-400/40 animate-ping" style={{ animationDuration: '1s', animationDelay: '0.6s' }} />
                  {/* Center dot with glow */}
                  <div className="absolute inset-0 m-auto w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-500/50 animate-pulse" />
                </div>

                {/* Text with breathing effect */}
                <div className="text-center space-y-2">
                  <h1 className="text-base sm:text-lg font-bold text-white animate-pulse" style={{ textWrap: 'balance', animationDuration: '2s' }}>
                    Conectando con conductores cercanos...
                  </h1>
                  <p className="text-sm text-white/60 font-medium" style={{ textWrap: 'balance' }}>
                    Esto puede tomar unos segundos
                  </p>
                </div>

                {/* Enhanced Progress bar with shimmer and gradient */}
                <div className="w-full overflow-hidden rounded-full h-2 bg-white/10 shadow-inner">
                  <div 
                    className="h-full w-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-[length:200%_100%]" 
                    style={{
                      animation: 'shimmer 1.5s ease-in-out infinite'
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          {isMinimized ? (
            /* Minimized View - Premium Summary with Profile Photo */
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {confirmedRideData?.captain?.profileImage ? (
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-400/50 shadow-lg">
                      <img 
                        src={confirmedRideData.captain.profileImage} 
                        alt="Conductor" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={
                        selectedVehicle === "car"
                          ? "/Uber-PNG-Photos.png"
                          : `/${selectedVehicle}.webp`
                      }
                      className="h-14 w-auto"
                      alt="Vehículo"
                    />
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-400 font-medium">
                    {confirmedRideData ? "Tu conductor" : "Tu viaje"}
                  </p>
                  <h1 className="text-base font-bold text-white capitalize">
                    {confirmedRideData 
                      ? `${confirmedRideData.captain?.fullname?.firstname || ''} ${confirmedRideData.captain?.fullname?.lastname?.[0] || ''}.`
                      : selectedVehicle === "car" ? "Carro" : "Moto"
                    }
                  </h1>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-medium">Total</p>
                <h1 className="font-bold text-xl text-emerald-400">
                  ${Math.floor(fare[selectedVehicle] / 1000)}K
                </h1>
              </div>
            </div>
          ) : (
            /* Maximized View - Premium Details */
            <>
          {/* Premium Driver Details Card - Glassmorphism Design */}
          {confirmedRideData?._id ? (
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-5 mb-4 shadow-2xl overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10 pointer-events-none rounded-3xl" />
              
              {/* Top glow accent */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
              
              <div className="relative space-y-4">
                {/* Driver Profile Section - Focal Point */}
                <div className="flex items-start gap-4">
                  {/* Driver Photo with Ring */}
                  <div className="flex-shrink-0">
                    {confirmedRideData?.captain?.profileImage ? (
                      <img 
                        src={confirmedRideData.captain.profileImage} 
                        alt={`${confirmedRideData?.captain?.fullname?.firstname} ${confirmedRideData?.captain?.fullname?.lastname}`}
                        className="w-24 h-24 rounded-2xl object-cover border-2 border-white/20 shadow-lg ring-4 ring-emerald-400/30"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg border-2 border-white/20 ring-4 ring-emerald-400/30 ${confirmedRideData?.captain?.profileImage ? 'hidden' : 'flex'}`}
                    >
                      <span className="text-3xl font-black text-white">
                        {confirmedRideData?.captain?.fullname?.firstname?.[0]?.toUpperCase() || 'C'}
                        {confirmedRideData?.captain?.fullname?.lastname?.[0]?.toUpperCase() || ''}
                      </span>
                    </div>
                  </div>
                  
                  {/* Driver Name & Info */}
                  <div className="flex-1 space-y-1.5">
                    <p className="text-xs text-white/50 font-semibold uppercase tracking-wider">Tu conductor</p>
                    <h1 className="text-xl font-black text-white leading-tight">
                      {confirmedRideData?.captain?.fullname?.firstname}{" "}
                      {confirmedRideData?.captain?.fullname?.lastname}
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1.5 bg-yellow-500/20 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-yellow-500/30">
                        <span className="text-yellow-400 text-sm">★</span>
                        <span className="text-sm font-bold text-yellow-400">
                          {confirmedRideData?.captain?.rating?.toFixed(1) || "5.0"}
                        </span>
                      </div>
                      <span className="text-xs text-white/40 font-medium">Conductor verificado</span>
                    </div>
                  </div>
                </div>

                {/* Vehicle Information - Elegant Display */}
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 space-y-3">
                  {/* Vehicle Icon */}
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/10 flex items-center justify-center shadow-lg">
                      <img
                        src={
                          selectedVehicle === "car"
                            ? "/Uber-PNG-Photos.png"
                            : `/${selectedVehicle}.webp`
                        }
                        className="h-10 w-auto"
                        alt="Vehículo"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-white/50 font-medium mb-1">Vehículo</p>
                      <p className="text-sm font-bold text-white capitalize leading-tight">
                        {confirmedRideData?.captain?.vehicle?.color}{" "}
                        {confirmedRideData?.captain?.vehicle?.type === "car" ? "Carro" : "Moto"}
                      </p>
                      {(confirmedRideData?.captain?.vehicle?.brand || confirmedRideData?.captain?.vehicle?.model) && (
                        <p className="text-xs text-white/60 font-medium mt-0.5">
                          {confirmedRideData?.captain?.vehicle?.brand} {confirmedRideData?.captain?.vehicle?.model}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* License Plate Badge - ULTRA-PREMIUM High Contrast Design */}
                  <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border-3 border-white/30 rounded-2xl px-5 py-4 shadow-2xl shadow-black/50">
                    {/* Subtle shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-2xl" />
                    {/* Top accent */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    
                    <div className="relative flex items-center justify-between">
                      <div>
                        <span className="text-xs text-white/60 font-bold uppercase tracking-widest block mb-1">Placa</span>
                        <span className="text-[9px] text-emerald-400 font-semibold">Verifica antes de abordar</span>
                      </div>
                      <div className="bg-white/95 px-4 py-2.5 rounded-xl shadow-lg">
                        <span className="text-2xl font-black text-slate-900 tracking-[0.2em] font-mono" style={{ letterSpacing: '0.15em' }}>
                          {confirmedRideData?.captain?.vehicle?.number || "---"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* OTP Code - Critical & Integrated Glass Design */}
                <div className="relative bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl border-2 border-emerald-400/40 rounded-2xl p-4 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-cyan-400/5 rounded-2xl" />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-xs text-emerald-300/80 font-bold uppercase tracking-wide mb-1">Código de verificación</p>
                      <p className="text-xs text-white/60">Muéstralo al conductor</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/20 shadow-lg">
                      <span className="text-2xl font-black text-white tracking-wider">
                        {confirmedRideData?.otp}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Vehicle Selection View - Before Driver Assigned */
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 mb-4 shadow-lg">
              <div className="flex justify-center">
                <img
                  src={
                    selectedVehicle === "car"
                      ? "/Uber-PNG-Photos.png"
                      : `/${selectedVehicle}.webp`
                  }
                  className="h-16 w-auto"
                  alt="Vehículo"
                />
              </div>
            </div>
          )}
          {/* Premium Contact Actions - Glass Theme */}
          {confirmedRideData?._id && (
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Button
                  type={"link"}
                  path={`/user/chat/${confirmedRideData?._id}`}
                  title={"Enviar mensaje"}
                  icon={<SendHorizontal strokeWidth={2} size={18} />}
                  classes={BUTTON_CLASSES.message}
                />
                {unreadMessages > 0 && (
                  <MessageBadge count={unreadMessages} className="-top-1 -right-1" />
                )}
              </div>
              <a
                href={"tel:" + confirmedRideData?.captain?.phone}
                className={BUTTON_CLASSES.call}
              >
                <PhoneCall size={20} strokeWidth={2.5} className="text-white" />
              </a>
            </div>
          )}
          {/* Premium Route Display - Enhanced glass card */}
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-4 shadow-xl overflow-hidden space-y-3">
            {/* Pickup */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-2 bg-emerald-500/20 backdrop-blur-sm rounded-xl border border-emerald-400/20 shadow-lg shadow-emerald-500/10">
                <MapPinMinus size={16} className="text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs text-white/40 font-medium mb-0.5">Recogida</p>
                <h1 className="text-sm sm:text-base font-bold text-white leading-tight truncate" style={{ textWrap: 'balance' }}>
                  {pickupLocation.split(", ")[0]}
                </h1>
                <p className="text-[10px] sm:text-xs text-white/40 mt-0.5 line-clamp-1">
                  {pickupLocation.split(", ").slice(1).join(", ")}
                </p>
              </div>
            </div>

            {/* Separator - Animated dots */}
            <div className="flex items-center gap-2 py-1 pl-5">
              <div className="flex flex-col gap-1">
                <div className="w-1 h-1 rounded-full bg-white/30" />
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <div className="w-1 h-1 rounded-full bg-white/10" />
              </div>
            </div>

            {/* Destination */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-2 bg-red-500/20 backdrop-blur-sm rounded-xl border border-red-400/20 shadow-lg shadow-red-500/10">
                <MapPinPlus size={16} className="text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs text-white/40 font-medium mb-0.5">Destino</p>
                <h1 className="text-sm sm:text-base font-bold text-white leading-tight truncate" style={{ textWrap: 'balance' }}>
                  {destinationLocation.split(", ")[0]}
                </h1>
                <p className="text-[10px] sm:text-xs text-white/40 mt-0.5 line-clamp-1">
                  {destinationLocation.split(", ").slice(1).join(", ")}
                </p>
              </div>
            </div>

            {/* Fare - Glass divider */}
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/5 rounded-lg border border-white/10">
                  <CreditCard size={14} className="text-white/60" />
                </div>
                <span className="text-xs sm:text-sm text-white/60 font-medium whitespace-nowrap">Efectivo</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white whitespace-nowrap">
                COP$ {fare[selectedVehicle]?.toLocaleString('es-CO') || 0}
              </h1>
            </div>
          </div>
          {/* Premium Action Buttons with Safe Bottom Padding */}
          <div className="pb-4">
            {rideCreated || confirmedRideData ? (
              <Button
                title={"Cancelar Viaje"}
                loading={loading}
                classes={"bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 font-bold rounded-xl shadow-lg shadow-red-500/20"}
                fun={cancelRide}
              />
            ) : (
              <Button 
                title={"Confirmar Viaje"} 
                fun={createRide} 
                loading={loading}
                classes={"bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 font-bold rounded-xl shadow-lg shadow-emerald-500/30"}
              />
            )}
          </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default RideDetails;
