import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button, Heading, Input } from "../components";
import { Mail, Lock, Car } from "lucide-react";
import axios from "axios";
import Console from "../utils/console";

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
    <div className="w-full min-h-dvh bg-gradient-to-br from-orange-50 via-white to-red-50 flex flex-col justify-between p-6">
      <div>
        <div className="mb-8 mt-4">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/1063/1063376.png" 
            alt="Driver Icon" 
            className="w-20 h-20 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            Portal de Conductores
          </h1>
          <p className="text-center text-gray-600 text-sm">
            Inicia sesión para comenzar a conducir
          </p>
        </div>
        
        <form onSubmit={handleSubmit(loginCaptain)} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
            <Input
              label={"Correo electrónico"}
              type={"email"}
              name={"email"}
              register={register}
              error={errors.email}
              classes="pl-10"
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
            <Input
              label={"Contraseña"}
              type={"password"}
              name={"password"}
              register={register}
              error={errors.password}
              classes="pl-10"
            />
          </div>
          
          {responseError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <p className="text-sm text-red-700">{responseError}</p>
            </div>
          )}
          
          <Link to="/captain/forgot-password" className="text-sm text-orange-600 hover:text-orange-700 font-medium inline-block">
            ¿Olvidaste tu contraseña?
          </Link>
          
          <Button 
            title={
              <span className="flex items-center justify-center gap-2">
                <Car className="w-5 h-5" />
                Iniciar Sesión
              </span>
            } 
            loading={loading} 
            type="submit"
            classes="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          />
        </form>
        
        <p className="text-sm font-normal text-center mt-6 text-gray-600">
          ¿No tienes una cuenta?{" "}
          <Link to={"/captain/signup"} className="font-semibold text-orange-600 hover:text-orange-700">
            Regístrate
          </Link>
        </p>
      </div>
      
      <div className="mt-8">
        <Button
          type={"link"}
          path={"/login"}
          title={"Iniciar como Usuario"}
          classes={"bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"}
        />
        <p className="text-xs font-normal text-center text-gray-500 mt-6">
          Este sitio está protegido por reCAPTCHA y aplican la{" "}
          <span className="font-semibold underline cursor-pointer">Política de Privacidad</span> y{" "}
          <span className="font-semibold underline cursor-pointer">Términos de Servicio</span> de Google.
        </p>
      </div>
    </div>
  );
}

export default CaptainLogin;
