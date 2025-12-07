import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Heart, Coffee, Facebook, Instagram } from "lucide-react";

// Iconos SVG minimalistas para redes sociales
const TikTokIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

function GetStarted() {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    // Ensure scroll is never blocked - Fix for scroll freeze on load
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedData = JSON.parse(userData);
      if (parsedData.type === "user") {
        navigate("/home");
      } else if (parsedData.type === "captain") {
        navigate("/captain/home");
      }
    }

    // Preload cathedral background image
    const img = new Image();
    img.src = '/IMG_3639.jpeg';
    img.onload = () => setImageLoaded(true);
    
    // Cleanup: Ensure scroll remains enabled
    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, [navigate]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-black overflow-x-hidden overflow-y-auto">
      {/* Hero Section - Cathedral Background with Premium Gradient Overlay */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-20 safe-area-inset overflow-visible">
        {/* Cathedral Background Image */}
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: imageLoaded ? 1 : 1.1, opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/IMG_3639.jpeg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Premium Dark Gradient Overlay - Total black bottom to semi-transparent top */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40"></div>
        </motion.div>

        {/* Content Container - Centered Vertically */}
        <div className="relative z-10 w-full max-w-2xl mx-auto text-center space-y-8">
          {/* Logo "Rapidito" with Emerald Neon Pin Icon */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center gap-4 mb-8 w-full"
          >
            {/* Abstract Location Pin Isotipo */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 bg-emerald-400 blur-2xl opacity-60 rounded-full"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/50 transform rotate-45">
                <MapPin className="w-10 h-10 text-white -rotate-45" strokeWidth={2.5} />
              </div>
            </div>
            
            {/* Logo Text - Modern Sans-Serif Bold - Fixed to prevent cutoff */}
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white w-auto max-w-full px-4" style={{ overflow: 'visible' }}>
              Rapidito
            </h1>
          </motion.div>

          {/* Hero Copywriting */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-4"
          >
            {/* H1 - Main Message */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight px-4">
              Una nueva forma de viajar llega a San Antonio.
            </h2>
            
            {/* Subtitle - Pearl Gray */}
            <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed px-4">
              Seguridad, confort y estilo premium a tu alcance.
            </p>
          </motion.div>

          {/* Premium CTA Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 pt-8"
          >
            {/* "Solicitar Viaje" - Solid Green Button */}
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-lg font-bold rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300"
            >
              Solicitar Viaje
            </button>

            {/* "Conducir" - Outline with Frosted Glass Effect */}
            <button
              onClick={() => navigate("/captain/login")}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white text-lg font-bold rounded-full hover:bg-white/20 hover:border-white/50 hover:scale-105 transition-all duration-300"
            >
              Conducir
            </button>
          </motion.div>
        </div>
      </div>

      {/* Premium Footer */}
      <motion.footer 
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-t from-black via-black/95 to-black/80 border-t border-white/10 px-6 py-12 safe-area-inset"
      >
        <div className="max-w-6xl mx-auto">
          {/* Footer Content - Two Balanced Columns */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
            {/* Left Column - Legal Links */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link 
                to="/about" 
                className="text-gray-400 hover:text-emerald-400 transition-colors text-sm font-medium"
              >
                Sobre Nosotros
              </Link>
              <span className="text-gray-600 hidden sm:inline">•</span>
              <Link 
                to="/terms" 
                className="text-gray-400 hover:text-emerald-400 transition-colors text-sm font-medium"
              >
                Términos
              </Link>
              <span className="text-gray-600 hidden sm:inline">•</span>
              <Link 
                to="/privacy" 
                className="text-gray-400 hover:text-emerald-400 transition-colors text-sm font-medium"
              >
                Privacidad
              </Link>
              <span className="text-gray-600 hidden sm:inline">•</span>
              <Link 
                to="/help" 
                className="text-gray-400 hover:text-emerald-400 transition-colors text-sm font-medium"
              >
                Ayuda
              </Link>
            </div>

            {/* Right Column - Social Media Icons */}
            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-sm font-medium mr-2">Síguenos:</span>
              
              {/* Facebook */}
              <a 
                href="https://facebook.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="group w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
              </a>

              {/* Instagram */}
              <a 
                href="https://instagram.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="group w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
              </a>

              {/* TikTok */}
              <a 
                href="https://tiktok.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="group w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="TikTok"
              >
                <div className="text-gray-400 group-hover:text-emerald-400 transition-colors">
                  <TikTokIcon />
                </div>
              </a>
            </div>
          </div>

          {/* Bottom Row - Author Signature */}
          <div className="pt-6 border-t border-white/10">
            <p className="text-center text-xs text-gray-500 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Hecho con <Heart className="inline w-3 h-3 text-red-500 fill-red-500 mx-0.5" /> y <Coffee className="inline w-3 h-3 text-amber-500 mx-0.5" /> por Camilo González
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

export default GetStarted;
