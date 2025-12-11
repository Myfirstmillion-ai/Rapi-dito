import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Map,
  User,
  Settings,
  MessageSquare,
  Bell,
  History,
  Plus,
  X,
} from "lucide-react";
import { useState, useMemo } from "react";
import { SPRING, triggerHaptic, prefersReducedMotion } from "../styles/swissLuxury";

/**
 * CommandDock - Swiss Luxury Minimalist iOS Style
 *
 * Premium navigation dock with:
 * - Floating island design
 * - Light/Dark mode support
 * - Expandable quick actions
 * - Physics-based animations
 * - Haptic feedback
 */

// Main navigation items
const mainNavItems = [
  { id: "home", icon: Home, label: "Inicio" },
  { id: "map", icon: Map, label: "Mapa" },
  { id: "messages", icon: MessageSquare, label: "Mensajes", badge: 3 },
  { id: "profile", icon: User, label: "Perfil" },
];

// Quick action items (expandable menu)
const quickActions = [
  { id: "history", icon: History, label: "Historial" },
  { id: "notifications", icon: Bell, label: "Alertas", badge: 5 },
  { id: "settings", icon: Settings, label: "Ajustes" },
];

function CommandDock({
  activeTab = "home",
  onTabChange,
  onQuickAction,
  hideLabels = false,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const reducedMotion = useMemo(() => prefersReducedMotion(), []);

  const handleTabChange = (tabId) => {
    triggerHaptic("medium");
    onTabChange?.(tabId);
  };

  const handleQuickAction = (actionId) => {
    triggerHaptic("heavy");
    onQuickAction?.(actionId);
    setIsExpanded(false);
  };

  const toggleExpanded = () => {
    triggerHaptic(isExpanded ? "light" : "heavy");
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Expanded Quick Actions Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleExpanded}
              className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            />

            {/* Quick Actions Menu */}
            <div className="absolute bottom-32 left-0 right-0 flex justify-center px-4">
              <motion.div
                initial={reducedMotion ? {} : { scale: 0.8, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={reducedMotion ? {} : { scale: 0.8, y: 20, opacity: 0 }}
                transition={SPRING.snappy}
                className="rounded-3xl p-4 bg-white dark:bg-[#1C1C1E] border border-gray-200 dark:border-gray-800"
                style={{
                  boxShadow:
                    "0 16px 32px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)",
                  maxWidth: "320px",
                }}
              >
                {/* Quick Actions Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {quickActions.map((action, index) => (
                    <QuickActionButton
                      key={action.id}
                      action={action}
                      onClick={() => handleQuickAction(action.id)}
                      delay={index * 0.05}
                      reducedMotion={reducedMotion}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Command Dock - Floating Island */}
      <motion.div
        initial={reducedMotion ? {} : { y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={SPRING.snappy}
        className="fixed bottom-4 left-4 right-4 z-50 flex justify-center"
        style={{
          paddingBottom: "max(0px, env(safe-area-inset-bottom))",
        }}
      >
        <div
          className="rounded-[28px] px-4 py-3 flex items-center gap-1 bg-white dark:bg-[#1C1C1E] border border-gray-200 dark:border-gray-800"
          style={{
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* Main Navigation Items */}
          {mainNavItems.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              isActive={activeTab === item.id}
              isHovered={hoveredItem === item.id}
              onClick={() => handleTabChange(item.id)}
              onHoverStart={() => setHoveredItem(item.id)}
              onHoverEnd={() => setHoveredItem(null)}
              hideLabel={hideLabels}
              reducedMotion={reducedMotion}
            />
          ))}

          {/* Divider */}
          <div className="w-px h-10 mx-1 bg-gray-200 dark:bg-gray-700" />

          {/* Expand Button */}
          <motion.button
            whileHover={reducedMotion ? {} : { scale: 1.1 }}
            whileTap={reducedMotion ? {} : { scale: 0.9 }}
            onClick={toggleExpanded}
            className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
              isExpanded
                ? "bg-emerald-500"
                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            style={
              isExpanded
                ? { boxShadow: "0 4px 16px rgba(16, 185, 129, 0.35)" }
                : {}
            }
          >
            <AnimatePresence mode="wait">
              {isExpanded ? (
                <motion.div
                  key="close"
                  initial={reducedMotion ? {} : { rotate: -90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  exit={reducedMotion ? {} : { rotate: 90, scale: 0 }}
                  transition={SPRING.snappy}
                >
                  <X size={18} className="text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="plus"
                  initial={reducedMotion ? {} : { rotate: 90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  exit={reducedMotion ? {} : { rotate: -90, scale: 0 }}
                  transition={SPRING.snappy}
                >
                  <Plus size={18} className="text-gray-600 dark:text-gray-400" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pulse indicator */}
            {!isExpanded && (
              <motion.div
                className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.6, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ boxShadow: "0 0 8px rgba(16, 185, 129, 0.6)" }}
              />
            )}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}

/**
 * NavButton - Individual navigation button
 */
function NavButton({
  item,
  isActive,
  isHovered,
  onClick,
  onHoverStart,
  onHoverEnd,
  hideLabel,
  reducedMotion,
}) {
  const Icon = item.icon;

  return (
    <motion.button
      whileHover={reducedMotion ? {} : { scale: 1.05 }}
      whileTap={reducedMotion ? {} : { scale: 0.95 }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center gap-0.5 min-w-[52px] py-2 px-2 rounded-xl transition-colors ${
        isActive
          ? "bg-emerald-50 dark:bg-emerald-900/30"
          : isHovered
          ? "bg-gray-100 dark:bg-gray-800"
          : ""
      }`}
    >
      {/* Icon Container */}
      <div className="relative">
        <Icon
          size={20}
          strokeWidth={isActive ? 2.5 : 2}
          className={
            isActive
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-gray-500 dark:text-gray-400"
          }
        />

        {/* Badge */}
        {item.badge && (
          <motion.div
            initial={reducedMotion ? {} : { scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-1 bg-emerald-500"
            style={{ boxShadow: "0 2px 8px rgba(16, 185, 129, 0.4)" }}
          >
            <span className="text-[9px] font-bold text-white">
              {item.badge > 9 ? "9+" : item.badge}
            </span>
          </motion.div>
        )}
      </div>

      {/* Label */}
      {!hideLabel && (
        <span
          className={`text-[9px] font-semibold ${
            isActive
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-gray-500 dark:text-gray-500"
          }`}
        >
          {item.label}
        </span>
      )}

      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-emerald-500"
          transition={SPRING.snappy}
        />
      )}
    </motion.button>
  );
}

/**
 * QuickActionButton - Button in expanded menu
 */
function QuickActionButton({ action, onClick, delay, reducedMotion }) {
  const Icon = action.icon;

  return (
    <motion.button
      initial={reducedMotion ? {} : { scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={reducedMotion ? {} : { scale: 0, opacity: 0 }}
      transition={{ ...SPRING.snappy, delay }}
      whileHover={reducedMotion ? {} : { scale: 1.05 }}
      whileTap={reducedMotion ? {} : { scale: 0.95 }}
      onClick={onClick}
      className="relative flex flex-col items-center justify-center gap-2 py-4 rounded-2xl bg-gray-50 dark:bg-[#2C2C2E] hover:bg-gray-100 dark:hover:bg-[#3C3C3E] border border-gray-200 dark:border-gray-700 transition-colors"
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
        <Icon size={18} className="text-gray-600 dark:text-gray-400" />
      </div>

      {/* Label */}
      <span className="text-[10px] font-semibold px-2 text-center text-gray-600 dark:text-gray-400">
        {action.label}
      </span>

      {/* Badge */}
      {action.badge && (
        <motion.div
          initial={reducedMotion ? {} : { scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1.5 bg-emerald-500"
          style={{ boxShadow: "0 2px 8px rgba(16, 185, 129, 0.4)" }}
        >
          <span className="text-[9px] font-bold text-white">
            {action.badge > 9 ? "9+" : action.badge}
          </span>
        </motion.div>
      )}
    </motion.button>
  );
}

export default CommandDock;
