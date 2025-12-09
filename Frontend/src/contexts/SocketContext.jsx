import { createContext, useContext, useEffect, useMemo } from "react";
import { io } from "socket.io-client";

/**
 * Socket Context for real-time communication
 * 
 * Usage: Import useSocket from this file to access socket instance
 * Must be used within SocketContext provider
 */
export const SocketDataContext = createContext(undefined);

import Console from "../utils/console";

function SocketContext({ children }) {
  // Create socket instance only once using useMemo
  const socket = useMemo(() => {
    const socketInstance = io(`${import.meta.env.VITE_SERVER_URL}`);
    Console.log("Socket.io instance created");
    return socketInstance;
  }, []); // Empty dependency array ensures this only runs once

  useEffect(() => {
    socket.on("connect", () => {
      Console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      Console.log("Disconnected from server");
    });

    // Cleanup function to disconnect socket when component unmounts
    return () => {
      Console.log("Cleaning up socket connection");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket]);

  const value = useMemo(() => ({ socket }), [socket]);

  return (
    <SocketDataContext.Provider value={value}>
      {children}
    </SocketDataContext.Provider>
  );
}

/**
 * Custom hook to access socket context
 * @throws Error if used outside SocketContext provider
 */
export const useSocket = () => {
  const context = useContext(SocketDataContext);
  
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketContextProvider");
  }
  
  return context;
};

export default SocketContext;
