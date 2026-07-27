import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, ChevronDown, MessageSquare, PhoneCall, ShieldCheck, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { CONTACT, MOTOTAXI_MODELS } from "../data";
import { enviarLead, nuevoLeadId } from "../lib/leads";

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.966-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.173.198-.297.298-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.894 9.894-9.894 2.642 0 5.125 1.03 6.993 2.899a9.825 9.825 0 0 1 2.9 6.993c-.002 5.45-4.436 9.893-9.893 9.893m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.336 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

const LIMA_DISTRICTS = [
  "Ancón",
  "Ate",
  "Barranco",
  "Breña",
  "Carabayllo",
  "Chaclacayo",
  "Chorrillos",
  "Cieneguilla",
  "Comas",
  "El Agustino",
  "Independencia",
  "Jesús María",
  "La Molina",
  "La Victoria",
  "Lima - Cercado",
  "Lince",
  "Los Olivos",
  "Lurigancho - Chosica",
  "Lurín",
  "Magdalena del Mar",
  "Miraflores",
  "Pachacámac",
  "Pucusana",
  "Pueblo Libre",
  "Puente Piedra",
  "Punta Hermosa",
  "Punta Negra",
  "Rímac",
  "San Bartolo",
  "San Borja",
  "San Isidro",
  "San Juan de Lurigancho",
  "San Juan de Miraflores",
  "San Luis",
  "San Martín de Porres",
  "San Miguel",
  "Santa Anita",
  "Santa María del Mar",
  "Santa Rosa",
  "Santiago de Surco",
  "Surquillo",
  "Villa El Salvador",
  "Villa María del Triunfo",
] as const;

const CALLAO_DISTRICTS = [
  "Bellavista",
  "Callao - Cercado",
  "Carmen de la Legua - Reynoso",
  "La Perla",
  "La Punta",
  "Mi Perú",
  "Ventanilla",
] as const;

/** Forma de compra como control segmentado: las 3 opciones visibles de un vistazo. */
const PURCHASE_OPTIONS = [
  { value: "Crédito", label: "Crédito", hint: "Cuota inicial" },
  { value: "Contado", label: "Contado", hint: "Precio total" },
  { value: "Quiero comparar opciones", label: "Aún no lo sé", hint: "Asesórame" },
] as const;

/** Agrupa el celular en bloques de 3 para lectura rápida: 987 654 321 */
const formatPhone = (digits: string) => digits.replace(/(\d{3})(?=\d)/g, "$1 ").trim();

interface QuoteErrors {
  name?: string;
  phone?: string;
  district?: string;
}

interface ContactDockProps {
  isChatOpen: boolean;
  onOpenChat: () => void;
}

