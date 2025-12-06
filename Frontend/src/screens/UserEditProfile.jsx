import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, Heading, Input } from "../components";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import { ArrowLeft, Camera, Upload, X } from "lucide-react";
import Console from "../utils/console";
import { useAlert } from "../hooks/useAlert";
import { Alert } from "../components";

function UserEditProfile() {
  const token = localStorage.getItem("token");
  const [responseError, setResponseError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const { alert, showAlert, hideAlert } = useAlert();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { user, setUser } = useUser();

  const navigation = useNavigate();

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        showAlert('Formato no válido', 'Solo se permiten imágenes (JPEG, JPG, PNG, WEBP)', 'failure');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        showAlert('Archivo muy grande', 'La imagen no debe superar 5MB', 'failure');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image
  const handleImageUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('profileImage', selectedFile);

    try {
      setUploadingImage(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/upload/user/profile-image`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Update user context with new image
      setUser({
        ...user,
        profileImage: response.data.profileImage
      });

      showAlert('¡Foto actualizada!', 'Tu foto de perfil ha sido actualizada correctamente', 'success');
      setImagePreview(null);
      setSelectedFile(null);
    } catch (error) {
      Console.log(error);
      showAlert('Error', error.response?.data?.message || 'Error al subir la imagen', 'failure');
    } finally {
      setUploadingImage(false);
    }
  };

  // Delete image
  const handleImageDelete = async () => {
    try {
      setUploadingImage(true);
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/upload/profile-image`,
        {
          data: { userType: 'user' },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setUser({
        ...user,
        profileImage: ''
      });

      showAlert('Foto eliminada', 'Tu foto de perfil ha sido eliminada', 'success');
      setImagePreview(null);
      setSelectedFile(null);
    } catch (error) {
      Console.log(error);
      showAlert('Error', 'Error al eliminar la imagen', 'failure');
    } finally {
      setUploadingImage(false);
    }
  };

  // Cancel selection
  const handleCancelSelection = () => {
    setImagePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const updateUserProfile = async (data) => {
    const userData = {
      fullname: {
        firstname: data.firstname,
        lastname: data.lastname,
      },
      phone: data.phone,
    };
    Console.log(userData);
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/user/update`,
        userData,
        {
          headers: {
            token: token,
          },
        }
      );
      Console.log(response);
      showAlert('¡Actualización exitosa!', 'Tu perfil ha sido actualizado correctamente', 'success');

      setTimeout(() => {
        navigation("/home");
      }, 3000)
    } catch (error) {
      showAlert('Ocurrió un error', error.response?.data?.[0]?.msg || 'Error al actualizar', 'failure');

      Console.log(error.response);
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
    <div className="w-full h-dvh flex flex-col justify-between p-4 pt-6 overflow-y-auto">
      <Alert
        heading={alert.heading}
        text={alert.text}
        isVisible={alert.isVisible}
        onClose={hideAlert}
        type={alert.type}
      />
      <div>
        <div className="flex gap-3 mb-6">
          <ArrowLeft
            strokeWidth={3}
            className="mt-[5px] cursor-pointer"
            onClick={() => navigation(-1)}
          />
          <Heading title={"Editar Perfil"} />
        </div>

        {/* Profile Image Section - UBER Premium Style */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-black mb-4">Foto de perfil</h3>
          
          <div className="flex flex-col items-center gap-4">
            {/* Image Preview Circle */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-zinc-100 border-4 border-white shadow-xl">
                {imagePreview || user?.profileImage ? (
                  <img 
                    src={imagePreview || user?.profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                    <span className="text-5xl font-black text-blue-600">
                      {user?.fullname?.firstname?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Camera Icon Button - UBER Style */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-10 h-10 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-zinc-800 active:scale-95 transition-all duration-150"
                disabled={uploadingImage}
              >
                <Camera size={20} className="text-white" />
              </button>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageSelect}
              className="hidden"
            />

            {/* Action Buttons - UBER Style */}
            {imagePreview && selectedFile && (
              <div className="flex gap-3 w-full max-w-sm">
                <button
                  type="button"
                  onClick={handleCancelSelection}
                  className="flex-1 py-3 px-4 bg-white border-2 border-zinc-200 rounded-lg text-black font-medium hover:bg-zinc-50 active:scale-98 transition-all duration-150"
                  disabled={uploadingImage}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleImageUpload}
                  className="flex-1 py-3 px-4 bg-black rounded-lg text-white font-medium hover:bg-zinc-800 active:scale-98 transition-all duration-150 flex items-center justify-center gap-2"
                  disabled={uploadingImage}
                >
                  {uploadingImage ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Upload size={18} />
                      Subir foto
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Delete Button - Only if image exists */}
            {!imagePreview && user?.profileImage && (
              <button
                type="button"
                onClick={handleImageDelete}
                className="py-2 px-4 text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-2 active:scale-95 transition-all duration-150"
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <X size={16} />
                    Eliminar foto
                  </>
                )}
              </button>
            )}

            {/* Helper Text */}
            <p className="text-xs text-zinc-500 text-center max-w-xs">
              Formatos: JPEG, JPG, PNG, WEBP • Tamaño máximo: 5MB
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200 mb-6"></div>

        {/* Form Fields */}
        <h3 className="text-lg font-bold text-black mb-4">Información personal</h3>
        
        <Input
          label={"Correo electrónico"}
          type={"email"}
          name={"email"}
          register={register}
          error={errors.email}
          defaultValue={user.email}
          disabled={true}
        />
        <form onSubmit={handleSubmit(updateUserProfile)}>
          <Input
            label={"Nombre"}
            name={"firstname"}
            register={register}
            error={errors.firstname}
            defaultValue={user.fullname.firstname}
          />
          <Input
            label={"Apellido"}
            name={"lastname"}
            register={register}
            error={errors.lastname}
            defaultValue={user.fullname.lastname}
          />
          <Input
            label={"Número de teléfono"}
            type={"number"}
            name={"phone"}
            register={register}
            error={errors.phone}
            defaultValue={user.phone}
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

export default UserEditProfile;
