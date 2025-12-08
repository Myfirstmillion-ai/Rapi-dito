import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, Heading, Input } from "../components";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { useUser } from "../contexts/UserContext";
import { ArrowLeft, Camera, Upload, X } from "lucide-react";
import Console from "../utils/console";
import { useAlert } from "../hooks/useAlert";
import { Alert } from "../components";
import StarRating from "../components/ui/StarRating";

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
        `${API_BASE_URL}/upload/user/profile-image`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true,
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
        `${API_BASE_URL}/upload/profile-image`,
        {
          data: { userType: 'user' },
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true,
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
        `${API_BASE_URL}/user/update`,
        userData,
        {
          headers: {
            token: token,
          },
          withCredentials: true,
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
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 overflow-y-auto overflow-x-hidden pb-safe">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(16 185 129) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <Alert
        heading={alert.heading}
        text={alert.text}
        isVisible={alert.isVisible}
        onClose={hideAlert}
        type={alert.type}
      />
      
      <div className="relative p-4 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigation(-1)}
            className="p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 transition-all"
          >
            <ArrowLeft size={24} className="text-white" strokeWidth={3} />
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Editar Perfil
          </h1>
        </div>

        {/* Profile Image Section */}
        <div className="mb-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Foto de perfil</h3>
          
          <div className="flex flex-col items-center gap-4">
            {/* Image Preview Circle */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border-4 border-white/20 shadow-2xl">
                {imagePreview || user?.profileImage ? (
                  <img 
                    src={imagePreview || user?.profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-cyan-500">
                    <span className="text-5xl font-black text-white">
                      {user?.fullname?.firstname?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Camera Icon Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-emerald-500/50 active:scale-95 transition-all duration-150"
                disabled={uploadingImage}
              >
                <Camera size={22} className="text-white" />
              </button>
            </div>
            
            {/* Rating Display Below Profile Image */}
            {user?.rating && (
              <div className="mt-1">
                <StarRating 
                  average={user.rating.average} 
                  count={user.rating.count}
                  size={18}
                />
              </div>
            )}

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageSelect}
              className="hidden"
            />

            {/* Action Buttons */}
            {imagePreview && selectedFile && (
              <div className="flex gap-3 w-full max-w-sm">
                <button
                  type="button"
                  onClick={handleCancelSelection}
                  className="flex-1 py-3 px-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-medium hover:bg-white/20 active:scale-98 transition-all duration-150"
                  disabled={uploadingImage}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleImageUpload}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-emerald-500/50 active:scale-98 transition-all duration-150 flex items-center justify-center gap-2"
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

            {/* Delete Button */}
            {!imagePreview && user?.profileImage && (
              <button
                type="button"
                onClick={handleImageDelete}
                className="py-2 px-4 text-sm text-red-400 hover:text-red-300 font-medium flex items-center gap-2 active:scale-95 transition-all duration-150"
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <X size={16} />
                    Eliminar foto
                  </>
                )}
              </button>
            )}

            {/* Helper Text */}
            <p className="text-xs text-slate-400 text-center max-w-xs">
              Formatos: JPEG, JPG, PNG, WEBP • Tamaño máximo: 5MB
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Información personal</h3>
        
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
    </div>
  );
}

export default UserEditProfile;
