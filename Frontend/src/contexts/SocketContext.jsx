import { createContext, useContext, useEffect, useMemo, useCallback } from "react";
import { io } from "socket.io-client";

/**
 * Socket Context for real-time communication
 * 
 * Usage: Import useSocket from this file to access socket instance
 * Must be used within SocketContext provider
 * 
 * Enhanced with captain online/offline cleanup helpers
 */
export const SocketDataContext = createContext(undefined);

import Console from "../utils/console";

function SocketContext({ children }) {
  // Create socket instance only once using useMemo
  const socket = useMemo(() => {
    const token = localStorage.getItem("token");
    const socketInstance = io(`${import.meta.env.VITE_SERVER_URL}`, {
      auth: { token }, // Send token for server-side JWT verification
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });
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

    socket.on("error", (error) => {
      Console.log("Socket error:", error);
    });

    // Cleanup function to disconnect socket when component unmounts
    return () => {
      Console.log("Cleaning up socket connection");
      socket.off("connect");
      socket.off("disconnect");
      socket.off("error");
    };
  }, [socket]);

  /**
   * Captain go offline cleanup - removes from all rooms and clears listeners
   * Use this when captain toggles offline to prevent stale ride requests
   * @param {string} captainId - The captain's ID
   */
  const goOffline = useCallback((captainId) => {
    if (!captainId) return;
    
    Console.log(`Captain ${captainId} going offline - cleaning up socket`);
    
    // Leave all rooms
    socket.emit('leave_room', `captain:${captainId}`);
    socket.emit('leave_room', `driver-${captainId}`);
    socket.emit('leave_room', 'nearby_captains');
    
    // Emit offline status to server
    socket.emit('driver:toggleOnline', { driverId: captainId, isOnline: false });
    
    // Remove ride request listener to prevent stale requests
    socket.off('new-ride');
    socket.off('ride_request');
    
    Console.log(`Captain ${captainId} socket cleanup complete`);
  }, [socket]);

  /**
   * Captain go online - joins appropriate rooms and sets up listeners
   * @param {string} captainId - The captain's ID
   * @param {Function} onRideRequest - Callback for new ride requests
   */
  const goOnline = useCallback((captainId, onRideRequest) => {
    if (!captainId) return;
    
    Console.log(`Captain ${captainId} going online`);
    
    // Remove any stale listeners first
    socket.off('new-ride');
    socket.off('ride_request');
    
    // Join captain-specific room
    const token = localStorage.getItem("token");
    socket.emit('join', { userId: captainId, userType: 'captain', token });
    
    // Emit online status to server
    socket.emit('driver:toggleOnline', { driverId: captainId, isOnline: true });
    
    // Set up ride request listener only when online
    if (typeof onRideRequest === 'function') {
      socket.on('new-ride', onRideRequest);
    }
    
    Console.log(`Captain ${captainId} is now online and listening for rides`);
  }, [socket]);

  /**
   * Clear all ride-related listeners - use when component unmounts
   */
  const clearRideListeners = useCallback(() => {
    socket.off('new-ride');
    socket.off('ride_request');
    socket.off('ride-confirmed');
    socket.off('ride-started');
    socket.off('ride-ended');
    Console.log("Ride listeners cleared");
  }, [socket]);

  const value = useMemo(() => ({ 
    socket,
    goOffline,
    goOnline,
    clearRideListeners
  }), [socket, goOffline, goOnline, clearRideListeners]);

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
