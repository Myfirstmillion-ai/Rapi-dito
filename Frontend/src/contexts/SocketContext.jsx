import { createContext, useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import { API_BASE_URL } from "../config/api";

export const SocketDataContext = createContext();

import Console from "../utils/console";

function SocketContext({ children }) {
  // Create socket instance only once using useMemo
  const socket = useMemo(() => {
    const socketInstance = io(API_BASE_URL, {
      withCredentials: true, // Enable credentials for CORS
      transports: ['websocket', 'polling'], // Try websocket first, fallback to polling
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });
    Console.log("Socket.io instance created", API_BASE_URL);
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

  return (
    <SocketDataContext.Provider value={{ socket }}>
      {children}
    </SocketDataContext.Provider>
  );
}

export default SocketContext;
