import { useState } from "react";
import { MototaxiModel } from "../types";
import { MOTOTAXI_MODELS } from "../data";
import { Check, Info, Calculator, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 16,
    },
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
}

export default function Catalog({ onSelectModelForBooking }: CatalogProps) {
  const [selectedFuel, setSelectedFuel] = useState<string>("Todos");
  const [activeModel, setActiveModel] = useState<MototaxiModel | null>(null);
  
  // Custom cabin body styles state matching user uploaded images
  // 'classic' = Standard soft top
  // 'javicar' = Premium Javi Car Fibras (Orange/White closed fiberglass)
  // 'invesa' = Invesa Tuning (Blue/White closed sports fiberglass)
  const [selectedCabins, setSelectedCabins] = useState<Record<string, "classic" | "javicar" | "invesa">>({});

  // Financing Simulator State
  const [downPayment, setDownPayment] = useState<number>(3000);
  const [financingMonths, setFinancingMonths] = useState<number>(24);

  const fuelOptions = ["Todos", "Gasolina", "GNV", "GLP", "Carga"];

  const filteredModels = MOTOTAXI_MODELS.filter((model) => {
    if (selectedFuel === "Todos") return true;
    if (selectedFuel === "Carga") return model.id.includes("cargo") || model.name.toLowerCase().includes("cargo");
    return model.fuelTypes.includes(selectedFuel);
  });

  const getModelPrice = (modelId: string, basePrice: number) => {
    const isPassengerModel = ["re-4s", "chrome", "re-2t", "maxima-z", "re-gnv-factory"].includes(modelId);
    if (!isPassengerModel) return basePrice;

    const cabin = selectedCabins[modelId] || "classic";
    if (cabin === "javicar") return basePrice + 1800; // Javi Car closed cabin upgrade
    if (cabin === "invesa") return basePrice + 2400;  // Invesa Tuning premium upgrade
    return basePrice;
  };

  const getCardBorderClass = (modelId: string) => {
    const isPassengerModel = ["re-4s", "chrome", "re-2t", "maxima-z", "re-gnv-factory"].includes(modelId);
    if (!isPassengerModel) return "border-[#1e2e4a] hover:border-[#3b82f6] hover:shadow-[0_0_25px_rgba(59,130,246,0.12)]";

    const cabin = selectedCabins[modelId] || "classic";
    if (cabin === "javicar") {
      return "border-orange-500/50 hover:border-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.1)] hover:shadow-[0_0_25px_rgba(234,88,12,0.22)]";
    }
    if (cabin === "invesa") {
      return "border-blue-500/50 hover:border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.1)] hover:shadow-[0_0_25px_rgba(37,99,235,0.22)]";
    }
    return "border-teal-600/50 hover:border-teal-400 shadow-[0_0_20px_rgba(13,148,136,0.1)] hover:shadow-[0_0_25px_rgba(13,148,136,0.22)]";
  };

  const handleOpenSimulator = (model: MototaxiModel) => {
    const priceWithCabin = getModelPrice(model.id, model.basePrice);
    setDownPayment(Math.round(priceWithCabin * 0.25)); // Default downpayment to 25% of current price
    setFinancingMonths(24);
    setActiveModel(model);
  };

  const calculateInstallment = (basePrice: number) => {
    const principal = basePrice - downPayment;
    const annualRate = 0.24; // 24% annual rate
    const monthlyRate = annualRate / 12;
    const n = financingMonths;
    const rawPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    return Math.round(rawPayment);
  };

  return (
    <section className="py-20 bg-[#060a13]/80 border-b border-[#1e2e4a] relative" id="catalog-section">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[#60a5fa] text-xs font-bold uppercase tracking-widest block mb-2">Gama de Productos</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight leading-tight">
              Catálogo de Vehículos
            </h2>
            <p className="text-zinc-400 mt-2 text-xs md:text-sm max-w-xl font-sans">
              Modelos originales Bajaj certificados por fábrica. Elige la motorización y combustible que mejor se adapte a tu ruta diaria.
            </p>
          </motion.div>

          {/* Clean Ecommerce Category Filter */}
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
                className={`relative px-4 py-2.5 rounded-sm text-[11px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border ${
                  selectedFuel === fuel
                    ? "bg-[#2563eb] text-white border-[#2563eb] shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                    : "bg-[#131c2e] text-zinc-300 border-[#1e2e4a] hover:border-[#3b82f6]"
                }`}
              >
                {fuel}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Catalog Grid with layout animation */}
        <motion.div
          layout
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredModels.map((model) => {
              const isPassenger = ["re-4s", "chrome", "re-2t", "maxima-z", "re-gnv-factory"].includes(model.id);
              const activeCabin = selectedCabins[model.id] || "classic";
              const currentPrice = getModelPrice(model.id, model.basePrice);

              // Dynamic descriptions based on cabin choice
              let displayTagline = model.tagline;
              let displayDesc = model.description;
              if (isPassenger) {
                if (activeCabin === "javicar") {
                  displayTagline = "Fibras Javi Car® - Edición Cerrada";
                  displayDesc = "Personalizado con cabina cerrada de fibra de vidrio de alta resistencia por Javi Car Fibras. Incluye pintura uretana bicolor, lunas corredizas templadas, puertas herméticas con cerradura de seguridad y alerón deportivo trasero con luz LED.";
                } else if (activeCabin === "invesa") {
                  displayTagline = "Invesa Tuning® - Edición Sport";
                  displayDesc = "Personalizado con kit de carrocería deportiva premium por Invesa. Destaca por su máscara delantera con faros de alta proyección integrados, deflectores aerodinámicos, interior acústicamente optimizado y acabados tipo fibra de carbono.";
                }
              }

              return (
                <motion.div
                  layout
                  variants={cardVariants}
                  key={model.id}
                  className={`catalog-card bg-[#131c2e]/90 backdrop-blur-xs border rounded-sm overflow-hidden transition-all duration-500 flex flex-col group h-full relative ${getCardBorderClass(model.id)}`}
                >
                  {/* Image Container */}
                  <div className="h-52 bg-[#0a1120] relative flex items-center justify-center overflow-hidden border-b border-[#1e2e4a]">
                    <div className="absolute top-3 left-3 bg-[#131c2e] border border-[#1e2e4a] text-[10px] text-[#60a5fa] px-2.5 py-1 rounded-sm font-bold uppercase tracking-wider z-20 shadow-sm">
                      {model.engine}
                    </div>

                    {/* Custom Cabin Status Badge */}
                    {isPassenger && (
                      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1 items-end">
                        {activeCabin === "javicar" && (
                          <span className="bg-[#ea580c] border border-orange-400/30 text-white text-[9px] font-bold px-2 py-0.5 rounded-xs tracking-wider shadow-md animate-pulse">
                            Cabina Javi Car Fibras®
                          </span>
                        )}
                        {activeCabin === "invesa" && (
                          <span className="bg-[#2563eb] border border-blue-400/30 text-white text-[9px] font-bold px-2 py-0.5 rounded-xs tracking-wider shadow-md animate-pulse">
                            Invesa Tuning® Sport
                          </span>
                        )}
                        {activeCabin === "classic" && (
                          <span className="bg-[#0d9488] border border-teal-400/30 text-white text-[9px] font-bold px-2 py-0.5 rounded-xs tracking-wider shadow-md">
                            Lona Original Bajaj
                          </span>
                        )}
                      </div>
                    )}

                    <img
                      src={model.imageUrl}
                      alt={model.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute bottom-3 left-3 z-20">
                      <span className="text-[10px] text-white font-bold uppercase bg-[#131c2e] border border-[#1e2e4a] px-2 py-0.5 rounded-sm tracking-wider shadow-sm">
                        {model.name.split(" ").slice(2).join(" ") || "Bajaj"}
                      </span>
                    </div>
                    
                    {/* Glass shimmer sweep on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                  </div>

                  {/* Contents */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-base font-bold text-white tracking-tight group-hover:text-[#60a5fa] transition-colors duration-300">
                          {model.name}
                        </h3>
                        <p className={`text-[11px] font-bold mt-1 uppercase tracking-wider transition-colors duration-300 ${
                          activeCabin === "javicar" ? "text-orange-400" : activeCabin === "invesa" ? "text-blue-400" : "text-[#60a5fa]"
                        }`}>
                          {displayTagline}
                        </p>
                        <p className="text-xs text-zinc-400 mt-2 line-clamp-4 leading-relaxed h-[72px]">
                          {displayDesc}
                        </p>
                      </div>

                      {/* Interactive Cabin Selector */}
                      {isPassenger && (
                        <div className="space-y-1.5 bg-[#0a1120]/60 p-2 border border-[#1e2e4a]/40 rounded-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Cabina / Carrocería</span>
                            <span className="text-[9px] text-[#60a5fa] font-semibold">Toca para cambiar</span>
                          </div>
                          <div className="grid grid-cols-3 gap-1">
                            {[
                              { id: "classic", label: "Lona", color: "hover:border-teal-400" },
                              { id: "javicar", label: "Javi Car", color: "hover:border-orange-500" },
                              { id: "invesa", label: "Invesa", color: "hover:border-blue-500" }
                            ].map((opt) => {
                              const active = activeCabin === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  onClick={() => setSelectedCabins(prev => ({ ...prev, [model.id]: opt.id as any }))}
                                  className={`py-1 px-1 rounded-xs text-[9px] font-bold transition-all duration-300 cursor-pointer text-center border flex flex-col items-center justify-center ${
                                    active
                                      ? opt.id === "javicar"
                                        ? "bg-orange-600/20 border-orange-500 text-orange-400 shadow-[0_0_8px_rgba(234,88,12,0.3)]"
                                        : opt.id === "invesa"
                                        ? "bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_8px_rgba(37,99,235,0.3)]"
                                        : "bg-teal-600/20 border-teal-500 text-teal-400 shadow-[0_0_8px_rgba(13,148,136,0.3)]"
                                      : `bg-[#0d1525] text-zinc-400 border-[#1e2e4a] ${opt.color}`
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Specs snippet */}
                    <div className="border-t border-[#1e2e4a] pt-3 space-y-1.5 text-xs">
                      <div className="flex justify-between text-zinc-400">
                        <span>Combustible:</span>
                        <span className="font-semibold text-white">{model.fuelTypes.join(" / ")}</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Carrocería:</span>
                        <span className={`font-semibold uppercase text-[10px] ${
                          activeCabin === "javicar" ? "text-orange-400" : activeCabin === "invesa" ? "text-blue-400" : "text-teal-400"
                        }`}>
                          {activeCabin === "javicar" ? "Fibra Javi Car" : activeCabin === "invesa" ? "Fibra Invesa Tuning" : "Lona Original"}
                        </span>
                      </div>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="pt-2">
                      <div className="flex justify-between items-baseline mb-3">
                        <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Precio Equipado</span>
                        <span className="text-lg font-bold text-[#60a5fa]">
                          S/ {currentPrice.toLocaleString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleOpenSimulator(model)}
                          className="btn-secondary py-2 px-3 rounded-sm text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer hover:border-[#2563eb]/50 transition-colors duration-300"
                        >
                          <Calculator className="w-3.5 h-3.5 text-[#60a5fa]" />
                          Simular
                        </button>
                        <button
                          onClick={() => {
                            const cabinName = activeCabin === 'javicar' ? 'Cabina Fibra Javi Car' : activeCabin === 'invesa' ? 'Cabina Fibra Invesa Tuning' : 'Lona Original';
                            onSelectModelForBooking(`${model.name} (${cabinName})`);
                          }}
                          className="btn-primary text-white font-bold py-2 px-3 rounded-sm text-[10px] uppercase tracking-wider text-center cursor-pointer hover:scale-102 transition-transform duration-300"
                        >
                          Reservar Cita
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Dynamic Simulator Modal with Premium Framer Motion Animations */}
        <AnimatePresence>
          {activeModel && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              {/* Animated Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveModel(null)}
                className="fixed inset-0 bg-[#060a13]/85 backdrop-blur-md"
              />

              {/* Modal Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.93, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.93, y: 30 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
                className="bg-[#131c2e] border border-[#1e2e4a] rounded-sm shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative text-white z-10"
              >
                {/* Close button */}
                <button
                  onClick={() => setActiveModel(null)}
                  className="absolute top-4 right-4 bg-[#1a263e] hover:bg-[#2563eb] text-zinc-300 hover:text-white p-2 rounded-sm cursor-pointer transition-all border border-[#1e2e4a] hover:border-[#2563eb]"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="p-6 md:p-8 space-y-6">
                  {/* Header */}
                  {(() => {
                    const activeModelCabin = selectedCabins[activeModel.id] || "classic";
                    const activeModelPrice = getModelPrice(activeModel.id, activeModel.basePrice);
                    const cabinLabel = activeModelCabin === "javicar" ? "Fibras Javi Car®" : activeModelCabin === "invesa" ? "Invesa Tuning®" : "Lona Original";
                    const isPassengerModel = ["re-4s", "chrome", "re-2t", "maxima-z", "re-gnv-factory"].includes(activeModel.id);

                    return (
                      <>
                        <div className="border-b border-[#1e2e4a] pb-4 pr-10">
                          <span className="text-xs text-[#60a5fa] font-bold uppercase tracking-widest flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#60a5fa] animate-spin" style={{ animationDuration: '3s' }} />
                            Simulación de Financiamiento
                          </span>
                          <h3 className="text-xl font-bold text-white mt-1">
                            Financia tu {activeModel.name} {isPassengerModel && <span className="text-[#60a5fa] text-sm font-medium block sm:inline">({cabinLabel})</span>}
                          </h3>
                          <p className="text-xs text-zinc-400 mt-1">
                            Simula la inicial y cuotas de acuerdo a tu perfil de ingresos. Evaluación en tienda.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                          {/* Left Column: Product Info */}
                          <div className="md:col-span-5 space-y-4">
                            <div className="bg-[#0a1120] border border-[#1e2e4a] rounded-sm p-4 space-y-3">
                              <p className="text-[10px] font-bold text-[#60a5fa] uppercase tracking-widest">Detalles Técnicos</p>
                              
                              <div className="space-y-2 text-xs text-zinc-300">
                                <div className="flex justify-between border-b border-[#1e2e4a]/40 pb-1.5">
                                  <span className="text-zinc-400">Precio Total Equipado:</span>
                                  <span className="font-bold text-[#60a5fa]">S/ {activeModelPrice.toLocaleString()}</span>
                                </div>
                                {isPassengerModel && (
                                  <div className="flex justify-between border-b border-[#1e2e4a]/40 pb-1.5">
                                    <span className="text-zinc-400">Carrocería / Cabina:</span>
                                    <span className={`font-semibold uppercase text-[10px] ${
                                      activeModelCabin === "javicar" ? "text-orange-400" : activeModelCabin === "invesa" ? "text-blue-400" : "text-teal-400"
                                    }`}>{cabinLabel}</span>
                                  </div>
                                )}
                                <div className="flex justify-between border-b border-[#1e2e4a]/40 pb-1.5">
                                  <span className="text-zinc-400">Motorización:</span>
                                  <span className="font-medium text-white">{activeModel.engine}</span>
                                </div>
                                <div className="flex justify-between pb-0.5">
                                  <span className="text-zinc-400">Capacidad:</span>
                                  <span className="font-medium text-white">{activeModel.capacity}</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Ventajas Incluidas</p>
                              <ul className="space-y-1 text-xs text-zinc-300">
                                {activeModel.highlights.slice(0, 3).map((hl, i) => (
                                  <li key={i} className="flex items-start gap-1.5">
                                    <Check className="w-3.5 h-3.5 text-[#60a5fa] shrink-0 mt-0.5" />
                                    <span>{hl}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Right Column: Calculations */}
                          <div className="md:col-span-7 bg-[#0a1120] text-white rounded-sm p-6 space-y-6 relative border border-[#1e2e4a]">
                            <div className="space-y-4">
                              {/* Cuota Inicial Slider */}
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs font-semibold">
                                  <span className="text-zinc-300">Cuota Inicial (Soles)</span>
                                  <span className="text-[#60a5fa] font-bold font-mono">S/ {downPayment.toLocaleString()}</span>
                                </div>
                                <input
                                  type="range"
                                  min={Math.round(activeModelPrice * 0.15)} // Min 15%
                                  max={Math.round(activeModelPrice * 0.8)} // Max 80%
                                  step={100}
                                  value={downPayment > activeModelPrice * 0.8 ? Math.round(activeModelPrice * 0.25) : downPayment}
                                  onChange={(e) => setDownPayment(Number(e.target.value))}
                                  className="w-full accent-[#2563eb] cursor-pointer h-1 bg-[#131c2e] rounded-sm appearance-none"
                                />
                                <div className="flex justify-between text-[10px] text-zinc-400">
                                  <span>Min: S/ {Math.round(activeModelPrice * 0.15).toLocaleString()} (15%)</span>
                                  <span>Max: S/ {Math.round(activeModelPrice * 0.8).toLocaleString()} (80%)</span>
                                </div>
                              </div>

                              {/* Term Select */}
                              <div className="space-y-2">
                                <span className="text-xs text-zinc-300 font-semibold block">Plazo de Financiamiento</span>
                                <div className="grid grid-cols-3 gap-2">
                                  {[12, 18, 24].map((m) => (
                                    <button
                                      key={m}
                                      onClick={() => setFinancingMonths(m)}
                                      className={`py-2 rounded-sm text-xs font-bold border transition-all cursor-pointer ${
                                        financingMonths === m
                                          ? "bg-[#2563eb] border-[#2563eb] text-white shadow-sm"
                                          : "bg-[#131c2e] border-[#1e2e4a] text-zinc-300 hover:border-[#3b82f6]"
                                      }`}
                                    >
                                      {m} Meses
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Simulation Result with scale bump on value change */}
                            <div className="border-t border-[#1e2e4a] pt-6 space-y-4">
                              <motion.div
                                key={`${downPayment}-${financingMonths}-${activeModelPrice}`}
                                initial={{ scale: 0.98, opacity: 0.95 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-[#131c2e] border border-[#1e2e4a] p-4 rounded-sm text-center relative overflow-hidden"
                              >
                                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">Cuota Mensual Estimada</p>
                                <p className="text-2xl font-bold text-[#60a5fa] mt-1 tracking-tight">
                                  S/ {calculateInstallment(activeModelPrice).toLocaleString()}
                                </p>
                                <p className="text-[10px] text-zinc-400 mt-1">
                                  Equivale a aprox. <span className="text-[#60a5fa] font-bold">S/ {Math.round(calculateInstallment(activeModelPrice) / 30).toLocaleString()} diario</span>
                                </p>
                              </motion.div>

                              <div className="text-[10px] text-zinc-400 space-y-1 leading-normal">
                                <p>* La simulación es de carácter ilustrativo. La tasa final depende de tu historial crediticio.</p>
                                <p>* Requisitos: Presentar DNI, recibo de luz/agua, y aprobación previa.</p>
                              </div>

                              <button
                                onClick={() => {
                                  onSelectModelForBooking(`${activeModel.name} (${cabinLabel} - Plan ${financingMonths} meses)`);
                                  setActiveModel(null);
                                }}
                                className="w-full btn-primary text-white font-bold py-3.5 px-4 rounded-sm text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer text-center hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                              >
                                Iniciar Trámite de Crédito
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* More Details section */}
                        <div className="bg-[#0a1120] border border-[#1e2e4a] rounded-sm p-4 md:p-6 space-y-4">
                          <p className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1">
                            <Info className="w-3.5 h-3.5 text-[#60a5fa]" />
                            Especificaciones Técnicas Completas
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-300">
                            {isPassengerModel && (
                              <div className="flex justify-between border-b border-[#1e2e4a]/60 pb-2">
                                <span className="text-zinc-400">Carrocería Adicional:</span>
                                <span className="font-bold text-white text-right">{cabinLabel}</span>
                              </div>
                            )}
                            {activeModel.specs.map((spec, i) => (
                              <div key={i} className="flex justify-between border-b border-[#1e2e4a]/60 pb-2">
                                <span className="text-zinc-400">{spec.label}:</span>
                                <span className="font-bold text-[#60a5fa] text-right max-w-[65%]">{spec.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
