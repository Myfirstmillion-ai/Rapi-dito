import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, MapPin, UserPlus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import Console from "../utils/console";

function UserSignup() {
  const [responseError, setResponseError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const navigation = useNavigate();
  
  const signupUser = async (data) => {
    const userData = {
      fullname: {
        firstname: data.firstname,
        lastname: data.lastname,
      },
      email: data.email,
      password: data.password,
      phone: data.phone
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/user/register`,
        userData,
        { withCredentials: true }
      );
      Console.log(response);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userData", JSON.stringify({
        type: "user",
        data: response.data.user,
      }));
      navigation("/home");
    } catch (error) {
      setResponseError(error.response?.data?.[0]?.msg || error.response?.data?.message || "Error al registrarse");
      Console.log(error);
    } finally {
      setLoading(false);
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
                Crear Cuenta
              </span>
            </h1>
            <p className="text-white/60 text-sm">Únete a Rapidito hoy</p>
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
            <form onSubmit={handleSubmit(signupUser)} className="space-y-5">
              {/* First Name */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Nombre</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  {...register("firstname", { required: true })}
                  className="w-full h-14 px-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                />
                {errors.firstname && (
                  <p className="mt-2 text-sm text-red-300">El nombre es requerido</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Apellido</label>
                <input
                  type="text"
                  placeholder="Tu apellido"
                  {...register("lastname", { required: true })}
                  className="w-full h-14 px-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                />
                {errors.lastname && (
                  <p className="mt-2 text-sm text-red-300">El apellido es requerido</p>
                )}
              </div>

              {/* Email */}
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

              {/* Phone */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Teléfono</label>
                <input
                  type="tel"
                  placeholder="+58 276 123 4567"
                  {...register("phone", { required: true })}
                  className="w-full h-14 px-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-300">El teléfono es requerido</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password", { required: true, minLength: 6 })}
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
                  <p className="mt-2 text-sm text-red-300">
                    {errors.password.type === "minLength" 
                      ? "La contraseña debe tener al menos 6 caracteres" 
                      : "La contraseña es requerida"}
                  </p>
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
                    <span>Creando cuenta...</span>
                  </div>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Crear cuenta</span>
                  </>
                )}
              </button>
            </form>

            {/* Terms */}
            <p className="text-xs text-white/40 text-center mt-6 leading-relaxed">
              Al continuar, aceptas los{" "}
              <Link to="/terms" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                Términos y Condiciones
              </Link>{" "}
              y la{" "}
              <Link to="/privacy" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                Política de Privacidad
              </Link>{" "}
              de RAPIDITO
            </p>
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

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className="text-white/60 text-sm">
              ¿Ya tienes cuenta?{" "}
              <Link 
                to="/login" 
                className="font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent hover:from-emerald-300 hover:to-cyan-300 transition-all inline-flex items-center gap-1"
                style={{ WebkitTextFillColor: 'transparent' }}
              >
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Inicia sesión</span>
                <Sparkles className="w-3 h-3 text-emerald-400" aria-hidden="true" />
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default UserSignup;
