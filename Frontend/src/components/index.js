import LocationSuggestions from "./LocationSuggestions";
import NewRide from "./NewRide";
import RideDetails from "./RideDetails";
import SelectVehicle from "./SelectVehicle";
import Sidebar from "./Sidebar";
import VerifyEmail from "./VerifyEmail";
import ErrorBoundary from "./ErrorBoundary";

// Phase 2 - Native iOS Apple Maps Experience Components
import FloatingHeader from "./FloatingHeader";
import FloatingSearchBar from "./FloatingSearchBar";
import MapControls from "./MapControls";
import LocationSearchPanel from "./LocationSearchPanel";
import VehiclePanel from "./VehiclePanel";
import LookingForDriver from "./LookingForDriver";

// Phase 3 - Tesla Command Center Components for Captains
import CommandDock from "./CommandDock";
import RideRequestCard from "./RideRequestCard";
import ActiveRideHUD, { RIDE_STATUS } from "./ActiveRideHUD";

// Phase 2 - Atomic Components (New Design System)
// Export all atomic components
export * from "./atoms";

export {
  LocationSuggestions,
  NewRide,
  RideDetails,
  SelectVehicle,
  Sidebar,
  VerifyEmail,
  ErrorBoundary,
  // Phase 2 Components
  FloatingHeader,
  FloatingSearchBar,
  MapControls,
  LocationSearchPanel,
  VehiclePanel,
  LookingForDriver,
  // Phase 3 Components
  CommandDock,
  RideRequestCard,
  ActiveRideHUD,
  RIDE_STATUS,
};
