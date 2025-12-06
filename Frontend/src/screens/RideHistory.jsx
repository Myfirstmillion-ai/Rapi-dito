import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Calendar,
  ChevronUp,
  Clock,
  CreditCard,
  MapPin,
  Car,
  Bike,
  Star,
  Search,
  Filter,
  ChevronRight,
  TrendingUp,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function RideHistory() {
  const navigation = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [user] = useState(userData.data);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date"); // date, price
  const [expandedRide, setExpandedRide] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Classification and sorting logic
  function classifyAndSortRides(rides) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const isToday = (date) =>
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();

    const isYesterday = (date) =>
      date.getFullYear() === yesterday.getFullYear() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getDate() === yesterday.getDate();

    const sortByDate = (rides) =>
      rides.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const sortByPrice = (rides) =>
      rides.sort((a, b) => (b.fare || 0) - (a.fare || 0));

    const todayRides = [];
    const yesterdayRides = [];
    const earlierRides = [];

    rides.forEach((ride) => {
      const createdDate = new Date(ride.createdAt);
      if (isToday(createdDate)) {
        todayRides.push(ride);
      } else if (isYesterday(createdDate)) {
        yesterdayRides.push(ride);
      } else {
        earlierRides.push(ride);
      }
    });

    const sortFn = sortBy === "price" ? sortByPrice : sortByDate;

    return {
      today: sortFn(todayRides),
      yesterday: sortFn(yesterdayRides),
      earlier: sortFn(earlierRides),
    };
  }

  // Filter rides by search query
  const filteredRides = useMemo(() => {
    if (!user.rides) return { today: [], yesterday: [], earlier: [] };
    
    const filtered = user.rides.filter((ride) => {
      const query = searchQuery.toLowerCase();
      return (
        ride.pickup?.toLowerCase().includes(query) ||
        ride.destination?.toLowerCase().includes(query)
      );
    });

    return classifyAndSortRides(filtered);
  }, [user.rides, searchQuery, sortBy]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = user.rides?.length || 0;
    const totalSpent = user.rides?.reduce((sum, ride) => sum + (ride.fare || 0), 0) || 0;
    const avgFare = total > 0 ? totalSpent / total : 0;

    return { total, totalSpent, avgFare };
  }, [user.rides]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Premium Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigation(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            >
              <ArrowLeft strokeWidth={2.5} size={24} />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Historial</h1>
              <p className="text-sm text-gray-500">{stats.total} viajes realizados</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por origen o destino..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black focus:bg-white transition-all text-sm placeholder:text-gray-400"
            />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <StatsCard
              icon={<Activity size={16} className="text-blue-600" />}
              label="Total"
              value={stats.total}
              />
            <StatsCard
              icon={<CreditCard size={16} className="text-green-600" />}
              label="Gastado"
              value={`$${Math.round(stats.totalSpent / 1000)}K`}
            />
            <StatsCard
              icon={<TrendingUp size={16} className="text-purple-600" />}
              label="Promedio"
              value={`$${Math.round(stats.avgFare / 1000)}K`}
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
            >
              <Filter size={16} />
              Filtros
            </button>
            {showFilters && (
              <div className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
                <button
                  onClick={() => setSortBy("date")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === "date"
                      ? "bg-black text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Fecha
                </button>
                <button
                  onClick={() => setSortBy("price")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === "price"
                      ? "bg-black text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Precio
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rides List */}
      <div className="px-4 pb-20 pt-4">
        {/* Today Section */}
        <RideSection
          title="Hoy"
          rides={filteredRides.today}
          expandedRide={expandedRide}
          setExpandedRide={setExpandedRide}
        />

        {/* Yesterday Section */}
        <RideSection
          title="Ayer"
          rides={filteredRides.yesterday}
          expandedRide={expandedRide}
          setExpandedRide={setExpandedRide}
        />

        {/* Earlier Section */}
        <RideSection
          title="Anteriores"
          rides={filteredRides.earlier}
          expandedRide={expandedRide}
          setExpandedRide={setExpandedRide}
        />

        {/* Empty State */}
        {filteredRides.today.length === 0 &&
          filteredRides.yesterday.length === 0 &&
          filteredRides.earlier.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No hay viajes
              </h3>
              <p className="text-sm text-gray-500">
                {searchQuery
                  ? "No se encontraron resultados para tu búsqueda"
                  : "Aún no has realizado ningún viaje"}
              </p>
            </div>
          )}
      </div>
    </div>
  );
}

// Stats Card Component
const StatsCard = ({ icon, label, value }) => (
  <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
    <div className="flex items-center gap-2 mb-1">
      {icon}
      <span className="text-xs text-gray-500 font-medium">{label}</span>
    </div>
    <p className="text-lg font-bold text-gray-900">{value}</p>
  </div>
);

// Ride Section Component
const RideSection = ({ title, rides, expandedRide, setExpandedRide }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (rides.length === 0) return null;

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full mb-3 group"
      >
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 font-medium">
            {rides.length} {rides.length === 1 ? "viaje" : "viajes"}
          </span>
          <ChevronUp
            size={20}
            className={`text-gray-400 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {rides.map((ride) => (
            <RideCard
              key={ride._id}
              ride={ride}
              isExpanded={expandedRide === ride._id}
              onToggle={() =>
                setExpandedRide(expandedRide === ride._id ? null : ride._id)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Premium Ride Card Component
export const RideCard = ({ ride, isExpanded, onToggle }) => {
  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const months = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month}, ${year}`;
  }

  function formatTime(inputDate) {
    const date = new Date(inputDate);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${formattedMinutes} ${period}`;
  }

  const VehicleIcon = ride.vehicleType === "bike" ? Bike : Car;
  const hasRating = ride.rating && ride.rating > 0;

  return (
    <div
      onClick={onToggle}
      className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-lg hover:border-gray-300 transition-all duration-200 active:scale-[0.99]"
    >
      {/* Header Section */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-gray-100 rounded-lg">
              <VehicleIcon size={16} className="text-gray-700" />
            </div>
            <span className="text-sm font-semibold text-gray-900 capitalize">
              {ride.vehicleType === "car" ? "Carro" : "Moto"}
            </span>
            {ride.status && (
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  ride.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {ride.status === "completed" ? "Completado" : "Cancelado"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formatDate(ride.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {formatTime(ride.createdAt)}
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">
            ${ride.fare?.toLocaleString("es-CO") || 0}
          </p>
          {ride.distance && (
            <p className="text-xs text-gray-500">
              {(Number(ride.distance.toFixed(2)) / 1000).toFixed(1)} km
            </p>
          )}
        </div>
      </div>

      {/* Route Section */}
      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center pt-1">
            <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white ring-2 ring-green-500"></div>
            <div className="w-0.5 h-8 bg-gradient-to-b from-green-500 via-gray-300 to-red-500 my-0.5"></div>
            <div className="w-3 h-3 rounded-sm bg-red-500 border-2 border-white ring-2 ring-red-500"></div>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                {ride.pickup?.split(", ")[0] || "Origen"}
              </p>
              <p className="text-xs text-gray-500 line-clamp-1">
                {ride.pickup?.split(", ").slice(1).join(", ") || ""}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                {ride.destination?.split(", ")[0] || "Destino"}
              </p>
              <p className="text-xs text-gray-500 line-clamp-1">
                {ride.destination?.split(", ").slice(1).join(", ") || ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Rating */}
          {hasRating && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <Star size={16} className="fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-gray-900">
                Calificación: {ride.rating}/5
              </span>
              {ride.ratingComment && (
                <span className="text-xs text-gray-600 ml-auto">
                  "{ride.ratingComment}"
                </span>
              )}
            </div>
          )}

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-3">
            {ride.duration && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Duración</p>
                <p className="text-sm font-semibold text-gray-900">
                  {ride.duration} min
                </p>
              </div>
            )}
            {ride.captain && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Conductor</p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {ride.captain.fullname?.firstname || "N/A"}
                </p>
              </div>
            )}
          </div>

          {/* View Details Button */}
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm">
            Ver detalles completos
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default RideHistory;
