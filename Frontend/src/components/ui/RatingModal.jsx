import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, User } from "lucide-react";
import { cn } from "../../utils/cn";
import axios from "axios";
import toast from "react-hot-toast";

/**
 * Rating Modal Component - UBER Style
 * 
 * Features:
 * - Appears automatically when ride completes
 * - Cannot be closed until rating is submitted
 * - 5-star rating system with hover effects
 * - Optional comment field (max 250 chars)
 * - Avatar and rating display of ratee
 * - Smooth animations
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal visibility
 * @param {Object} props.rideData - Ride and ratee information
 * @param {Function} props.onSubmit - Callback after successful submission
 */
function RatingModal({ isOpen, rideData, onSubmit }) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStars, setSelectedStars] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleStarClick = (star) => {
    setSelectedStars(star);
  };

  const handleSubmit = async () => {
    if (selectedStars === 0) {
      toast.error("Por favor selecciona una calificación");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      
      // Debug: Log token to verify it exists
      console.log('Token en submit:', token ? 'Token presente' : 'Token ausente');
      
      if (!token) {
        toast.error("Sesión expirada. Por favor inicia sesión nuevamente");
        setIsSubmitting(false);
        return;
      }

      // Prepare the payload with explicit rateeId
      const payload = {
        rideId: rideData.rideId,
        stars: selectedStars,
        comment: comment.trim(),
        raterType: rideData.raterType,
        // Explicitly pass rateeId from rideData
        rateeId: rideData.rateeId || rideData.userId || rideData.captainId,
      };

      console.log('Rating payload:', payload);

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/ratings/submit`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Rating submitted successfully:", response.data);
      toast.success("¡Gracias por tu calificación!");
      
      // Call onSubmit callback
      if (onSubmit) {
        onSubmit();
      }

      // Reset form
      setSelectedStars(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting rating:", error);
      console.error("Error response:", error.response?.data);
      
      const errorMessage = error.response?.data?.message || "Error al enviar calificación";
      const errorReason = error.response?.data?.reason;
      
      if (error.response?.status === 401) {
        toast.error("Sesión expirada. Por favor inicia sesión nuevamente");
      } else if (error.response?.status === 403) {
        toast.error(errorReason || errorMessage);
      } else if (error.response?.status === 400) {
        toast.error(errorMessage);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!rideData) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Modal with Glassmorphism */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              className="relative w-full max-w-[400px] md:max-w-[480px] p-8 rounded-3xl shadow-uber-xl overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.1), 0 2px 16px 0 rgba(0, 0, 0, 0.05)"
              }}
            >
              {/* Header with Star Icon */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <Star size={32} className="text-yellow-500 fill-yellow-500" />
                </div>
                <h2 className="text-2xl font-bold text-uber-black text-center">
                  ¿Cómo fue tu viaje?
                </h2>
                <p className="text-sm text-uber-gray-500 mt-2 text-center">
                  Tu opinión nos ayuda a mejorar
                </p>
              </div>

              {/* Avatar and Name with Profile Photo */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-20 h-20 mb-3">
                  {rideData.ratee.profileImage ? (
                    <img
                      src={rideData.ratee.profileImage}
                      alt={rideData.ratee.name}
                      className="w-20 h-20 rounded-full object-cover shadow-lg ring-4 ring-gray-100"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-gray-100 ${rideData.ratee.profileImage ? 'hidden' : 'flex'}`}
                  >
                    <span className="text-3xl font-black text-white">
                      {rideData.ratee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="text-lg font-semibold text-uber-black">
                  {rideData.ratee.name}
                </p>
                {rideData.ratee.rating && rideData.ratee.rating.count > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium text-uber-gray-600">
                      {rideData.ratee.rating.average.toFixed(1)} ({rideData.ratee.rating.count})
                    </span>
                  </div>
                )}
              </div>

              {/* Star Rating System */}
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="transition-transform duration-200 hover:scale-110 active:scale-95 focus:outline-none"
                  >
                    <Star
                      size={40}
                      className={cn(
                        "transition-colors duration-200",
                        star <= (hoveredStar || selectedStars)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-uber-gray-200 fill-uber-gray-200"
                      )}
                    />
                  </button>
                ))}
              </div>

              {/* Optional Comment */}
              <div className="mb-6">
                <textarea
                  value={comment}
                  onChange={(e) => {
                    if (e.target.value.length <= 250) {
                      setComment(e.target.value);
                    }
                  }}
                  placeholder="Cuéntanos más sobre tu experiencia (opcional)"
                  className="w-full min-h-[100px] p-4 border border-uber-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-uber-black focus:border-transparent transition-all"
                  maxLength={250}
                />
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-uber-gray-500">
                    {comment.length}/250
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || selectedStars === 0}
                className={cn(
                  "w-full py-4 rounded-uber-md font-bold text-white transition-all duration-200",
                  "min-h-[48px] active:scale-[0.98]",
                  selectedStars === 0
                    ? "bg-uber-gray-300 cursor-not-allowed"
                    : "bg-uber-black hover:bg-uber-gray-700 shadow-uber-md hover:shadow-uber-lg"
                )}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  "Enviar Calificación"
                )}
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default RatingModal;
