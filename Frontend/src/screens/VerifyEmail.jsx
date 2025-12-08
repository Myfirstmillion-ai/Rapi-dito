import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import Console from "../utils/console";
import mailImg from "/mail.png";
import { Button, Spinner } from "../components";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const { userType } = useParams();
  const emailVerificationToken = searchParams.get("token");

  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const verifyEmail = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/${userType}/verify-email`,
        { token: emailVerificationToken },
        { withCredentials: true }
      );
      console.log(response.data)
      if (response.status === 200) {
        Console.log("Email verificado exitosamente:", response.data);
        setResponse("Tu correo ha sido verificado exitosamente. Puedes continuar usando la aplicación.");
      }
    } catch (error) {
      Console.error("Error verificando email:", error);
      if (error.response?.data?.message === "Token Expired") {
        setResponse("Tu enlace de verificación ha expirado. Por favor solicita un nuevo enlace.");
      } else if (error.response && error.response.data && error.response.data.message) {
        setResponse(error.response.data.message || "Ocurrió un error al verificar tu correo.");
      } else {
        setResponse("Ocurrió un error inesperado. Por favor intenta de nuevo más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (emailVerificationToken) {
      verifyEmail();
    } else {
      setResponse("Enlace de verificación inválido.");
    }
  }, [emailVerificationToken]);

  return (
    <div className="w-full h-dvh flex flex-col items-center justify-center text-center p-4">

      <h1 className="text-2xl font-bold">Verificación de Correo</h1>
      <img src={mailImg} alt="Verificar Email" className="h-24 mx-auto mb-4" />

      <p className="text-md font-semibold">
        {loading ? <Spinner /> : response}
      </p>
      <p className="my-4">{loading && "Verificando tu correo..."}</p>
      <Button
        title={"Ir al Inicio"}
        fun={() => navigate(userType === 'captain' ? '/captain/home' : '/home')}
        disabled={loading}
      />
    </div>
  );
};

export default VerifyEmail;
