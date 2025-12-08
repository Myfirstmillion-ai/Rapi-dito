import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, User } from "lucide-react";
import { cn } from "../../utils/cn";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
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
        `${API_BASE_URL}/ratings/submit`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
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

  // Defensive check for malformed data - prevents crash on missing nested properties
  if (!rideData || !rideData.ratee || !rideData.ratee.name) {
    console.warn("RatingModal: Missing required rideData or ratee information");
    return null;
  }

  // Safe getter for initials with fallback
  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '?';
    return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase() || '?';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay - Premium fade with cubic-bezier */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1] // Premium cubic-bezier (ease-out-quart)
            }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Modal with Glassmorphism - Premium spring animation */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{
                type: "spring",
                damping: 28,
                stiffness: 350,
                mass: 0.8
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
                      {getInitials(rideData.ratee.name)}
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

              {/* Star Rating System - Premium tactile feedback */}
              <div className="flex justify-center gap-3 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.15] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 rounded-lg p-1"
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    <Star
                      size={42}
                      className={cn(
                        "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] drop-shadow-sm",
                        star <= (hoveredStar || selectedStars)
                          ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_2px_4px_rgba(250,204,21,0.4)]"
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

              {/* Submit Button - Premium tactile feel */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || selectedStars === 0}
                className={cn(
                  "w-full py-4 rounded-xl font-bold text-white",
                  "min-h-[52px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                  "active:scale-[0.97] active:brightness-95",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-uber-black",
                  selectedStars === 0
                    ? "bg-gradient-to-b from-gray-300 to-gray-350 text-gray-500 cursor-not-allowed shadow-sm"
                    : "bg-gradient-to-b from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.35)] hover:-translate-y-0.5"
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
