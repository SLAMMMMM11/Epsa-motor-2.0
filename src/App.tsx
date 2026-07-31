import { Suspense, lazy, useEffect, useState } from "react";
import Hero from "./components/Hero";
import Catalog from "./components/Catalog";
import BookingForm from "./components/BookingForm";
import Branches from "./components/Branches";
import Faq from "./components/Faq";
import Logo from "./components/Logo";
import ModelComparer from "./components/ModelComparer";
import EarningCalculator from "./components/EarningCalculator";
import AboutUs from "./components/AboutUs";
import ModelFinder from "./components/ModelFinder";
import ContactDock from "./components/ContactDock";
import ThemeToggle from "./components/ThemeToggle";
import { TESTIMONIALS, CONTACT, BRANCHES, getModelById } from "./data";
import { motion, AnimatePresence } from "motion/react";
import { Menu, Star, X } from "lucide-react";

// Diferidos: la ficha de producto solo se monta al abrir un modelo y el
// asesor solo al abrir el chat. Ninguno hace falta en la portada.
const ProductPage = lazy(() => import("./components/ProductPage"));
const ChatAdvisor = lazy(() => import("./components/ChatAdvisor"));

const NAV_ITEMS = [
  { label: "Inicio", section: "hero-section" },
  { label: "Tu Torito", section: "finder-section" },
  { label: "Nosotros", section: "about-section" },
  { label: "Modelos", section: "catalog-section" },
  { label: "Comparar", section: "comparer-section" },
  { label: "Rentabilidad", section: "calculator-section" },
  { label: "Citas", section: "booking-section" },
  { label: "Sedes", section: "branches-section" },
  { label: "Preguntas", section: "faq-section" },
] as const;

/** El menú de escritorio muestra solo las secciones clave para no saturarse;
    el panel móvil sigue ofreciendo la lista completa de arriba. */
