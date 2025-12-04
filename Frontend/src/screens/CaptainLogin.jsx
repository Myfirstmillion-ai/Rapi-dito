import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button, Heading, Input } from "../components";
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
    <div className="w-full h-dvh flex flex-col justify-between p-4 pt-6">
      <div>
        <Heading title={"Inicio de Conductor 🚗"} />
        <form onSubmit={handleSubmit(loginCaptain)}>
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
          <Link to="/captain/forgot-password" className="text-sm mb-2 inline-block">
            ¿Olvidaste tu contraseña?
          </Link>
          <Button title={"Iniciar Sesión"} loading={loading} type="submit" />
        </form>
        <p className="text-sm font-normal text-center mt-4">
          ¿No tienes una cuenta?{" "}
          <Link to={"/captain/signup"} className="font-semibold">
            Regístrate
          </Link>
        </p>

      </div>
      <div>
        <Button
          type={"link"}
          path={"/login"}
          title={"Iniciar como Usuario"}
          classes={"bg-green-500"}
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

export default CaptainLogin;
