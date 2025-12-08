import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, MapPin, UserPlus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
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
        `${import.meta.env.VITE_SERVER_URL}/user/register`,
        userData
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
    <div className="w-full min-h-screen flex flex-col overflow-hidden relative">
      {/* Top Half: City Image */}
      <div className="absolute inset-0 h-2/5">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/IMG_3639.jpeg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-transparent"></div>
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigation('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-white hover:text-white/80 transition-colors z-20 backdrop-blur-sm bg-black/20 px-3 py-2 rounded-lg"
        aria-label="Volver a inicio"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-medium text-sm">Volver</span>
      </button>

      {/* Bottom Sheet - Floating Card (60% of screen) */}
      <div className="absolute bottom-0 left-0 right-0 h-3/5 flex items-end">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full bg-white dark:bg-slate-900 rounded-t-[32px] shadow-lg dark:shadow-2xl border-t border-gray-200 dark:border-white/10 overflow-y-auto"
          style={{ maxHeight: '100%' }}
        >
          <div className="px-6 py-8 pb-12">
            {/* Logo Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl blur-xl opacity-30"></div>
                <div className="relative bg-gradient-to-r from-emerald-500 to-emerald-600 p-3 rounded-2xl">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-6"
            >
              <h1 className="text-3xl md:text-4xl font-black mb-2 text-gray-900 dark:text-white">
                Crear Cuenta
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Únete a Rapidito hoy</p>
            </motion.div>

            {/* Error Message */}
            {responseError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl text-red-600 dark:text-red-400 text-sm"
              >
                {responseError}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(signupUser)} className="space-y-4">
              {/* First Name */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Nombre</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  {...register("firstname", { required: true })}
                  className="w-full h-14 px-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-500/50 transition-all duration-300"
                />
                {errors.firstname && (
                  <p className="mt-2 text-sm text-red-500 dark:text-red-400">El nombre es requerido</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Apellido</label>
                <input
                  type="text"
                  placeholder="Tu apellido"
                  {...register("lastname", { required: true })}
                  className="w-full h-14 px-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-500/50 transition-all duration-300"
                />
                {errors.lastname && (
                  <p className="mt-2 text-sm text-red-500 dark:text-red-400">El apellido es requerido</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  {...register("email", { required: true })}
                  className="w-full h-14 px-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-500/50 transition-all duration-300"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-500 dark:text-red-400">El email es requerido</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Teléfono</label>
                <input
                  type="tel"
                  placeholder="+58 276 123 4567"
                  {...register("phone", { required: true })}
                  className="w-full h-14 px-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-500/50 transition-all duration-300"
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-500 dark:text-red-400">El teléfono es requerido</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password", { required: true, minLength: 6 })}
                    className="w-full h-14 px-4 pr-12 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-500/50 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/50 hover:text-gray-600 dark:hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-500 dark:text-red-400">
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
                className="w-full h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-base font-bold rounded-2xl hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6 flex items-center justify-center gap-2"
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
            <p className="text-xs text-gray-500 dark:text-white/40 text-center mt-4 leading-relaxed">
              Al continuar, aceptas los{" "}
              <Link to="/terms" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                Términos y Condiciones
              </Link>{" "}
              y la{" "}
              <Link to="/privacy" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                Política de Privacidad
              </Link>
            </p>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-200 dark:border-white/10"></div>
              <span className="px-4 text-sm text-gray-400 dark:text-white/40">o</span>
              <div className="flex-1 border-t border-gray-200 dark:border-white/10"></div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600 dark:text-white/60 text-sm">
                ¿Ya tienes cuenta?{" "}
                <Link 
                  to="/login" 
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all inline-flex items-center gap-1"
                >
                  Inicia sesión
                  <Sparkles className="w-3 h-3" />
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default UserSignup;
