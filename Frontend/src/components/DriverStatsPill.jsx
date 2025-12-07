import { Star, Car, ChevronUp } from "lucide-react";

/**
 * Compact Floating Pill - Driver Stats
 * Premium Dark Glassmorphism Dashboard Design
 * Visual hierarchy with opacity variations for depth
 */
function DriverStatsPill({ captain, vehicle, onExpand }) {
  return (
    <div
      onClick={onExpand}
      className="fixed bottom-6 left-4 right-4 z-20 cursor-pointer"
    >
      {/* Premium Dark Glass Container */}
      <div
        className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/10 px-4 py-4 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-slate-900/90 hover:border-white/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] active:scale-[0.98]"
      >
        {/* Subtle glow accent at top */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

        <div className="flex items-center justify-between gap-3">
          {/* Left: Profile + Name + Rating */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Profile Photo with glow ring */}
            <div className="relative flex-shrink-0">
              {captain?.profileImage ? (
                <img
                  src={captain.profileImage}
                  alt="Conductor"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-500/20"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-500/20"
                style={{ display: captain?.profileImage ? 'none' : 'flex' }}
              >
                <span className="text-base font-black text-white">
                  {captain?.fullname?.firstname?.[0] || "C"}
                  {captain?.fullname?.lastname?.[0] || ""}
                </span>
              </div>
              {/* Online pulse indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-900 shadow-lg shadow-emerald-400/50 animate-pulse" />
            </div>

            {/* Name + Rating - Visual hierarchy with opacity */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white truncate whitespace-nowrap">
                {captain?.fullname?.firstname} {captain?.fullname?.lastname}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="flex items-center gap-1 bg-yellow-500/20 px-1.5 py-0.5 rounded-md">
                  <Star size={10} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-[11px] font-bold text-yellow-400">
                    {captain?.rating?.toFixed(1) || "5.0"}
                  </span>
                </div>
                <span className="text-[10px] text-white/40 font-medium whitespace-nowrap">Conductor Pro</span>
              </div>
            </div>
          </div>

          {/* Right: Vehicle Info - Dark glass nested card */}
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/10 flex-shrink-0">
            <div className="p-1.5 bg-emerald-500/20 rounded-lg">
              <Car size={14} className="text-emerald-400" />
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-white leading-tight whitespace-nowrap">
                {vehicle?.make || "Toyota"}
              </p>
              <p className="text-[10px] text-white/50 leading-tight whitespace-nowrap capitalize">
                {vehicle?.color || "Blanco"}
              </p>
            </div>
          </div>
        </div>

        {/* Tap to expand indicator - Premium */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 opacity-50">
          <ChevronUp size={12} className="text-white/60" />
          <div className="w-8 h-0.5 bg-white/30 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default DriverStatsPill;
