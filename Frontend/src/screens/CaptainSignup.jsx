import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button, Heading, Input } from "../components";
import axios from "axios";
import { ArrowLeft, ChevronRight, User, Phone, Mail, Lock, Car, Palette, Hash, Users, CheckCircle } from "lucide-react";
import Console from "../utils/console";

function CaptainSignup() {
  const [responseError, setResponseError] = useState("");
  const [showVehiclePanel, setShowVehiclePanel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
      
      // Show success message before navigation
      setShowSuccessMessage(true);
      setTimeout(() => {
        navigation("/captain/home");
      }, 4000);
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
    <div className="w-full min-h-dvh bg-gradient-to-br from-orange-50 via-white to-red-50 flex flex-col justify-between p-6">
      {/* Success Message Modal */}
      {showSuccessMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fadeIn">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Bienvenido Conductor!</h3>
              <p className="text-gray-600 mb-4">Tu cuenta de conductor ha sido creada exitosamente.</p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-4">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-yellow-800 mb-1">
                      📧 Verifica tu correo
                    </p>
                    <p className="text-xs text-yellow-700">
                      Hemos enviado un correo de verificación. 
                      <span className="font-bold"> Revisa tu carpeta de SPAM</span> si no lo ves en tu bandeja principal.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2"></div>
                Redirigiendo al portal...
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="mb-8">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/1063/1063376.png" 
            alt="Driver Icon" 
            className="w-16 h-16 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            Únete como Conductor
          </h1>
          <p className="text-center text-gray-600 text-sm">
            {!showVehiclePanel ? "Información Personal" : "Información del Vehículo"}
          </p>
        </div>
        
        <form onSubmit={handleSubmit(signupCaptain)} className="space-y-4">
          {!showVehiclePanel && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                  <Input
                    label={"Nombre"}
                    name={"firstname"}
                    register={register}
                    error={errors.firstname}
                    classes="pl-10"
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                  <Input
                    label={"Apellido"}
                    name={"lastname"}
                    register={register}
                    error={errors.lastname}
                    classes="pl-10"
                  />
                </div>
              </div>
              
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <Input
                  label={"Número de teléfono"}
                  type={"number"}
                  name={"phone"}
                  register={register}
                  error={errors.phone}
                  classes="pl-10"
                />
              </div>
              
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
              
              <div
                className={`cursor-pointer flex justify-center items-center gap-2 py-3 font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white w-full rounded-lg transition-all`}
                onClick={() => {
                  setShowVehiclePanel(true);
                }}
              >
                Siguiente <ChevronRight strokeWidth={2.5} />
              </div>
            </>
          )}
          {showVehiclePanel && (
            <>
              <div className="flex items-center mb-4">
                <ArrowLeft
                  onClick={() => {
                    setShowVehiclePanel(false);
                  }}
                  className="cursor-pointer -ml-1 hover:bg-gray-100 rounded-full p-1 transition-colors"
                  size={32}
                />
                <span className="ml-2 text-gray-600">Volver</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Palette className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                  <Input
                    label={"Color del vehículo"}
                    name={"color"}
                    register={register}
                    error={errors.color}
                    classes="pl-10"
                  />
                </div>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                  <Input
                    label={"Capacidad"}
                    type={"number"}
                    name={"capacity"}
                    register={register}
                    error={errors.capacity}
                    classes="pl-10"
                  />
                </div>
              </div>
              
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <Input
                  label={"Placa del vehículo"}
                  name={"number"}
                  register={register}
                  error={errors.number}
                  classes="pl-10"
                />
              </div>
              
              <div className="relative">
                <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <Input
                  label={"Tipo de vehículo"}
                  type={"select"}
                  options={["Carro", "Moto"]}
                  name={"type"}
                  register={register}
                  error={errors.type}
                  classes="pl-10"
                />
              </div>

              {responseError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <p className="text-sm text-red-700">{responseError}</p>
                </div>
              )}
              
              <Button 
                title="Crear Cuenta de Conductor" 
                loading={loading} 
                type="submit"
                classes="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              />
            </>
          )}
        </form>
        
        <p className="text-sm font-normal text-center mt-6 text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <Link to={"/captain/login"} className="font-semibold text-orange-600 hover:text-orange-700">
            Iniciar sesión
          </Link>
        </p>
      </div>
      
      <div className="mt-8">
        <Button
          type={"link"}
          path={"/signup"}
          title={"Registrarse como Usuario"}
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

export default CaptainSignup;
