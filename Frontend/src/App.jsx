import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import {
  GetStarted,
  UserLogin,
  CaptainLogin,
  UserHomeScreen,
  CaptainHomeScreen,
  UserProtectedWrapper,
  CaptainProtectedWrapper,
  UserSignup,
  CaptainSignup,
  RideHistory,
  UserEditProfile,
  CaptainEditProfile,
  Error,
  ChatScreen,
  VerifyEmail,
  ResetPassword,
  ForgotPassword
} from "./screens/";
import { logger } from "./utils/logger";
import { SocketDataContext } from "./contexts/SocketContext";
import { useEffect, useContext } from "react";
import { ChevronLeft, Trash2 } from "lucide-react";
import ToastProvider from "./components/notifications/ToastProvider";
import { AnimatePresence, motion } from "framer-motion";

function App() {
  return (
    <div className="w-full h-dvh flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div className="relative w-full sm:min-w-[400px] sm:max-w-[430px] md:max-w-[400px] h-full sm:h-[95vh] sm:max-h-[900px] bg-white overflow-hidden sm:rounded-3xl sm:shadow-2xl transition-all duration-300 ease-in-out">
        {/* Botón de reseteo de emergencia */}
        <div className="absolute top-36 -right-11 opacity-20 hover:opacity-100 z-50 flex items-center p-1 PL-0 gap-1 bg-zinc-50 border-2 border-r-0 border-gray-300 hover:-translate-x-11 rounded-l-md transition-all duration-300">
          <ChevronLeft />
          <button className="flex justify-center items-center w-10 h-10 rounded-lg border-2 border-red-300 bg-red-200 text-red-500" onClick={() => {
            alert("Esto borrará todos tus datos y cerrará sesión para arreglar la app en caso de que esté corrupta. Por favor confirma para continuar.");
            const confirmation = confirm("¿Estás seguro de que quieres resetear la app?")

            if (confirmation === true) {
              localStorage.clear();
              window.location.reload();
            }
          }}>
            <Trash2 strokeWidth={1.8} width={18} />
          </button>
        </div>

        <BrowserRouter>
          <ToastProvider />
          <LoggingWrapper />
          <AnimatedRoutes />
        </BrowserRouter>
      </div>
      {/* Imagen lateral para pantallas grandes */}
      <div className="hidden lg:block w-full max-w-xl h-[95vh] max-h-[900px] bg-gradient-to-br from-green-400 to-green-600 overflow-hidden select-none rounded-3xl ml-4 shadow-2xl">
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-white">
          <h1 className="text-4xl font-bold mb-4 text-center">Rapidito</h1>
          <p className="text-xl text-center text-green-100 mb-8">Tu viaje rápido y seguro</p>
          <img
            className="h-80 object-contain mx-auto select-none drop-shadow-2xl"
            src="https://img.freepik.com/free-vector/taxi-app-service-concept_23-2148497472.jpg?semt=ais_hybrid"
            alt="Imagen lateral"
          />
          <div className="mt-8 text-center">
            <p className="text-green-100 text-sm">Disponible en la frontera</p>
            <p className="text-green-200 text-xs mt-2">San Antonio del Táchira • Cúcuta • Villa del Rosario</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
      >
        <Routes location={location}>
          <Route path="/" element={<GetStarted />} />
          <Route
            path="/home"
            element={
              <UserProtectedWrapper>
                <UserHomeScreen />
              </UserProtectedWrapper>
            }
          />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route
            path="/user/edit-profile"
            element={
              <UserProtectedWrapper>
                <UserEditProfile />
              </UserProtectedWrapper>
            }
          />
          <Route
            path="/user/rides"
            element={
              <UserProtectedWrapper>
                <RideHistory />
              </UserProtectedWrapper>
            }
          />

          <Route
            path="/captain/home"
            element={
              <CaptainProtectedWrapper>
                <CaptainHomeScreen />
              </CaptainProtectedWrapper>
            }
          />
          <Route path="/captain/login" element={<CaptainLogin />} />
          <Route path="/captain/signup" element={<CaptainSignup />} />
          <Route
            path="/captain/edit-profile"
            element={
              <CaptainProtectedWrapper>
                <CaptainEditProfile />
              </CaptainProtectedWrapper>
            }
          />
          <Route
            path="/captain/rides"
            element={
              <CaptainProtectedWrapper>
                <RideHistory />
              </CaptainProtectedWrapper>
            }
          />
          <Route path="/:userType/chat/:rideId" element={<ChatScreen />} />
          <Route path="/:userType/verify-email/" element={<VerifyEmail />} />
          <Route path="/:userType/forgot-password/" element={<ForgotPassword />} />
          <Route path="/:userType/reset-password/" element={<ResetPassword />} />

          <Route path="*" element={<Error />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function LoggingWrapper() {
  const location = useLocation();
  const { socket } = useContext(SocketDataContext);

  useEffect(() => {
    if (socket) {
      logger(socket);
    }
  }, [location.pathname, location.search]);
  return null;
}
