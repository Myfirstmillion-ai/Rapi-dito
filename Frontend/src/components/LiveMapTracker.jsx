import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation as NavIcon } from "lucide-react";

const LiveMapTracker = ({ 
  userLocation, 
  driverLocation, 
  vehicleType = "car",
  pickup,
  destination,
  showRoute = false 
}) => {
  const mapRef = useRef(null);
  const [mapUrl, setMapUrl] = useState("");

  useEffect(() => {
    if (userLocation && driverLocation) {
      // Create a URL that shows both user and driver locations
      const url = `https://www.google.com/maps/embed/v1/directions?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&origin=${driverLocation.lat},${driverLocation.lng}&destination=${userLocation.lat},${userLocation.lng}&mode=driving`;
      setMapUrl(url);
    } else if (pickup && destination) {
      // Show route from pickup to destination
      const url = `https://www.google.com/maps?q=${encodeURIComponent(pickup)} to ${encodeURIComponent(destination)}&output=embed`;
      setMapUrl(url);
    } else if (userLocation) {
      // Show just user location
      const url = `https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}&output=embed`;
      setMapUrl(url);
    }
  }, [userLocation, driverLocation, pickup, destination]);

  return (
    <div className="relative w-full h-full">
      {/* Map iframe */}
      <iframe
        ref={mapRef}
        src={mapUrl}
        className="absolute map w-full h-full touch-none"
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        style={{ touchAction: "pan-x pan-y" }}
      />

      {/* Overlay indicators */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        {userLocation && (
          <div className="bg-white shadow-lg rounded-lg p-3 flex items-center gap-2 animate-pulse">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">Tu ubicación</span>
          </div>
        )}
        
        {driverLocation && (
          <div className="bg-white shadow-lg rounded-lg p-3 flex items-center gap-2">
            <div className="relative">
              {vehicleType === "bike" ? (
                <span className="text-2xl">🏍️</span>
              ) : (
                <span className="text-2xl">🚗</span>
              )}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-700 block">Conductor en camino</span>
              <span className="text-xs text-gray-500">Seguimiento en tiempo real</span>
            </div>
          </div>
        )}
      </div>

      {/* Live tracking pulse effect at user location */}
      {userLocation && !driverLocation && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative">
            <div className="w-16 h-16 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveMapTracker;
