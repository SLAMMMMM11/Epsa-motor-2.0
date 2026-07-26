import { useState } from "react";
import { MototaxiModel } from "../types";
import { MOTOTAXI_MODELS, formatPrice } from "../data";
import { ArrowRight, Check, Info, Calculator, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 16 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 15,
    transition: { duration: 0.2 },
  },
};

interface CatalogProps {
  onSelectModelForBooking: (modelName: string) => void;
  onViewProduct: (modelId: string) => void;
}

export default function Catalog({ onSelectModelForBooking, onViewProduct }: CatalogProps) {
  const [selectedFuel, setSelectedFuel] = useState<string>("Todos");
  const [activeModel, setActiveModel] = useState<MototaxiModel | null>(null);
  const [downPayment, setDownPayment] = useState<number>(3000);
  const [financingMonths, setFinancingMonths] = useState<number>(24);

  const fuelOptions = ["Todos", "Gasolina", "GNV", "GLP", "Carga", "Destacados"];

  const filteredModels = MOTOTAXI_MODELS.filter((model) => {
    if (selectedFuel === "Todos") return true;
    if (selectedFuel === "Destacados") return Boolean(model.destacado);
    if (selectedFuel === "Carga") return model.category === "carga";
    if (selectedFuel === "GLP") {
      return model.fuelTypes.some((f) => f === "GLP" || f === "LPG");
    }
    return model.fuelTypes.includes(selectedFuel);
  });

  const handleOpenSimulator = (model: MototaxiModel) => {
    setDownPayment(Math.round(model.basePrice * 0.25));
    setFinancingMonths(24);
    setActiveModel(model);
  };

  const calculateInstallment = (basePrice: number) => {
    const principal = basePrice - downPayment;
    if (principal <= 0) return 0;
    const annualRate = 0.24;
    const monthlyRate = annualRate / 12;
    const n = financingMonths;
    const rawPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) /
      (Math.pow(1 + monthlyRate, n) - 1);
    return Math.round(rawPayment);
  };

  const calculateStartingInstallment = (basePrice: number) => {
    const principal = basePrice * 0.75;
    const monthlyRate = 0.24 / 12;
    const months = 24;
    return Math.round(
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
    );
  };

  return (
    <section className="epsa-tool-section epsa-catalog-section py-20 bg-[#060a13]/80 border-b border-[#1e2e4a] relative" id="catalog-section">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[#60a5fa] text-xs font-bold uppercase tracking-widest block mb-2">
              Catálogo oficial EPSA
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#f1f5f9] tracking-tight leading-tight">
              Modelos Torito Bajaj
            </h2>
            <p className="text-[#a1a1aa] mt-2 text-xs md:text-sm max-w-xl font-sans">
              Elige la motorización y el combustible que mejor se adapten a tu ruta y forma de trabajo.
            </p>
            <div className="catalog-pricing-notice">
              <Info aria-hidden="true" />
              <p>
                <strong>Información de precios:</strong> los montos publicados son referenciales para la versión
                con techo de lona. Pueden variar según sede, zona, disponibilidad y accesorios. Confirma el precio
                final con EPSA Motor.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap gap-2"
          >
            {fuelOptions.map((fuel) => (
              <button
                key={fuel}
                onClick={() => setSelectedFuel(fuel)}
                className={`relative px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border ${
                  selectedFuel === fuel
                    ? "bg-[#60a5fa] text-white border-[#60a5fa] shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                    : "bg-[#131c2e] text-[#a1a1aa] border-[#1e2e4a] hover:border-[#3b82f6]"
                }`}
              >
                {fuel}
              </button>
            ))}
          </motion.div>
        </div>

        <motion.div
          layout
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="catalog-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredModels.map((model) => (
              <motion.div
                layout
                variants={cardVariants}
                key={model.id}
                className="catalog-card bg-[#131c2e]/90 backdrop-blur-xs border border-[#1e2e4a] rounded-xl overflow-hidden transition-all duration-500 flex flex-col group h-full relative hover:border-[#3b82f6] hover:shadow-[0_0_25px_rgba(59,130,246,0.12)]"
              >
                <div className="catalog-card-media h-52 bg-[#060a13] relative flex items-center justify-center overflow-hidden border-b border-[#1e2e4a]">
                  <div className="absolute top-3 left-3 bg-[#131c2e] border border-[#1e2e4a] text-[10px] text-[#60a5fa] px-2.5 py-1 rounded-xl font-bold uppercase tracking-wider z-20 shadow-sm">
                    {model.engine}
                  </div>
                  {model.destacado && (
                    <div className="absolute top-3 right-3 z-20">
                      <span className="bg-[#60a5fa] border border-blue-400/30 text-white text-[9px] font-bold px-2 py-0.5 rounded-xs tracking-wider shadow-md">
                        Destacado
                      </span>
                    </div>
                  )}
                  {model.category === "carga" && (
                    <div className="absolute bottom-3 right-3 z-20">
                      <span className="bg-amber-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-xs tracking-wider">
                        Carga {model.payload}
                      </span>
                    </div>
                  )}

                  <img
                    src={model.imageUrl}
                    alt={model.name}
                    className="w-full h-full object-contain p-3 bg-[#1a263e] group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute bottom-3 left-3 z-20">
                    <span className="text-[10px] text-[#f1f5f9] font-bold uppercase bg-[#131c2e] border border-[#1e2e4a] px-2 py-0.5 rounded-xl tracking-wider shadow-sm">
                      {model.fuelTypes.join(" · ")}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-[#f1f5f9] tracking-tight group-hover:text-[#60a5fa] transition-colors duration-300">
                      {model.name}
                    </h3>
                    <p className="text-[11px] font-bold text-[#60a5fa] uppercase tracking-wider">
                      {model.tagline}
                    </p>
                    <p className="text-xs text-[#a1a1aa] line-clamp-3 leading-relaxed min-h-[48px]">
                      {model.description}
                    </p>
                  </div>

                  <div className="border-t border-[#1e2e4a] pt-3 space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#a1a1aa]">
                      <span>Potencia</span>
                      <span className="font-semibold text-[#f1f5f9]">{model.power}</span>
                    </div>
                    {model.torque && (
                      <div className="flex justify-between text-[#a1a1aa]">
                        <span>Torque</span>
                        <span className="font-semibold text-[#f1f5f9]">{model.torque}</span>
                      </div>
                    )}
                    {model.payload && (
                      <div className="flex justify-between text-[#a1a1aa]">
                        <span>Carga útil</span>
                        <span className="font-semibold text-[#f1f5f9]">{model.payload}</span>
                      </div>
                    )}
                    {model.colors && (
                      <div className="flex justify-between text-[#a1a1aa]">
                        <span>Colores</span>
                        <span className="font-semibold text-[#f1f5f9] text-right max-w-[55%]">
                          {model.colors.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="catalog-price-block pt-2">
                    <div className="flex justify-between items-baseline mb-3">
                      <span className="text-[10px] text-[#a1a1aa] uppercase tracking-widest font-bold">
                        Desde
                      </span>
                      <span className="text-lg font-bold text-[#60a5fa]">
                        {formatPrice(model.basePrice)}
                      </span>
                    </div>

                    <div className="catalog-installment mb-3">
                      <span>Cuota referencial desde</span>
                      <strong>{formatPrice(calculateStartingInstallment(model.basePrice))} / mes</strong>
                      <small>Con 25% de inicial · 24 meses</small>
                    </div>

                    <button
                      type="button"
                      onClick={() => onViewProduct(model.id)}
                      className="catalog-detail-link"
                    >
                      Ver ficha completa <ArrowRight aria-hidden="true" />
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleOpenSimulator(model)}
                        className="btn-secondary py-2 px-3 rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer hover:border-[#60a5fa]/50 transition-colors duration-300"
                      >
                        <Calculator className="w-3.5 h-3.5 text-[#60a5fa]" />
                        Simular cuota
                      </button>
                      <button
                        onClick={() => onSelectModelForBooking(model.name)}
                        className="btn-primary text-white font-bold py-2 px-3 rounded-xl text-[10px] uppercase tracking-wider text-center cursor-pointer hover:scale-102 transition-transform duration-300"
                      >
                        Cotizar
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredModels.length === 0 && (
          <p className="text-center text-[#a1a1aa] text-sm mt-10">
            No hay modelos con ese filtro. Prueba “Todos” o “Destacados”.
          </p>
        )}

        <AnimatePresence>
          {activeModel && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveModel(null)}
                className="fixed inset-0 bg-[#060a13]/85 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.93, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.93, y: 30 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
                className="bg-[#131c2e] border border-[#1e2e4a] rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative text-[#f1f5f9] z-10"
              >
                <button
                  onClick={() => setActiveModel(null)}
                  className="absolute top-4 right-4 bg-[#1a263e] hover:bg-[#60a5fa] text-[#a1a1aa] hover:text-white p-2 rounded-xl cursor-pointer transition-all border border-[#1e2e4a] hover:border-[#60a5fa]"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="p-6 md:p-8 space-y-6">
                  <div className="border-b border-[#1e2e4a] pb-4 pr-10">
                    <span className="text-xs text-[#60a5fa] font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Simulación de financiamiento
                    </span>
                    <h3 className="text-xl font-bold text-[#f1f5f9] mt-1">
                      Financia tu {activeModel.name}
                    </h3>
                    <p className="text-xs text-[#a1a1aa] mt-1">
                      Referencial. La tasa y cuota final se confirman en evaluación en sede.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-5 space-y-4">
                      <div className="bg-[#060a13] border border-[#1e2e4a] rounded-xl overflow-hidden">
                        <img
                          src={activeModel.imageUrl}
                          alt={activeModel.name}
                          className="w-full h-40 object-contain p-3 bg-[#1a263e]"
                        />
                      </div>
                      <div className="bg-[#060a13] border border-[#1e2e4a] rounded-xl p-4 space-y-2 text-xs">
                        <div className="flex justify-between border-b border-[#1e2e4a]/40 pb-1.5">
                          <span className="text-[#a1a1aa]">Precio ref. (con lona)</span>
                          <span className="font-bold text-[#60a5fa]">
                            {formatPrice(activeModel.basePrice)}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-[#1e2e4a]/40 pb-1.5">
                          <span className="text-[#a1a1aa]">Motorización</span>
                          <span className="font-medium text-[#f1f5f9]">{activeModel.engine}</span>
                        </div>
                        {activeModel.payload && (
                          <div className="flex justify-between">
                            <span className="text-[#a1a1aa]">Carga útil</span>
                            <span className="font-medium text-[#f1f5f9]">{activeModel.payload}</span>
                          </div>
                        )}
                      </div>
                      <ul className="space-y-1 text-xs text-[#a1a1aa]">
                        {activeModel.highlights.slice(0, 3).map((hl, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-[#60a5fa] shrink-0 mt-0.5" />
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="md:col-span-7 bg-[#060a13] rounded-xl p-6 space-y-6 border border-[#1e2e4a]">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-[#a1a1aa]">Cuota inicial</span>
                          <span className="text-[#60a5fa] font-bold font-mono">
                            {formatPrice(downPayment)}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={Math.round(activeModel.basePrice * 0.15)}
                          max={Math.round(activeModel.basePrice * 0.8)}
                          step={100}
                          value={Math.min(
                            Math.max(downPayment, Math.round(activeModel.basePrice * 0.15)),
                            Math.round(activeModel.basePrice * 0.8)
                          )}
                          onChange={(e) => setDownPayment(Number(e.target.value))}
                          className="w-full accent-[#60a5fa] cursor-pointer h-1 bg-[#131c2e] rounded-xl appearance-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs text-[#a1a1aa] font-semibold block">Plazo</span>
                        <div className="grid grid-cols-3 gap-2">
                          {[12, 18, 24].map((m) => (
                            <button
                              key={m}
                              onClick={() => setFinancingMonths(m)}
                              className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                financingMonths === m
                                  ? "bg-[#60a5fa] border-[#60a5fa] text-white"
                                  : "bg-[#131c2e] border-[#1e2e4a] text-[#a1a1aa] hover:border-[#3b82f6]"
                              }`}
                            >
                              {m} meses
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-[#1e2e4a] pt-6 space-y-4">
                        <div className="bg-[#131c2e] border border-[#1e2e4a] p-4 rounded-xl text-center">
                          <p className="text-[10px] text-[#a1a1aa] uppercase tracking-widest font-semibold">
                            Cuota mensual estimada
                          </p>
                          <p className="text-2xl font-bold text-[#60a5fa] mt-1">
                            {formatPrice(calculateInstallment(activeModel.basePrice))}
                          </p>
                          <p className="text-[10px] text-[#a1a1aa] mt-1">
                            ~{formatPrice(Math.round(calculateInstallment(activeModel.basePrice) / 30))}{" "}
                            diario (ilustrativo)
                          </p>
                        </div>
                        <p className="text-[10px] text-[#a1a1aa] leading-normal">
                          * Simulación referencial al 24% anual. La tasa real depende de evaluación en sede.
                        </p>
                        <button
                          onClick={() => {
                            onSelectModelForBooking(
                              `${activeModel.name} (Plan ${financingMonths} meses)`
                            );
                            setActiveModel(null);
                          }}
                          className="w-full btn-primary text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                        >
                          Iniciar trámite de crédito
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#060a13] border border-[#1e2e4a] rounded-xl p-4 md:p-6 space-y-4">
                    <p className="text-xs font-bold text-[#f1f5f9] uppercase tracking-widest flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-[#60a5fa]" />
                      Especificaciones
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#a1a1aa]">
                      {activeModel.specs.map((spec, i) => (
                        <div key={i} className="flex justify-between border-b border-[#1e2e4a]/60 pb-2">
                          <span className="text-[#a1a1aa]">{spec.label}</span>
                          <span className="font-bold text-[#60a5fa] text-right max-w-[65%]">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
