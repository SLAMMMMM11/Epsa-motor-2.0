import { useEffect, useState } from "react";
import Hero from "./components/Hero";
import Catalog from "./components/Catalog";
import BookingForm from "./components/BookingForm";
import Branches from "./components/Branches";
import ChatAdvisor from "./components/ChatAdvisor";
import Logo from "./components/Logo";
import AmbientBackground from "./components/AmbientBackground";
import ModelComparer from "./components/ModelComparer";
import EarningCalculator from "./components/EarningCalculator";
import AboutUs from "./components/AboutUs";
import ModelFinder from "./components/ModelFinder";
import ContactDock from "./components/ContactDock";
import ThemeToggle from "./components/ThemeToggle";
import ProductPage from "./components/ProductPage";
import { TESTIMONIALS, CONTACT, BRANCHES, getModelById } from "./data";
import { motion, AnimatePresence } from "motion/react";
import { Award, FileText, MapPinned, Menu, MessageSquare, Star, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Inicio", section: "hero-section" },
  { label: "Tu Torito", section: "finder-section" },
  { label: "Nosotros", section: "about-section" },
  { label: "Modelos", section: "catalog-section" },
  { label: "Comparar", section: "comparer-section" },
  { label: "Rentabilidad", section: "calculator-section" },
  { label: "Citas", section: "booking-section" },
  { label: "Sedes", section: "branches-section" },
] as const;

