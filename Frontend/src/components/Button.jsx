import { Link } from "react-router-dom";
import Spinner from "./Spinner";

/**
 * Premium Button Component - Fintech/Super-App Standard
 * 
 * Features:
 * - Tactile Feedback: active:scale-95 with smooth transitions
 * - Depressing Shadow: Shadow reduces on press to simulate depth
 * - Minimum 44px touch target (Fintech accessibility standard)
 * - Smooth cubic-bezier easing for natural feel
 * - Focus states for keyboard navigation
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

// Premium Tactile Feedback - Fintech Standard
const TACTILE_FEEDBACK = [
  "transition-all duration-200 ease-out", // Faster, more responsive
  "active:scale-95", // Button depresses on press
  "active:shadow-inner", // Inset shadow on press for depth
  "hover:scale-[1.02]", // Subtle lift on hover
  "hover:shadow-lg", // Elevated shadow on hover
].join(" ");

// Default Premium Styling
const DEFAULT_BG = "bg-gradient-to-b from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 shadow-md";
const TEXT_COLOR = "text-white";

function Button({ path, title, icon, type, classes, fun, loading, loadingMessage, disabled }) {
  // Determine if custom classes are provided
  const hasCustomStyling = classes && (classes.includes('bg-') || classes.includes('text-'));

  const baseClasses = !hasCustomStyling ? DEFAULT_BG : '';
  const textClasses = !hasCustomStyling ? TEXT_COLOR : '';

  // Common classes for both link and button
  const commonClasses = `
    flex justify-center items-center gap-2 
    py-3 px-6 font-semibold w-full rounded-xl 
    min-h-[44px]
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
          {title} {icon}
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
            disabled:shadow-none
            focus:outline-none 
            focus-visible:ring-2 
            focus-visible:ring-emerald-500 
            focus-visible:ring-offset-2 
            focus-visible:ring-offset-slate-900
            ${loading ? "cursor-wait opacity-80 pointer-events-none" : ""}
          `.trim()}
          onClick={fun}
          disabled={loading || disabled}
          aria-busy={loading}
          aria-label={title}
        >
          {loading ? (
            <span className="flex gap-2 items-center">
              <Spinner size="sm" />
              {loadingMessage || "Cargando..."}
            </span>
          ) : (
            <>
              {title}
              {icon && <span aria-hidden="true">{icon}</span>}
            </>
          )}
        </button>
      )}
    </>
  );
}

export default Button;
