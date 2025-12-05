import { useEffect } from "react";
import { Car, CircleUserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from '/logo-quickride.png';

function GetStarted() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedData = JSON.parse(userData);
      if (parsedData.type === "user") {
        navigate("/home");
      } else if (parsedData.type === "captain") {
        navigate("/captain/home");
      }
    }
  }, [navigate]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-900">
      {/* Hero Background Image with Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80')`,
          backgroundPosition: 'center'
        }}
      />
      
      {/* Content Container */}
      <div className="relative z-10 flex flex-col justify-between w-full h-full">
        {/* Logo */}
        <div className="p-6">
          <img
            className="h-10 object-contain brightness-0 invert"
            src={logo}
            alt="Rapidito Logo"
          />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 pb-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Bienvenido a<br/>Rapidito
            </h1>
            <p className="text-lg text-gray-200 font-medium">
              Tu viaje comienza aquí
            </p>
          </div>
        </div>
        
        {/* CTA Card */}
        <div className="bg-white rounded-t-3xl p-6 pb-10 shadow-2xl">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            ¿Qué deseas hacer?
          </h2>
          
          {/* User/Passenger Button */}
          <button
            onClick={() => navigate("/login")}
            className="w-full mb-4 bg-uber-blue hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 active:scale-98 shadow-uber-md hover:shadow-uber-lg flex items-center justify-center gap-3 group"
          >
            <Car className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-lg">Solicitar Viaje</span>
          </button>
          
          {/* Captain/Driver Button */}
          <button
            onClick={() => navigate("/captain/login")}
            className="w-full bg-uber-green hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 active:scale-98 shadow-uber-md hover:shadow-uber-lg flex items-center justify-center gap-3 group"
          >
            <CircleUserRound className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-lg">Conducir</span>
          </button>
          
          {/* Subtle Info Text */}
          <p className="text-xs text-center text-gray-500 mt-6">
            Al continuar, aceptas nuestros términos y condiciones
          </p>
        </div>
      </div>
    </div>
  );
}

export default GetStarted;
