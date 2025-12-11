import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  CircleUserRound,
  History,
  KeyRound,
  X,
  HelpCircle,
  LogOut,
  BarChart3,
  Star,
  Moon,
  Sun,
} from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Console from "../utils/console";
import { SPRING, triggerHaptic, prefersReducedMotion } from "../styles/swissLuxury";

/**
 * Sidebar - Swiss Luxury Minimalist iOS Style
 *
 * Premium navigation sidebar with:
 * - Light/Dark mode support + toggle
 * - Floating island design
 * - Premium profile card
 * - Smooth animations
 * - Physics-based interactions
 */

function Sidebar({ onToggle }) {
  const token = localStorage.getItem("token");
  const [showSidebar, setShowSidebar] = useState(false);
  const [newUser, setNewUser] = useState({});
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const reducedMotion = useMemo(() => prefersReducedMotion(), []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setNewUser(userData);
  }, []);

  // Update theme class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    const newState = !showSidebar;
    setShowSidebar(newState);
    triggerHaptic("light");
    if (onToggle) {
      onToggle(newState);
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    triggerHaptic("medium");
  };

  const logout = async () => {
    try {
      triggerHaptic("heavy");
      await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/${newUser.type}/logout`,
        {
          headers: {
            token: token,
          },
        }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("messages");
      localStorage.removeItem("rideDetails");
      localStorage.removeItem("panelDetails");
      localStorage.removeItem("showPanel");
      localStorage.removeItem("showBtn");
      navigate("/");
    } catch (error) {
      Console.log("Error al cerrar sesión", error);
    }
  };

  const menuItems = [
    {
      to: `/${newUser?.type}/edit-profile`,
      icon: CircleUserRound,
      label: "Editar Perfil",
    },
    {
      to: `/${newUser?.type}/rides`,
      icon: History,
      label: "Historial de Viajes",
    },
    ...(newUser?.type === "captain"
      ? [{ to: `/captain/statistics`, icon: BarChart3, label: "Estadísticas" }]
      : []),
    {
      to: `/${newUser?.type}/reset-password?token=${token}`,
      icon: KeyRound,
      label: "Cambiar Contraseña",
    },
    { to: "/help", icon: HelpCircle, label: "Centro de Ayuda" },
  ];

  return (
    <>
      {/* Hamburger Menu Button */}
      <motion.button
        whileTap={reducedMotion ? {} : { scale: 0.9 }}
        style={{ zIndex: 9999 }}
        className="fixed left-4 top-5 w-12 h-12 rounded-full bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center cursor-pointer transition-all hover:shadow-xl"
        onClick={toggleSidebar}
      >
        {showSidebar ? (
          <X size={20} className="text-gray-900 dark:text-white" />
        ) : (
          <div className="flex flex-col gap-1">
            <div className="w-4 h-0.5 bg-gray-900 dark:bg-white rounded-full" />
            <div className="w-3 h-0.5 bg-gray-900 dark:bg-white rounded-full" />
          </div>
        )}
      </motion.button>

      <AnimatePresence>
        {showSidebar && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-[100]"
              onClick={toggleSidebar}
            />

            {/* Sidebar Panel */}
            <motion.div
              initial={reducedMotion ? { opacity: 0 } : { x: "-100%" }}
              animate={{ x: 0, opacity: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { x: "-100%" }}
              transition={SPRING.smooth}
              className="fixed w-full max-w-sm h-dvh top-0 left-0 z-[200] bg-white dark:bg-[#0A0A0A] border-r border-gray-200 dark:border-gray-800"
              style={{
                paddingBottom: "env(safe-area-inset-bottom)",
              }}
            >
              {/* Content */}
              <div className="relative h-full flex flex-col p-6 overflow-y-auto">
                {/* Close Button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleSidebar}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
                >
                  <X size={18} className="text-gray-500 dark:text-gray-400" />
                </motion.button>

                {/* Profile Card */}
                <motion.div
                  initial={reducedMotion ? {} : { opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mt-8 mb-8 p-6 rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  {/* Avatar */}
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 p-0.5">
                      {newUser?.data?.profileImage ? (
                        <img
                          src={newUser.data.profileImage}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-900"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center border-2 border-white dark:border-gray-900">
                          <span className="text-2xl text-white font-bold">
                            {newUser?.data?.fullname?.firstname?.[0] || "U"}
                            {newUser?.data?.fullname?.lastname?.[0] || ""}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Online Indicator */}
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900" />
                  </div>

                  {/* Name */}
                  <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-1">
                    {newUser?.data?.fullname?.firstname}{" "}
                    {newUser?.data?.fullname?.lastname}
                  </h2>

                  {/* Rating */}
                  {(newUser?.data?.rating?.average || newUser?.data?.rating) && (
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <Star
                        size={14}
                        className="fill-yellow-400 text-yellow-400"
                      />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {(
                          newUser?.data?.rating?.average ||
                          newUser?.data?.rating ||
                          0
                        ).toFixed(1)}
                      </span>
                      {newUser?.data?.rating?.count > 0 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({newUser.data.rating.count})
                        </span>
                      )}
                    </div>
                  )}

                  {/* Email */}
                  <p className="text-sm text-center text-gray-500 dark:text-gray-400 truncate">
                    {newUser?.data?.email}
                  </p>

                  {/* Role Badge */}
                  <div className="flex items-center justify-center mt-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400">
                      {newUser?.type === "captain" ? "Conductor" : "Pasajero"}
                    </span>
                  </div>
                </motion.div>

                {/* Theme Toggle */}
                <motion.div
                  initial={reducedMotion ? {} : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="mb-6 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isDark ? (
                        <Moon size={18} className="text-gray-500 dark:text-gray-400" />
                      ) : (
                        <Sun size={18} className="text-gray-500" />
                      )}
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {isDark ? "Modo oscuro" : "Modo claro"}
                      </span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleTheme}
                      className={`w-12 h-7 rounded-full p-1 transition-colors ${
                        isDark ? "bg-emerald-500" : "bg-gray-300"
                      }`}
                    >
                      <motion.div
                        layout
                        className="w-5 h-5 rounded-full bg-white shadow-sm"
                        style={{
                          marginLeft: isDark ? "auto" : "0",
                        }}
                      />
                    </motion.button>
                  </div>
                </motion.div>

                {/* Navigation Links */}
                <div className="flex-1 space-y-2">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.to}
                      initial={reducedMotion ? {} : { opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                    >
                      <Link
                        to={item.to}
                        onClick={toggleSidebar}
                        className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 flex items-center justify-center transition-colors">
                            <item.icon
                              size={18}
                              className="text-gray-500 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                            {item.label}
                          </span>
                        </div>
                        <ChevronRight
                          size={18}
                          className="text-gray-400 dark:text-gray-600 group-hover:text-emerald-500 transition-colors"
                        />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Logout Button */}
                <motion.button
                  initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileTap={reducedMotion ? {} : { scale: 0.98 }}
                  onClick={logout}
                  className="w-full mt-6 py-4 px-6 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                  style={{
                    boxShadow: "0 4px 16px rgba(239, 68, 68, 0.3)",
                  }}
                >
                  <LogOut size={18} />
                  <span>Cerrar Sesión</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;
