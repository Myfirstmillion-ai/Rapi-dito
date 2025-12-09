import { useState, useRef, useCallback } from "react";
import axios from "axios";
import Console from "../utils/console";

/**
 * Custom hook for managing user ride lifecycle
 * Handles ride creation, tracking, cancellation, and status updates
 *
 * @param {Object} user - Current user object
 * @param {Object} socket - Socket.io instance
 * @param {Function} showAlert - Alert display function
 * @returns {Object} Ride management state and functions
 */
export function useUserRideManagement(user, socket, showAlert) {
  // Ride state
  const [rideCreated, setRideCreated] = useState(false);
  const [currentRideStatus, setCurrentRideStatus] = useState("pending");
  const [confirmedRideData, setConfirmedRideData] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState("car");
  const [fare, setFare] = useState({
    auto: null,
    car: null,
    bike: null,
  });
  const [driverLocation, setDriverLocation] = useState(null);
  const [rideETA, setRideETA] = useState(null);
  const rideTimeout = useRef(null);

  // Create a new ride
  const createRide = useCallback(async (pickupLocation, destinationLocation) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/ride/create`,
        {
          pickup: pickupLocation,
          destination: destinationLocation,
          vehicleType: selectedVehicle,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        setRideCreated(true);
        setConfirmedRideData(response.data);
        return { success: true, data: response.data };
      }
    } catch (error) {
      Console.error("Create ride error:", error);
      const errorMessage = error.response?.data?.message || "Error al crear el viaje";
      showAlert?.("error", errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [selectedVehicle, showAlert]);

  // Get fare estimate
  const getFareEstimate = useCallback(async (pickup, destination) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/ride/get-fare`,
        {
          params: { pickup, destination },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setFare(response.data);
        return { success: true, data: response.data };
      }
    } catch (error) {
      Console.error("Get fare error:", error);
      return { success: false, error: error.message };
    }
  }, []);

  // Cancel ride
  const cancelRide = useCallback(async (rideId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/ride/cancel`,
        { rideId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        // Reset ride state
        setRideCreated(false);
        setConfirmedRideData(null);
        setCurrentRideStatus("pending");
        setDriverLocation(null);
        setRideETA(null);

        // Clear timeout if exists
        if (rideTimeout.current) {
          clearTimeout(rideTimeout.current);
          rideTimeout.current = null;
        }

        return { success: true };
      }
    } catch (error) {
      Console.error("Cancel ride error:", error);
      return { success: false, error: error.message };
    }
  }, []);

  // Update ride status
  const updateRideStatus = useCallback((status) => {
    setCurrentRideStatus(status);
  }, []);

  // Update driver location
  const updateDriverLocation = useCallback((location) => {
    setDriverLocation(location);
  }, []);

  // Set ride timeout for auto-cancellation
  const setRideCancellationTimeout = useCallback((callback, duration = 120000) => {
    if (rideTimeout.current) {
      clearTimeout(rideTimeout.current);
    }
    rideTimeout.current = setTimeout(callback, duration);
  }, []);

  // Clear ride timeout
  const clearRideCancellationTimeout = useCallback(() => {
    if (rideTimeout.current) {
      clearTimeout(rideTimeout.current);
      rideTimeout.current = null;
    }
  }, []);

  // Reset ride state
  const resetRideState = useCallback(() => {
    setRideCreated(false);
    setConfirmedRideData(null);
    setCurrentRideStatus("pending");
    setDriverLocation(null);
    setRideETA(null);
    setSelectedVehicle("car");
    clearRideCancellationTimeout();
  }, [clearRideCancellationTimeout]);

  return {
    // State
    rideCreated,
    currentRideStatus,
    confirmedRideData,
    selectedVehicle,
    fare,
    driverLocation,
    rideETA,

    // Setters
    setRideCreated,
    setCurrentRideStatus,
    setConfirmedRideData,
    setSelectedVehicle,
    setFare,
    setDriverLocation,
    setRideETA,

    // Actions
    createRide,
    getFareEstimate,
    cancelRide,
    updateRideStatus,
    updateDriverLocation,
    setRideCancellationTimeout,
    clearRideCancellationTimeout,
    resetRideState,
  };
}
