import { motion } from "motion/react";
import { CONTACT } from "../data";

const PILLARS = [
  {
    title: "Respaldo comercial",
    text: "Más de 20 años en el mercado acompañando a emprendedores del cono norte y Callao. Compra con un equipo que conoce el negocio del Torito Bajaj.",
    image: "/assets/media/images/nosotros-respaldo-comercial.png",
    alt: "Respaldo comercial de EPSA Motor",
  },
  {
    title: "Atención humana",
    text: "Te escuchamos, resolvemos dudas sin presión y te guiamos paso a paso: modelo, precio y financiamiento según tu realidad.",
    image: "/assets/media/images/nosotros-atencion-humana.png",
    alt: "Atención humana de EPSA Motor",
  },
  {
    title: "Atención comercial",
    text: "Cotiza en sede, prueba de manejo y evaluación de crédito. Tres puntos de venta listos para atenderte de forma clara y rápida.",
    image: "/assets/media/images/nosotros-atencion-comercial.png",
    alt: "Atención comercial de EPSA Motor",
  },
] as const;

export default function AboutUs() {
  return (
    <section
      className="py-20 bg-[#060a13] border-b border-[#1e2e4a] relative overflow-hidden"
      id="about-section"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-end mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <span className="text-[#60a5fa] text-xs font-bold uppercase tracking-widest block mb-2">
              Quiénes somos
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight leading-tight">
              EPSA Motor: tu socio en movilidad de trabajo
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 text-zinc-400 text-sm leading-relaxed font-sans"
          >
            Concesionario de Torito Bajaj con{" "}
            <strong className="text-white font-medium">{CONTACT.yearsInMarketLabel}</strong>.
            Nos enfocamos en venta y financiamiento en Comas, Ventanilla y Puente Piedra — RUC{" "}
            {CONTACT.ruc}.
          </motion.p>
        </div>

        {/* Tres pilares visuales */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {PILLARS.map((pillar) => (
            <motion.article
              key={pillar.title}
              variants={{
                hidden: { opacity: 0, y: 28 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring", stiffness: 90, damping: 16 },
                },
              }}
              className="group relative rounded-sm overflow-hidden border border-[#1e2e4a] bg-[#131c2e] hover:border-[#3b82f6] transition-all duration-500 shadow-lg hover:shadow-[0_0_28px_rgba(37,99,235,0.15)]"
            >
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <img
                  src={pillar.image}
                  alt={pillar.alt}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060a13] via-[#060a13]/40 to-transparent" />
              </div>
              <div className="p-5 sm:p-6 space-y-2 relative -mt-8">
                <h3 className="text-lg font-display font-bold text-white tracking-wide uppercase">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                  {pillar.text}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Marcas oficiales */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 py-7 px-6 rounded-sm border border-[#1e2e4a] bg-[#131c2e]/60"
        >
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest w-full sm:w-auto text-center">
            Marcas que representamos
          </p>
          <img
            src="/assets/media/images/RE_torito.png"
            alt="Torito Bajaj RE"
            className="h-11 sm:h-12 w-auto object-contain"
            loading="lazy"
          />
          <img
            src="/assets/media/images/bajaj_favorita.png"
            alt="Bajaj favorita del Perú"
            className="h-11 sm:h-12 w-auto object-contain"
            loading="lazy"
          />
        </motion.div>

        {/* Banda con modelos 2T (fotos del sitio oficial) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="flex items-center gap-5 bg-[#131c2e]/90 border border-[#1e2e4a] rounded-sm p-5 hover:border-[#3b82f6]/50 transition-colors">
            <img
              src="/assets/media/images/torito-pe/2t-ug-gsl.png"
              alt="Torito 2T UG GSL"
              className="w-28 h-24 sm:w-36 sm:h-28 object-contain shrink-0"
              loading="lazy"
            />
            <div>
              <p className="text-[10px] text-[#60a5fa] font-bold uppercase tracking-widest">
                Entrada accesible
              </p>
              <h4 className="text-base font-display font-bold text-white mt-0.5">
                2T UG GSL
              </h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Desde S/ 12,199. Gasolina, Autolube Bajaj y el mejor precio para empezar.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 bg-[#131c2e]/90 border border-[#1e2e4a] rounded-sm p-5 hover:border-[#3b82f6]/50 transition-colors">
            <img
              src="/assets/media/images/torito-pe/2t-ug-glp.png"
              alt="Torito 2T UG GLP"
              className="w-28 h-24 sm:w-36 sm:h-28 object-contain shrink-0"
              loading="lazy"
            />
            <div>
              <p className="text-[10px] text-[#60a5fa] font-bold uppercase tracking-widest">
                Ahorro en combustible
              </p>
              <h4 className="text-base font-display font-bold text-white mt-0.5">
                2T UG GLP
              </h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Desde S/ 14,199. GLP para menor costo diario en ciudad.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
