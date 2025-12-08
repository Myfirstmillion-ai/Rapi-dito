import { useContext, useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { useCaptain } from "../contexts/CaptainContext";
import { Phone, User, ChevronDown, ChevronUp, TrendingUp, MapPin, DollarSign, Award } from "lucide-react";
import { SocketDataContext } from "../contexts/SocketContext";
import { NewRide, Sidebar } from "../components";
import DriverStatsPill from "../components/DriverStatsPill";
import MapboxStaticMap from "../components/maps/MapboxStaticMap";
import MessageNotificationBanner from "../components/ui/MessageNotificationBanner";
import { DashboardSkeleton } from "../components/ui/FintechSkeleton";
import { useNavigate } from "react-router-dom";
import Console from "../utils/console";
import { useAlert } from "../hooks/useAlert";
import { Alert } from "../components";
import { getVehicleColor } from "../utils/vehicleColors";

// Coordenadas de San Antonio del Táchira, Colombia (frontera)
const DEFAULT_LOCATION = {
  lat: 7.8146,
  lng: -72.4430
};

// URLs de sonidos de notificación
const NOTIFICATION_SOUNDS = {
  newRide: "https://assets.mixkit.co/active_storage/sfx/2645/2645-preview.mp3",
  rideAccepted: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
  rideEnded: "https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3",
  newMessage: "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3"
};

// Función para reproducir sonido
const playSound = (soundUrl) => {
  try {
    const audio = new Audio(soundUrl);
    audio.volume = 0.6;
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

const defaultRideData = {
  user: {
    fullname: {
      firstname: "Sin",
      lastname: "Usuario",
    },
    _id: "",
    email: "ejemplo@gmail.com",
    rides: [],
  },
  pickup: "Lugar, Ciudad, Estado, País",
  destination: "Lugar, Ciudad, Estado, País",
  fare: 0,
  vehicle: "car",
  status: "pending",
  duration: 0,
  distance: 0,
  _id: "123456789012345678901234",
};

function CaptainHomeScreen() {
  const token = localStorage.getItem("token");

  const { captain, setCaptain } = useCaptain();
  const { socket } = useContext(SocketDataContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(true); // Loading state for dashboard data
  const { alert, showAlert, hideAlert } = useAlert();
  
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [showMessageBanner, setShowMessageBanner] = useState(false);
  const [lastMessage, setLastMessage] = useState({ sender: "", text: "" });

  const [riderLocation, setRiderLocation] = useState({
    lat: DEFAULT_LOCATION.lat,
    lng: DEFAULT_LOCATION.lng,
  });
  const [mapCenter, setMapCenter] = useState({
    lat: DEFAULT_LOCATION.lat,
    lng: DEFAULT_LOCATION.lng
  });
  const [earnings, setEarnings] = useState({
    total: 0,
    today: 0,
  });

  const [rides, setRides] = useState({
    accepted: 0,
    cancelled: 0,
    distanceTravelled: 0,
  });
  const [newRide, setNewRide] = useState(
    JSON.parse(localStorage.getItem("rideDetails")) || defaultRideData
  );

  const [otp, setOtp] = useState("");
  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem("messages")) || []
  );
  const [error, setError] = useState("");
  const [showRideCompleted, setShowRideCompleted] = useState(false);
  const [completedRideData, setCompletedRideData] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentRideStatus, setCurrentRideStatus] = useState("pending");
  const locationUpdateInterval = useRef(null);

  // Paneles
  const [showCaptainDetailsPanel, setShowCaptainDetailsPanel] = useState(true);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false); // Changed to false by default for better UX
  const [showNewRidePanel, setShowNewRidePanel] = useState(
    JSON.parse(localStorage.getItem("showPanel")) || false
  );
  const [showBtn, setShowBtn] = useState(
    JSON.parse(localStorage.getItem("showBtn")) || "accept"
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handle sidebar toggle - hide all panels when sidebar opens
  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  // Función para refrescar datos del conductor
  const refreshCaptainData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/captain/profile`,
        {
          headers: { token: token }
        }
      );
      if (response.data.captain) {
        setCaptain(response.data.captain);
        localStorage.setItem("userData", JSON.stringify({
          type: "captain",
          data: response.data.captain,
        }));
      }
    } catch (error) {
      Console.log("Error refrescando datos:", error);
    }
  };

  const acceptRide = async () => {
    try {
      if (newRide._id !== "") {
        setLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/ride/confirm`,
          { rideId: newRide._id },
          {
            headers: {
              token: token,
            },
          }
        );
        setLoading(false);
        setShowBtn("otp");
        setCurrentRideStatus("accepted"); // Driver on the way to pickup
        
        // Vibrar y reproducir sonido al aceptar
        vibrate([200, 100, 200]);
        playSound(NOTIFICATION_SOUNDS.rideAccepted);
        
        // Update map center to driver's location
        setMapCenter({
          lat: riderLocation.lat,
          lng: riderLocation.lng
        });
        Console.log(response);
      }
    } catch (error) {
      setLoading(false);
      showAlert('Ocurrió un error', error.response?.data?.message || 'Error desconocido', 'failure');
      Console.log(error.response);
      setTimeout(() => {
        clearRideData();
      }, 1000);
    }
  };

  const verifyOTP = async () => {
    try {
      if (newRide._id !== "" && otp.length === 6) {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/ride/start-ride?rideId=${newRide._id}&otp=${otp}`,
          {
            headers: {
              token: token,
            },
          }
        );
        // Update map center to current location
        setMapCenter({
          lat: riderLocation.lat,
          lng: riderLocation.lng
        });
        setShowBtn("end-ride");
        setCurrentRideStatus("ongoing"); // Ride in progress
        setLoading(false);
        Console.log(response);
      }
    } catch (err) {
      setLoading(false);
      setError("OTP inválido");
      Console.log(err);
    }
  };

  const endRide = async () => {
    try {
      if (newRide._id !== "") {
        setLoading(true);
        await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/ride/end-ride`,
          {
            rideId: newRide._id,
          },
          {
            headers: {
              token: token,
            },
          }
        );
        
        // Guardar datos del viaje completado
        setCompletedRideData({
          fare: newRide.fare,
          pickup: newRide.pickup,
          destination: newRide.destination,
          distance: newRide.distance
        });
        
        // Vibrar y reproducir sonido
        vibrate([300, 150, 300, 150, 300]);
        playSound(NOTIFICATION_SOUNDS.rideEnded);
        
        // Mostrar pantalla de viaje completado
        setShowRideCompleted(true);
        
        // Reset map to current location
        setMapCenter({
          lat: riderLocation.lat,
          lng: riderLocation.lng
        });
        setShowBtn("accept");
        setCurrentRideStatus("pending");
        setLoading(false);
        setShowCaptainDetailsPanel(false);
        setShowNewRidePanel(false);
        setNewRide(defaultRideData);
        localStorage.removeItem("rideDetails");
        localStorage.removeItem("showPanel");
        localStorage.removeItem("messages");
        
        // Refrescar datos del conductor para actualizar ganancias
        await refreshCaptainData();
      }
    } catch (err) {
      setLoading(false);
      Console.log(err);
    }
  };

  const cancelRide = async () => {
    try {
      if (newRide._id !== "") {
        setLoading(true);
        await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/ride/cancel`,
          {
            rideId: newRide._id,
          },
          {
            headers: {
              token: token,
            },
          }
        );
        
        setLoading(false);
        showAlert('Viaje cancelado', 'El viaje ha sido cancelado exitosamente', 'success');
        
        // Reset to initial state
        clearRideData();
      }
    } catch (err) {
      setLoading(false);
      showAlert('Error', err.response?.data?.message || 'No se pudo cancelar el viaje', 'failure');
      Console.log(err);
    }
  };

  const closeRideCompleted = () => {
    setShowRideCompleted(false);
    setCompletedRideData(null);
    setShowCaptainDetailsPanel(true);
  };

  const updateLocation = () => {
    if (navigator.geolocation && captain?._id && socket) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          setRiderLocation(location);
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });

          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          
          socket.emit("update-location-captain", {
            userId: captain._id,
            location: location,
          });
        },
        (error) => {
          console.error("Error obteniendo posición:", error);
          // Usar ubicación por defecto
          setMapCenter({
            lat: DEFAULT_LOCATION.lat,
            lng: DEFAULT_LOCATION.lng
          });
        }
      );
    }
  };

  const clearRideData = () => {
    setShowBtn("accept");
    setLoading(false);
    setShowCaptainDetailsPanel(true);
    setShowNewRidePanel(false);
    setNewRide(defaultRideData);
    setCurrentRideStatus("pending");
    localStorage.removeItem("rideDetails");
    localStorage.removeItem("showPanel");
  };

  // Debounced localStorage save functions to avoid excessive writes
  const saveMessagesDebounced = useMemo(
    () => debounce((messages) => {
      localStorage.setItem("messages", JSON.stringify(messages));
    }, 1000),
    []
  );

  const saveRideDetailsDebounced = useMemo(
    () => debounce((rideDetails) => {
      localStorage.setItem("rideDetails", JSON.stringify(rideDetails));
    }, 500),
    []
  );

  const savePanelStateDebounced = useMemo(
    () => debounce((showPanel, showBtnState) => {
      localStorage.setItem("showPanel", JSON.stringify(showPanel));
      localStorage.setItem("showBtn", JSON.stringify(showBtnState));
    }, 500),
    []
  );

  // Socket connection and location updates
  useEffect(() => {
    if (captain?._id && socket) {
      socket.emit("join", {
        userId: captain._id,
        userType: "captain",
      });

      updateLocation();
      
      // Actualizar ubicación cada 30 segundos
      const locationInterval = setInterval(updateLocation, 30000);
      
      // Real-time location tracking for active rides
      let activeRideLocationInterval = null;
      
      if (showBtn === "start" || showBtn === "end-ride") {
        // During active ride, send location every 5 seconds
        activeRideLocationInterval = setInterval(() => {
          if (navigator.geolocation && newRide._id) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const location = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                
                // Send location update via socket
                socket.emit("driver:locationUpdate", {
                  driverId: captain._id,
                  location,
                  rideId: newRide._id,
                });
                
                Console.log("Ubicación enviada:", location);
              },
              (error) => {
                Console.log("Error obteniendo ubicación:", error);
              }
            );
          }
        }, 5000); // Update every 5 seconds
      }
      
      // Handler para nuevos viajes
      const handleNewRide = (data) => {
        Console.log("Nuevo viaje disponible:", data);
        vibrate([500, 200, 500, 200, 500]);
        playSound(NOTIFICATION_SOUNDS.newRide);
        
        // AUTO-MINIMIZE LOGIC: If driver panel is expanded, minimize it to show map and notification
        if (isPanelExpanded) {
          setIsPanelExpanded(false);
        }
        
        setShowBtn("accept");
        setNewRide(data);
        setShowNewRidePanel(true);
      };

      // Handler para viajes cancelados
      const handleRideCancelled = (data) => {
        Console.log("Viaje cancelado", data);
        updateLocation();
        clearRideData();
      };

      socket.on("new-ride", handleNewRide);
      socket.on("ride-cancelled", handleRideCancelled);
      
      return () => {
        clearInterval(locationInterval);
        if (activeRideLocationInterval) {
          clearInterval(activeRideLocationInterval);
        }
        socket.off("new-ride", handleNewRide);
        socket.off("ride-cancelled", handleRideCancelled);
      };
    }
  }, [captain?._id, socket, showBtn, newRide._id, isPanelExpanded]);

  // Guardar mensajes en localStorage (debounced)
  useEffect(() => {
    saveMessagesDebounced(messages);
  }, [messages, saveMessagesDebounced]);

  // Socket de mensajes - room handling
  useEffect(() => {
    if (socket && newRide._id && newRide._id !== "123456789012345678901234") {
      socket.emit("join-room", newRide._id);

      const handleReceiveMessage = (data) => {
        // Fix: data is an object {msg, by, time}, not a string
        const messageText = typeof data === 'string' ? data : (data?.msg || '');
        const messageBy = typeof data === 'string' ? 'other' : (data?.by || 'other');
        const messageTime = typeof data === 'string' ? '' : (data?.time || '');
        
        setMessages((prev) => [...prev, { msg: messageText, by: messageBy, time: messageTime }]);
        setUnreadMessages((prev) => prev + 1);
        
        // Set message info for banner - use msg property
        setLastMessage({
          sender: newRide?.user?.fullname?.firstname || "Pasajero",
          text: messageText
        });
        
        // Show notification banner
        setShowMessageBanner(true);
        
        // Play sound and vibrate
        playSound(NOTIFICATION_SOUNDS.newMessage);
        vibrate([200, 100, 200]);
      };

      socket.on("receiveMessage", handleReceiveMessage);

      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
      };
    }
  }, [newRide._id, socket]);

  // Guardar detalles del viaje (debounced)
  useEffect(() => {
    saveRideDetailsDebounced(newRide);
  }, [newRide, saveRideDetailsDebounced]);

  // Guardar estado de paneles (debounced)
  useEffect(() => {
    savePanelStateDebounced(showNewRidePanel, showBtn);
  }, [showNewRidePanel, showBtn, savePanelStateDebounced]);

  // Calcular ganancias
  useEffect(() => {
    if (captain?.rides && Array.isArray(captain.rides)) {
      setDashboardLoading(true); // Start loading
      
      let Totalearnings = 0;
      let Todaysearning = 0;
      let acceptedRides = 0;
      let cancelledRides = 0;
      let distanceTravelled = 0;

      const today = new Date();
      const todayWithoutTime = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      captain.rides.forEach((ride) => {
        if (ride.status === "completed") {
          acceptedRides++;
          distanceTravelled += ride.distance || 0;
          Totalearnings += ride.fare || 0;
          
          const rideDate = new Date(ride.updatedAt);
          const rideDateWithoutTime = new Date(
            rideDate.getFullYear(),
            rideDate.getMonth(),
            rideDate.getDate()
          );

          if (rideDateWithoutTime.getTime() === todayWithoutTime.getTime()) {
            Todaysearning += ride.fare || 0;
          }
        }
        if (ride.status === "cancelled") cancelledRides++;
      });

      setEarnings({ total: Totalearnings, today: Todaysearning });
      setRides({
        accepted: acceptedRides,
        cancelled: cancelledRides,
        distanceTravelled: Math.round(distanceTravelled / 1000),
      });
      
      // Simulate minimum loading time for smooth UX
      setTimeout(() => setDashboardLoading(false), 800);
    } else {
      // No captain data yet
      setDashboardLoading(true);
    }
  }, [captain?.rides]);

  // Debug socket
  useEffect(() => {
    if (socket?.id) {
      Console.log("socket id:", socket.id);
    }
  }, [socket?.id]);

  // Safe captain data with defaults
  const captainData = captain || {
    fullname: { firstname: "Cargando", lastname: "" },
    _id: null,
    vehicle: { type: "car", capacity: 4, number: "---", color: "Gris" }
  };

  return (
    <div className="relative w-full h-dvh overflow-hidden">
      <Alert
        heading={alert.heading}
        text={alert.text}
        isVisible={alert.isVisible}
        onClose={hideAlert}
        type={alert.type}
      />
      <Sidebar onToggle={handleSidebarToggle} />
      
      {/* Map Container - Full Height */}
      <div className="absolute inset-0 z-0">
        <MapboxStaticMap
          latitude={mapCenter.lat}
          longitude={mapCenter.lng}
          zoom={13}
          interactive={true}
          showMarker={true}
          markerColor="#05A357"
          className="w-full h-full"
        />
      </div>

      {/* Modal de viaje completado */}
      {showRideCompleted && completedRideData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl transform animate-scale-in">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Viaje Completado!</h2>
              <p className="text-gray-600 mb-4">Has finalizado el viaje exitosamente</p>
              
              <div className="bg-green-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-600">Ganancia del viaje</p>
                <p className="text-3xl font-bold text-green-600">COP$ {completedRideData.fare?.toLocaleString('es-CO')}</p>
              </div>
              
              <div className="text-left bg-gray-50 rounded-xl p-3 mb-4 text-sm">
                <p className="text-gray-500">Distancia: {Math.round((completedRideData.distance || 0) / 1000)} km</p>
              </div>
              
              <button
                onClick={closeRideCompleted}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Captain Dashboard - Compact Pill or Full Panel */}
      {showCaptainDetailsPanel && !isSidebarOpen && !isPanelExpanded && (
        <DriverStatsPill
          captain={captainData}
          vehicle={captainData?.vehicle}
          onExpand={() => setIsPanelExpanded(true)}
        />
      )}

      {/* Captain Premium Dashboard - Expanded View - Bento Grid Layout */}
      {showCaptainDetailsPanel && !isSidebarOpen && isPanelExpanded && (
        <div className={`fixed bottom-0 left-0 right-0 z-10 bg-slate-900/95 backdrop-blur-xl shadow-2xl transition-all duration-500 ease-in-out ${
          isPanelExpanded ? 'max-h-[75vh]' : 'max-h-[100px]'
        } rounded-t-3xl overflow-hidden border-t-2 border-white/10`}>
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          
          {/* Handle bar and toggle */}
          <div className="relative">
            <button
              onClick={() => setIsPanelExpanded(!isPanelExpanded)}
              className="w-full py-3 flex flex-col items-center gap-1 hover:bg-white/5 transition-colors active:scale-95"
            >
              <div className="w-12 h-1.5 bg-white/30 rounded-full shadow-sm"></div>
              {isPanelExpanded ? (
                <ChevronDown className="w-5 h-5 text-white/60 mt-1" />
              ) : (
                <ChevronUp className="w-5 h-5 text-white/60 mt-1" />
              )}
            </button>
          </div>

          <div className="relative px-4 pb-safe overflow-y-auto" style={{ maxHeight: isPanelExpanded ? 'calc(75vh - 60px)' : '0' }}>
            {dashboardLoading ? (
              /* Show skeleton while loading */
              <DashboardSkeleton />
            ) : (
              <>
                {/* Compact Header - Driver Profile */}
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    {/* Profile Photo */}
                    <div className="relative">
                      {captain?.profileImage ? (
                        <img
                          src={captain.profileImage}
                          alt="Profile"
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-500/60 shadow-xl"
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center ring-2 ring-emerald-500/60 shadow-xl"
                        style={{ display: captain?.profileImage ? 'none' : 'flex' }}
                      >
                        <span className="text-xl font-black text-white">
                          {captainData?.fullname?.firstname?.[0] || "C"}
                          {captainData?.fullname?.lastname?.[0] || ""}
                        </span>
                      </div>
                      {/* Online indicator */}
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900 shadow-lg"></div>
                    </div>

                    {/* Driver Info - Compact */}
                    <div>
                      <h1 className="text-base font-bold text-white leading-tight whitespace-nowrap">
                        {captainData?.fullname?.firstname} {captainData?.fullname?.lastname}
                      </h1>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Award size={12} className="text-yellow-400" />
                        <span className="text-xs text-yellow-400 font-semibold whitespace-nowrap">Conductor Pro</span>
                      </div>
                    </div>
                  </div>
                </div>

            {/* Bento Grid - Stats Dashboard - PREMIUM FINTECH STYLE */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Today's Earnings - Featured Large Card */}
              <div className="col-span-2 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 backdrop-blur-sm border-2 border-emerald-500/30 rounded-2xl p-5 shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 active:scale-[0.98]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-emerald-300 font-semibold uppercase tracking-wide whitespace-nowrap">
                    💰 Ganancias Hoy
                  </p>
                  <div className="flex items-center gap-1 bg-emerald-500/20 px-2 py-1 rounded-lg">
                    <TrendingUp size={12} className="text-emerald-400" />
                    <span className="text-[10px] text-emerald-300 font-bold">HOY</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-white/70">COP$</span>
                  <h1 className="text-5xl font-black bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent whitespace-nowrap">
                    {earnings.today.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                  </h1>
                </div>
                <p className="text-xs text-white/40 mt-1">
                  {rides.accepted > 0 ? `Promedio: COP$ ${Math.round(earnings.today / rides.accepted).toLocaleString('es-CO')} por viaje` : 'Sin viajes hoy'}
                </p>
              </div>

              {/* Total Earnings - Compact */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98] group">
                <p className="text-xs text-white/50 font-medium mb-2 whitespace-nowrap flex items-center gap-1">
                  <DollarSign size={14} className="text-purple-400 group-hover:scale-110 transition-transform" />
                  Total Acumulado
                </p>
                <h3 className="text-3xl font-black text-white whitespace-nowrap">
                  {earnings.total >= 1000 
                    ? `${(earnings.total / 1000).toFixed(1)}K` 
                    : earnings.total.toLocaleString('es-CO')}
                </h3>
                <p className="text-[10px] text-white/40 mt-1 whitespace-nowrap">
                  COP$ {earnings.total.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                </p>
              </div>

              {/* Completed Rides - Compact */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-emerald-500/30 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98] group">
                <p className="text-xs text-white/50 font-medium mb-2 whitespace-nowrap flex items-center gap-1">
                  <MapPin size={14} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                  Viajes
                </p>
                <h3 className="text-4xl font-black text-emerald-400 group-hover:text-emerald-300 transition-colors">
                  {rides?.accepted || 0}
                </h3>
                <p className="text-[10px] text-white/40 mt-1 whitespace-nowrap">Completados</p>
              </div>

              {/* Distance - Compact */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/30 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98] group">
                <p className="text-xs text-white/50 font-medium mb-2 whitespace-nowrap flex items-center gap-1">
                  <TrendingUp size={14} className="text-purple-400 group-hover:scale-110 transition-transform" />
                  Distancia
                </p>
                <h3 className="text-4xl font-black text-purple-400 group-hover:text-purple-300 transition-colors">
                  {rides?.distanceTravelled || 0}
                </h3>
                <p className="text-[10px] text-white/40 mt-1 whitespace-nowrap">Kilómetros</p>
              </div>

              {/* Acceptance Rate - Compact */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-yellow-500/30 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98] group">
                <p className="text-xs text-white/50 font-medium mb-2 whitespace-nowrap flex items-center gap-1">
                  <Award size={14} className="text-yellow-400 group-hover:scale-110 transition-transform" />
                  Aceptación
                </p>
                <h3 className="text-4xl font-black text-yellow-400 group-hover:text-yellow-300 transition-colors">
                  {rides?.accepted > 0 ? Math.round((rides.accepted / (rides.accepted + rides.cancelled)) * 100) : 100}%
                </h3>
                <p className="text-[10px] text-white/40 mt-1 whitespace-nowrap">Tasa</p>
              </div>
            </div>

                {/* Vehicle Info Card - Compact */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 shadow-lg mb-4 hover:border-white/20 transition-all duration-300 active:scale-[0.98]">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-white/50 mb-1 whitespace-nowrap">Vehículo</p>
                      <h3 className="text-lg font-bold text-white tracking-tight mb-1 whitespace-nowrap">
                        {captainData?.vehicle?.number || "---"}
                      </h3>
                      {/* Vehicle Make and Model */}
                      {(captainData?.vehicle?.make || captainData?.vehicle?.model) && (
                        <p className="text-sm font-medium text-emerald-400 mb-2 whitespace-nowrap">
                          {[captainData?.vehicle?.make, captainData?.vehicle?.model].filter(Boolean).join(' ')}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-sm text-gray-300">
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: getVehicleColor(captainData?.vehicle?.color) }}
                          ></div>
                          {captainData?.vehicle?.color || "Gris"}
                        </span>
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <User size={14} />
                          {captainData?.vehicle?.capacity || 4}
                        </span>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2">
                      <img
                        className="h-14 scale-x-[-1] filter drop-shadow-lg"
                        src={
                          captainData?.vehicle?.type === "car"
                            ? "/car.png"
                            : `/${captainData?.vehicle?.type || "car"}.webp`
                        }
                        alt="Vehículo"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* New ride panel - Hidden when sidebar is open */}
      {!isSidebarOpen && (
        <NewRide
          rideData={newRide}
          otp={otp}
          setOtp={setOtp}
          showBtn={showBtn}
          showPanel={showNewRidePanel}
          setShowPanel={setShowNewRidePanel}
          showPreviousPanel={setShowCaptainDetailsPanel}
          loading={loading}
          acceptRide={acceptRide}
          verifyOTP={verifyOTP}
          endRide={endRide}
          cancelRide={cancelRide}
          error={error}
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
          navigate(`/captain/chat/${newRide?._id}`);
        }}
      />
    </div>
  );
}

export default CaptainHomeScreen;