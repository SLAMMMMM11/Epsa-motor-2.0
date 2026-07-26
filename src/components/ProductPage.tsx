import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleGauge,
  Fuel,
  Gauge,
  MessageCircle,
  Pause,
  Play,
  Settings2,
} from "lucide-react";
import type { MototaxiModel } from "../types";
import { CONTACT, formatPrice, MOTOTAXI_MODELS } from "../data";
import { PRODUCT_SPIN_FRAMES } from "../productMedia";

interface ProductPageProps {
  model: MototaxiModel;
  onBack: () => void;
  onQuote: (modelName: string) => void;
  onViewProduct: (modelId: string) => void;
}

function findSpec(model: MototaxiModel, label: string) {
  return model.specs.find((spec) => spec.label.toLowerCase().includes(label.toLowerCase()))?.value;
}

export default function ProductPage({ model, onBack, onQuote, onViewProduct }: ProductPageProps) {
  const frames = useMemo(
    () => PRODUCT_SPIN_FRAMES[model.id] ?? [model.imageUrl],
    [model.id, model.imageUrl],
  );
  const [frameIndex, setFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(frames.length > 1);
  const hasSpin = frames.length > 1;
  const relatedModels = MOTOTAXI_MODELS.filter((item) => item.id !== model.id).slice(0, 3);
  const displacement = hasSpin ? Math.round((frameIndex / (frames.length - 1)) * 100) : 100;
  const whatsappUrl = `https://wa.me/${CONTACT.phoneTel.replace(/\D/g, "")}?text=${encodeURIComponent(
    `Hola EPSA Motor, deseo cotizar el ${model.name} y conocer las opciones de financiamiento.`,
  )}`;

  useEffect(() => {
    setFrameIndex(0);
    setIsPlaying(frames.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    document.title = `${model.name} | EPSA Motor`;
    frames.forEach((frame) => {
      const image = new Image();
      image.src = frame;
    });

    return () => {
      document.title = "EPSA Motor Bajaj - Concesionario Autorizado";
    };
  }, [frames, model.name]);

  useEffect(() => {
    if (!isPlaying || !hasSpin) return;
    const interval = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % frames.length);
    }, 680);

    return () => window.clearInterval(interval);
  }, [frames.length, hasSpin, isPlaying]);

  return (
    <div className="product-page">
      <section className="product-hero">
        <div className="product-hero__glow" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-6 py-10 lg:py-16 relative z-10">
          <button type="button" className="product-back" onClick={onBack}>
            <ArrowLeft aria-hidden="true" /> Todos los modelos
          </button>

          <div className="product-hero__grid">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              className="product-hero__copy"
            >
              <span className="product-kicker">Ficha completa del modelo</span>
              <h1>{model.name}</h1>
              <p className="product-tagline">{model.tagline}</p>
              <p className="product-description">{model.description}</p>

              <div className="product-fuel-list" aria-label="Combustibles disponibles">
                {model.fuelTypes.map((fuel) => (
                  <span key={fuel}><Fuel aria-hidden="true" /> {fuel}</span>
                ))}
              </div>

              <div className="product-price">
                <small>Precio referencial desde</small>
                <strong>{formatPrice(model.basePrice)}</strong>
                <span>Versión con lona · sujeto a stock y cotización final</span>
              </div>

              <div className="product-hero__actions">
                <button type="button" className="btn-primary" onClick={() => onQuote(model.name)}>
                  Solicitar cotización <ArrowRight aria-hidden="true" />
                </button>
                <a className="btn-secondary" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle aria-hidden="true" /> Consultar por WhatsApp
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="product-spin"
            >
              <div className="product-spin__header">
                <div>
                  <span>{hasSpin ? "Giro automático 360°" : "Vista referencial"}</span>
                  <strong>{hasSpin ? "Míralo desde todos sus ángulos" : "Conoce el diseño del modelo"}</strong>
                </div>
                {hasSpin && (
                  <button
                    type="button"
                    onClick={() => setIsPlaying((current) => !current)}
                    aria-label={isPlaying ? "Pausar giro automático" : "Reproducir giro automático"}
                  >
                    {isPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
                    {isPlaying ? "Pausar" : "Reproducir"}
                  </button>
                )}
              </div>

              <div className="product-spin__stage">
                <img
                  src={frames[frameIndex]}
                  alt={`${model.name}, vista ${frameIndex + 1} de ${frames.length}`}
                />
                <span className="product-spin__shadow" aria-hidden="true" />
              </div>

              {hasSpin && (
                <div className="product-spin__progress">
                  <div><span style={{ width: `${displacement}%` }} /></div>
                  <small>Vista {frameIndex + 1} de {frames.length} · reproducción automática</small>
                </div>
              )}
              <p className="product-spin__note">Fotos referenciales del producto.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="product-summary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="product-summary__grid">
            <article><Settings2 aria-hidden="true" /><span>Motor</span><strong>{model.engine}</strong></article>
            <article><CircleGauge aria-hidden="true" /><span>Cilindrada</span><strong>{findSpec(model, "cilindrada") ?? "Consultar"}</strong></article>
            <article><Gauge aria-hidden="true" /><span>Potencia</span><strong>{model.power}</strong></article>
            <article><Fuel aria-hidden="true" /><span>Capacidad</span><strong>{model.capacity}</strong></article>
          </div>
        </div>
      </section>

      <section className="product-details">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="product-section-heading">
            <span className="product-kicker">Todo lo que necesitas saber</span>
            <h2>Rendimiento y equipamiento</h2>
            <p>Información clave para comparar el modelo y decidir si encaja con tu ruta o negocio.</p>
          </div>

          <div className="product-details__grid">
            <div className="product-highlights">
              {model.highlights.map((highlight, index) => (
                <article key={highlight}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <Check aria-hidden="true" />
                  <h3>{highlight}</h3>
                </article>
              ))}
            </div>

            <div className="product-specs">
              <div className="product-specs__title">
                <span>Especificaciones técnicas</span>
                <strong>{model.name}</strong>
              </div>
              <dl>
                {model.specs.map((spec) => (
                  <div key={spec.label}>
                    <dt>{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
                {model.payload && <div><dt>Carga útil</dt><dd>{model.payload}</dd></div>}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="product-cta">
        <div className="max-w-7xl mx-auto px-6">
          <div className="product-cta__panel">
            <div>
              <span>Asesoría EPSA Motor</span>
              <h2>¿Este Torito encaja con tu negocio?</h2>
              <p>Confirma stock, precio final y alternativas de financiamiento con un asesor.</p>
            </div>
            <button type="button" className="btn-primary" onClick={() => onQuote(model.name)}>
              Cotizar {model.name} <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <section className="product-related">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="product-section-heading product-section-heading--row">
            <div><span className="product-kicker">También puedes comparar</span><h2>Otros modelos Torito</h2></div>
            <button type="button" className="product-back" onClick={onBack}>Ver catálogo completo <ArrowRight aria-hidden="true" /></button>
          </div>
          <div className="product-related__grid">
            {relatedModels.map((item) => (
              <button type="button" key={item.id} onClick={() => onViewProduct(item.id)}>
                <img src={item.imageUrl} alt={item.name} loading="lazy" />
                <span>{item.fuelTypes.join(" · ")}</span>
                <strong>{item.name}</strong>
                <small>Desde {formatPrice(item.basePrice)}</small>
                <ArrowRight aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
