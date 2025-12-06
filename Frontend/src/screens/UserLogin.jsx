import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
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
    <div className="w-full min-h-screen bg-white flex flex-col overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>
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
            Iniciar sesión
          </h2>

          {/* Error Message */}
          {responseError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {responseError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(loginUser)} className="space-y-4">
            {/* Email Input */}
            <div>
              <input
                type="email"
                placeholder="Ingresa tu email"
                {...register("email", { required: true })}
                className="w-full h-14 px-4 bg-[#EEEEEE] border border-transparent rounded text-base text-black placeholder-gray-500 focus:outline-none focus:border-black focus:bg-white transition-all duration-150"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">El email es requerido</p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                {...register("password", { required: true })}
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
                <p className="mt-1 text-sm text-red-600">La contraseña es requerida</p>
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
                "Iniciar sesión"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">o</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link to="/signup" className="font-bold text-black hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
