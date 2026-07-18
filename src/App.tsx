import { useState, useRef, useEffect } from "react";
import Hero from "./components/Hero";
import Catalog from "./components/Catalog";
import BookingForm from "./components/BookingForm";
import Branches from "./components/Branches";
import ChatAdvisor from "./components/ChatAdvisor";
import Logo from "./components/Logo";
import AmbientBackground from "./components/AmbientBackground";
import ModelComparer from "./components/ModelComparer";
import EarningCalculator from "./components/EarningCalculator";
import { TESTIMONIALS } from "./data";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, MessageCircle, Wrench, FileText, Sparkles, Award, Star, PhoneCall, Check } from "lucide-react";

// Web Audio API Synthesizer for a premium, low-volume double chime
const playWspChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();

    // First soft high note (E6)
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(1318.51, now); 
    gain1.gain.setValueAtTime(0.03, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    // Second soft high note (A6) slightly delayed for a pleasant double-chime effect
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1760, now + 0.08); 
    gain2.gain.setValueAtTime(0.03, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.15);

    osc2.start(now + 0.08);
    osc2.stop(now + 0.3);
  } catch (e) {
    console.debug("Audio context blocked by browser autoplay policy until interaction.", e);
  }
};

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [selectedModelForBooking, setSelectedModelForBooking] = useState<string>("");
  const [showWspTooltip, setShowWspTooltip] = useState<boolean>(false);
  const [showCallTooltip, setShowCallTooltip] = useState<boolean>(false);
  const [isWspHovered, setIsWspHovered] = useState<boolean>(false);
  const hasPlayedWspSound = useRef<boolean>(false);
  const [sparkles, setSparkles] = useState<Array<{ id: number; size: number; x: number; y: number; color: string }>>([]);

  useEffect(() => {
    const triggerSparkles = () => {
      const colors = ["#25d366", "#a3f3be", "#fde047", "#ffffff"];
      const count = 4 + Math.floor(Math.random() * 3); // 4 to 6 sparkles
      const newSparkles = Array.from({ length: count }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 15 + Math.random() * 25; // start distance from button center
        const targetX = Math.cos(angle) * distance;
        const targetY = Math.sin(angle) * distance;
        
        return {
          id: Date.now() + i + Math.random(),
          size: 3 + Math.random() * 5, // 3px to 8px
          x: targetX,
          y: targetY,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
      });

      setSparkles(newSparkles);

      // Clean up sparkles after animation finishes (1.5 seconds)
      setTimeout(() => {
        setSparkles((current) => current.filter((s) => !newSparkles.some((ns) => ns.id === s.id)));
      }, 1500);
    };

    // Trigger sparkles every 4.5 seconds
    const interval = setInterval(triggerSparkles, 4500);
    
    // Trigger initially after 2 seconds
    const initialTimeout = setTimeout(triggerSparkles, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, []);

  const handleSelectModelForBooking = (modelName: string) => {
    setSelectedModelForBooking(modelName);
    
    // Smooth scroll to booking section
    const bookingSection = document.getElementById("booking-section");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#060a13] text-zinc-100 font-sans flex flex-col justify-between selection:bg-[#2563eb]/30 selection:text-white relative">
      <AmbientBackground />
      
      {/* Premium Minimalist Navbar */}
      <header className="sticky top-0 z-40 bg-[#060a13]/90 backdrop-blur-md border-b border-[#1e2e4a] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo with clean branding */}
          <div className="flex items-center gap-3">
            <Logo className="w-9 h-9 shrink-0 text-white" />
            <div>
              <h1 className="font-display font-bold text-sm tracking-tight text-white uppercase">
                EPSA Motor <span className="text-[#60a5fa] font-serif italic lowercase font-normal">Torijo</span>
              </h1>
              <p className="text-[9px] text-[#60a5fa] uppercase tracking-widest font-bold">Concesionario Autorizado Bajaj</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            <button
              onClick={() => scrollToSection("hero-section")}
              className="hover:text-[#60a5fa] transition-colors cursor-pointer"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection("benefits-section")}
              className="hover:text-[#60a5fa] transition-colors cursor-pointer"
            >
              Beneficios
            </button>
            <button
              onClick={() => scrollToSection("catalog-section")}
              className="hover:text-[#60a5fa] transition-colors cursor-pointer"
            >
              Modelos
            </button>
            <button
              onClick={() => scrollToSection("comparer-section")}
              className="hover:text-[#60a5fa] transition-colors cursor-pointer"
            >
              Comparar
            </button>
            <button
              onClick={() => scrollToSection("calculator-section")}
              className="hover:text-[#60a5fa] transition-colors cursor-pointer"
            >
              Rentabilidad
            </button>
            <button
              onClick={() => scrollToSection("booking-section")}
              className="hover:text-[#60a5fa] transition-colors cursor-pointer"
            >
              Citas
            </button>
            <button
              onClick={() => scrollToSection("branches-section")}
              className="hover:text-[#60a5fa] transition-colors cursor-pointer"
            >
              Sedes
            </button>
          </nav>

          {/* Action button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsChatOpen(true)}
              className="btn-primary px-5 py-2.5 rounded-sm cursor-pointer shadow-sm"
              id="btn-nav-chat"
            >
              Asesoría de Crédito
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        
        {/* HERO SECTION */}
        <Hero
          onExploreCatalog={() => scrollToSection("catalog-section")}
          onBookAppointment={() => scrollToSection("booking-section")}
          onOpenChat={() => setIsChatOpen(true)}
        />

        {/* BENEFITS / WHY CHOOSE EPSA MOTOR */}
        <section className="py-20 bg-[#0a1120]/60 border-b border-[#1e2e4a] relative" id="benefits-section">
          <div className="max-w-7xl mx-auto px-6">
            
            {/* Elegant Header */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <span className="text-[#60a5fa] text-xs font-bold uppercase tracking-widest block mb-2">Respaldo Integral</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight leading-tight">
                ¿Por qué elegir EPSA Motor Torijo?
              </h2>
              <p className="text-zinc-400 mt-4 text-xs md:text-sm leading-relaxed font-sans">
                Acompañamos tu desarrollo comercial de principio a fin, combinando el soporte directo de fábrica Bajaj con un modelo de financiamiento sumamente accesible.
              </p>
            </motion.div>

            {/* Grid with stagger reveal */}
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.12 }
                }
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              
              {/* Card 1: Crédito */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 16 } }
                }}
                className="bg-[#131c2e]/80 backdrop-blur-sm border border-[#1e2e4a] p-6 rounded-sm space-y-4 hover:border-[#3b82f6] hover:shadow-[0_0_25px_rgba(37,99,235,0.15)] transition-all duration-500 shadow-sm group"
              >
                <div className="w-10 h-10 rounded-sm bg-[#1a263e] border border-[#1e2e4a] flex items-center justify-center text-[#60a5fa] shadow-xs group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Crédito Directo Flexible</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Evaluamos tu historial crediticio con tu DNI y un recibo de servicios. Diseñamos cuotas a tu medida para facilitar el pago progresivo.
                </p>
              </motion.div>

              {/* Card 2: Papeles express */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 16 } }
                }}
                className="bg-[#131c2e]/80 backdrop-blur-sm border border-[#1e2e4a] p-6 rounded-sm space-y-4 hover:border-[#3b82f6] hover:shadow-[0_0_25px_rgba(37,99,235,0.15)] transition-all duration-500 shadow-sm group"
              >
                <div className="w-10 h-10 rounded-sm bg-[#1a263e] border border-[#1e2e4a] flex items-center justify-center text-[#60a5fa] shadow-xs group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Trámite de Placa Sunarp</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Gestionamos el registro de placa y tarjeta de propiedad de manera gratuita y veloz con la compra de tu mototaxi nuevo.
                </p>
              </motion.div>

              {/* Card 3: Servicio técnico */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 16 } }
                }}
                className="bg-[#131c2e]/80 backdrop-blur-sm border border-[#1e2e4a] p-6 rounded-sm space-y-4 hover:border-[#3b82f6] hover:shadow-[0_0_25px_rgba(37,99,235,0.15)] transition-all duration-500 shadow-sm group"
              >
                <div className="w-10 h-10 rounded-sm bg-[#1a263e] border border-[#1e2e4a] flex items-center justify-center text-[#60a5fa] shadow-xs group-hover:scale-110 transition-transform duration-300">
                  <Wrench className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Taller Oficial Autorizado</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Personal altamente calificado y stock permanente de repuestos originales Bajaj para garantizar la máxima durabilidad de tu herramienta.
                </p>
              </motion.div>

              {/* Card 4: Personalización */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 16 } }
                }}
                className="bg-[#131c2e]/80 backdrop-blur-sm border border-[#1e2e4a] p-6 rounded-sm space-y-4 hover:border-[#3b82f6] hover:shadow-[0_0_25px_rgba(37,99,235,0.15)] transition-all duration-500 shadow-sm group"
              >
                <div className="w-10 h-10 rounded-sm bg-[#1a263e] border border-[#1e2e4a] flex items-center justify-center text-[#60a5fa] shadow-xs group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Carpas y Accesorios</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Equipamos tu unidad con carpas reforzadas de alto tránsito y personalización de luces para trabajar con absoluto confort.
                </p>
              </motion.div>

            </motion.div>

          </div>
        </section>

        {/* ONLINE CATALOG */}
        <Catalog onSelectModelForBooking={handleSelectModelForBooking} />

        {/* INTERACTIVE MODEL COMPARER */}
        <ModelComparer onSelectModel={handleSelectModelForBooking} />

        {/* INTERACTIVE ROI / EARNING CALCULATOR */}
        <EarningCalculator />

        {/* REVIEWS & CASE STUDIES (INFINITE MARQUEE STRIP) */}
        <section className="py-24 bg-[#060a13] border-b border-[#1e2e4a] relative overflow-hidden" id="testimonials-section">
          {/* Subtle decorative background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 mb-12 relative z-10">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-[#60a5fa] text-xs font-bold uppercase tracking-widest block mb-2">Opiniones de Clientes</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight leading-tight">
                Historias de Éxito Comercial
              </h2>
              <p className="text-zinc-400 mt-4 text-xs md:text-sm leading-relaxed font-sans">
                La experiencia de emprendedores locales que consolidaron su herramienta de trabajo confiando en el servicio técnico y financiamiento de EPSA Motor.
              </p>
            </div>
          </div>

          {/* Marquee Container */}
          <div className="w-full relative py-4 space-y-6 overflow-hidden pause-marquee">
            {/* Left & Right gradient edge fades */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-48 bg-gradient-to-r from-[#060a13] to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-48 bg-gradient-to-l from-[#060a13] to-transparent z-20 pointer-events-none" />

            {/* Marquee Row 1 - Left to Right */}
            <div className="flex w-max relative">
              <div className="flex gap-6 animate-marquee">
                {/* Original + Duplicate to maintain seamless cycle */}
                {[...TESTIMONIALS, ...TESTIMONIALS].map((review, idx) => (
                  <div
                    key={`r1-${idx}`}
                    className="w-[320px] sm:w-[380px] bg-[#131c2e] border border-[#1e2e4a] p-6 rounded-sm flex flex-col justify-between space-y-4 hover:border-[#3b82f6] hover:shadow-[0_0_20px_rgba(59,130,246,0.12)] transition-all duration-300 group shrink-0"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex text-[#60a5fa] gap-0.5">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                        {review.tag && (
                          <span className="bg-[#1a263e] text-[#60a5fa] border border-[#1e2e4a] text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                            {review.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed italic font-sans">
                        "{review.text}"
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#1e2e4a] flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-sm ${review.avatarBg || 'bg-[#1a263e]'} border border-[#1e2e4a] flex items-center justify-center font-bold text-white text-xs`}>
                        {review.initials}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{review.name}</h4>
                        <span className="text-[10px] text-zinc-400 block font-sans">{review.association}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Marquee Row 2 - Right to Left */}
            <div className="flex w-max relative">
              <div className="flex gap-6 animate-marquee-reverse">
                {/* Original + Duplicate to maintain seamless cycle */}
                {[...TESTIMONIALS.slice().reverse(), ...TESTIMONIALS.slice().reverse()].map((review, idx) => (
                  <div
                    key={`r2-${idx}`}
                    className="w-[320px] sm:w-[380px] bg-[#131c2e] border border-[#1e2e4a] p-6 rounded-sm flex flex-col justify-between space-y-4 hover:border-[#3b82f6] hover:shadow-[0_0_20px_rgba(59,130,246,0.12)] transition-all duration-300 group shrink-0"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex text-[#60a5fa] gap-0.5">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                        {review.tag && (
                          <span className="bg-[#1a263e] text-[#60a5fa] border border-[#1e2e4a] text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                            {review.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed italic font-sans">
                        "{review.text}"
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#1e2e4a] flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-sm ${review.avatarBg || 'bg-[#1a263e]'} border border-[#1e2e4a] flex items-center justify-center font-bold text-white text-xs`}>
                        {review.initials}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{review.name}</h4>
                        <span className="text-[10px] text-zinc-400 block font-sans">{review.association}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* BOOKING SECTION */}
        <BookingForm
          preselectedModel={selectedModelForBooking}
          onClearPreselectedModel={() => setSelectedModelForBooking("")}
        />

        {/* BRANCHES LOCATION */}
        <Branches />

      </main>

      {/* Premium Minimalist Footer */}
      <footer className="bg-[#0a1120] text-zinc-400 py-16 text-xs border-t border-[#1e2e4a]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Brand block */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <Logo className="w-8 h-8 shrink-0 text-white" />
              <span className="font-display font-bold text-sm text-white uppercase tracking-wider">
                EPSA Motor Torijo Bajaj
              </span>
            </div>
            <p className="text-zinc-400 pr-6 leading-relaxed text-[11px]">
              Distribuidor oficial autorizado de motocars Torito Bajaj. Nos especializamos en brindar soporte técnico calificado, financiamiento directo flexible y la mejor asesoría comercial en Lima Norte y el Callao.
            </p>
            <div className="text-[10px] text-zinc-500 space-y-1">
              <p>© {new Date().getFullYear()} EPSA Motor Torijo Bajaj. Todos los derechos reservados.</p>
              <p>Autorizado oficial por Crosland Perú S.A.C.</p>
            </div>
          </div>

          {/* Quick links block */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navegación</h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => scrollToSection("hero-section")} className="hover:text-white cursor-pointer transition-colors text-left">
                  Inicio
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("benefits-section")} className="hover:text-[#60a5fa] cursor-pointer transition-colors text-left">
                  Beneficios y Crédito
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("catalog-section")} className="hover:text-[#60a5fa] cursor-pointer transition-colors text-left">
                  Catálogo de Modelos
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("comparer-section")} className="hover:text-[#60a5fa] cursor-pointer transition-colors text-left">
                  Comparador Técnico
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("calculator-section")} className="hover:text-[#60a5fa] cursor-pointer transition-colors text-left">
                  Calculadora de Ganancia
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("booking-section")} className="hover:text-[#60a5fa] cursor-pointer transition-colors text-left">
                  Reservas de Taller
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("branches-section")} className="hover:text-[#60a5fa] cursor-pointer transition-colors text-left">
                  Sedes y Sucursales
                </button>
              </li>
            </ul>
          </div>

          {/* Sede contact details block */}
          <div className="md:col-span-4 space-y-3 text-[11px] leading-relaxed text-zinc-400">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Sedes Oficiales</h4>
            <div className="space-y-3">
              <p>
                <strong className="text-zinc-200">Puente Piedra:</strong> Av. Puente Piedra 450, Lima.
              </p>
              <p>
                <strong className="text-zinc-200">Comas:</strong> Av. Túpac Amaru 3450, Lima.
              </p>
              <p>
                <strong className="text-zinc-200">Ventanilla:</strong> Av. La Playa Mz. C Lote 15, Callao.
              </p>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating ChatAdvisor & WhatsApp Launcher Widgets with Premium Spring Motion */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        <AnimatePresence>
          {/* Helper prompt banner */}
          {!isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="bg-[#131c2e] border border-[#1e2e4a] text-zinc-200 px-3.5 py-2 rounded-sm text-[11px] font-bold shadow-lg flex items-center gap-2 uppercase tracking-wider"
            >
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              ¿Asesoría de Crédito?
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex items-center gap-3">
          {/* Llamada Rápida Direct Call Button with Tooltip */}
          <div className="relative">
            <motion.a
              href="tel:+51987654321"
              initial={{ opacity: 0, scale: 0, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.15 }}
              whileHover={{ scale: 1.15, rotate: 6 }}
              whileTap={{ scale: 0.92 }}
              onMouseEnter={() => setShowCallTooltip(true)}
              onMouseLeave={() => setShowCallTooltip(false)}
              onClick={() => {
                console.log("[Analytics] Quick Phone Call click event registered. Voice sales intent tracked.", {
                  timestamp: new Date().toISOString(),
                  channel: "Phone",
                  target: "Sales Hotline",
                  number: "+51987654321"
                });
              }}
              className="relative bg-[#0ea5e9] hover:bg-[#0284c7] text-white p-4 rounded-full shadow-lg cursor-pointer flex items-center justify-center transition-all border border-sky-400/30 hover:shadow-[0_0_20px_rgba(14,165,233,0.5)]"
              title="Llamar directamente a ventas"
              id="btn-call-floating"
            >
              <PhoneCall className="w-5 h-5 text-white" />
              
              {/* Live Status Indicator */}
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0ea5e9] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#38bdf8] border-2 border-[#060a13]"></span>
              </span>
            </motion.a>

            {/* Interactive Call Tooltip with Operation Hours */}
            <AnimatePresence>
              {showCallTooltip && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 8 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-16 right-0 w-64 bg-[#131c2e]/90 backdrop-blur-md border border-[#1e2e4a]/80 p-4 rounded-sm shadow-2xl z-50 pointer-events-none text-left"
                >
                  <div className="relative">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-1.5 h-1.5 bg-[#38bdf8] rounded-full animate-pulse" />
                      <span className="font-bold text-[#0ea5e9] text-[10px] uppercase tracking-widest">Llamada Rápida</span>
                    </div>
                    <p className="text-[11px] text-zinc-100 font-bold mb-1">
                      Central: +51 987 654 321
                    </p>
                    <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">
                      Llama directo para recibir atención inmediata de un asesor de ventas, resolver tus dudas al instante y programar tu compra.
                    </p>
                    {/* Small speech bubble arrow */}
                    <div className="absolute -bottom-[21px] right-5 w-2.5 h-2.5 bg-[#131c2e]/90 backdrop-blur-md border-r border-b border-[#1e2e4a]/80 rotate-45" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Chat via WhatsApp Button with Live Status Indicator & Tooltip */}
          <div className="relative">
            {/* Sparkles Emitter Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-visible z-10">
              <AnimatePresence>
                {sparkles.map((sparkle) => (
                  <motion.span
                    key={sparkle.id}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{ 
                      opacity: [0, 1, 1, 0], 
                      scale: [0, 1.3, 0.9, 0],
                      x: sparkle.x,
                      y: sparkle.y,
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ 
                      duration: 1.4, 
                      ease: "easeOut" 
                    }}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      width: sparkle.size,
                      height: sparkle.size,
                      top: "50%",
                      left: "50%",
                      backgroundColor: sparkle.color,
                      boxShadow: `0 0 10px ${sparkle.color}`,
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>

            <motion.a
              href="https://wa.me/51987654321?text=Hola%20EPSA%20Motor%2C%20estoy%20interesado%20en%20cotizar%20un%20mototaxi%20Torito%20Bajaj%20y%20conocer%20los%20planes%20de%20cr%C3%A9dito%20directo.%20%C2%BFMe%20podr%C3%ADan%20asesorar%3F"
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              initial={{ opacity: 0, scale: 0, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
              whileHover={{ scale: 1.12, rotate: -4 }}
              whileTap={{ scale: 0.92 }}
              onMouseEnter={() => {
                setShowWspTooltip(true);
                setIsWspHovered(true);
                if (!hasPlayedWspSound.current) {
                  playWspChime();
                  hasPlayedWspSound.current = true;
                }
              }}
              onMouseLeave={() => {
                setShowWspTooltip(false);
                setIsWspHovered(false);
              }}
              onClick={() => {
                console.log("[Analytics] WhatsApp click event registered. Sales intent tracked.", {
                  timestamp: new Date().toISOString(),
                  channel: "WhatsApp",
                  target: "Sales Department",
                  prefilledMessage: "Hola EPSA Motor..."
                });
              }}
              className={`relative bg-[#25d366] hover:bg-[#20ba5a] text-white rounded-full shadow-lg cursor-pointer flex items-center justify-center border border-[#a3f3be]/30 hover:shadow-[0_0_20px_rgba(37,211,102,0.5)] transition-all duration-300 ${isWspHovered ? "pl-5 pr-4 py-4" : "p-4"}`}
              title="Contactar a ventas por WhatsApp"
              id="btn-whatsapp-floating"
            >
              <motion.span
                initial={false}
                animate={{
                  maxWidth: isWspHovered ? 120 : 0,
                  opacity: isWspHovered ? 1 : 0,
                  marginRight: isWspHovered ? 8 : 0,
                }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden whitespace-nowrap text-xs font-bold font-sans tracking-wide block"
              >
                Chat en Vivo
              </motion.span>
              <MessageCircle className="w-5 h-5 text-white flex-shrink-0" />
              
              {/* Live Online Badge Status Indicator */}
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25d366] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#0df050] border-2 border-[#060a13]"></span>
              </span>
            </motion.a>

            {/* Interactive Tooltip with Operation Hours */}
            <AnimatePresence>
              {showWspTooltip && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 8 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-16 right-0 w-64 bg-[#131c2e]/90 backdrop-blur-md border border-[#1e2e4a]/80 p-4 rounded-sm shadow-2xl z-50 pointer-events-none text-left"
                >
                  <div className="relative">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-1.5 h-1.5 bg-[#0df050] rounded-full animate-pulse" />
                      <span className="font-bold text-[#25d366] text-[10px] uppercase tracking-widest">Ventas Online</span>
                    </div>
                    <p className="text-[11px] text-zinc-100 font-bold mb-1">
                      Lun a Sáb: 8:00 AM - 6:00 PM
                    </p>
                    <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">
                      Escríbenos para cotizar tu mototaxi, consultar planes de financiamiento o programar un test drive.
                    </p>
                    {/* Small speech bubble arrow */}
                    <div className="absolute -bottom-[21px] right-5 w-2.5 h-2.5 bg-[#131c2e]/90 backdrop-blur-md border-r border-b border-[#1e2e4a]/80 rotate-45" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Floating ChatAdvisor Launcher Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            whileHover={{ scale: 1.08, rotate: 6 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white p-4 rounded-full shadow-lg cursor-pointer flex items-center justify-center transition-all border border-[#60a5fa]/30 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]"
            title="Abrir chat de asesoría AI"
            id="btn-chat-floating"
          >
            <MessageSquare className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </div>

      {/* CHAT ADVISOR CORE INTERACTION */}
      <ChatAdvisor
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onSelectModelForBooking={handleSelectModelForBooking}
      />

    </div>
  );
}
