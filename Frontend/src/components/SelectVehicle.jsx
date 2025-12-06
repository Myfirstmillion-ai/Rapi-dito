import { useState } from "react";
import { ChevronDown, ChevronUp, GripHorizontal, Check, Clock, Users } from "lucide-react";

const vehicles = [
  {
    id: 1,
    name: "Carro",
    description: "Viajes cómodos y seguros",
    type: "car",
    image: "https://www.pngplay.com/wp-content/uploads/13/Car-Top-View-PNG-Photos.png",
    price: 0,
    capacity: "4 personas",
    eta: "3-5 min",
  },
  {
    id: 2,
    name: "Moto",
    description: "Viajes rápidos y económicos",
    type: "bike",
    image: "bike.webp",
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

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

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
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white mb-1">Elige tu viaje</h2>
              <p className="text-sm text-slate-300">Selecciona el vehículo que prefieras</p>
            </div>
            <div className="space-y-3">
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
}) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleSelect = () => {
    setIsSelected(true);
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
        transition-all duration-300 active:scale-[0.98]
        ${isSelected 
          ? "bg-gradient-to-r from-emerald-500 to-cyan-500 border-2 border-emerald-400 shadow-xl shadow-emerald-500/30" 
          : isHovered
          ? "bg-gradient-to-r from-white/15 to-white/10 border-2 border-emerald-400/50 backdrop-blur-xl shadow-lg"
          : "bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-white/30 shadow-sm"
        }
      `}
    >
      {/* Vehicle Image Section */}
      <div className="relative p-4 flex items-center justify-center w-32">
        <img
          src={vehicle.image.startsWith('http') ? vehicle.image : `/${vehicle.image}`}
          className={`w-28 h-auto transition-transform duration-300 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
          alt={vehicle.name}
        />
        {isSelected && (
          <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center animate-bounce">
              <Check size={24} className="text-emerald-600" strokeWidth={3} />
            </div>
          </div>
        )}
      </div>

      {/* Vehicle Info Section */}
      <div className="flex-1 pr-4 py-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-lg font-bold text-white transition-colors">
              {vehicle.name}
            </h1>
            <p className={`text-sm transition-colors ${
              isSelected ? "text-emerald-100" : "text-slate-300"
            }`}>
              {vehicle.description}
            </p>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="flex items-center gap-3 mt-2">
          <div className={`flex items-center gap-1 text-xs font-medium ${
            isSelected ? "text-emerald-100" : "text-slate-300"
          }`}>
            <Clock size={14} />
            <span>{vehicle.eta}</span>
          </div>
          <div className={`w-1 h-1 rounded-full ${
            isSelected ? "bg-emerald-200" : "bg-slate-400"
          }`}></div>
          <div className={`flex items-center gap-1 text-xs font-medium ${
            isSelected ? "text-emerald-100" : "text-slate-300"
          }`}>
            <Users size={14} />
            <span>{vehicle.capacity}</span>
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className="pr-4 py-4 text-right">
        <p className={`text-xs font-medium mb-1 ${
          isSelected ? "text-emerald-100" : "text-slate-400"
        }`}>
          Tarifa
        </p>
        <h3 className="text-xl font-bold text-white transition-colors">
          ${Math.floor(fare[vehicle.type] / 1000)}K
        </h3>
        <p className={`text-xs mt-1 ${
          isSelected ? "text-emerald-100" : "text-slate-400"
        }`}>
          COP$ {fare[vehicle.type]?.toLocaleString('es-CO') || 0}
        </p>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Check size={18} className="text-emerald-600" strokeWidth={3} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectVehicle;
