import { useState, useId } from "react";
import PropTypes from "prop-types";
import { Eye, EyeOff, Search, X, AlertCircle, Check } from "lucide-react";

/**
 * Swiss Minimalist Luxury Input Component
 * 
 * Design Philosophy:
 * - NO DEFAULT BORDERS: Clean, minimal design
 * - BACKGROUND: bg-gray-100 dark:bg-white/10
 * - FOCUS STATE: focus:ring-2 focus:ring-black dark:focus:ring-white
 * - HEIGHT: h-14 (56px) for massive touch targets
 * - TRANSITIONS: Smooth focus transitions
 * 
 * @param {string} label - Label text (above input or floating)
 * @param {string} type - Input type: text, email, password, tel, number, search
 * @param {string} name - Input name for form registration
 * @param {string} placeholder - Placeholder text
 * @param {string} value - Controlled value
 * @param {function} onChange - Change handler
 * @param {function} onFocus - Focus handler
 * @param {function} onBlur - Blur handler
 * @param {string} defaultValue - Default value for uncontrolled inputs
 * @param {function} register - React Hook Form register function
 * @param {object} error - Error object with message property
 * @param {string[]} options - Options for select type
 * @param {boolean} disabled - Disabled state
 * @param {boolean} fullWidth - Whether input takes full width
 * @param {React.ReactNode} icon - Left side icon
 * @param {React.ReactNode} iconRight - Right side icon
 * @param {string} helperText - Helper text below input
 * @param {boolean} floatingLabel - Use floating label style
 * @param {boolean} required - Required field indicator
 * @param {boolean} valid - Show valid state (green checkmark)
 * @param {string} className - Additional classes
 */

