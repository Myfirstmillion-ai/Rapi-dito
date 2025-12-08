import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import Console from "../utils/console";

/**
 * UserLogin - Swiss Minimalist Studio Layout
 * Solid backgrounds, massive typography, zero visual noise
 */
function UserLogin() {
  const [responseError, setResponseError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Animation variants
  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
        delayChildren: prefersReducedMotion ? 0 : 0.2
      }
    }
  };

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

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const navigation = useNavigate();

  const loginUser = async (data) => {
    if (data.email.trim() !== "" && data.password.trim() !== "") {
      try {
        setLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/user/login`,
          data
        );
        Console.log(response);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userData", JSON.stringify({
          type: "user",
          data: response.data.user,
        }));
        navigation("/home");
      } catch (error) {
        setResponseError(error.response?.data?.message || "Error al iniciar sesión");
        Console.log(error);
      } finally {
        setLoading(false);
      }
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
        onClick={() => navigation('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors z-20 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 rounded-lg p-2"
        aria-label="Volver a inicio"
      >
        <ArrowLeft className="w-5 h-5" />
      </motion.button>

      {/* Content Wrapper */}
      <div className="flex-1 flex flex-col justify-center px-6 py-20 md:px-12 lg:px-20">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="w-full max-w-md mx-auto"
        >
          {/* Hero Heading - Massive Typography */}
          <motion.h1
            variants={slideInLeft}
            className="mb-12 text-balance text-6xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-7xl"
          >
            Bienvenido{'\n'}
            de vuelta.
          </motion.h1>

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

          {/* Form */}
          <form onSubmit={handleSubmit(loginUser)} className="space-y-8">
            {/* Email Input - Bottom-line style */}
            <motion.div variants={fadeInUp} className="relative">
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
            </motion.div>

            {/* Password Input */}
            <motion.div variants={fadeInUp} className="relative">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  {...register("password", { required: true })}
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
                  La contraseña es requerida
                </p>
              )}
            </motion.div>

            {/* Helper Links */}
            <motion.div variants={fadeInUp} className="pt-2">
              <Link 
                to="/forgot-password" 
                className="text-sm text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </motion.div>
          </form>

          {/* Sign Up Link */}
          <motion.div
            variants={fadeInUp}
            className="mt-12 text-center"
          >
            <p className="text-gray-500 dark:text-gray-400">
              ¿No tienes cuenta?{" "}
              <Link 
                to="/signup" 
                className="font-semibold text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Regístrate
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Action Button - Fixed at bottom */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-8 left-6 right-6 md:left-auto md:right-8 md:w-full md:max-w-md z-50"
      >
        <button
          type="submit"
          form="login-form"
          onClick={handleSubmit(loginUser)}
          disabled={loading}
          className="w-full h-16 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 font-semibold text-white shadow-2xl transition-all hover:shadow-emerald-500/50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 flex items-center justify-center gap-2"
          aria-busy={loading}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
              <span>Iniciando...</span>
            </>
          ) : (
            <span>Iniciar Sesión →</span>
          )}
        </button>
      </motion.div>

      {/* Bottom padding to account for fixed button */}
      <div className="h-28" aria-hidden="true" />
    </div>
  );
}

export default UserLogin;
