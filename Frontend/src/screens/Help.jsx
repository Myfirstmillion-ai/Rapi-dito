import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  HelpCircle,
  Search,
  Phone,
  Mail,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  CreditCard,
  Shield,
  AlertCircle,
  Clock,
  Users,
  Headphones,
  MessagesSquare,
} from 'lucide-react';

function Help() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      category: 'Viajes',
      question: '¿Cómo solicito un viaje?',
      answer: 'Abre la app, ingresa tu destino, selecciona el tipo de vehículo que prefieres (carro o moto) y confirma tu solicitud. Un conductor cercano aceptará tu viaje en segundos.',
      icon: <MapPin size={20} className="text-emerald-500" />,
    },
    {
      id: 2,
      category: 'Pagos',
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos pagos en efectivo y tarjetas de crédito/débito. Próximamente integraremos billeteras digitales para mayor comodidad.',
      icon: <CreditCard size={20} className="text-blue-500" />,
    },
    {
      id: 3,
      category: 'Seguridad',
      question: '¿Cómo garantizan mi seguridad?',
      answer: 'Todos nuestros conductores pasan por verificación de antecedentes. Compartimos los detalles del viaje en tiempo real y contamos con soporte 24/7.',
      icon: <Shield size={20} className="text-purple-500" />,
    },
    {
      id: 4,
      category: 'Cancelaciones',
      question: '¿Puedo cancelar un viaje?',
      answer: 'Sí, puedes cancelar antes de que el conductor llegue. Ten en cuenta que pueden aplicarse cargos por cancelación dependiendo del tiempo transcurrido.',
      icon: <AlertCircle size={20} className="text-red-500" />,
    },
    {
      id: 5,
      category: 'Horarios',
      question: '¿Están disponibles las 24 horas?',
      answer: 'Sí, Rapidito opera las 24 horas del día, los 7 días de la semana para brindarte servicio cuando lo necesites.',
      icon: <Clock size={20} className="text-cyan-500" />,
    },
    {
      id: 6,
      category: 'Conductores',
      question: '¿Cómo puedo ser conductor de Rapidito?',
      answer: 'Visita nuestra página de Carreras, completa el formulario de registro como conductor, envía tus documentos y tu vehículo. Nuestro equipo revisará tu solicitud en 24-48 horas.',
      icon: <Users size={20} className="text-orange-500" />,
    },
  ];

  const contactMethods = [
    {
      id: 1,
      title: 'Llámanos',
      description: '+58 276 123 4567',
      icon: <Phone size={24} className="text-white" />,
      gradient: 'from-green-500 to-emerald-500',
      action: () => window.location.href = 'tel:+582761234567',
    },
    {
      id: 2,
      title: 'Envía un correo',
      description: 'ayuda@rapidito.com',
      icon: <Mail size={24} className="text-white" />,
      gradient: 'from-blue-500 to-cyan-500',
      action: () => window.location.href = 'mailto:ayuda@rapidito.com',
    },
    {
      id: 3,
      title: 'Chat en vivo',
      description: 'Disponible 24/7',
      icon: <MessageCircle size={24} className="text-white" />,
      gradient: 'from-purple-500 to-pink-500',
      action: () => alert('Chat en vivo próximamente'),
    },
  ];

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950 overflow-y-auto overflow-x-hidden pb-safe">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(16, 185, 129) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all active:scale-95 backdrop-blur-lg"
            >
              <ArrowLeft strokeWidth={2.5} size={24} className="text-white" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                Centro de Ayuda
              </h1>
              <p className="text-sm text-emerald-200/80">¿En qué podemos ayudarte?</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full">
              <Headphones size={24} className="text-white" />
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar ayuda..."
              className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl outline-none focus:border-emerald-500 focus:bg-white/15 transition-all text-white placeholder:text-emerald-200/50"
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 px-4 pb-20 pt-6">
        {/* Contact Methods Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 gap-3 mb-8"
        >
          <h2 className="text-lg font-bold text-white mb-2">Contacto Directo</h2>
          {contactMethods.map((method, index) => (
            <motion.button
              key={method.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={method.action}
              className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl hover:bg-white/20 hover:scale-[1.02] transition-all active:scale-95"
            >
              <div className={`p-3 bg-gradient-to-br ${method.gradient} rounded-xl shadow-lg`}>
                {method.icon}
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-white">{method.title}</h3>
                <p className="text-sm text-emerald-200/80">{method.description}</p>
              </div>
              <ChevronDown size={20} className="text-white/50 -rotate-90" />
            </motion.button>
          ))}
        </motion.div>

        {/* FAQs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <MessagesSquare size={24} className="text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Preguntas Frecuentes</h2>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
              <HelpCircle size={48} className="text-white/30 mx-auto mb-3" />
              <p className="text-white/70">No se encontraron resultados</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden hover:bg-white/15 transition-all"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full flex items-start gap-3 p-4 text-left"
                  >
                    <div className="p-2 bg-white/10 rounded-lg mt-1">
                      {faq.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="inline-block px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-medium rounded-full mb-2">
                            {faq.category}
                          </span>
                          <h3 className="font-semibold text-white text-sm">{faq.question}</h3>
                        </div>
                        {expandedFaq === faq.id ? (
                          <ChevronUp size={20} className="text-emerald-400 flex-shrink-0 mt-1" />
                        ) : (
                          <ChevronDown size={20} className="text-white/50 flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </div>
                  </button>

                  {expandedFaq === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-4 pb-4"
                    >
                      <div className="pl-12 pr-4">
                        <p className="text-sm text-emerald-100/80 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Additional Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 p-6 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 backdrop-blur-lg border border-emerald-500/30 rounded-2xl"
        >
          <h3 className="font-bold text-white text-lg mb-2">¿Aún necesitas ayuda?</h3>
          <p className="text-emerald-100/80 text-sm mb-4">
            Nuestro equipo de soporte está disponible 24/7 para asistirte con cualquier problema o consulta.
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
          >
            Contactar Soporte
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default Help;
