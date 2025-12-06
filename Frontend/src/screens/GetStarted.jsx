import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Shield, DollarSign, Star, Heart, Coffee } from "lucide-react";

function GetStarted() {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  
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

    // Preload background image
    const img = new Image();
    img.src = 'https://images.unsplash.com/photo-1600408921219-89351fe7ff7e?w=1920&q=90';
    img.onload = () => setImageLoaded(true);
  }, [navigate]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 overflow-hidden">
      {/* Premium Header with Glassmorphism */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/50"
            >
              <MapPin className="w-6 h-6 text-white" />
            </motion.div>
            <div className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-emerald-100 to-emerald-400 bg-clip-text text-transparent">
              RAPIDITO
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30"
          >
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-emerald-400">San Antonio del Táchira</span>
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Section with Premium Background */}
      <div className="relative w-full min-h-screen flex items-center justify-center pt-20 pb-32 px-6">
        {/* Animated Background Image */}
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: imageLoaded ? 1 : 1.1, opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600408921219-89351fe7ff7e?w=1920&q=90')`,
          }}
        >
          {/* Premium Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/70 to-slate-950/90"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 via-transparent to-slate-950/60"></div>
        </motion.div>

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(16 185 129) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Text */}
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center lg:text-left space-y-8"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 backdrop-blur-sm"
            >
              <span className="text-sm font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                🚀 Transporte Premium en San Antonio
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="block"
              >
                Viaja con
              </motion.span>
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="block bg-gradient-to-r from-emerald-400 via-emerald-500 to-cyan-400 bg-clip-text text-transparent"
              >
                Estilo Premium
              </motion.span>
            </h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl"
            >
              Experiencia de transporte de <span className="text-emerald-400 font-semibold">clase mundial</span> en tu ciudad. Seguro, rápido y confiable.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={() => navigate("/login")}
                className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-lg font-bold rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/50 hover:shadow-emerald-500/70 transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>Solicitar viaje</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button
                onClick={() => navigate("/captain/login")}
                className="group px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/20 text-white text-lg font-bold rounded-2xl hover:bg-white/20 hover:border-emerald-400/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <span>Conducir con RAPIDITO</span>
                </div>
              </button>
            </motion.div>
          </motion.div>

          {/* Right Column - Stats Cards */}
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:grid grid-cols-2 gap-6"
          >
            {[
              { icon: MapPin, title: "Cobertura Total", desc: "San Antonio", color: "from-blue-500 to-cyan-500" },
              { icon: Shield, title: "100% Seguro", desc: "Viajes Verificados", color: "from-emerald-500 to-green-500" },
              { icon: DollarSign, title: "Tarifas Justas", desc: "Sin Sorpresas", color: "from-amber-500 to-orange-500" },
              { icon: Star, title: "Conductores", desc: "5 Estrellas", color: "from-purple-500 to-pink-500" },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 + idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-20 group-hover:opacity-30 transition-opacity rounded-2xl blur-xl" 
                     style={{ background: `linear-gradient(to bottom right, ${card.color})` }}></div>
                <div className="relative p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/20 transition-all">
                  <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">{card.title}</h3>
                  <p className="text-gray-400 text-sm">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-emerald-400 rounded-full"></div>
          </div>
        </motion.div>
      </div>

      {/* Premium Footer */}
      <motion.footer 
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative border-t border-white/10 bg-gradient-to-b from-slate-900/50 to-slate-950/80 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-black text-white">RAPIDITO</div>
              </div>
              <p className="text-gray-400 text-sm">
                Transporte premium en San Antonio del Táchira, Venezuela
              </p>
            </div>

            {/* Links Column */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-semibold mb-3">Empresa</h4>
                <div className="space-y-2">
                  <Link to="/about" className="block text-gray-400 hover:text-emerald-400 transition-colors text-sm">Sobre Nosotros</Link>
                  <Link to="/blog" className="block text-gray-400 hover:text-emerald-400 transition-colors text-sm">Blog</Link>
                  <Link to="/careers" className="block text-gray-400 hover:text-emerald-400 transition-colors text-sm">Carreras</Link>
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Legal</h4>
                <div className="space-y-2">
                  <Link to="/terms" className="block text-gray-400 hover:text-emerald-400 transition-colors text-sm">Términos</Link>
                  <Link to="/privacy" className="block text-gray-400 hover:text-emerald-400 transition-colors text-sm">Privacidad</Link>
                  <a href="#" className="block text-gray-400 hover:text-emerald-400 transition-colors text-sm">Ayuda</a>
                </div>
              </div>
            </div>

            {/* Social Column */}
            <div>
              <h4 className="text-white font-semibold mb-3">Síguenos</h4>
              <div className="flex gap-3">
                {['Facebook', 'Twitter', 'Instagram'].map((social) => (
                  <a 
                    key={social}
                    href="#" 
                    className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/50 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                    aria-label={social}
                  >
                    <span className="text-gray-400 hover:text-emerald-400 text-xs font-bold">{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Custom Footer - Camilo González Attribution */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-sm">
                © 2025 RAPIDITO - Todos los derechos reservados
              </p>
              
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-400/20 rounded-full"
              >
                <span className="text-gray-400 text-sm">Rapidito 2025 - creado por</span>
                <span className="text-emerald-400 font-bold text-sm">Camilo González</span>
                <span className="text-gray-400 text-sm">con</span>
                <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
                <span className="text-gray-400 text-sm">y mucho</span>
                <Coffee className="w-4 h-4 text-amber-500" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

export default GetStarted;
