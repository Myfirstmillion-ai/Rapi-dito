import { Star, Car, ChevronUp } from "lucide-react";

/**
 * Floating Capsule - Minimized Ride Bar
 * Premium Dark Glassmorphism Bottom Sheet Design
 * Optimized for iPhone 8 viewport
 */
function DriverStatsPill({ captain, vehicle, onExpand }) {
  return (
    <div
      onClick={onExpand}
      className="fixed bottom-6 left-4 right-4 z-20 cursor-pointer"
    >
      {/* Premium Floating Capsule Container */}
      <div
        className="relative bg-slate-800/80 backdrop-blur-xl rounded-t-3xl rounded-b-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border-t-2 border-x border-white/10 px-5 py-4 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-slate-800/90 hover:border-white/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] active:scale-[0.98]"
      >
        {/* Drag Handle - Premium gray pill */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/30 rounded-full shadow-sm"></div>

        {/* Subtle glow accent at top */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent rounded-t-3xl" />

        <div className="flex items-center justify-between gap-4 mt-2">
          {/* Left: Profile + Name + Rating */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Profile Photo with premium glow ring */}
            <div className="relative flex-shrink-0">
              {captain?.profileImage ? (
                <img
                  src={captain.profileImage}
                  alt="Conductor"
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-400/60 shadow-lg shadow-emerald-500/30"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center ring-2 ring-emerald-400/60 shadow-lg shadow-emerald-500/30"
                style={{ display: captain?.profileImage ? 'none' : 'flex' }}
              >
                <span className="text-lg font-black text-white">
                  {captain?.fullname?.firstname?.[0] || "C"}
                  {captain?.fullname?.lastname?.[0] || ""}
                </span>
              </div>
              {/* Online pulse indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-800 shadow-lg shadow-emerald-400/60 animate-pulse" />
            </div>

            {/* Name + Rating - Perfect alignment */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-white truncate whitespace-nowrap">
                {captain?.fullname?.firstname} {captain?.fullname?.lastname}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-0.5 rounded-md backdrop-blur-sm border border-yellow-500/30">
                  <Star size={11} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-bold text-yellow-400 whitespace-nowrap">
                    {captain?.rating?.toFixed(1) || "5.0"}
                  </span>
                </div>
                <span className="text-[11px] text-white/50 font-medium whitespace-nowrap">Conductor Pro</span>
              </div>
            </div>
          </div>

          {/* Right: Vehicle Info - Distinct styling for brand/model */}
          <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-sm rounded-xl px-3.5 py-2.5 border border-white/10 flex-shrink-0">
            <div className="p-1.5 bg-emerald-500/20 rounded-lg">
              <Car size={16} className="text-emerald-400" />
            </div>
            <div className="text-right">
              {/* Vehicle Brand/Model - BOLD and WHITE */}
              <p className="text-sm font-bold text-white leading-tight whitespace-nowrap">
                {vehicle?.make || "Toyota"} {vehicle?.model || "Corolla"}
              </p>
              {/* Vehicle Color - Separate, smaller, transparent */}
              <p className="text-[11px] text-white/50 leading-tight whitespace-nowrap capitalize">
                {vehicle?.color || "Negro"}
              </p>
            </div>
          </div>
        </div>

        {/* Tap to expand indicator - Enhanced */}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 opacity-60">
          <ChevronUp size={14} className="text-white/70 animate-bounce" style={{ animationDuration: '2s' }} />
        </div>
      </div>
    </div>
  );
}

export default DriverStatsPill;
