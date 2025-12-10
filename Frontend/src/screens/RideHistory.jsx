import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Car,
  Bike,
  Star,
  Search,
  Filter,
  TrendingUp,
  Activity,
  DollarSign,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="w-full min-h-screen bg-white dark:bg-black overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-20 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800"
      >
        <div className="px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigation(-1)}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center"
            >
              <ArrowLeft size={20} className="text-gray-900 dark:text-white" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Historial
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats.total} viajes realizados
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por origen o destino..."
              className="w-full h-12 pl-12 pr-4 bg-gray-100 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 focus:border-emerald-500 dark:focus:border-emerald-500 rounded-2xl outline-none text-sm placeholder:text-gray-400 text-gray-900 dark:text-white transition-colors"
            />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-3 border border-blue-200 dark:border-blue-800">
              <Activity size={16} className="text-blue-500 mb-1" />
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Total</p>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{stats.total}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-2xl p-3 border border-emerald-200 dark:border-emerald-800">
              <DollarSign size={16} className="text-emerald-500 mb-1" />
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Gastado</p>
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                ${Math.round(stats.totalSpent / 1000)}K
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-3 border border-purple-200 dark:border-purple-800">
              <TrendingUp size={16} className="text-purple-500 mb-1" />
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Promedio</p>
              <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                ${Math.round(stats.avgFare / 1000)}K
              </p>
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 h-10 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-2xl transition-all text-sm font-medium text-gray-900 dark:text-white"
            >
              <Filter size={16} />
              Ordenar
            </button>
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex gap-2"
                >
                  <button
                    onClick={() => setSortBy("date")}
                    className={`px-4 h-10 rounded-2xl text-sm font-medium transition-all ${
                      sortBy === "date"
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                        : "bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
                    }`}
                  >
                    Fecha
                  </button>
                  <button
                    onClick={() => setSortBy("price")}
                    className={`px-4 h-10 rounded-2xl text-sm font-medium transition-all ${
                      sortBy === "price"
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                        : "bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
                    }`}
                  >
                    Precio
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Rides List */}
      <div className="px-6 pb-20 pt-6">
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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                No hay viajes
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? "No se encontraron resultados para tu búsqueda"
                  : "Aún no has realizado ningún viaje"}
              </p>
            </motion.div>
          )}
      </div>
    </div>
  );
}

// Ride Section Component
const RideSection = ({ title, rides, expandedRide, setExpandedRide }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (rides.length === 0) return null;

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full mb-4"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {rides.length} {rides.length === 1 ? "viaje" : "viajes"}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-400">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-3xl p-4 cursor-pointer hover:border-gray-300 dark:hover:border-gray-700 transition-all"
    >
      {/* Header Section */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <VehicleIcon size={16} className="text-emerald-500" />
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
              {ride.vehicleType === "car" ? "Carro" : "Moto"}
            </span>
            {ride.status && (
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  ride.status === "completed"
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                }`}
              >
                {ride.status === "completed" ? "Completado" : "Cancelado"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
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
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            ${ride.fare?.toLocaleString("es-CO") || 0}
          </p>
          {ride.distance && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {(Number(ride.distance.toFixed(2)) / 1000).toFixed(1)} km
            </p>
          )}
        </div>
      </div>

      {/* Route Section */}
      <div className="relative pl-6">
        {/* Route Line */}
        <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-gradient-to-b from-emerald-500 to-gray-300 dark:to-gray-700"></div>
        
        {/* Pickup Dot */}
        <div className="absolute left-0 top-2 -translate-x-[3px] w-2 h-2 rounded-full bg-emerald-500"></div>
        
        {/* Destination Dot */}
        <div className="absolute left-0 bottom-2 -translate-x-[3px] w-2 h-2 rounded-full bg-gray-400"></div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
              {ride.pickup?.split(", ")[0] || "Origen"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
              {ride.pickup?.split(", ").slice(1).join(", ") || ""}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
              {ride.destination?.split(", ")[0] || "Destino"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
              {ride.destination?.split(", ").slice(1).join(", ") || ""}
            </p>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3"
          >
            {/* Rating */}
            {hasRating && (
              <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-3">
                <Star size={16} className="fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                  Calificación: {ride.rating}/5
                </span>
                {ride.ratingComment && (
                  <span className="text-xs text-amber-600 dark:text-amber-400 ml-auto truncate">
                    "{ride.ratingComment}"
                  </span>
                )}
              </div>
            )}

            {/* Driver Info */}
            {ride.status === "completed" && (ride.captain || ride.driver) && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Conductor</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {ride.captain?.fullname?.firstname || 
                   ride.captain?.firstname || 
                   ride.driver?.fullname?.firstname || 
                   ride.driver?.firstname ||
                   ride.captain?.name ||
                   ride.driver?.name}
                </p>
                {(() => {
                  const vehicle = ride.captain?.vehicle || ride.driver?.vehicle;
                  if (vehicle && (vehicle.make || vehicle.model || vehicle.color)) {
                    return (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                        {vehicle.make || ""} {vehicle.model || ""} 
                        {vehicle.color && ` - ${vehicle.color}`}
                      </p>
                    );
                  }
                  return null;
                })()}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RideHistory;