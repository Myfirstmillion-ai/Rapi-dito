import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button, Heading, Input } from "../components";
import axios from "axios";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Console from "../utils/console";
import logo from '/logo-quickride.png';

function CaptainSignup() {
  const [responseError, setResponseError] = useState("");
  const [showVehiclePanel, setShowVehiclePanel] = useState(false);
  const [loading, setLoading] = useState(false);

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
    <div className="w-full h-dvh flex flex-col">
      {/* Header Section - UBER Green Gradient */}
      <div 
        className="w-full bg-uber-green p-6 pb-8"
        style={{
          background: 'linear-gradient(to bottom, #05A357, #048a4a)'
        }}
      >
        <img
          src={logo}
          alt="Rapidito Logo"
          className="w-24 mb-4 brightness-0 invert"
        />
        <h1 className="text-3xl font-bold text-white">Únete como Conductor</h1>
        <p className="text-base text-white opacity-90 mt-2">Gana dinero conduciendo en tu ciudad</p>
      </div>

      {/* Form Section - White Card */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-6 p-6 pt-8 shadow-2xl overflow-y-auto">
        <form onSubmit={handleSubmit(signupCaptain)}>
          {!showVehiclePanel && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
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
                <p className="text-sm text-center my-3 text-red-500 font-medium">
                  {responseError}
                </p>
              )}
              <button
                type="button"
                className="cursor-pointer flex justify-center items-center gap-2 py-3.5 font-semibold bg-uber-green hover:bg-green-600 active:scale-98 text-white w-full rounded-xl shadow-uber-md hover:shadow-uber-lg transition-all duration-200 mt-4"
                onClick={() => {
                  setShowVehiclePanel(true);
                }}
              >
                Siguiente <ChevronRight strokeWidth={2.5} />
              </button>
            </div>
          )}
          {showVehiclePanel && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  setShowVehiclePanel(false);
                }}
                className="flex items-center gap-2 text-uber-green hover:text-green-700 font-medium mb-4 cursor-pointer"
              >
                <ArrowLeft size={20} />
                <span>Volver</span>
              </button>
              
              <h2 className="text-xl font-bold text-gray-800 mb-4">Información del Vehículo</h2>
              
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label={"Color del vehículo"}
                  name={"color"}
                  register={register}
                  error={errors.color}
                />
                <Input
                  label={"Capacidad"}
                  type={"number"}
                  name={"capacity"}
                  register={register}
                  error={errors.capacity}
                />
              </div>
              <Input
                label={"Placa del vehículo"}
                name={"number"}
                register={register}
                error={errors.number}
              />
              <Input
                label={"Tipo de vehículo"}
                type={"select"}
                options={["Carro", "Moto"]}
                name={"type"}
                register={register}
                error={errors.type}
              />

              {responseError && (
                <p className="text-sm text-center my-3 text-red-500 font-medium">
                  {responseError}
                </p>
              )}
              <Button 
                title={"Registrarse"} 
                loading={loading} 
                type="submit"
                classes="bg-uber-green hover:bg-green-600 mt-4"
              />
            </div>
          )}
        </form>
        
        <p className="text-sm font-normal text-center mt-6">
          ¿Ya tienes una cuenta?{" "}
          <Link to={"/captain/login"} className="font-semibold text-uber-green hover:text-green-700">
            Iniciar sesión
          </Link>
        </p>

        <div className="mt-6">
          <Button
            type={"link"}
            path={"/signup"}
            title={"Registrarse como Usuario"}
            classes={"bg-uber-blue hover:bg-blue-600"}
          />
        </div>

        <p className="text-xs font-normal text-center text-gray-500 mt-6">
          Este sitio está protegido por reCAPTCHA y aplican la{" "}
          <span className="font-semibold underline">Política de Privacidad</span> y{" "}
          <span className="font-semibold underline">Términos de Servicio</span> de Google.
        </p>
      </div>
    </div>
  );
}

export default CaptainSignup;
