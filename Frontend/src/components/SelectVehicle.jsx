import { useState } from "react";
import { ChevronDown, ChevronUp, GripHorizontal, Check, Clock, Users } from "lucide-react";

const vehicles = [
  {
    id: 1,
    name: "Carro",
    description: "Viajes cómodos y seguros",
    type: "car",
    image: "car.png",
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
          isMinimized ? "max-h-[25%]" : "max-h-[65%]"
        } transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] absolute bg-white w-full rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] z-10 overflow-hidden pb-safe`}
      >
        {/* Premium Drag Handle */}
        <div 
          onClick={toggleMinimize}
          className="flex justify-center py-2.5 cursor-pointer hover:bg-gray-50/50 active:bg-gray-100 transition-colors group"
        >
          <div className="flex flex-col items-center gap-1.5">
            <GripHorizontal size={24} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
            {isMinimized ? (
              <ChevronUp size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
            ) : (
              <ChevronDown size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
            )}
          </div>
        </div>

        <div className="px-4 pb-4 max-h-[calc(65vh-60px)] overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>

        {isMinimized ? (
          /* Minimized View - Premium */
          <div className="text-center">
            <h2 className="text-base font-bold text-gray-900">
              Selecciona tu vehículo
            </h2>
            <p className="text-sm text-gray-500">Toca para ver opciones</p>
          </div>
        ) : (
          /* Maximized View - Premium */
          <>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Elige tu viaje</h2>
              <p className="text-sm text-gray-600">Selecciona el vehículo que prefieras</p>
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
          ? "bg-gradient-to-r from-blue-500 to-blue-600 border-2 border-blue-600 shadow-xl" 
          : isHovered
          ? "bg-gradient-to-r from-gray-50 to-white border-2 border-black shadow-lg"
          : "bg-white border-2 border-gray-200 hover:border-gray-300 shadow-sm"
        }
      `}
    >
      {/* Vehicle Image Section */}
      <div className="relative p-4 flex items-center justify-center w-32">
        <img
          src={`/${vehicle.image}`}
          className={`w-28 h-auto mix-blend-multiply transition-transform duration-300 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
          alt={vehicle.name}
        />
        {isSelected && (
          <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm flex items-center justify-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center animate-bounce">
              <Check size={24} className="text-blue-600" strokeWidth={3} />
            </div>
          </div>
        )}
      </div>

      {/* Vehicle Info Section */}
      <div className="flex-1 pr-4 py-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className={`text-lg font-bold transition-colors ${
              isSelected ? "text-white" : "text-gray-900"
            }`}>
              {vehicle.name}
            </h1>
            <p className={`text-sm transition-colors ${
              isSelected ? "text-blue-100" : "text-gray-600"
            }`}>
              {vehicle.description}
            </p>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="flex items-center gap-3 mt-2">
          <div className={`flex items-center gap-1 text-xs font-medium ${
            isSelected ? "text-blue-100" : "text-gray-600"
          }`}>
            <Clock size={14} />
            <span>{vehicle.eta}</span>
          </div>
          <div className={`w-1 h-1 rounded-full ${
            isSelected ? "bg-blue-200" : "bg-gray-300"
          }`}></div>
          <div className={`flex items-center gap-1 text-xs font-medium ${
            isSelected ? "text-blue-100" : "text-gray-600"
          }`}>
            <Users size={14} />
            <span>{vehicle.capacity}</span>
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className="pr-4 py-4 text-right">
        <p className={`text-xs font-medium mb-1 ${
          isSelected ? "text-blue-100" : "text-gray-500"
        }`}>
          Tarifa
        </p>
        <h3 className={`text-xl font-bold transition-colors ${
          isSelected ? "text-white" : "text-gray-900"
        }`}>
          ${Math.floor(fare[vehicle.type] / 1000)}K
        </h3>
        <p className={`text-xs mt-1 ${
          isSelected ? "text-blue-100" : "text-gray-500"
        }`}>
          COP$ {fare[vehicle.type]?.toLocaleString('es-CO') || 0}
        </p>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Check size={18} className="text-blue-600" strokeWidth={3} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectVehicle;
