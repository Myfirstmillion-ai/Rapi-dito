import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button, Heading, Input } from "../components";
import { User, Mail, Phone, Lock, ArrowRight, Shield, Sparkles } from "lucide-react";
import axios from "axios";
import Console from "../utils/console";
import logo from '/logo-quickride.png';

function UserSignup() {
  const [responseError, setResponseError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="relative w-full h-dvh overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Premium Header with Gradient */}
      <div 
        className="h-auto w-full relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #276EF1 0%, #1F58C1 100%)'
        }}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative p-8 pb-12">
          <div className="flex items-center justify-between mb-6">
            <img
              className="h-10 md:h-12 object-contain brightness-0 invert drop-shadow-lg"
              src={logo}
              alt="Rapidito Logo"
            />
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-bold text-white">Nuevo</span>
            </div>
          </div>
          
          <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-4">
            <span className="text-sm font-semibold text-white">Registro de Viajero</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
            Comienza tu<br/>experiencia
          </h1>
          <p className="text-base text-white/95 font-medium">
            Crea tu cuenta en minutos
          </p>
        </div>
      </div>

      {/* Premium Form Section */}
      <div className="flex-1 w-full bg-white rounded-t-[2.5rem] -mt-8 shadow-2xl p-8 overflow-y-auto pb-24">
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit(signupUser)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label={"Nombre"}
                name={"firstname"}
                register={register}
                error={errors.firstname}
              />
              <Input
                label={"Apellido"}
                name={"lastname"}
                register={register}
                error={errors.lastname}
              />
            </div>
            <Input
              label={"Número de teléfono"}
              type={"number"}
              name={"phone"}
              register={register}
              error={errors.phone}
            />
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
            
            <Button title={"Crear Cuenta"} loading={loading} type="submit" />
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
              ¿Ya tienes una cuenta?{" "}
              <Link to={"/login"} className="font-bold text-uber-blue hover:text-blue-700 transition-colors">
                Iniciar sesión
              </Link>
            </p>

            <button
              onClick={() => navigation("/captain/signup")}
              className="w-full bg-gradient-to-r from-uber-green to-green-600 hover:from-green-600 hover:to-uber-green text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
            >
              <span>Regístrate como Conductor</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          {/* Trust Badge */}
          <div className="mt-8 flex items-center justify-center gap-2 text-gray-500">
            <Shield className="w-4 h-4" />
            <p className="text-xs font-medium">
              Tus datos están protegidos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSignup;
