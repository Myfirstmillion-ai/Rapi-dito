import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, ChevronRight, Car, UserCircle, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Console from "../utils/console";

function CaptainSignup() {
  const [responseError, setResponseError] = useState("");
  const [showVehiclePanel, setShowVehiclePanel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const navigation = useNavigate();
  
  const signupCaptain = async (data) => {
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
                  <Car className="w-7 h-7 text-white" />
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
                Únete a RAPIDITO
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Gana dinero en San Antonio del Táchira</p>
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
            <form onSubmit={handleSubmit(signupCaptain)} className="space-y-4">
              <AnimatePresence mode="wait">
                {!showVehiclePanel ? (
                  <motion.div
                    key="personal"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Section Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center">
                        <UserCircle size={20} className="text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">Información Personal</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Cuéntanos sobre ti</p>
                      </div>
                    </div>

                    {/* First Name */}
                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="Nombre"
                        {...register("firstname", { required: true })}
                        className="w-full h-12 px-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-500/50 transition-all duration-300"
                      />
                      {errors.firstname && (
                        <p className="mt-2 text-sm text-red-500 dark:text-red-400">El nombre es requerido</p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="Apellido"
                        {...register("lastname", { required: true })}
                        className="w-full h-12 px-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-500/50 transition-all duration-300"
                      />
                      {errors.lastname && (
                        <p className="mt-2 text-sm text-red-500 dark:text-red-400">El apellido es requerido</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                      <input
                        type="email"
                        placeholder="Email"
                        {...register("email", { required: true })}
                        className="w-full h-12 px-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-500/50 transition-all duration-300"
                      />
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-500 dark:text-red-400">El email es requerido</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="mb-3">
                      <input
                        type="tel"
                        placeholder="Teléfono"
                        {...register("phone", { required: true })}
                        className="w-full h-12 px-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-500/50 transition-all duration-300"
                      />
                      {errors.phone && (
                        <p className="mt-2 text-sm text-red-500 dark:text-red-400">El teléfono es requerido</p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="relative mb-3">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Contraseña"
                        {...register("password", { required: true, minLength: 6 })}
                        className="w-full h-12 px-4 pr-12 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-500/50 transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/50 hover:text-gray-600 dark:hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      {errors.password && (
                        <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                          {errors.password.type === "minLength" 
                            ? "Mínimo 6 caracteres" 
                            : "La contraseña es requerida"}
                        </p>
                      )}
                    </div>

                    {/* Next Button */}
                    <button
                      type="button"
                      onClick={() => setShowVehiclePanel(true)}
                      className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-base font-bold rounded-2xl hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 mt-4"
                    >
                      <span>Siguiente paso</span>
                      <ChevronRight size={20} />
                    </button>

                    {/* Terms */}
                    <p className="text-xs text-gray-500 dark:text-white/40 text-center mt-3 leading-relaxed">
                      Al continuar, aceptas los{" "}
                      <a href="#" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                        Términos
                      </a>{" "}
                      y{" "}
                      <a href="#" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                        Privacidad
                      </a>
                    </p>

                    {/* Login Link */}
                    <p className="text-center text-sm text-gray-600 dark:text-white/60 mt-3">
                      ¿Ya tienes cuenta?{" "}
                      <Link to="/captain/login" className="font-bold text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                        Inicia sesión
                      </Link>
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="vehicle"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Back Button */}
                    <button
                      type="button"
                      onClick={() => setShowVehiclePanel(false)}
                      className="flex items-center gap-2 text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors mb-4 bg-gray-100 dark:bg-white/5 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10"
                    >
                      <ArrowLeft size={16} />
                      <span className="text-sm font-medium">Atrás</span>
                    </button>

                    {/* Section Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center">
                        <Car size={20} className="text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">Tu Vehículo</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Datos del vehículo</p>
                      </div>
                    </div>

                    {/* Vehicle Type */}
                    <div className="mb-3">
                      <select
                        {...register("type", { required: true })}
                        className="w-full h-12 px-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-500/50 transition-all duration-300"
                      >
                        <option value="" className="bg-white dark:bg-slate-900">Tipo de vehículo</option>
                        <option value="car" className="bg-white dark:bg-slate-900">Carro</option>
                        <option value="bike" className="bg-white dark:bg-slate-900">Moto</option>
                      </select>
                      {errors.type && (
                        <p className="mt-2 text-sm text-red-500 dark:text-red-400">El tipo es requerido</p>
                      )}
                    </div>

                    {/* Vehicle Number */}
                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="Placa del vehículo"
                        {...register("number", { required: true })}
                        className="w-full h-12 px-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-500/50 transition-all duration-300"
                      />
                      {errors.number && (
                        <p className="mt-2 text-sm text-red-500 dark:text-red-400">La placa es requerida</p>
                      )}
                    </div>

                    {/* Color */}
                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="Color del vehículo"
                        {...register("color", { required: true })}
                        className="w-full h-12 px-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-500/50 transition-all duration-300"
                      />
                      {errors.color && (
                        <p className="mt-2 text-sm text-red-500 dark:text-red-400">El color es requerido</p>
                      )}
                    </div>

                    {/* Brand */}
                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="Marca del vehículo"
                        {...register("brand", { required: true })}
                        className="w-full h-12 px-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-500/50 transition-all duration-300"
                      />
                      {errors.brand && (
                        <p className="mt-2 text-sm text-red-500 dark:text-red-400">La marca es requerida</p>
                      )}
                    </div>

                    {/* Model */}
                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="Modelo del vehículo"
                        {...register("model", { required: true })}
                        className="w-full h-12 px-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-500/50 transition-all duration-300"
                      />
                      {errors.model && (
                        <p className="mt-2 text-sm text-red-500 dark:text-red-400">El modelo es requerido</p>
                      )}
                    </div>

                    {/* Capacity */}
                    <div className="mb-3">
                      <input
                        type="number"
                        placeholder="Capacidad de pasajeros"
                        {...register("capacity", { required: true, min: 1 })}
                        className="w-full h-12 px-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-500/50 transition-all duration-300"
                      />
                      {errors.capacity && (
                        <p className="mt-2 text-sm text-red-500 dark:text-red-400">La capacidad es requerida</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-base font-bold rounded-2xl hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Creando cuenta...</span>
                        </div>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          <span>Crear cuenta</span>
                        </>
                      )}
                    </button>

                    {/* Info Text */}
                    <p className="text-xs text-gray-500 dark:text-white/40 text-center mt-3">
                      Revisaremos tu solicitud en 24-48 horas
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default CaptainSignup;
