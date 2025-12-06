import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
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
    <div className="w-full min-h-screen bg-white flex flex-col overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>
      {/* Back Button */}
      <button
        onClick={() => navigation('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors z-10"
        aria-label="Volver a inicio"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Volver</span>
      </button>

      {/* Logo Section */}
      <div className="w-full pt-8 pb-16 px-6 text-center">
        <div className="text-3xl font-black tracking-tight text-black">
          RAPIDITO
          <span className="inline-block w-2 h-2 bg-[#00E676] rounded-full ml-1 mb-2"></span>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex-1 px-6 pb-8">
        <div className="max-w-md mx-auto">
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-8">
            Crear cuenta
          </h2>

          {/* Error Message */}
          {responseError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {responseError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(signupUser)} className="space-y-4">
            {/* First Name */}
            <div>
              <input
                type="text"
                placeholder="Nombre"
                {...register("firstname", { required: true })}
                className="w-full h-14 px-4 bg-[#EEEEEE] border border-transparent rounded text-base text-black placeholder-gray-500 focus:outline-none focus:border-black focus:bg-white transition-all duration-150"
              />
              {errors.firstname && (
                <p className="mt-1 text-sm text-red-600">El nombre es requerido</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <input
                type="text"
                placeholder="Apellido"
                {...register("lastname", { required: true })}
                className="w-full h-14 px-4 bg-[#EEEEEE] border border-transparent rounded text-base text-black placeholder-gray-500 focus:outline-none focus:border-black focus:bg-white transition-all duration-150"
              />
              {errors.lastname && (
                <p className="mt-1 text-sm text-red-600">El apellido es requerido</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: true })}
                className="w-full h-14 px-4 bg-[#EEEEEE] border border-transparent rounded text-base text-black placeholder-gray-500 focus:outline-none focus:border-black focus:bg-white transition-all duration-150"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">El email es requerido</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <input
                type="tel"
                placeholder="Teléfono"
                {...register("phone", { required: true })}
                className="w-full h-14 px-4 bg-[#EEEEEE] border border-transparent rounded text-base text-black placeholder-gray-500 focus:outline-none focus:border-black focus:bg-white transition-all duration-150"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">El teléfono es requerido</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                {...register("password", { required: true, minLength: 6 })}
                className="w-full h-14 px-4 bg-[#EEEEEE] border border-transparent rounded text-base text-black placeholder-gray-500 focus:outline-none focus:border-black focus:bg-white transition-all duration-150"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
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
              className="w-full h-14 bg-black text-white text-base font-medium rounded hover:bg-gray-800 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                "Crear cuenta"
              )}
            </button>
          </form>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center mt-6 leading-relaxed">
            Al continuar, aceptas los{" "}
            <a href="#" className="underline hover:text-black transition-colors">
              Términos y Condiciones
            </a>{" "}
            y la{" "}
            <a href="#" className="underline hover:text-black transition-colors">
              Política de Privacidad
            </a>{" "}
            de RAPIDITO
          </p>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="font-bold text-black hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserSignup;
