import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, Heading, Input } from "../components";
import axios from "axios";
import { useCaptain } from "../contexts/CaptainContext";
import { ArrowLeft } from "lucide-react";
import Console from "../utils/console";
import { useAlert } from "../hooks/useAlert";
import { Alert } from "../components";

function CaptainEditProfile() {
  const token = localStorage.getItem("token");
  const [responseError, setResponseError] = useState("");
  const [loading, setLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { captain } = useCaptain();

  const navigation = useNavigate();

  const updateUserProfile = async (data) => {
    // Mapear tipo de vehículo
    const typeMap = {
      'carro': 'car',
      'moto': 'bike',
      'car': 'car',
      'bike': 'bike'
    };

    const captainData = {
      fullname: {
        firstname: data.firstname,
        lastname: data.lastname,
      },
      phone: data.phone,
      vehicle: {
        color: data.color,
        number: data.number,
        capacity: data.capacity,
        type: typeMap[data.type.toLowerCase()] || data.type.toLowerCase(),
      },
    };
    Console.log(captainData);
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/captain/update`,
        { captainData },
        {
          headers: {
            token: token,
          },
        }
      );
      Console.log(response);
      showAlert('¡Actualización exitosa!', 'Tu perfil ha sido actualizado correctamente', 'success');
      
      setTimeout(() => {
        navigation("/captain/home");
      }, 2000);
    } catch (error) {
      showAlert('Ocurrió un error', error.response?.data?.[0]?.msg || 'Error al actualizar', 'failure');
      Console.log(error.response);
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
      <Alert
        heading={alert.heading}
        text={alert.text}
        isVisible={alert.isVisible}
        onClose={hideAlert}
        type={alert.type}
      />
      <div className="overflow-auto">
        <div className="flex gap-3">
          <ArrowLeft
            strokeWidth={3}
            className="mt-[5px] cursor-pointer"
            onClick={() => navigation(-1)}
          />
          <Heading title={"Editar Perfil"} />
        </div>
        <Input
          label={"Correo electrónico"}
          type={"email"}
          name={"email"}
          register={register}
          error={errors.email}
          defaultValue={captain.email}
          disabled={true}
        />
        <form onSubmit={handleSubmit(updateUserProfile)}>
          <Input
            label={"Número de teléfono"}
            type={"number"}
            name={"phone"}
            register={register}
            error={errors.phone}
            defaultValue={captain.phone}
          />
          <div className="flex gap-4 -mb-2">
            <Input
              label={"Nombre"}
              name={"firstname"}
              register={register}
              error={errors.firstname}
              defaultValue={captain.fullname.firstname}
            />
            <Input
              label={"Apellido"}
              name={"lastname"}
              register={register}
              error={errors.lastname}
              defaultValue={captain.fullname.lastname}
            />
          </div>
          <div className="flex gap-4 -my-2">
            <Input
              label={"Color del vehículo"}
              name={"color"}
              register={register}
              error={errors.color}
              defaultValue={captain.vehicle.color}
            />
            <Input
              label={"Capacidad"}
              type={"number"}
              name={"capacity"}
              register={register}
              error={errors.capacity}
              defaultValue={captain.vehicle.capacity}
            />
          </div>
          <Input
            label={"Placa del vehículo"}
            name={"number"}
            register={register}
            error={errors.number}
            defaultValue={captain.vehicle.number}
          />
          <Input
            label={"Tipo de vehículo"}
            type={"select"}
            options={["Carro", "Moto"]}
            name={"type"}
            register={register}
            error={errors.type}
            defaultValue={captain.vehicle.type === 'car' ? 'Carro' : 'Moto'}
          />
          {responseError && (
            <p className="text-sm text-center mb-4 text-red-500">
              {responseError}
            </p>
          )}
          <Button
            title={"Actualizar Perfil"}
            loading={loading}
            type="submit"
            classes={"mt-4"}
          />
        </form>
      </div>
    </div>
  );
}

export default CaptainEditProfile;
