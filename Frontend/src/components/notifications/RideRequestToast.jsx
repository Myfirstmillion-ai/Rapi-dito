import toast from "react-hot-toast";
import { Phone, MapPin, DollarSign } from "lucide-react";

function RideRequestToast({ ride, onAccept, onReject }) {
  return (
    <div className="flex flex-col gap-3 min-w-[300px]">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Nueva solicitud de viaje</h3>
        <span className="text-green-600 font-bold text-xl">
          ${ride.fare}
        </span>
      </div>
      
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex items-start gap-2">
          <MapPin size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-gray-500 text-xs">Recogida</p>
            <p className="font-medium">{ride.pickup}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <MapPin size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-gray-500 text-xs">Destino</p>
            <p className="font-medium">{ride.destination}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <button
          onClick={onReject}
          className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors"
        >
          Rechazar
        </button>
        <button
          onClick={onAccept}
          className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}

export function showRideRequestToast(ride, onAccept, onReject) {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } bg-white shadow-xl rounded-xl p-4 border-2 border-green-500`}
      >
        <RideRequestToast
          ride={ride}
          onAccept={() => {
            onAccept();
            toast.dismiss(t.id);
          }}
          onReject={() => {
            onReject();
            toast.dismiss(t.id);
          }}
        />
      </div>
    ),
    {
      duration: 30000, // 30 seconds to respond
      position: 'top-center',
    }
  );
}

export default RideRequestToast;
