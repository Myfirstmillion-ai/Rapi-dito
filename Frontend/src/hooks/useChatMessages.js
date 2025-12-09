import { useState, useCallback, useEffect } from "react";
import Console from "../utils/console";

/**
 * Custom hook for managing chat messages and notifications
 * Handles message state, unread count, and message banners
 *
 * @param {Object} socket - Socket.io instance
 * @param {string} rideId - Current ride ID
 * @returns {Object} Chat message state and functions
 */
export function useChatMessages(socket, rideId) {
  // Message state
  const [messages, setMessages] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [showMessageBanner, setShowMessageBanner] = useState(false);
  const [lastMessage, setLastMessage] = useState({ sender: "", text: "" });

  // Add a new message
  const addMessage = useCallback((message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  // Mark messages as read
  const markMessagesAsRead = useCallback(() => {
    setUnreadMessages(0);
    setShowMessageBanner(false);
  }, []);

  // Increment unread count
  const incrementUnreadCount = useCallback(() => {
    setUnreadMessages(prev => prev + 1);
  }, []);

  // Show message notification banner
  const showMessageNotification = useCallback((sender, text) => {
    setLastMessage({ sender, text });
    setShowMessageBanner(true);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      setShowMessageBanner(false);
    }, 5000);
  }, []);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setUnreadMessages(0);
    setShowMessageBanner(false);
    setLastMessage({ sender: "", text: "" });
  }, []);

  // Socket event listeners for real-time messages
  useEffect(() => {
    if (!socket || !rideId) return;

    const handleIncomingMessage = (data) => {
      Console.log("Received message:", data);

      const newMessage = {
        text: data.msg,
        sender: data.by,
        time: data.time,
      };

      addMessage(newMessage);
      incrementUnreadCount();
      showMessageNotification(data.by, data.msg);
    };

    socket.on("receiveMessage", handleIncomingMessage);

    return () => {
      socket.off("receiveMessage", handleIncomingMessage);
    };
  }, [socket, rideId, addMessage, incrementUnreadCount, showMessageNotification]);

  return {
    // State
    messages,
    unreadMessages,
    showMessageBanner,
    lastMessage,

    // Setters
    setMessages,
    setUnreadMessages,
    setShowMessageBanner,
    setLastMessage,

    // Actions
    addMessage,
    markMessagesAsRead,
    incrementUnreadCount,
    showMessageNotification,
    clearMessages,
  };
}
