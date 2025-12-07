import { createContext, useEffect, useMemo } from "react";
import { io } from "socket.io-client";

export const SocketDataContext = createContext();

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

  return (
    <SocketDataContext.Provider value={{ socket }}>
      {children}
    </SocketDataContext.Provider>
  );
}

export default SocketContext;
