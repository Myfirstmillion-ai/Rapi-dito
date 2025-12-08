import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, GripHorizontal, Check, Clock, Users } from "lucide-react";

const vehicles = [
  {
    id: 1,
    name: "Carro",
    description: "Viajes cómodos y seguros",
    type: "car",
    image: "/Uber-PNG-Photos.png",
    price: 0,
    capacity: "4 personas",
    eta: "3-5 min",
  },
  {
    id: 2,
    name: "Moto",
    description: "Viajes rápidos y económicos",
    type: "bike",
    image: "/bike.webp",
    price: 0,
    capacity: "1 persona",
    eta: "2-4 min",
  },
];

function SelectVehicle({
  selectedVehicle,
  showPanel,
  setShowPanel,
  showPreviousPanel,
  showNextPanel,
  fare,
}) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [hoveredVehicle, setHoveredVehicle] = useState(null);
  const [currentlySelected, setCurrentlySelected] = useState(null);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Reset selection when panel closes
  useEffect(() => {
    if (!showPanel) {
      setCurrentlySelected(null);
    }
  }, [showPanel]);

  return (
    <>
      <div
        className={`${showPanel ? "bottom-0" : "-bottom-full"} ${
          isMinimized ? "max-h-[25dvh]" : "max-h-[65dvh]"
        } transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] fixed left-0 right-0 bg-slate-900/95 backdrop-blur-xl w-full rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)] border-t border-white/10 z-10 overflow-hidden`}
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 20px)' }}
      >
        {/* Premium Drag Handle */}
        <div 
          onClick={toggleMinimize}
          className="flex justify-center py-2.5 cursor-pointer hover:bg-white/5 active:bg-white/10 transition-colors group"
        >
          <div className="flex flex-col items-center gap-1.5">
            <GripHorizontal size={24} className="text-white/30 group-hover:text-white/50 transition-colors" />
            {isMinimized ? (
              <ChevronUp size={18} className="text-white/40 group-hover:text-white/70 transition-colors" />
            ) : (
              <ChevronDown size={18} className="text-white/40 group-hover:text-white/70 transition-colors" />
            )}
          </div>
        </div>

        <div className="px-4 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', maxHeight: 'calc(65dvh - 60px - max(env(safe-area-inset-bottom, 0px), 20px))' }}>

        {isMinimized ? (
          /* Minimized View - Premium */
          <div className="text-center">
            <h2 className="text-base font-bold text-white">
              Selecciona tu vehículo
            </h2>
            <p className="text-sm text-slate-400">Toca para ver opciones</p>
          </div>
        ) : (
          /* Maximized View - Premium */
          <>
            <div className="mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1" style={{ textWrap: 'balance' }}>
                Elige tu viaje
              </h2>
              <p className="text-sm text-white/50" style={{ textWrap: 'balance' }}>
                Selecciona el vehículo que prefieras
              </p>
            </div>
            <div className="space-y-3 pb-2">
              {vehicles.map((vehicle) => (
                <Vehicle
                  key={vehicle.id}
                  vehicle={vehicle}
                  fare={fare}
                  selectedVehicle={selectedVehicle}
                  setShowPanel={setShowPanel}
                  showNextPanel={showNextPanel}
                  isHovered={hoveredVehicle === vehicle.id}
                  onHover={() => setHoveredVehicle(vehicle.id)}
                  onLeave={() => setHoveredVehicle(null)}
                  currentlySelected={currentlySelected}
                  setCurrentlySelected={setCurrentlySelected}
                />
              ))}
            </div>
          </>
        )}
        </div>
      </div>
    </>
  );
}

const Vehicle = ({
  vehicle,
  selectedVehicle,
  fare,
  setShowPanel,
  showNextPanel,
  isHovered,
  onHover,
  onLeave,
  currentlySelected,
  setCurrentlySelected,
}) => {
  const isSelected = currentlySelected === vehicle.id;

  const handleSelect = () => {
    setCurrentlySelected(vehicle.id);
    setTimeout(() => {
      selectedVehicle(vehicle.type);
      setShowPanel(false);
      showNextPanel(true);
    }, 200);
  };

  return (
    <div
      onClick={handleSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`
        cursor-pointer group relative flex items-center rounded-2xl overflow-hidden
        transition-all duration-300 ease-out
        active:scale-[0.97]
        ${isSelected
          ? "bg-gradient-to-r from-emerald-500/90 to-cyan-500/90 ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-900 shadow-[0_0_30px_rgba(52,211,153,0.4)] scale-[1.02]"
          : isHovered
          ? "bg-gradient-to-r from-white/15 to-white/10 border border-emerald-400/50 backdrop-blur-xl shadow-[0_8px_24px_rgba(52,211,153,0.15)]"
          : "bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 shadow-lg"
        }
      `}
    >
      {/* Vehicle Image Section - Floating effect */}
      <div className="relative p-3 flex items-center justify-center w-28 sm:w-32">
        <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-l-2xl ${isSelected ? 'from-white/10' : ''}`} />
        <img
          src={vehicle.image}
          className={`w-24 sm:w-28 h-auto relative z-10 drop-shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            isHovered || isSelected ? "scale-110 -translate-y-1" : "scale-100"
          }`}
          alt={vehicle.name}
        />
        {isSelected && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30 animate-scale-in">
              <Check size={22} className="text-emerald-600" strokeWidth={3} />
            </div>
          </div>
        )}
      </div>

      {/* Vehicle Info Section - Fixed text wrapping */}
      <div className="flex-1 pr-3 py-4 min-w-0">
        <div className="mb-2">
          <h1 className="text-base sm:text-lg font-bold text-white transition-colors whitespace-nowrap">
            {vehicle.name}
          </h1>
          <p className={`text-xs sm:text-sm transition-colors leading-tight ${
            isSelected ? "text-emerald-100" : "text-white/60"
          }`} style={{ textWrap: 'balance' }}>
            {vehicle.description}
          </p>
        </div>

        {/* Vehicle Details - Pill badges */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <div className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium px-2 py-1 rounded-full ${
            isSelected ? "bg-white/20 text-white" : "bg-white/10 text-white/70"
          }`}>
            <Clock size={12} />
            <span className="whitespace-nowrap">{vehicle.eta}</span>
          </div>
          <div className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium px-2 py-1 rounded-full ${
            isSelected ? "bg-white/20 text-white" : "bg-white/10 text-white/70"
          }`}>
            <Users size={12} />
            <span className="whitespace-nowrap">{vehicle.capacity}</span>
          </div>
        </div>
      </div>

      {/* Price Section - Enhanced hierarchy */}
      <div className="pr-3 sm:pr-4 py-4 text-right flex-shrink-0">
        <p className={`text-[10px] sm:text-xs font-medium mb-0.5 ${
          isSelected ? "text-white/80" : "text-white/40"
        }`}>
          Tarifa
        </p>
        <h3 className={`text-lg sm:text-xl font-bold transition-colors whitespace-nowrap ${
          isSelected ? "text-white" : "text-emerald-400"
        }`}>
          ${Math.floor(fare[vehicle.type] / 1000)}K
        </h3>
        <p className={`text-[10px] sm:text-xs mt-0.5 whitespace-nowrap ${
          isSelected ? "text-white/70" : "text-white/40"
        }`}>
          COP$ {fare[vehicle.type]?.toLocaleString('es-CO') || 0}
        </p>
      </div>

      {/* Glow accent line at bottom when selected */}
      {isSelected && (
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400" />
      )}
    </div>
  );
};

export default SelectVehicle;
