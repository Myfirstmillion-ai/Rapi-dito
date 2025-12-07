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
      {/* Header with countdown - Premium iOS/Android Style */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* User Avatar with Ring */}
          {ride.user?.profileImage ? (
            <div className="relative">
              <img
                src={ride.user.profileImage}
                alt="Usuario"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-400/50 shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center ring-2 ring-emerald-400/50 shadow-lg hidden">
                <User size={24} className="text-white" />
              </div>
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center ring-2 ring-emerald-400/50 shadow-lg">
              <User size={24} className="text-white" />
            </div>
          )}
          <div>
            <h3 className="font-bold text-base text-white">Nueva solicitud</h3>
            {ride.user?.fullname && (
              <p className="text-sm text-gray-300">
                {ride.user.fullname.firstname} {ride.user.fullname.lastname}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className={`
            w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl
            transition-all duration-300 shadow-lg
            ${countdown > 10 
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white ring-2 ring-emerald-400/50' 
              : 'bg-gradient-to-br from-red-500 to-red-600 text-white ring-2 ring-red-400/50 animate-pulse'}
          `}>
            {countdown}
          </div>
          <span className="text-xs text-gray-400 mt-1.5 font-medium">seg</span>
        </div>
      </div>

      {/* Ride details - iOS Card Style */}
      <div className="flex flex-col gap-2.5 text-sm bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg ring-2 ring-blue-400/30">
            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-400 font-medium mb-0.5">Recogida</p>
            <p className="font-semibold text-white text-sm leading-snug">{ride.pickup}</p>
          </div>
        </div>
        
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg ring-2 ring-emerald-400/30">
            <MapPin size={14} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-400 font-medium mb-0.5">Destino</p>
            <p className="font-semibold text-white text-sm leading-snug">{ride.destination}</p>
          </div>
        </div>
      </div>

      {/* Fare and distance - Premium Card */}
      <div className="flex items-center justify-between bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl p-4 border border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <DollarSign size={20} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Tarifa estimada</p>
            <p className="text-2xl font-black text-white tracking-tight">${ride.fare?.toLocaleString()}</p>
          </div>
        </div>
        {ride.distance && (
          <div className="text-right bg-slate-700/50 rounded-xl px-3 py-2">
            <p className="text-xs text-gray-400 font-medium">Distancia</p>
            <p className="text-base font-bold text-white">
              {(ride.distance / 1000).toFixed(1)} km
            </p>
          </div>
        )}
      </div>

      {/* Action buttons - iOS Style */}
      <div className="flex gap-3 mt-1">
        <button
          onClick={onReject}
          className="flex-1 py-3.5 px-4 bg-slate-700/60 hover:bg-slate-700/80 backdrop-blur-sm rounded-2xl font-bold text-white transition-all active:scale-95 min-h-[52px] shadow-lg border border-white/10"
        >
          Rechazar
        </button>
        <button
          onClick={onAccept}
          className="flex-1 py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl font-black transition-all shadow-xl hover:shadow-2xl active:scale-95 min-h-[52px] ring-2 ring-emerald-400/50"
        >
          Aceptar - ${ride.fare?.toLocaleString()}
        </button>
      </div>
    </div>
  );
}

// Preload notification audio for better performance
let notificationAudio = null;
try {
  notificationAudio = new Audio('/notification.mp3');
  notificationAudio.preload = 'auto';
} catch (e) {
  // Silently fail if audio can't be loaded
}

export function showRideRequestToast(ride, onAccept, onReject) {
  // Play notification sound if available
  if (notificationAudio) {
    notificationAudio.currentTime = 0; // Reset to start
    notificationAudio.play().catch(() => {
      // Silently fail if audio doesn't play
    });
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
        } transform transition-all duration-300`}
        style={{
          animation: t.visible 
            ? 'slideInBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' 
            : 'slideOut 0.3s ease-in-out'
        }}
      >
        <div className="bg-gradient-to-br from-slate-900 to-black shadow-2xl rounded-3xl p-5 border-l-4 border-emerald-500 backdrop-blur-xl">
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
      </div>
    ),
    {
      duration: 30000, // 30 seconds to respond
      position: 'top-center',
      style: {
        maxWidth: '440px',
        marginTop: '20px',
      },
    }
  );

  return toastId;
}

export default RideRequestToast;

