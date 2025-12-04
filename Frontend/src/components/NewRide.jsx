import {
  CreditCard,
  MapPinMinus,
  MapPinPlus,
  PhoneCall,
  SendHorizontal,
} from "lucide-react";
import Button from "./Button";

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
}) {
  const ignoreRide = () => {
    setShowPanel(false);
    showPreviousPanel(true);
  };

  return (
    <>
      <div
        className={`${
          showPanel ? "bottom-0" : "-bottom-[60%]"
        } transition-all duration-500 absolute bg-white w-full rounded-t-3xl p-5 pt-3 shadow-2xl border-t-4 border-green-500`}
      >
        {/* Drag handle */}
        <div className="flex justify-center mb-3">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>
        
        <div>
          <div className="flex justify-between items-center pb-4 mb-3 border-b-2 border-gray-100">
            <div className="flex items-center gap-3">
              <div className="select-none rounded-full w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                <h1 className="text-xl font-bold text-white">
                  {rideData?.user?.fullname?.firstname[0]}
                  {rideData?.user?.fullname?.lastname[0]}
                </h1>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium">PASAJERO</p>
                <h1 className="text-lg font-bold text-gray-900">
                  {rideData?.user?.fullname?.firstname}{" "}
                  {rideData?.user?.fullname?.lastname}
                </h1>
                <p className="text-xs text-gray-600">
                  {rideData?.user?.phone || rideData?.user?.email}
                </p>
              </div>
            </div>

            <div className="text-right bg-gradient-to-br from-yellow-50 to-orange-50 px-4 py-3 rounded-xl border-2 border-yellow-200">
              <p className="text-xs text-yellow-700 font-semibold">TARIFA</p>
              <h1 className="font-bold text-2xl text-gray-900">${rideData?.fare?.toLocaleString('es-CO') || 0}</h1>
              <p className="text-xs text-gray-600">
                {(Number(rideData?.distance?.toFixed(2)) / 1000)?.toFixed(1)} Km
              </p>
            </div>
          </div>

          {/* Mensaje y llamada */}
          {showBtn !== "accept" && (
            <div className="flex gap-2 mb-4">
              <Button
                type={"link"}
                path={`/captain/chat/${rideData?._id}`}
                title={"Enviar mensaje"}
                icon={<SendHorizontal strokeWidth={1.5} size={18} />}
                classes={"bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm"}
              />
              <div className="flex items-center justify-center w-14 rounded-lg bg-green-500 hover:bg-green-600 transition-colors">
                <a href={"tel:" + rideData?.user?.phone}>
                  <PhoneCall size={20} strokeWidth={2} color="white" />
                </a>
              </div>
            </div>
          )}

          <div className="space-y-3 mb-4">
            {/* Ubicación de recogida */}
            <div className="flex items-start gap-3 bg-blue-50 border-l-4 border-blue-500 py-3 px-4 rounded-r-lg">
              <div className="bg-blue-500 p-2 rounded-full mt-1">
                <MapPinMinus size={16} color="white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-blue-600 font-semibold mb-1">RECOGIDA</p>
                <h1 className="text-base font-bold text-gray-900 leading-5">
                  {rideData.pickup.split(", ")[0]}
                </h1>
                <p className="text-xs text-gray-600 mt-1">
                  {rideData.pickup.split(", ").slice(1).join(", ")}
                </p>
              </div>
            </div>

            {/* Ubicación de destino */}
            <div className="flex items-start gap-3 bg-green-50 border-l-4 border-green-500 py-3 px-4 rounded-r-lg">
              <div className="bg-green-500 p-2 rounded-full mt-1">
                <MapPinPlus size={16} color="white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-green-600 font-semibold mb-1">DESTINO</p>
                <h1 className="text-base font-bold text-gray-900 leading-5">
                  {rideData.destination.split(", ")[0]}
                </h1>
                <p className="text-xs text-gray-600 mt-1">
                  {rideData.destination.split(", ").slice(1).join(", ")}
                </p>
              </div>
            </div>

            {/* Payment */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 py-3 px-4 rounded-r-lg">
              <div className="bg-yellow-500 p-2 rounded-full">
                <CreditCard size={16} color="white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-yellow-700 font-semibold mb-1">PAGO</p>
                <h1 className="text-xl font-bold text-gray-900">
                  ${rideData.fare?.toLocaleString('es-CO') || 0}
                </h1>
                <p className="text-xs text-gray-600">COP - Efectivo</p>
              </div>
            </div>
          </div>

          {showBtn === "accept" ? (
            <div className="flex gap-3">
              <Button
                title={"Ignorar"}
                loading={loading}
                fun={ignoreRide}
                classes={"bg-white text-gray-900 border-2 border-gray-300 hover:bg-gray-50"}
              />
              <Button 
                title={"Aceptar Viaje"} 
                fun={acceptRide} 
                loading={loading}
                classes={"bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"}
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
                placeholder={"Ingresa el OTP del pasajero"}
                className="w-full bg-gray-100 px-4 py-3 rounded-lg outline-none text-base mb-2 font-semibold text-center text-2xl tracking-widest border-2 border-gray-300 focus:border-blue-500"
              />
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg mb-2">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
              <Button 
                title={"Verificar OTP"} 
                loading={loading} 
                fun={verifyOTP}
                classes={"bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"}
              />
            </>
          ) : (
            <Button
              title={"Finalizar Viaje"}
              fun={endRide}
              loading={loading}
              classes={"bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default NewRide;
