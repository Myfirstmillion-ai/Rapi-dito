import { useState, useCallback } from "react";
import { searchLocations } from "../services/geocoding";
import Console from "../utils/console";

/**
 * Custom hook for location search and geocoding
 * Handles pickup/destination location search, suggestions, and coordinates
 *
 * @returns {Object} Location search state and functions
 */
export function useLocationSearch() {
  // Location state
  const [selectedInput, setSelectedInput] = useState("pickup");
  const [locationSuggestion, setLocationSuggestion] = useState([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [pickupLocation, setPickupLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    latitude: 4.7110,
    longitude: -74.0721,
  });
  const [mapZoom, setMapZoom] = useState(14);
  const [isLocating, setIsLocating] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  // Search for location suggestions
  const searchLocation = useCallback(async (query) => {
    if (!query || query.length < 3) {
      setLocationSuggestion([]);
      return;
    }

    setIsSearchingLocation(true);

    try {
      const results = await searchLocations(query);
      setLocationSuggestion(results || []);
    } catch (error) {
      Console.error("Location search error:", error);
      setLocationSuggestion([]);
    } finally {
      setIsSearchingLocation(false);
    }
  }, []);

  // Select a location from suggestions
  const selectLocation = useCallback((location) => {
    const { display_name, lat, lon } = location;

    if (selectedInput === "pickup") {
      setPickupLocation(display_name);
      setPickupCoordinates({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
      setMapCenter({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
    } else {
      setDestinationLocation(display_name);
      setDestinationCoordinates({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
      setMapCenter({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
    }

    setLocationSuggestion([]);
  }, [selectedInput]);

  // Get current location from browser geolocation
  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      Console.error("Geolocation not supported");
      return { success: false, error: "Geolocation not supported" };
    }

    setGettingLocation(true);
    setIsLocating(true);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;
      setMapCenter({ latitude, longitude });
      setMapZoom(15);

      // Reverse geocode to get address
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();

      if (selectedInput === "pickup") {
        setPickupLocation(data.display_name);
        setPickupCoordinates({ latitude, longitude });
      } else {
        setDestinationLocation(data.display_name);
        setDestinationCoordinates({ latitude, longitude });
      }

      return { success: true, location: { latitude, longitude, address: data.display_name } };
    } catch (error) {
      Console.error("Get current location error:", error);
      return { success: false, error: error.message };
    } finally {
      setGettingLocation(false);
      setIsLocating(false);
    }
  }, [selectedInput]);

  // Clear location inputs
  const clearLocations = useCallback(() => {
    setPickupLocation("");
    setDestinationLocation("");
    setPickupCoordinates(null);
    setDestinationCoordinates(null);
    setLocationSuggestion([]);
  }, []);

  // Swap pickup and destination
  const swapLocations = useCallback(() => {
    const tempLocation = pickupLocation;
    const tempCoords = pickupCoordinates;

    setPickupLocation(destinationLocation);
    setPickupCoordinates(destinationCoordinates);
    setDestinationLocation(tempLocation);
    setDestinationCoordinates(tempCoords);
  }, [pickupLocation, destinationLocation, pickupCoordinates, destinationCoordinates]);

  return {
    // State
    selectedInput,
    locationSuggestion,
    isSearchingLocation,
    pickupLocation,
    destinationLocation,
    pickupCoordinates,
    destinationCoordinates,
    mapCenter,
    mapZoom,
    isLocating,
    gettingLocation,

    // Setters
    setSelectedInput,
    setLocationSuggestion,
    setPickupLocation,
    setDestinationLocation,
    setPickupCoordinates,
    setDestinationCoordinates,
    setMapCenter,
    setMapZoom,

    // Actions
    searchLocation,
    selectLocation,
    getCurrentLocation,
    clearLocations,
    swapLocations,
  };
}
