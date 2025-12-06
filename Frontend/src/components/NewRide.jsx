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
          isMinimized ? "max-h-[25%]" : "max-h-[65%]"
        } transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] absolute bg-white w-full rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] z-10 overflow-hidden pb-safe`}
      >
        {/* Premium Drag Handle */}
        <div 
          onClick={toggleMinimize}
          className="flex justify-center py-2.5 cursor-pointer hover:bg-gray-50/50 active:bg-gray-100 transition-colors group"
        >
          <div className="flex flex-col items-center gap-1.5">
            <GripHorizontal size={24} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
            {isMinimized ? (
              <ChevronUp size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
            ) : (
              <ChevronDown size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
            )}
          </div>
        </div>
        
        <div className="px-4 pb-4 max-h-[calc(65vh-60px)] overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>

          {isMinimized ? (
            /* Minimized View - Premium Summary */
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="select-none rounded-full w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-md ring-2 ring-green-100">
                    <User size={20} className="text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h1 className="text-base font-bold text-gray-900">
                    {rideData?.user?.fullname?.firstname} {rideData?.user?.fullname?.lastname}
                  </h1>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Navigation size={12} />
                    {(Number(rideData?.distance?.toFixed(2)) / 1000)?.toFixed(1)} km
                  </p>
                </div>
              </div>
              <div className="text-right">
                <h1 className="font-bold text-xl text-green-600">
                  ${Math.floor(rideData?.fare / 1000)}K
                </h1>
                <p className="text-xs text-gray-500">Toca para más</p>
              </div>
            </div>
          ) : (
            /* Maximized View - Premium Details */
            <>
          {/* Premium User Card */}
          <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-4 mb-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  {rideData?.user?.profileImage ? (
                    <img 
                      src={rideData.user.profileImage} 
                      alt={`${rideData?.user?.fullname?.firstname} ${rideData?.user?.fullname?.lastname}`}
                      className="w-14 h-14 rounded-full object-cover shadow-lg ring-4 ring-green-50"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg ring-4 ring-green-50 ${rideData?.user?.profileImage ? 'hidden' : 'flex'}`}
                  >
                    <span className="text-xl font-bold text-white">
                      {rideData?.user?.fullname?.firstname[0]}
                      {rideData?.user?.fullname?.lastname[0]}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>

                <div>
                  <h1 className="text-lg font-bold text-gray-900 leading-tight">
                    {rideData?.user?.fullname?.firstname}{" "}
                    {rideData?.user?.fullname?.lastname}
                  </h1>
                  <p className="text-sm text-gray-600 font-medium">
                    {rideData?.user?.phone || rideData?.user?.email}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-500 font-medium mb-0.5">Tarifa</p>
                <h1 className="font-bold text-2xl text-green-600 leading-tight">
                  ${Math.floor(rideData?.fare / 1000)}K
                </h1>
                <p className="text-xs text-gray-500 font-medium mt-0.5 flex items-center gap-1 justify-end">
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
                  classes={"bg-gray-100 hover:bg-gray-200 font-semibold text-sm text-gray-900 w-full rounded-xl shadow-sm border border-gray-200"}
                />
                {unreadMessages > 0 && (
                  <MessageBadge count={unreadMessages} className="-top-1 -right-1" />
                )}
              </div>
              <a 
                href={"tel:" + rideData?.user?.phone}
                className="flex items-center justify-center w-14 h-full rounded-xl bg-green-500 hover:bg-green-600 active:scale-95 transition-all shadow-sm"
              >
                <PhoneCall size={20} strokeWidth={2} className="text-white" />
              </a>
            </div>
          )}

          {/* Premium Route Display */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-4 shadow-sm space-y-3">
            {/* Pickup */}
            <div className="flex items-start gap-3">
              <div className="mt-1 p-2 bg-green-100 rounded-lg">
                <MapPinMinus size={18} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium mb-0.5">Recogida</p>
                <h1 className="text-base font-bold text-gray-900 leading-tight">
                  {rideData.pickup.split(", ")[0]}
                </h1>
                <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                  {rideData.pickup.split(", ").slice(1).join(", ")}
                </p>
              </div>
            </div>

            {/* Separator */}
            <div className="flex items-center gap-2 py-1">
              <div className="flex-1 border-t-2 border-dashed border-gray-200"></div>
              <Navigation size={14} className="text-gray-400" />
              <div className="flex-1 border-t-2 border-dashed border-gray-200"></div>
            </div>

            {/* Destination */}
            <div className="flex items-start gap-3">
              <div className="mt-1 p-2 bg-red-100 rounded-lg">
                <MapPinPlus size={18} className="text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium mb-0.5">Destino</p>
                <h1 className="text-base font-bold text-gray-900 leading-tight">
                  {rideData.destination.split(", ")[0]}
                </h1>
                <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                  {rideData.destination.split(", ").slice(1).join(", ")}
                </p>
              </div>
            </div>

            {/* Fare */}
            <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gray-100 rounded-lg">
                  <CreditCard size={16} className="text-gray-700" />
                </div>
                <span className="text-sm text-gray-600 font-medium">Efectivo</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                COP$ {rideData.fare?.toLocaleString('es-CO') || 0}
              </h1>
            </div>
          </div>

          {/* Premium Action Buttons */}
          {showBtn === "accept" ? (
            <div className="flex gap-3">
              <Button
                title={"Ignorar"}
                loading={loading}
                fun={ignoreRide}
                classes={"bg-white text-gray-900 border-2 border-gray-300 hover:border-gray-400 font-semibold rounded-xl shadow-sm"}
              />
              <Button 
                title={"Aceptar Viaje"} 
                fun={acceptRide} 
                loading={loading}
                classes={"bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 font-bold rounded-xl shadow-lg shadow-green-500/30"}
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
                className="w-full bg-gray-50 border-2 border-gray-200 focus:border-black px-4 py-4 rounded-xl outline-none text-base font-semibold text-center tracking-widest mb-3 transition-colors"
              />
              {error && (
                <p className="text-red-600 text-sm mb-3 text-center font-medium bg-red-50 py-2 rounded-lg">{error}</p>
              )}
              <Button 
                title={"Verificar OTP"} 
                loading={loading} 
                fun={verifyOTP}
                classes={"bg-black hover:bg-gray-800 font-bold rounded-xl shadow-lg"}
              />
            </>
          ) : (
            <Button
              title={"Finalizar Viaje"}
              fun={endRide}
              loading={loading}
              classes={"bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 font-bold rounded-xl shadow-lg shadow-green-500/30"}
            />
          )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default NewRide;
