import { useEffect, useState } from "react";
import { motion } from "motion/react";
import WhatsAppIcon from "./WhatsAppIcon";

interface HeroProps {
  onOpenChat: () => void;
  onOpenQuote: () => void;
}

/**
 * Hero.
 *
 * Lectura de arriba abajo: quiénes somos, qué vendemos, por qué es accesible,
 * el producto, la acción, y la tranquilidad. Cada bloque responde una duda
 * concreta del comprador y no hay ninguno decorativo.
 */
export default function Hero({ onOpenChat, onOpenQuote }: HeroProps) {
  /** Quien pide menos movimiento no debería recibir un video en bucle. */
  const [allowVideo, setAllowVideo] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAllowVideo(!query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return (
    <div
      className="hero-home-section relative bg-[#071e3d] text-white border-b border-[#21466f] overflow-hidden"
      id="hero-section"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {allowVideo && (
          <video
            className="hero-background-video absolute inset-0 h-full w-full object-cover object-center"
            autoPlay
            loop
            muted
            playsInline
            preload="none"
          >
            <source src="/assets/media/video/Background_animation.mp4" type="video/mp4" />
          </video>
        )}
        {/* Oscurecimiento uniforme: garantiza el contraste del texto pase lo que
            pase en el video, y hace de fondo si este no se reproduce. */}
        <div className="hero-scrim" />
      </div>

      <div className="hero-stage">
        {/* Tres bloques: copy (título y subtítulo) y actions (los CTA) a los
            costados, media (marca + unidad) siempre al centro — el logo se
            superpone sobre el vehículo en vez de ir apilado encima. En el
            resto de anchos se apilan en el orden natural de lectura (ver
            .hero-stage en el CSS). */}
        <div className="hero-stage__copy">
          {/* La frase va primero: es lo que tiene que engancharse antes de la
              marca y del producto. Vende rendimiento, no financiamiento. */}
          <motion.h1
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="hero-stage__headline font-display"
          >
            Rinde más{" "}
            <motion.em
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              Gasta menos
            </motion.em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="hero-stage__lead"
          >
            Conoce al nuevo Torito 250
          </motion.p>
        </div>

        <div className="hero-stage__media">
          {/* Halo detrás de la unidad: sin él, el producto flota en el vacío
              del video sin nada que lo ancle al centro de la composición. */}
          <div className="hero-stage__glow" aria-hidden="true" />

          <motion.img
            initial={{ opacity: 0, y: -18, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="hero-stage__logo"
            src="/assets/media/images/torito-250-logo.webp"
            alt=""
            width={1000}
            height={177}
            fetchPriority="high"
            decoding="async"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.72, ease: [0.16, 1, 0.3, 1] }}
            className="hero-stage__unit-wrap"
          >
            <img
              className="hero-stage__unit"
              src="/assets/media/images/torito-pe/crom-plus-gnv-derecha.webp"
              alt="Mototaxi Torito CROM PLUS GNV visto desde el lado derecho"
              width={700}
              height={615}
              decoding="async"
            />
            {/* Sombra de piso: separa la unidad del halo y le da apoyo, en
                vez de dejarla suspendida sobre el degradado. */}
            <div className="hero-stage__ground" aria-hidden="true" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="hero-stage__actions"
        >
          <button
            type="button"
            onClick={onOpenChat}
            className="hero-cta-primary"
            id="btn-hero-credito"
          >
            Evaluar mi crédito en 1 minuto
          </button>
          <button
            type="button"
            onClick={onOpenQuote}
            className="hero-cta-whatsapp"
            id="btn-hero-quote"
          >
            <WhatsAppIcon />
            Cotizar por WhatsApp
          </button>
        </motion.div>
      </div>
    </div>
  );
}
