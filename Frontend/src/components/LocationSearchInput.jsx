import { useState, useEffect, useRef } from "react";
import { MapPin, X, Loader } from "lucide-react";
import debounce from "lodash.debounce";
import { searchLocations } from "../services/geocoding";
import { cn } from "../utils/cn";
import { motion, AnimatePresence } from "framer-motion";

function LocationSearchInput({ 
  value, 
  onChange, 
  placeholder = "Buscar ubicación...",
  onLocationSelect,
  className,
  icon: CustomIcon,
  autoFocus = false
}) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Debounced search function
  const debouncedSearch = useRef(
    debounce(async (searchQuery) => {
      if (searchQuery.length < 3) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const results = await searchLocations(searchQuery, {
        limit: 5,
      });
      setSuggestions(results);
      setIsLoading(false);
    }, 300)
  ).current;

  useEffect(() => {
    if (query) {
      debouncedSearch(query);
    } else {
      setSuggestions([]);
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange?.(newValue);
    setShowSuggestions(true);
  };

  const handleSelectLocation = (location) => {
    setQuery(location.place_name);
    onChange?.(location.place_name);
    onLocationSelect?.(location);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleClear = () => {
    setQuery("");
    onChange?.("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // You can reverse geocode here if needed
          const locationText = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          setQuery(locationText);
          onChange?.(locationText);
          onLocationSelect?.({
            place_name: locationText,
            coordinates: [longitude, latitude],
          });
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
        }
      );
    }
  };

  const Icon = CustomIcon || MapPin;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
          {isLoading ? <Loader size={20} className="animate-spin" /> : <Icon size={20} />}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            "w-full bg-white px-12 py-3 rounded-lg border-2 border-gray-200",
            "outline-none text-sm transition-all duration-200",
            "focus:border-green-500 focus:ring-2 focus:ring-green-100",
            query && "pr-20"
          )}
        />
        
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          >
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSelectLocation(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {suggestion.text}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {suggestion.place_name}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LocationSearchInput;
