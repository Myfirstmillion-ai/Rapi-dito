import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button, Heading, Input } from "../components";
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
    <div className="relative w-full h-dvh overflow-hidden bg-gray-50">
      {/* Header Section */}
      <div className="h-auto w-full bg-uber-blue p-6 pb-8 relative">
        <img
          className="h-8 mb-4 object-contain brightness-0 invert"
          src={logo}
          alt="Rapidito Logo"
        />
        <h1 className="text-2xl font-bold text-white mb-1">Crea tu cuenta</h1>
        <p className="text-sm text-white opacity-90">Comienza a viajar con Rapidito</p>
      </div>

      {/* Form Section */}
      <div className="h-full w-full bg-white rounded-t-3xl -mt-6 shadow-2xl p-6 overflow-y-auto pb-24">
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit(signupUser)} className="space-y-3">
            <div className="flex gap-4 -mb-2">
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
              <p className="text-sm text-center text-red-500">
                {responseError}
              </p>
            )}
            <Button title={"Registrarse"} loading={loading} type="submit" />
          </form>
          
          <p className="text-sm font-normal text-center mt-6">
            ¿Ya tienes una cuenta?{" "}
            <Link to={"/login"} className="font-semibold text-uber-blue hover:underline">
              Iniciar sesión
            </Link>
          </p>

          <div className="mt-8 border-t pt-6">
            <Button
              type={"link"}
              path={"/captain/signup"}
              title={"Registrarse como Conductor"}
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

export default UserSignup;
