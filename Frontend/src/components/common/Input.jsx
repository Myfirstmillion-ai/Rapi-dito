import { useState } from "react";
import { cn } from "../../utils/cn";

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
  floatingLabel = false
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!defaultValue);

  const inputClasses = cn(
    "w-full bg-zinc-100 px-4 rounded-lg outline-none text-sm transition-all duration-200",
    "focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent",
    floatingLabel ? "py-6 pt-6" : "py-3",
    disabled && "cursor-not-allowed select-none text-zinc-400 bg-zinc-50",
    error && "ring-2 ring-red-500 bg-red-50",
    Icon && "pl-12"
  );

  const labelClasses = cn(
    "font-semibold transition-all duration-200",
    floatingLabel && "absolute left-4 pointer-events-none",
    floatingLabel && (isFocused || hasValue) 
      ? "text-xs top-2 text-green-600" 
      : "text-sm top-5 text-gray-600"
  );

  const handleChange = (e) => {
    setHasValue(e.target.value.length > 0);
  };

  if (type === "select") {
    return (
      <div className="my-2">
        {!floatingLabel && <h1 className={labelClasses}>{label}</h1>}
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
        </div>
        {error && <p className="text-xs text-red-600 mt-1 ml-1">{error.message}</p>}
      </div>
    );
  }

  return (
    <div className="my-2">
      {!floatingLabel && <h1 className={labelClasses}>{label}</h1>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
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
      </div>
      {error && <p className="text-xs text-red-600 mt-1 ml-1">{error.message}</p>}
    </div>
  );
}

export default Input;
