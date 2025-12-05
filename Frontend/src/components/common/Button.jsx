import { Link } from "react-router-dom";
import Spinner from "../Spinner";
import { cn } from "../../utils/cn";

// UBER-style button variants
const buttonVariants = {
  default: "bg-uber-black hover:bg-uber-gray-700 text-uber-white shadow-uber-sm hover:shadow-uber-md",
  primary: "bg-uber-green hover:bg-green-700 text-uber-white shadow-uber-sm hover:shadow-uber-md",
  secondary: "bg-uber-gray-100 hover:bg-uber-gray-200 text-uber-black",
  outline: "border-2 border-uber-black hover:bg-uber-black hover:text-uber-white bg-transparent text-uber-black",
  ghost: "hover:bg-uber-gray-100 text-uber-black",
  danger: "bg-uber-red hover:bg-red-700 text-uber-white shadow-uber-sm hover:shadow-uber-md",
  success: "bg-uber-green hover:bg-green-700 text-uber-white shadow-uber-sm hover:shadow-uber-md",
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
    "flex justify-center items-center gap-2 font-semibold rounded-uber-md transition-all duration-200",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "active:scale-[0.98]", // UBER interaction feedback
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-uber-black",
    fullWidth && "w-full",
    buttonSizes[size],
    buttonVariants[variant],
    loading && "cursor-not-allowed opacity-80",
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

