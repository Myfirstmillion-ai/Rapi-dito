import { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Paperclip, Image as ImageIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { SocketDataContext } from '../../contexts/SocketContext';
import { Avatar, GlassCard, IconButton } from '../../components/atoms';
import { AppShell } from '../../components/layout';
import { FADE_VARIANTS, STAGGER_ITEM, triggerHaptic } from '../../design-system';

/**
 * ChatScreen - In-Ride Chat
 * 
 * Real-time chat with glass bubble messages.
 * 
 * @param {Object} otherUser - The user to chat with (driver or passenger)
 */
function ChatScreen({ otherUser }) {
  const navigate = useNavigate();
  const { socket } = useContext(SocketDataContext);
  const { userId } = useParams();
  
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Mock other user data if not provided
  const chatUser = otherUser || {
    id: userId || '1',
    name: 'Juan Pérez',
    avatar: null,
    isOnline: true,
  };

  // Load messages on mount
  useEffect(() => {
    // Mock initial messages
    const mockMessages = [
      {
        id: '1',
        sender: chatUser.id,
        text: 'Hello! I am on my way',
        timestamp: new Date(Date.now() - 300000),
        isMine: false,
      },
      {
        id: '2',
        sender: 'me',
        text: 'Great! See you soon',
        timestamp: new Date(Date.now() - 240000),
        isMine: true,
      },
    ];
    
    setMessages(mockMessages);
  }, [chatUser.id]);

  // Listen for socket events
  useEffect(() => {
    if (!socket) return;

    socket.on('new-message', (message) => {
      setMessages(prev => [...prev, {
        ...message,
        isMine: false,
      }]);
      setIsTyping(false);
      triggerHaptic('light');
    });

    socket.on('user-typing', ({ userId: typingUserId }) => {
      if (typingUserId === chatUser.id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    return () => {
      socket.off('new-message');
      socket.off('user-typing');
    };
  }, [socket, chatUser.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending message
  const handleSend = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: 'me',
      text: inputMessage,
      timestamp: new Date(),
      isMine: true,
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Emit to socket
    if (socket) {
      socket.emit('send-message', {
        to: chatUser.id,
        text: inputMessage,
      });
    }

    setInputMessage('');
    triggerHaptic('medium');
    inputRef.current?.focus();
  };

  // Handle input change (with typing indicator)
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    
    // Emit typing event
    if (socket && e.target.value) {
      socket.emit('typing', { to: chatUser.id });
    }
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <AppShell>
      <div className="flex flex-col h-screen-dvh bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex-shrink-0 bg-white border-b border-gray-200 pt-safe"
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <IconButton
              icon={ArrowLeft}
              onClick={() => navigate(-1)}
              variant="ghost"
              size="sm"
            />
            
            <Avatar
              src={chatUser.avatar}
              alt={chatUser.name}
              fallback={chatUser.name?.charAt(0)}
              size="md"
            />
            
            <div className="flex-1">
              <h2 className="font-bold text-gray-900">{chatUser.name}</h2>
              <p className="text-sm text-gray-500">
                {chatUser.isOnline ? (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Online
                  </span>
                ) : (
                  'Offline'
                )}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                variants={STAGGER_ITEM}
                initial="hidden"
                animate="visible"
                className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[75%] ${message.isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!message.isMine && index === messages.length - 1 && (
                    <Avatar
                      src={chatUser.avatar}
                      alt={chatUser.name}
                      fallback={chatUser.name?.charAt(0)}
                      size="sm"
                      className="self-end"
                    />
                  )}
                  
                  <div>
                    <div
                      className={`
                        px-4 py-3 rounded-2xl
                        ${message.isMine 
                          ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-br-sm' 
                          : 'bg-white backdrop-blur-lg border border-gray-200 text-gray-900 rounded-bl-sm shadow-md'
                        }
                      `}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 px-2 ${message.isMine ? 'text-right' : 'text-left'}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-2"
            >
              <Avatar
                src={chatUser.avatar}
                alt={chatUser.name}
                fallback={chatUser.name?.charAt(0)}
                size="sm"
              />
              <div className="bg-white backdrop-blur-lg border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-md">
                <div className="flex gap-1">
                  <motion.span
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 rounded-full bg-gray-400"
                  />
                  <motion.span
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 rounded-full bg-gray-400"
                  />
                  <motion.span
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 rounded-full bg-gray-400"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Container */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex-shrink-0 bg-white border-t border-gray-200 pb-safe"
        >
          <div className="flex items-end gap-2 px-4 py-3">
            {/* Attachment Button */}
            <IconButton
              icon={Paperclip}
              onClick={() => console.log('Attachment')}
              variant="ghost"
              size="md"
            />

            {/* Input Field */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="w-full px-4 py-3 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>

            {/* Send Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              disabled={!inputMessage.trim()}
              className={`
                w-12 h-12 rounded-full flex items-center justify-center
                transition-all
                ${inputMessage.trim()
                  ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 cursor-not-allowed'
                }
              `}
            >
              <Send className={`w-5 h-5 ${inputMessage.trim() ? 'text-white' : 'text-gray-400'}`} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}

export default ChatScreen;
