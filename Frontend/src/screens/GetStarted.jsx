import { useEffect } from "react";
import { Car, CircleUserRound, MapPin, Clock, Shield } from "lucide-react";
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
      {/* Ultra Premium Hero Background with Parallax Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center transform scale-105"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.75) 100%),
            url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&q=90')
          `,
          backgroundPosition: 'center center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
      
      {/* Content Container */}
      <div className="relative z-10 flex flex-col justify-between w-full h-full">
        {/* Premium Header */}
        <div className="p-8">
          <div className="flex items-center justify-between">
            <img
              className="h-12 md:h-14 object-contain brightness-0 invert drop-shadow-2xl"
              src={logo}
              alt="Rapidito Logo"
            />
            <Shield className="w-6 h-6 text-white/80" />
          </div>
        </div>
        
        {/* Main Content - Premium Typography */}
        <div className="flex-1 flex flex-col justify-center items-center px-8 pb-12">
          <div className="text-center mb-16 max-w-2xl">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/20">
              <MapPin className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Disponible en tu ciudad</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
              Viaja con<br/>
              <span className="bg-gradient-to-r from-uber-blue to-uber-green bg-clip-text text-transparent">
                Rapidito
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-100 font-light mb-8 leading-relaxed">
              La mejor experiencia de movilidad urbana
            </p>
            
            {/* Feature Highlights */}
            <div className="flex justify-center gap-8 mt-8">
              <div className="text-center">
                <Clock className="w-8 h-8 text-uber-blue mx-auto mb-2" />
                <p className="text-sm text-white/90 font-medium">Rápido</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 text-uber-green mx-auto mb-2" />
                <p className="text-sm text-white/90 font-medium">Seguro</p>
              </div>
              <div className="text-center">
                <MapPin className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-sm text-white/90 font-medium">Confiable</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Ultra Premium CTA Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-t-[2.5rem] p-8 pb-12 shadow-2xl border-t-4 border-uber-blue">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center tracking-tight">
            ¿Cómo deseas comenzar?
          </h2>
          
          {/* User/Passenger Button - Premium Design */}
          <button
            onClick={() => navigate("/login")}
            className="w-full mb-5 bg-gradient-to-r from-uber-blue to-blue-600 hover:from-blue-600 hover:to-uber-blue text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 active:scale-[0.98] shadow-xl hover:shadow-2xl flex items-center justify-between group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                <Car className="w-7 h-7" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold">Solicitar Viaje</div>
                <div className="text-sm opacity-90 font-normal">Viaja cómodamente</div>
              </div>
            </div>
            <div className="text-2xl font-light opacity-50 group-hover:opacity-100 transition-opacity">→</div>
          </button>
          
          {/* Captain/Driver Button - Premium Design */}
          <button
            onClick={() => navigate("/captain/login")}
            className="w-full bg-gradient-to-r from-uber-green to-green-600 hover:from-green-600 hover:to-uber-green text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 active:scale-[0.98] shadow-xl hover:shadow-2xl flex items-center justify-between group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                <CircleUserRound className="w-7 h-7" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold">Conducir</div>
                <div className="text-sm opacity-90 font-normal">Gana dinero</div>
              </div>
            </div>
            <div className="text-2xl font-light opacity-50 group-hover:opacity-100 transition-opacity">→</div>
          </button>
          
          {/* Premium Trust Indicators */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-center text-gray-600 font-medium mb-3">
              Protegido por tecnología de seguridad avanzada
            </p>
            <p className="text-xs text-center text-gray-500 leading-relaxed">
              Al continuar, aceptas nuestros{" "}
              <span className="font-semibold text-uber-blue cursor-pointer hover:underline">Términos de Servicio</span>
              {" "}y{" "}
              <span className="font-semibold text-uber-blue cursor-pointer hover:underline">Política de Privacidad</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GetStarted;
