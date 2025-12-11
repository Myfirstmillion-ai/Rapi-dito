import { createContext, useContext, useState } from "react";

export const captainDataContext = createContext();

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

export const useCaptain = () => {
  const { captain, setCaptain } = useContext(captainDataContext);
  
  const logout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    setCaptain({
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
    });
  };
  
  return { captain, setCaptain, logout };
};

export default CaptainContext;
