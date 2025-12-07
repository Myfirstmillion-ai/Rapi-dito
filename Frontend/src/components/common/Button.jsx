import { Link } from "react-router-dom";
import Spinner from "../Spinner";
import { cn } from "../../utils/cn";

// UBER-style button variants - Premium edition with gradients and depth
const buttonVariants = {
  default: [
    "bg-gradient-to-b from-gray-900 to-black text-uber-white",
    "shadow-[0_2px_8px_rgba(0,0,0,0.15)]",
    "hover:from-gray-800 hover:to-gray-900",
    "hover:shadow-[0_4px_12px_rgba(0,0,0,0.25)]",
    "hover:-translate-y-px"
  ].join(" "),
  primary: [
    "bg-gradient-to-b from-emerald-500 to-emerald-600 text-uber-white",
    "shadow-[0_2px_8px_rgba(5,163,87,0.25)]",
    "hover:from-emerald-400 hover:to-emerald-500",
    "hover:shadow-[0_4px_14px_rgba(5,163,87,0.35)]",
    "hover:-translate-y-px"
  ].join(" "),
  secondary: [
    "bg-gradient-to-b from-gray-50 to-gray-100 text-uber-black",
    "border border-gray-200",
    "shadow-[0_1px_3px_rgba(0,0,0,0.05)]",
    "hover:from-gray-100 hover:to-gray-150",
    "hover:shadow-[0_2px_6px_rgba(0,0,0,0.08)]",
    "hover:border-gray-300"
  ].join(" "),
  outline: [
    "border-2 border-uber-black bg-transparent text-uber-black",
    "hover:bg-uber-black hover:text-uber-white",
    "hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
  ].join(" "),
  ghost: [
    "bg-transparent text-uber-black",
    "hover:bg-gray-100/80"
  ].join(" "),
  danger: [
    "bg-gradient-to-b from-red-500 to-red-600 text-uber-white",
    "shadow-[0_2px_8px_rgba(205,10,41,0.25)]",
    "hover:from-red-400 hover:to-red-500",
    "hover:shadow-[0_4px_14px_rgba(205,10,41,0.35)]",
    "hover:-translate-y-px"
  ].join(" "),
  success: [
    "bg-gradient-to-b from-emerald-500 to-emerald-600 text-uber-white",
    "shadow-[0_2px_8px_rgba(5,163,87,0.25)]",
    "hover:from-emerald-400 hover:to-emerald-500",
    "hover:shadow-[0_4px_14px_rgba(5,163,87,0.35)]",
    "hover:-translate-y-px"
  ].join(" "),
};

// UBER button sizes with minimum 48px height for default/md
const buttonSizes = {
  sm: "py-2 px-4 text-sm min-h-touch", // 44px minimum for touch targets
  md: "py-3 px-6 min-h-button", // 48px UBER standard
  lg: "py-4 px-8 text-lg min-h-[56px]",
};

/**
 * UBER-style Button Component
 * 
 * Features:
 * - Minimum 48px height (UBER standard)
 * - Active state with scale(0.98)
 * - 200ms transitions
 * - Multiple variants and sizes
 * - Loading state with spinner
 * - Support for icons
 * 
 * @param {Object} props
 * @param {string} props.path - Link path (when type="link")
 * @param {string} props.title - Button text
 * @param {React.ReactNode} props.icon - Optional icon element
 * @param {string} props.type - button type or "link"
 * @param {string} props.classes - Additional CSS classes
 * @param {Function} props.fun - onClick handler
 * @param {boolean} props.loading - Loading state
 * @param {string} props.loadingMessage - Loading text
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.variant - Button variant (default, primary, secondary, outline, ghost, danger, success)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {boolean} props.fullWidth - Full width button (default: true)
 */
function Button({ 
  path, 
  title, 
  icon, 
  type, 
  classes, 
  fun, 
  loading, 
  loadingMessage, 
  disabled,
  variant = "default",
  size = "md",
  fullWidth = true
}) {
  const baseClasses = cn(
    // Base layout and typography
    "flex justify-center items-center gap-2 font-semibold rounded-xl",
    // Premium smooth transitions with cubic-bezier
    "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
    // Disabled state
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none",
    // Tactile press feedback
    "active:scale-[0.97] active:brightness-95",
    // Accessible focus state
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-uber-black",
    // Conditional classes
    fullWidth && "w-full",
    buttonSizes[size],
    buttonVariants[variant],
    loading && "cursor-not-allowed opacity-80 pointer-events-none",
    classes
  );

  if (type === "link") {
    return (
      <Link to={path} className={baseClasses}>
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {title}
      </Link>
    );
  }

  return (
    <button
      type={type || "button"}
      className={baseClasses}
      onClick={fun}
      disabled={loading || disabled}
    >
      {loading ? (
        <span className="flex gap-2 items-center">
          <Spinner />
          {loadingMessage || "Cargando..."}
        </span>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {title}
        </>
      )}
    </button>
  );
}

export default Button;

