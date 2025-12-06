import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, MapPin, LogIn, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import Console from "../utils/console";

function UserLogin() {
  const [responseError, setResponseError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    setTimeout(() => {
      setResponseError("");
    }, 5000);
  }, [responseError]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex flex-col overflow-y-auto relative" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(16 185 129 / 0.3) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-transparent"></div>

      {/* Back Button */}
      <button
        onClick={() => navigation('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors z-20 backdrop-blur-sm bg-white/5 px-3 py-2 rounded-lg border border-white/10"
        aria-label="Volver a inicio"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-medium text-sm">Volver</span>
      </button>

      {/* Content Container */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur-xl opacity-50"></div>
              <div className="relative bg-gradient-to-r from-emerald-500 to-cyan-500 p-4 rounded-2xl">
                <MapPin className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-black mb-3">
              <span className="bg-gradient-to-r from-white via-emerald-100 to-cyan-100 bg-clip-text text-transparent">
                Bienvenido
              </span>
            </h1>
            <p className="text-white/60 text-sm">Inicia sesión para continuar</p>
          </motion.div>

          {/* Glass Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl"
          >
            {/* Error Message */}
            {responseError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl text-red-200 text-sm"
              >
                {responseError}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(loginUser)} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  {...register("email", { required: true })}
                  className="w-full h-14 px-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-300">El email es requerido</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password", { required: true })}
                    className="w-full h-14 px-4 pr-12 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-300">La contraseña es requerida</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-base font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-8 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Iniciando...</span>
                  </div>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Iniciar sesión</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center my-8"
          >
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-4 text-sm text-white/40">o</span>
            <div className="flex-1 border-t border-white/20"></div>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className="text-white/60 text-sm">
              ¿No tienes cuenta?{" "}
              <Link 
                to="/signup" 
                className="font-bold text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text hover:from-emerald-300 hover:to-cyan-300 transition-all inline-flex items-center gap-1"
              >
                Regístrate
                <Sparkles className="w-3 h-3 text-emerald-400" />
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default UserLogin;
