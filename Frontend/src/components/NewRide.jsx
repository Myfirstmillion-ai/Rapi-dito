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
  User,
  Navigation,
} from "lucide-react";
import Button from "./Button";
import MessageBadge from "./ui/MessageBadge";

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
  endRide,
  verifyOTP,
  cancelRide,
  error,
  unreadMessages = 0,
}) {
  const [isMinimized, setIsMinimized] = useState(false);
  
  const ignoreRide = () => {
    setShowPanel(false);
    showPreviousPanel(true);
  };

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

          {isMinimized ? (
            /* Minimized View - Premium Summary with User Profile Photo */
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  {rideData?.user?.profileImage ? (
                    <img 
                      src={rideData.user.profileImage} 
                      alt={`${rideData?.user?.fullname?.firstname} ${rideData?.user?.fullname?.lastname}`}
                      className="w-12 h-12 rounded-full object-cover shadow-lg ring-2 ring-emerald-400/30"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-md ring-2 ring-emerald-400/30 ${rideData?.user?.profileImage ? 'hidden' : 'flex'}`}
                  >
                    <span className="text-base font-bold text-white">
                      {rideData?.user?.fullname?.firstname?.[0]?.toUpperCase() || ''}
                      {rideData?.user?.fullname?.lastname?.[0]?.toUpperCase() || ''}
                    </span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900"></div>
                </div>
                <div>
                  <h1 className="text-base font-bold text-white">
                    {rideData?.user?.fullname?.firstname} {rideData?.user?.fullname?.lastname}
                  </h1>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Navigation size={12} />
                    {(Number(rideData?.distance?.toFixed(2)) / 1000)?.toFixed(1)} km
                  </p>
                </div>
              </div>
              <div className="text-right">
                <h1 className="font-bold text-xl text-emerald-400">
                  ${Math.floor(rideData?.fare / 1000)}K
                </h1>
                <p className="text-xs text-slate-400">Toca para más</p>
              </div>
            </div>
          ) : (
            /* Maximized View - Premium Details */
            <>
          {/* Premium User Card */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-4 mb-4 shadow-lg">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  {rideData?.user?.profileImage ? (
                    <img 
                      src={rideData.user.profileImage} 
                      alt={`${rideData?.user?.fullname?.firstname} ${rideData?.user?.fullname?.lastname}`}
                      className="w-14 h-14 rounded-full object-cover shadow-lg ring-4 ring-emerald-400/30"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg ring-4 ring-emerald-400/30 ${rideData?.user?.profileImage ? 'hidden' : 'flex'}`}
                  >
                    <span className="text-xl font-bold text-white">
                      {rideData?.user?.fullname?.firstname[0]}
                      {rideData?.user?.fullname?.lastname[0]}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
                </div>

                <div>
                  <h1 className="text-lg font-bold text-white leading-tight">
                    {rideData?.user?.fullname?.firstname}{" "}
                    {rideData?.user?.fullname?.lastname}
                  </h1>
                  <p className="text-sm text-slate-300 font-medium">
                    {rideData?.user?.phone || rideData?.user?.email}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-slate-400 font-medium mb-0.5">Tarifa</p>
                <h1 className="font-bold text-2xl text-emerald-400 leading-tight">
                  ${Math.floor(rideData?.fare / 1000)}K
                </h1>
                <p className="text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-1 justify-end">
                  <Navigation size={12} />
                  {(Number(rideData?.distance?.toFixed(2)) / 1000)?.toFixed(1)} km
                </p>
              </div>
            </div>
          </div>

          {/* Premium Actions */}
          {showBtn !== "accept" && (
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Button
                  type={"link"}
                  path={`/captain/chat/${rideData?._id}`}
                  title={"Enviar mensaje"}
                  icon={<SendHorizontal strokeWidth={2} size={18} />}
                  classes={"bg-white/10 hover:bg-white/20 backdrop-blur-xl font-semibold text-sm text-white w-full rounded-xl shadow-sm border border-white/20"}
                />
                {unreadMessages > 0 && (
                  <MessageBadge count={unreadMessages} className="-top-1 -right-1" />
                )}
              </div>
              <a 
                href={"tel:" + rideData?.user?.phone}
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
                  {rideData.pickup.split(", ")[0]}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                  {rideData.pickup.split(", ").slice(1).join(", ")}
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
                  {rideData.destination.split(", ")[0]}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                  {rideData.destination.split(", ").slice(1).join(", ")}
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
                COP$ {rideData.fare?.toLocaleString('es-CO') || 0}
              </h1>
            </div>
          </div>

          {/* Premium Action Buttons with Safe Bottom Padding */}
          <div className="pb-4">
            {showBtn === "accept" ? (
              <div className="flex gap-3">
                <Button
                  title={"Ignorar"}
                  loading={loading}
                  fun={ignoreRide}
                  classes={"bg-white/10 text-white border-2 border-white/20 hover:border-white/30 backdrop-blur-xl font-semibold rounded-xl shadow-sm"}
                />
                <Button 
                  title={"Aceptar Viaje"} 
                  fun={acceptRide} 
                  loading={loading}
                  classes={"bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 font-bold rounded-xl shadow-lg shadow-emerald-500/30"}
                />
              </div>
            ) : showBtn === "otp" ? (
              <>
                <input
                  type="number"
                  minLength={6}
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder={"Código OTP de 6 dígitos"}
                  className="w-full bg-white/10 backdrop-blur-xl border-2 border-white/20 focus:border-emerald-400 px-4 py-4 rounded-xl outline-none text-base font-semibold text-center tracking-widest mb-3 transition-colors text-white placeholder:text-slate-400"
                />
                {error && (
                  <p className="text-red-400 text-sm mb-3 text-center font-medium bg-red-500/20 backdrop-blur-sm py-2 rounded-lg border border-red-400/30">{error}</p>
                )}
                <Button 
                  title={"Verificar OTP"} 
                  loading={loading} 
                  fun={verifyOTP}
                  classes={"bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 font-bold rounded-xl shadow-lg mb-3"}
                />
                <Button 
                  title={"Cancelar Viaje"} 
                  loading={loading} 
                  fun={cancelRide}
                  classes={"bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 font-bold rounded-xl shadow-lg shadow-red-500/30"}
                />
              </>
            ) : (
              <Button
                title={"Finalizar Viaje"}
                fun={endRide}
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

export default NewRide;
