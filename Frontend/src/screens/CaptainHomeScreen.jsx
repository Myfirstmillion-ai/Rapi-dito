import { useContext, useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import toast from "react-hot-toast";
import { useCaptain } from "../contexts/CaptainContext";
import { SocketDataContext } from "../contexts/SocketContext";
import { NewRide, Sidebar } from "../components";
import MapboxStaticMap from "../components/maps/MapboxStaticMap";
import MessageNotificationBanner from "../components/ui/MessageNotificationBanner";
import { showRideRequestToast } from "../components/notifications/RideRequestToast";
import { useNavigate } from "react-router-dom";
import Console from "../utils/console";
import { useAlert } from "../hooks/useAlert";
import { Alert } from "../components";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu,
  Plus,
  Minus,
  Compass,
  TrendingUp,
  DollarSign,
  Activity,
  Clock,
  Star
} from "lucide-react";

// Coordenadas de San Antonio del Táchira
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

const playSound = (soundUrl) => {
  try {
    const audio = new Audio(soundUrl);
    audio.volume = 0.6;
    audio.play().catch(e => Console.log("Error reproduciendo sonido:", e));
  } catch (e) {
    Console.log("Error con audio:", e);
  }
};

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
  
  const activeRideToastsRef = useRef(new Map());

  const [showCaptainDetailsPanel, setShowCaptainDetailsPanel] = useState(true);
  const [showNewRidePanel, setShowNewRidePanel] = useState(
    JSON.parse(localStorage.getItem("showPanel")) || false
  );
  const [showBtn, setShowBtn] = useState(
    JSON.parse(localStorage.getItem("showBtn")) || "accept"
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mapZoom, setMapZoom] = useState(14);
  const [isLocating, setIsLocating] = useState(false);

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

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
        setCurrentRideStatus("accepted");
        
        vibrate([200, 100, 200]);
        playSound(NOTIFICATION_SOUNDS.rideAccepted);
        
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
        setMapCenter({
          lat: riderLocation.lat,
          lng: riderLocation.lng
        });
        setShowBtn("end-ride");
        setCurrentRideStatus("ongoing");
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
        
        setCompletedRideData({
          fare: newRide.fare,
          pickup: newRide.pickup,
          destination: newRide.destination,
          distance: newRide.distance
        });
        
        vibrate([300, 150, 300, 150, 300]);
        playSound(NOTIFICATION_SOUNDS.rideEnded);
        
        setShowRideCompleted(true);
        
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
      
      const locationInterval = setInterval(updateLocation, 30000);
      
      let activeRideLocationInterval = null;
      
      if (showBtn === "start" || showBtn === "end-ride") {
        activeRideLocationInterval = setInterval(() => {
          if (navigator.geolocation && newRide._id) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const location = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                
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
        }, 5000);
      }
      
      const handleNewRide = (data) => {
        Console.log("Nuevo viaje disponible:", data);
        vibrate([500, 200, 500, 200, 500]);
        playSound(NOTIFICATION_SOUNDS.newRide);
        
        setShowBtn("accept");
        setNewRide(data);
        setShowNewRidePanel(true);
        
        const toastId = showRideRequestToast(
          data,
          () => {
            acceptRide();
            activeRideToastsRef.current.delete(data._id);
          },
          () => {
            Console.log("Viaje rechazado por el conductor");
            activeRideToastsRef.current.delete(data._id);
          }
        );
        
        activeRideToastsRef.current.set(data._id, toastId);
      };

      const handleRideCancelled = (data) => {
        Console.log("Viaje cancelado", data);
        
        const toastId = activeRideToastsRef.current.get(data.rideId);
        if (toastId) {
          toast.dismiss(toastId);
          activeRideToastsRef.current.delete(data.rideId);
        }
        
        updateLocation();
        clearRideData();
      };
      
      const handleRideTaken = (data) => {
        Console.log("Viaje tomado por otro conductor", data);
        
        const toastId = activeRideToastsRef.current.get(data.rideId);
        if (toastId) {
          toast.dismiss(toastId);
          activeRideToastsRef.current.delete(data.rideId);
        }
        
        if (newRide?._id === data.rideId) {
          clearRideData();
        }
      };

      socket.on("new-ride", handleNewRide);
      socket.on("ride-cancelled", handleRideCancelled);
      socket.on("ride-taken", handleRideTaken);
      
      return () => {
        clearInterval(locationInterval);
        if (activeRideLocationInterval) {
          clearInterval(activeRideLocationInterval);
        }
        socket.off("new-ride", handleNewRide);
        socket.off("ride-cancelled", handleRideCancelled);
        socket.off("ride-taken", handleRideTaken);
      };
    }
  }, [captain?._id, socket, showBtn, newRide._id]);

  useEffect(() => {
    saveMessagesDebounced(messages);
  }, [messages, saveMessagesDebounced]);

  useEffect(() => {
    if (socket && newRide._id && newRide._id !== "123456789012345678901234") {
      socket.emit("join-room", newRide._id);

      const handleReceiveMessage = (data) => {
        const messageText = typeof data === 'string' ? data : (data?.msg || '');
        const messageBy = typeof data === 'string' ? 'other' : (data?.by || 'other');
        const messageTime = typeof data === 'string' ? '' : (data?.time || '');
        
        setMessages((prev) => [...prev, { msg: messageText, by: messageBy, time: messageTime }]);
        setUnreadMessages((prev) => prev + 1);
        
        setLastMessage({
          sender: newRide?.user?.fullname?.firstname || "Pasajero",
          text: messageText
        });
        
        setShowMessageBanner(true);
        playSound(NOTIFICATION_SOUNDS.newMessage);
        vibrate([200, 100, 200]);
      };

      socket.on("receiveMessage", handleReceiveMessage);

      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
      };
    }
  }, [newRide._id, socket]);

  useEffect(() => {
    saveRideDetailsDebounced(newRide);
  }, [newRide, saveRideDetailsDebounced]);

  useEffect(() => {
    savePanelStateDebounced(showNewRidePanel, showBtn);
  }, [showNewRidePanel, showBtn, savePanelStateDebounced]);

  // Calcular ganancias
  useEffect(() => {
    if (captain?.rides && Array.isArray(captain.rides)) {
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
    }
  }, [captain?.rides]);

  useEffect(() => {
    if (socket?.id) {
      Console.log("socket id:", socket.id);
    }
  }, [socket?.id]);

  const captainData = captain || {
    fullname: { firstname: "Cargando", lastname: "" },
    _id: null,
    vehicle: { type: "car", capacity: 4, number: "---", color: "Gris" }
  };

  return (
    <div className="relative w-full h-dvh overflow-hidden bg-white dark:bg-black">
      <Alert
        heading={alert.heading}
        text={alert.text}
        isVisible={alert.isVisible}
        onClose={hideAlert}
        type={alert.type}
      />
      <Sidebar onToggle={handleSidebarToggle} />
      
      {/* Map Container */}
      <div className="absolute inset-0 z-0">
        <MapboxStaticMap
          latitude={mapCenter.lat}
          longitude={mapCenter.lng}
          zoom={mapZoom}
          interactive={true}
          showMarker={true}
          markerColor="#05A357"
          className="w-full h-full"
        />
      </div>

      {/* Swiss Minimalist UI Layer */}
      {!isSidebarOpen && !showNewRidePanel && (
        <>
          {/* Top Bar - Captain Profile + Stats */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-6 left-6 right-6 z-20"
          >
            <div className="flex items-start justify-between gap-3">
              {/* Captain Profile Pill */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-3 pl-2 pr-4 py-2 bg-white dark:bg-gray-900 rounded-full shadow-lg border border-gray-200 dark:border-gray-800"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                  {captainData?.fullname?.firstname?.[0]?.toUpperCase() || 'C'}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {captainData?.fullname?.firstname}
                  </p>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Disponible</p>
                  </div>
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
            </div>
          </motion.div>

          {/* Map Controls - Right Side */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-6 top-24 z-20 flex flex-col gap-3"
          >
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMapZoom(prev => Math.min(prev + 1, 20))}
              className="w-12 h-12 rounded-full bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center"
            >
              <Plus size={20} className="text-gray-900 dark:text-white" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMapZoom(prev => Math.max(prev - 1, 1))}
              className="w-12 h-12 rounded-full bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center"
            >
              <Minus size={20} className="text-gray-900 dark:text-white" />
            </motion.button>

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

          {/* Bottom Stats Dashboard */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-8 left-6 right-6 z-20"
          >
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6">
              {/* Today's Earnings - Hero Stat */}
              <div className="mb-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Hoy ganaste</p>
                <p className="text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                  ${Math.round(earnings.today / 1000)}K
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                {/* Total Earnings */}
                <div className="text-center p-3 rounded-2xl bg-gray-50 dark:bg-gray-800">
                  <DollarSign size={18} className="mx-auto mb-1 text-emerald-500" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    ${Math.round(earnings.total / 1000)}K
                  </p>
                </div>

                {/* Rides Today */}
                <div className="text-center p-3 rounded-2xl bg-gray-50 dark:bg-gray-800">
                  <Activity size={18} className="mx-auto mb-1 text-blue-500" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Viajes</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {rides.accepted}
                  </p>
                </div>

                {/* Distance */}
                <div className="text-center p-3 rounded-2xl bg-gray-50 dark:bg-gray-800">
                  <TrendingUp size={18} className="mx-auto mb-1 text-purple-500" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Distancia</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {rides.distanceTravelled}km
                  </p>
                </div>
              </div>

              {/* Rating if available */}
              {captain?.rating && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-center gap-2">
                  <Star size={16} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {captain.rating.average.toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({captain.rating.count} calificaciones)
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}

      {/* New Ride Panel */}
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

      {/* Ride Completed Modal */}
      <AnimatePresence>
        {showRideCompleted && completedRideData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={prefersReducedMotion ? { scale: 1 } : { scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-8 w-full max-w-sm shadow-2xl"
            >
              {/* Success Icon */}
              <motion.div
                initial={prefersReducedMotion ? {} : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center"
              >
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </motion.div>

              <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
                ¡Viaje completado!
              </h2>
              <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
                Has finalizado el viaje exitosamente
              </p>
              
              {/* Earnings Display */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-2xl p-6 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-1">
                  Ganancia del viaje
                </p>
                <p className="text-4xl font-black text-center text-emerald-600 dark:text-emerald-400">
                  ${completedRideData.fare?.toLocaleString('es-CO') || 0}
                </p>
              </div>
              
              {/* Distance */}
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Distancia: {Math.round((completedRideData.distance || 0) / 1000)} km
                </p>
              </div>
              
              {/* Continue Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={closeRideCompleted}
                className="w-full h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-2xl shadow-lg transition-all"
              >
                Continuar
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
          navigate(`/captain/chat/${newRide?._id}`);
        }}
      />
    </div>
  );
}

export default CaptainHomeScreen;