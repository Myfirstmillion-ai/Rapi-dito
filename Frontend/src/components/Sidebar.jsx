import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, CircleUserRound, History, KeyRound, Menu, X, HelpCircle, LogOut } from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Console from "../utils/console";
import { Z_INDEX } from "../utils/zIndex";

/**
 * Sidebar - The Floating Glass Sheet
 * Process 2 - Phase 2: Floating Navigation Architecture
 * 
 * Design Philosophy:
 * - Floating glass sheet that slides over content (doesn't push)
 * - Dismissible backdrop with blur effect
 * - Z-Index Layer: sidebar (40) for backdrop, sidebarPanel (41) for panel
 * - Z-Index Layer: floatingHeader (30) for hamburger menu button
 * 
 * Structure:
 * └── Hamburger Button (z-30, fixed top-left)
 * └── Backdrop Overlay (z-40, dismissible)
 * └── Sidebar Panel (z-41, slides from left)
 *     ├── Profile Card (glassmorphism)
 *     ├── Navigation Links
 *     └── Logout Button
 */

function Sidebar({ onToggle }) {
  const token = localStorage.getItem("token");
  const [showSidebar, setShowSidebar] = useState(false);
  const [newUser, setNewUser] = useState({});

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setNewUser(userData);
  }, []);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    const newState = !showSidebar;
    setShowSidebar(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  const logout = async () => {
    try {
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
    { to: `/${newUser?.type}/edit-profile`, icon: CircleUserRound, label: "Editar Perfil" },
    { to: `/${newUser?.type}/rides`, icon: History, label: "Historial de Viajes" },
    ...(newUser?.type === 'captain' ? [
      { to: `/captain/statistics`, icon: History, label: "📊 Estadísticas" }
    ] : []),
    { to: `/${newUser?.type}/reset-password?token=${token}`, icon: KeyRound, label: "Cambiar Contraseña" },
    { to: "/help", icon: HelpCircle, label: "Centro de Ayuda" },
  ];
  // Spring animation config for premium feel
  const springConfig = {
    type: "spring",
    damping: 25,
    stiffness: 200
  };
  
  return (
    <>
      {/* Hamburger Menu Button - Premium Floating Glass Style */}
      {/* Z-Index: floatingHeader (30) - same level as header */}
      <motion.button
        whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
        whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
        className="fixed left-4 top-4 cursor-pointer p-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
        style={{
          zIndex: Z_INDEX.floatingHeader,
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
        }}
        onClick={toggleSidebar}
        aria-label={showSidebar ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={showSidebar}
      >
        <AnimatePresence mode="wait">
          {showSidebar ? (
            <motion.div
              key="close"
              initial={prefersReducedMotion ? {} : { rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={prefersReducedMotion ? {} : { rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} className="text-gray-700" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={prefersReducedMotion ? {} : { rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={prefersReducedMotion ? {} : { rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={24} className="text-gray-700" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {showSidebar && (
          <>
            {/* Backdrop Overlay - Z-Index: sidebar (40) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0"
              style={{ 
                zIndex: Z_INDEX.sidebar,
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)'
              }}
              onClick={toggleSidebar}
              aria-hidden="true"
            />

            {/* Sidebar Panel - Floating Glass Sheet */}
            {/* Z-Index: sidebar (40), slides over content */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={prefersReducedMotion ? { duration: 0.15 } : springConfig}
              className="fixed top-0 left-0 h-dvh pb-safe rounded-r-3xl overflow-hidden"
              style={{
                zIndex: Z_INDEX.sidebarPanel,
                width: '320px',
                maxWidth: '85vw',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(40px) saturate(200%)',
                WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                borderRight: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '8px 0 32px rgba(0, 0, 0, 0.15)'
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Menú de navegación"
            >
              {/* Content - Light Theme for Glass Panel */}
              <div className="relative h-full flex flex-col p-6 overflow-y-auto pt-safe">
                {/* Premium Member Card - Profile Section */}
                <motion.div
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-8 bg-white/60 backdrop-blur-md border border-gray-200/50 rounded-2xl p-6 shadow-lg relative overflow-hidden"
                >
                  {/* Subtle top glow accent */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent rounded-t-2xl" />
                  
                  {/* Profile Photo with Premium Ring */}
                  <div className="relative w-24 h-24 mx-auto mb-5">
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${newUser?.type === 'captain' ? 'from-emerald-500 to-green-600' : 'from-emerald-500 to-cyan-500'} p-1`}>
                      {newUser?.data?.profileImage ? (
                        <img 
                          src={newUser.data.profileImage} 
                          alt="Profile" 
                          className="w-full h-full rounded-full object-cover ring-2 ring-white"
                        />
                      ) : (
                        <div className={`w-full h-full rounded-full bg-gradient-to-br ${newUser?.type === 'captain' ? 'from-emerald-400 to-green-500' : 'from-emerald-400 to-cyan-500'} flex items-center justify-center`}>
                          <span className="text-4xl text-white font-black">
                            {newUser?.data?.fullname?.firstname?.[0] || 'U'}
                            {newUser?.data?.fullname?.lastname?.[0] || ''}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Online Indicator with glow */}
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-lg shadow-emerald-500/30" />
                  </div>

                  {/* Name & Email */}
                  <h1 className="text-center font-bold text-xl text-gray-900 mb-1.5">
                    {newUser?.data?.fullname?.firstname}{" "}
                    {newUser?.data?.fullname?.lastname}
                  </h1>
                  
                  {/* Star Rating - Under Profile */}
                  {(newUser?.data?.rating?.average || newUser?.data?.rating) && (
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <span className="text-yellow-500 text-lg">⭐</span>
                      <span className="text-base font-bold text-gray-800">
                        {(newUser?.data?.rating?.average || newUser?.data?.rating || 0).toFixed(1)}
                      </span>
                      {newUser?.data?.rating?.count > 0 && (
                        <span className="text-xs text-gray-500">
                          ({newUser.data.rating.count})
                        </span>
                      )}
                    </div>
                  )}
                  
                  <p className="text-center text-emerald-600 text-sm font-medium overflow-hidden text-ellipsis px-2">
                    {newUser?.data?.email}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-3 bg-emerald-50 rounded-lg py-2 px-3 border border-emerald-100">
                    <span className="text-xs text-emerald-700 font-semibold uppercase tracking-wide whitespace-nowrap">
                      {newUser?.type === 'captain' ? '🚗 Conductor' : '👤 Pasajero'}
                    </span>
                  </div>
                </motion.div>

                {/* Navigation Links */}
                <motion.nav
                  initial={prefersReducedMotion ? {} : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex-1 space-y-2"
                  aria-label="Navegación principal"
                >
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.to}
                      initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Link
                        to={item.to}
                        className="relative flex items-center justify-between py-3.5 px-4 cursor-pointer bg-white/50 hover:bg-white/80 border border-gray-200/50 hover:border-emerald-500/50 rounded-xl transition-all duration-200 group overflow-hidden"
                        onClick={toggleSidebar}
                      >
                        {/* Active indicator - vertical glow bar */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-l-xl" />
                        
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-all">
                            <item.icon size={20} className="text-emerald-600" />
                          </div>
                          <span className="text-gray-800 font-medium">{item.label}</span>
                        </div>
                        <ChevronRight size={20} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
                      </Link>
                    </motion.div>
                  ))}
                </motion.nav>

                {/* Logout Button */}
                <motion.button
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                  onClick={logout}
                  className="w-full mt-6 py-4 px-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <LogOut size={20} />
                  Cerrar Sesión
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
