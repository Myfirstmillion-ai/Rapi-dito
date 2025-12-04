import { Link } from "react-router-dom";
import Spinner from "../Spinner";
import { cn } from "../../utils/cn";

const buttonVariants = {
  default: "bg-black hover:bg-zinc-800 text-white",
  primary: "bg-green-600 hover:bg-green-700 text-white",
  secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
  outline: "border-2 border-black hover:bg-black hover:text-white bg-transparent text-black",
  ghost: "hover:bg-gray-100 text-gray-900",
  danger: "bg-red-600 hover:bg-red-700 text-white",
};

const buttonSizes = {
  sm: "py-2 px-4 text-sm",
  md: "py-3 px-6",
  lg: "py-4 px-8 text-lg",
};

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
    "flex justify-center items-center gap-2 font-semibold rounded-lg transition-all duration-200",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "active:scale-[0.98]",
    fullWidth && "w-full",
    buttonSizes[size],
    buttonVariants[variant],
    loading && "cursor-not-allowed",
    classes
  );

  if (type === "link") {
    return (
      <Link to={path} className={baseClasses}>
        {title} {icon}
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
          {loadingMessage || "Loading..."}
        </span>
      ) : (
        <>
          {title}
          {icon}
        </>
      )}
    </button>
  );
}

export default Button;
