import { useCallback, useContext, useEffect, useRef, useState, useMemo } from "react";
import { useUser } from "../contexts/UserContext";
import {
  Button,
  LocationSuggestions,
  SelectVehicle,
  RideDetails,
  Sidebar,
} from "../components";
import EliteTrackingMap from "../components/maps/EliteTrackingMap";
import MapboxStaticMap from "../components/maps/MapboxStaticMap";
import MessageNotificationBanner from "../components/ui/MessageNotificationBanner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";
import { SocketDataContext } from "../contexts/SocketContext";
import Console from "../utils/console";
import { 
  Navigation, 
  MapPin, 
  Search, 
  X, 
  Plus,
  Minus,
  Compass,
  Menu,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
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
  const [rideETA, setRideETA] = useState(null);
  const rideTimeout = useRef(null);

  // UI State - Swiss Minimalist
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [showSelectVehiclePanel, setShowSelectVehiclePanel] = useState(false);
  const [showRideDetailsPanel, setShowRideDetailsPanel] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mapZoom, setMapZoom] = useState(14);
  const [isLocating, setIsLocating] = useState(false);

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Handle sidebar toggle
  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  // Obtener ubicación actual y convertirla a dirección
  const getCurrentLocation = async () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await axios.get(
              `${import.meta.env.VITE_SERVER_URL}/map/get-address?lat=${latitude}&lng=${longitude}`,
              {
                headers: { token: token },
              }
            );
            if (response.data && response.data.address) {
              setPickupLocation(response.data.address);
            } else {
              setPickupLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
            }
          } catch (error) {
            Console.error("Error obteniendo dirección:", error);
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

  // Memoize debounced function with AbortController
  const handleLocationChange = useMemo(
    () => debounce(async (inputValue, token) => {
      if (inputValue.length >= 3) {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        setIsSearchingLocation(true);

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
        } finally {
          setIsSearchingLocation(false);
        }
      } else {
        setIsSearchingLocation(false);
      }
    }, 300),
    []
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
      
      if (response.data.pickupCoordinates) {
        setPickupCoordinates(response.data.pickupCoordinates);
      }
      if (response.data.destinationCoordinates) {
        setDestinationCoordinates(response.data.destinationCoordinates);
      }

      setShowSearchPanel(false);
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
      setShowSearchPanel(false);
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
          setMapCenter({
            lat: DEFAULT_LOCATION.lat,
            lng: DEFAULT_LOCATION.lng
          });
        }
      );
    } else {
      setMapCenter({
        lat: DEFAULT_LOCATION.lat,
        lng: DEFAULT_LOCATION.lng
      });
    }
  };

  useEffect(() => {
    updateLocation();
  }, []);

  // Socket events
  useEffect(() => {
    if (!user._id || !socket) {
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
      
      vibrate([200, 100, 200, 100, 200]);
      playSound(NOTIFICATION_SOUNDS.rideConfirmed);
      
      if (data.captain.location && data.captain.location.coordinates) {
        setDriverLocation({
          lng: data.captain.location.coordinates[0],
          lat: data.captain.location.coordinates[1]
        });
      }
      
      if (data.pickupCoordinates) {
        setPickupCoordinates(data.pickupCoordinates);
      }
      if (data.destinationCoordinates) {
        setDestinationCoordinates(data.destinationCoordinates);
      }
      
      setCurrentRideStatus("accepted");
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
      setCurrentRideStatus("ongoing");
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
      setShowSearchPanel(false);
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
  }, [user._id, socket]);

  // Restore ride details from localStorage
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
      setShowSearchPanel(panels.showFindTripPanel || false);
      setShowSelectVehiclePanel(panels.showSelectVehiclePanel || false);
      setShowRideDetailsPanel(panels.showRideDetailsPanel || false);
    }
  }, []);

  // Debounced localStorage saves
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

  useEffect(() => {
    const panelDetails = {
      showFindTripPanel: showSearchPanel,
      showSelectVehiclePanel,
      showRideDetailsPanel,
    };
    savePanelDetailsDebounced(panelDetails);
  }, [showSearchPanel, showSelectVehiclePanel, showRideDetailsPanel, savePanelDetailsDebounced]);

  useEffect(() => {
    saveMessagesDebounced(messages);
  }, [messages, saveMessagesDebounced]);

  useEffect(() => {
    socket.emit("join-room", confirmedRideData?._id);

    socket.on("receiveMessage", (data) => {
      const messageText = typeof data === 'string' ? data : (data?.msg || '');
      const messageBy = typeof data === 'string' ? 'other' : (data?.by || 'other');
      const messageTime = typeof data === 'string' ? '' : (data?.time || '');
      
      setMessages((prev) => [...prev, { msg: messageText, by: messageBy, time: messageTime }]);
      setUnreadMessages((prev) => prev + 1);
      
      setLastMessage({
        sender: confirmedRideData?.captain?.fullname?.firstname || "Conductor",
        text: messageText
      });
      
      setShowMessageBanner(true);
      playSound(NOTIFICATION_SOUNDS.newMessage);
      vibrate([200, 100, 200]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [confirmedRideData]);

  const handleETAUpdate = (data) => {
    setRideETA(data);
    Console.log("ETA actualizado:", data);
  };

  const showEliteMap = confirmedRideData && driverLocation;

  return (
    <div className="relative w-full h-dvh overflow-hidden bg-white dark:bg-black">
      <Sidebar onToggle={handleSidebarToggle} />
      
      {/* Map Container */}
      <div className="absolute inset-0 z-0">
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
      </div>

      {/* Swiss Minimalist UI Layer */}
      {!isSidebarOpen && !showSelectVehiclePanel && !showRideDetailsPanel && !rideCreated && (
        <>
          {/* Top Bar - User Profile Pill */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between"
          >
            {/* User Pill */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-3 pl-2 pr-4 py-2 bg-white dark:bg-gray-900 rounded-full shadow-lg border border-gray-200 dark:border-gray-800"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                {user?.fullname?.firstname?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user?.fullname?.firstname}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">En línea</p>
              </div>
            </motion.button>

            {/* Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSidebarOpen(true)}
              className="w-12 h-12 rounded-full bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center"
            >
              <Menu size={20} className="text-gray-900 dark:text-white" />
            </motion.button>
          </motion.div>

          {/* Map Controls - Right Side */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-6 top-24 z-20 flex flex-col gap-3"
          >
            {/* Zoom In */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMapZoom(prev => Math.min(prev + 1, 20))}
              className="w-12 h-12 rounded-full bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center"
            >
              <Plus size={20} className="text-gray-900 dark:text-white" />
            </motion.button>

            {/* Zoom Out */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMapZoom(prev => Math.max(prev - 1, 1))}
              className="w-12 h-12 rounded-full bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center"
            >
              <Minus size={20} className="text-gray-900 dark:text-white" />
            </motion.button>

            {/* Recenter */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setIsLocating(true);
                updateLocation();
                setTimeout(() => setIsLocating(false), 1500);
              }}
              className="w-12 h-12 rounded-full bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center"
            >
              <Compass size={20} className={`text-gray-900 dark:text-white ${isLocating ? 'animate-spin' : ''}`} />
            </motion.button>
          </motion.div>

          {/* Bottom Search Card */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-8 left-6 right-6 z-20"
          >
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSearchPanel(true)}
              className="w-full p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Search size={20} className="text-gray-900 dark:text-white" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    ¿A dónde vamos?
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Toca para buscar destino
                  </p>
                </div>
              </div>
            </motion.button>
          </motion.div>
        </>
      )}

      {/* Search Panel - Bottom Sheet */}
      <AnimatePresence>
        {showSearchPanel && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSearchPanel(false)}
              className="absolute inset-0 bg-black/50 z-30"
            />

            {/* Panel */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute inset-x-0 bottom-0 z-40 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col"
            >
              {/* Drag Handle */}
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mt-3 mb-6"></div>

              {/* Close Button */}
              <button
                onClick={() => setShowSearchPanel(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
              >
                <X size={20} className="text-gray-900 dark:text-white" />
              </button>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 pb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  Planear viaje
                </h2>

                {/* Route Inputs */}
                <div className="relative mb-6">
                  {/* Connector Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800 flex flex-col items-center justify-between z-0">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900" />
                    <div className="w-3 h-3 rounded-full bg-gray-400 dark:bg-gray-600 border-2 border-white dark:border-gray-900" />
                  </div>

                  {/* Pickup Input */}
                  <div className="relative mb-4 pl-12">
                    <input
                      id="pickup"
                      placeholder="Punto de recogida"
                      className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-500 px-4 pr-12 py-4 rounded-2xl outline-none text-base transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
                      value={pickupLocation}
                      onChange={onChangeHandler}
                      autoComplete="off"
                    />
                    <button
                      onClick={getCurrentLocation}
                      disabled={gettingLocation}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 transition-all active:scale-90"
                      title="Usar ubicación actual"
                    >
                      {gettingLocation ? (
                        <Loader2 size={18} className="animate-spin text-white" />
                      ) : (
                        <Navigation size={18} className="text-white" />
                      )}
                    </button>
                  </div>

                  {/* Destination Input */}
                  <div className="relative pl-12">
                    <input
                      id="destination"
                      placeholder="Destino"
                      className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 px-4 py-4 rounded-2xl outline-none text-base transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
                      value={destinationLocation}
                      onChange={onChangeHandler}
                      autoComplete="off"
                    />
                  </div>
                </div>

                {/* Search Button */}
                {pickupLocation.length > 2 && destinationLocation.length > 2 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => getDistanceAndFare(pickupLocation, destinationLocation)}
                    disabled={loading}
                    className="w-full h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-2xl shadow-lg transition-all disabled:opacity-50 mb-6"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 size={20} className="animate-spin" />
                        <span>Buscando...</span>
                      </div>
                    ) : (
                      'Buscar viaje'
                    )}
                  </motion.button>
                )}

                {/* Location Suggestions */}
                {isSearchingLocation && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 size={24} className="animate-spin text-emerald-500" />
                  </div>
                )}

                {locationSuggestion.length > 0 && !isSearchingLocation && (
                  <div className="space-y-2">
                    <LocationSuggestions
                      suggestions={locationSuggestion}
                      setSuggestions={setLocationSuggestion}
                      setPickupLocation={setPickupLocation}
                      setDestinationLocation={setDestinationLocation}
                      input={selectedInput}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Vehicle Selection & Ride Details - Keep existing components but render conditionally */}
      {!isSidebarOpen && (
        <>
          <SelectVehicle
            selectedVehicle={setSelectedVehicle}
            showPanel={showSelectVehiclePanel}
            setShowPanel={setShowSelectVehiclePanel}
            showPreviousPanel={setShowSearchPanel}
            showNextPanel={setShowRideDetailsPanel}
            fare={fare}
          />

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
        </>
      )}

      {/* Looking for Driver Overlay */}
      <AnimatePresence>
        {rideCreated && !confirmedRideData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
          >
            <motion.div
              initial={prefersReducedMotion ? { scale: 1 } : { scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-center px-6"
            >
              {/* Pulsing Pin */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-2xl"
              >
                <MapPin size={40} className="text-white" />
              </motion.div>

              <h2 className="text-3xl font-bold text-white mb-2">
                Buscando conductor
              </h2>
              <p className="text-gray-300 mb-8">
                Conectando con conductores cercanos...
              </p>

              {/* Cancel Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={cancelRide}
                disabled={loading}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold rounded-2xl border border-white/20 transition-all"
              >
                {loading ? 'Cancelando...' : 'Cancelar búsqueda'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
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