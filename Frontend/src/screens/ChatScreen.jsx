import axios from "axios";
import { ArrowLeft, Send, Image as ImageIcon, Loader2 } from "lucide-react";
import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SocketDataContext } from "../contexts/SocketContext";
import Console from "../utils/console";
import Loading from "./Loading";
import { motion } from "framer-motion";

// URL de sonido de notificación
const MESSAGE_SOUND = "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3";

const playSound = () => {
  try {
    const audio = new Audio(MESSAGE_SOUND);
    audio.volume = 0.3;
    audio.play().catch(e => Console.log("Error reproduciendo sonido:", e));
  } catch (e) {
    Console.log("Error con audio:", e);
  }
};

function ChatScreen() {
  const { rideId, userType } = useParams();
  const navigation = useNavigate();
  const scrollableDivRef = useRef(null);
  const inputRef = useRef(null);

  const { socket } = useContext(SocketDataContext);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [error, setError] = useState(null);
  const typingTimeoutRef = useRef(null);

  // Safe JSON parsing with error handling
  const getCurrentUser = () => {
    try {
      const userDataString = localStorage.getItem("userData");
      if (!userDataString) return null;
      const userData = JSON.parse(userDataString);
      return userData?.data?._id || null;
    } catch (e) {
      Console.log("Error parsing user data:", e);
      return null;
    }
  };

  const currentUser = getCurrentUser();

  const scrollToBottom = () => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
    }
  };

  const getUserDetails = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/ride/chat-details/${rideId}`
      );

      // Validate response data
      if (!response.data || !response.data.user || !response.data.captain) {
        Console.log("Invalid response data from server");
        setError("Error al cargar datos del chat");
        return;
      }

      // Proteger usuarios no autorizados de leer los chats
      if (currentUser !== response.data.user._id && currentUser !== response.data.captain._id) {
        Console.log("No estás autorizado para ver este chat.");
        navigation(-1);
        return;
      }
      
      // Validate messages array
      const validMessages = Array.isArray(response.data.messages) ? response.data.messages : [];
      setMessages(validMessages);

      socket.emit("join-room", rideId);
      if (userType === "user") {
        setUserData(response.data.captain);
      }
      if (userType === "captain") {
        setUserData(response.data.user);
      }
    } catch (error) {
      Console.log("Error fetching chat details:", error);
      setError("No se pudo cargar el chat. Por favor, intenta de nuevo.");
    }
  }, [rideId, currentUser, navigation, socket, userType]);

  const handleTyping = () => {
    socket.emit("typing", { rideId, userType });
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", { rideId, userType });
    }, 1000);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      return;
    }

    try {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      socket.emit("message", { rideId: rideId, msg: message, userType: userType, time });
      socket.emit("stop-typing", { rideId, userType });
      setMessages((prev) => [...prev, { msg: message, by: userType, time, status: 'sent' }]);

      setMessage("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      Console.log("Error sending message:", error);
      setError("Error al enviar mensaje");
    }
  };

  useEffect(() => {
    scrollToBottom();
    setHasNewMessage(false);
  }, [messages]);

  useEffect(() => {
    if (userData) {
      scrollToBottom();
    }
  }, [userData]);

  // Load chat details on mount
  useEffect(() => {
    const loadChatDetails = async () => {
      await getUserDetails();
    };
    
    const timeoutId = setTimeout(() => {
      loadChatDetails();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [getUserDetails]);

  // Setup socket event listeners
  useEffect(() => {
    if (!socket || !rideId) return;

    const handleReceiveMessage = (data) => {
      try {
        if (!data || typeof data.msg !== 'string') {
          Console.log('Invalid message data received:', data);
          return;
        }

        const { msg, by, time } = data;
        
        setMessages((prev) => [...prev, { msg, by, time }]);
        playSound();
        setHasNewMessage(true);
        
        if (navigator.vibrate) {
          navigator.vibrate([100]);
        }
      } catch (error) {
        Console.log("Error handling received message:", error);
      }
    };

    const handleUserTyping = ({ userType: typingUser }) => {
      try {
        if (typingUser !== userType) {
          setIsTyping(true);
        }
      } catch (error) {
        Console.log("Error handling typing event:", error);
      }
    };

    const handleUserStopTyping = ({ userType: typingUser }) => {
      try {
        if (typingUser !== userType) {
          setIsTyping(false);
        }
      } catch (error) {
        Console.log("Error handling stop typing event:", error);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("user-typing", handleUserTyping);
    socket.on("user-stop-typing", handleUserStopTyping);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("user-typing", handleUserTyping);
      socket.off("user-stop-typing", handleUserStopTyping);
    };
  }, [socket, rideId, userType]);

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col h-dvh bg-white dark:bg-black items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-800">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error en el chat</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setError(null);
                  getUserDetails();
                }}
                className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-2xl transition-all"
              >
                Reintentar
              </button>
              <button
                onClick={() => navigation(-1)}
                className="flex-1 h-12 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-2xl transition-all"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (userData) {
    return (
      <div className="flex flex-col h-dvh bg-white dark:bg-black">
        {/* Header - Swiss Minimalist */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-20 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800"
        >
          <div className="px-4 py-3 flex items-center gap-3">
            {/* Back Button */}
            <button
              onClick={() => navigation(-1)}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center flex-shrink-0"
            >
              <ArrowLeft size={20} className="text-gray-900 dark:text-white" />
            </button>

            {/* Profile Image + Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative w-10 h-10 flex-shrink-0">
                {userData?.profileImage ? (
                  <img
                    src={userData.profileImage}
                    alt={`${userData?.fullname?.firstname} ${userData?.fullname?.lastname}`}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-800"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextElementSibling) {
                        e.target.nextElementSibling.classList.remove('hidden');
                        e.target.nextElementSibling.classList.add('flex');
                      }
                    }}
                  />
                ) : null}
                <div 
                  className={`w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center ${userData?.profileImage ? 'hidden' : 'flex'}`}
                >
                  <span className="text-sm font-bold text-white">
                    {userData?.fullname?.firstname[0]}
                    {userData?.fullname?.lastname[0]}
                  </span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-base font-bold text-gray-900 dark:text-white truncate">
                  {userData?.fullname?.firstname} {userData?.fullname?.lastname}
                </h1>
                {isTyping ? (
                  <p className="text-xs text-emerald-500 animate-pulse">escribiendo...</p>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {userType === "user" ? "Conductor" : "Pasajero"}
                  </p>
                )}
              </div>
            </div>

            {/* New Message Indicator */}
            {hasNewMessage && (
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse flex-shrink-0"></div>
            )}
          </div>
        </motion.div>

        {/* Messages Area */}
        <div 
          className="flex-1 overflow-y-auto bg-gray-50 dark:bg-black px-4 py-4" 
          ref={scrollableDivRef}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="flex flex-col justify-end min-h-full">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ImageIcon size={24} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Inicia la conversación
                </p>
              </div>
            )}
            {messages.length > 0 &&
              messages.map((message, i) => {
                if (!message || typeof message.msg !== 'string') {
                  Console.log('Invalid message in render:', message);
                  return null;
                }
                
                const isMyMessage = message.by === userType;
                return (
                  <motion.div
                    key={`${message.time}-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${isMyMessage ? "justify-end" : "justify-start"} mb-2`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-3xl shadow-sm ${
                        isMyMessage
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-br-lg"
                          : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-bl-lg"
                      }`}
                    >
                      <p className="text-sm break-words">{message.msg}</p>
                      <div className={`flex items-center gap-1 justify-end mt-1`}>
                        <span className={`text-[10px] ${isMyMessage ? 'text-emerald-100' : 'text-gray-400'}`}>
                          {message.time || ''}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            
            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start mb-2"
              >
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Input Area - Swiss Minimalist */}
        <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4">
          <div className="flex items-end gap-3">
            {/* Input Container */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                placeholder="Escribe un mensaje..."
                className="w-full h-12 pl-4 pr-4 bg-gray-100 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 focus:border-emerald-500 dark:focus:border-emerald-500 rounded-3xl outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400 transition-colors"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  handleTyping();
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage(e);
                  }
                }}
                autoFocus
                spellCheck="false"
              />
            </div>

            {/* Send Button */}
            <button 
              onClick={sendMessage}
              disabled={!message.trim()}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all flex-shrink-0 ${
                message.trim() 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg active:scale-95' 
                  : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
              }`}
            >
              {message.trim() ? (
                <Send size={18} />
              ) : (
                <Send size={18} className="opacity-50" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return <Loading />;
  }
}

export default ChatScreen;