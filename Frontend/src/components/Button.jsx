import { Link } from "react-router-dom";
import Spinner from "./Spinner";

// Premium animation classes with smooth cubic-bezier transitions
const ANIMATION_CLASSES = [
  "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
  "hover:shadow-[0_4px_14px_rgba(0,0,0,0.25)]",
  "active:scale-[0.97] active:brightness-95",
  "hover:-translate-y-px"
].join(" ");

// Premium gradient background
const DEFAULT_BG = "bg-gradient-to-b from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 shadow-[0_2px_8px_rgba(0,0,0,0.15)]";
const TEXT_COLOR = "text-white";

function Button({ path, title, icon, type, classes, fun, loading, loadingMessage, disabled }) {
  // Determine if custom classes are provided, use them instead of defaults
  const hasCustomStyling = classes && (classes.includes('bg-') || classes.includes('text-'));

  const baseClasses = !hasCustomStyling ? DEFAULT_BG : '';
  const textClasses = !hasCustomStyling ? TEXT_COLOR : '';

  return (
    <>
      {type == "link" ? (
        <Link
          to={path}
          className={`flex justify-center items-center gap-2 py-3 font-semibold w-full rounded-xl min-h-[48px] ${ANIMATION_CLASSES} ${baseClasses} ${textClasses} ${classes || ''}`}
        >
          {title} {icon}
        </Link>
      ) : (
        <button
          type={type || null}
          className={`py-3 font-semibold w-full flex justify-center items-center rounded-xl min-h-[48px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-800 ${ANIMATION_CLASSES} ${baseClasses} ${textClasses} ${classes || ''} ${loading && "cursor-not-allowed opacity-80 pointer-events-none"}`}
          onClick={fun}
          disabled={loading || disabled}
        >
          {loading ? <span className="flex gap-2 items-center"><Spinner />{loadingMessage}</span> : title}
        </button>
      )}
    </>
  );
}

export default Button;
