import { useState } from "react";
import { cn } from "../../utils/cn";
import { Check, AlertCircle } from "lucide-react";

/**
 * UBER-style Input Component
 * 
 * Features:
 * - 16px padding (UBER standard)
 * - Focus: black border with subtle ring
 * - Validation states (error/success)
 * - Optional icon on the left
 * - Error message display
 * - Floating label support
 * 
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {string} props.type - Input type
 * @param {string} props.name - Input name
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.defaultValue - Default value
 * @param {Function} props.register - React Hook Form register
 * @param {Object} props.error - Error object from validation
 * @param {Array} props.options - Options for select
 * @param {boolean} props.disabled - Disabled state
 * @param {Component} props.icon - Icon component (lucide-react)
 * @param {boolean} props.floatingLabel - Use floating label
 * @param {boolean} props.success - Success state
 */
function Input({ 
  label, 
  type, 
  name, 
  placeholder, 
  defaultValue, 
  register, 
  error, 
  options, 
  disabled,
  icon: Icon,
  floatingLabel = false,
  success = false
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!defaultValue);

  const inputClasses = cn(
    "w-full bg-uber-gray-50 rounded-uber-md outline-none text-base transition-all duration-200",
    "px-4 py-4", // 16px padding (UBER standard)
    "focus:bg-white focus:ring-2 focus:ring-uber-black focus:border-transparent",
    floatingLabel ? "pt-6 pb-2" : "py-4",
    disabled && "cursor-not-allowed select-none text-uber-gray-400 bg-uber-gray-100",
    error && "ring-2 ring-uber-red bg-red-50 focus:ring-uber-red",
    success && !error && "ring-2 ring-uber-green bg-green-50 focus:ring-uber-green",
    Icon && "pl-12"
  );

  const labelClasses = cn(
    "font-semibold transition-all duration-200",
    floatingLabel && "absolute left-4 pointer-events-none",
    floatingLabel && (isFocused || hasValue) 
      ? "text-xs top-2 text-uber-black" 
      : "text-sm top-5 text-uber-gray-500",
    !floatingLabel && "text-uber-black mb-2 block"
  );

  const handleChange = (e) => {
    setHasValue(e.target.value.length > 0);
  };

  if (type === "select") {
    return (
      <div className="my-2">
        {!floatingLabel && <label className={labelClasses}>{label}</label>}
        <div className="relative">
          {floatingLabel && <label className={labelClasses}>{label}</label>}
          <select
            {...register(name)}
            defaultValue={defaultValue}
            className={inputClasses}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleChange}
          >
            {options.map((option) => (
              <option key={option} value={option.toLowerCase()} className="w-full">
                {option}
              </option>
            ))}
          </select>
          {/* Validation icon for select */}
          {success && !error && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Check size={20} className="text-uber-green" />
            </div>
          )}
          {error && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <AlertCircle size={20} className="text-uber-red" />
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-uber-red mt-1.5 ml-1 flex items-center gap-1">
            <AlertCircle size={12} />
            {error.message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="my-2">
      {!floatingLabel && <label className={labelClasses}>{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-uber-gray-500">
            <Icon size={20} />
          </div>
        )}
        {floatingLabel && <label className={labelClasses}>{label}</label>}
        <input
          {...register(name)}
          type={type || "text"}
          placeholder={floatingLabel ? "" : (placeholder || label)}
          className={inputClasses}
          disabled={disabled}
          defaultValue={defaultValue}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
        />
        {/* Validation icons */}
        {success && !error && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Check size={20} className="text-uber-green" />
          </div>
        )}
        {error && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <AlertCircle size={20} className="text-uber-red" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-uber-red mt-1.5 ml-1 flex items-center gap-1">
          <AlertCircle size={12} />
          {error.message}
        </p>
      )}
    </div>
  );
}

export default Input;

