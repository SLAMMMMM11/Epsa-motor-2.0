import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, MapPin, BadgeDollarSign, Sparkles, Zap, Award, CheckCircle2, Cpu } from "lucide-react";

interface HeroProps {
  onExploreCatalog: () => void;
  onBookAppointment: () => void;
  onOpenChat: () => void;
}

export default function Hero({ onExploreCatalog, onBookAppointment, onOpenChat }: HeroProps) {
  const [activeTab, setActiveTab] = useState<"tech" | "credit">("tech");
  const [pulseCount, setPulseCount] = useState<number>(0);

  // Auto-pulse the DTS-i simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseCount((prev) => (prev + 1) % 3);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-[#060a13] text-white border-b border-[#1e2e4a] overflow-hidden py-16 md:py-28" id="hero-section">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#2563eb]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-1.5 bg-[#131c2e] border border-[#1e2e4a] text-[#60a5fa] px-3.5 py-1.5 rounded-sm text-[11px] font-bold tracking-wider uppercase shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#60a5fa] animate-pulse" />
              Distribuidor Oficial Autorizado Bajaj
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold leading-none tracking-tight mb-4 text-white"
            >
              Movilidad Urbana <br />
              <span className="text-[#60a5fa] font-serif italic">y Progreso Local</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm text-zinc-400 max-w-2xl mx-auto lg:mx-0 font-sans leading-relaxed"
            >
              En <strong className="text-white font-medium">EPSA Motor Torijo</strong> acompañamos tu camino hacia el emprendimiento. Ofrecemos el catálogo completo de mototaxis Bajaj original con financiamiento flexible, trámite de placa rápido y servicio de taller certificado en nuestras tiendas de <strong className="text-white font-medium">Puente Piedra, Comas y Ventanilla</strong>.
            </motion.p>

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex gap-6 justify-center lg:justify-start"
            >
              <div className="flex flex-col border-l-2 border-[#2563eb] pl-4 text-left">
                <span className="text-lg font-bold text-white tracking-tight">BAJAJ TORITO RE</span>
                <span className="text-[#60a5fa] text-[10px] uppercase font-bold tracking-wider font-mono">El Socio de Oro del Perú</span>
              </div>
              <div className="flex flex-col border-l-2 border-[#2563eb] pl-4 text-left">
                <span className="text-lg font-bold text-white tracking-tight">MAXIMA CARGO</span>
                <span className="text-[#60a5fa] text-[10px] uppercase font-bold tracking-wider font-mono">500 KG de Carga Real</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-4"
            >
              <button
                onClick={onExploreCatalog}
                className="btn-primary px-8 py-3.5 rounded-sm cursor-pointer shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:scale-102 transition-transform"
                id="btn-hero-catalog"
              >
                Explorar Modelos
              </button>
              <button
                onClick={onBookAppointment}
                className="btn-secondary px-8 py-3.5 rounded-sm cursor-pointer hover:border-[#2563eb]/50 transition-colors"
                id="btn-hero-booking"
              >
                Cita de Mantenimiento
              </button>
              <button
                onClick={onOpenChat}
                className="btn-secondary px-6 py-3.5 rounded-sm cursor-pointer flex items-center justify-center gap-1.5 hover:border-[#2563eb]/50 transition-colors"
                id="btn-hero-chat"
              >
                <Zap className="w-4 h-4 text-[#60a5fa] animate-pulse" />
                Asesoría de Crédito
              </button>
            </motion.div>

            {/* Micro Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-[#1e2e4a] max-w-md mx-auto lg:mx-0"
            >
              <div className="text-center lg:text-left">
                <p className="text-xl font-bold text-white font-mono">1 AÑO</p>
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-sans">Garantía de Fábrica</p>
              </div>
              <div className="text-center lg:text-left border-x border-[#1e2e4a]/60 px-4">
                <p className="text-xl font-bold text-white font-mono">EXPRÉS</p>
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-sans">Aprobación de Crédito</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-xl font-bold text-white font-mono">GRATIS</p>
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-sans">Trámite de Placa</p>
              </div>
            </motion.div>
          </div>

          {/* $10,000 Interactive Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-[#131c2e]/95 backdrop-blur-md border border-[#1e2e4a] rounded-sm p-6 md:p-8 shadow-2xl relative overflow-hidden"
            >
              {/* Subtle glass reflection effect */}
              <div className="absolute -top-[100px] -right-[100px] w-56 h-56 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />

              {/* Toggle Tabs */}
              <div className="flex border-b border-[#1e2e4a] mb-6">
                <button
                  onClick={() => setActiveTab("tech")}
                  className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
                    activeTab === "tech"
                      ? "text-[#60a5fa] border-[#2563eb]"
                      : "text-zinc-400 border-transparent hover:text-zinc-200"
                  }`}
                >
                  Innovación DTS-i
                </button>
                <button
                  onClick={() => setActiveTab("credit")}
                  className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
                    activeTab === "credit"
                      ? "text-[#60a5fa] border-[#2563eb]"
                      : "text-zinc-400 border-transparent hover:text-zinc-200"
                  }`}
                >
                  Sola Firma Express
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "tech" ? (
                  <motion.div
                    key="tech-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[#60a5fa] text-[10px] uppercase tracking-wider font-bold">Tecnología Patentada</span>
                        <h3 className="text-base font-bold text-white mt-1">Triple Bujía Digital (DTS-i)</h3>
                      </div>
                      <span className="bg-[#1a263e] text-white border border-[#1e2e4a] px-2.5 py-1 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider">
                        Exclusivo Bajaj
                      </span>
                    </div>

                    {/* Animated Engine Spark Simulation */}
                    <div className="h-44 bg-[#0a1120] rounded-sm relative overflow-hidden border border-[#1e2e4a] flex flex-col items-center justify-center p-4">
                      {/* Grid Pattern Background */}
                      <div className="absolute inset-0 bg-[radial-gradient(#1e2e4a_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

                      <div className="relative z-10 flex items-center justify-around w-full max-w-sm mt-2">
                        {/* Spark Plug 1 */}
                        <div className="flex flex-col items-center space-y-2">
                          <motion.div
                            animate={{
                              scale: pulseCount === 0 ? [1, 1.15, 1] : 1,
                              borderColor: pulseCount === 0 ? "#60a5fa" : "#1e2e4a",
                              backgroundColor: pulseCount === 0 ? "rgba(37, 99, 235, 0.2)" : "#131c2e",
                            }}
                            transition={{ duration: 0.4 }}
                            className="w-11 h-11 rounded-full border flex items-center justify-center text-zinc-400"
                          >
                            <Zap className={`w-5 h-5 ${pulseCount === 0 ? "text-[#60a5fa] animate-bounce" : "text-zinc-500"}`} />
                          </motion.div>
                          <span className={`text-[9px] font-mono font-bold tracking-wider ${pulseCount === 0 ? "text-white" : "text-zinc-500"}`}>
                            BUJÍA 1
                          </span>
                        </div>

                        {/* Connection Line */}
                        <div className="h-[1px] flex-grow bg-gradient-to-r from-blue-500/20 to-blue-500/20 relative">
                          {pulseCount === 1 && (
                            <motion.div
                              layoutId="active-spark-line"
                              className="absolute top-0 bottom-0 left-0 right-0 bg-[#60a5fa] shadow-[0_0_8px_#3b82f6]"
                            />
                          )}
                        </div>

                        {/* Spark Plug 2 */}
                        <div className="flex flex-col items-center space-y-2">
                          <motion.div
                            animate={{
                              scale: pulseCount === 1 ? [1, 1.15, 1] : 1,
                              borderColor: pulseCount === 1 ? "#60a5fa" : "#1e2e4a",
                              backgroundColor: pulseCount === 1 ? "rgba(37, 99, 235, 0.2)" : "#131c2e",
                            }}
                            transition={{ duration: 0.4 }}
                            className="w-11 h-11 rounded-full border flex items-center justify-center text-zinc-400"
                          >
                            <Zap className={`w-5 h-5 ${pulseCount === 1 ? "text-[#60a5fa] animate-bounce" : "text-zinc-500"}`} />
                          </motion.div>
                          <span className={`text-[9px] font-mono font-bold tracking-wider ${pulseCount === 1 ? "text-white" : "text-zinc-500"}`}>
                            BUJÍA 2
                          </span>
                        </div>

                        {/* Connection Line */}
                        <div className="h-[1px] flex-grow bg-gradient-to-r from-blue-500/20 to-blue-500/20 relative">
                          {pulseCount === 2 && (
                            <motion.div
                              layoutId="active-spark-line"
                              className="absolute top-0 bottom-0 left-0 right-0 bg-[#60a5fa] shadow-[0_0_8px_#3b82f6]"
                            />
                          )}
                        </div>

                        {/* Spark Plug 3 */}
                        <div className="flex flex-col items-center space-y-2">
                          <motion.div
                            animate={{
                              scale: pulseCount === 2 ? [1, 1.15, 1] : 1,
                              borderColor: pulseCount === 2 ? "#60a5fa" : "#1e2e4a",
                              backgroundColor: pulseCount === 2 ? "rgba(37, 99, 235, 0.2)" : "#131c2e",
                            }}
                            transition={{ duration: 0.4 }}
                            className="w-11 h-11 rounded-full border flex items-center justify-center text-zinc-400"
                          >
                            <Zap className={`w-5 h-5 ${pulseCount === 2 ? "text-[#60a5fa] animate-bounce" : "text-zinc-500"}`} />
                          </motion.div>
                          <span className={`text-[9px] font-mono font-bold tracking-wider ${pulseCount === 2 ? "text-white" : "text-zinc-500"}`}>
                            BUJÍA 3
                          </span>
                        </div>
                      </div>

                      <p className="text-[10px] text-[#60a5fa] font-mono font-bold mt-4 tracking-wider uppercase flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                        Encendido Digital Secuencial Multi-Punto
                      </p>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex items-start gap-2 text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-[#60a5fa] shrink-0 mt-0.5" />
                        <span><strong className="text-white font-medium">Combustión Óptima</strong>: 27% más ahorro de combustible que un motor convencional de 2 bujías.</span>
                      </div>
                      <div className="flex items-start gap-2 text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-[#60a5fa] shrink-0 mt-0.5" />
                        <span><strong className="text-white font-medium">Menor Emisión</strong>: Diseñado para cumplir con rigurosas normas ecológicas con GNV original.</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="credit-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[#60a5fa] text-[10px] uppercase tracking-wider font-bold">Evaluación Inmediata</span>
                        <h3 className="text-base font-bold text-white mt-1">Línea de Crédito Directo</h3>
                      </div>
                      <span className="bg-[#1a263e] text-[#60a5fa] border border-[#1e2e4a] px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider animate-pulse">
                        Sola Firma
                      </span>
                    </div>

                    {/* Credit Roadmap */}
                    <div className="space-y-4">
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#0a1120] border border-[#1e2e4a] p-3 rounded-sm flex items-center gap-4"
                      >
                        <span className="w-7 h-7 rounded-full bg-[#2563eb]/20 border border-[#2563eb] flex items-center justify-center font-bold text-xs text-[#60a5fa]">
                          1
                        </span>
                        <div className="text-xs">
                          <p className="font-bold text-white">Presenta tu DNI</p>
                          <p className="text-[11px] text-zinc-400 mt-0.5">Vigente y con dirección local en Lima o Callao.</p>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-[#0a1120] border border-[#1e2e4a] p-3 rounded-sm flex items-center gap-4"
                      >
                        <span className="w-7 h-7 rounded-full bg-[#2563eb]/20 border border-[#2563eb] flex items-center justify-center font-bold text-xs text-[#60a5fa]">
                          2
                        </span>
                        <div className="text-xs">
                          <p className="font-bold text-white">Recibo de Servicios</p>
                          <p className="text-[11px] text-zinc-400 mt-0.5">Luz o Agua que certifique tu residencia familiar.</p>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-[#0a1120] border border-[#1e2e4a] p-3 rounded-sm flex items-center gap-4"
                      >
                        <span className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center font-bold text-xs text-emerald-400">
                          ✓
                        </span>
                        <div className="text-xs">
                          <p className="font-bold text-white">¡Aprobado al Instante!</p>
                          <p className="text-[11px] text-zinc-400 mt-0.5">Evaluamos tu historial comercial y fijamos la inicial.</p>
                        </div>
                      </motion.div>
                    </div>

                    <button
                      onClick={onOpenChat}
                      className="w-full btn-primary py-3 px-4 text-xs font-bold uppercase tracking-wider rounded-sm text-center shadow-lg hover:scale-102 transition-transform cursor-pointer"
                    >
                      Pre-evaluar mi Crédito Ahora
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Quick Specs Footer */}
              <div className="mt-6 pt-4 border-t border-[#1e2e4a] flex items-center justify-between text-[11px] text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Soporte Oficial S.A.
                </span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#60a5fa]" />
                  Crosland Líder Perú
                </span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