const DESKTOP_NAV_ITEMS = [
  { label: "Modelos", section: "catalog-section" },
  { label: "Comparar", section: "comparer-section" },
  { label: "Rentabilidad", section: "calculator-section" },
  { label: "Nosotros", section: "about-section" },
  { label: "Contáctanos", section: "footer-contact" },
] as const;

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  // Una vez abierto, el asesor se queda montado: desmontarlo cortaría las
  // animaciones de salida de AnimatePresence.
  const [chatEverOpened, setChatEverOpened] = useState<boolean>(false);

  const openChat = () => {
    setChatEverOpened(true);
    setIsChatOpen(true);
  };
  // La apertura del formulario de cotización vive aquí porque la abren dos
  // sitios: el botón flotante del dock y el CTA principal del hero.
  const [isQuoteOpen, setIsQuoteOpen] = useState<boolean>(false);
  // Modelo con el que se abre la hoja de cotización desde el catálogo o la
  // ficha de producto; vacío cuando se abre desde el dock o el hero.
  const [quoteModel, setQuoteModel] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [selectedModelForBooking, setSelectedModelForBooking] = useState<string>("");
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const [activeSection, setActiveSection] = useState<string>("hero-section");
  // Aparte de activeSection (que resalta el ítem del menú): controla solo el
  // estilo del header. El header se funde con el video únicamente en reposo;
  // con la página en movimiento necesita fondo opaco para tapar lo que sube
  // por detrás, o el producto y los botones lo atraviesan.
  const [isAtPageTop, setIsAtPageTop] = useState<boolean>(true);

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
      setIsAtPageTop(false);
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

      // Umbral corto a propósito: en cuanto la página se mueve, el header se
      // vuelve opaco y oculta el contenido que pasa por debajo.
      setIsAtPageTop(window.scrollY < 24);
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

  /** Los CTA de cotización de un modelo abren la hoja de WhatsApp con esa
      unidad ya elegida, en vez de mandar al formulario de visitas. */
  const handleQuoteModel = (modelName: string) => {
    setQuoteModel(modelName);
    setIsQuoteOpen(true);
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

      {/* Siempre fixed: alternar sticky/fixed sacaba y metía el header del
          flujo, la página saltaba su altura al cruzar el umbral y el estado
          oscilaba. Fuera del flujo siempre, solo cambia la apariencia. */}
      <header
        className={`legacy-site-header fixed top-0 left-0 right-0 z-40 px-4 py-3 sm:px-6${
          isAtPageTop && !activeProduct
            ? " legacy-site-header--transparent"
            : " border-b border-[#21466f] bg-[#071e3d] backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => scrollToSection("hero-section")}
            aria-label="Ir al inicio"
            className="legacy-brand-lockup"
          >
            <Logo className="w-[126px] h-9 sm:w-[148px] sm:h-10" variant="inverse" />
            <span className="legacy-brand-divider hidden sm:block" aria-hidden="true" />
            <span className="legacy-partner-logos">
              <img src="/assets/media/images/RE_torito.png" alt="Torito Bajaj" width={246} height={130} decoding="async" loading="lazy" />
              <img src="/assets/media/images/bajaj_favorita.png" alt="Bajaj" width={68} height={74} decoding="async" loading="lazy" />
              <img src="/assets/media/images/bajaj-favorita-en-100-paises.png" alt="Bajaj, favorita en 100 países" width={73} height={53} decoding="async" loading="lazy" />
            </span>
          </button>

          <nav className="legacy-desktop-nav hidden xl:flex" aria-label="Navegación principal">
            {DESKTOP_NAV_ITEMS.map((item) => (
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
              onClick={() => openChat()}
              className="btn-primary hidden rounded-sm px-4 py-2.5 sm:inline-flex xl:hidden"
              id="btn-nav-chat"
            >
              Asesoría de crédito
            </button>
            {/* Releva al de asesoría justo donde ese se oculta (xl): en
                escritorio la acción del topbar es cotizar. */}
            <button
              type="button"
              onClick={() => handleQuoteModel("")}
              className="btn-accent hidden rounded-sm px-4 py-2.5 xl:inline-flex"
              id="btn-nav-quote"
            >
              Cotiza tu Torito
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
                    openChat();
                  }}
                >
                  Evaluar mi crédito
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content: la ficha de producto compensa la altura del header
          fixed; la portada no, porque su hero va debajo del header a propósito. */}
      <main className={activeProduct ? "flex-grow pt-[4.6rem]" : "flex-grow"}>
        {activeProduct ? (
          <Suspense fallback={<div className="min-h-[60svh]" />}>
            <ProductPage
              model={activeProduct}
              onBack={() => scrollToSection("catalog-section")}
              onQuote={handleQuoteModel}
              onViewProduct={handleViewProduct}
            />
          </Suspense>
        ) : (
          <>
        
        {/* HERO SECTION */}
        <Hero onOpenChat={() => openChat()} onOpenQuote={() => setIsQuoteOpen(true)} />

        {/* QUIÉNES SOMOS + RESPALDO — una sola sección de confianza */}
        <AboutUs />

        {/* SELECTOR GUIADO DE MODELO */}
        <ModelFinder
          onSelectModel={handleSelectModelForBooking}
          onViewProduct={handleViewProduct}
        />

        {/* ONLINE CATALOG */}
        <Catalog
          onSelectModelForBooking={handleSelectModelForBooking}
          onQuoteModel={handleQuoteModel}
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
                          decoding="async" />
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
                          decoding="async" />
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

        {/* PREGUNTAS FRECUENTES */}
        <Faq onOpenQuote={() => setIsQuoteOpen(true)} />

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
                width={246}
                height={130}
                decoding="async"
                loading="lazy" />
              <img
                src="/assets/media/images/bajaj_favorita.png"
                alt="Bajaj favorita del Perú"
                className="h-7 w-auto object-contain opacity-90"
                width={176}
                height={74}
                decoding="async"
                loading="lazy" />
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
          <div className="footer-contact md:col-span-4 space-y-3 text-[11px] leading-relaxed" id="footer-contact">
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

      <ContactDock
        isQuoteOpen={isQuoteOpen}
        onQuoteOpenChange={setIsQuoteOpen}
        isChatOpen={isChatOpen}
        onOpenChat={() => openChat()}
        initialModel={quoteModel}
      />

      {/* CHAT ADVISOR CORE INTERACTION */}
      {chatEverOpened && (
        <Suspense fallback={null}>
          <ChatAdvisor
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            onSelectModelForBooking={handleSelectModelForBooking}
          />
        </Suspense>
      )}

    </div>
  );
}