export default function ContactDock({ isChatOpen, onOpenChat }: ContactDockProps) {
  const [isOpen, setIsOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    phone: "",
    model: "Torito 250",
    purchaseType: "Crédito",
    district: "",
    notes: "",
  });

  const updateField = <K extends keyof typeof quoteForm>(key: K, value: (typeof quoteForm)[K]) => {
    setQuoteForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  // Escape para cerrar y bloqueo de scroll solo en móvil (donde es bottom sheet).
  useEffect(() => {
    if (!isOpen) return;

    const isMobileSheet = window.matchMedia("(max-width: 639px)").matches;
    const previousOverflow = document.body.style.overflow;
    if (isMobileSheet) document.body.style.overflow = "hidden";

    // El foco entra al panel, no al primer campo: en móvil evita que el
    // teclado se abra de golpe y tape la hoja.
    sheetRef.current?.focus();

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeydown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeydown);
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  const openPanel = () => {
    setSentUrl(null);
    setErrors({});
    setIsOpen(true);
  };

  const closeAndOpenChat = () => {
    setIsOpen(false);
    onOpenChat();
  };

  const handleQuoteSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: QuoteErrors = {};
    if (!quoteForm.name.trim()) nextErrors.name = "Escribe tu nombre.";
    if (quoteForm.phone.length !== 9) nextErrors.phone = "Ingresa los 9 dígitos.";
    if (!quoteForm.district) nextErrors.district = "Elige tu distrito.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    // Abre WhatsApp y registra el lead en paralelo. No usar await antes de
    // esto: rompería el gesto del usuario y el navegador bloquearía la pestaña.
    const whatsappUrl = enviarLead({
      id: nuevoLeadId(),
      tipo: "cotizacion",
      nombre: quoteForm.name.trim(),
      telefono: quoteForm.phone,
      modelo: quoteForm.model,
      forma_compra: quoteForm.purchaseType,
      distrito: quoteForm.district,
      comentario: quoteForm.notes.trim(),
    });

    // Confirmación visible: si el navegador bloquea la pestaña, el enlace sigue a la mano.
    setSentUrl(whatsappUrl);
  };

  return (
    <div className={isOpen ? "contact-dock is-open" : "contact-dock"}>
      <AnimatePresence>
        {isOpen && (
          <motion.button
            key="dock-backdrop"
            type="button"
            className="contact-dock__backdrop"
            aria-label="Cerrar formulario de cotización"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="contact-dock__sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-dock-title"
            ref={sheetRef}
            tabIndex={-1}
          >
            <span className="contact-dock__grabber" aria-hidden="true" />

            <header className="contact-dock__head">
              <span className="contact-dock__avatar" aria-hidden="true">
                <WhatsAppIcon />
                <i className="contact-dock__presence" />
              </span>
              <div className="contact-dock__identity">
                <p className="contact-dock__title" id="contact-dock-title">
                  EPSA Motor · Ventas
                </p>
                <p className="contact-dock__status">En línea · responde en ~5 min</p>
              </div>
              <button
                type="button"
                className="contact-dock__close"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar formulario"
              >
                <X aria-hidden="true" />
              </button>
            </header>

            {sentUrl ? (
              <div className="contact-dock__sent">
                <span className="contact-dock__sent-icon" aria-hidden="true">
                  <CheckCircle2 />
                </span>
                <h3>Te llevamos a WhatsApp</h3>
                <p>
                  Tu mensaje ya está escrito con los datos de <strong>{quoteForm.model || "tu consulta"}</strong>.
                  Solo tienes que pulsar enviar dentro de WhatsApp.
                </p>
                <a
                  className="contact-dock__sent-link"
                  href={sentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon />
                  ¿No se abrió? Ábrelo aquí
                </a>
                <button type="button" className="contact-dock__sent-close" onClick={() => setIsOpen(false)}>
                  Volver a la página
                </button>
              </div>
            ) : (
              <form className="contact-quote-form" onSubmit={handleQuoteSubmit} noValidate>
                <div className="contact-quote-form__body">
                  <p className="contact-quote-form__lead">
                    Cuéntanos qué buscas y te enviamos <strong>precio, cuota inicial y stock</strong> por WhatsApp.
                  </p>

                  <fieldset className="contact-quote-form__segment-group">
                    <legend>Forma de compra</legend>
                    <div className="contact-quote-form__segment" role="group">
                      {PURCHASE_OPTIONS.map((option) => {
                        const isActive = quoteForm.purchaseType === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            className={isActive ? "is-active" : undefined}
                            aria-pressed={isActive}
                            onClick={() => updateField("purchaseType", option.value)}
                          >
                            <strong>{option.label}</strong>
                            <small>{option.hint}</small>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <label className="contact-quote-form__field">
                    <span>Modelo de interés</span>
                    <span className="contact-quote-form__select">
                      <select
                        value={quoteForm.model}
                        onChange={(event) => updateField("model", event.target.value)}
                      >
                        <option value="">Necesito recomendación</option>
                        {MOTOTAXI_MODELS.map((model) => (
                          <option key={model.id} value={model.name}>
                            {model.name} · desde S/ {model.basePrice.toLocaleString("es-PE")}
                          </option>
                        ))}
                      </select>
                      <ChevronDown aria-hidden="true" />
                    </span>
                  </label>

                  <label className="contact-quote-form__field">
                    <span>
                      Nombre completo <b>*</b>
                    </span>
                    <input
                      type="text"
                      autoComplete="name"
                      value={quoteForm.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      placeholder="Ej. Juan Pérez"
                      aria-invalid={Boolean(errors.name)}
                    />
                    {errors.name && <em className="contact-quote-form__error">{errors.name}</em>}
                  </label>

                  <label className="contact-quote-form__field">
                    <span>
                      Celular <b>*</b>
                    </span>
                    <span className="contact-quote-form__phone" data-invalid={Boolean(errors.phone)}>
                      <i aria-hidden="true">+51</i>
                      <input
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        value={formatPhone(quoteForm.phone)}
                        onChange={(event) =>
                          updateField("phone", event.target.value.replace(/\D/g, "").slice(0, 9))
                        }
                        placeholder="987 654 321"
                        aria-invalid={Boolean(errors.phone)}
                      />
                    </span>
                    {errors.phone && <em className="contact-quote-form__error">{errors.phone}</em>}
                  </label>

                  <label className="contact-quote-form__field">
                    <span>
                      Distrito <b>*</b>
                    </span>
                    <span className="contact-quote-form__select">
                      <select
                        value={quoteForm.district}
                        onChange={(event) => updateField("district", event.target.value)}
                        aria-invalid={Boolean(errors.district)}
                      >
                        <option value="">Selecciona tu distrito</option>
                        <optgroup label="Lima Metropolitana">
                          {LIMA_DISTRICTS.map((district) => (
                            <option key={district} value={district}>
                              {district}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Callao">
                          {CALLAO_DISTRICTS.map((district) => (
                            <option key={district} value={district}>
                              {district}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                      <ChevronDown aria-hidden="true" />
                    </span>
                    {errors.district && <em className="contact-quote-form__error">{errors.district}</em>}
                  </label>

                  <label className="contact-quote-form__field">
                    <span>
                      Comentario <i>opcional</i>
                    </span>
                    <textarea
                      rows={2}
                      value={quoteForm.notes}
                      onChange={(event) => updateField("notes", event.target.value)}
                      placeholder="Ej. lo necesito para trabajar en ruta corta"
                    />
                  </label>

                  <div className="contact-dock__alternatives">
                    <a href={`tel:${CONTACT.phoneTel}`}>
                      <PhoneCall aria-hidden="true" />
                      Llamar a ventas
                    </a>
                    <button type="button" onClick={closeAndOpenChat}>
                      <MessageSquare aria-hidden="true" />
                      Asesor digital
                    </button>
                  </div>
                </div>

                <footer className="contact-quote-form__footer">
                  <button type="submit" className="contact-quote-form__submit">
                    <WhatsAppIcon />
                    Continuar en WhatsApp
                  </button>
                  <p className="contact-quote-form__privacy">
                    <ShieldCheck aria-hidden="true" />
                    No almacenamos tus datos. Verás el mensaje antes de enviarlo.
                  </p>
                </footer>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={triggerRef}
        type="button"
        whileTap={{ scale: 0.96 }}
        className="contact-dock__trigger"
        onClick={() => (isOpen ? setIsOpen(false) : openPanel())}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Cerrar formulario de cotización" : "Cotizar por WhatsApp"}
      >
        {isOpen ? <X aria-hidden="true" /> : <WhatsAppIcon />}
        <span className="contact-dock__copy">
          <strong>{isOpen ? "Cerrar formulario" : "WhatsApp"}</strong>
          <small>{isOpen ? "Volver a la página" : "Cotiza tu Torito ahora"}</small>
        </span>
      </motion.button>

      {isChatOpen && <span className="sr-only">El asesor digital está abierto</span>}
    </div>
  );
}
