import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, ChevronRight, Car, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Console from "../utils/console";

/**
 * CaptainSignup - Swiss Minimalist Studio Layout
 * Solid backgrounds, massive typography, zero visual noise
 * Two-step form: Personal info → Vehicle info
 */
function CaptainSignup() {
  const [responseError, setResponseError] = useState("");
  const [showVehiclePanel, setShowVehiclePanel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Animation variants
  const fadeInUp = {
    initial: prefersReducedMotion ? {} : { opacity: 0, y: 40 },
    animate: prefersReducedMotion ? {} : { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  };

  const slideInLeft = {
    initial: prefersReducedMotion ? {} : { opacity: 0, x: -60 },
    animate: prefersReducedMotion ? {} : { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  };

  const panelTransition = {
    initial: prefersReducedMotion ? {} : { opacity: 0, x: 20 },
    animate: prefersReducedMotion ? {} : { opacity: 1, x: 0 },
    exit: prefersReducedMotion ? {} : { opacity: 0, x: -20 },
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
    trigger,
  } = useForm();

  const navigation = useNavigate();
  
  const signupCaptain = async (data) => {
    if (!termsAccepted) {
      setResponseError("Debes aceptar los Términos y Condiciones");
      return;
    }

    const captainData = {
      fullname: {
        firstname: data.firstname,
        lastname: data.lastname,
      },
      email: data.email,
      password: data.password,
      phone: data.phone,
      vehicle: {
        color: data.color,
        number: data.number,
        capacity: data.capacity,
        type: data.type,
        brand: data.brand,
        model: data.model,
      },
    };
    Console.log(captainData);

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/captain/register`,
        captainData
      );
      Console.log(response);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userData", JSON.stringify({
        type: "captain",
        data: response.data.captain,
      }));
      navigation("/captain/home");
    } catch (error) {
      setResponseError(
        error.response?.data?.[0]?.msg || error.response?.data?.message || "Error al registrarse"
      );
      setShowVehiclePanel(false);
      Console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = async () => {
    // Validate personal info fields before proceeding
    const isValid = await trigger(['firstname', 'lastname', 'email', 'phone', 'password']);
    if (isValid) {
      setShowVehiclePanel(true);
    }
  };

  useEffect(() => {
    if (responseError) {
      const timer = setTimeout(() => {
        setResponseError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [responseError]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col overflow-y-auto">
      {/* Back Button */}
      <motion.button
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        onClick={() => showVehiclePanel ? setShowVehiclePanel(false) : navigation('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors z-20 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 rounded-lg p-2"
        aria-label={showVehiclePanel ? "Volver al paso anterior" : "Volver a inicio"}
      >
        <ArrowLeft className="w-5 h-5" />
      </motion.button>

      {/* Content Wrapper */}
      <div className="flex-1 flex flex-col justify-center px-6 py-20 md:px-12 lg:px-20">
        <div className="w-full max-w-md mx-auto">
          {/* Progress Indicator */}
          <motion.div 
            {...fadeInUp}
            className="flex items-center gap-4 mb-8"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              showVehiclePanel 
                ? 'bg-emerald-500' 
                : 'bg-gray-900 dark:bg-white'
            }`}>
              <User className={`w-6 h-6 ${
                showVehiclePanel 
                  ? 'text-white' 
                  : 'text-white dark:text-gray-900'
              }`} />
            </div>
            <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded">
              <div className={`h-full bg-emerald-500 rounded transition-all duration-500 ${
                showVehiclePanel ? 'w-full' : 'w-0'
              }`} />
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              showVehiclePanel 
                ? 'bg-gray-900 dark:bg-white' 
                : 'bg-gray-100 dark:bg-gray-800'
            }`}>
              <Car className={`w-6 h-6 ${
                showVehiclePanel 
                  ? 'text-white dark:text-gray-900' 
                  : 'text-gray-400'
              }`} />
            </div>
          </motion.div>

          {/* Error Message */}
          {responseError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-700 dark:text-red-300 text-sm"
              role="alert"
            >
              {responseError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(signupCaptain)}>
            <AnimatePresence mode="wait">
              {!showVehiclePanel ? (
                <motion.div
                  key="personal"
                  {...panelTransition}
                >
                  {/* Hero Heading - Personal Info */}
                  <motion.h1
                    {...slideInLeft}
                    className="mb-12 text-balance text-6xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-7xl"
                  >
                    Únete a{'\n'}
                    RAPIDITO.
                  </motion.h1>

                  <div className="space-y-6">
                    {/* First Name */}
                    <div className="relative">
                      <input
                        type="text"
                        id="firstname"
                        placeholder="Nombre"
                        {...register("firstname", { required: true })}
                        className="peer w-full border-b-2 border-gray-300 dark:border-gray-700 bg-transparent py-4 text-lg text-gray-900 dark:text-white outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-500 dark:focus:border-emerald-400"
                        aria-describedby={errors.firstname ? "firstname-error" : undefined}
                      />
                      {errors.firstname && (
                        <p id="firstname-error" className="mt-2 text-sm text-red-500" role="alert">
                          El nombre es requerido
                        </p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="relative">
                      <input
                        type="text"
                        id="lastname"
                        placeholder="Apellido"
                        {...register("lastname", { required: true })}
                        className="peer w-full border-b-2 border-gray-300 dark:border-gray-700 bg-transparent py-4 text-lg text-gray-900 dark:text-white outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-500 dark:focus:border-emerald-400"
                        aria-describedby={errors.lastname ? "lastname-error" : undefined}
                      />
                      {errors.lastname && (
                        <p id="lastname-error" className="mt-2 text-sm text-red-500" role="alert">
                          El apellido es requerido
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        placeholder="correo@ejemplo.com"
                        {...register("email", { required: true })}
                        className="peer w-full border-b-2 border-gray-300 dark:border-gray-700 bg-transparent py-4 text-lg text-gray-900 dark:text-white outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-500 dark:focus:border-emerald-400"
                        aria-describedby={errors.email ? "email-error" : undefined}
                      />
                      {errors.email && (
                        <p id="email-error" className="mt-2 text-sm text-red-500" role="alert">
                          El email es requerido
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="relative">
                      <input
                        type="tel"
                        id="phone"
                        placeholder="+58 276 123 4567"
                        {...register("phone", { required: true })}
                        className="peer w-full border-b-2 border-gray-300 dark:border-gray-700 bg-transparent py-4 text-lg text-gray-900 dark:text-white outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-500 dark:focus:border-emerald-400"
                        aria-describedby={errors.phone ? "phone-error" : undefined}
                      />
                      {errors.phone && (
                        <p id="phone-error" className="mt-2 text-sm text-red-500" role="alert">
                          El teléfono es requerido
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="relative">
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          placeholder="••••••••"
                          {...register("password", { required: true, minLength: 6 })}
                          className="peer w-full border-b-2 border-gray-300 dark:border-gray-700 bg-transparent py-4 pr-12 text-lg text-gray-900 dark:text-white outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-500 dark:focus:border-emerald-400"
                          aria-describedby={errors.password ? "password-error" : undefined}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded p-1"
                          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {errors.password && (
                        <p id="password-error" className="mt-2 text-sm text-red-500" role="alert">
                          {errors.password.type === "minLength" 
                            ? "Mínimo 6 caracteres" 
                            : "La contraseña es requerida"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Login Link */}
                  <div className="mt-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      ¿Ya tienes cuenta?{" "}
                      <Link 
                        to="/captain/login" 
                        className="font-semibold text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        Inicia sesión
                      </Link>
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="vehicle"
                  {...panelTransition}
                >
                  {/* Hero Heading - Vehicle Info */}
                  <motion.h1
                    {...slideInLeft}
                    className="mb-12 text-balance text-6xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-7xl"
                  >
                    Tu{'\n'}
                    vehículo.
                  </motion.h1>

                  <div className="space-y-6">
                    {/* Vehicle Type */}
                    <div className="relative">
                      <select
                        id="type"
                        {...register("type", { required: true })}
                        className="peer w-full border-b-2 border-gray-300 dark:border-gray-700 bg-transparent py-4 text-lg text-gray-900 dark:text-white outline-none transition-colors focus:border-emerald-500 dark:focus:border-emerald-400 appearance-none cursor-pointer"
                        aria-describedby={errors.type ? "type-error" : undefined}
                        defaultValue=""
                      >
                        <option value="" disabled className="bg-white dark:bg-gray-900">
                          Tipo de vehículo
                        </option>
                        <option value="car" className="bg-white dark:bg-gray-900">Carro</option>
                        <option value="bike" className="bg-white dark:bg-gray-900">Moto</option>
                      </select>
                      <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 rotate-90 pointer-events-none" />
                      {errors.type && (
                        <p id="type-error" className="mt-2 text-sm text-red-500" role="alert">
                          El tipo es requerido
                        </p>
                      )}
                    </div>

                    {/* Vehicle Number (Plate) */}
                    <div className="relative">
                      <input
                        type="text"
                        id="number"
                        placeholder="Placa del vehículo"
                        {...register("number", { required: true })}
                        className="peer w-full border-b-2 border-gray-300 dark:border-gray-700 bg-transparent py-4 text-lg text-gray-900 dark:text-white outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-500 dark:focus:border-emerald-400"
                        aria-describedby={errors.number ? "number-error" : undefined}
                      />
                      {errors.number && (
                        <p id="number-error" className="mt-2 text-sm text-red-500" role="alert">
                          La placa es requerida
                        </p>
                      )}
                    </div>

                    {/* Color */}
                    <div className="relative">
                      <input
                        type="text"
                        id="color"
                        placeholder="Color del vehículo"
                        {...register("color", { required: true })}
                        className="peer w-full border-b-2 border-gray-300 dark:border-gray-700 bg-transparent py-4 text-lg text-gray-900 dark:text-white outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-500 dark:focus:border-emerald-400"
                        aria-describedby={errors.color ? "color-error" : undefined}
                      />
                      {errors.color && (
                        <p id="color-error" className="mt-2 text-sm text-red-500" role="alert">
                          El color es requerido
                        </p>
                      )}
                    </div>

                    {/* Brand */}
                    <div className="relative">
                      <input
                        type="text"
                        id="brand"
                        placeholder="Marca del vehículo"
                        {...register("brand", { required: true })}
                        className="peer w-full border-b-2 border-gray-300 dark:border-gray-700 bg-transparent py-4 text-lg text-gray-900 dark:text-white outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-500 dark:focus:border-emerald-400"
                        aria-describedby={errors.brand ? "brand-error" : undefined}
                      />
                      {errors.brand && (
                        <p id="brand-error" className="mt-2 text-sm text-red-500" role="alert">
                          La marca es requerida
                        </p>
                      )}
                    </div>

                    {/* Model */}
                    <div className="relative">
                      <input
                        type="text"
                        id="model"
                        placeholder="Modelo del vehículo"
                        {...register("model", { required: true })}
                        className="peer w-full border-b-2 border-gray-300 dark:border-gray-700 bg-transparent py-4 text-lg text-gray-900 dark:text-white outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-500 dark:focus:border-emerald-400"
                        aria-describedby={errors.model ? "model-error" : undefined}
                      />
                      {errors.model && (
                        <p id="model-error" className="mt-2 text-sm text-red-500" role="alert">
                          El modelo es requerido
                        </p>
                      )}
                    </div>

                    {/* Capacity */}
                    <div className="relative">
                      <input
                        type="number"
                        id="capacity"
                        placeholder="Capacidad de pasajeros"
                        min="1"
                        {...register("capacity", { required: true, min: 1 })}
                        className="peer w-full border-b-2 border-gray-300 dark:border-gray-700 bg-transparent py-4 text-lg text-gray-900 dark:text-white outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-500 dark:focus:border-emerald-400"
                        aria-describedby={errors.capacity ? "capacity-error" : undefined}
                      />
                      {errors.capacity && (
                        <p id="capacity-error" className="mt-2 text-sm text-red-500" role="alert">
                          La capacidad es requerida
                        </p>
                      )}
                    </div>

                    {/* Terms Checkbox */}
                    <div className="pt-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="mt-1 h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-emerald-600 focus:ring-emerald-500 dark:bg-gray-800"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Acepto los{' '}
                          <Link to="/terms" className="underline hover:text-emerald-600 dark:hover:text-emerald-400">
                            Términos y Condiciones
                          </Link>
                          {' '}y la{' '}
                          <Link to="/privacy" className="underline hover:text-emerald-600 dark:hover:text-emerald-400">
                            Política de Privacidad
                          </Link>
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Info Text */}
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-8">
                    Revisaremos tu solicitud en 24-48 horas
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>

      {/* Floating Action Button - Fixed at bottom */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-8 left-6 right-6 md:left-auto md:right-8 md:w-full md:max-w-md z-50"
      >
        {!showVehiclePanel ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="w-full h-16 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 font-semibold text-white shadow-2xl transition-all hover:shadow-emerald-500/50 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            <span>Siguiente paso</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit(signupCaptain)}
            disabled={loading}
            className="w-full h-16 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 font-semibold text-white shadow-2xl transition-all hover:shadow-emerald-500/50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 flex items-center justify-center gap-2"
            aria-busy={loading}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                <span>Creando cuenta...</span>
              </>
            ) : (
              <span>Crear Cuenta →</span>
            )}
          </button>
        )}
      </motion.div>

      {/* Bottom padding to account for fixed button */}
      <div className="h-28" aria-hidden="true" />
    </div>
  );
}

export default CaptainSignup;
