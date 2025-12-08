import { useCallback, useContext, useEffect, useRef, useState, useMemo } from "react";
import { useUser } from "../contexts/UserContext";
import {
  Button,
  LocationSuggestions,
  SelectVehicle,
  RideDetails,
  Sidebar,
  FloatingHeader,
  FloatingSearchBar,
  MapControls,
  LocationSearchPanel,
  LookingForDriver,
} from "../components";
import EliteTrackingMap from "../components/maps/EliteTrackingMap";
import MapboxStaticMap from "../components/maps/MapboxStaticMap";
import MapInteractionWrapper from "../components/MapInteractionWrapper";
import MessageNotificationBanner from "../components/ui/MessageNotificationBanner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";
import { SocketDataContext } from "../contexts/SocketContext";
import Console from "../utils/console";
import { Navigation } from "lucide-react";

// Coordenadas de San Antonio del Táchira, Colombia (frontera)
const DEFAULT_LOCATION = {
  lat: 7.8146,
  lng: -72.4430
};

// URLs de sonidos de notificación
const NOTIFICATION_SOUNDS = {
  rideConfirmed: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
  rideStarted: "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3",
  rideEnded: "https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3",
  newMessage: "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3"
};

// Función para reproducir sonido
const playSound = (soundUrl) => {
  try {
    const audio = new Audio(soundUrl);
    audio.volume = 0.5;
    audio.play().catch(e => Console.log("Error reproduciendo sonido:", e));
  } catch (e) {
    Console.log("Error con audio:", e);
  }
};

