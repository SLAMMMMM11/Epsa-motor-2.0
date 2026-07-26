import { motion } from "motion/react";
import { CheckCircle2, MapPinned, ShieldCheck } from "lucide-react";
import { CONTACT } from "../data";

const TRUST_POINTS = [
  {
    title: "Respaldo comercial",
    metric: "+20 años",
    metricLabel: "en el mercado",
    text: "Experiencia acompañando la compra y el financiamiento de tu herramienta de trabajo.",
    image: "/assets/media/images/nosotros-respaldo-comercial.png",
    alt: "Respaldo comercial de EPSA Motor",
    icon: ShieldCheck,
  },
  {
    title: "Atención cercana",
    metric: "3 sedes",
    metricLabel: "autorizadas",
    text: "Atención presencial en Comas, Ventanilla y Puente Piedra.",
    image: "/assets/media/images/nosotros-atencion-humana.png",
    alt: "Atención cercana de EPSA Motor",
    icon: CheckCircle2,
  },
  {
    title: "Presencia local",
    metric: CONTACT.ruc,
    metricLabel: "RUC EPSA Motor",
    text: "Empresa formal y distribuidor autorizado de Torito Bajaj.",
    image: "/assets/media/images/nosotros-atencion-comercial.png",
    alt: "Atención comercial de EPSA Motor",
    icon: MapPinned,
  },
] as const;

export default function AboutUs() {
  return (
    <section className="trust-section border-b" id="about-section">
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="trust-unified-panel"
        >
          <div className="trust-unified-header">
            <div className="trust-story-heading">
              <span className="trust-kicker">Confianza que se demuestra</span>
              <h2>Tu socio en movilidad de trabajo</h2>
            </div>
            <div className="trust-unified-intro">
              <p>
                Respaldo formal, atención humana y presencia local para elegir, cotizar y financiar tu Torito
                Bajaj con información clara.
              </p>
              <div className="trust-brands">
                <span><CheckCircle2 aria-hidden="true" /> Distribuidor autorizado Torito Bajaj</span>
                <div>
                  <img src="/assets/media/images/RE_torito.png" alt="Torito Bajaj" loading="lazy" />
                  <img src="/assets/media/images/bajaj_favorita.png" alt="Bajaj favorita del Perú" loading="lazy" />
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-70px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            className="trust-point-grid"
          >
            {TRUST_POINTS.map(({ title, metric, metricLabel, text, image, alt, icon: Icon }) => (
              <motion.article
                key={title}
                variants={{
                  hidden: { opacity: 0, y: 22 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.42 } },
                }}
              >
                <div className="trust-point-media">
                  <img src={image} alt={alt} loading="lazy" />
                  <div className="trust-point-metric">
                    <strong>{metric}</strong>
                    <span>{metricLabel}</span>
                  </div>
                  <span className="trust-point-icon"><Icon aria-hidden="true" /></span>
                </div>
                <div className="trust-point-copy">
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
