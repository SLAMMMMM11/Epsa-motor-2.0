import { useState } from "react";
import { MOTOTAXI_MODELS } from "../data";
import { motion, AnimatePresence } from "motion/react";
import { Scale, Check, ChevronDown, Award, Zap, Fuel, Sparkles, TrendingUp } from "lucide-react";

interface ModelComparerProps {
  onSelectModel: (modelName: string) => void;
}

export default function ModelComparer({ onSelectModel }: ModelComparerProps) {
  const [modelAId, setModelAId] = useState<string>("re-4s");
  const [modelBId, setModelBId] = useState<string>("re-gnv-factory");

  const modelA = MOTOTAXI_MODELS.find((m) => m.id === modelAId) || MOTOTAXI_MODELS[0];
  const modelB = MOTOTAXI_MODELS.find((m) => m.id === modelBId) || MOTOTAXI_MODELS[1];

  // Helper to extract spec value safely
  const getSpecValue = (model: typeof modelA, label: string): string => {
    const spec = model.specs.find((s) => s.label.toLowerCase().includes(label.toLowerCase()));
    if (spec) return spec.value;
    
    // Fallback based on global properties if not in custom specs
    if (label === "Motor") return model.engine;
    if (label === "Potencia") return model.power;
    if (label === "Capacidad") return model.capacity;
    return "-";
  };

  const comparisonSpecs = [
    { label: "Motor", icon: <Zap className="w-4 h-4 text-amber-400" /> },
    { label: "Cilindrada", icon: <Sparkles className="w-4 h-4 text-emerald-400" /> },
    { label: "Potencia Máxima", icon: <Zap className="w-4 h-4 text-orange-400" /> },
    { label: "Torque Máximo", icon: <TrendingUp className="w-4 h-4 text-blue-400" /> },
    { label: "Capacidad / Pasajeros", icon: <Award className="w-4 h-4 text-purple-400" /> },
    { label: "Combustibles", icon: <Fuel className="w-4 h-4 text-[#60a5fa]" /> },
  ];

  return (
    <section className="py-20 bg-[#060a13] text-white relative overflow-hidden" id="comparer-section">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Title Block */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#60a5fa] text-xs font-bold uppercase tracking-widest block mb-2"
          >
            Análisis Comparativo
          </motion.span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight leading-tight">
            Compara Nuestras Unidades
          </h2>
          <p className="text-zinc-400 mt-4 text-xs md:text-sm leading-relaxed font-sans">
            ¿Dudas sobre cuál se adapta mejor a tu ruta diaria? Elige dos vehículos para realizar una comparación técnica exhaustiva cara a cara.
          </p>
        </div>

        {/* Comparison Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Column A - Selector and Card */}
          <div className="lg:col-span-5 bg-[#131c2e] border border-[#1e2e4a] rounded-sm p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider block">
                Selecciona Modelo A
              </label>
              <div className="relative">
                <select
                  value={modelAId}
                  onChange={(e) => setModelAId(e.target.value)}
                  className="w-full bg-[#1a263e] border border-[#1e2e4a] text-white text-xs font-bold uppercase tracking-wider py-3.5 px-4 rounded-sm appearance-none focus:border-[#3b82f6] outline-none cursor-pointer"
                >
                  {MOTOTAXI_MODELS.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Dynamic Image & General Info */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={modelAId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="pt-4 space-y-4"
                >
                  <div className="aspect-video w-full rounded-sm overflow-hidden bg-[#0a1120] border border-[#1e2e4a]/60 relative group">
                    <img
                      src={modelA.imageUrl}
                      alt={modelA.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060a13] via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[#60a5fa] text-[9px] uppercase font-bold tracking-widest block">Potencia de Trabajo</span>
                      <span className="text-xs font-bold text-white font-mono">{modelA.power}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">{modelA.name}</h3>
                    <p className="text-[#60a5fa] text-xs italic font-serif mt-0.5">{modelA.tagline}</p>
                    <p className="text-zinc-400 text-xs mt-3 leading-relaxed font-sans">{modelA.description}</p>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="pt-2 space-y-2">
                    <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block">Ventajas Clave:</span>
                    {modelA.highlights.slice(0, 2).map((highlight, index) => (
                      <div key={index} className="flex gap-2 items-start text-xs text-zinc-300 font-sans">
                        <Check className="w-3.5 h-3.5 text-[#60a5fa] shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={() => onSelectModel(modelA.name)}
              className="btn-secondary w-full py-3 px-4 rounded-sm text-xs font-bold uppercase tracking-wider text-center"
            >
              Cotizar {modelA.name}
            </button>
          </div>

          {/* Central Comparison Grid Specs list - MIDDLE */}
          <div className="lg:col-span-2 flex flex-col justify-center items-center py-6 bg-[#0a1120]/40 border border-[#1e2e4a] rounded-sm p-4 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5">
              <Scale className="w-48 h-48 text-[#60a5fa]" />
            </div>

            <div className="space-y-8 w-full z-10">
              <div className="w-10 h-10 rounded-full bg-[#1a263e] border border-[#1e2e4a] flex items-center justify-center text-[#60a5fa] mx-auto shadow-sm">
                <Scale className="w-5 h-5" />
              </div>
              
              <div className="space-y-6">
                {comparisonSpecs.map((spec) => (
                  <div key={spec.label} className="space-y-1">
                    <div className="flex items-center justify-center gap-1.5 mx-auto">
                      {spec.icon}
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#60a5fa]">
                        {spec.label}
                      </span>
                    </div>
                    {/* Display side-by-side values concisely for mobile view inside list */}
                    <div className="flex lg:hidden justify-between text-[11px] font-sans px-4 text-zinc-300 font-medium">
                      <span className="truncate max-w-[45%] text-left">{getSpecValue(modelA, spec.label)}</span>
                      <span className="text-zinc-500">vs</span>
                      <span className="truncate max-w-[45%] text-right">{getSpecValue(modelB, spec.label)}</span>
                    </div>
                  </div>
                ))}

                {/* Price block */}
                <div className="space-y-1 pt-4 border-t border-[#1e2e4a]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Inversión Estimada</span>
                  <div className="flex lg:hidden justify-between font-mono font-bold text-xs px-4">
                    <span className="text-white">S/. {modelA.basePrice.toLocaleString("es-PE")}</span>
                    <span className="text-zinc-500">vs</span>
                    <span className="text-white">S/. {modelB.basePrice.toLocaleString("es-PE")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column B - Selector and Card */}
          <div className="lg:col-span-5 bg-[#131c2e] border border-[#1e2e4a] rounded-sm p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider block">
                Selecciona Modelo B
              </label>
              <div className="relative">
                <select
                  value={modelBId}
                  onChange={(e) => setModelBId(e.target.value)}
                  className="w-full bg-[#1a263e] border border-[#1e2e4a] text-white text-xs font-bold uppercase tracking-wider py-3.5 px-4 rounded-sm appearance-none focus:border-[#3b82f6] outline-none cursor-pointer"
                >
                  {MOTOTAXI_MODELS.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Dynamic Image & General Info */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={modelBId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="pt-4 space-y-4"
                >
                  <div className="aspect-video w-full rounded-sm overflow-hidden bg-[#0a1120] border border-[#1e2e4a]/60 relative group">
                    <img
                      src={modelB.imageUrl}
                      alt={modelB.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060a13] via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[#60a5fa] text-[9px] uppercase font-bold tracking-widest block">Potencia de Trabajo</span>
                      <span className="text-xs font-bold text-white font-mono">{modelB.power}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">{modelB.name}</h3>
                    <p className="text-[#60a5fa] text-xs italic font-serif mt-0.5">{modelB.tagline}</p>
                    <p className="text-zinc-400 text-xs mt-3 leading-relaxed font-sans">{modelB.description}</p>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="pt-2 space-y-2">
                    <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block">Ventajas Clave:</span>
                    {modelB.highlights.slice(0, 2).map((highlight, index) => (
                      <div key={index} className="flex gap-2 items-start text-xs text-zinc-300 font-sans">
                        <Check className="w-3.5 h-3.5 text-[#60a5fa] shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={() => onSelectModel(modelB.name)}
              className="btn-primary w-full py-3 px-4 rounded-sm text-xs font-bold uppercase tracking-wider text-center"
            >
              Cotizar {modelB.name}
            </button>
          </div>

        </div>

        {/* Desktop Side-by-Side Spec Table */}
        <div className="hidden lg:block mt-8 bg-[#131c2e] border border-[#1e2e4a] rounded-sm overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0a1120] border-b border-[#1e2e4a]">
                <th className="py-4 px-6 text-zinc-400 font-bold uppercase tracking-wider w-1/4">Característica</th>
                <th className="py-4 px-6 text-white font-bold uppercase tracking-wider w-3/8 border-r border-[#1e2e4a]/60">
                  {modelA.name}
                </th>
                <th className="py-4 px-6 text-white font-bold uppercase tracking-wider w-3/8">
                  {modelB.name}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2e4a]/40 text-zinc-300">
              
              {comparisonSpecs.map((spec) => (
                <tr key={spec.label} className="hover:bg-[#1a263e]/20 transition-colors">
                  <td className="py-4 px-6 font-semibold text-white">{spec.label}</td>
                  <td className="py-4 px-6 border-r border-[#1e2e4a]/60 font-sans leading-normal">
                    {getSpecValue(modelA, spec.label)}
                  </td>
                  <td className="py-4 px-6 font-sans leading-normal">
                    {getSpecValue(modelB, spec.label)}
                  </td>
                </tr>
              ))}

              {/* Special Payload and FuelTypes row */}
              <tr className="hover:bg-[#1a263e]/20 transition-colors">
                <td className="py-4 px-6 font-semibold text-white">Combustibles de Fábrica</td>
                <td className="py-4 px-6 border-r border-[#1e2e4a]/60">
                  <div className="flex gap-1.5 flex-wrap">
                    {modelA.fuelTypes.map((t) => (
                      <span key={t} className="bg-[#1a263e] border border-[#1e2e4a] text-[10px] font-bold px-2 py-0.5 text-zinc-300 rounded-sm uppercase">
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex gap-1.5 flex-wrap">
                    {modelB.fuelTypes.map((t) => (
                      <span key={t} className="bg-[#1a263e] border border-[#1e2e4a] text-[10px] font-bold px-2 py-0.5 text-zinc-300 rounded-sm uppercase">
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>

              {/* Price row */}
              <tr className="bg-[#0a1120]/30 font-bold">
                <td className="py-5 px-6 text-[#60a5fa]">Precio Base Estimado</td>
                <td className="py-5 px-6 border-r border-[#1e2e4a]/60 font-mono text-white text-sm">
                  S/. {modelA.basePrice.toLocaleString("es-PE")} PEN
                </td>
                <td className="py-5 px-6 font-mono text-white text-sm">
                  S/. {modelB.basePrice.toLocaleString("es-PE")} PEN
                </td>
              </tr>

            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
}
