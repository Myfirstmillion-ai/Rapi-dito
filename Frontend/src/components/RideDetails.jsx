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
} from "lucide-react";
import Button from "./Button";
import MessageBadge from "./ui/MessageBadge";

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
        } transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] fixed left-0 right-0 bg-slate-900/95 backdrop-blur-xl w-full rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)] border-t border-white/10 z-10 overflow-hidden`}
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
          {/* Searching Animation - Premium */}
          {rideCreated && !confirmedRideData && !isMinimized && (
            <div className="mb-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl border border-emerald-400/30 rounded-2xl p-4">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="animate-spin h-5 w-5 border-2 border-emerald-400 border-t-transparent rounded-full"></div>
                <h1 className="text-base font-bold text-white">Buscando conductores cercanos...</h1>
              </div>
              <div className="overflow-hidden rounded-full h-1.5 bg-white/10">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 animate-pulse"></div>
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
                          ? "/car.png"
                          : `/${selectedVehicle}.webp`
                      }
                      className="h-14 w-auto mix-blend-multiply"
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
          {/* Premium Vehicle & Driver Card */}
          <div className={`${
              confirmedRideData ? "bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl border-2 border-emerald-400/30" : "bg-white/10 backdrop-blur-xl border border-white/20"
            } rounded-2xl p-4 mb-4 shadow-lg`}>
            <div className="flex justify-between items-center">
              <div>
                <img
                  src={
                    selectedVehicle === "car"
                      ? "/car.png"
                      : `/${selectedVehicle}.webp`
                  }
                  className={`${confirmedRideData ? "h-24" : "h-16"} w-auto mix-blend-multiply`}
                  alt="Vehículo"
                />
              </div>

              {confirmedRideData?._id && (
                <div className="flex items-start gap-3">
                  {/* Driver Profile Photo */}
                  <div className="flex-shrink-0">
                    {confirmedRideData?.captain?.profileImage ? (
                      <img 
                        src={confirmedRideData.captain.profileImage} 
                        alt={`${confirmedRideData?.captain?.fullname?.firstname} ${confirmedRideData?.captain?.fullname?.lastname}`}
                        className="w-20 h-20 rounded-full object-cover border-4 border-emerald-400/30 shadow-lg"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg border-4 border-emerald-400/30 ${confirmedRideData?.captain?.profileImage ? 'hidden' : 'flex'}`}
                    >
                      <span className="text-2xl font-black text-white">
                        {confirmedRideData?.captain?.fullname?.firstname?.[0]?.toUpperCase() || 'C'}
                        {confirmedRideData?.captain?.fullname?.lastname?.[0]?.toUpperCase() || ''}
                      </span>
                    </div>
                  </div>
                  
                  {/* Driver Info */}
                  <div className="text-left space-y-1 flex-1">
                    <p className="text-xs text-slate-300 font-medium">Tu conductor</p>
                    <h1 className="text-base font-bold text-white">
                      {confirmedRideData?.captain?.fullname?.firstname}{" "}
                      {confirmedRideData?.captain?.fullname?.lastname}
                    </h1>
                    <h1 className="font-bold text-lg text-white">
                      {confirmedRideData?.captain?.vehicle?.number}
                    </h1>
                    <p className="capitalize text-xs text-slate-300 font-medium">
                      {confirmedRideData?.captain?.vehicle?.color}{" "}
                      {confirmedRideData?.captain?.vehicle?.type === "car" ? "Carro" : "Moto"}
                    </p>
                    <div className="mt-2 inline-block bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
                      OTP: {confirmedRideData?.otp}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Premium Contact Actions */}
          {confirmedRideData?._id && (
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Button
                  type={"link"}
                  path={`/user/chat/${confirmedRideData?._id}`}
                  title={"Enviar mensaje"}
                  icon={<SendHorizontal strokeWidth={2} size={18} />}
                  classes={"bg-white/10 hover:bg-white/20 backdrop-blur-xl font-semibold text-sm text-white w-full rounded-xl shadow-sm border border-white/20"}
                />
                {unreadMessages > 0 && (
                  <MessageBadge count={unreadMessages} className="-top-1 -right-1" />
                )}
              </div>
              <a
                href={"tel:" + confirmedRideData?.captain?.phone}
                className="flex items-center justify-center w-14 h-full rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all shadow-sm"
              >
                <PhoneCall size={20} strokeWidth={2} className="text-white" />
              </a>
            </div>
          )}
          {/* Premium Route Display */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 mb-4 shadow-lg space-y-3">
            {/* Pickup */}
            <div className="flex items-start gap-3">
              <div className="mt-1 p-2 bg-emerald-500/20 backdrop-blur-sm rounded-lg border border-emerald-400/30">
                <MapPinMinus size={18} className="text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-300 font-medium mb-0.5">Recogida</p>
                <h1 className="text-base font-bold text-white leading-tight">
                  {pickupLocation.split(", ")[0]}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                  {pickupLocation.split(", ").slice(1).join(", ")}
                </p>
              </div>
            </div>

            {/* Separator */}
            <div className="flex items-center gap-2 py-1">
              <div className="flex-1 border-t-2 border-dashed border-white/20"></div>
              <Navigation size={14} className="text-slate-400" />
              <div className="flex-1 border-t-2 border-dashed border-white/20"></div>
            </div>

            {/* Destination */}
            <div className="flex items-start gap-3">
              <div className="mt-1 p-2 bg-red-500/20 backdrop-blur-sm rounded-lg border border-red-400/30">
                <MapPinPlus size={18} className="text-red-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-300 font-medium mb-0.5">Destino</p>
                <h1 className="text-base font-bold text-white leading-tight">
                  {destinationLocation.split(", ")[0]}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                  {destinationLocation.split(", ").slice(1).join(", ")}
                </p>
              </div>
            </div>

            {/* Fare */}
            <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/20">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/10 rounded-lg">
                  <CreditCard size={16} className="text-slate-300" />
                </div>
                <span className="text-sm text-slate-300 font-medium">Efectivo</span>
              </div>
              <h1 className="text-xl font-bold text-white">
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
