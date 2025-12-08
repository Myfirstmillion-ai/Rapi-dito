import { TrendingUp } from "lucide-react";

/**
 * Floating Glass Dock - Ultra-Premium Compact Driver Command Center
 * FIXED/COMPACT DESIGN - No expand functionality
 * Shows: Profile (left) | Today's Earnings (center, HUGE) | Go Offline Toggle (right)
 */
function DriverStatsPill({ captain, vehicle, earnings, rides }) {
  // Calculate today's earnings from captain data
  const getTodaysEarnings = () => {
    if (!captain?.rides || !Array.isArray(captain.rides)) return 0;
    
    let todaysTotal = 0;
    let todaysTrips = 0;
    
    const today = new Date();
    const todayWithoutTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    captain.rides.forEach((ride) => {
      if (ride.status === "completed") {
        const rideDate = new Date(ride.updatedAt);
        const rideDateWithoutTime = new Date(
          rideDate.getFullYear(),
          rideDate.getMonth(),
          rideDate.getDate()
        );

        if (rideDateWithoutTime.getTime() === todayWithoutTime.getTime()) {
          todaysTotal += ride.fare || 0;
          todaysTrips++;
        }
      }
    });

    return { total: todaysTotal, trips: todaysTrips };
  };

  const { total: todaysEarnings, trips: todaysTrips } = earnings && rides 
    ? { total: earnings.today || 0, trips: rides.accepted || 0 }
    : getTodaysEarnings();

  const [isOnline, setIsOnline] = React.useState(true);

  const toggleOnlineStatus = (e) => {
    e.stopPropagation();
    setIsOnline(!isOnline);
    // TODO: Implement backend call to update online status
    console.log("Toggle online status:", !isOnline);
  };

  return (
    <div className="fixed bottom-6 left-4 right-4 z-30">
      {/* Ultra-Premium Floating Glass Dock */}
      <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/10 px-5 py-4 transition-all duration-300">
        {/* Subtle glow accent at top */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent rounded-t-[32px]" />

        {/* Main content - Three-column layout */}
        <div className="flex items-center justify-between gap-4">
          {/* LEFT: Driver Profile Photo with Pulsing Online Ring */}
          <div className="relative flex-shrink-0">
            {captain?.profileImage ? (
              <img
                src={captain.profileImage}
                alt="Conductor"
                className="w-16 h-16 rounded-full object-cover shadow-lg"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg"
              style={{ display: captain?.profileImage ? 'none' : 'flex' }}
            >
              <span className="text-xl font-black text-white">
                {captain?.fullname?.firstname?.[0] || "C"}
                {captain?.fullname?.lastname?.[0] || ""}
              </span>
            </div>
            {/* Pulsing Online Ring - Double animation */}
            {isOnline && (
              <>
                <div className="absolute -inset-1 rounded-full border-2 border-emerald-400 animate-ping opacity-75" />
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-emerald-400 rounded-full border-3 border-slate-900 shadow-lg shadow-emerald-400/60 animate-pulse" />
              </>
            )}
            {!isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-gray-400 rounded-full border-3 border-slate-900 shadow-lg" />
            )}
          </div>

          {/* CENTER: TODAY'S EARNINGS - HUGE & BOLD */}
          <div className="flex-1 text-center min-w-0">
            <p className="text-[10px] text-emerald-200/60 font-bold uppercase tracking-wider mb-0.5 whitespace-nowrap">
              💰 Hoy Ganaste
            </p>
            <div className="flex items-baseline justify-center gap-1 mb-0.5">
              <span className="text-xs text-white/50 font-medium">$</span>
              <h1 
                className="text-3xl sm:text-4xl font-black leading-none tracking-tight text-white whitespace-nowrap"
                style={{
                  textShadow: '0 0 20px rgba(52, 211, 153, 0.3)'
                }}
              >
                {todaysEarnings >= 1000 
                  ? `${(todaysEarnings / 1000).toFixed(1)}K` 
                  : todaysEarnings.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
              </h1>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-white/40">
              <TrendingUp size={11} className="text-emerald-400" />
              <span className="text-[10px] font-semibold whitespace-nowrap">
                {todaysTrips > 0 ? `${todaysTrips} ${todaysTrips === 1 ? 'viaje' : 'viajes'}` : 'Sin viajes hoy'}
              </span>
            </div>
          </div>

          {/* RIGHT: Go Offline Toggle Switch - Premium Styled */}
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <button
              onClick={toggleOnlineStatus}
              className={`
                relative w-14 h-8 rounded-full transition-all duration-300 ease-out
                ${isOnline 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30' 
                  : 'bg-white/10 border border-white/20'
                }
              `}
              aria-label={isOnline ? "Go Offline" : "Go Online"}
            >
              <div
                className={`
                  absolute top-1 w-6 h-6 bg-white rounded-full shadow-md
                  transition-all duration-300 ease-out
                  ${isOnline ? 'left-[calc(100%-28px)]' : 'left-1'}
                `}
              />
            </button>
            <span className={`text-[9px] font-bold uppercase tracking-wide transition-colors whitespace-nowrap ${
              isOnline ? 'text-emerald-400' : 'text-white/40'
            }`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Note: Full stats moved to Sidebar → "📊 Mis Estadísticas" (not implemented yet) */}
      </div>
    </div>
  );
}

// Add React import for useState
import React from 'react';

export default DriverStatsPill;
