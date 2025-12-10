import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCaptain } from "../contexts/CaptainContext";
import { 
  ArrowLeft, 
  Camera, 
  Upload, 
  X, 
  Loader2, 
  User, 
  Mail, 
  Phone,
  Car as CarIcon,
  Bike as BikeIcon,
  Palette,
  Hash,
  Users,
  Package
} from "lucide-react";
import Console from "../utils/console";
import { useAlert } from "../hooks/useAlert";
import { Alert } from "../components";
import StarRating from "../components/ui/StarRating";
import { motion } from "framer-motion";

function CaptainEditProfile() {
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

  const { captain, setCaptain } = useCaptain();
  const navigation = useNavigate();

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        showAlert('Formato no válido', 'Solo se permiten imágenes (JPEG, JPG, PNG, WEBP)', 'failure');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showAlert('Archivo muy grande', 'La imagen no debe superar 5MB', 'failure');
        return;
      }

      setSelectedFile(file);
      
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
        `${import.meta.env.VITE_SERVER_URL}/upload/captain/profile-image`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setCaptain({
        ...captain,
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
          data: { userType: 'captain' },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setCaptain({
        ...captain,
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
        brand: data.brand || "",
        model: data.model || "",
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
      
      const updatedCaptain = {
        ...captain,
        ...captainData
      };
      setCaptain(updatedCaptain);
      
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData) {
        userData.data = updatedCaptain;
        localStorage.setItem("userData", JSON.stringify(userData));
      }
      
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
    <div className="min-h-screen bg-white dark:bg-black overflow-y-auto">
      <Alert
        heading={alert.heading}
        text={alert.text}
        isVisible={alert.isVisible}
        onClose={hideAlert}
        type={alert.type}
      />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-20 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800"
      >
        <div className="px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigation(-1)}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-gray-900 dark:text-white" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Editar perfil
          </h1>
        </div>
      </motion.div>

      {/* Content */}
      <div className="px-6 py-8 max-w-2xl mx-auto">
        {/* Profile Image Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex flex-col items-center">
            {/* Image Container */}
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-900 border-4 border-gray-200 dark:border-gray-800">
                {imagePreview || captain?.profileImage ? (
                  <img 
                    src={imagePreview || captain?.profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600">
                    <User size={48} className="text-white" />
                  </div>
                )}
              </div>
              
              {/* Camera Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                disabled={uploadingImage}
              >
                <Camera size={20} className="text-white" />
              </button>
            </div>
            
            {/* Rating Display */}
            {captain?.rating && (
              <div className="mb-4">
                <StarRating 
                  average={captain.rating.average} 
                  count={captain.rating.count}
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
                  className="flex-1 h-12 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white font-medium rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                  disabled={uploadingImage}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleImageUpload}
                  className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
                  disabled={uploadingImage}
                >
                  {uploadingImage ? (
                    <Loader2 size={18} className="animate-spin" />
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
            {!imagePreview && captain?.profileImage && (
              <button
                type="button"
                onClick={handleImageDelete}
                className="mt-2 text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium flex items-center gap-2 transition-colors"
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <>
                    <X size={14} />
                    Eliminar foto
                  </>
                )}
              </button>
            )}

            {/* Helper Text */}
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3 max-w-xs">
              JPEG, JPG, PNG o WEBP • Máx. 5MB
            </p>
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit(updateUserProfile)} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Información personal
              </h2>

              {/* Email - Read Only */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    defaultValue={captain.email}
                    disabled={true}
                    className="w-full h-14 pl-12 pr-4 bg-gray-100 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl text-gray-500 dark:text-gray-400 outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Teléfono
                </label>
                <div className="relative">
                  <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    {...register("phone", { required: true })}
                    defaultValue={captain.phone}
                    className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 focus:border-emerald-500 dark:focus:border-emerald-500 rounded-2xl text-gray-900 dark:text-white outline-none transition-colors"
                    placeholder="+58 276 123 4567"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-500">El teléfono es requerido</p>
                )}
              </div>

              {/* Name Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Nombre
                  </label>
                  <div className="relative">
                    <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      {...register("firstname", { required: true })}
                      defaultValue={captain.fullname.firstname}
                      className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 focus:border-emerald-500 dark:focus:border-emerald-500 rounded-2xl text-gray-900 dark:text-white outline-none transition-colors"
                      placeholder="Nombre"
                    />
                  </div>
                  {errors.firstname && (
                    <p className="mt-2 text-sm text-red-500">Requerido</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Apellido
                  </label>
                  <div className="relative">
                    <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      {...register("lastname", { required: true })}
                      defaultValue={captain.fullname.lastname}
                      className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 focus:border-emerald-500 dark:focus:border-emerald-500 rounded-2xl text-gray-900 dark:text-white outline-none transition-colors"
                      placeholder="Apellido"
                    />
                  </div>
                  {errors.lastname && (
                    <p className="mt-2 text-sm text-red-500">Requerido</p>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-800"></div>

            {/* Vehicle Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Información del vehículo
              </h2>

              {/* Vehicle Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Tipo de vehículo
                </label>
                <div className="relative">
                  {captain.vehicle.type === 'car' ? (
                    <CarIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  ) : (
                    <BikeIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  )}
                  <select
                    {...register("type", { required: true })}
                    defaultValue={captain.vehicle.type === 'car' ? 'carro' : 'moto'}
                    className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 focus:border-emerald-500 dark:focus:border-emerald-500 rounded-2xl text-gray-900 dark:text-white outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="carro">Carro</option>
                    <option value="moto">Moto</option>
                  </select>
                </div>
                {errors.type && (
                  <p className="mt-2 text-sm text-red-500">El tipo es requerido</p>
                )}
              </div>

              {/* Brand & Model Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Brand */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Marca
                  </label>
                  <div className="relative">
                    <Package size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      {...register("brand", { required: true })}
                      defaultValue={captain.vehicle.brand || ''}
                      className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 focus:border-emerald-500 dark:focus:border-emerald-500 rounded-2xl text-gray-900 dark:text-white outline-none transition-colors"
                      placeholder="Toyota"
                    />
                  </div>
                  {errors.brand && (
                    <p className="mt-2 text-sm text-red-500">Requerido</p>
                  )}
                </div>

                {/* Model */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Modelo
                  </label>
                  <div className="relative">
                    <Package size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      {...register("model", { required: true })}
                      defaultValue={captain.vehicle.model || ''}
                      className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 focus:border-emerald-500 dark:focus:border-emerald-500 rounded-2xl text-gray-900 dark:text-white outline-none transition-colors"
                      placeholder="Corolla"
                    />
                  </div>
                  {errors.model && (
                    <p className="mt-2 text-sm text-red-500">Requerido</p>
                  )}
                </div>
              </div>

              {/* Color & Capacity Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Color */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Color
                  </label>
                  <div className="relative">
                    <Palette size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      {...register("color", { required: true })}
                      defaultValue={captain.vehicle.color}
                      className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 focus:border-emerald-500 dark:focus:border-emerald-500 rounded-2xl text-gray-900 dark:text-white outline-none transition-colors"
                      placeholder="Negro"
                    />
                  </div>
                  {errors.color && (
                    <p className="mt-2 text-sm text-red-500">Requerido</p>
                  )}
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Capacidad
                  </label>
                  <div className="relative">
                    <Users size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      {...register("capacity", { required: true })}
                      defaultValue={captain.vehicle.capacity}
                      className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 focus:border-emerald-500 dark:focus:border-emerald-500 rounded-2xl text-gray-900 dark:text-white outline-none transition-colors"
                      placeholder="4"
                    />
                  </div>
                  {errors.capacity && (
                    <p className="mt-2 text-sm text-red-500">Requerido</p>
                  )}
                </div>
              </div>

              {/* Plate Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Placa del vehículo
                </label>
                <div className="relative">
                  <Hash size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    {...register("number", { required: true })}
                    defaultValue={captain.vehicle.number}
                    className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 focus:border-emerald-500 dark:focus:border-emerald-500 rounded-2xl text-gray-900 dark:text-white outline-none transition-colors uppercase"
                    placeholder="ABC-123"
                  />
                </div>
                {errors.number && (
                  <p className="mt-2 text-sm text-red-500">La placa es requerida</p>
                )}
              </div>
            </div>

            {/* Error Message */}
            {responseError && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm">
                {responseError}
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Actualizando...</span>
                </>
              ) : (
                'Guardar cambios'
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Bottom Safe Area */}
      <div className="h-20" />
    </div>
  );
}

export default CaptainEditProfile;