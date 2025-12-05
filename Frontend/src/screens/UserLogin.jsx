import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button, Heading, Input } from "../components";
import axios from "axios";
import Console from "../utils/console";
import logo from '/logo-quickride.png';

function UserLogin() {
  const [responseError, setResponseError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="relative w-full h-dvh overflow-hidden bg-gray-50">
      {/* Hero Image Section - Top Third */}
      <div 
        className="h-1/3 w-full bg-cover bg-center relative"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(39,110,241,0.7), rgba(39,110,241,0.9)), url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80')`
        }}
      >
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-6">
          <img
            className="h-10 mb-4 object-contain brightness-0 invert"
            src={logo}
            alt="Rapidito Logo"
          />
          <h1 className="text-3xl font-bold mb-2">¡Bienvenido de nuevo!</h1>
          <p className="text-base opacity-90">Inicia sesión para solicitar tu viaje</p>
        </div>
      </div>

      {/* Form Section - Bottom Two Thirds */}
      <div className="h-2/3 w-full bg-white rounded-t-3xl -mt-8 shadow-2xl p-6 pt-8 overflow-y-auto">
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit(loginUser)} className="space-y-4">
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
              <p className="text-sm text-center text-red-500">
                {responseError}
              </p>
            )}
            <Link to="/user/forgot-password" className="text-sm text-uber-blue hover:underline inline-block">
              ¿Olvidaste tu contraseña?
            </Link>
            <Button title={"Iniciar Sesión"} loading={loading} type="submit" />
          </form>
          
          <p className="text-sm font-normal text-center mt-6">
            ¿No tienes una cuenta?{" "}
            <Link to={"/signup"} className="font-semibold text-uber-blue hover:underline">
              Regístrate aquí
            </Link>
          </p>

          <div className="mt-8 border-t pt-6">
            <Button
              type={"link"}
              path={"/captain/login"}
              title={"Iniciar como Conductor"}
              classes={"bg-uber-green hover:bg-green-600"}
            />
          </div>
          
          <p className="text-xs font-normal text-center text-gray-500 mt-6">
            Este sitio está protegido por reCAPTCHA y aplican la{" "}
            <span className="font-semibold underline">Política de Privacidad</span> y{" "}
            <span className="font-semibold underline">Términos de Servicio</span> de Google.
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
