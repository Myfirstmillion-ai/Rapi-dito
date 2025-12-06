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
          isMinimized ? "max-h-[25%]" : "max-h-[65%]"
        } transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] fixed left-0 right-0 bg-white w-full rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] z-10 overflow-hidden pb-safe`}
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
          {/* Searching Animation - Premium */}
          {rideCreated && !confirmedRideData && !isMinimized && (
            <div className="mb-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="animate-spin h-5 w-5 border-2 border-green-500 border-t-transparent rounded-full"></div>
                <h1 className="text-base font-bold text-gray-900">Buscando conductores cercanos...</h1>
              </div>
              <div className="overflow-hidden rounded-full h-1.5 bg-green-100">
                <div className="h-full bg-gradient-to-r from-green-400 to-green-600 animate-pulse"></div>
              </div>
            </div>
          )}
          
          {isMinimized ? (
            /* Minimized View - Premium Summary */
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
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
                <div>
                  <p className="text-xs text-gray-500 font-medium">Tu viaje</p>
                  <h1 className="text-base font-bold text-gray-900 capitalize">
                    {selectedVehicle === "car" ? "Carro" : "Moto"}
                  </h1>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-medium">Total</p>
                <h1 className="font-bold text-xl text-blue-600">
                  ${Math.floor(fare[selectedVehicle] / 1000)}K
                </h1>
              </div>
            </div>
          ) : (
            /* Maximized View - Premium Details */
            <>
          {/* Premium Vehicle & Driver Card */}
          <div className={`${
              confirmedRideData ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200" : "bg-white border border-gray-200"
            } rounded-2xl p-4 mb-4 shadow-sm`}>
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
                        className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 shadow-lg"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg border-4 border-blue-100 ${confirmedRideData?.captain?.profileImage ? 'hidden' : 'flex'}`}
                    >
                      <span className="text-2xl font-black text-white">
                        {confirmedRideData?.captain?.fullname?.firstname?.[0]?.toUpperCase() || 'C'}
                        {confirmedRideData?.captain?.fullname?.lastname?.[0]?.toUpperCase() || ''}
                      </span>
                    </div>
                  </div>
                  
                  {/* Driver Info */}
                  <div className="text-left space-y-1 flex-1">
                    <p className="text-xs text-gray-600 font-medium">Tu conductor</p>
                    <h1 className="text-base font-bold text-gray-900">
                      {confirmedRideData?.captain?.fullname?.firstname}{" "}
                      {confirmedRideData?.captain?.fullname?.lastname}
                    </h1>
                    <h1 className="font-bold text-lg text-gray-900">
                      {confirmedRideData?.captain?.vehicle?.number}
                    </h1>
                    <p className="capitalize text-xs text-gray-600 font-medium">
                      {confirmedRideData?.captain?.vehicle?.color}{" "}
                      {confirmedRideData?.captain?.vehicle?.type === "car" ? "Carro" : "Moto"}
                    </p>
                    <div className="mt-2 inline-block bg-black text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
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
                  classes={"bg-gray-100 hover:bg-gray-200 font-semibold text-sm text-gray-900 w-full rounded-xl shadow-sm border border-gray-200"}
                />
                {unreadMessages > 0 && (
                  <MessageBadge count={unreadMessages} className="-top-1 -right-1" />
                )}
              </div>
              <a
                href={"tel:" + confirmedRideData?.captain?.phone}
                className="flex items-center justify-center w-14 h-full rounded-xl bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all shadow-sm"
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
                  {pickupLocation.split(", ")[0]}
                </h1>
                <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                  {pickupLocation.split(", ").slice(1).join(", ")}
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
                  {destinationLocation.split(", ")[0]}
                </h1>
                <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                  {destinationLocation.split(", ").slice(1).join(", ")}
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
                COP$ {fare[selectedVehicle]?.toLocaleString('es-CO') || 0}
              </h1>
            </div>
          </div>
          {/* Premium Action Buttons */}
          {rideCreated || confirmedRideData ? (
            <Button
              title={"Cancelar Viaje"}
              loading={loading}
              classes={"bg-red-500 hover:bg-red-600 font-bold rounded-xl shadow-lg shadow-red-500/20"}
              fun={cancelRide}
            />
          ) : (
            <Button 
              title={"Confirmar Viaje"} 
              fun={createRide} 
              loading={loading}
              classes={"bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 font-bold rounded-xl shadow-lg shadow-blue-500/30"}
            />
          )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default RideDetails;
