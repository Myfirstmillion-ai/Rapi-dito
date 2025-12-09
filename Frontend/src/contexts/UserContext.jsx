import { createContext, useContext, useState } from "react";

/**
 * User Context for authentication state management
 * 
 * Usage: Import { useUser } from this file to access user data
 * Must be used within UserContext provider
 */
export const userDataContext = createContext(undefined);

const UserContext = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem("userData"));

  const [user, setUser] = useState(
    userData?.type == "user"
      ? userData.data
      : {
        email: "",
        fullname: {
          firstname: "",
          lastname: "",
        }
      }
  );

  return (
    <userDataContext.Provider value={{ user, setUser }}>
      {children}
    </userDataContext.Provider>
  );
};

/**
 * Custom hook to access user context
 * @throws Error if used outside UserContext provider
 */
export const useUser = () => {
  const context = useContext(userDataContext);
  
  if (context === undefined) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  
  return context;
};

export default UserContext;
