import { useEffect, useState, type SyntheticEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, ShieldCheck, Zap, Play } from "lucide-react";
import { MOTOTAXI_MODELS, formatPrice } from "../data";

interface HeroProps {
  onExploreCatalog: () => void;
  onOpenChat: () => void;
}

type HeroTab = "video" | "tech" | "credit";

const HERO_TABS: HeroTab[] = ["video", "tech", "credit"];
const HERO_TAB_ROTATION_MS = 9000;

const syncVideoWithCarousel = (event: SyntheticEvent<HTMLVideoElement>) => {
  const video = event.currentTarget;
  const targetDurationInSeconds = HERO_TAB_ROTATION_MS / 1000;

  if (!Number.isFinite(video.duration) || video.duration <= 0) return;

  const synchronizedPlaybackRate = video.duration / targetDurationInSeconds;
  video.defaultPlaybackRate = synchronizedPlaybackRate;
  video.playbackRate = synchronizedPlaybackRate;
};

export default function Hero({ onExploreCatalog, onOpenChat }: HeroProps) {
  const [activeTab, setActiveTab] = useState<HeroTab>("video");
  const featured = MOTOTAXI_MODELS.find((m) => m.destacado) || MOTOTAXI_MODELS[0];

  useEffect(() => {
    const rotationTimer = window.setTimeout(() => {
      setActiveTab((currentTab) => {
        const currentIndex = HERO_TABS.indexOf(currentTab);
        return HERO_TABS[(currentIndex + 1) % HERO_TABS.length];
      });
    }, HERO_TAB_ROTATION_MS);

    return () => window.clearTimeout(rotationTimer);
  }, [activeTab]);

  return (
    <div
      className="hero-home-section relative bg-[#071e3d] text-white border-b border-[#21466f] overflow-hidden py-14 md:py-24"
      id="hero-section"
    >
      {/* Video de fondo sutil */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <video
          className="hero-background-video absolute inset-0 h-full w-full object-cover object-center opacity-[0.52]"
          autoPlay
          loop
          muted
          playsInline
          poster="/assets/media/images/FONDO-TORITO-TITANIO-250-1920X760.jpg"
        >
          <source src="/assets/media/video/video-index.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#071e3d]/34 via-[#071e3d]/48 to-[#071e3d]/74" />
      </div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#ed111d]/8 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -right-24 top-0 h-full w-36 rotate-[12deg] bg-[#ed111d] opacity-90 pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="hero-credential-row">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="hero-authorized-badge"
              >
                <img
                  src="/assets/media/images/bajaj_favorita.png"
                  alt=""
                  className="h-5 w-auto object-contain"
                  aria-hidden="true"
                />
                <span>Distribuidor Oficial Autorizado Bajaj</span>
                <img
                  src="/assets/media/images/RE_torito.png"
                  alt=""
                  className="h-5 w-auto object-contain"
                  aria-hidden="true"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, rotate: -6, scale: 0.9 }}
                animate={{ opacity: 1, rotate: -2, scale: 1 }}
                transition={{ duration: 0.45, delay: 0.12 }}
                className="hero-anniversary-badge"
                aria-label="Más de 20 años de experiencia"
              >
                <span className="hero-anniversary-badge__seal">
                  <Award aria-hidden="true" />
                  <strong>20</strong>
                </span>
                <span className="hero-anniversary-badge__copy">
                  <strong>Años</strong>
                  <small>de trayectoria</small>
                </span>
              </motion.div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[0.92] tracking-tight mb-4 text-white"
            >
              Potencia con respaldo. <br />
              <span className="text-[#ed111d]">Mueve tu camino.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm text-zinc-400 max-w-2xl mx-auto lg:mx-0 font-sans leading-relaxed"
            >
              Encuentra el Torito Bajaj que hará avanzar tu negocio. En <strong className="text-white font-medium">EPSA Motor</strong>{" "}
              combinamos <strong className="text-white font-medium">más de 20 años de experiencia</strong>, financiamiento flexible
              y atención cercana en Comas, Ventanilla y Puente Piedra.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex gap-6 justify-center lg:justify-start"
            >
              <div className="flex flex-col border-l-2 border-[#ed111d] pl-4 text-left">
                <span className="text-lg font-bold text-white tracking-tight">2T UG GSL</span>
                <span className="text-white/70 text-[10px] uppercase font-bold tracking-wider font-mono">
                  Desde S/ 12,199
                </span>
              </div>
              <div className="flex flex-col border-l-2 border-[#ed111d] pl-4 text-left">
                <span className="text-lg font-bold text-white tracking-tight">MAXIMA GLP</span>
                <span className="text-white/70 text-[10px] uppercase font-bold tracking-wider font-mono">
                  Hasta 350 kg carga
                </span>
              </div>
            </motion.div>

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
                onClick={onOpenChat}
                className="hero-credit-button px-8 py-3.5 rounded-sm cursor-pointer flex items-center justify-center gap-2"
                id="btn-hero-chat"
              >
                <Zap className="w-4 h-4 text-[#ed111d]" />
                Evaluar mi crédito
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 border-t border-white/15 max-w-md mx-auto lg:mx-0"
            >
              <div className="text-center lg:text-left">
                <p className="text-xl font-bold text-white font-mono">+20 AÑOS</p>
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-sans">En el mercado</p>
              </div>
              <div className="text-center lg:text-left border-x border-white/15 px-2 sm:px-4">
                <p className="text-xl font-bold text-white font-mono">3 SEDES</p>
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-sans">Lima y Callao</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-xl font-bold text-white font-mono">WHATSAPP</p>
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-sans">+51 907 721 481</p>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hero-feature-panel bg-[#0a2a53]/88 backdrop-blur-sm border border-[#21466f] rounded-sm p-6 md:p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -top-[100px] -right-[100px] w-56 h-56 bg-[#ed111d]/10 rounded-full blur-[80px] pointer-events-none" />

              <div className="hero-feature-tabs" role="tablist" aria-label="Información destacada de EPSA Motor">
                <button
                  type="button"
                  onClick={() => setActiveTab("video")}
                  className={`hero-feature-tab ${activeTab === "video" ? "is-active" : ""}`}
                  role="tab"
                  aria-selected={activeTab === "video"}
                >
                  Showroom
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("tech")}
                  className={`hero-feature-tab ${activeTab === "tech" ? "is-active" : ""}`}
                  role="tab"
                  aria-selected={activeTab === "tech"}
                >
                  Innovación DTS-i
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("credit")}
                  className={`hero-feature-tab ${activeTab === "credit" ? "is-active" : ""}`}
                  role="tab"
                  aria-selected={activeTab === "credit"}
                >
                  Crédito
                </button>
              </div>

              <div className="hero-tab-stage">
                <AnimatePresence mode="wait">
                  {activeTab === "video" ? (
                    <motion.div
                      key="video-tab"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.26 }}
                      className="hero-tab-content"
                    >
                      <div className="hero-tab-media">
                        <video
                          autoPlay
                          muted
                          playsInline
                          onLoadedMetadata={syncVideoWithCarousel}
                          poster="/assets/media/images/FONDO-TORITO-TITANIO-250-1920X760.jpg"
                        >
                          <source src="/assets/media/video/video-index.mp4" type="video/mp4" />
                        </video>
                        <span className="hero-tab-media__badge">
                          <Play aria-hidden="true" />
                          EPSA en acción
                        </span>
                      </div>

                      <div className="hero-tab-copy">
                        <span>Unidad destacada</span>
                        <h3>{featured.name}</h3>
                        <p>{formatPrice(featured.basePrice)} · {featured.power}</p>
                        <div>
                          <small>{featured.fuelTypes.join(" / ")}</small>
                          <small>Prueba de manejo</small>
                        </div>
                      </div>

                      <button type="button" className="hero-tab-cta" onClick={onExploreCatalog}>
                        Ver todos los modelos
                      </button>
                    </motion.div>
                  ) : activeTab === "tech" ? (
                    <motion.div
                      key="tech-tab"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.26 }}
                      className="hero-tab-content"
                    >
                      <div className="hero-tab-media">
                        <video
                          autoPlay
                          muted
                          playsInline
                          onLoadedMetadata={syncVideoWithCarousel}
                          poster="/assets/media/images/dtsi-twin-spark-poster.webp"
                        >
                          <source src="/assets/media/video/dtsi-twin-spark-loop.mp4" type="video/mp4" />
                        </video>
                        <span className="hero-tab-media__badge">
                          <Zap aria-hidden="true" />
                          Loop técnico DTS-i
                        </span>
                      </div>

                      <div className="hero-tab-copy">
                        <span>Encendido digital coordinado</span>
                        <h3>Doble bujía DTS-i</h3>
                        <p>Dos chispas aceleran y completan mejor la combustión dentro del cilindro.</p>
                        <div>
                          <small>Mejor rendimiento</small>
                          <small>Respuesta eficiente</small>
                        </div>
                      </div>

                      <button type="button" className="hero-tab-cta" onClick={onExploreCatalog}>
                        Ver modelos con DTS-i
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="credit-tab"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.26 }}
                      className="hero-tab-content"
                    >
                      <div className="hero-tab-media">
                        <img
                          src="/assets/media/images/benefit-credito-directo.webp"
                          alt="Asesoría para solicitar crédito directo EPSA"
                        />
                        <span className="hero-tab-media__badge">
                          <ShieldCheck aria-hidden="true" />
                          Evaluación directa
                        </span>
                      </div>

                      <div className="hero-tab-copy">
                        <span>Financiamiento EPSA</span>
                        <h3>Crédito directo flexible</h3>
                        <p>Presenta tus documentos y recibe una evaluación según tu perfil.</p>
                        <div>
                          <small>DNI vigente</small>
                          <small>Recibo de servicios</small>
                        </div>
                      </div>

                      <button type="button" className="hero-tab-cta" onClick={onOpenChat}>
                        Evaluar mi crédito
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-6 pt-4 border-t border-[#21466f] flex items-center justify-between gap-3 text-[11px] text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Venta Oficial
                </span>
                <span className="flex items-center gap-2">
                  <img
                    src="/assets/media/images/RE_torito.png"
                    alt="Torito"
                    className="h-5 w-auto object-contain"
                  />
                  <img
                    src="/assets/media/images/bajaj_favorita.png"
                    alt="Bajaj"
                    className="h-5 w-auto object-contain"
                  />
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
