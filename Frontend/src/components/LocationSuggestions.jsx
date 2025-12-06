import { MapPin } from "lucide-react";
import Console from "../utils/console";
import { motion } from "framer-motion";

const locationSuggestions = [
  { name: "Central Park", location: "New York, NY, USA" },
  { name: "Eiffel Tower", location: "Paris, France" },
  { name: "Marina Bay Sands", location: "Singapore" },
  { name: "Burj Khalifa", location: "Dubai, UAE" },
  { name: "Sydney Opera House", location: "Sydney, Australia" },
  { name: "Golden Gate Bridge", location: "San Francisco, CA, USA" },
  { name: "Taj Mahal", location: "Agra, India" },
  { name: "Great Wall", location: "Beijing, China" },
  { name: "Niagara Falls", location: "Ontario, Canada" },
  { name: "Colosseum", location: "Rome, Italy" },
];

function LocationSuggestions({
  suggestions = [],
  setSuggestions,
  setPickupLocation,
  setDestinationLocation,
  input,
}) {
  return (
    <div className="space-y-1">
      {suggestions.map((suggestion, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ 
            duration: 0.2, 
            delay: index * 0.03,
            ease: "easeOut"
          }}
          whileHover={{ scale: 1.01, x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            Console.log(suggestion);
            if (input == "pickup") {
              setPickupLocation(suggestion);
              setSuggestions([]);
            }
            if (input == "destination") {
              setDestinationLocation(suggestion);
              setSuggestions([]);
            }
          }}
          className="cursor-pointer flex items-center gap-3 border-b border-white/5 last:border-b-0 py-3 px-2 rounded-lg hover:bg-white/10 active:bg-white/15 transition-all group"
        >
          <motion.div 
            className="bg-emerald-500/20 backdrop-blur-sm p-2.5 rounded-xl border border-emerald-400/30 group-hover:bg-emerald-500/30 group-hover:border-emerald-400/50 transition-all"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <MapPin size={18} className="text-emerald-400" />
          </motion.div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
              {suggestion}
            </h2>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default LocationSuggestions;
