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
          {isMinimized ? (
            /* Minimized View - Summary Only */
            <div className="flex justify-between items-center pb-4">
              <div className="flex items-center gap-3">
                <div className="select-none rounded-full w-10 h-10 bg-green-500 flex items-center justify-center">
                  <h1 className="text-lg text-white">
                    {rideData?.user?.fullname?.firstname[0]}
                    {rideData?.user?.fullname?.lastname[0]}
                  </h1>
                </div>
                <div>
                  <h1 className="text-base font-semibold">
                    {rideData?.user?.fullname?.firstname} {rideData?.user?.fullname?.lastname}
                  </h1>
                  <p className="text-xs text-gray-500">Toca para ver detalles</p>
                </div>
              </div>
              <div className="text-right">
                <h1 className="font-bold text-lg text-uber-green">COP$ {rideData?.fare?.toLocaleString('es-CO') || 0}</h1>
              </div>
            </div>
          ) : (
            /* Maximized View - Full Details */
            <>
          <div className="flex justify-between items-center pb-4">
            <div className="flex items-center gap-3">
              <div className="my-2 select-none rounded-full w-10 h-10 bg-green-500 mx-auto flex items-center justify-center">
                <h1 className="text-lg text-white">
                  {rideData?.user?.fullname?.firstname[0]}
                  {rideData?.user?.fullname?.lastname[0]}
                </h1>
              </div>

              <div>
                <h1 className="text-lg font-semibold leading-6">
                  {rideData?.user?.fullname?.firstname}{" "}
                  {rideData?.user?.fullname?.lastname}
                </h1>
                <p className="text-xs text-gray-500">
                  {rideData?.user?.phone || rideData?.user?.email}
                </p>
              </div>
            </div>

            <div className="text-right">
              <h1 className="font-semibold text-lg">COP$ {rideData?.fare?.toLocaleString('es-CO') || 0}</h1>
              <p className="text-xs text-gray-500">
                {(Number(rideData?.distance?.toFixed(2)) / 1000)?.toFixed(1)} Km
              </p>
            </div>
          </div>

          {/* Mensaje y llamada */}
          {showBtn !== "accept" && (
            <div className="flex gap-2 mb-2">
              <div className="relative flex-1">
                <Button
                  type={"link"}
                  path={`/captain/chat/${rideData?._id}`}
                  title={"Enviar mensaje..."}
                  icon={<SendHorizontal strokeWidth={1.5} size={18} />}
                  classes={"bg-zinc-100 font-medium text-sm text-zinc-950 w-full"}
                />
                {unreadMessages > 0 && (
                  <MessageBadge count={unreadMessages} className="top-0 right-0" />
                )}
              </div>
              <div className="flex items-center justify-center w-14 rounded-md bg-zinc-100">
                <a href={"tel:" + rideData?.user?.phone}>
                  <PhoneCall size={18} strokeWidth={2} color="black" />
                </a>
              </div>
            </div>
          )}

          <div>
            {/* Ubicación de recogida */}
            <div className="flex items-center gap-3 border-t-2 py-2 px-2">
              <MapPinMinus size={18} />
              <div>
                <h1 className="text-lg font-semibold leading-5">
                  {rideData.pickup.split(", ")[0]}
                </h1>
                <div className="flex">
                  <p className="text-xs text-gray-800 inline">
                    {rideData.pickup.split(", ").map((location, index) => {
                      if (index > 0) {
                        return (
                          <span key={index}>
                            {location}
                            {index < rideData.pickup.split(", ").length - 1 &&
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
                  {rideData.destination.split(", ")[0]}
                </h1>
                <div className="flex">
                  <p className="text-xs text-gray-800 inline">
                    {rideData.destination.split(", ").map((location, index) => {
                      if (index > 0) {
                        return (
                          <span key={index}>
                            {location}
                            {index <
                              rideData.destination.split(", ").length - 1 &&
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
                  COP$ {rideData.fare?.toLocaleString('es-CO') || 0}
                </h1>
                <p className="text-xs text-gray-800">Efectivo</p>
              </div>
            </div>
          </div>

          {showBtn === "accept" ? (
            <div className="flex gap-2">
              <Button
                title={"Ignorar"}
                loading={loading}
                fun={ignoreRide}
                classes={"bg-white text-zinc-900 border-2 border-black"}
              />
              <Button title={"Aceptar"} fun={acceptRide} loading={loading} />
            </div>
          ) : showBtn === "otp" ? (
            <>
              <input
                type="number"
                minLength={6}
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder={"Ingresa el OTP"}
                className="w-full bg-zinc-100 px-4 py-3 rounded-lg outline-none text-sm mb-2"
              />
              {error && (
                <p className="text-red-500 text-xs mb-2 text-center">{error}</p>
              )}
              <Button title={"Verificar OTP"} loading={loading} fun={verifyOTP} />
            </>
          ) : (
            <Button
              title={"Finalizar Viaje"}
              fun={endRide}
              loading={loading}
              classes={"bg-green-600"}
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
