import { ArrowRight, Coins, Fuel, Gauge, Scale, Settings2, Users } from "lucide-react";
import { useState } from "react";
import { MOTOTAXI_MODELS } from "../data";

interface ModelComparerProps {
  onSelectModel: (modelName: string) => void;
}

type ComparisonKey = "price" | "engine" | "power" | "torque" | "capacity" | "fuel";

const COMPARISON_ROWS: Array<{
  key: ComparisonKey;
  label: string;
  icon: typeof Coins;
  preference?: "lower" | "higher";
}> = [
  { key: "price", label: "Precio referencial", icon: Coins, preference: "lower" },
  { key: "engine", label: "Motor", icon: Settings2 },
  { key: "power", label: "Potencia", icon: Gauge, preference: "higher" },
  { key: "torque", label: "Torque", icon: Scale, preference: "higher" },
  { key: "capacity", label: "Uso", icon: Users },
  { key: "fuel", label: "Combustible", icon: Fuel },
];

const getNumericValue = (value: string | number | undefined) => {
  if (typeof value === "number") return value;
  return Number.parseFloat(value || "0") || 0;
};

export default function ModelComparer({ onSelectModel }: ModelComparerProps) {
  const [modelAId, setModelAId] = useState("crom-plus-gsl");
  const [modelBId, setModelBId] = useState("2t-ug-gsl");
  const modelA = MOTOTAXI_MODELS.find((model) => model.id === modelAId) || MOTOTAXI_MODELS[0];
  const modelB = MOTOTAXI_MODELS.find((model) => model.id === modelBId) || MOTOTAXI_MODELS[1];

  const getComparisonValue = (key: ComparisonKey, model: typeof modelA) => {
    if (key === "price") return `S/ ${model.basePrice.toLocaleString("es-PE")}`;
    if (key === "engine") return model.engine;
    if (key === "power") return model.power;
    if (key === "torque") return model.torque || "No especificado";
    if (key === "capacity") return model.capacity;
    return model.fuelTypes.join(" / ");
  };

  const getWinner = (key: ComparisonKey, preference?: "lower" | "higher") => {
    if (!preference) return null;

    const valueA =
      key === "price"
        ? modelA.basePrice
        : getNumericValue(key === "power" ? modelA.power : modelA.torque);
    const valueB =
      key === "price"
        ? modelB.basePrice
        : getNumericValue(key === "power" ? modelB.power : modelB.torque);

    if (valueA === valueB) return "tie";
    if (preference === "lower") return valueA < valueB ? "a" : "b";
    return valueA > valueB ? "a" : "b";
  };

  const budgetModel = modelA.basePrice <= modelB.basePrice ? modelA : modelB;
  const performanceModel =
    getNumericValue(modelA.power) >= getNumericValue(modelB.power) ? modelA : modelB;

  return (
    <section className="epsa-tool-section model-comparison-section" id="comparer-section">
      <div className="model-comparison-shell">
        <header className="model-comparison-heading">
          <div>
            <span>Decide con claridad</span>
            <h2>Compara nuestras unidades</h2>
          </div>
          <p>Elige dos Toritos y revisa solo las diferencias que importan.</p>
        </header>

        <div className="model-comparison-board">
          <div className="model-comparison-stage">
            <article className="model-choice-card">
              <label htmlFor="comparison-model-a">Primera unidad</label>
              <div className="model-choice-select">
                <select
                  id="comparison-model-a"
                  value={modelAId}
                  onChange={(event) => setModelAId(event.target.value)}
                >
                  {MOTOTAXI_MODELS.map((model) => (
                    <option key={model.id} value={model.id} disabled={model.id === modelBId}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="model-choice-visual">
                <span className="model-choice-visual__letter">A</span>
                <img key={modelA.id} src={modelA.imageUrl} alt={modelA.name} />
                <div className="model-choice-visual__meta">
                  <span>{modelA.category === "carga" ? "Carga y pasajeros" : "Pasajeros"}</span>
                  <strong>{modelA.name}</strong>
                </div>
              </div>

              <div className="model-choice-summary">
                <strong>S/ {modelA.basePrice.toLocaleString("es-PE")}</strong>
                <div>
                  {modelA.fuelTypes.map((fuel) => (
                    <span key={fuel}>{fuel}</span>
                  ))}
                </div>
              </div>
            </article>

            <span className="model-comparison-versus" aria-hidden="true">
              VS
            </span>

            <article className="model-choice-card">
              <label htmlFor="comparison-model-b">Segunda unidad</label>
              <div className="model-choice-select">
                <select
                  id="comparison-model-b"
                  value={modelBId}
                  onChange={(event) => setModelBId(event.target.value)}
                >
                  {MOTOTAXI_MODELS.map((model) => (
                    <option key={model.id} value={model.id} disabled={model.id === modelAId}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="model-choice-visual">
                <span className="model-choice-visual__letter">B</span>
                <img key={modelB.id} src={modelB.imageUrl} alt={modelB.name} />
                <div className="model-choice-visual__meta">
                  <span>{modelB.category === "carga" ? "Carga y pasajeros" : "Pasajeros"}</span>
                  <strong>{modelB.name}</strong>
                </div>
              </div>

              <div className="model-choice-summary">
                <strong>S/ {modelB.basePrice.toLocaleString("es-PE")}</strong>
                <div>
                  {modelB.fuelTypes.map((fuel) => (
                    <span key={fuel}>{fuel}</span>
                  ))}
                </div>
              </div>
            </article>
          </div>

          <div className="model-comparison-specs">
            <div className="model-comparison-specs__head">
              <span>Lo que cambia</span>
              <strong>{modelA.name}</strong>
              <strong>{modelB.name}</strong>
            </div>

            {COMPARISON_ROWS.map((row) => {
              const Icon = row.icon;
              const winner = getWinner(row.key, row.preference);
              return (
                <div className="model-comparison-row" key={row.key}>
                  <span className="model-comparison-row__label">
                    <Icon aria-hidden="true" />
                    {row.label}
                  </span>
                  <span
                    className={
                      winner === "a" || winner === "tie"
                        ? "model-comparison-row__value is-best"
                        : "model-comparison-row__value"
                    }
                  >
                    {getComparisonValue(row.key, modelA)}
                    {winner === "a" && <small>Ventaja</small>}
                  </span>
                  <span
                    className={
                      winner === "b" || winner === "tie"
                        ? "model-comparison-row__value is-best"
                        : "model-comparison-row__value"
                    }
                  >
                    {getComparisonValue(row.key, modelB)}
                    {winner === "b" && <small>Ventaja</small>}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="model-comparison-decision">
            <div className="model-comparison-insights">
              <article>
                <span>Menor inversión</span>
                <strong>{budgetModel.name}</strong>
              </article>
              <article>
                <span>Mayor potencia</span>
                <strong>{performanceModel.name}</strong>
              </article>
            </div>

            <div className="model-comparison-actions">
              <button type="button" onClick={() => onSelectModel(modelA.name)}>
                Cotizar {modelA.name}
                <ArrowRight aria-hidden="true" />
              </button>
              <button type="button" onClick={() => onSelectModel(modelB.name)}>
                Cotizar {modelB.name}
                <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
