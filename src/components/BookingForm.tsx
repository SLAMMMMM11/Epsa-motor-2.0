import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, CalendarDays, Check, CheckCircle2, Clock3, PhoneCall } from "lucide-react";
import { motion } from "motion/react";
import { BRANCHES, CONTACT, MOTOTAXI_MODELS } from "../data";
import { enviarLead, nuevoLeadId } from "../lib/leads";
import { referenciaCorta } from "../../shared/leads";

interface BookingFormProps {
  preselectedModel?: string;
  onClearPreselectedModel?: () => void;
}

interface BookingConfirmation {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  branch: string;
  serviceType: string;
}

const VISIT_OPTIONS = [
  {
    value: "Prueba de Manejo",
    title: "Prueba de manejo",
    image: "/assets/media/images/finder-pasajeros.webp",
  },
  {
    value: "Consulta de Compra",
    title: "Visita y cotización",
    image: "/assets/media/images/benefit-asesoria-whatsapp.webp",
  },
  {
    value: "Consulta Financiera",
    title: "Crédito directo",
    image: "/assets/media/images/benefit-credito-directo.webp",
  },
] as const;

export default function BookingForm({ preselectedModel, onClearPreselectedModel }: BookingFormProps) {
  const minimumVisitDate = new Date().toLocaleDateString("en-CA");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [branch, setBranch] = useState("Puente Piedra");
  const [serviceType, setServiceType] = useState("Prueba de Manejo");
  const [modelInterest, setModelInterest] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [createdBooking, setCreatedBooking] = useState<BookingConfirmation | null>(null);

  useEffect(() => {
    if (preselectedModel) {
      setModelInterest(preselectedModel);
      setServiceType("Prueba de Manejo");
      setSuccess(false);
    }
  }, [preselectedModel]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!name.trim() || !phone.trim() || !date || !time || !branch || !serviceType) {
      setError("Completa los campos obligatorios para reservar.");
      return;
    }

    setError("");

    const id = nuevoLeadId();

    // Sin await antes de esto: el navegador solo permite abrir la pestaña de
    // WhatsApp dentro del gesto del clic. El registro va en paralelo.
    enviarLead({
      id,
      tipo: "cita",
      nombre: name.trim(),
      telefono: phone,
      sede: branch,
      fecha: date,
      hora: time,
      motivo: serviceType,
      modelo: modelInterest || undefined,
    });

    setCreatedBooking({ id, name: name.trim(), phone, date, time, branch, serviceType });
    setSuccess(true);
    setName("");
    setPhone("");
    setDate("");
    setTime("");
    setModelInterest("");
    onClearPreselectedModel?.();
  };

  return (
    <section className="epsa-tool-section booking-section" id="booking-section">
      <div className="booking-shell">
        <header className="booking-heading">
          <div>
            <span>Atención rápida</span>
            <h2>Agenda tu visita</h2>
          </div>
          <p>Elige qué necesitas y reserva en menos de un minuto.</p>
        </header>

        <div className="booking-layout">
          <aside className="booking-showcase">
            <img
              className="booking-showcase__vehicle"
              src="/assets/media/images/finder-pasajeros.webp"
              alt="Mototaxi Torito circulando con pasajeros"
            />
            <div className="booking-showcase__shade" />
            <div className="booking-showcase__copy">
              <small>Visita EPSA Motor</small>
              <h3>Conoce tu próximo Torito antes de decidir.</h3>
              <a href={`tel:${CONTACT.phoneTel}`}>
                <PhoneCall aria-hidden="true" />
                {CONTACT.phoneDisplay}
              </a>
            </div>
            <img
              className="booking-showcase__advisor"
              src="/assets/media/images/contacto-chico.png"
              alt="Asesor de EPSA Motor"
            />
          </aside>

          <div className="booking-form-panel finance-form-panel">
            {success && createdBooking ? (
              <motion.div
                className="booking-success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="booking-success__icon">
                  <CheckCircle2 aria-hidden="true" />
                </span>
                <small>Cita enviada</small>
                <h3>¡Te esperamos, {createdBooking.name}!</h3>
                <p>
                  {createdBooking.serviceType} · Sede {createdBooking.branch}
                </p>
                <dl>
                  <div>
                    <dt>Fecha</dt>
                    <dd>{createdBooking.date}</dd>
                  </div>
                  <div>
                    <dt>Hora</dt>
                    <dd>{createdBooking.time}</dd>
                  </div>
                  <div>
                    <dt>Código</dt>
                    <dd>{referenciaCorta(createdBooking.id)}</dd>
                  </div>
                </dl>
                <p className="booking-success__note">
                  Abrimos WhatsApp con los datos de tu cita. Envía el mensaje y un asesor te la
                  confirmará al {createdBooking.phone}.
                </p>
                <button type="button" className="btn-primary" onClick={() => setSuccess(false)}>
                  Agendar otra visita
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <fieldset className="booking-reasons">
                  <legend>¿Qué deseas hacer?</legend>
                  <div>
                    {VISIT_OPTIONS.map((option) => {
                      const isActive = serviceType === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          className={isActive ? "booking-reason is-active" : "booking-reason"}
                          aria-pressed={isActive}
                          onClick={() => {
                            setServiceType(option.value);
                            setError("");
                          }}
                        >
                          <span className="booking-reason__image">
                            <img src={option.image} alt="" />
                            {isActive && (
                              <span className="booking-reason__check">
                                <Check aria-hidden="true" />
                              </span>
                            )}
                          </span>
                          <strong>{option.title}</strong>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                {error && <div className="booking-error">{error}</div>}

                <div className="booking-fields">
                  <label>
                    <span>Nombre completo *</span>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Ej. Juan Pérez"
                    />
                  </label>

                  <label>
                    <span>Celular *</span>
                    <input
                      type="tel"
                      required
                      inputMode="numeric"
                      pattern="[0-9]{9}"
                      maxLength={9}
                      value={phone}
                      onChange={(event) => setPhone(event.target.value.replace(/\D/g, ""))}
                      placeholder="987 654 321"
                    />
                  </label>

                  <label>
                    <span>Sede *</span>
                    <select value={branch} onChange={(event) => setBranch(event.target.value)}>
                      {BRANCHES.map((item) => (
                        <option key={item.name} value={item.name}>
                          Sede {item.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span>Modelo de interés</span>
                    <select value={modelInterest} onChange={(event) => setModelInterest(event.target.value)}>
                      <option value="">Aún no lo sé</option>
                      {MOTOTAXI_MODELS.map((model) => (
                        <option key={model.id} value={model.name}>
                          {model.name} · {model.fuelTypes.join(" / ")}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span>
                      <CalendarDays aria-hidden="true" />
                      Fecha *
                    </span>
                    <input
                      type="date"
                      required
                      min={minimumVisitDate}
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                    />
                  </label>

                  <label>
                    <span>
                      <Clock3 aria-hidden="true" />
                      Hora *
                    </span>
                    <select required value={time} onChange={(event) => setTime(event.target.value)}>
                      <option value="">Elige una hora</option>
                      <option value="08:30 AM">08:30 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="01:00 PM">01:00 PM</option>
                      <option value="02:30 PM">02:30 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="05:30 PM">05:30 PM</option>
                    </select>
                  </label>
                </div>

                <button type="submit" className="booking-submit btn-primary">
                  Agendar por WhatsApp
                  <ArrowRight aria-hidden="true" />
                </button>
                <p className="booking-form-note">
                  Se abrirá WhatsApp con tu cita ya redactada. Un asesor la confirma.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
