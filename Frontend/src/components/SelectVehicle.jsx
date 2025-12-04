import { ChevronDown, Users, Zap, DollarSign } from "lucide-react";

const vehicles = [
  {
    id: 1,
    name: "Carro",
    description: "Viajes cómodos y seguros para todos",
    type: "car",
    image: "https://cdn-icons-png.flaticon.com/512/3097/3097136.png",
    capacity: "4 pasajeros",
    icon: "🚗",
    color: "blue"
  },
  {
    id: 2,
    name: "Moto",
    description: "Viajes rápidos y económicos",
    type: "bike",
    image: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png",
    capacity: "1 pasajero",
    icon: "🏍️",
    color: "orange"
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
  return (
    <>
      <div
        className={`${showPanel ? "bottom-0" : "-bottom-[70%]"} transition-all duration-500 absolute bg-white w-full rounded-t-3xl p-5 pt-3 shadow-2xl border-t-4 border-purple-500`}
      >
        {/* Drag handle */}
        <div
          onClick={() => {
            setShowPanel(false);
            showPreviousPanel(true);
          }}
          className="flex justify-center py-2 pb-4 cursor-pointer"
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors"></div>
        </div>
        
        <div className="mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
            Selecciona tu vehículo
          </h2>
          <p className="text-sm text-gray-600">Elige la opción que mejor se adapte a ti</p>
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
            />
          ))}
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
}) => {
  const colorClasses = {
    blue: "hover:border-blue-500 hover:shadow-blue-100",
    orange: "hover:border-orange-500 hover:shadow-orange-100"
  };

  return (
    <div
      onClick={() => {
        selectedVehicle(vehicle.type);
        setShowPanel(false);
        showNextPanel(true);
      }}
      className={`cursor-pointer flex items-center w-full rounded-2xl border-2 transition-all duration-200 border-gray-200 bg-gradient-to-br from-gray-50 to-white ${colorClasses[vehicle.color]} hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] p-4`}
    >
      {/* Vehicle image with background */}
      <div className={`p-3 rounded-xl ${vehicle.type === 'car' ? 'bg-blue-50' : 'bg-orange-50'}`}>
        <img
          src={vehicle.image}
          className="w-20 h-20 object-contain"
          alt={vehicle.name}
        />
      </div>
      
      {/* Vehicle details */}
      <div className="flex-1 px-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{vehicle.icon}</span>
          <h1 className="text-lg font-bold text-gray-900">{vehicle.name}</h1>
        </div>
        <p className="text-xs text-gray-600 mb-2">{vehicle.description}</p>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Users size={14} />
          <span>{vehicle.capacity}</span>
        </div>
      </div>
      
      {/* Price badge */}
      <div className={`px-4 py-3 rounded-xl ${vehicle.type === 'car' ? 'bg-blue-500' : 'bg-orange-500'} text-white`}>
        <div className="flex items-center gap-1 mb-1">
          <DollarSign size={14} />
          <span className="text-xs font-medium">COP</span>
        </div>
        <h3 className="font-bold text-lg">
          ${fare[vehicle.type]?.toLocaleString('es-CO') || 0}
        </h3>
      </div>
    </div>
  );
};

export default SelectVehicle;
