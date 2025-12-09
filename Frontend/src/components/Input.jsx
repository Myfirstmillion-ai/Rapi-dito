/**
 * Swiss Minimalist Luxury Input Component
 * 
 * Design Philosophy:
 * - NO DEFAULT BORDERS: Clean, minimal design
 * - BACKGROUND: bg-gray-100 dark:bg-white/10
 * - FOCUS STATE: focus:ring-2 focus:ring-black dark:focus:ring-white
 * - HEIGHT: h-14 (56px) for massive touch targets
 * - TRANSITIONS: Smooth focus transitions
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
  className
}) {
  // Base input classes - Swiss Minimalist style
  const inputBaseClasses = `
    w-full h-14
    bg-gray-100 dark:bg-white/10
    px-5 py-4
    rounded-2xl
    border-0 outline-none
    text-base text-gray-900 dark:text-white
    placeholder:text-gray-400 dark:placeholder:text-gray-500
    transition-all duration-200 ease-out
    focus:ring-2 focus:ring-black dark:focus:ring-white
    focus:bg-white dark:focus:bg-white/20
    ${disabled ? "cursor-not-allowed select-none opacity-60" : ""}
    ${error ? "ring-2 ring-red-500 focus:ring-red-500" : ""}
    ${className || ""}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className="my-3">
      {label && (
        <label 
          htmlFor={name} 
          className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      
      {type === "select" ? (
        <select
          id={name}
          {...register(name)}
          defaultValue={defaultValue}
          disabled={disabled}
          className={inputBaseClasses}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${name}-error` : undefined}
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
          id={name}
          {...register(name)}
          type={type || "text"}
          placeholder={placeholder || label}
          disabled={disabled}
          defaultValue={defaultValue}
          className={inputBaseClasses}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      )}
      
      {error && (
        <p 
          id={`${name}-error`} 
          className="mt-2 text-sm text-red-500 dark:text-red-400"
          role="alert"
        >
          {error.message}
        </p>
      )}
    </div>
  );
}

export default Input;
