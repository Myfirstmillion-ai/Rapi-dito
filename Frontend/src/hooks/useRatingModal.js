import { useState, useEffect, useContext } from "react";
import { SocketDataContext } from "../contexts/SocketContext";

/**
 * Custom hook to manage rating modal state
 * Listens for rating:request socket events and manages modal visibility
 * 
 * @returns {Object} - { isRatingModalOpen, ratingData, closeRatingModal }
 */
export function useRatingModal() {
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratingData, setRatingData] = useState(null);
  const { socket } = useContext(SocketDataContext);

  useEffect(() => {
    if (!socket) return;

    // Listen for rating request
    const handleRatingRequest = (data) => {
      console.log("Rating request received:", data);
      setRatingData(data);
      setIsRatingModalOpen(true);
    };

    socket.on("rating:request", handleRatingRequest);

    return () => {
      socket.off("rating:request", handleRatingRequest);
    };
  }, [socket]);

  const closeRatingModal = () => {
    setIsRatingModalOpen(false);
    setRatingData(null);
  };

  return {
    isRatingModalOpen,
    ratingData,
    closeRatingModal,
  };
}
