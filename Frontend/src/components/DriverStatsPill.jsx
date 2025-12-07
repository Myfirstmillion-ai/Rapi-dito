import { Star, Car } from "lucide-react";

/**
 * Compact Floating Pill - Driver Stats
 * Miniature version showing only: Profile Photo, Name, Rating, Vehicle Info
 * Premium design with glassmorphism
 */
function DriverStatsPill({ captain, vehicle, onExpand }) {
  return (
    <div
      onClick={onExpand}
      className="fixed bottom-6 left-4 right-4 z-20 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 px-5 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Profile + Name + Rating */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Profile Photo */}
            <div className="relative flex-shrink-0">
              {captain?.profileImage ? (
                <img
                  src={captain.profileImage}
                  alt="Conductor"
                  className="w-12 h-12 rounded-full object-cover ring-3 ring-emerald-500/50 shadow-lg"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center ring-3 ring-emerald-500/50 shadow-lg"
                style={{ display: captain?.profileImage ? 'none' : 'flex' }}
              >
                <span className="text-lg font-black text-white">
                  {captain?.fullname?.firstname?.[0] || "C"}
                  {captain?.fullname?.lastname?.[0] || ""}
                </span>
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-sm"></div>
            </div>

            {/* Name + Rating */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-slate-900 truncate">
                {captain?.fullname?.firstname} {captain?.fullname?.lastname}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-semibold text-slate-700">
                  {captain?.rating?.toFixed(1) || "5.0"}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500">Conductor Pro</span>
              </div>
            </div>
          </div>

          {/* Right: Vehicle Info */}
          <div className="flex items-center gap-2 bg-slate-100/80 rounded-2xl px-3 py-2 flex-shrink-0">
            <Car size={16} className="text-slate-600" />
            <div className="text-right">
              <p className="text-xs font-bold text-slate-900 leading-tight">
                {vehicle?.make || "Toyota"}
              </p>
              <p className="text-[10px] text-slate-600 leading-tight">
                {vehicle?.color || "Blanco"}
              </p>
            </div>
          </div>
        </div>

        {/* Tap to expand indicator */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-slate-300 rounded-full"></div>
      </div>
    </div>
  );
}

export default DriverStatsPill;
