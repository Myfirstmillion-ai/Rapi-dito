import { useState } from "react";
import {
  CreditCard,
  MapPinMinus,
  MapPinPlus,
  PhoneCall,
  SendHorizontal,
  ChevronDown,
  ChevronUp,
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
          isMinimized ? "max-h-[25%]" : "max-h-[60%]"
        } transition-all duration-500 ease-out absolute bg-white w-full rounded-t-2xl p-4 pt-0 shadow-2xl z-10 overflow-y-auto`}
      >
        {/* Drag Handle with Minimize/Maximize Button */}
        <div 
          onClick={toggleMinimize}
          className="flex justify-center py-3 cursor-pointer hover:bg-gray-50 rounded-t-2xl transition-colors"
        >
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-1.5 bg-uber-gray-300 rounded-full"></div>
            {isMinimized ? (
              <ChevronUp size={20} className="text-gray-400" />
            ) : (
              <ChevronDown size={20} className="text-gray-400" />
            )}
          </div>
        </div>

        <div>
          {rideCreated && !confirmedRideData && !isMinimized && (
            <>
              <h1 className="text-center">Buscando conductores cercanos</h1>
              <div className="overflow-y-hidden py-2 pb-2">
                <div className="h-1 rounded-full bg-green-500 animate-ping"></div>
              </div>
            </>
          )}
          
          {isMinimized ? (
            /* Minimized View - Summary Only */
            <div className="flex justify-between items-center pb-4">
              <div className="flex items-center gap-2">
                <img
                  src={
                    selectedVehicle === "car"
                      ? "/car.png"
                      : `/${selectedVehicle}.webp`
                  }
                  className="h-12"
                  alt="Vehículo"
                />
                <p className="text-sm text-gray-600">Toca para ver detalles</p>
              </div>
              <div className="text-right">
                <h1 className="font-bold text-lg text-uber-blue">
                  COP$ {fare[selectedVehicle]?.toLocaleString('es-CO') || 0}
                </h1>
              </div>
            </div>
          ) : (
            /* Maximized View - Full Details */
            <>
          <div
            className={`flex ${
              confirmedRideData ? " justify-between " : " justify-center "
            } pt-2 pb-4`}
          >
            <div>
              <img
                src={
                  selectedVehicle === "car"
                    ? "/car.png"
                    : `/${selectedVehicle}.webp`
                }
                className={`${confirmedRideData ? " h-20" : " h-12 "}`}
                alt="Vehículo"
              />
            </div>

            {confirmedRideData?._id && (
              <div className="leading-4 text-right">
                <h1 className="text-sm ">
                  {confirmedRideData?.captain?.fullname?.firstname}{" "}
                  {confirmedRideData?.captain?.fullname?.lastname}
                </h1>
                <h1 className="font-semibold">
                  {confirmedRideData?.captain?.vehicle?.number}
                </h1>
                <h1 className="capitalize text-xs text-zinc-400">
                  {" "}
                  {confirmedRideData?.captain?.vehicle?.color}{" "}
                  {confirmedRideData?.captain?.vehicle?.type === "car" ? "Carro" : "Moto"}
                </h1>
                <span className="mt-1 inline-block bg-black text-white px-3 py-1 rounded font-semibold">
                  OTP: {confirmedRideData?.otp}
                </span>
              </div>
            )}
          </div>
          {confirmedRideData?._id && (
            <div className="flex gap-2 mb-2">
              <div className="relative flex-1">
                <Button
                  type={"link"}
                  path={`/user/chat/${confirmedRideData?._id}`}
                  title={"Enviar mensaje..."}
                  icon={<SendHorizontal strokeWidth={1.5} size={18} />}
                  classes={"bg-zinc-100 font-medium text-sm text-zinc-950 w-full"}
                />
                {unreadMessages > 0 && (
                  <MessageBadge count={unreadMessages} className="top-0 right-0" />
                )}
              </div>
              <div className="flex items-center justify-center w-14 rounded-md bg-zinc-100">
                <a href={"tel:" + confirmedRideData?.captain?.phone}>
                  <PhoneCall size={18} strokeWidth={2} color="black" />
                </a>
              </div>
            </div>
          )}
          <div className="mb-2">
            {/* Ubicación de recogida */}
            <div className="flex items-center gap-3 border-t-2 py-2 px-2">
              <MapPinMinus size={18} />
              <div>
                <h1 className="text-lg font-semibold leading-5">
                  {pickupLocation.split(", ")[0]}
                </h1>
                <div className="flex">
                  <p className="text-xs text-gray-800 inline">
                    {pickupLocation.split(", ").map((location, index) => {
                      if (index > 0) {
                        return (
                          <span key={index}>
                            {location}
                            {index < pickupLocation.split(", ").length - 1 &&
                              ", "}
                          </span>
                        );
                      }
                      return null;
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Ubicación de destino */}
            <div className="flex items-center gap-3 border-t-2 py-2 px-2">
              <MapPinPlus size={18} />
              <div>
                <h1 className="text-lg font-semibold leading-5">
                  {destinationLocation.split(", ")[0]}
                </h1>
                <div className="flex">
                  <p className="text-xs text-gray-800 inline">
                    {destinationLocation.split(", ").map((location, index) => {
                      if (index > 0) {
                        return (
                          <span key={index}>
                            {location}
                            {index <
                              destinationLocation.split(", ").length - 1 &&
                              ", "}
                          </span>
                        );
                      }
                      return null;
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Tarifa */}
            <div className="flex items-center gap-3 border-t-2 py-2 px-2">
              <CreditCard size={18} />
              <div>
                <h1 className="text-lg font-semibold leading-6">
                  COP$ {fare[selectedVehicle]?.toLocaleString('es-CO') || 0}
                </h1>
                <p className="text-xs text-gray-800">Efectivo</p>
              </div>
            </div>
          </div>
          {rideCreated || confirmedRideData ? (
            <Button
              title={"Cancelar Viaje"}
              loading={loading}
              classes={"bg-red-600"}
              fun={cancelRide}
            />
          ) : (
            <Button title={"Confirmar Viaje"} fun={createRide} loading={loading} />
          )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default RideDetails;
