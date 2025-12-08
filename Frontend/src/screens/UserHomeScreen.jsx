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
import MapInteractionWrapper from "../components/MapInteractionWrapper";
import MessageNotificationBanner from "../components/ui/MessageNotificationBanner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
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

  // Paneles
  const [showFindTripPanel, setShowFindTripPanel] = useState(true);
  const [showSelectVehiclePanel, setShowSelectVehiclePanel] = useState(false);
  const [showRideDetailsPanel, setShowRideDetailsPanel] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [panelsVisible, setPanelsVisible] = useState(true); // For map interaction

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
              `${API_BASE_URL}/map/get-address?lat=${latitude}&lng=${longitude}`,
              {
                headers: { token: token },
                withCredentials: true,
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

  // Memoize debounced function properly - create it once and reuse
  const handleLocationChange = useMemo(
    () => debounce(async (inputValue, token) => {
      if (inputValue.length >= 3) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/map/get-suggestions?input=${inputValue}`,
            {
              headers: {
                token: token,
              },
              withCredentials: true,
            }
          );
          Console.log(response.data);
          setLocationSuggestion(response.data);
        } catch (error) {
          Console.error(error);
        }
      }
    }, 700),
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
        `${API_BASE_URL}/ride/get-fare?pickup=${encodeURIComponent(pickupLocation)}&destination=${encodeURIComponent(destinationLocation)}`,
        {
          headers: {
            token: token,
          },
          withCredentials: true,
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
        `${API_BASE_URL}/ride/create`,
        {
          pickup: pickupLocation,
          destination: destinationLocation,
          vehicleType: selectedVehicle,
        },
        {
          headers: {
            token: token,
          },
          withCredentials: true,
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
        `${API_BASE_URL}/ride/cancel?rideId=${rideDetails._id || rideDetails.confirmedRideData?._id}`,
        {
          headers: {
            token: token,
          },
          withCredentials: true,
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
              zoom={13}
              interactive={true}
              showMarker={true}
              markerColor="#276EF1"
              className="w-full h-full"
            />
          )}
        </MapInteractionWrapper>
      </div>
      
      {/* Componente Buscar viaje - Bottom Sheet Style with Glassmorphism + Map Interaction */}
      {showFindTripPanel && !isSidebarOpen && (
        <div className={`fixed bottom-0 left-0 right-0 z-10 flex flex-col justify-start p-4 pb-safe gap-4 rounded-t-3xl bg-slate-900/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] max-h-[60vh] md:max-h-[50vh] transition-all duration-300 ease-out ${
          panelsVisible ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-2"></div>
          <h1 className="text-2xl font-semibold text-white">Buscar viaje</h1>
          <div className="flex items-center relative w-full h-fit">
            <div className="h-3/5 w-[3px] flex flex-col items-center justify-between bg-gradient-to-b from-emerald-400 to-cyan-400 rounded-full absolute mx-5">
              <div className="w-2 h-2 rounded-full border-[3px] bg-slate-900 border-emerald-400"></div>
              <div className="w-2 h-2 rounded-sm border-[3px] bg-slate-900 border-cyan-400"></div>
            </div>
            <div className="w-full">
              <div className="relative">
                <input
                  id="pickup"
                  placeholder="Agregar punto de recogida"
                  className="w-full bg-white/10 backdrop-blur-xl border-2 border-white/20 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 pl-10 pr-12 py-3 rounded-xl outline-none text-sm mb-2 truncate transition-all text-white placeholder:text-slate-400"
                  value={pickupLocation}
                  onChange={onChangeHandler}
                  autoComplete="off"
                />
                <button
                  onClick={getCurrentLocation}
                  disabled={gettingLocation}
                  className="absolute right-2 top-1/2 -translate-y-1/2 -mt-1 p-2 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 active:scale-95 transition-all duration-200 text-white disabled:bg-slate-700 disabled:cursor-not-allowed shadow-lg"
                  title="Usar ubicación actual"
                >
                  <Navigation 
                    size={16} 
                    className={gettingLocation ? "animate-pulse" : ""} 
                  />
                </button>
              </div>
              <input
                id="destination"
                placeholder="Agregar destino"
                className="w-full bg-white/10 backdrop-blur-xl border-2 border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 pl-10 pr-4 py-3 rounded-xl outline-none text-sm truncate transition-all text-white placeholder:text-slate-400"
                value={destinationLocation}
                onChange={onChangeHandler}
                autoComplete="off"
              />
            </div>
          </div>
          {pickupLocation.length > 2 && destinationLocation.length > 2 && (
            <Button
              title={"Buscar"}
              loading={loading}
              fun={() => {
                getDistanceAndFare(pickupLocation, destinationLocation);
              }}
            />
          )}

          <div className="w-full h-full overflow-y-scroll">
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
