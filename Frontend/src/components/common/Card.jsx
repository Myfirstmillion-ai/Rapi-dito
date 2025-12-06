import { cn } from "../../utils/cn";

/**
 * UBER-style Card Component
 * 
 * Features:
 * - White background with rounded corners (rounded-2xl)
 * - Subtle shadow that increases on hover
 * - 24px padding (UBER standard)
 * - Variants: default, elevated, interactive
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.padding - Apply default padding (default: true)
 * @param {boolean} props.hoverable - Enable hover effects (default: false)
 * @param {string} props.variant - Card variant: 'default', 'elevated', 'interactive'
 */
function Card({ 
  children, 
  className, 
  padding = true, 
  hoverable = false,
  variant = "default"
}) {
  const variantClasses = {
    default: "shadow-uber-sm",
    elevated: "shadow-uber-md",
    interactive: "shadow-uber-sm hover:shadow-uber-lg cursor-pointer",
  };

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-uber-gray-200",
        "transition-all duration-200",
        padding && "p-6", // 24px padding (UBER standard)
        hoverable && "hover:shadow-uber-md",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </div>
  );
}

export default Card;

