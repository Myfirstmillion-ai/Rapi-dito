import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
} from "lucide-react";
import axios from "axios";

// Configuration constants
const MEMBERSHIP_CONFIG = {
  defaultPlan: "Monthly",
  defaultDurationDays: 30,
};

function AdminDashboard() {
  const [captains, setCaptains] = useState([]);
  const [filteredCaptains, setFilteredCaptains] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [updateError, setUpdateError] = useState("");
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
    try {
      setUpdatingId(captainId);
      setUpdateError(""); // Clear any previous errors
      const token = localStorage.getItem("token");
      
      // Calculate expiry date using configuration
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + MEMBERSHIP_CONFIG.defaultDurationDays);

      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/admin/captain/${captainId}/status`,
        {
          isMembershipActive: !currentStatus,
          membershipPlan: !currentStatus ? MEMBERSHIP_CONFIG.defaultPlan : null,
          membershipExpiresAt: !currentStatus ? expiryDate.toISOString() : null,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6">
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm border border-white/10"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent">
                  Panel de Administración
                </h1>
              </div>
              <p className="text-white/60 ml-14">Gestión de Conductores</p>
            </div>
          </div>

          <div className="flex items-center gap-4 backdrop-blur-sm bg-white/10 rounded-xl px-4 py-3 border border-white/20">
            <Users className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-sm text-white/60">Total Conductores</p>
              <p className="text-xl font-bold text-white">{captains.length}</p>
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
              className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all"
            >
              {/* Header with Toggle */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">
                    {captain.fullname.firstname} {captain.fullname.lastname || ""}
                  </h3>
                  {captain.isMembershipActive ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      Activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-lg text-xs text-red-300 font-medium">
                      <XCircle className="w-3 h-3" />
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
                  className={`relative w-14 h-7 rounded-full transition-colors ${
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
                <div className="flex items-center gap-2 text-white/70">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span className="truncate">{captain.email}</span>
                </div>
                {captain.phone && (
                  <div className="flex items-center gap-2 text-white/70">
                    <Phone className="w-4 h-4 text-cyan-400" />
                    <span>{captain.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-white/70">
                  <Car className="w-4 h-4 text-purple-400" />
                  <span>
                    {captain.vehicle?.brand || "N/A"} {captain.vehicle?.model || ""} -{" "}
                    {captain.vehicle?.number || "N/A"}
                  </span>
                </div>
                {captain.membershipPlan && (
                  <div className="flex items-center gap-2 text-white/70">
                    <Calendar className="w-4 h-4 text-orange-400" />
                    <span>
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
    </div>
  );
}

export default AdminDashboard;
