import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  RefreshCw,
} from "lucide-react";
import { formatPrice, MOTOTAXI_MODELS } from "../data";
import type { MototaxiModel } from "../types";

type UseCase = "pasajeros" | "carga" | "mixto";
type Priority = "inversion" | "ahorro" | "potencia";
type FuelPreference = "cualquiera" | "Gasolina" | "GLP" | "GNV";

interface ModelFinderProps {
  onSelectModel: (modelName: string) => void;
  onViewProduct: (modelId: string) => void;
}

const USE_OPTIONS = [
  {
    value: "pasajeros" as const,
    title: "Transportar pasajeros",
    image: "/assets/media/images/finder-pasajeros.webp",
  },
  {
    value: "carga" as const,
    title: "Carga y reparto",
    image: "/assets/media/images/finder-carga-reparto.webp",
  },
  {
    value: "mixto" as const,
    title: "Pasajeros y carga",
    image: "/assets/media/images/finder-uso-mixto.webp",
  },
];

const PRIORITY_OPTIONS = [
  {
    value: "inversion" as const,
    title: "Menor inversión inicial",
    image: "/assets/media/images/finder-prioridad-inversion.webp",
  },
  {
    value: "ahorro" as const,
    title: "Ahorrar en combustible",
    image: "/assets/media/images/finder-prioridad-ahorro.webp",
  },
  {
    value: "potencia" as const,
    title: "Potencia y exigencia",
    image: "/assets/media/images/finder-prioridad-potencia.webp",
  },
];

const FUEL_OPTIONS = [
  {
    value: "cualquiera" as const,
    title: "Quiero orientación",
    image: "/assets/media/images/finder-combustible-orientacion-v2.webp",
  },
  {
    value: "Gasolina" as const,
    title: "Gasolina",
    image: "/assets/media/images/finder-combustible-gasolina.webp",
  },
  {
    value: "GLP" as const,
    title: "GLP",
    image: "/assets/media/images/finder-combustible-glp-v2.webp",
  },
  {
    value: "GNV" as const,
    title: "GNV",
    image: "/assets/media/images/finder-combustible-gnv.webp",
  },
];

interface FinderVisualOptionProps {
  key?: string;
  title: string;
  image: string;
  onClick: () => void;
}

function FinderVisualOption({ title, image, onClick }: FinderVisualOptionProps) {
  return (
    <button type="button" className="model-finder-visual-card" onClick={onClick}>
      <span className="model-finder-visual-card__media" aria-hidden="true">
        <img src={image} alt="" decoding="async" loading="lazy" />
      </span>
      <span className="model-finder-visual-card__label">
        <strong>{title}</strong>
        <ArrowRight className="model-finder-option__arrow" aria-hidden="true" />
      </span>
    </button>
  );
}

function modelScore(model: MototaxiModel, useCase: UseCase, priority: Priority) {
  let score = model.destacado ? 0.25 : 0;

  if (useCase === "pasajeros") score += model.category === "pasajeros" ? 5 : 1;
  if (useCase === "carga") score += model.category === "carga" ? 5 : 0;
  if (useCase === "carga" && model.payload) score += 2;
  if (useCase === "mixto") {
    score += model.category === "carga" ? 4 : 2;
    if (model.id === "torito-250") score += 2;
  }

  if (priority === "inversion") {
    score += Math.max(0, (19000 - model.basePrice) / 1700);
  }

  if (priority === "ahorro") {
    if (model.fuelTypes.includes("GNV")) score += 5;
    if (model.fuelTypes.includes("GLP")) score += 4;
    if (model.id === "2t-ug-glp") score += 1;
  }

  if (priority === "potencia") {
    score += Number.parseFloat(model.power) / 2;
    if (model.engine.toLowerCase().includes("4 tiempos")) score += 2;
  }

  return score;
}

function recommendationReason(
  model: MototaxiModel,
  useCase: UseCase,
  priority: Priority,
  fuel: FuelPreference,
) {
  const reasons: string[] = [];

  if (useCase === "carga" && model.payload) reasons.push(`capacidad útil de ${model.payload}`);
  else if (useCase === "mixto" && model.category === "carga") reasons.push("versatilidad para carga y pasajeros");
  else reasons.push("configuración adecuada para trabajo urbano");

  if (priority === "inversion") reasons.push("precio de entrada competitivo");
  if (priority === "ahorro") reasons.push(`operación disponible con ${model.fuelTypes.join(" y ")}`);
  if (priority === "potencia") reasons.push(`${model.power} de potencia declarada`);
  if (fuel !== "cualquiera" && model.fuelTypes.includes(fuel)) reasons.push(`${fuel} disponible de fábrica`);

  return reasons.slice(0, 2).join(" y ");
}

