import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Users,
  CheckCircle2,
  XCircle,
  Calendar,
  Mail,
  Phone,
  Car,
  ArrowLeft,
  Shield,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import axios from "axios";

// Plan configuration with durations
const MEMBERSHIP_PLANS = [
  { id: "Weekly", label: "Semanal", days: 7 },
  { id: "Bi-Weekly", label: "Quincenal", days: 15 },
  { id: "Monthly", label: "Mensual", days: 30 },
  { id: "2-Months", label: "2 Meses", days: 60 },
  { id: "3-Months", label: "3 Meses", days: 90 },
];

function AdminDashboard() {
  const [captains, setCaptains] = useState([]);
  const [filteredCaptains, setFilteredCaptains] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [updateError, setUpdateError] = useState("");
  
  // Plan selection modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("Monthly");
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchCaptains();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCaptains(captains);
    } else {
      const filtered = captains.filter((captain) => {
        const fullName = `${captain.fullname.firstname} ${captain.fullname.lastname || ""}`.toLowerCase();
        const email = captain.email.toLowerCase();
        const query = searchQuery.toLowerCase();
        return fullName.includes(query) || email.includes(query);
      });
      setFilteredCaptains(filtered);
    }
  }, [searchQuery, captains]);

  const fetchCaptains = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/admin/captains`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCaptains(response.data.captains);
      setFilteredCaptains(response.data.captains);
    } catch (error) {
      console.error("Error fetching captains:", error);
      setError(error.response?.data?.message || "Error al cargar conductores");
      if (error.response?.status === 401 || error.response?.status === 403) {
        setTimeout(() => navigate("/"), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleCaptainStatus = async (captainId, currentStatus) => {
    // If activating (currently inactive), open the plan selection modal
    if (!currentStatus) {
      const captain = captains.find(c => c._id === captainId);
      setSelectedDriver(captain);
      setIsModalOpen(true);
      return;
    }
    
    // If deactivating, proceed directly
    await updateCaptainMembership(captainId, false, null, null);
  };

  const updateCaptainMembership = async (captainId, isActive, planType, expiryDate) => {
    try {
      setUpdatingId(captainId);
      setUpdateError(""); // Clear any previous errors
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/admin/captain/${captainId}/status`,
        {
          isMembershipActive: isActive,
          membershipPlan: planType,
          membershipExpiresAt: expiryDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      setCaptains((prev) =>
        prev.map((captain) =>
          captain._id === captainId
            ? {
                ...captain,
                isMembershipActive: response.data.captain.isMembershipActive,
                membershipPlan: response.data.captain.membershipPlan,
                membershipExpiresAt: response.data.captain.membershipExpiresAt,
              }
            : captain
        )
      );
    } catch (error) {
      console.error("Error updating captain status:", error);
      setUpdateError(error.response?.data?.message || "Error al actualizar estado");
      // Clear error after 5 seconds
      setTimeout(() => setUpdateError(""), 5000);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleConfirmPlan = async () => {
    if (!selectedDriver || !selectedPlan) return;

    const plan = MEMBERSHIP_PLANS.find(p => p.id === selectedPlan);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + plan.days);

    await updateCaptainMembership(
      selectedDriver._id,
      true,
      selectedPlan,
      expiryDate.toISOString()
    );

    // Close modal and reset
    setIsModalOpen(false);
    setSelectedDriver(null);
    setSelectedPlan("Monthly");
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setSelectedDriver(null);
    setSelectedPlan("Monthly");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
          <p className="text-white/60">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-4 sm:p-6">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgb(16 185 129 / 0.3) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header - Mobile First */}
        <div className="flex flex-col gap-4 mb-6 sm:mb-8">
          {/* Top Row: Back Button + Title */}
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex-shrink-0 p-2 sm:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm border border-white/10"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <div className="flex-shrink-0 p-1.5 sm:p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500">
                  <Shield className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent break-words">
                  Panel de Administración
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-white/60 pl-8 sm:pl-14">Gestión de Conductores</p>
            </div>
          </div>

          {/* Stats Card - Full Width on Mobile */}
          <div className="backdrop-blur-sm bg-white/10 rounded-xl px-4 py-3 border border-white/20 self-start sm:self-auto">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-xs sm:text-sm text-white/60">Total Conductores</p>
                <p className="text-lg sm:text-xl font-bold text-white">{captains.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 backdrop-blur-xl bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Update Error Message */}
        {updateError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 backdrop-blur-xl bg-orange-500/20 border border-orange-500/30 rounded-xl text-orange-200 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{updateError}</span>
          </motion.div>
        )}

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-12 pr-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
          />
        </div>

        {/* Captains Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCaptains.map((captain) => (
            <motion.div
              key={captain._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-white/30 transition-all"
            >
              {/* Header with Toggle */}
              <div className="flex items-start justify-between mb-4 gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1 break-words">
                    {captain.fullname.firstname} {captain.fullname.lastname || ""}
                  </h3>
                  {captain.isMembershipActive ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 font-medium">
                      <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                      Activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-lg text-xs text-red-300 font-medium">
                      <XCircle className="w-3 h-3 flex-shrink-0" />
                      Inactivo
                    </span>
                  )}
                </div>

                {/* Toggle Switch */}
                <button
                  onClick={() =>
                    toggleCaptainStatus(captain._id, captain.isMembershipActive)
                  }
                  disabled={updatingId === captain._id}
                  className={`flex-shrink-0 relative w-14 h-7 rounded-full transition-colors ${
                    captain.isMembershipActive
                      ? "bg-emerald-500"
                      : "bg-white/20"
                  } ${updatingId === captain._id ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <motion.div
                    animate={{
                      x: captain.isMembershipActive ? 28 : 2,
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
                  />
                  {updatingId === captain._id && (
                    <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white animate-spin" />
                  )}
                </button>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-white/70 min-w-0">
                  <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="truncate">{captain.email}</span>
                </div>
                {captain.phone && (
                  <div className="flex items-center gap-2 text-white/70">
                    <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span className="break-words">{captain.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-white/70 min-w-0">
                  <Car className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span className="truncate">
                    {captain.vehicle?.brand || "N/A"} {captain.vehicle?.model || ""} -{" "}
                    {captain.vehicle?.number || "N/A"}
                  </span>
                </div>
                {captain.membershipPlan && (
                  <div className="flex items-center gap-2 text-white/70">
                    <Calendar className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm break-words">
                      {captain.membershipPlan} - Expira:{" "}
                      {formatDate(captain.membershipExpiresAt)}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCaptains.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 text-lg">
              {searchQuery ? "No se encontraron conductores" : "No hay conductores registrados"}
            </p>
          </div>
        )}
      </div>

      {/* Plan Selection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9998]"
              onClick={handleCancelModal}
            />

            {/* Modal Container */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative w-full max-w-md max-h-[85vh] flex flex-col pointer-events-auto"
              >
                {/* Glassmorphism Card */}
                <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col h-full">
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-emerald-500/10 pointer-events-none"></div>

                  {/* Close Button */}
                  <button
                    onClick={handleCancelModal}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm z-20"
                    aria-label="Cerrar"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>

                  {/* Header Section (Fixed) */}
                  <div className="relative z-10 px-6 pt-6 pb-4 flex-shrink-0">
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                        <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-full">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl sm:text-2xl font-black text-center mb-2 bg-gradient-to-r from-white via-emerald-200 to-teal-200 bg-clip-text text-transparent">
                      Seleccionar Plan de Membresía
                    </h2>

                    {/* Driver Name */}
                    {selectedDriver && (
                      <p className="text-center text-white/80 text-sm">
                        Activando para:{" "}
                        <span className="font-bold text-white">
                          {selectedDriver.fullname.firstname} {selectedDriver.fullname.lastname || ""}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Scrollable Plan Selection */}
                  <div className="relative z-10 flex-1 overflow-y-auto px-6 py-2 custom-scrollbar">
                    <div className="space-y-3 pb-4">
                      {MEMBERSHIP_PLANS.map((plan, index) => (
                        <motion.button
                          key={plan.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => setSelectedPlan(plan.id)}
                          className={`w-full p-4 rounded-xl border-2 transition-all duration-300 active:scale-95 ${
                            selectedPlan === plan.id
                              ? "border-emerald-500/60 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                              : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-left flex-1">
                              <p className="text-white font-bold text-base">{plan.label}</p>
                              <p className="text-gray-300 text-sm mt-0.5">{plan.days} días de acceso</p>
                            </div>
                            <div className="flex-shrink-0 ml-3">
                              <motion.div
                                initial={false}
                                animate={{
                                  scale: selectedPlan === plan.id ? 1 : 0.8,
                                  opacity: selectedPlan === plan.id ? 1 : 0.5,
                                }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                  selectedPlan === plan.id
                                    ? "border-emerald-400 bg-emerald-500"
                                    : "border-white/40 bg-transparent"
                                }`}
                              >
                                {selectedPlan === plan.id && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                                  >
                                    <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />
                                  </motion.div>
                                )}
                              </motion.div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Fixed Footer with Action Buttons */}
                  <div className="relative z-10 px-6 pb-6 pt-4 flex-shrink-0 bg-gradient-to-t from-slate-900/50 to-transparent backdrop-blur-sm">
                    <div className="flex gap-3">
                      <button
                        onClick={handleCancelModal}
                        className="flex-1 h-12 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
                      >
                        Cancelar
                      </button>
                      <motion.button
                        onClick={handleConfirmPlan}
                        disabled={updatingId !== null}
                        animate={selectedPlan ? { scale: [1, 1.02, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className={`flex-1 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105 active:scale-95 ${
                          selectedPlan && updatingId === null ? "animate-pulse" : ""
                        }`}
                      >
                        {updatingId !== null ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Activando...</span>
                          </>
                        ) : (
                          <>
                            <span>Activar Membresía</span>
                            <CheckCircle2 className="w-4 h-4" />
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(16, 185, 129, 0.5);
                border-radius: 10px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(16, 185, 129, 0.7);
              }
            `}</style>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminDashboard;
