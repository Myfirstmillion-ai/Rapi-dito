import { useEffect, useState } from "react";

import { ChevronRight, CircleUserRound, History, KeyRound, Menu, X, HelpCircle } from "lucide-react";
import Button from "./Button";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Console from "../utils/console";

function Sidebar({ onToggle }) {
  const token = localStorage.getItem("token");
  const [showSidebar, setShowSidebar] = useState(false);

  const [newUser, setNewUser] = useState({});

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setNewUser(userData);
  }, []);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    const newState = !showSidebar;
    setShowSidebar(newState);
    // Notify parent component about sidebar state change
    if (onToggle) {
      onToggle(newState);
    }
  };

  const logout = async () => {
    try {
      await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/${newUser.type}/logout`,
        {
          headers: {
            token: token,
          },
        }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("messages");
      localStorage.removeItem("rideDetails");
      localStorage.removeItem("panelDetails");
      localStorage.removeItem("showPanel");
      localStorage.removeItem("showBtn");
      navigate("/");
    } catch (error) {
      Console.log("Error al cerrar sesión", error);
    }
  };
  
  return (
    <>
      {/* Hamburger Menu Button - Always visible with highest z-index */}
      <div
        className="m-3 mt-4 absolute right-0 top-0 z-500 cursor-pointer bg-white p-3 rounded-lg shadow-uber-md hover:shadow-uber-lg transition-all duration-200 active:scale-95"
        onClick={toggleSidebar}
      >
        {showSidebar ? (
          <X size={24} className="text-gray-900" />
        ) : (
          <Menu size={24} className="text-gray-900" />
        )}
      </div>

      {/* Backdrop Overlay - Only when sidebar is open */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-100 animate-fade-in"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={`${
          showSidebar ? "left-0" : "-left-full"
        } fixed w-full max-w-sm h-dvh top-0 bg-white z-200 p-4 pt-5 flex flex-col justify-between shadow-uber-xl transition-all duration-300 ease-out`}
      >
        <div className="select-none">
          <h1 className="relative text-2xl font-semibold">Perfil</h1>

          <div className="leading-3 mt-8 mb-4">
            <div className="my-2 rounded-full w-24 h-24 mx-auto relative">
              {newUser?.data?.profileImage ? (
                <img 
                  src={newUser.data.profileImage} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className={`w-full h-full rounded-full ${newUser?.type === 'captain' ? 'bg-gradient-to-br from-green-400 to-green-500' : 'bg-gradient-to-br from-blue-400 to-blue-500'} flex items-center justify-center shadow-lg`}>
                  <h1 className="text-5xl text-white font-black">
                    {newUser?.data?.fullname?.firstname?.[0] || 'U'}
                    {newUser?.data?.fullname?.lastname?.[0] || ''}
                  </h1>
                </div>
              )}
            </div>
            <h1 className=" text-center font-semibold text-2xl">
              {newUser?.data?.fullname?.firstname}{" "}
              {newUser?.data?.fullname?.lastname}
            </h1>
            <h1 className="mt-1 text-center text-zinc-400 ">
              {newUser?.data?.email}
            </h1>
          </div>

          <Link
            to={`/${newUser?.type}/edit-profile`}
            className="flex items-center justify-between py-4 cursor-pointer hover:bg-zinc-100 rounded-xl px-3 transition-colors duration-200"
            onClick={toggleSidebar}
          >
            <div className="flex gap-3">
              <CircleUserRound /> <h1>Editar Perfil</h1>
            </div>
            <div>
              <ChevronRight />
            </div>
          </Link>

          <Link
            to={`/${newUser?.type}/rides`}
            className="flex items-center justify-between py-4 cursor-pointer hover:bg-zinc-100 rounded-xl px-3 transition-colors duration-200"
            onClick={toggleSidebar}
          >
            <div className="flex gap-3">
              <History /> <h1>Historial de Viajes</h1>
            </div>
            <div>
              <ChevronRight />
            </div>
          </Link>

          <Link
            to={`/${newUser?.type}/reset-password?token=${token}`}
            className="flex items-center justify-between py-4 cursor-pointer hover:bg-zinc-100 rounded-xl px-3 transition-colors duration-200"
            onClick={toggleSidebar}
          >
            <div className="flex gap-3">
              <KeyRound /> <h1>Cambiar Contraseña</h1>
            </div>
            <div>
              <ChevronRight />
            </div>
          </Link>

          <Link
            to="/help"
            className="flex items-center justify-between py-4 cursor-pointer hover:bg-zinc-100 rounded-xl px-3 transition-colors duration-200"
            onClick={toggleSidebar}
          >
            <div className="flex gap-3">
              <HelpCircle /> <h1>Centro de Ayuda</h1>
            </div>
            <div>
              <ChevronRight />
            </div>
          </Link>
        </div>

        <Button title={"Cerrar Sesión"} classes={"bg-red-600"} fun={logout} />
      </div>
    </>
  );
}

export default Sidebar;
