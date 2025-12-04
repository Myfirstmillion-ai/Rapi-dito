import { cn } from "../../utils/cn";

function Card({ children, className, padding = true, hoverable = false }) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm border border-gray-100",
        padding && "p-4",
        hoverable && "hover:shadow-md transition-shadow duration-200",
        className
      )}
    >
      {children}
    </div>
  );
}

export default Card;
