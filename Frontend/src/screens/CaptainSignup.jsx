import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, ChevronRight, Car } from "lucide-react";
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
    <div className="w-full min-h-screen bg-white flex flex-col">
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
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
            Regístrate como conductor
          </h2>

          {/* Subtitle */}
          <p className="text-base text-gray-600 mb-8">
            Gana dinero en San Antonio del Táchira
          </p>

          {/* Error Message */}
          {responseError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {responseError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(signupCaptain)} className="space-y-4">
            {!showVehiclePanel ? (
              <>
                {/* Personal Information Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Car size={20} className="text-black" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-black">Información Personal</h3>
                      <p className="text-sm text-gray-600">Cuéntanos sobre ti</p>
                    </div>
                  </div>

                  {/* First Name */}
                  <div className="mb-4">
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
                  <div className="mb-4">
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
                  <div className="mb-4">
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
                  <div className="mb-4">
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
                  <div className="relative mb-4">
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
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={() => setShowVehiclePanel(true)}
                  className="w-full h-14 bg-black text-white text-base font-medium rounded hover:bg-gray-800 transition-all duration-150 flex items-center justify-center gap-2 mt-6"
                >
                  Siguiente paso
                  <ChevronRight size={20} />
                </button>
              </>
            ) : (
              <>
                {/* Vehicle Information Section */}
                <div className="mb-6">
                  {/* Back Button */}
                  <button
                    type="button"
                    onClick={() => setShowVehiclePanel(false)}
                    className="flex items-center gap-2 text-black hover:text-gray-600 transition-colors mb-6"
                  >
                    <ArrowLeft size={20} />
                    <span className="text-base font-medium">Atrás</span>
                  </button>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Car size={20} className="text-black" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-black">Información del Vehículo</h3>
                      <p className="text-sm text-gray-600">Datos de tu vehículo</p>
                    </div>
                  </div>

                  {/* Vehicle Type */}
                  <div className="mb-4">
                    <select
                      {...register("type", { required: true })}
                      className="w-full h-14 px-4 bg-[#EEEEEE] border border-transparent rounded text-base text-black focus:outline-none focus:border-black focus:bg-white transition-all duration-150"
                    >
                      <option value="">Tipo de vehículo</option>
                      <option value="car">Auto</option>
                      <option value="auto">Auto pequeño</option>
                      <option value="moto">Moto</option>
                    </select>
                    {errors.type && (
                      <p className="mt-1 text-sm text-red-600">El tipo de vehículo es requerido</p>
                    )}
                  </div>

                  {/* Vehicle Number */}
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Placa del vehículo"
                      {...register("number", { required: true })}
                      className="w-full h-14 px-4 bg-[#EEEEEE] border border-transparent rounded text-base text-black placeholder-gray-500 focus:outline-none focus:border-black focus:bg-white transition-all duration-150"
                    />
                    {errors.number && (
                      <p className="mt-1 text-sm text-red-600">La placa es requerida</p>
                    )}
                  </div>

                  {/* Color */}
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Color del vehículo"
                      {...register("color", { required: true })}
                      className="w-full h-14 px-4 bg-[#EEEEEE] border border-transparent rounded text-base text-black placeholder-gray-500 focus:outline-none focus:border-black focus:bg-white transition-all duration-150"
                    />
                    {errors.color && (
                      <p className="mt-1 text-sm text-red-600">El color es requerido</p>
                    )}
                  </div>

                  {/* Capacity */}
                  <div className="mb-4">
                    <input
                      type="number"
                      placeholder="Capacidad de pasajeros"
                      {...register("capacity", { required: true, min: 1 })}
                      className="w-full h-14 px-4 bg-[#EEEEEE] border border-transparent rounded text-base text-black placeholder-gray-500 focus:outline-none focus:border-black focus:bg-white transition-all duration-150"
                    />
                    {errors.capacity && (
                      <p className="mt-1 text-sm text-red-600">La capacidad es requerida</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-black text-white text-base font-medium rounded hover:bg-gray-800 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  style={{
                    borderBottom: loading ? 'none' : '2px solid #00E676'
                  }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    "Crear cuenta"
                  )}
                </button>

                {/* Info Text */}
                <p className="text-xs text-gray-500 text-center mt-4">
                  Revisaremos tu solicitud en 24-48 horas
                </p>
              </>
            )}
          </form>

          {/* Terms (only on first step) */}
          {!showVehiclePanel && (
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
          )}

          {/* Login Link (only on first step) */}
          {!showVehiclePanel && (
            <p className="text-center text-sm text-gray-600 mt-6">
              ¿Ya tienes cuenta?{" "}
              <Link to="/captain/login" className="font-bold text-black hover:underline">
                Inicia sesión
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CaptainSignup;
