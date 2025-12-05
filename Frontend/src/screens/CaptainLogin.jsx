import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button, Heading, Input } from "../components";
import { Mail, Lock, ArrowRight, Shield, TrendingUp, DollarSign } from "lucide-react";
import axios from "axios";
import Console from "../utils/console";
import logo from '/logo-quickride.png';

function CaptainLogin() {
  const [responseError, setResponseError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const navigation = useNavigate();

  const loginCaptain = async (data) => {
    if (data.email.trim() !== "" && data.password.trim() !== "") {
      try {
        setLoading(true)
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/captain/login`,
          data
        );
        Console.log(response);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userData", JSON.stringify({
          type: "captain",
          data: response.data.captain,
        }));
        navigation("/captain/home");
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
    <div className="relative w-full h-dvh overflow-hidden bg-gradient-to-br from-gray-50 to-green-50">
      {/* Ultra Premium Hero Section */}
      <div 
        className="h-[45%] w-full bg-cover bg-center relative overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(5,163,87,0.92) 0%, rgba(4,138,74,0.95) 100%),
            url('https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1600&q=90')
          `,
          backgroundPosition: 'center center'
        }}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative h-full flex flex-col justify-between p-8">
          {/* Logo and Earning Badge */}
          <div className="flex items-start justify-between">
            <img
              className="h-12 md:h-14 object-contain brightness-0 invert drop-shadow-lg"
              src={logo}
              alt="Rapidito Logo"
            />
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <TrendingUp className="w-4 h-4 text-white" />
              <span className="text-sm font-bold text-white">+35%</span>
            </div>
          </div>
          
          {/* Main Heading */}
          <div>
            <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <span className="text-sm font-semibold text-white">Conductores</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight">
              Gana dinero<br/>conduciendo
            </h1>
            <p className="text-lg text-white/95 font-medium flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Ingresos flexibles en tu ciudad
            </p>
          </div>
        </div>
      </div>

      {/* Premium Form Section */}
      <div className="h-[55%] w-full bg-white rounded-t-[2.5rem] -mt-8 shadow-2xl p-8 overflow-y-auto">
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit(loginCaptain)} className="space-y-5">
            <Input
              label={"Correo electrónico"}
              type={"email"}
              name={"email"}
              register={register}
              error={errors.email}
            />
            <Input
              label={"Contraseña"}
              type={"password"}
              name={"password"}
              register={register}
              error={errors.password}
            />
            
            {responseError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-sm text-center text-red-600 font-medium">
                  {responseError}
                </p>
              </div>
            )}
            
            <div className="flex justify-end">
              <Link 
                to="/captain/forgot-password" 
                className="text-sm font-semibold text-uber-green hover:text-green-700 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            
            <Button title={"Iniciar Sesión"} loading={loading} type="submit" />
          </form>
          
          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">o</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-center text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link to={"/captain/signup"} className="font-bold text-uber-green hover:text-green-700 transition-colors">
                Regístrate gratis
              </Link>
            </p>

            <button
              onClick={() => navigation("/login")}
              className="w-full bg-gradient-to-r from-uber-blue to-blue-600 hover:from-blue-600 hover:to-uber-blue text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
            >
              <span>Inicia sesión como Usuario</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          {/* Trust Badge */}
          <div className="mt-8 flex items-center justify-center gap-2 text-gray-500">
            <Shield className="w-4 h-4" />
            <p className="text-xs font-medium">
              Conexión segura y encriptada
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CaptainLogin;
