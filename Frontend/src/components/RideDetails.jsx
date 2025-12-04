import {
  CreditCard,
  MapPinMinus,
  MapPinPlus,
  PhoneCall,
  SendHorizontal,
  Clock,
  Navigation,
} from "lucide-react";
import Button from "./Button";

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
}) {
  return (
    <>
      <div
        className={`${
          showPanel ? "bottom-0" : "-bottom-[60%]"
        } transition-all duration-500 absolute bg-white w-full rounded-t-3xl p-5 pt-3 shadow-2xl border-t-4 border-blue-500`}
      >
        {/* Drag handle indicator */}
        <div className="flex justify-center mb-3">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        <div>
          {rideCreated && !confirmedRideData && (
            <div className="mb-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <div>
                  <h1 className="font-semibold text-blue-900">Buscando conductores cercanos</h1>
                  <p className="text-sm text-blue-700">Esto puede tomar unos segundos...</p>
                </div>
              </div>
              <div className="overflow-y-hidden py-2">
                <div className="h-1 rounded-full bg-blue-500 animate-ping"></div>
              </div>
            </div>
          )}
          
          <div
            className={`flex ${
              confirmedRideData ? " justify-between items-center " : " justify-center "
            } pt-2 pb-4`}
          >
            <div className={`${confirmedRideData ? 'bg-gray-100 p-4 rounded-xl' : ''}`}>
              <img
                src={
                  selectedVehicle === "car"
                    ? "https://cdn-icons-png.flaticon.com/512/3097/3097136.png"
                    : "https://cdn-icons-png.flaticon.com/512/2972/2972185.png"
                }
                className={`${confirmedRideData ? " h-24" : " h-16 "}`}
                alt="Vehículo"
              />
            </div>

            {confirmedRideData?._id && (
              <div className="leading-4">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg mb-2">
                  <p className="text-xs font-medium">Tu conductor</p>
                  <h1 className="text-lg font-bold">
                    {confirmedRideData?.captain?.fullname?.firstname}{" "}
                    {confirmedRideData?.captain?.fullname?.lastname}
                  </h1>
                </div>
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <p className="text-xs text-gray-600">Placa</p>
                  <h1 className="font-bold text-lg">
                    {confirmedRideData?.captain?.vehicle?.number}
                  </h1>
                  <p className="capitalize text-sm text-gray-600">
                    {confirmedRideData?.captain?.vehicle?.color}{" "}
                    {confirmedRideData?.captain?.vehicle?.type === "car" ? "Carro" : "Moto"}
                  </p>
                </div>
                <div className="mt-2 text-center">
                  <span className="inline-block bg-black text-white px-4 py-2 rounded-lg font-bold text-lg">
                    OTP: {confirmedRideData?.otp}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {confirmedRideData?._id && (
            <div className="flex gap-2 mb-4">
              <Button
                type={"link"}
                path={`/user/chat/${confirmedRideData?._id}`}
                title={
                  <span className="flex items-center justify-center gap-2">
                    <SendHorizontal strokeWidth={1.5} size={18} />
                    Enviar mensaje
                  </span>
                }
                classes={"bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm flex-1"}
              />
              <div className="flex items-center justify-center w-14 rounded-lg bg-green-500 hover:bg-green-600 transition-colors">
                <a href={"tel:" + confirmedRideData?.captain?.phone}>
                  <PhoneCall size={20} strokeWidth={2} color="white" />
                </a>
              </div>
            </div>
          )}
          
          <div className="mb-4 space-y-3">
            {/* Ubicación de recogida */}
            <div className="flex items-start gap-3 bg-blue-50 border-l-4 border-blue-500 py-3 px-4 rounded-r-lg">
              <div className="bg-blue-500 p-2 rounded-full mt-1">
                <MapPinMinus size={16} color="white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-blue-600 font-semibold mb-1">RECOGIDA</p>
                <h1 className="text-base font-bold text-gray-900 leading-5">
                  {pickupLocation.split(", ")[0]}
                </h1>
                <p className="text-xs text-gray-600 mt-1">
                  {pickupLocation.split(", ").slice(1).join(", ")}
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
                  {destinationLocation.split(", ")[0]}
                </h1>
                <p className="text-xs text-gray-600 mt-1">
                  {destinationLocation.split(", ").slice(1).join(", ")}
                </p>
              </div>
            </div>

            {/* Tarifa */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 py-3 px-4 rounded-r-lg">
              <div className="bg-yellow-500 p-2 rounded-full">
                <CreditCard size={16} color="white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-yellow-700 font-semibold mb-1">TARIFA ESTIMADA</p>
                <h1 className="text-2xl font-bold text-gray-900">
                  ${fare[selectedVehicle]?.toLocaleString('es-CO') || 0}
                </h1>
                <p className="text-xs text-gray-600">COP - Efectivo</p>
              </div>
            </div>
          </div>
          
          {rideCreated || confirmedRideData ? (
            <Button
              title={"Cancelar Viaje"}
              loading={loading}
              classes={"bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"}
              fun={cancelRide}
            />
          ) : (
            <Button 
              title={"Confirmar Viaje"} 
              fun={createRide} 
              loading={loading}
              classes={"bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default RideDetails;
