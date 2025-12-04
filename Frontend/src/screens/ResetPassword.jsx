import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Button, Input } from '../components';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import Console from '../utils/console';
import axios from 'axios';
import { useAlert } from '../hooks/useAlert';
import { Alert } from '../components';
import password_image from '/password.svg'

const allowedParams = ["user", "captain"];

function ResetPassword() {
    const [loading, setLoading] = useState(false);

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const { userType } = useParams();
    const navigate = useNavigate();
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm();

    const { alert, showAlert, hideAlert } = useAlert();

    if (!allowedParams.includes(userType)) {
        return <Navigate to={'/not-found'} replace />
    }

    const resetPassword = async (data) => {
        if(data.password.length < 8 || data.confirmPassword.length < 8 ){
            showAlert("Contraseña muy corta", "La contraseña debe tener al menos 8 caracteres", 'failure')
            return;
        }
        if (data.password !== data.confirmPassword) {
            showAlert("Las contraseñas no coinciden", "La contraseña y la confirmación deben ser iguales. Por favor vuelve a ingresarlas", 'failure')
            return;
        }
        try {
            setLoading(true)
            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/${userType}/reset-password`,
                {
                    token: token,
                    password: data.password
                }
            );
            showAlert('¡Contraseña actualizada!', 'Tu contraseña ha sido restablecida exitosamente', 'success');
            Console.log(response);
            setTimeout(() => {
                navigate('/')
            }, 3000)
        } catch (error) {
            showAlert('Ocurrió un error', error.response?.data?.message || 'Error al restablecer', 'failure');
            setTimeout(() => {
                navigate('/' + userType + '/forgot-password')
            }, 5000);
            Console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full h-dvh flex flex-col p-4 pt-6">
            <Alert
                heading={alert.heading}
                text={alert.text}
                isVisible={alert.isVisible}
                onClose={hideAlert}
                type={alert.type}
            />
            <h1 className="text-2xl font-bold">Crear nueva contraseña</h1>
            <img className='w-60 mx-auto' src={password_image} alt="Imagen de contraseña" />
            <form onSubmit={handleSubmit(resetPassword)}>
                <Input
                    label={"Nueva contraseña"}
                    type={"password"}
                    name={"password"}
                    register={register}
                    error={errors.password}
                />
                <Input
                    label={"Confirmar contraseña"}
                    type={"password"}
                    name={"confirmPassword"}
                    register={register}
                    error={errors.confirmPassword}
                />
                <Button title={"Restablecer Contraseña"} loading={loading} type="submit" />
            </form>
        </div>
    )
}

export default ResetPassword
