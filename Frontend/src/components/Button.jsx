import { Link } from "react-router-dom";
import Spinner from "./Spinner";

/**
 * Swiss Minimalist Luxury Button Component
 * 
 * Design Philosophy:
 * - NO BORDERS: Clean, borderless design
 * - PILL SHAPE: Fully rounded capsule design (rounded-full)
 * - VARIANTS: primary (Emerald Gradient), secondary (White/Black shadow), danger (Red), ghost (Transparent)
 * - SIZES: sm (40px), md (48px), lg (56px)
 * - TACTILE FEEDBACK: active:scale-95 transition-transform duration-200
 * 
 * @param {string} path - Link destination (for type="link")
 * @param {string} title - Button text
 * @param {React.ReactNode} icon - Optional icon element (left side)
 * @param {React.ReactNode} iconRight - Optional icon element (right side)
 * @param {string} type - "link", "submit", or button (default)
 * @param {string} variant - "primary" (default), "secondary", "danger", "ghost"
 * @param {string} size - "sm", "md" (default), "lg"
 * @param {boolean} fullWidth - Whether button takes full width
 * @param {string} classes - Additional Tailwind classes (deprecated: use className)
 * @param {string} className - Additional Tailwind classes
 * @param {function} fun - onClick handler (deprecated: use onClick)
 * @param {function} onClick - Click handler
 * @param {boolean} loading - Loading state
 * @param {string} loadingMessage - Text to show when loading
 * @param {boolean} disabled - Disabled state
 * @param {React.ReactNode} children - Button content (alternative to title)
 */

// Swiss Minimalist Tactile Feedback - MUST include active:scale-95
const TACTILE_FEEDBACK = "transition-all duration-200 active:scale-95 hover:scale-[1.02]";

// Pill Shape - No borders
const PILL_SHAPE = "rounded-full border-0";

// Variant Styles
const VARIANTS = {
  // Primary: Emerald Gradient - Premium CTA
  primary: [
    "bg-gradient-to-r from-emerald-500 to-emerald-600",
    "hover:from-emerald-600 hover:to-emerald-700",
    "text-white font-semibold",
    "shadow-lg hover:shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30",
  ].join(" "),
  
  // Secondary: White/Black with shadow - Subtle actions
  secondary: [
    "bg-white dark:bg-gray-900",
    "text-gray-900 dark:text-white font-semibold",
    "shadow-lg hover:shadow-xl",
    "border border-gray-200 dark:border-gray-700",
    "hover:bg-gray-50 dark:hover:bg-gray-800",
    "hover:border-gray-300 dark:hover:border-gray-600",
  ].join(" "),
  
  // Danger: Red - Destructive actions
  danger: [
    "bg-red-500 dark:bg-red-600",
    "hover:bg-red-600 dark:hover:bg-red-700",
    "text-white font-bold",
    "shadow-lg hover:shadow-xl shadow-red-500/20 hover:shadow-red-500/30",
  ].join(" "),
  
  // Ghost: Transparent - Subtle/tertiary actions
  ghost: [
    "bg-transparent",
    "text-gray-700 dark:text-gray-300",
    "hover:bg-gray-100 dark:hover:bg-gray-800",
    "active:bg-gray-200 dark:active:bg-gray-700",
  ].join(" "),
};

// Size Styles
const SIZES = {
  sm: {
    height: "h-10",
    padding: "px-4",
    text: "text-sm font-medium",
    iconSize: "w-4 h-4",
  },
  md: {
    height: "h-12",
    padding: "px-6",
    text: "text-base font-semibold",
    iconSize: "w-5 h-5",
  },
  lg: {
    height: "h-14",
    padding: "px-8",
    text: "text-lg font-bold",
    iconSize: "w-6 h-6",
  },
};

function Button({ 
  path, 
  title,
  children,
  icon, 
  iconRight,
  type, 
  variant = "primary",
  size = "md",
  fullWidth = true,
  classes,
  className,
  fun,
  onClick,
  loading, 
  loadingMessage, 
  disabled 
}) {
  // Get variant styles or fallback to primary
  const variantClasses = VARIANTS[variant] || VARIANTS.primary;
  const sizeConfig = SIZES[size] || SIZES.md;
  
  // Support both legacy props and new props
  const handleClick = onClick || fun;
  const customClasses = className || classes || '';
  const buttonContent = children || title;

  // Common classes - PILL SHAPE with generous padding
  const commonClasses = `
    flex justify-center items-center gap-3
    ${sizeConfig.padding} ${sizeConfig.text}
    ${fullWidth ? 'w-full' : 'w-auto'}
    ${PILL_SHAPE}
    ${sizeConfig.height}
    ${TACTILE_FEEDBACK}
    ${variantClasses}
    ${customClasses}
  `.trim().replace(/\s+/g, ' ');

  // Render icon with proper sizing
  const renderIcon = (iconElement, position) => {
    if (!iconElement) return null;
    return (
      <span 
        className={`${sizeConfig.iconSize} flex-shrink-0`} 
        aria-hidden="true"
        data-position={position}
      >
        {iconElement}
      </span>
    );
  };

  // Button content renderer
  const renderContent = () => {
    if (loading) {
      return (
        <span className="flex gap-3 items-center">
          <Spinner size={size === 'lg' ? 'md' : 'sm'} />
          <span>{loadingMessage || "Cargando..."}</span>
        </span>
      );
    }
    
    return (
      <>
        {renderIcon(icon, 'left')}
        {buttonContent && <span className="tracking-wide">{buttonContent}</span>}
        {renderIcon(iconRight, 'right')}
      </>
    );
  };

  if (type === "link") {
    return (
      <Link
        to={path}
        className={commonClasses}
        aria-label={typeof buttonContent === 'string' ? buttonContent : undefined}
      >
        {renderContent()}
      </Link>
    );
  }

  return (
    <button
      type={type || "button"}
      className={`
        ${commonClasses}
        cursor-pointer
        disabled:opacity-60
        disabled:bg-gray-300 dark:disabled:bg-gray-700
        disabled:text-gray-500 dark:disabled:text-gray-400
        disabled:shadow-none
        disabled:cursor-not-allowed 
        disabled:active:scale-100
        disabled:hover:scale-100
        focus:outline-none 
        focus-visible:ring-2
        focus-visible:ring-emerald-500
        focus-visible:ring-offset-2
        ${loading ? "cursor-wait" : ""}
      `.trim().replace(/\s+/g, ' ')}
      onClick={handleClick}
      disabled={loading || disabled}
      aria-busy={loading || undefined}
      aria-disabled={disabled || undefined}
      aria-label={typeof buttonContent === 'string' ? buttonContent : undefined}
    >
      {renderContent()}
    </button>
  );
}

export default Button;
