import { useState } from "react";
import { Star } from "lucide-react";
import Button from "./Button";

const RatingModal = ({ 
  show, 
  onClose, 
  onSubmit, 
  ratingFor = "captain", 
  targetName = "" 
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Por favor selecciona una calificación");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ rating, comment, ratingFor });
      // Reset form
      setRating(0);
      setHoverRating(0);
      setComment("");
      onClose();
    } catch (error) {
      console.error("Error al enviar calificación:", error);
      alert("Error al enviar la calificación. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setRating(0);
      setHoverRating(0);
      setComment("");
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-2 text-center">
          Calificar {ratingFor === "captain" ? "Conductor" : "Pasajero"}
        </h2>
        {targetName && (
          <p className="text-gray-600 text-center mb-4">
            {targetName}
          </p>
        )}

        {/* Rating Stars */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110 focus:outline-none"
              disabled={loading}
            >
              <Star
                size={40}
                className={`${
                  star <= (hoverRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                } transition-colors`}
              />
            </button>
          ))}
        </div>

        {/* Rating Text */}
        {rating > 0 && (
          <p className="text-center text-gray-600 mb-4">
            {rating === 1 && "Muy malo"}
            {rating === 2 && "Malo"}
            {rating === 3 && "Regular"}
            {rating === 4 && "Bueno"}
            {rating === 5 && "Excelente"}
          </p>
        )}

        {/* Comment */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Comentario (opcional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comparte tu experiencia..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black resize-none"
            rows={4}
            disabled={loading}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <div className="flex-1">
            <Button
              title="Enviar"
              fun={handleSubmit}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
