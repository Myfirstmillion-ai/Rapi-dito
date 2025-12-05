import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { MapPin, DollarSign, Star, User } from "lucide-react";

function RideRequestToast({ ride, onAccept, onReject, toastId }) {
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onReject(); // Auto-reject when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onReject]);

  return (
    <div className="flex flex-col gap-3 min-w-[340px] max-w-[400px]">
      {/* Header with countdown */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-uber-blue rounded-full flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Nueva solicitud</h3>
            {ride.user?.fullname && (
              <p className="text-sm text-uber-gray-200">
                {ride.user.fullname.firstname} {ride.user.fullname.lastname}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
            ${countdown > 10 ? 'bg-uber-green text-white' : 'bg-uber-red text-white'}
          `}>
            {countdown}
          </div>
          <span className="text-xs text-uber-gray-200 mt-1">segundos</span>
        </div>
      </div>

      {/* Ride details */}
      <div className="flex flex-col gap-2.5 text-sm bg-white/10 rounded-uber-md p-3">
        <div className="flex items-start gap-2">
          <div className="w-5 h-5 bg-uber-blue rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <div className="flex-1">
            <p className="text-xs text-uber-gray-200">Recogida</p>
            <p className="font-medium text-white text-sm leading-tight">{ride.pickup}</p>
          </div>
        </div>
        
        <div className="h-px bg-white/20"></div>
        
        <div className="flex items-start gap-2">
          <div className="w-5 h-5 bg-uber-green rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <MapPin size={12} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-uber-gray-200">Destino</p>
            <p className="font-medium text-white text-sm leading-tight">{ride.destination}</p>
          </div>
        </div>
      </div>

      {/* Fare and distance */}
      <div className="flex items-center justify-between bg-white/10 rounded-uber-md p-3">
        <div className="flex items-center gap-2">
          <DollarSign size={18} className="text-uber-green" />
          <div>
            <p className="text-xs text-uber-gray-200">Tarifa estimada</p>
            <p className="text-xl font-bold text-white">${ride.fare?.toLocaleString()}</p>
          </div>
        </div>
        {ride.distance && (
          <div className="text-right">
            <p className="text-xs text-uber-gray-200">Distancia</p>
            <p className="text-sm font-semibold text-white">
              {(ride.distance / 1000).toFixed(1)} km
            </p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mt-1">
        <button
          onClick={onReject}
          className="flex-1 py-3 px-4 bg-white/20 hover:bg-white/30 rounded-uber-md font-semibold text-white transition-all active:scale-95 min-h-[48px]"
        >
          Rechazar
        </button>
        <button
          onClick={onAccept}
          className="flex-1 py-3 px-4 bg-uber-green hover:bg-green-600 text-white rounded-uber-md font-bold transition-all shadow-uber-md hover:shadow-uber-lg active:scale-95 min-h-[48px]"
        >
          Aceptar - ${ride.fare?.toLocaleString()}
        </button>
      </div>
    </div>
  );
}

export function showRideRequestToast(ride, onAccept, onReject) {
  // Play notification sound if available
  try {
    const audio = new Audio('/notification.mp3');
    audio.play().catch(() => {
      // Silently fail if audio doesn't play
    });
  } catch (e) {
    // Ignore audio errors
  }

  // Vibrate if available
  if (navigator.vibrate) {
    navigator.vibrate([200, 100, 200]);
  }

  const toastId = toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } bg-uber-black shadow-uber-xl rounded-uber-xl p-4 border-2 border-uber-green`}
      >
        <RideRequestToast
          ride={ride}
          toastId={t.id}
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
      style: {
        maxWidth: '440px',
      },
    }
  );

  return toastId;
}

export default RideRequestToast;

