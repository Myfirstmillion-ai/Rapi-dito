import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { cn } from "../../utils/cn";

/**
 * Elite Message Notification Banner
 * Slides down from top when new message arrives
 * UBER-style design with auto-dismiss and tap to open
 * 
 * @param {Object} props
 * @param {string} props.senderName - Name of message sender
 * @param {string} props.message - Message preview text
 * @param {boolean} props.show - Controls visibility
 * @param {Function} props.onClose - Callback when banner closes
 * @param {Function} props.onTap - Callback when banner is tapped
 */
function MessageNotificationBanner({ 
  senderName = "Usuario",
  message = "",
  show = false,
  onClose = () => {},
  onTap = () => {}
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsAnimating(true);

      // Auto-dismiss after 3 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  const handleTap = () => {
    handleClose();
    onTap();
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-[400] pointer-events-none",
        "px-4 pt-4 pb-2"
      )}
    >
      <div
        onClick={handleTap}
        className={cn(
          "bg-uber-black text-white rounded-2xl shadow-uber-xl",
          "p-4 flex items-center gap-3 cursor-pointer pointer-events-auto",
          "transition-all duration-300 ease-out",
          isAnimating 
            ? "translate-y-0 opacity-100" 
            : "-translate-y-full opacity-0"
        )}
        style={{
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(0, 0, 0, 0.95)"
        }}
      >
        {/* Message Icon */}
        <div className="flex-shrink-0 w-12 h-12 bg-uber-blue rounded-full flex items-center justify-center animate-pulse">
          <MessageCircle size={24} strokeWidth={2} className="text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm mb-0.5">
            Nuevo mensaje de {senderName}
          </h3>
          <p className="text-xs text-gray-300 truncate">
            {message || "Toca para abrir el chat"}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <X size={18} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

export default MessageNotificationBanner;
