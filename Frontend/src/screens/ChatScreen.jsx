import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { ArrowLeft, Send, CheckCheck } from "lucide-react";
import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SocketDataContext } from "../contexts/SocketContext";
import Console from "../utils/console";
import Loading from "./Loading";

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
        `${API_BASE_URL}/ride/chat-details/${rideId}`
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
    
    // Add a small delay to ensure socket is connected
    const timeoutId = setTimeout(() => {
      loadChatDetails();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [getUserDetails]); // Depend on getUserDetails

  // Setup socket event listeners - FIX for white screen bug
  useEffect(() => {
    if (!socket || !rideId) return;

    // Handle incoming messages with proper validation
    const handleReceiveMessage = (data) => {
      try {
        // Validate message structure
        if (!data || typeof data.msg !== 'string') {
          Console.log('Invalid message data received:', data);
          return;
        }

        const { msg, by, time } = data;
        
        setMessages((prev) => [...prev, { msg, by, time }]);
        playSound();
        setHasNewMessage(true);
        
        // Vibrar si está disponible
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

    // Register event listeners
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("user-typing", handleUserTyping);
    socket.on("user-stop-typing", handleUserStopTyping);

    // Cleanup function - CRITICAL to prevent duplicate listeners
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("user-typing", handleUserTyping);
      socket.off("user-stop-typing", handleUserStopTyping);
    };
  }, [socket, rideId, userType]); // Include all dependencies

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col h-dvh bg-gray-100 items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error en el chat</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setError(null);
                  getUserDetails();
                }}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Reintentar
              </button>
              <button
                onClick={() => navigation(-1)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
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
      <div className="flex flex-col h-dvh bg-gray-100">
        {/* Header estilo WhatsApp */}
        <div className="flex h-fit items-center p-3 bg-green-600 gap-3 shadow-md">
          <ArrowLeft
            strokeWidth={2.5}
            className="cursor-pointer text-white"
            onClick={() => navigation(-1)}
          />
          <div className="relative w-10 h-10">
            {userData?.profileImage ? (
              <img
                src={userData.profileImage}
                alt={`${userData?.fullname?.firstname} ${userData?.fullname?.lastname}`}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
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
              className={`select-none rounded-full w-10 h-10 bg-white items-center justify-center ${userData?.profileImage ? 'hidden' : 'flex'}`}
            >
              <h1 className="text-lg font-semibold text-green-600">
                {userData?.fullname?.firstname[0]}
                {userData?.fullname?.lastname[0]}
              </h1>
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-lg font-semibold text-white leading-5">
              {userData?.fullname?.firstname} {userData?.fullname?.lastname}
            </h1>
            {isTyping ? (
              <p className="text-xs text-green-100 animate-pulse">escribiendo...</p>
            ) : (
              <p className="text-xs text-green-100">
                {userType === "user" ? "Conductor" : "Cliente"}
              </p>
            )}
          </div>

          {hasNewMessage && (
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          )}
        </div>

        {/* Área de mensajes con fondo estilo WhatsApp */}
        <div 
          className="overflow-y-auto flex-1 bg-[#e5ddd5]" 
          ref={scrollableDivRef}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4ccc4' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        >
          <div className="flex flex-col justify-end min-h-full w-full p-3">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm bg-white/80 inline-block px-4 py-2 rounded-lg">
                  Inicia la conversación con tu {userType === "user" ? "conductor" : "cliente"}
                </p>
              </div>
            )}
            {messages.length > 0 &&
              messages.map((message, i) => {
                // Validate message before rendering
                if (!message || typeof message.msg !== 'string') {
                  Console.log('Invalid message in render:', message);
                  return null;
                }
                
                const isMyMessage = message.by === userType;
                return (
                  <div
                    key={`${message.time}-${i}`}
                    className={`flex ${isMyMessage ? "justify-end" : "justify-start"} mb-1`}
                  >
                    <div
                      className={`relative max-w-[75%] px-3 pt-2 pb-1 shadow-sm ${
                        isMyMessage
                          ? "bg-[#dcf8c6] rounded-tl-lg rounded-tr-lg rounded-bl-lg"
                          : "bg-white rounded-tl-lg rounded-tr-lg rounded-br-lg"
                      }`}
                    >
                      {/* Triángulo del mensaje */}
                      <div
                        className={`absolute top-0 w-0 h-0 ${
                          isMyMessage
                            ? "right-[-6px] border-l-[6px] border-l-[#dcf8c6] border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"
                            : "left-[-6px] border-r-[6px] border-r-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"
                        }`}
                      ></div>
                      
                      <p className="text-sm text-gray-800 break-words">{message.msg}</p>
                      <div className={`flex items-center gap-1 justify-end mt-1`}>
                        <span className="text-[10px] text-gray-500">{message.time || ''}</span>
                        {isMyMessage && (
                          <CheckCheck size={14} className="text-blue-500" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            
            {/* Indicador de escribiendo */}
            {isTyping && (
              <div className="flex justify-start mb-1">
                <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input de mensaje estilo WhatsApp - Improved Visibility */}
        <div className="flex items-center p-2 bg-gray-100 gap-2">
          <div className="flex-1 flex items-center bg-white rounded-full px-4 py-2.5 shadow-sm border border-gray-200">
            <input
              ref={inputRef}
              placeholder="Escribe un mensaje..."
              className="w-full outline-none text-sm bg-transparent text-gray-900 placeholder-gray-500"
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
          <button 
            onClick={sendMessage}
            className={`cursor-pointer p-3 rounded-full flex items-center justify-center text-white transition-all duration-200 ${
              message.trim() 
                ? 'bg-green-500 hover:bg-green-600 active:scale-95' 
                : 'bg-gray-400'
            }`}
            disabled={!message.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    );
  } else {
    return <Loading />;
  }
}

export default ChatScreen;
