import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="w-full min-h-screen bg-white">
      {/* Header - UBER Style */}
      <header className="w-full h-16 bg-white flex items-center px-6 shadow-sm">
        <div className="text-3xl font-black tracking-tight text-black">
          RAPIDITO
          <span className="inline-block w-2 h-2 bg-[#00E676] rounded-full ml-1 mb-2"></span>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative w-full h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-md px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Una nueva forma de viajar ha llegado a San Antonio del Táchira
          </h1>
          
          <p className="text-lg text-white text-opacity-90 mb-12">
            Viajes seguros, rápidos y confiables
          </p>

          {/* Primary Button - User */}
          <button
            onClick={() => navigate("/login")}
            className="w-full h-14 bg-black text-white text-base font-medium rounded flex items-center justify-center mb-4 hover:bg-gray-800 transition-all duration-150"
          >
            Solicitar un viaje
          </button>

          {/* Secondary Button - Captain */}
          <button
            onClick={() => navigate("/captain/login")}
            className="w-full h-14 bg-white text-black text-base font-medium rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-all duration-150"
          >
            Conducir con RAPIDITO
          </button>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="w-full bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="text-center">
            <div className="text-4xl mb-4">🚗</div>
            <h3 className="text-xl font-bold text-black mb-2">Viajes al instante</h3>
            <p className="text-base text-gray-600">Solicita y conecta con conductores en minutos</p>
          </div>

          {/* Card 2 */}
          <div className="text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-black mb-2">Precios justos</h3>
            <p className="text-base text-gray-600">Tarifas transparentes sin sorpresas</p>
          </div>

          {/* Card 3 */}
          <div className="text-center">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-bold text-black mb-2">Conductores verificados</h3>
            <p className="text-base text-gray-600">Seguridad garantizada en cada viaje</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-gray-50 py-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-6 text-sm text-gray-600 mb-4">
            <a href="#" className="hover:text-black transition-colors">Términos</a>
            <a href="#" className="hover:text-black transition-colors">Privacidad</a>
            <a href="#" className="hover:text-black transition-colors">Ayuda</a>
          </div>
          <p className="text-sm text-gray-500">© 2024 RAPIDITO</p>
        </div>
      </footer>
    </div>
  );
}

export default GetStarted;
