import { Link } from "react-router-dom";
import Spinner from "./Spinner";

/**
 * Ultra-Premium Button Component - Apple/Fintech Standard
 * 
 * Features:
 * - PILL SHAPE: Fully rounded capsule design (rounded-full)
 * - FULL-WIDTH: Takes up available space for easy thumb access
 * - MASSIVE PADDING: 16px+ for "expensive" feel
 * - Tactile Feedback: Depresses on press with shadow depth
 * - Minimum 56px touch target (Apple HIG standard)
 * 
 * @param {string} path - Link destination (for type="link")
 * @param {string} title - Button text
 * @param {React.ReactNode} icon - Optional icon element
 * @param {string} type - "link", "submit", or button (default)
 * @param {string} classes - Additional Tailwind classes
 * @param {function} fun - onClick handler
 * @param {boolean} loading - Loading state
 * @param {string} loadingMessage - Text to show when loading
 * @param {boolean} disabled - Disabled state
 */

// Ultra-Premium Tactile Feedback - Apple Standard
const TACTILE_FEEDBACK = [
  "transition-all duration-200 ease-out",
  "active:scale-[0.97]", // Slightly more press
  "active:shadow-inner",
  "hover:scale-[1.01]", // Subtle lift
  "hover:shadow-xl",
  "hover:brightness-105",
].join(" ");

// Premium Pill Shape - Full Rounded
const PILL_SHAPE = "rounded-full"; // Capsule shape

// Default Premium Styling - Full Width & Tall
const DEFAULT_BG = "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 shadow-lg";
const TEXT_COLOR = "text-white";

function Button({ path, title, icon, type, classes, fun, loading, loadingMessage, disabled }) {
  // Determine if custom classes are provided
  const hasCustomStyling = classes && (classes.includes('bg-') || classes.includes('text-'));

  const baseClasses = !hasCustomStyling ? DEFAULT_BG : '';
  const textClasses = !hasCustomStyling ? TEXT_COLOR : '';

  // Common classes - PILL SHAPE with generous padding
  const commonClasses = `
    flex justify-center items-center gap-3
    py-5 px-8 font-bold text-base w-full
    ${PILL_SHAPE}
    min-h-[56px]
    ${TACTILE_FEEDBACK} 
    ${baseClasses} 
    ${textClasses} 
    ${classes || ''}
  `.trim();

  return (
    <>
      {type === "link" ? (
        <Link
          to={path}
          className={commonClasses}
          aria-label={title}
        >
          {icon && <span aria-hidden="true">{icon}</span>}
          {title}
        </Link>
      ) : (
        <button
          type={type || "button"}
          className={`
            ${commonClasses}
            cursor-pointer
            disabled:opacity-50 
            disabled:cursor-not-allowed 
            disabled:active:scale-100
            disabled:hover:scale-100
            disabled:shadow-md
            disabled:brightness-100
            focus:outline-none 
            focus-visible:ring-4
            focus-visible:ring-emerald-400/50
            focus-visible:ring-offset-2 
            focus-visible:ring-offset-slate-900
            ${loading ? "cursor-wait opacity-90" : ""}
          `.trim()}
          onClick={fun}
          disabled={loading || disabled}
          aria-busy={loading}
          aria-label={title}
        >
          {loading ? (
            <span className="flex gap-3 items-center">
              <Spinner size="sm" />
              <span className="font-bold">{loadingMessage || "Cargando..."}</span>
            </span>
          ) : (
            <>
              {icon && <span aria-hidden="true">{icon}</span>}
              <span className="font-bold tracking-wide">{title}</span>
            </>
          )}
        </button>
      )}
    </>
  );
}

export default Button;