const BENEFIT_CARDS = [
  {
    title: "Crédito Directo Flexible",
    copy: "Evaluamos tu historial crediticio con tu DNI y un recibo de servicios. Diseñamos cuotas a tu medida para facilitar el pago progresivo.",
    image: "/assets/media/images/benefit-credito-directo-modelo-real.png",
    alt: "Asesoría para solicitar crédito directo en EPSA Motor",
    icon: Award,
  },
  {
    title: "Trámite de Placa Sunarp",
    copy: "Gestionamos el registro de placa y tarjeta de propiedad de manera gratuita y veloz con la compra de tu mototaxi nuevo.",
    image: "/assets/media/images/benefit-tramite-placa-modelo-real-v2.png",
    alt: "Placa peruana y documentos para el trámite registral en Sunarp",
    icon: FileText,
  },
  {
    title: "3 Sedes en Lima y Callao",
    copy: "Atiéndete en Comas, Ventanilla o Puente Piedra para ver unidades, cotizar y evaluar tu crédito con un asesor.",
    image: "/assets/media/images/benefit-sedes-lima-callao.webp",
    alt: "Mapa de Lima y Callao con las sedes de EPSA Motor",
    icon: MapPinned,
  },
  {
    title: "Asesoría Comercial",
    copy: "Cotiza por WhatsApp, agenda una prueba de manejo o visita la sede. Te ayudamos a elegir el modelo ideal para tu negocio.",
    image: "/assets/media/images/benefit-asesoria-whatsapp-modelo-real.png",
    alt: "Asesora comercial de EPSA Motor atendiendo por WhatsApp",
    icon: MessageSquare,
  },
] as const;

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [selectedModelForBooking, setSelectedModelForBooking] = useState<string>("");
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const [activeSection, setActiveSection] = useState<string>("hero-section");

  const productId = currentPath.match(/^\/modelos\/([^/]+)\/?$/)?.[1];
  const activeProduct = productId ? getModelById(decodeURIComponent(productId)) : null;

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      window.scrollTo({ top: 0, behavior: "instant" });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (currentPath !== "/") {
      setActiveSection("catalog-section");
      return;
    }

    const updateNavigationState = () => {
      const marker = Math.min(220, window.innerHeight * 0.28);
      let nextSection: string = NAV_ITEMS[0].section;

      for (const item of NAV_ITEMS) {
        const section = document.getElementById(item.section);
        if (!section) continue;

        const bounds = section.getBoundingClientRect();
        if (bounds.top <= marker) {
          nextSection = item.section;
        }
        if (bounds.top <= marker && bounds.bottom >= marker) {
          nextSection = item.section;
          break;
        }
      }

      setActiveSection(nextSection);
    };

    const frame = window.requestAnimationFrame(updateNavigationState);
    window.addEventListener("scroll", updateNavigationState, { passive: true });
    window.addEventListener("resize", updateNavigationState);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateNavigationState);
      window.removeEventListener("resize", updateNavigationState);
    };
  }, [currentPath]);

  const handleViewProduct = (modelId: string) => {
    window.history.pushState({}, "", `/modelos/${modelId}`);
    setCurrentPath(`/modelos/${modelId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectModelForBooking = (modelName: string) => {
    setSelectedModelForBooking(modelName);
    
    // Smooth scroll to booking section
    const bookingSection = document.getElementById("booking-section");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    setActiveSection(id);

    if (activeProduct) {
      window.history.pushState({}, "", "/");
      setCurrentPath("/");
      window.setTimeout(() => {
        if (id === "hero-section") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 80);
      return;
    }

    if (id === "hero-section") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="app-shell min-h-screen font-sans flex flex-col justify-between selection:bg-[#ed111d]/20 relative">
      <AmbientBackground />

      <header className="legacy-site-header sticky top-0 z-40 border-b border-[#21466f] bg-[#071e3d] px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => scrollToSection("hero-section")}
            aria-label="Ir al inicio"
            className="legacy-brand-lockup"
          >
            <Logo className="w-[126px] h-9 sm:w-[148px] sm:h-10" variant="inverse" />
            <span className="legacy-brand-divider hidden sm:block" aria-hidden="true" />
            <span className="legacy-partner-logos hidden sm:flex">
              <img src="/assets/media/images/RE_torito.png" alt="Torito Bajaj" />
              <img src="/assets/media/images/bajaj_favorita.png" alt="Bajaj favorita del Perú" />
            </span>
          </button>

          <nav className="legacy-desktop-nav hidden xl:flex" aria-label="Navegación principal">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.section}
                type="button"
                onClick={() => scrollToSection(item.section)}
                className={activeSection === item.section ? "is-active" : ""}
                aria-current={activeSection === item.section ? "location" : undefined}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsChatOpen(true)}
              className="btn-primary hidden rounded-sm px-4 py-2.5 sm:inline-flex"
              id="btn-nav-chat"
            >
              Asesoría de crédito
            </button>
            <button
              type="button"
              className="mobile-menu-toggle xl:hidden"
              onClick={() => setIsMobileMenuOpen((current) => !current)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              id="mobile-navigation"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="mobile-nav-panel absolute left-0 right-0 top-full border-t border-b px-3 py-3 xl:hidden"
            >
              <div className="mobile-nav-header max-w-7xl mx-auto">
                <span>Navegación</span>
                <small>Distribuidor autorizado Bajaj</small>
              </div>
              <div className="mobile-nav-grid max-w-7xl mx-auto grid sm:grid-cols-2">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.section}
                    type="button"
                    onClick={() => scrollToSection(item.section)}
                    className={`mobile-nav-link${activeSection === item.section ? " is-active" : ""}`}
                    aria-current={activeSection === item.section ? "location" : undefined}
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  type="button"
                  className="mobile-nav-link cursor-pointer sm:hidden"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsChatOpen(true);
                  }}
                >
                  Evaluar mi crédito
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {activeProduct ? (
          <ProductPage
            model={activeProduct}
            onBack={() => scrollToSection("catalog-section")}
            onQuote={handleSelectModelForBooking}
            onViewProduct={handleViewProduct}
          />
        ) : (
          <>
        
        {/* HERO SECTION */}
        <Hero
          onExploreCatalog={() => scrollToSection("catalog-section")}
          onOpenChat={() => setIsChatOpen(true)}
        />

        {/* BENEFITS / WHY CHOOSE EPSA MOTOR */}
        <section className="brand-light-section py-20 border-b relative" id="benefits-section">
          <div className="max-w-7xl mx-auto px-6">
            
            {/* Elegant Header */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <span className="brand-kicker text-xs font-bold uppercase tracking-widest block mb-2">Respaldo Integral</span>
              <h2 className="brand-section-title text-3xl sm:text-4xl font-display font-bold tracking-tight leading-tight">
                ¿Por qué elegir EPSA Motor?
              </h2>
              <p className="brand-section-copy mt-4 text-xs md:text-sm leading-relaxed font-sans">
                <strong className="font-medium">{CONTACT.yearsInMarketLabel}</strong> acompañando
                emprendedores en Lima y Callao. Venta y financiamiento de Torito Bajaj con respaldo formal (RUC{" "}
                {CONTACT.ruc}).
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
              
              {BENEFIT_CARDS.map(({ title, copy, image, alt, icon: Icon }) => (
                <motion.article
                  key={title}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 16 } }
                  }}
                  className="brand-benefit-card group"
                >
                  <div className="brand-benefit-media brand-benefit-media--photo">
                    <img src={image} alt={alt} loading="lazy" />
                    <div className="brand-benefit-icon">
                      <Icon aria-hidden="true" />
                    </div>
                  </div>
                  <div className="brand-benefit-body">
                    <h3 className="brand-card-title">{title}</h3>
                    <p className="brand-card-copy">{copy}</p>
                  </div>
                </motion.article>
              ))}

            </motion.div>

          </div>
        </section>

        {/* QUIÉNES SOMOS — fotos oficiales */}
        <AboutUs />

        {/* SELECTOR GUIADO DE MODELO */}
        <ModelFinder
          onSelectModel={handleSelectModelForBooking}
          onViewProduct={handleViewProduct}
        />

        {/* ONLINE CATALOG */}
        <Catalog
          onSelectModelForBooking={handleSelectModelForBooking}
          onViewProduct={handleViewProduct}
        />

        {/* INTERACTIVE MODEL COMPARER */}
        <ModelComparer onSelectModel={handleSelectModelForBooking} />

        {/* INTERACTIVE ROI / EARNING CALCULATOR */}
        <EarningCalculator />

        {/* REVIEWS & CASE STUDIES (INFINITE MARQUEE STRIP) */}
        <section className="testimonials-section py-24 border-b relative overflow-hidden" id="testimonials-section">
          {/* Subtle decorative background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 mb-12 relative z-10">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-[#60a5fa] text-xs font-bold uppercase tracking-widest block mb-2">Opiniones de Clientes</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#f1f5f9] tracking-tight leading-tight">
                Historias de Éxito Comercial
              </h2>
              <p className="text-[#a1a1aa] mt-4 text-xs md:text-sm leading-relaxed font-sans">
                La experiencia de emprendedores locales que consolidaron su herramienta de trabajo confiando en la venta y el financiamiento de EPSA Motor.
              </p>
            </div>
          </div>

          {/* Marquee Container */}
          <div className="w-full relative py-4 space-y-6 overflow-hidden">
            {/* Left & Right gradient edge fades */}
            <div className="testimonial-edge testimonial-edge--left absolute left-0 top-0 bottom-0 w-16 sm:w-48 z-20 pointer-events-none" />
            <div className="testimonial-edge testimonial-edge--right absolute right-0 top-0 bottom-0 w-16 sm:w-48 z-20 pointer-events-none" />

            {/* Marquee Row 1 - Left to Right */}
            <div className="flex w-max relative">
              <div className="flex gap-6 animate-marquee">
                {/* Original + Duplicate to maintain seamless cycle */}
                {[...TESTIMONIALS, ...TESTIMONIALS].map((review, idx) => (
                  <div
                    key={`r1-${idx}`}
                    className="testimonial-card w-[320px] sm:w-[380px] p-6 rounded-xl flex flex-col justify-between space-y-4 transition-all duration-300 group shrink-0"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex text-[#fbbf24] gap-0.5" aria-label={`${review.rating} de 5 estrellas`}>
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                        {review.tag && (
                          <span className="testimonial-tag text-[9px] font-bold px-2 py-0.5 rounded-xl uppercase tracking-wider">
                            {review.tag}
                          </span>
                        )}
                      </div>
                      <p className="testimonial-copy text-xs leading-relaxed italic font-sans">
                        "{review.text}"
                      </p>
                    </div>
                    <div className="testimonial-footer pt-3 border-t flex items-center gap-3">
                      <div
                        className="testimonial-avatar"
                        title={review.modelName}
                      >
                        <img
                          src={review.avatarImage}
                          alt={`${review.modelName} adquirido por ${review.name}`}
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <h4 className="testimonial-author text-xs font-bold">{review.name}</h4>
                        <span className="testimonial-association text-[10px] block font-sans">{review.association}</span>
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
                    className="testimonial-card w-[320px] sm:w-[380px] p-6 rounded-xl flex flex-col justify-between space-y-4 transition-all duration-300 group shrink-0"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex text-[#fbbf24] gap-0.5" aria-label={`${review.rating} de 5 estrellas`}>
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                        {review.tag && (
                          <span className="testimonial-tag text-[9px] font-bold px-2 py-0.5 rounded-xl uppercase tracking-wider">
                            {review.tag}
                          </span>
                        )}
                      </div>
                      <p className="testimonial-copy text-xs leading-relaxed italic font-sans">
                        "{review.text}"
                      </p>
                    </div>
                    <div className="testimonial-footer pt-3 border-t flex items-center gap-3">
                      <div
                        className="testimonial-avatar"
                        title={review.modelName}
                      >
                        <img
                          src={review.avatarImage}
                          alt={`${review.modelName} adquirido por ${review.name}`}
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <h4 className="testimonial-author text-xs font-bold">{review.name}</h4>
                        <span className="testimonial-association text-[10px] block font-sans">{review.association}</span>
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

          </>
        )}

      </main>

      {/* Premium Minimalist Footer */}
      <footer className="site-footer py-16 text-xs border-t">
        <div className="max-w-7xl mx-auto px-6">
          <div className="footer-cta mb-14 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">
            <div className="max-w-2xl">
              <span className="footer-cta-kicker">Potencia para tu siguiente paso</span>
              <h3>¿Listo para poner tu negocio en marcha?</h3>
              <p>
                Recibe asesoría sobre modelos, crédito y disponibilidad en nuestras sedes de Lima Norte y Callao.
              </p>
            </div>
            <div className="footer-cta-actions flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                type="button"
                onClick={() => scrollToSection("booking-section")}
                className="footer-cta-primary"
              >
                Agendar una visita
              </button>
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-cta-secondary"
              >
                Cotizar por WhatsApp
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Brand block */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Logo
                className="footer-brand-logo w-[230px] h-[60px] shrink-0"
                loading="lazy"
                variant="inverse"
              />
              <span className="hidden sm:inline-block h-8 w-px bg-[#31577e]" aria-hidden="true" />
              <img
                src="/assets/media/images/RE_torito.png"
                alt="Torito Bajaj"
                className="h-7 w-auto object-contain opacity-90"
              />
              <img
                src="/assets/media/images/bajaj_favorita.png"
                alt="Bajaj favorita del Perú"
                className="h-7 w-auto object-contain opacity-90"
              />
            </div>
            <p className="footer-copy pr-6 leading-relaxed text-[11px]">
              Distribuidor oficial autorizado de motocars Torito Bajaj.{" "}
              Con <strong>{CONTACT.yearsInMarketLabel}</strong>{" "}
              ofreciendo venta y financiamiento en Lima Norte y el Callao.
            </p>
            <div className="footer-legal text-[10px] space-y-1">
              <p>
                <span className="font-semibold">RUC:</span> {CONTACT.ruc}
              </p>
              <p>© {new Date().getFullYear()} EPSA Motor. Todos los derechos reservados.</p>
              <p>Autorizado oficial por Crosland Perú S.A.C.</p>
            </div>
          </div>

          {/* Quick links block */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="footer-heading text-xs font-bold uppercase tracking-wider">Navegación</h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => scrollToSection("hero-section")} className="footer-nav-link">
                  Inicio
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("benefits-section")} className="footer-nav-link">
                  Beneficios y Crédito
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("about-section")} className="footer-nav-link">
                  Quiénes somos
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("finder-section")} className="footer-nav-link">
                  Encuentra tu Torito ideal
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("catalog-section")} className="footer-nav-link">
                  Catálogo de Modelos
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("comparer-section")} className="footer-nav-link">
                  Comparador Técnico
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("calculator-section")} className="footer-nav-link">
                  Calculadora de Ganancia
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("booking-section")} className="footer-nav-link">
                  Agendar Visita
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("branches-section")} className="footer-nav-link">
                  Sedes y Sucursales
                </button>
              </li>
            </ul>
          </div>

          {/* Sede contact details block */}
          <div className="footer-contact md:col-span-4 space-y-3 text-[11px] leading-relaxed">
            <h4 className="footer-heading text-xs font-bold uppercase tracking-wider">Sedes Oficiales</h4>
            <div className="space-y-3">
              {BRANCHES.map((b) => (
                <p key={b.name}>
                  <strong>{b.name}:</strong> {b.address}
                </p>
              ))}
              <p className="pt-1">
                <strong>Tel / WhatsApp:</strong>{" "}
                <a className="footer-contact-link" href={`tel:${CONTACT.phoneTel}`}>
                  {CONTACT.phoneDisplay}
                </a>
                <br />
                <strong>Email:</strong>{" "}
                <a className="footer-contact-link break-all" href={`mailto:${CONTACT.email}`}>
                  {CONTACT.email}
                </a>
                <br />
                <strong>RUC:</strong> {CONTACT.ruc}
                <br />
                <strong>+20 años</strong> en el mercado
              </p>
            </div>
          </div>

          </div>
        </div>
      </footer>

      <ContactDock isChatOpen={isChatOpen} onOpenChat={() => setIsChatOpen(true)} />

      {/* CHAT ADVISOR CORE INTERACTION */}
      <ChatAdvisor
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onSelectModelForBooking={handleSelectModelForBooking}
      />

    </div>
  );
}