function Input({ 
  label, 
  type = "text",
  name, 
  placeholder, 
  value,
  onChange,
  onFocus,
  onBlur,
  defaultValue, 
  register, 
  error, 
  options, 
  disabled,
  fullWidth = true,
  icon,
  iconRight,
  helperText,
  floatingLabel = false,
  required = false,
  valid = false,
  className
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value || defaultValue || "");
  const generatedId = useId();
  const inputId = name || generatedId;
  
  // Determine actual input type (for password visibility toggle)
  const actualType = type === "password" && showPassword ? "text" : type;
  
  // Check if has value for floating label
  const hasValue = value !== undefined ? !!value : !!localValue;
  const isFloatingActive = floatingLabel && (isFocused || hasValue);
  
  // Determine if input is controlled
  const isControlled = value !== undefined;
  
  // Handle password visibility toggle
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Handle search clear
  const handleSearchClear = () => {
    if (onChange) {
      onChange({ target: { name, value: "" } });
    }
    // Only update local state if uncontrolled
    if (!isControlled) {
      setLocalValue("");
    }
  };
  
  // Determine if we need to add icon padding
  const hasLeftIcon = !!icon || type === "search";
  const hasRightIcon = !!iconRight || type === "password" || (type === "search" && hasValue) || valid || error;
  
  // Base input classes - Swiss Minimalist style
  const inputBaseClasses = `
    w-full h-14
    bg-gray-100 dark:bg-white/10
    ${hasLeftIcon ? "pl-12" : "px-5"} 
    ${hasRightIcon ? "pr-12" : "px-5"}
    py-4
    rounded-2xl
    border-0 outline-none
    text-base text-gray-900 dark:text-white
    placeholder:text-gray-400 dark:placeholder:text-gray-500
    transition-all duration-200 ease-out
    focus:ring-2 focus:ring-black dark:focus:ring-white
    focus:bg-white dark:focus:bg-white/20
    ${disabled ? "cursor-not-allowed select-none opacity-60 bg-gray-200 dark:bg-gray-800" : ""}
    ${error ? "ring-2 ring-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10" : ""}
    ${valid && !error ? "ring-1 ring-emerald-500" : ""}
    ${floatingLabel ? "pt-6" : ""}
    ${className || ""}
  `.trim().replace(/\s+/g, ' ');
  
  // Handle internal value changes
  const handleChange = (e) => {
    // Only update local state if uncontrolled
    if (!isControlled) {
      setLocalValue(e.target.value);
    }
    if (onChange) {
      onChange(e);
    }
  };
  
  // Handle focus/blur for floating label
  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };
  
  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };
  
  // Render left icon
  const renderLeftIcon = () => {
    const iconElement = type === "search" ? <Search className="w-5 h-5" /> : icon;
    if (!iconElement) return null;
    
    return (
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        {iconElement}
      </div>
    );
  };
  
  // Render right icon
  const renderRightIcon = () => {
    // Password toggle
    if (type === "password") {
      return (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-full p-1 transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      );
    }
    
    // Search clear button
    if (type === "search" && hasValue) {
      return (
        <button
          type="button"
          onClick={handleSearchClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-full p-1 transition-colors"
          aria-label="Clear search"
          tabIndex={-1}
        >
          <X className="w-5 h-5" />
        </button>
      );
    }
    
    // Validation icons
    if (error) {
      return (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500">
          <AlertCircle className="w-5 h-5" />
        </div>
      );
    }
    
    if (valid) {
      return (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500">
          <Check className="w-5 h-5" />
        </div>
      );
    }
    
    // Custom right icon
    if (iconRight) {
      return (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {iconRight}
        </div>
      );
    }
    
    return null;
  };
  
  // Render floating label
  const renderFloatingLabel = () => {
    if (!floatingLabel || !label) return null;
    
    return (
      <label
        htmlFor={inputId}
        className={`
          absolute left-4 transition-all duration-200 pointer-events-none
          ${hasLeftIcon ? "left-12" : "left-5"}
          ${isFloatingActive 
            ? "top-2 text-xs text-emerald-500 font-medium" 
            : "top-1/2 -translate-y-1/2 text-base text-gray-400"
          }
        `.trim().replace(/\s+/g, ' ')}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    );
  };
  
  // Build register props if available
  const registerProps = register ? register(name) : {};
  
  // Common input props
  const inputProps = {
    id: inputId,
    name,
    disabled,
    className: inputBaseClasses,
    "aria-invalid": error ? "true" : "false",
    "aria-describedby": error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined,
    "aria-required": required || undefined,
    onFocus: handleFocus,
    onBlur: handleBlur,
    ...(register ? registerProps : { 
      value: value !== undefined ? value : localValue,
      onChange: handleChange 
    }),
  };

  return (
    <div className={`my-3 ${fullWidth ? 'w-full' : 'w-auto'}`}>
      {/* Traditional label (non-floating) */}
      {label && !floatingLabel && (
        <label 
          htmlFor={inputId} 
          className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Input container */}
      <div className="relative">
        {/* Left icon */}
        {renderLeftIcon()}
        
        {/* Floating label */}
        {renderFloatingLabel()}
        
        {type === "select" ? (
          <select
            {...inputProps}
            defaultValue={defaultValue}
          >
            {options?.map((option) => (
              <option 
                key={option} 
                value={option.toLowerCase()} 
                className="bg-white dark:bg-gray-900"
              >
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            {...inputProps}
            type={actualType}
            placeholder={floatingLabel ? "" : (placeholder || label)}
            defaultValue={!register ? undefined : defaultValue}
          />
        )}
        
        {/* Right icon */}
        {renderRightIcon()}
      </div>
      
      {/* Helper text */}
      {helperText && !error && (
        <p 
          id={`${inputId}-helper`} 
          className="mt-2 text-xs text-gray-500 dark:text-gray-400"
        >
          {helperText}
        </p>
      )}
      
      {/* Error message */}
      {error && (
        <p 
          id={`${inputId}-error`} 
          className="mt-2 text-sm text-red-500 dark:text-red-400 flex items-center gap-1 animate-fade-in"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error.message}</span>
        </p>
      )}
    </div>
  );
}

// PropTypes for type checking and documentation
Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.oneOf(["text", "email", "password", "tel", "number", "search", "select"]),
  name: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  register: PropTypes.func, // React Hook Form register
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  options: PropTypes.arrayOf(PropTypes.string), // For select type
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.node,
  iconRight: PropTypes.node,
  helperText: PropTypes.string,
  floatingLabel: PropTypes.bool,
  required: PropTypes.bool,
  valid: PropTypes.bool,
  className: PropTypes.string,
};

Input.defaultProps = {
  type: "text",
  fullWidth: true,
  floatingLabel: false,
  required: false,
  valid: false,
  disabled: false,
};

export default Input;
