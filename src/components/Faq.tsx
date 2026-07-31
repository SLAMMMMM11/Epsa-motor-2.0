import { motion } from "motion/react";
import { ChevronDown, MessageSquare } from "lucide-react";
import { CONTACT, FAQS } from "../data";

interface FaqProps {
  onOpenQuote: () => void;
}

/**
 * Preguntas frecuentes.
 *
 * Se usa <details>/<summary> nativo en lugar de un acordeón con estado: el
 * navegador ya resuelve teclado, lectores de pantalla y la búsqueda en página
 * (Ctrl+F encuentra texto dentro de un <details> cerrado y lo abre solo).
 * Un acordeón hecho a mano tendría que reimplementar las tres cosas.
 */
/**
 * Marcado FAQPage para que Google pueda mostrar las preguntas desplegadas en
 * los resultados. Se genera desde FAQS para que no pueda desincronizarse del
 * texto visible, que es justamente lo que Google penaliza.
 *
 * El escape de "<" evita que una respuesta con `</script>` rompa la etiqueta.
 */
const faqJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
}).replace(/</g, "\\u003c");

export default function Faq({ onOpenQuote }: FaqProps) {
  return (
    <section className="epsa-tool-section faq-section py-20" id="faq-section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />

      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="faq-eyebrow"
          >
            Antes de decidir
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="faq-title font-display"
          >
            Preguntas frecuentes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="faq-intro"
          >
            Las dudas que más nos llegan por WhatsApp, respondidas sin rodeos.
          </motion.p>
        </div>

        <div className="faq-list">
          {FAQS.map((item) => (
            <details key={item.question} className="faq-item">
              <summary>
                <span>{item.question}</span>
                <ChevronDown aria-hidden="true" />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>

        <div className="faq-footer">
          <p>¿Tu duda no está aquí?</p>
          <button type="button" className="faq-footer__cta" onClick={onOpenQuote}>
            <MessageSquare aria-hidden="true" />
            Pregúntanos por WhatsApp
          </button>
          <small>
            O llámanos al{" "}
            <a href={`tel:${CONTACT.phoneTel}`}>{CONTACT.phoneDisplay}</a> · {CONTACT.hoursWeek}
          </small>
        </div>
      </div>
    </section>
  );
}
