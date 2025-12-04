import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button, Heading, Input } from "../components";
import axios from "axios";
import Console from "../utils/console";

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
    <div className="w-full h-dvh flex flex-col justify-between p-4 pt-6">
      <div>
        <Heading title={"Registro de Usuario 🧑🏻"} />
        <form onSubmit={handleSubmit(signupUser)}>
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
            <p className="text-sm text-center mb-4 text-red-500">
              {responseError}
            </p>
          )}
          <Button title={"Registrarse"} loading={loading} type="submit" />
        </form>
        <p className="text-sm font-normal text-center mt-4">
          ¿Ya tienes una cuenta?{" "}
          <Link to={"/login"} className="font-semibold">
            Iniciar sesión
          </Link>
        </p>
      </div>
      <div>
        <Button
          type={"link"}
          path={"/captain/signup"}
          title={"Registrarse como Conductor"}
          classes={"bg-orange-500"}
        />
        <p className="text-xs font-normal text-center self-end mt-6">
          Este sitio está protegido por reCAPTCHA y aplican la{" "}
          <span className="font-semibold underline">Política de Privacidad</span> y{" "}
          <span className="font-semibold underline">Términos de Servicio</span> de Google.
        </p>
      </div>
    </div>
  );
}

export default UserSignup;
