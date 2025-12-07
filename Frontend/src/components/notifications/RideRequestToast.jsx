import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { DollarSign, Navigation } from "lucide-react";

/**
 * Premium iOS-Style Stacked Notification for Ride Requests
 * Dark Glassmorphism design positioned above the minimized driver bar
 */
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
    <div className="flex flex-col gap-0 w-full max-w-[380px]">
      {/* Premium iOS-style notification pill */}
      <div className="relative bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
        {/* Subtle top glow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
        
        {/* Main content - Minimalist design */}
        <div className="p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            {/* User Avatar - Left */}
            <div className="relative flex-shrink-0">
              {ride.user?.profileImage ? (
                <div className="relative">
                  <img
                    src={ride.user.profileImage}
                    alt="Usuario"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-400/60 shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center ring-2 ring-emerald-400/60 shadow-lg hidden">
                    <span className="text-lg font-black text-white">
                      {ride.user?.fullname?.firstname?.[0] || 'U'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center ring-2 ring-emerald-400/60 shadow-lg">
                  <span className="text-lg font-black text-white">
                    {ride.user?.fullname?.firstname?.[0] || 'U'}
                  </span>
                </div>
              )}
              {/* Online indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-900 shadow-lg"></div>
            </div>

            {/* Price - Center/Right, BIG & GREEN */}
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-2 bg-emerald-500/20 backdrop-blur-sm rounded-2xl px-4 py-2.5 border border-emerald-500/30">
                <DollarSign size={24} className="text-emerald-400" />
                <span className="text-3xl font-black text-emerald-400">
                  {ride.fare?.toLocaleString()}
                </span>
              </div>
              {ride.distance && (
                <p className="text-xs text-white/60 mt-1.5 font-medium" style={{ textWrap: 'balance' }}>
                  {(ride.distance / 1000).toFixed(1)} km de distancia
                </p>
              )}
            </div>

            {/* Countdown - Right */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                transition-all duration-300
                ${countdown > 10 
                  ? 'bg-white/10 text-white' 
                  : 'bg-red-500/20 text-red-400 border-2 border-red-500/50 animate-pulse'}
              `}>
                {countdown}
              </div>
              <span className="text-[10px] text-white/40 mt-1 font-medium whitespace-nowrap">seg</span>
            </div>
          </div>

          {/* Location info - Compact */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 mb-3 border border-white/10">
            <div className="flex items-center gap-2 text-xs">
              <Navigation size={12} className="text-blue-400 flex-shrink-0" />
              <p className="text-white/80 font-medium flex-1" style={{ textWrap: 'balance' }}>
                {ride.pickup}
              </p>
            </div>
            <div className="h-px bg-white/10 my-2"></div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"></div>
              <p className="text-white/80 font-medium flex-1" style={{ textWrap: 'balance' }}>
                {ride.destination}
              </p>
            </div>
          </div>

          {/* Action buttons - Compact circular icons */}
          <div className="flex gap-2">
            <button
              onClick={onReject}
              className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-2xl font-bold text-white/90 transition-all active:scale-95 border border-white/10 text-sm"
            >
              Rechazar
            </button>
            <button
              onClick={onAccept}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl font-black transition-all shadow-lg active:scale-95 text-sm"
            >
              Aceptar
            </button>
          </div>
        </div>
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
        className={`transform transition-all duration-500 ${
          t.visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
        }`}
        style={{
          animation: t.visible 
            ? 'slideUpSpring 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' 
            : 'slideDown 0.3s ease-in-out',
          zIndex: 50, // Ensure it floats above map but below modals
        }}
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
      position: 'bottom-center',
      style: {
        maxWidth: '380px',
        // marginBottom handled by containerStyle in ToastProvider
      },
    }
  );

  return toastId;
}

export default RideRequestToast;

