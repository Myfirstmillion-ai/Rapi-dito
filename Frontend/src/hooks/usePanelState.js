import { useState, useCallback } from "react";

/**
 * Custom hook for managing UI panel visibility states
 * Centralized panel state management for cleaner component code
 *
 * @returns {Object} Panel state and control functions
 */
export function usePanelState() {
  // Panel visibility states
  const [showFindTripPanel, setShowFindTripPanel] = useState(true);
  const [showSelectVehiclePanel, setShowSelectVehiclePanel] = useState(false);
  const [showRideDetailsPanel, setShowRideDetailsPanel] = useState(false);
  const [showLocationSearchPanel, setShowLocationSearchPanel] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [panelsVisible, setPanelsVisible] = useState(true); // For map interaction

  // Navigate to find trip panel
  const showFindTrip = useCallback(() => {
    setShowFindTripPanel(true);
    setShowSelectVehiclePanel(false);
    setShowRideDetailsPanel(false);
    setShowLocationSearchPanel(false);
  }, []);

  // Navigate to select vehicle panel
  const showSelectVehicle = useCallback(() => {
    setShowFindTripPanel(false);
    setShowSelectVehiclePanel(true);
    setShowRideDetailsPanel(false);
    setShowLocationSearchPanel(false);
  }, []);

  // Navigate to ride details panel
  const showRideDetails = useCallback(() => {
    setShowFindTripPanel(false);
    setShowSelectVehiclePanel(false);
    setShowRideDetailsPanel(true);
    setShowLocationSearchPanel(false);
  }, []);

  // Navigate to location search panel
  const showLocationSearch = useCallback(() => {
    setShowLocationSearchPanel(true);
    setShowFindTripPanel(false);
    setShowSelectVehiclePanel(false);
    setShowRideDetailsPanel(false);
  }, []);

  // Close all panels
  const closeAllPanels = useCallback(() => {
    setShowFindTripPanel(false);
    setShowSelectVehiclePanel(false);
    setShowRideDetailsPanel(false);
    setShowLocationSearchPanel(false);
  }, []);

  // Reset to initial state
  const resetPanels = useCallback(() => {
    setShowFindTripPanel(true);
    setShowSelectVehiclePanel(false);
    setShowRideDetailsPanel(false);
    setShowLocationSearchPanel(false);
    setPanelsVisible(true);
  }, []);

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  // Hide all panels (for map interaction)
  const hidePanels = useCallback(() => {
    setPanelsVisible(false);
  }, []);

  // Show panels after map interaction
  const showPanels = useCallback(() => {
    setPanelsVisible(true);
  }, []);

  return {
    // State
    showFindTripPanel,
    showSelectVehiclePanel,
    showRideDetailsPanel,
    showLocationSearchPanel,
    isSidebarOpen,
    panelsVisible,

    // Setters
    setShowFindTripPanel,
    setShowSelectVehiclePanel,
    setShowRideDetailsPanel,
    setShowLocationSearchPanel,
    setIsSidebarOpen,
    setPanelsVisible,

    // Actions
    showFindTrip,
    showSelectVehicle,
    showRideDetails,
    showLocationSearch,
    closeAllPanels,
    resetPanels,
    toggleSidebar,
    hidePanels,
    showPanels,
  };
}
