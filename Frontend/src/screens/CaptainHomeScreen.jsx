import { useContext, useEffect, useState } from "react";
import map from "/map.png";
import axios from "axios";
import { useCaptain } from "../contexts/CaptainContext";
import { Phone, User } from "lucide-react";
import { SocketDataContext } from "../contexts/SocketContext";
import { NewRide, RatingModal, Sidebar } from "../components";
import Console from "../utils/console";
import { useAlert } from "../hooks/useAlert";
import { Alert } from "../components";

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
  const [loading, setLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  const [riderLocation, setRiderLocation] = useState({
    ltd: DEFAULT_LOCATION.lat,
    lng: DEFAULT_LOCATION.lng,
  });
  const [mapLocation, setMapLocation] = useState(
    `https://www.google.com/maps?q=${DEFAULT_LOCATION.lat},${DEFAULT_LOCATION.lng}&output=embed`
  );
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

  // Rating modal
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rideToRate, setRideToRate] = useState(null);

  // Paneles
  const [showCaptainDetailsPanel, setShowCaptainDetailsPanel] = useState(true);
  const [showNewRidePanel, setShowNewRidePanel] = useState(
    JSON.parse(localStorage.getItem("showPanel")) || false
  );
  const [showBtn, setShowBtn] = useState(
    JSON.parse(localStorage.getItem("showBtn")) || "accept"
  );

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
        
        // Vibrar y reproducir sonido al aceptar
        vibrate([200, 100, 200]);
        playSound(NOTIFICATION_SOUNDS.rideAccepted);
        
        setMapLocation(
          `https://www.google.com/maps?q=${riderLocation.ltd},${riderLocation.lng} to ${encodeURIComponent(newRide.pickup)}&output=embed`
        );
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
        setMapLocation(
          `https://www.google.com/maps?q=${riderLocation.ltd},${riderLocation.lng} to ${encodeURIComponent(newRide.destination)}&output=embed`
        );
        setShowBtn("end-ride");
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
        
        // Show rating modal
        setRideToRate(newRide);
        setShowRatingModal(true);
        
        // Mostrar pantalla de viaje completado
        setShowRideCompleted(true);
        
        setMapLocation(
          `https://www.google.com/maps?q=${riderLocation.ltd},${riderLocation.lng}&output=embed`
        );
        setShowBtn("accept");
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

  const closeRideCompleted = () => {
    setShowRideCompleted(false);
    setCompletedRideData(null);
    setShowCaptainDetailsPanel(true);
  };

  // Handle rating submission
  const handleRatingSubmit = async ({ rating, comment, ratingFor }) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/ride/rate`,
        {
          rideId: rideToRate._id,
          rating,
          comment,
          ratingFor
        },
        {
          headers: { token: token }
        }
      );
      Console.log("Calificación enviada exitosamente");
    } catch (error) {
      Console.log("Error al enviar calificación:", error);
      throw error;
    }
  };

  const updateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setRiderLocation({
            ltd: position.coords.latitude,
            lng: position.coords.longitude,
          });

          setMapLocation(
            `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}&output=embed`
          );
          socket.emit("update-location-captain", {
            userId: captain._id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        },
        (error) => {
          console.error("Error obteniendo posición:", error);
          // Usar ubicación por defecto
          setMapLocation(
            `https://www.google.com/maps?q=${DEFAULT_LOCATION.lat},${DEFAULT_LOCATION.lng}&output=embed`
          );
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
    localStorage.removeItem("rideDetails");
    localStorage.removeItem("showPanel");
  };

  useEffect(() => {
    if (captain._id) {
      socket.emit("join", {
        userId: captain._id,
        userType: "captain",
      });

      updateLocation();
      
      // Actualizar ubicación cada 30 segundos
      const locationInterval = setInterval(updateLocation, 30000);
      
      return () => clearInterval(locationInterval);
    }

    socket.on("new-ride", (data) => {
      Console.log("Nuevo viaje disponible:", data);
      // Vibrar y reproducir sonido
      vibrate([500, 200, 500, 200, 500]);
      playSound(NOTIFICATION_SOUNDS.newRide);
      
      setShowBtn("accept");
      setNewRide(data);
      setShowNewRidePanel(true);
    });

    socket.on("ride-cancelled", (data) => {
      Console.log("Viaje cancelado", data);
      updateLocation();
      clearRideData();
    });

    return () => {
      socket.off("new-ride");
      socket.off("ride-cancelled");
    };
  }, [captain]);

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    socket.emit("join-room", newRide._id);

    socket.on("receiveMessage", async (msg) => {
      setMessages((prev) => [...prev, { msg, by: "other" }]);
      playSound(NOTIFICATION_SOUNDS.newMessage);
      vibrate([100]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [newRide]);

  useEffect(() => {
    localStorage.setItem("rideDetails", JSON.stringify(newRide));
  }, [newRide]);

  useEffect(() => {
    localStorage.setItem("showPanel", JSON.stringify(showNewRidePanel));
    localStorage.setItem("showBtn", JSON.stringify(showBtn));
  }, [showNewRidePanel, showBtn]);

  const calculateEarnings = () => {
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

    if (captain.rides && Array.isArray(captain.rides)) {
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
    }

    setEarnings({ total: Totalearnings, today: Todaysearning });
    setRides({
      accepted: acceptedRides,
      cancelled: cancelledRides,
      distanceTravelled: Math.round(distanceTravelled / 1000),
    });
  };

  useEffect(() => {
    calculateEarnings();
  }, [captain]);

  useEffect(() => {
    if (mapLocation.ltd && mapLocation.lng) {
      Console.log(mapLocation);
    }
  }, [mapLocation]);

  useEffect(() => {
    if (socket.id) Console.log("socket id:", socket.id);
  }, [socket.id]);

  return (
    <div
      className="relative w-full h-dvh bg-contain bg-center"
      style={{ backgroundImage: `url(${map})` }}
    >
      <Alert
        heading={alert.heading}
        text={alert.text}
        isVisible={alert.isVisible}
        onClose={hideAlert}
        type={alert.type}
      />
      <Sidebar />
      <iframe
        src={mapLocation}
        className="map w-full h-[80vh] touch-none"
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        style={{ touchAction: "pan-x pan-y" }}
      ></iframe>

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

      {showCaptainDetailsPanel && (
        <div className="absolute bottom-0 flex flex-col justify-start p-4 gap-2 rounded-t-lg bg-white h-fit w-full shadow-lg">
          {/* Detalles del conductor */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="my-2 select-none rounded-full w-10 h-10 bg-blue-400 mx-auto flex items-center justify-center">
                <h1 className="text-lg text-white">
                  {captain?.fullname?.firstname[0]}
                  {captain?.fullname?.lastname[0]}
                </h1>
              </div>

              <div>
                <h1 className="text-lg font-semibold leading-6">
                  {captain?.fullname?.firstname} {captain?.fullname?.lastname}
                </h1>
                <p className="text-xs flex items-center gap-1 text-gray-500 ">
                  <Phone size={12} />
                  {captain?.phone}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-500 ">Ganancias hoy</p>
              <h1 className="font-semibold">COP$ {earnings.today.toLocaleString('es-CO')}</h1>
            </div>
          </div>

          {/* Detalles de viajes */}
          <div className="flex justify-around items-center mt-2 py-4 rounded-lg bg-zinc-800">
            <div className="flex flex-col items-center text-white">
              <h1 className="mb-1 text-xl">{rides?.accepted}</h1>
              <p className="text-xs text-gray-400 text-center leading-3">
                Viajes
                <br />
                Completados
              </p>
            </div>
            <div className="flex flex-col items-center text-white">
              <h1 className="mb-1 text-xl">{rides?.distanceTravelled}</h1>
              <p className="text-xs text-gray-400 text-center leading-3">
                Km
                <br />
                Recorridos
              </p>
            </div>
            <div className="flex flex-col items-center text-white">
              <h1 className="mb-1 text-xl">{rides?.cancelled}</h1>
              <p className="text-xs text-gray-400 text-center leading-3">
                Viajes
                <br />
                Cancelados
              </p>
            </div>
          </div>

          {/* Detalles del vehículo */}
          <div className="flex justify-between border-2 items-center pl-3 py-2 rounded-lg">
            <div>
              <h1 className="text-lg font-semibold leading-6 tracking-tighter ">
                {captain?.vehicle?.number}
              </h1>
              <p className="text-xs text-gray-500 flex items-center">
                {captain?.vehicle?.color} |
                <User size={12} strokeWidth={2.5} /> {captain?.vehicle?.capacity}
              </p>
            </div>

            <img
              className="rounded-full h-16 scale-x-[-1]"
              src={
                captain?.vehicle?.type === "car"
                  ? "/car.png"
                  : `/${captain?.vehicle?.type}.webp`
              }
              alt="Imagen del vehículo"
            />
          </div>
        </div>
      )}

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
        error={error}
      />

      {/* Rating Modal */}
      <RatingModal
        show={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
        ratingFor="user"
        targetName={rideToRate?.user?.fullname ? 
          `${rideToRate.user.fullname.firstname} ${rideToRate.user.fullname.lastname || ''}`.trim() 
          : ""}
      />
    </div>
  );
}

export default CaptainHomeScreen;