// Función para vibrar
const vibrate = (pattern = [200, 100, 200]) => {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

function UserHomeScreen() {
  const token = localStorage.getItem("token");
  const { socket } = useContext(SocketDataContext);
  const { user } = useUser();
  const navigate = useNavigate();
  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem("messages")) || []
  );
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [showMessageBanner, setShowMessageBanner] = useState(false);
  const [lastMessage, setLastMessage] = useState({ sender: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [selectedInput, setSelectedInput] = useState("pickup");
  const [locationSuggestion, setLocationSuggestion] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: DEFAULT_LOCATION.lat,
    lng: DEFAULT_LOCATION.lng
  });
  const [rideCreated, setRideCreated] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [driverLocation, setDriverLocation] = useState(null);
  const [currentRideStatus, setCurrentRideStatus] = useState("pending");

  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);

  // Detalles del viaje
  const [pickupLocation, setPickupLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("car");
  const [fare, setFare] = useState({
    car: 0,
    bike: 0,
  });
  const [confirmedRideData, setConfirmedRideData] = useState(null);
  const [rideETA, setRideETA] = useState(null); // Added missing state for ETA tracking
  const rideTimeout = useRef(null);

  // Paneles - Legacy (keeping for compatibility)
  const [showFindTripPanel, setShowFindTripPanel] = useState(true);
  const [showSelectVehiclePanel, setShowSelectVehiclePanel] = useState(false);
  const [showRideDetailsPanel, setShowRideDetailsPanel] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [panelsVisible, setPanelsVisible] = useState(true); // For map interaction

  // Phase 2 - Floating UI Panels
  const [showLocationSearchPanel, setShowLocationSearchPanel] = useState(false);
  const [mapZoom, setMapZoom] = useState(14);
  const [isLocating, setIsLocating] = useState(false);

  // Handle sidebar toggle - hide all panels when sidebar opens
  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  // Handle panels visibility when interacting with map
  const handlePanelsVisibilityChange = (visible) => {
    setPanelsVisible(visible);
  };

  // Obtener ubicación actual y convertirla a dirección
  const getCurrentLocation = async () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Usar API de geocodificación inversa
            const response = await axios.get(
              `${import.meta.env.VITE_SERVER_URL}/map/get-address?lat=${latitude}&lng=${longitude}`,
              {
                headers: { token: token },
              }
            );
            if (response.data && response.data.address) {
              setPickupLocation(response.data.address);
            } else {
              // Fallback: usar coordenadas como texto
              setPickupLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
            }
          } catch (error) {
            Console.error("Error obteniendo dirección:", error);
            // Fallback con coordenadas
            setPickupLocation(`${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`);
          }
          setGettingLocation(false);
        },
        (error) => {
          Console.error("Error obteniendo ubicación:", error);
          setGettingLocation(false);
          alert("No se pudo obtener tu ubicación actual. Verifica los permisos de ubicación.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setGettingLocation(false);
      alert("Tu navegador no soporta geolocalización.");
    }
  };

  // AbortController ref for canceling stale requests
  const abortControllerRef = useRef(null);

  // Memoize debounced function with AbortController for performance
  const handleLocationChange = useMemo(
    () => debounce(async (inputValue, token) => {
      if (inputValue.length >= 3) {
        // Cancel previous request if still pending
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new AbortController for this request
        abortControllerRef.current = new AbortController();

        try {
          const response = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/map/get-suggestions?input=${inputValue}`,
            {
              headers: {
                token: token,
              },
              signal: abortControllerRef.current.signal,
            }
          );
          Console.log(response.data);
          setLocationSuggestion(response.data);
        } catch (error) {
          if (error.name !== 'CanceledError') {
            Console.error(error);
          }
        }
      }
    }, 300), // Reduced from 700ms to 300ms for faster response
    [] // Empty dependency - create debounced function only once
  );

  const onChangeHandler = (e) => {
    setSelectedInput(e.target.id);
    const value = e.target.value;
    if (e.target.id === "pickup") {
      setPickupLocation(value);
    } else if (e.target.id === "destination") {
      setDestinationLocation(value);
    }

    if (import.meta.env.VITE_ENVIRONMENT === "production") {
      handleLocationChange(value, token);
    }

    if (e.target.value.length < 3) {
      setLocationSuggestion([]);
    }
  };

  const getDistanceAndFare = async (pickupLocation, destinationLocation) => {
    Console.log(pickupLocation, destinationLocation);
    try {
      setLoading(true);
      // Note: Map will stay centered on current location
      // Route will be shown when ride is created
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/ride/get-fare?pickup=${encodeURIComponent(pickupLocation)}&destination=${encodeURIComponent(destinationLocation)}`,
        {
          headers: {
            token: token,
          },
        }
      );
      Console.log(response);
      setFare(response.data.fare);
      
      // Store coordinates if available
      if (response.data.pickupCoordinates) {
        setPickupCoordinates(response.data.pickupCoordinates);
      }
      if (response.data.destinationCoordinates) {
        setDestinationCoordinates(response.data.destinationCoordinates);
      }

      setShowFindTripPanel(false);
      setShowSelectVehiclePanel(true);
      setLocationSuggestion([]);
      setLoading(false);
    } catch (error) {
      Console.log(error);
      setLoading(false);
    }
  };

  const createRide = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/ride/create`,
        {
          pickup: pickupLocation,
          destination: destinationLocation,
          vehicleType: selectedVehicle,
        },
        {
          headers: {
            token: token,
          },
        }
      );
      Console.log(response);
      const rideData = {
        pickup: pickupLocation,
        destination: destinationLocation,
        vehicleType: selectedVehicle,
        fare: fare,
        confirmedRideData: confirmedRideData,
        _id: response.data._id,
      };
      localStorage.setItem("rideDetails", JSON.stringify(rideData));
      setLoading(false);
      setRideCreated(true);

      // Cancelar automáticamente después de 1.5 minutos
      rideTimeout.current = setTimeout(() => {
        cancelRide();
      }, import.meta.env.VITE_RIDE_TIMEOUT);
      
    } catch (error) {
      Console.log(error);
      setLoading(false);
    }
  };

  const cancelRide = async () => {
    try {
      const rideDetails = JSON.parse(localStorage.getItem("rideDetails") || "{}");
      
      if (!rideDetails._id && !rideDetails.confirmedRideData?._id) {
        Console.error("No ride ID found in localStorage");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/ride/cancel?rideId=${rideDetails._id || rideDetails.confirmedRideData?._id}`,
        {
          headers: {
            token: token,
          },
        }
      );
      setLoading(false);
      updateLocation();
      setShowRideDetailsPanel(false);
      setShowSelectVehiclePanel(false);
      setShowFindTripPanel(true);
      setDefaults();
      localStorage.removeItem("rideDetails");
      localStorage.removeItem("panelDetails");
      localStorage.removeItem("messages");
      localStorage.removeItem("showPanel");
      localStorage.removeItem("showBtn");
    } catch (error) {
      Console.error("Error cancelling ride:", error);
      setLoading(false);
    }
  };

  // Restablecer valores por defecto
  const setDefaults = () => {
    setPickupLocation("");
    setDestinationLocation("");
    setSelectedVehicle("car");
    setFare({
      car: 0,
      bike: 0,
    });
    setConfirmedRideData(null);
    setRideCreated(false);
  };

  // Actualizar ubicación
  const updateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error obteniendo posición:", error);
          // Usar ubicación por defecto si hay error
          setMapCenter({
            lat: DEFAULT_LOCATION.lat,
            lng: DEFAULT_LOCATION.lng
          });
        }
      );
    } else {
      // Usar ubicación por defecto
      setMapCenter({
        lat: DEFAULT_LOCATION.lat,
        lng: DEFAULT_LOCATION.lng
      });
    }
  };

  // Actualizar ubicación al cargar
  useEffect(() => {
    updateLocation();
  }, []);

  // Eventos de Socket
  useEffect(() => {
    if (!user._id || !socket) {
      // Early return if dependencies not ready
      return;
    }

    socket.emit("join", {
      userId: user._id,
      userType: "user",
    });

    const handleRideConfirmed = (data) => {
      Console.log("Limpiando Timeout", rideTimeout);
      clearTimeout(rideTimeout.current);
      Console.log("Timeout limpiado");
      Console.log("Viaje Confirmado");
      Console.log(data.captain.location);
      
      // Vibrar y reproducir sonido
      vibrate([200, 100, 200, 100, 200]);
      playSound(NOTIFICATION_SOUNDS.rideConfirmed);
      
      // Set initial driver location and ride status
      if (data.captain.location && data.captain.location.coordinates) {
        setDriverLocation({
          lng: data.captain.location.coordinates[0],
          lat: data.captain.location.coordinates[1]
        });
      }
      
      // Set pickup and destination coordinates from the response
      if (data.pickupCoordinates) {
        setPickupCoordinates(data.pickupCoordinates);
      }
      if (data.destinationCoordinates) {
        setDestinationCoordinates(data.destinationCoordinates);
      }
      
      setCurrentRideStatus("accepted"); // Driver on the way to pickup
      // Update map center to driver's location
      if (data.captain?.location?.coordinates) {
        setMapCenter({
          lat: data.captain.location.coordinates[1],
          lng: data.captain.location.coordinates[0]
        });
      }
      setConfirmedRideData(data);
    };

    const handleRideStarted = () => {
      Console.log("Viaje iniciado");
      playSound(NOTIFICATION_SOUNDS.rideStarted);
      vibrate([300, 100, 300]);
      setCurrentRideStatus("ongoing"); // Ride in progress
      // Map will show route from pickup to destination via EliteTrackingMap
    };

    const handleDriverLocationUpdated = (data) => {
      Console.log("Ubicación del conductor actualizada:", data);
      if (data.location) {
        setDriverLocation({
          lng: data.location.lng,
          lat: data.location.lat
        });
      }
    };

    const handleRideEnded = () => {
      Console.log("Viaje Finalizado");
      playSound(NOTIFICATION_SOUNDS.rideEnded);
      vibrate([500]);
      setShowRideDetailsPanel(false);
      setShowSelectVehiclePanel(false);
      setShowFindTripPanel(true);
      setDefaults();
      setDriverLocation(null);
      setCurrentRideStatus("pending");
      localStorage.removeItem("rideDetails");
      localStorage.removeItem("panelDetails");

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setMapCenter({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.error("Error obteniendo posición:", error);
            setMapCenter({
              lat: DEFAULT_LOCATION.lat,
              lng: DEFAULT_LOCATION.lng
            });
          }
        );
      }
    };

    socket.on("ride-confirmed", handleRideConfirmed);
    socket.on("ride-started", handleRideStarted);
    socket.on("driver:locationUpdated", handleDriverLocationUpdated);
    socket.on("ride-ended", handleRideEnded);

    return () => {
      socket.off("ride-confirmed", handleRideConfirmed);
      socket.off("ride-started", handleRideStarted);
      socket.off("ride-ended", handleRideEnded);
      socket.off("driver:locationUpdated", handleDriverLocationUpdated);
    };
  }, [user._id, socket]); // Removed pickupLocation from dependencies

  // Obtener detalles del viaje
  useEffect(() => {
    const storedRideDetails = localStorage.getItem("rideDetails");
    const storedPanelDetails = localStorage.getItem("panelDetails");

    if (storedRideDetails) {
      const ride = JSON.parse(storedRideDetails);
      setPickupLocation(ride.pickup);
      setDestinationLocation(ride.destination);
      setSelectedVehicle(ride.vehicleType);
      setFare(ride.fare);
      setConfirmedRideData(ride.confirmedRideData);
    }

    if (storedPanelDetails) {
      const panels = JSON.parse(storedPanelDetails);
      setShowFindTripPanel(panels.showFindTripPanel);
      setShowSelectVehiclePanel(panels.showSelectVehiclePanel);
      setShowRideDetailsPanel(panels.showRideDetailsPanel);
    }
  }, []);

  // Debounced localStorage save to avoid excessive writes
  const saveRideDetailsDebounced = useMemo(
    () => debounce((rideData) => {
      localStorage.setItem("rideDetails", JSON.stringify(rideData));
    }, 500),
    []
  );

  const savePanelDetailsDebounced = useMemo(
    () => debounce((panelDetails) => {
      localStorage.setItem("panelDetails", JSON.stringify(panelDetails));
    }, 500),
    []
  );

  const saveMessagesDebounced = useMemo(
    () => debounce((messages) => {
      localStorage.setItem("messages", JSON.stringify(messages));
    }, 1000),
    []
  );

  // Guardar detalles del viaje (debounced to reduce writes)
  useEffect(() => {
    const rideData = {
      pickup: pickupLocation,
      destination: destinationLocation,
      vehicleType: selectedVehicle,
      fare: fare,
      confirmedRideData: confirmedRideData,
    };
    saveRideDetailsDebounced(rideData);
  }, [
    pickupLocation,
    destinationLocation,
    selectedVehicle,
    fare,
    confirmedRideData,
    saveRideDetailsDebounced,
  ]);

  // Guardar información de paneles (debounced to reduce writes)
  useEffect(() => {
    const panelDetails = {
      showFindTripPanel,
      showSelectVehiclePanel,
      showRideDetailsPanel,
    };
    savePanelDetailsDebounced(panelDetails);
  }, [showFindTripPanel, showSelectVehiclePanel, showRideDetailsPanel, savePanelDetailsDebounced]);

  // Guardar mensajes (debounced to reduce writes)
  useEffect(() => {
    saveMessagesDebounced(messages);
  }, [messages, saveMessagesDebounced]);

  useEffect(() => {
    socket.emit("join-room", confirmedRideData?._id);

    socket.on("receiveMessage", (data) => {
      // Fix: data is an object {msg, by, time}, not a string
      const messageText = typeof data === 'string' ? data : (data?.msg || '');
      const messageBy = typeof data === 'string' ? 'other' : (data?.by || 'other');
      const messageTime = typeof data === 'string' ? '' : (data?.time || '');
      
      setMessages((prev) => [...prev, { msg: messageText, by: messageBy, time: messageTime }]);
      setUnreadMessages((prev) => prev + 1);
      
      // Set message info for banner - use msg property
      setLastMessage({
        sender: confirmedRideData?.captain?.fullname?.firstname || "Conductor",
        text: messageText
      });
      
      // Show notification banner
      setShowMessageBanner(true);
      
      // Play sound and vibrate
      playSound(NOTIFICATION_SOUNDS.newMessage);
      vibrate([200, 100, 200]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [confirmedRideData]);

  // Helper function to convert pickup/destination strings to coordinates
  const parseLocationString = async (locationStr) => {
    // For now, use geocoding to get coordinates from address
    // In production, store coordinates when user selects from suggestions
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(locationStr)}.json`,
        {
          params: {
            access_token: import.meta.env.VITE_MAPBOX_TOKEN,
            limit: 1,
          },
        }
      );
      
      if (response.data.features && response.data.features.length > 0) {
        const [lng, lat] = response.data.features[0].center;
        return { lng, lat };
      }
    } catch (error) {
      Console.log("Error geocoding location:", error);
    }
    return null;
  };

  // Handle ETA updates from tracking map
  const handleETAUpdate = (data) => {
    setRideETA(data);
    Console.log("ETA actualizado:", data);
  };

  // Determine if we should show the elite tracking map
  const showEliteMap = confirmedRideData && driverLocation;

  return (
    <div className="relative w-full h-dvh overflow-hidden">
      <Sidebar onToggle={handleSidebarToggle} />
      
      {/* Map Container - Full Height with Interaction Wrapper */}
      <div className="absolute inset-0 z-0">
        <MapInteractionWrapper
          panelsVisible={panelsVisible}
          onPanelsVisibilityChange={handlePanelsVisibilityChange}
        >
          {showEliteMap ? (
            <EliteTrackingMap
              driverLocation={driverLocation}
              pickupLocation={pickupCoordinates}
              dropoffLocation={currentRideStatus === "ongoing" ? destinationCoordinates : null}
              rideId={confirmedRideData._id}
              rideStatus={currentRideStatus}
              userType="user"
              vehicleType={selectedVehicle}
              onETAUpdate={handleETAUpdate}
              className="w-full h-full"
            />
          ) : (
            <MapboxStaticMap
              latitude={mapCenter.lat}
              longitude={mapCenter.lng}
              zoom={mapZoom}
              interactive={true}
              showMarker={true}
              markerColor="#10B981"
              className="w-full h-full"
            />
          )}
        </MapInteractionWrapper>
      </div>

      {/* ===== PHASE 2: FLOATING UI COMPONENTS ===== */}
      
      {/* Floating Header - User Pill (top-left) */}
      {!isSidebarOpen && !showLocationSearchPanel && !showSelectVehiclePanel && !showRideDetailsPanel && (
        <FloatingHeader
          user={user}
          onMenuClick={() => setIsSidebarOpen(true)}
          isOnline={true}
        />
      )}

      {/* Map Controls - Floating Circles (right side) */}
      {!isSidebarOpen && !showLocationSearchPanel && !showSelectVehiclePanel && !showRideDetailsPanel && (
        <MapControls
          onZoomIn={() => setMapZoom(prev => Math.min(prev + 1, 20))}
          onZoomOut={() => setMapZoom(prev => Math.max(prev - 1, 1))}
          onRecenter={() => {
            setIsLocating(true);
            updateLocation();
            setTimeout(() => setIsLocating(false), 1500);
          }}
          isLocating={isLocating}
        />
      )}

      {/* Floating Search Bar - The Island (bottom-center) */}
      {showFindTripPanel && !isSidebarOpen && !showSelectVehiclePanel && !showRideDetailsPanel && !rideCreated && (
        <FloatingSearchBar
          onClick={() => setShowLocationSearchPanel(true)}
          onHomeClick={() => {
            // Could implement saved home location
            setShowLocationSearchPanel(true);
          }}
          onRecentClick={() => {
            setShowLocationSearchPanel(true);
          }}
        />
      )}

      {/* Location Search Panel - Bottom Sheet */}
      <LocationSearchPanel
        isOpen={showLocationSearchPanel}
        onClose={() => setShowLocationSearchPanel(false)}
        pickupValue={pickupLocation}
        destinationValue={destinationLocation}
        onPickupChange={(value) => {
          setPickupLocation(value);
          setSelectedInput("pickup");
          if (import.meta.env.VITE_ENVIRONMENT === "production" && value.length >= 3) {
            handleLocationChange(value, token);
          }
          if (value.length < 3) setLocationSuggestion([]);
        }}
        onDestinationChange={(value) => {
          setDestinationLocation(value);
          setSelectedInput("destination");
          if (import.meta.env.VITE_ENVIRONMENT === "production" && value.length >= 3) {
            handleLocationChange(value, token);
          }
          if (value.length < 3) setLocationSuggestion([]);
        }}
        onLocationSelect={(location, inputType) => {
          if (inputType === "pickup") {
            setPickupLocation(location);
          } else {
            setDestinationLocation(location);
          }
          setLocationSuggestion([]);
          // If both fields have values, proceed to vehicle selection
          if (inputType === "destination" && pickupLocation.length > 2 && location.length > 2) {
            setShowLocationSearchPanel(false);
            getDistanceAndFare(pickupLocation, location);
          } else if (inputType === "pickup" && location.length > 2 && destinationLocation.length > 2) {
            setShowLocationSearchPanel(false);
            getDistanceAndFare(location, destinationLocation);
          }
        }}
        onGetCurrentLocation={getCurrentLocation}
        suggestions={locationSuggestion}
        selectedInput={selectedInput}
        onInputFocus={(inputType) => setSelectedInput(inputType)}
        isGettingLocation={gettingLocation}
      />

      {/* Looking For Driver - Pulsing Pin Overlay */}
      <LookingForDriver
        isVisible={rideCreated && !confirmedRideData}
        onCancel={cancelRide}
      />

      {/* ===== LEGACY UI (keeping for compatibility during transition) ===== */}
      
      {/* Componente Buscar viaje - Floating Route Card with Glassmorphism */}
      {showFindTripPanel && !isSidebarOpen && (
        <div className={`fixed bottom-0 left-0 right-0 z-10 transition-all duration-300 ease-out ${
          panelsVisible ? 'translate-y-0' : 'translate-y-full'
        } hidden`}> {/* Hidden - replaced by FloatingSearchBar */}
          {/* Premium Floating Route Card */}
          <div className="mx-4 mb-6 bg-slate-900/95 backdrop-blur-xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden"
               style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 20px)' }}>
            {/* Top accent glow */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent rounded-t-[32px]" />
            
            {/* Drag Handle */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-3 mb-4"></div>
            
            <div className="px-5 pb-4">
              <h1 className="text-2xl font-black text-white mb-5" style={{ textWrap: 'balance' }}>Buscar viaje</h1>
              
              {/* Route Input Container with Visual Connector */}
              <div className="relative mb-5">
                {/* Connector Line - Dotted vertical line between inputs */}
                <div className="absolute left-6 top-0 bottom-0 w-[2px] flex flex-col items-center justify-between z-0">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 shadow-lg shadow-emerald-400/50" />
                  <div className="flex-1 w-[2px] border-l-2 border-dashed border-white/20 my-2" />
                  <div className="w-3 h-3 rounded-sm bg-cyan-400 border-2 border-slate-900 shadow-lg shadow-cyan-400/50" />
                </div>

                {/* Pickup Input */}
                <div className="relative mb-3 pl-12">
                  <input
                    id="pickup"
                    placeholder="Punto de recogida"
                    className="w-full bg-white/10 backdrop-blur-xl border-2 border-white/20 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 px-4 pr-12 py-4 rounded-2xl outline-none text-base transition-all duration-300 ease-out text-white placeholder:text-slate-400"
                    value={pickupLocation}
                    onChange={onChangeHandler}
                    autoComplete="off"
                  />
                  <button
                    onClick={getCurrentLocation}
                    disabled={gettingLocation}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:bg-slate-700 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30 transition-all duration-300 ease-out active:scale-90 hover:shadow-xl hover:shadow-emerald-500/40"
                    style={{
                      willChange: 'transform',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden'
                    }}
                    title="Usar ubicación actual"
                  >
                    <Navigation 
                      size={18} 
                      className={`transition-transform ${gettingLocation ? "animate-pulse" : ""}`}
                    />
                  </button>
                </div>

                {/* Destination Input */}
                <div className="relative pl-12">
                  <input
                    id="destination"
                    placeholder="Destino"
                    className="w-full bg-white/10 backdrop-blur-xl border-2 border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 px-4 py-4 rounded-2xl outline-none text-base transition-all duration-300 ease-out text-white placeholder:text-slate-400"
                    value={destinationLocation}
                    onChange={onChangeHandler}
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Search Button - Enhanced */}
              {pickupLocation.length > 2 && destinationLocation.length > 2 && (
                <Button
                  title={"Buscar"}
                  loading={loading}
                  fun={() => {
                    getDistanceAndFare(pickupLocation, destinationLocation);
                  }}
                  classes="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 font-bold rounded-2xl shadow-lg shadow-emerald-500/30 transition-all duration-300 ease-out"
                />
              )}

              {/* Location Suggestions */}
              <div className="max-h-[30vh] overflow-y-auto mt-3" style={{ WebkitOverflowScrolling: 'touch' }}>
                {locationSuggestion.length > 0 && (
                  <LocationSuggestions
                    suggestions={locationSuggestion}
                    setSuggestions={setLocationSuggestion}
                    setPickupLocation={setPickupLocation}
                    setDestinationLocation={setDestinationLocation}
                    input={selectedInput}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel de selección de vehículo - Hidden when sidebar is open */}
      {!isSidebarOpen && (
        <SelectVehicle
          selectedVehicle={setSelectedVehicle}
          showPanel={showSelectVehiclePanel}
          setShowPanel={setShowSelectVehiclePanel}
          showPreviousPanel={setShowFindTripPanel}
          showNextPanel={setShowRideDetailsPanel}
          fare={fare}
        />
      )}

      {/* Panel de detalles del viaje - Hidden when sidebar is open */}
      {!isSidebarOpen && (
        <RideDetails
          pickupLocation={pickupLocation}
          destinationLocation={destinationLocation}
          selectedVehicle={selectedVehicle}
          fare={fare}
          showPanel={showRideDetailsPanel}
          setShowPanel={setShowRideDetailsPanel}
          showPreviousPanel={setShowSelectVehiclePanel}
          createRide={createRide}
          cancelRide={cancelRide}
          loading={loading}
          rideCreated={rideCreated}
          confirmedRideData={confirmedRideData}
          unreadMessages={unreadMessages}
        />
      )}
      
      {/* Message Notification Banner */}
      <MessageNotificationBanner
        senderName={lastMessage.sender}
        message={lastMessage.text}
        show={showMessageBanner}
        onClose={() => setShowMessageBanner(false)}
        onTap={() => {
          setShowMessageBanner(false);
          setUnreadMessages(0);
          navigate(`/user/chat/${confirmedRideData?._id}`);
        }}
      />
    </div>
  );
}

export default UserHomeScreen;
