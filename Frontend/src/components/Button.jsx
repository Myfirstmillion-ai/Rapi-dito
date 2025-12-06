import { Link } from "react-router-dom";
import Spinner from "./Spinner";

function Button({ path, title, icon, type, classes, fun, loading, loadingMessage, disabled }) {
  // Determine if custom classes are provided, use them instead of defaults
  const hasCustomStyling = classes && (classes.includes('bg-') || classes.includes('text-'));
  
  return (
    <>
      {type == "link" ? (
        <Link
          to={path}
          className={`flex justify-center items-center gap-2 py-3 font-semibold w-full rounded-lg ${!hasCustomStyling ? 'bg-black text-white' : ''} ${classes || ''}`}
        >
          {" "}
          {title} {icon}
        </Link>
      ) : (
        <button
          type={type || null}
          className={`py-3 font-semibold w-full flex justify-center items-center rounded-lg cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed ${!hasCustomStyling ? 'bg-black text-white' : ''} ${classes || ''} ${loading && "cursor-not-allowed"}`}
          onClick={fun}
          disabled={loading || disabled}
        >
          {loading ? <span className="flex gap-1"><Spinner />{loadingMessage}</span> : title}
        </button>
      )}
    </>
  );
}

export default Button;
