import { createContext, useContext, useState } from "react";

/**
 * Captain Context for captain/driver authentication state management
 * 
 * Usage: Import { useCaptain } from this file to access captain data
 * Must be used within CaptainContext provider
 */
export const captainDataContext = createContext(undefined);

function CaptainContext({ children }) {
  const userData = JSON.parse(localStorage.getItem("userData"));

  const [captain, setCaptain] = useState(
    userData?.type == "captain"
      ? userData.data
      : {
        email: "",
        fullname: {
          firstname: "",
          lastname: "",
        },
        vehicle: {
          color: "",
          number: "",
          capacity: 0,
          type: "",
        },
        rides: [],
        status: "inactive",
      }
  );

  return (
    <captainDataContext.Provider value={{ captain, setCaptain }}>
      {children}
    </captainDataContext.Provider>
  );
}

/**
 * Custom hook to access captain context
 * @throws Error if used outside CaptainContext provider
 */
export const useCaptain = () => {
  const context = useContext(captainDataContext);
  
  if (context === undefined) {
    throw new Error("useCaptain must be used within a CaptainContextProvider");
  }
  
  return context;
};

export default CaptainContext;