export default function ModelFinder({ onSelectModel, onViewProduct }: ModelFinderProps) {
  const [step, setStep] = useState(0);
  const [useCase, setUseCase] = useState<UseCase | null>(null);
  const [priority, setPriority] = useState<Priority | null>(null);
  const [fuel, setFuel] = useState<FuelPreference | null>(null);

  const recommendations = useMemo(() => {
    if (!useCase || !priority || !fuel) return [];

    const candidates =
      fuel === "cualquiera"
        ? MOTOTAXI_MODELS
        : MOTOTAXI_MODELS.filter((model) => model.fuelTypes.includes(fuel));

    return [...candidates]
      .sort((a, b) => modelScore(b, useCase, priority) - modelScore(a, useCase, priority))
      .slice(0, 2);
  }, [fuel, priority, useCase]);

  const resetFinder = () => {
    setStep(0);
    setUseCase(null);
    setPriority(null);
    setFuel(null);
  };

  const chooseUseCase = (value: UseCase) => {
    setUseCase(value);
    setStep(1);
  };

  const choosePriority = (value: Priority) => {
    setPriority(value);
    setStep(2);
  };

  const chooseFuel = (value: FuelPreference) => {
    setFuel(value);
    setStep(3);
  };

  const goBack = () => {
    setStep((current) => Math.max(0, current - 1));
  };

  return (
    <section className="model-finder-section border-b" id="finder-section">
      <div className="model-finder-accent" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-24 relative z-10">
        <div className="model-finder-shell">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="model-finder-intro"
          >
            <span className="model-finder-kicker">Asesor digital de compra</span>
            <h2>Elige tu Torito en 3 pasos</h2>
            <p>
              Indícanos cómo trabajarás y te recomendaremos dos modelos.
            </p>

            <div className="model-finder-assurance">
              <Check aria-hidden="true" />
              <div>
                <strong>Sin registro</strong>
                <span>Solo tres respuestas.</span>
              </div>
            </div>

            <div className="model-finder-route" aria-label="Progreso del selector">
              {["Uso", "Prioridad", "Combustible"].map((label, index) => (
                <div key={label} className={index <= Math.min(step, 2) ? "is-active" : ""}>
                  <span>{index + 1}</span>
                  <small>{label}</small>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.08 }}
            className="model-finder-panel"
          >
            {step < 3 && (
              <>
                <div className="model-finder-panel__header">
                  <div>
                    <span>Paso {step + 1} de 3</span>
                    <h3>
                      {step === 0 && "¿Para qué usarás principalmente tu Torito?"}
                      {step === 1 && "¿Qué es lo más importante para ti?"}
                      {step === 2 && "¿Qué combustible tienes disponible?"}
                    </h3>
                  </div>
                  {step > 0 && (
                    <button type="button" onClick={goBack} className="model-finder-back">
                      <ArrowLeft aria-hidden="true" /> Volver
                    </button>
                  )}
                </div>

                <div
                  className={`model-finder-options model-finder-options--visual ${step === 2 ? "model-finder-options--fuel" : ""}`}
                >
                  {step === 0 &&
                    USE_OPTIONS.map(({ value, title, image }) => (
                      <FinderVisualOption
                        key={value}
                        title={title}
                        image={image}
                        onClick={() => chooseUseCase(value)}
                      />
                    ))}

                  {step === 1 &&
                    PRIORITY_OPTIONS.map(({ value, title, image }) => (
                      <FinderVisualOption
                        key={value}
                        title={title}
                        image={image}
                        onClick={() => choosePriority(value)}
                      />
                    ))}

                  {step === 2 &&
                    FUEL_OPTIONS.map(({ value, title, image }) => (
                      <FinderVisualOption
                        key={value}
                        title={title}
                        image={image}
                        onClick={() => chooseFuel(value)}
                      />
                    ))}
                </div>
              </>
            )}

            {step === 3 && useCase && priority && fuel && (
              <div className="model-finder-results">
                <div className="model-finder-panel__header">
                  <div>
                    <span>Tu recomendación</span>
                    <h3>Estos Toritos encajan contigo</h3>
                  </div>
                  <button type="button" onClick={resetFinder} className="model-finder-back">
                    <RefreshCw aria-hidden="true" /> Empezar de nuevo
                  </button>
                </div>

                <div className="model-finder-result-grid">
                  {recommendations.map((model, index) => (
                    <article key={model.id} className={index === 0 ? "is-primary" : ""}>
                      <div className="model-finder-result__media">
                        {index === 0 && <span>Mejor coincidencia</span>}
                        <img src={model.imageUrl} alt={model.name} loading="lazy" decoding="async" />
                      </div>
                      <div className="model-finder-result__body">
                        <div className="model-finder-result__meta">
                          <span>{model.fuelTypes.join(" · ")}</span>
                          <strong>Desde {formatPrice(model.basePrice)}</strong>
                        </div>
                        <h4>{model.name}</h4>
                        <p>
                          Te lo recomendamos por su {recommendationReason(model, useCase, priority, fuel)}.
                        </p>
                        <div className="model-finder-result__actions">
                          <button type="button" className="btn-primary" onClick={() => onSelectModel(model.name)}>
                            Cotizar modelo
                          </button>
                          <button type="button" className="btn-secondary" onClick={() => onViewProduct(model.id)}>
                            Ver ficha
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
