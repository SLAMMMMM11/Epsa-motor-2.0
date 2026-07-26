import { useState } from "react";
import { ArrowRight, Banknote, Check, Fuel, Route, WalletCards } from "lucide-react";

type FuelType = "Gasolina" | "GLP" | "GNV";

const FUEL_OPTIONS: Array<{
  value: FuelType;
  label: string;
  saving: string;
  image: string;
  alt: string;
}> = [
  {
    value: "Gasolina",
    label: "Gasolina",
    saving: "Costo base",
    image: "/assets/media/images/finder-combustible-gasolina.webp",
    alt: "Abastecimiento con gasolina",
  },
  {
    value: "GLP",
    label: "GLP",
    saving: "Ahorra ~40%",
    image: "/assets/media/images/finder-combustible-glp-v2.webp",
    alt: "Abastecimiento con GLP",
  },
  {
    value: "GNV",
    label: "GNV",
    saving: "Ahorra ~60%",
    image: "/assets/media/images/finder-combustible-gnv.webp",
    alt: "Abastecimiento con GNV",
  },
];

const formatMoney = (value: number) =>
  value.toLocaleString("es-PE", {
    maximumFractionDigits: 0,
  });

export default function EarningCalculator() {
  const [dailyRides, setDailyRides] = useState(30);
  const [averageFare, setAverageFare] = useState(5);
  const [fuelType, setFuelType] = useState<FuelType>("GNV");

  const ridesFactor = dailyRides / 30;
  const gasolineDailyCost = 40 * ridesFactor;
  const fuelMultiplier = fuelType === "GLP" ? 0.6 : fuelType === "GNV" ? 0.4 : 1;
  const fuelDailyCost = gasolineDailyCost * fuelMultiplier;
  const savingsPercentage = fuelType === "GLP" ? 40 : fuelType === "GNV" ? 60 : 0;
  const daysWorkedPerMonth = 26;
  const maintenanceCost = 150;
  const estimatedCreditInstallment = 520;
  const grossMonthlyIncome = dailyRides * averageFare * daysWorkedPerMonth;
  const monthlyFuelCost = fuelDailyCost * daysWorkedPerMonth;
  const benchmarkGasolineCost = gasolineDailyCost * daysWorkedPerMonth;
  const monthlySavings = benchmarkGasolineCost - monthlyFuelCost;
  const netMonthlyProfit = grossMonthlyIncome - monthlyFuelCost - maintenanceCost;
  const remainingProfitAfterCredit = netMonthlyProfit - estimatedCreditInstallment;
  return (
    <section className="epsa-tool-section earnings-section" id="calculator-section">
      <div className="earnings-shell">
        <header className="earnings-heading">
          <div>
            <span>Planifica tu negocio</span>
            <h2>Calcula lo que puede dejarte tu Torito</h2>
          </div>
          <p>Ajusta tu jornada y descubre una ganancia mensual estimada.</p>
        </header>

        <div className="earnings-layout">
          <div className="earnings-controls">
            <figure className="earnings-journey earnings-journey--photo">
              <img
                src="/assets/media/images/calculator/ganancia-diaria.webp"
                alt="Conductor trabajando durante su jornada diaria con un mototaxi"
              />
              <figcaption>
                <small>Tu jornada</small>
                <strong>{dailyRides} carreras al día</strong>
              </figcaption>
            </figure>

            <div className="earnings-controls__body">
              <div className="earnings-slider">
                <label htmlFor="daily-rides">
                  <span>
                    <Route aria-hidden="true" />
                    Carreras diarias
                  </span>
                  <output>{dailyRides}</output>
                </label>
                <input
                  id="daily-rides"
                  type="range"
                  min="10"
                  max="60"
                  step="1"
                  value={dailyRides}
                  onChange={(event) => setDailyRides(Number(event.target.value))}
                />
                <div>
                  <span>10</span>
                  <span>60</span>
                </div>
              </div>

              <div className="earnings-slider">
                <label htmlFor="average-fare">
                  <span>
                    <Banknote aria-hidden="true" />
                    Tarifa promedio
                  </span>
                  <output>S/ {averageFare.toFixed(2)}</output>
                </label>
                <input
                  id="average-fare"
                  type="range"
                  min="3"
                  max="12"
                  step="0.5"
                  value={averageFare}
                  onChange={(event) => setAverageFare(Number(event.target.value))}
                />
                <div>
                  <span>S/ 3</span>
                  <span>S/ 12</span>
                </div>
              </div>

              <fieldset className="earnings-fuels">
                <legend>Elige tu combustible</legend>
                <div>
                  {FUEL_OPTIONS.map((option) => {
                    const isActive = fuelType === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        className={isActive ? "earnings-fuel is-active" : "earnings-fuel"}
                        aria-pressed={isActive}
                        onClick={() => setFuelType(option.value)}
                      >
                        <span className="earnings-fuel__image">
                          <img src={option.image} alt={option.alt} />
                          {isActive && (
                            <span className="earnings-fuel__check">
                              <Check aria-hidden="true" />
                            </span>
                          )}
                        </span>
                        <span className="earnings-fuel__label">
                          <strong>{option.label}</strong>
                          <small>{option.saving}</small>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          </div>

          <div className="earnings-result">
            <figure className="earnings-result__visual earnings-result__visual--photo">
              <img
                src="/assets/media/images/calculator/ahorro-gnv.webp"
                alt="Conductor revisando la ganancia obtenida con su mototaxi"
              />
              <div className="earnings-result__shade" />
              <figcaption>
                <small>Ganancia neta estimada</small>
                <strong>
                  <span>S/</span>
                  {formatMoney(netMonthlyProfit)}
                </strong>
                <p>al mes</p>
              </figcaption>
              {savingsPercentage > 0 && (
                <span className="earnings-result__saving">
                  <Fuel aria-hidden="true" />
                  Ahorras {savingsPercentage}% en combustible
                </span>
              )}
            </figure>

            <div className="earnings-result__body">
              <div className="earnings-metrics">
                <article>
                  <small>Ingreso bruto</small>
                  <strong>S/ {formatMoney(grossMonthlyIncome)}</strong>
                </article>
                <article>
                  <small>Gasto en {fuelType}</small>
                  <strong>S/ {formatMoney(monthlyFuelCost)}</strong>
                </article>
                <article className="is-highlighted">
                  <small>Ahorro vs. gasolina</small>
                  <strong>S/ {formatMoney(monthlySavings)}</strong>
                </article>
              </div>

              <div className="earnings-credit">
                <span className="earnings-credit__icon">
                  <WalletCards aria-hidden="true" />
                </span>
                <div>
                  <small>Luego de una cuota referencial de S/ {estimatedCreditInstallment}</small>
                  <strong>Te quedarían S/ {formatMoney(remainingProfitAfterCredit)} libres</strong>
                </div>
                <a href="#booking-section">
                  Evaluar mi crédito
                  <ArrowRight aria-hidden="true" />
                </a>
              </div>

              <p className="earnings-disclaimer">
                Estimación con 26 días de trabajo y S/ 150 de mantenimiento mensual. Los resultados pueden variar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
