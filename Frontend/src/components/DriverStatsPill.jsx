import { Star, Car, ChevronUp } from "lucide-react";

/**
 * Floating Capsule - Minimized Driver Bar
 * Premium Dark Glassmorphism Bottom Sheet Design
 * Optimized for iPhone 8 viewport with proper data binding
 */
function DriverStatsPill({ captain, vehicle, onExpand }) {
  // Helper function for vehicle display text
  const getVehicleDisplay = () => {
    if (vehicle?.make && vehicle?.model) {
      return `${vehicle.make} ${vehicle.model}`;
    }
    return vehicle?.make || vehicle?.model || "Vehículo";
  };

  return (
    <div
      onClick={onExpand}
      className="fixed bottom-6 left-4 right-4 z-20 cursor-pointer"
    >
      {/* Premium Floating Capsule Container */}
      <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-t-3xl rounded-b-2xl shadow-2xl border-t-2 border-x border-white/10 px-4 py-4 transition-all duration-300 hover:bg-slate-900/95 hover:border-white/20 hover:shadow-[0_16px_48px_rgba(0,0,0,0.7)] active:scale-[0.98]">
        {/* Drag Handle - Premium gray pill */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/30 rounded-full shadow-sm"></div>

        {/* Subtle glow accent at top */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent rounded-t-3xl" />

        {/* Main content with proper flex layout */}
        <div className="flex flex-row items-center justify-between gap-3 mt-2">
          {/* Left: Profile Photo with online ring */}
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
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900 shadow-lg shadow-emerald-400/60 animate-pulse" />
          </div>

          {/* Middle: Driver Name (Top, Bold, White) + Vehicle Info (Bottom, Smaller, Gray) */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            {/* Driver Name - Top, Bold, White */}
            <h3 className="text-base font-bold text-white truncate leading-tight">
              {captain?.fullname?.firstname} {captain?.fullname?.lastname}
            </h3>
            {/* Vehicle Info - Bottom, Smaller, Gray */}
            <div className="flex items-center gap-1.5 mt-1">
              <Car size={12} className="text-emerald-400 flex-shrink-0" />
              <p className="text-sm text-gray-300 truncate leading-tight">
                {getVehicleDisplay()}
              </p>
            </div>
            {/* Rating badge */}
            <div className="flex items-center gap-1.5 mt-1">
              <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-0.5 rounded-md backdrop-blur-sm border border-yellow-500/30">
                <Star size={10} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold text-yellow-400">
                  {captain?.rating?.toFixed(1) || "5.0"}
                </span>
              </div>
              <span className="text-[10px] text-white/50 font-medium">Pro</span>
            </div>
          </div>

          {/* Right: Action indicator or status */}
          <div className="flex flex-col items-center justify-center flex-shrink-0">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
              <ChevronUp size={18} className="text-white/70" />
            </div>
            <span className="text-[9px] text-white/40 mt-1 font-medium">Ver más</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverStatsPill;
