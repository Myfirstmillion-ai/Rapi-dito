import { useState, useEffect, useRef } from "react";
import { ChevronLeft, Check, Clock, Users, ArrowRight } from "lucide-react";

/**
 * SelectVehicle - Swiss Minimalist Luxury Vehicle Selector
 * 
 * Features:
 * - Floating Sheet at bottom (solid, no blur)
 * - Horizontal 3D Carousel
 * - "Pop Out" effect on selection (scale-110 + deep shadow)
 * - MASSIVE price typography (text-4xl)
 * - Pill-shaped gradient "Confirmar" button
 */

const vehicles = [
  {
    id: 1,
    name: "Rapidito",
    description: "Cómodo y seguro",
    type: "car",
    image: "/Uber-PNG-Photos.png",
    capacity: "4 personas",
    eta: "3-5 min",
    color: "emerald"
  },
  {
    id: 2,
    name: "Moto",
    description: "Súper rápido",
    type: "bike",
    image: "/bike.webp",
    capacity: "1 persona",
    eta: "2-4 min",
    color: "blue"
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
  const [currentlySelected, setCurrentlySelected] = useState(vehicles[0].id);
  const scrollRef = useRef(null);

  // Reset selection when panel closes
  useEffect(() => {
    if (!showPanel) {
      setCurrentlySelected(vehicles[0].id);
    }
  }, [showPanel]);

  const handleConfirm = () => {
    const selectedVehicleData = vehicles.find(v => v.id === currentlySelected);
    if (selectedVehicleData) {
      selectedVehicle(selectedVehicleData.type);
      setShowPanel(false);
      showNextPanel(true);
    }
  };

  const handleBack = () => {
    setShowPanel(false);
    showPreviousPanel(true);
  };

  const selectedVehicleData = vehicles.find(v => v.id === currentlySelected);
  const currentFare = selectedVehicleData ? fare[selectedVehicleData.type] : 0;

  return (
    <div
      className={`${showPanel ? "translate-y-0" : "translate-y-full"} 
        transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] 
        fixed bottom-0 left-0 right-0 z-10`}
    >
      {/* Floating Sheet - Solid background, no blur */}
      <div 
        className="bg-slate-900 rounded-t-[32px] shadow-2xl"
        style={{ 
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 24px)',
          boxShadow: '0 -8px 40px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-white/20 rounded-full" />
        </div>

        {/* Header with Back Button */}
        <div className="px-6 pb-4 flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/15 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div className="text-center flex-1">
            <h2 className="text-xl font-bold text-white">Elige tu viaje</h2>
          </div>
          <div className="w-10" /> {/* Spacer for symmetry */}
        </div>

        {/* Horizontal Carousel */}
        <div 
          ref={scrollRef}
          className="flex gap-4 px-6 pb-6 overflow-x-auto scrollbar-hide"
          style={{ 
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              fare={fare[vehicle.type] || 0}
              isSelected={currentlySelected === vehicle.id}
              onSelect={() => setCurrentlySelected(vehicle.id)}
            />
          ))}
        </div>

        {/* Selected Vehicle Summary + Price */}
        <div className="px-6 pb-4">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-white/50 text-sm font-medium mb-1">Total estimado</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">
                  ${Math.floor(currentFare / 1000)}K
                </span>
                <span className="text-lg text-white/40 font-medium">COP</span>
              </div>
              <p className="text-white/40 text-sm mt-1">
                ${currentFare?.toLocaleString('es-CO') || 0} pesos
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/50 text-sm font-medium mb-1">Tiempo</p>
              <p className="text-xl font-bold text-emerald-400">
                {selectedVehicleData?.eta || '3-5 min'}
              </p>
            </div>
          </div>

          {/* Confirm Button - Huge Pill with Gradient */}
          <button
            onClick={handleConfirm}
            className="w-full h-16 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 
              hover:from-emerald-400 hover:to-emerald-500 
              active:scale-[0.98] transition-all duration-200
              flex items-center justify-center gap-3
              shadow-xl shadow-emerald-500/30"
          >
            <span className="text-lg font-bold text-white">Confirmar Viaje</span>
            <ArrowRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * VehicleCard - Individual vehicle option with 3D "Pop Out" effect
 */
const VehicleCard = ({ vehicle, fare, isSelected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`
        relative flex-shrink-0 w-44 rounded-3xl p-4 cursor-pointer 
        transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        ${isSelected 
          ? 'bg-emerald-500 scale-110 shadow-2xl shadow-emerald-500/40 -translate-y-2' 
          : 'bg-white/5 hover:bg-white/10'
        }
      `}
      style={{ 
        scrollSnapAlign: 'center',
        ...(isSelected && {
          boxShadow: '0 20px 40px rgba(16, 185, 129, 0.4), 0 0 0 2px rgba(16, 185, 129, 0.3)'
        })
      }}
    >
      {/* Selected Checkmark */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-lg animate-scale-in">
          <Check className="w-4 h-4 text-emerald-600" strokeWidth={3} />
        </div>
      )}

      {/* Vehicle Image */}
      <div className="flex justify-center mb-3">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className={`h-20 w-auto drop-shadow-xl transition-transform duration-300 ${
            isSelected ? 'scale-110' : ''
          }`}
        />
      </div>

      {/* Vehicle Name */}
      <h3 className={`text-lg font-bold text-center mb-1 ${
        isSelected ? 'text-white' : 'text-white'
      }`}>
        {vehicle.name}
      </h3>
      
      {/* Description */}
      <p className={`text-xs text-center mb-3 ${
        isSelected ? 'text-white/80' : 'text-white/50'
      }`}>
        {vehicle.description}
      </p>

      {/* Meta Info Pills */}
      <div className="flex justify-center gap-2 mb-4">
        <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
          isSelected ? 'bg-white/20 text-white' : 'bg-white/10 text-white/60'
        }`}>
          <Clock className="w-3 h-3" />
          <span>{vehicle.eta}</span>
        </div>
        <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
          isSelected ? 'bg-white/20 text-white' : 'bg-white/10 text-white/60'
        }`}>
          <Users className="w-3 h-3" />
          <span>{vehicle.capacity.split(' ')[0]}</span>
        </div>
      </div>

      {/* Price - MASSIVE */}
      <div className="text-center">
        <span className={`text-3xl font-black ${
          isSelected ? 'text-white' : 'text-emerald-400'
        }`}>
          ${Math.floor(fare / 1000)}K
        </span>
      </div>
    </div>
  );
};

export default SelectVehicle;
