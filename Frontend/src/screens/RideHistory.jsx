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
import { motion } from "framer-motion";

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
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950 relative overflow-x-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, rgb(16 185 129) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Premium Header */}
      <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 py-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <button
              onClick={() => navigation(-1)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all active:scale-95 border border-white/20"
            >
              <ArrowLeft strokeWidth={2.5} size={24} className="text-white" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Historial
              </h1>
              <p className="text-sm text-slate-400">{stats.total} viajes realizados</p>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por origen o destino..."
              className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm placeholder:text-slate-400 text-white backdrop-blur-xl"
            />
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-2 mt-3"
          >
            <StatsCard
              icon={<Activity size={16} className="text-blue-400" />}
              label="Total"
              value={stats.total}
              gradient="from-blue-500/20 to-blue-600/20"
              />
            <StatsCard
              icon={<CreditCard size={16} className="text-emerald-400" />}
              label="Gastado"
              value={`$${Math.round(stats.totalSpent / 1000)}K`}
              gradient="from-emerald-500/20 to-green-600/20"
            />
            <StatsCard
              icon={<TrendingUp size={16} className="text-purple-400" />}
              label="Promedio"
              value={`$${Math.round(stats.avgFare / 1000)}K`}
              gradient="from-purple-500/20 to-pink-600/20"
            />
          </motion.div>

          {/* Filter Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 mt-3"
          >
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-sm font-medium text-white border border-white/20 backdrop-blur-xl"
            >
              <Filter size={16} />
              Filtros
            </button>
            {showFilters && (
              <div className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
                <button
                  onClick={() => setSortBy("date")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    sortBy === "date"
                      ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  }`}
                >
                  Fecha
                </button>
                <button
                  onClick={() => setSortBy("price")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    sortBy === "price"
                      ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  }`}
                >
                  Precio
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Rides List */}
      <div className="px-4 pb-20 pt-4 relative">
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
              <div className="w-20 h-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">
                No hay viajes
              </h3>
              <p className="text-sm text-slate-400">
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

// Stats Card Component
const StatsCard = ({ icon, label, value, gradient }) => (
  <div className={`bg-gradient-to-br ${gradient} backdrop-blur-xl border border-white/10 rounded-lg p-3 shadow-lg`}>
    <div className="flex items-center gap-2 mb-1">
      {icon}
      <span className="text-xs text-white/80 font-medium">{label}</span>
    </div>
    <p className="text-lg font-bold text-white">{value}</p>
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
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400 font-medium">
            {rides.length} {rides.length === 1 ? "viaje" : "viajes"}
          </span>
          <ChevronUp
            size={20}
            className={`text-slate-400 transition-transform duration-300 ${
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
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 cursor-pointer hover:bg-white/10 hover:border-emerald-500/50 transition-all duration-200 active:scale-[0.99]"
    >
      {/* Header Section */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg">
              <VehicleIcon size={16} className="text-emerald-400" />
            </div>
            <span className="text-sm font-semibold text-white capitalize">
              {ride.vehicleType === "car" ? "Carro" : "Moto"}
            </span>
            {ride.status && (
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  ride.status === "completed"
                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                }`}
              >
                {ride.status === "completed" ? "Completado" : "Cancelado"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
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
          <p className="text-xl font-bold text-white">
            ${ride.fare?.toLocaleString("es-CO") || 0}
          </p>
          {ride.distance && (
            <p className="text-xs text-slate-400">
              {(Number(ride.distance.toFixed(2)) / 1000).toFixed(1)} km
            </p>
          )}
        </div>
      </div>

      {/* Route Section */}
      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center pt-1">
            <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900 ring-2 ring-emerald-500/50"></div>
            <div className="w-0.5 h-8 bg-gradient-to-b from-emerald-500 via-slate-600 to-red-500 my-0.5"></div>
            <div className="w-3 h-3 rounded-sm bg-red-500 border-2 border-slate-900 ring-2 ring-red-500/50"></div>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-sm font-semibold text-white line-clamp-1">
                {ride.pickup?.split(", ")[0] || "Origen"}
              </p>
              <p className="text-xs text-slate-400 line-clamp-1">
                {ride.pickup?.split(", ").slice(1).join(", ") || ""}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-white line-clamp-1">
                {ride.destination?.split(", ")[0] || "Destino"}
              </p>
              <p className="text-xs text-slate-400 line-clamp-1">
                {ride.destination?.split(", ").slice(1).join(", ") || ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Rating */}
          {hasRating && (
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 backdrop-blur-xl">
              <Star size={16} className="fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-white">
                Calificación: {ride.rating}/5
              </span>
              {ride.ratingComment && (
                <span className="text-xs text-slate-300 ml-auto">
                  "{ride.ratingComment}"
                </span>
              )}
            </div>
          )}

          {/* Driver Info - Only show for completed rides */}
          {ride.status === "completed" && (ride.captain || ride.driver) && (
            <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-lg p-3">
              <p className="text-xs text-slate-400 mb-1">Conductor</p>
              <p className="text-sm font-semibold text-white truncate">
                {ride.captain?.fullname?.firstname || 
                 ride.captain?.firstname || 
                 ride.driver?.fullname?.firstname || 
                 ride.driver?.firstname ||
                 ride.captain?.name ||
                 ride.driver?.name ||
                 "Sin información"}
              </p>
              {/* Vehicle Info if available */}
              {(ride.captain?.vehicle || ride.driver?.vehicle) && (
                <p className="text-xs text-slate-400 mt-1 truncate">
                  {ride.captain?.vehicle?.make || ride.driver?.vehicle?.make || ""}{" "}
                  {ride.captain?.vehicle?.model || ride.driver?.vehicle?.model || ""}
                  {(ride.captain?.vehicle?.color || ride.driver?.vehicle?.color) && 
                    ` - ${ride.captain?.vehicle?.color || ride.driver?.vehicle?.color}`}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RideHistory;
