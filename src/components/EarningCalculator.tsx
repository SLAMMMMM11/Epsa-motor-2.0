import { useState } from "react";
import { motion } from "motion/react";
import { DollarSign, Wallet, Percent, TrendingUp, Sparkles, ChevronRight } from "lucide-react";

export default function EarningCalculator() {
  const [dailyRides, setDailyRides] = useState<number>(30);
  const [averageFare, setAverageFare] = useState<number>(5);
  const [fuelType, setFuelType] = useState<"Gasolina" | "GLP" | "GNV">("GNV");

  // Fuel formulas based on real-world cost metrics in Peru
  // Gasolina is the benchmark.
  // Average daily mileage for 30 rides: ~80 km.
  // Gasolina daily cost: ~S/. 40
  // GLP daily cost: ~S/. 24 (40% savings)
  // GNV daily cost: ~S/. 16 (60% savings)
  
  const ridesFactor = dailyRides / 30;
  const gasolineDailyCost = 40 * ridesFactor;
  
  let fuelDailyCost = gasolineDailyCost;
  let savingsPercentage = 0;

  if (fuelType === "GLP") {
    fuelDailyCost = gasolineDailyCost * 0.6; // 40% savings
    savingsPercentage = 40;
  } else if (fuelType === "GNV") {
    fuelDailyCost = gasolineDailyCost * 0.4; // 60% savings
    savingsPercentage = 60;
  }

  const daysWorkedPerMonth = 26; // Standard 6 days a week
  
  // Calculations
  const grossMonthlyIncome = dailyRides * averageFare * daysWorkedPerMonth;
  const monthlyFuelCost = fuelDailyCost * daysWorkedPerMonth;
  const benchmarkGasolineCost = gasolineDailyCost * daysWorkedPerMonth;
  const monthlySavings = benchmarkGasolineCost - monthlyFuelCost;
  
  // Standard monthly maintenance + oil: S/. 150
  const maintenanceCost = 150;
  const netMonthlyProfit = grossMonthlyIncome - monthlyFuelCost - maintenanceCost;

  // Credit cuota estimation (approximate S/. 450 per month for S/. 13,500 bike with 30% initial)
  const estimatedCreditInstallment = 480;
  const remainingProfitAfterCredit = netMonthlyProfit - estimatedCreditInstallment;

  return (
    <section className="py-20 bg-[#0a1120]/60 border-b border-[#1e2e4a] relative overflow-hidden" id="calculator-section">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#60a5fa] text-xs font-bold uppercase tracking-widest block mb-2"
          >
            Planifica tu Negocio
          </motion.span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight leading-tight">
            Calculadora de Ganancia y Ahorro
          </h2>
          <p className="text-zinc-400 mt-4 text-xs md:text-sm leading-relaxed font-sans">
            ¿Pensando en comprar tu primer Torito Bajaj o renovar tu flota? Descubre cuánto dinero puedes llevar a casa mensualmente eligiendo la tecnología de gas oficial.
          </p>
        </div>

        {/* Dynamic Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Controls Panel - LEFT */}
          <div className="lg:col-span-5 bg-[#131c2e] border border-[#1e2e4a] rounded-sm p-6 md:p-8 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-[#1e2e4a]/60">
                <Sparkles className="w-4 h-4 text-[#60a5fa]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">Parámetros de Trabajo</h3>
              </div>

              {/* Slider 1: Daily Rides */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-bold uppercase tracking-wide">Carreras Diarias Realizadas</span>
                  <span className="text-white font-mono bg-[#1a263e] px-2.5 py-1 rounded-sm border border-[#1e2e4a] font-bold">
                    {dailyRides} viajes/día
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="1"
                  value={dailyRides}
                  onChange={(e) => setDailyRides(parseInt(e.target.value))}
                  className="w-full h-1 bg-[#1a263e] rounded-lg appearance-none cursor-pointer accent-[#2563eb]"
                />
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>10 (Tranquilo)</span>
                  <span>35 (Promedio)</span>
                  <span>60 (Súper Dinámico)</span>
                </div>
              </div>

              {/* Slider 2: Average Fare */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-bold uppercase tracking-wide">Precio Promedio por Carrera</span>
                  <span className="text-[#60a5fa] font-mono bg-[#1a263e] px-2.5 py-1 rounded-sm border border-[#1e2e4a] font-bold">
                    S/. {averageFare.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="12"
                  step="0.5"
                  value={averageFare}
                  onChange={(e) => setAverageFare(parseFloat(e.target.value))}
                  className="w-full h-1 bg-[#1a263e] rounded-lg appearance-none cursor-pointer accent-[#2563eb]"
                />
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>S/. 3.00</span>
                  <span>S/. 7.00 (Corto/Medio)</span>
                  <span>S/. 12.00 (Largo)</span>
                </div>
              </div>

              {/* Fuel Type Selector */}
              <div className="space-y-3">
                <span className="text-zinc-400 text-xs font-bold uppercase tracking-wide block">Tecnología de Combustible</span>
                <div className="grid grid-cols-3 gap-2">
                  {(["Gasolina", "GLP", "GNV"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFuelType(type)}
                      className={`py-3 rounded-sm text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                        fuelType === type
                          ? "bg-[#2563eb] text-white border-[#60a5fa]"
                          : "bg-[#1a263e]/40 text-zinc-400 border-[#1e2e4a] hover:bg-[#1a263e] hover:text-white"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-zinc-500 leading-normal">
                  {fuelType === "Gasolina" && "La gasolina estándar tiene mayor costo por kilómetro recorido."}
                  {fuelType === "GLP" && "Ahorra un ~40% en combustible. Ideal para zonas de Lima con buena cobertura de GLP."}
                  {fuelType === "GNV" && "El combustible más económico del Perú. Ahorra hasta 60% frente a gasolina. ¡Recomendado!"}
                </p>
              </div>
            </div>

            {/* Note block */}
            <div className="bg-[#1a263e]/40 border border-[#1e2e4a] p-4 rounded-sm text-[11px] text-zinc-400 leading-relaxed mt-4">
              <p className="font-bold text-white mb-1 uppercase tracking-wider text-[9px] text-[#60a5fa]">Supuestos del Cálculo:</p>
              Cálculo estimado en base a un promedio de 26 días laborados al mes. Incluye una provisión mensual de S/. 150 para mantenimiento preventivo básico.
            </div>
          </div>

          {/* Profit Dashboard - RIGHT */}
          <div className="lg:col-span-7 bg-[#131c2e] border border-[#1e2e4a] rounded-sm p-6 md:p-8 flex flex-col justify-between space-y-8 relative overflow-hidden">
            {/* Glowing Accent Ring */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-[#1e2e4a]/60">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Retorno Estimado Mensual</h3>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-widest">
                  Rentable
                </span>
              </div>

              {/* Grid of Results */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Monthly Gross */}
                <div className="bg-[#1a263e]/40 border border-[#1e2e4a] p-5 rounded-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block">Ingreso Bruto</span>
                    <span className="text-xs text-zinc-400 font-sans">Total Cobrado</span>
                  </div>
                  <div className="mt-4">
                    <span className="text-zinc-500 text-xs font-bold mr-0.5">S/.</span>
                    <span className="text-xl font-bold text-white font-mono">
                      {grossMonthlyIncome.toLocaleString("es-PE")}
                    </span>
                  </div>
                </div>

                {/* Monthly Savings */}
                <div className="bg-[#1a263e]/40 border border-emerald-500/20 p-5 rounded-sm flex flex-col justify-between relative overflow-hidden">
                  {fuelType !== "Gasolina" && (
                    <div className="absolute top-0 right-0 bg-emerald-500 text-black text-[8px] font-bold px-1.5 py-0.5 rounded-bl-sm uppercase tracking-wider">
                      -{savingsPercentage}% Gasto
                    </div>
                  )}
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#60a5fa] block">Ahorro en Gas</span>
                    <span className="text-xs text-zinc-400 font-sans">Frente a Gasolina</span>
                  </div>
                  <div className="mt-4">
                    <span className="text-emerald-400 text-xs font-bold mr-0.5">S/.</span>
                    <span className="text-xl font-bold text-emerald-400 font-mono">
                      {monthlySavings.toLocaleString("es-PE", { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>

                {/* Net Income */}
                <div className="bg-[#1a263e]/90 border border-[#3b82f6]/50 p-5 rounded-sm flex flex-col justify-between shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-white block">Ganancia Neta</span>
                    <span className="text-xs text-zinc-400 font-sans">Bolsillo Libre</span>
                  </div>
                  <div className="mt-4">
                    <span className="text-[#60a5fa] text-xs font-bold mr-0.5">S/.</span>
                    <span className="text-2xl font-bold text-white font-mono">
                      {netMonthlyProfit.toLocaleString("es-PE", { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Scenario Breakdown */}
              <div className="bg-[#0a1120] border border-[#1e2e4a] rounded-sm p-5 space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">Simulación de Pago de Crédito Directo</span>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
                      <p className="text-xs text-zinc-300">
                        Cuota de Crédito EPSA Estimada: <span className="text-white font-bold">S/. {estimatedCreditInstallment} / mes</span>
                      </p>
                    </div>
                    <p className="text-[11px] text-zinc-500 pl-4 font-sans leading-relaxed">
                      Calculada para un plazo estándar a tasas de interés preferencial para mototaxis.
                    </p>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-sm text-center shrink-0 w-full sm:w-auto">
                    <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider block">Tu Saldo Neto Libre</span>
                    <span className="text-base font-bold text-emerald-400 font-mono block">
                      S/. {remainingProfitAfterCredit.toLocaleString("es-PE", { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Summary Statement */}
            <div className="border-t border-[#1e2e4a]/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">¡Inversión Segura y Altamente Rentable!</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed font-sans max-w-md">
                    Tu Torito RE se autofinancia con el trabajo diario de {Math.ceil(estimatedCreditInstallment / averageFare / 26)} carreras al día. El resto es ganancia neta para tu bolsillo.
                  </p>
                </div>
              </div>

              <a
                href="#booking-section"
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold uppercase tracking-wider text-[10px] py-3 px-5 rounded-sm flex items-center gap-1.5 shrink-0 transition-colors shadow-sm group"
              >
                Solicitar Crédito
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
