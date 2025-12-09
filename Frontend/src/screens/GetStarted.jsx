import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter } from "lucide-react";

/**
 * GetStarted - Editorial Hero Landing
 * Swiss Minimalist Luxury Design
 * Full-bleed city photography with floating white card
 */
function GetStarted() {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Animation variants following Swiss design spec
  const fadeInUp = {
    initial: prefersReducedMotion ? {} : { opacity: 0, y: 40 },
    animate: prefersReducedMotion ? {} : { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  };

  const cardReveal = {
    initial: prefersReducedMotion ? {} : { opacity: 0, y: 100 },
    animate: prefersReducedMotion ? {} : { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }
  };
  
  useEffect(() => {
    // Ensure scroll is never blocked
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    // Check for existing user session
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        if (parsedData.type === "user") {
          navigate("/home");
        } else if (parsedData.type === "captain") {
          navigate("/captain/home");
        }
      } catch {
        // Invalid data, continue to landing page
      }
    }

    // Preload hero background image (WebP for better performance)
    const img = new Image();
    img.src = '/IMG_3639.webp';
    img.onload = () => setImageLoaded(true);
    
    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, [navigate]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Image Layer - City skyline (WebP optimized: 575KB vs 4.4MB) */}
      <motion.img
        src="/IMG_3639.webp"
        alt=""
        initial={prefersReducedMotion ? { opacity: 0 } : { scale: 1.1, opacity: 0 }}
        animate={prefersReducedMotion
          ? { opacity: imageLoaded ? 1 : 0 }
          : { scale: imageLoaded ? 1 : 1.1, opacity: imageLoaded ? 1 : 0 }
        }
        transition={{ duration: prefersReducedMotion ? 0.3 : 1.5, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        decoding="async"
      />
      
      {/* Gradient Overlay - bottom-heavy for text readability */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent"
        aria-hidden="true"
      />
      
      {/* Content Wrapper - flex column, justify-between */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* Header - Logo + Navigation */}
        <motion.header
          {...fadeInUp}
          className="px-6 pt-10 md:px-12 md:pt-12"
        >
          {/* RAPIDITO Logotype - Typography-based, no SVG */}
          <div 
            className="font-bold tracking-[0.2em] uppercase text-white"
            role="img"
            aria-label="RAPIDITO"
          >
            <span className="text-4xl md:text-5xl">RAPIDITO</span>
          </div>
        </motion.header>

        {/* Spacer - allows image visibility */}
        <div className="flex-1" aria-hidden="true" />

        {/* Floating White Card - Call-to-Action + Footer */}
        <motion.div
          initial={cardReveal.initial}
          animate={cardReveal.animate}
          transition={cardReveal.transition}
          className="relative z-10 mx-6 mb-8 rounded-3xl bg-white p-8 shadow-2xl backdrop-blur-xl md:mx-12 md:p-12"
        >
          {/* Heading */}
          <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl lg:text-5xl mb-3">
            Una nueva forma{'\n'}de viajar.
          </h1>
          
          {/* Subheading */}
          <p className="text-base md:text-lg leading-relaxed text-gray-500 mb-8">
            Seguridad, confort y estilo premium en San Antonio del Táchira.
          </p>
          
          {/* Primary CTA Button */}
          <button
            onClick={() => navigate("/login")}
            className="w-full h-16 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            aria-label="Comenzar a usar Rapidito"
          >
            Empezar →
          </button>

          {/* Secondary CTA */}
          <button
            onClick={() => navigate("/captain/login")}
            className="w-full h-14 mt-4 rounded-full bg-gray-50 font-semibold text-gray-900 transition-all hover:bg-gray-100 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            aria-label="Registrarse como conductor"
          >
            Conducir con Rapidito
          </button>
          
          {/* Divider */}
          <hr className="my-8 border-gray-200" />
          
          {/* Footer Content */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Social Icons */}
            <div className="flex items-center justify-center md:justify-start gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                aria-label="Síguenos en Facebook"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                aria-label="Síguenos en Instagram"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                aria-label="Síguenos en Twitter"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
            </div>
            
            {/* Legal Links */}
            <nav 
              className="flex flex-wrap justify-center md:justify-end gap-x-4 gap-y-2 text-sm text-gray-500"
              aria-label="Enlaces legales"
            >
              <Link to="/privacy" className="hover:text-gray-900 transition-colors">
                Privacidad
              </Link>
              <span aria-hidden="true">•</span>
              <Link to="/terms" className="hover:text-gray-900 transition-colors">
                Términos
              </Link>
              <span aria-hidden="true">•</span>
              <Link to="/help" className="hover:text-gray-900 transition-colors">
                Ayuda
              </Link>
            </nav>
          </div>
          
          {/* Signature */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Hecho con <span className="text-red-500">♥️</span> y{' '}
            <span className="text-amber-600">☕️</span> por Camilo González
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default GetStarted;
