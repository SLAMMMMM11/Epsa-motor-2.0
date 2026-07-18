import { useState, useEffect, FormEvent } from "react";
import { BRANCHES } from "../data";
import { Calendar, Clock, CheckCircle, Search, Wrench, Shield, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BookingFormProps {
  preselectedModel?: string;
  onClearPreselectedModel?: () => void;
}

export default function BookingForm({ preselectedModel, onClearPreselectedModel }: BookingFormProps) {
  // Form state
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [branch, setBranch] = useState<string>("Puente Piedra");
  const [serviceType, setServiceType] = useState<string>("Prueba de Manejo");
  const [modelInterest, setModelInterest] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [createdBooking, setCreatedBooking] = useState<any>(null);

  // Lookup state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"book" | "search">("book");

  // Sync preselected model
  useEffect(() => {
    if (preselectedModel) {
      setModelInterest(preselectedModel);
      setServiceType("Prueba de Manejo");
      setActiveTab("book");
    }
  }, [preselectedModel]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !date || !time || !branch || !serviceType) {
      setError("Por favor complete todos los campos obligatorios.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          date,
          time,
          branch,
          serviceType,
          modelInterest: modelInterest || "General",
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ocurrió un error al procesar tu solicitud.");
      }

      setSuccess(true);
      setCreatedBooking(data.booking);
      
      // Clear form
      setName("");
      setPhone("");
      setEmail("");
      setDate("");
      setTime("");
      setNotes("");
      if (onClearPreselectedModel) {
        onClearPreselectedModel();
      }
    } catch (err: any) {
      setError(err.message || "Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setError("");

    try {
      const response = await fetch(`/api/bookings?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Error al consultar citas.");
      }

      setSearchResults(data);
    } catch (err: any) {
      setError(err.message || "Error de red al consultar.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <section className="py-20 bg-[#0a1120] border-b border-[#1e2e4a] relative" id="booking-section">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Visual copy & Trust elements */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-center">
            <div>
              <span className="text-[#60a5fa] text-xs font-bold uppercase tracking-widest block mb-2">Atención Rápida</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight leading-tight">
                Agenda tu cita o visita técnica
              </h2>
              <p className="text-zinc-400 text-xs md:text-sm mt-4 leading-relaxed font-sans">
                ¿Deseas realizar una prueba de manejo o necesitas mantenimiento técnico programado con repuestos genuinos? Registra tus datos en línea para ser atendido de forma preferente sin colas.
              </p>
            </div>

            {/* Quick Benefits Cards */}
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-sm bg-[#131c2e] border border-[#1e2e4a]">
                <Wrench className="w-5 h-5 text-[#60a5fa] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Taller Homologado</h4>
                  <p className="text-xs text-zinc-400 mt-1">Soporte directo de técnicos entrenados en fábrica.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-sm bg-[#131c2e] border border-[#1e2e4a]">
                <Shield className="w-5 h-5 text-[#60a5fa] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Repuestos Originales</h4>
                  <p className="text-xs text-zinc-400 mt-1">Preserva el valor de reventa de tu Bajaj instalando repuestos legítimos.</p>
                </div>
              </div>
            </div>

            {/* Business trust highlight */}
            <div className="bg-[#131c2e] border border-[#1e2e4a] p-4 rounded-sm">
              <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Línea Telefónica Directa:</p>
              <p className="text-lg font-bold text-[#60a5fa] mt-0.5">987 654 321</p>
              <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-wide font-bold">Atención de Lunes a Sábado en nuestras 3 sedes.</p>
            </div>
          </div>

          {/* Right Column: Dynamic Form Container */}
          <div className="lg:col-span-7 bg-[#131c2e] border border-[#1e2e4a] rounded-sm p-6 md:p-8 shadow-lg relative">
            
            {/* Tabs with modern sliding indicator */}
            <div className="flex border border-[#1e2e4a] bg-[#0a1120] p-1 rounded-sm mb-6 relative">
              <button
                onClick={() => {
                  setActiveTab("book");
                  setError("");
                }}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-sm cursor-pointer relative z-10 transition-colors duration-300 ${
                  activeTab === "book" ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {activeTab === "book" && (
                  <motion.div
                    layoutId="activeFormTab"
                    className="absolute inset-0 bg-[#2563eb] rounded-sm -z-10 shadow-md"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                Reservar Cita
              </button>
              <button
                onClick={() => {
                  setActiveTab("search");
                  setError("");
                }}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-sm cursor-pointer relative z-10 transition-colors duration-300 ${
                  activeTab === "search" ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {activeTab === "search" && (
                  <motion.div
                    layoutId="activeFormTab"
                    className="absolute inset-0 bg-[#2563eb] rounded-sm -z-10 shadow-md"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                Consultar mi Cita
              </button>
            </div>

            {error && (
              <div className="bg-rose-950/40 border border-rose-800 text-rose-200 px-4 py-3 rounded-sm text-xs font-bold mb-4">
                {error}
              </div>
            )}

            <AnimatePresence mode="wait">
              {/* TAB 1: BOOKING FORM */}
              {activeTab === "book" && (
                <motion.div
                  key="book-tab"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-4"
                >
                  {success && createdBooking ? (
                    <div className="text-center py-12 space-y-6 animate-in fade-in duration-300">
                      <div className="w-14 h-14 bg-[#1a263e] text-[#60a5fa] border border-[#1e2e4a] rounded-full flex items-center justify-center mx-auto shadow-sm">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white uppercase">¡Cita Registrada Correctamente!</h3>
                        <p className="text-xs text-zinc-400 mt-2 max-w-md mx-auto">
                          Estimado(a) <span className="font-bold text-[#60a5fa]">{createdBooking.name}</span>, hemos agendado tu visita para la sede de <span className="font-bold text-[#60a5fa]">{createdBooking.branch}</span>.
                        </p>
                      </div>

                      <div className="bg-[#0a1120] border border-[#1e2e4a] rounded-sm p-4 max-w-sm mx-auto text-left text-xs space-y-2">
                        <div className="flex justify-between border-b border-[#1e2e4a]/50 pb-1.5">
                          <span className="text-zinc-400">Código de Cita:</span>
                          <span className="font-mono font-bold text-[#60a5fa]">{createdBooking.id}</span>
                        </div>
                        <div className="flex justify-between border-b border-[#1e2e4a]/50 pb-1.5">
                          <span className="text-zinc-400">Servicio:</span>
                          <span className="font-semibold text-white">{createdBooking.serviceType}</span>
                        </div>
                        <div className="flex justify-between border-b border-[#1e2e4a]/50 pb-1.5">
                          <span className="text-zinc-400">Fecha y Hora:</span>
                          <span className="font-semibold text-white">{createdBooking.date} - {createdBooking.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Sede Elegida:</span>
                          <span className="font-semibold text-white">{createdBooking.branch}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-zinc-400">
                        Un asesor de EPSA se comunicará al teléfono <span className="font-bold text-[#60a5fa]">{createdBooking.phone}</span> para reconfirmar tu cita.
                      </p>

                      <button
                        onClick={() => setSuccess(false)}
                        className="btn-primary py-2.5 px-6 rounded-sm cursor-pointer"
                      >
                        Agendar otra cita
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name input */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Nombre Completo *</label>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej: Juan Pérez Ramos"
                            className="w-full border border-[#1e2e4a] focus:border-[#3b82f6] focus:outline-none rounded-sm p-3 text-xs md:text-sm text-white bg-[#0a1120] placeholder-zinc-500 transition-colors"
                          />
                        </div>

                        {/* Phone input */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Teléfono Celular *</label>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Ej: 987654321"
                            className="w-full border border-[#1e2e4a] focus:border-[#3b82f6] focus:outline-none rounded-sm p-3 text-xs md:text-sm text-white bg-[#0a1120] placeholder-zinc-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Email input */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Correo Electrónico (Opcional)</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Ej: juan@gmail.com"
                            className="w-full border border-[#1e2e4a] focus:border-[#3b82f6] focus:outline-none rounded-sm p-3 text-xs md:text-sm text-white bg-[#0a1120] placeholder-zinc-500 transition-colors"
                          />
                        </div>

                        {/* Sede/Branch select */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Sede Autorizada *</label>
                          <select
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            className="w-full border border-[#1e2e4a] focus:border-[#3b82f6] focus:outline-none rounded-sm p-3 text-xs md:text-sm text-white bg-[#0a1120] transition-colors"
                          >
                            {BRANCHES.map((b) => (
                              <option key={b.name} value={b.name} className="bg-[#131c2e] text-white">
                                Sede {b.name} ({b.address.split(" ")[1] || b.address})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Service Type select */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Tipo de Servicio *</label>
                          <select
                            value={serviceType}
                            onChange={(e) => setServiceType(e.target.value)}
                            className="w-full border border-[#1e2e4a] focus:border-[#3b82f6] focus:outline-none rounded-sm p-3 text-xs md:text-sm text-white bg-[#0a1120] transition-colors"
                          >
                            <option value="Prueba de Manejo" className="bg-[#131c2e]">Prueba de Manejo (Test Drive)</option>
                            <option value="Mantenimiento Preventivo" className="bg-[#131c2e]">Mantenimiento Preventivo / Afinamiento</option>
                            <option value="Reparación General" className="bg-[#131c2e]">Servicio Técnico / Reparación</option>
                            <option value="Consulta Financiera" className="bg-[#131c2e]">Evaluación de Crédito Directo</option>
                            <option value="Personalización / Tuning" className="bg-[#131c2e]">Personalización, Carpas y Luces</option>
                          </select>
                        </div>

                        {/* Model of interest input */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Modelo de Interés</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={modelInterest}
                              onChange={(e) => setModelInterest(e.target.value)}
                              placeholder="Ej: Bajaj Torito RE GNV"
                              className="w-full border border-[#1e2e4a] focus:border-[#3b82f6] focus:outline-none rounded-sm p-3 pr-16 text-xs md:text-sm text-white bg-[#0a1120] placeholder-zinc-500 transition-colors"
                            />
                            {modelInterest && (
                              <button
                                type="button"
                                onClick={() => setModelInterest("")}
                                className="absolute right-2 top-3 text-[10px] font-bold text-zinc-300 hover:text-white bg-[#131c2e] border border-[#1e2e4a] px-1.5 py-0.5 rounded-sm cursor-pointer uppercase tracking-wider"
                              >
                                limpiar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Date selection */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                            Fecha de Visita *
                          </label>
                          <input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border border-[#1e2e4a] focus:border-[#3b82f6] focus:outline-none rounded-sm p-3 text-xs md:text-sm text-white bg-[#0a1120] transition-colors"
                          />
                        </div>

                        {/* Time selection */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-zinc-500" />
                            Hora Preferida *
                          </label>
                          <select
                            required
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full border border-[#1e2e4a] focus:border-[#3b82f6] focus:outline-none rounded-sm p-3 text-xs md:text-sm text-white bg-[#0a1120] transition-colors"
                          >
                            <option value="" className="bg-[#131c2e]">Selecciona la hora</option>
                            <option value="08:30 AM" className="bg-[#131c2e]">08:30 AM</option>
                            <option value="10:00 AM" className="bg-[#131c2e]">10:00 AM</option>
                            <option value="11:30 AM" className="bg-[#131c2e]">11:30 AM</option>
                            <option value="01:00 PM" className="bg-[#131c2e]">01:00 PM</option>
                            <option value="02:30 PM" className="bg-[#131c2e]">02:30 PM</option>
                            <option value="04:00 PM" className="bg-[#131c2e]">04:00 PM</option>
                            <option value="05:30 PM" className="bg-[#131c2e]">05:30 PM</option>
                          </select>
                        </div>
                      </div>

                      {/* Notes input */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Notas o Comentarios Adicionales</label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Ej: Deseo cotizar con cuota inicial de S/. 4,000..."
                          rows={2}
                          className="w-full border border-[#1e2e4a] focus:border-[#3b82f6] focus:outline-none rounded-sm p-3 text-xs md:text-sm text-white bg-[#0a1120] resize-none placeholder-zinc-500 transition-colors"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary text-white font-bold py-3.5 px-4 rounded-sm text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer text-center flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                      >
                        {loading ? "Registrando..." : "Confirmar Mi Cita en Tienda"}
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <p className="text-[10px] text-zinc-500 text-center uppercase tracking-wider">
                        * No se requiere ningún tipo de pago en línea para agendar.
                      </p>
                    </form>
                  )}
                </motion.div>
              )}

              {/* TAB 2: BOOKING LOOK-UP */}
              {activeTab === "search" && (
                <motion.div
                  key="search-tab"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-6"
                >
                  <form onSubmit={handleSearch} className="space-y-3">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                      Buscar citas registradas
                    </label>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                      Ingresa tu número de teléfono celular o nombre completo para visualizar tus reservas activas en cualquiera de nuestras sedes.
                    </p>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Buscar por teléfono o nombre..."
                          className="w-full border border-[#1e2e4a] focus:border-[#3b82f6] focus:outline-none rounded-sm py-3 pl-10 pr-4 text-xs text-white bg-[#0a1120] placeholder-zinc-500 transition-colors"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={searching}
                        className="btn-primary text-white px-5 rounded-sm font-bold text-xs uppercase tracking-wider cursor-pointer hover:shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                      >
                        {searching ? "Buscando..." : "Buscar"}
                      </button>
                    </div>
                  </form>

                  {/* Search Results Display */}
                  <div className="space-y-4 pt-2">
                    {searchResults.length > 0 ? (
                      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                        <p className="text-[10px] font-bold text-[#60a5fa] uppercase tracking-widest">
                          {searchResults.length} {searchResults.length === 1 ? "Cita Encontrada" : "Citas Encontradas"}
                        </p>
                        
                        {searchResults.map((b) => (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={b.id}
                            className="border border-[#1e2e4a] rounded-sm p-4 bg-[#0a1120] space-y-2 hover:border-[#3b82f6] transition-all"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-white text-sm">{b.name}</h4>
                                <p className="text-[10px] text-zinc-500 mt-0.5">ID: {b.id}</p>
                              </div>
                              <span className="bg-[#1a263e] text-[#60a5fa] border border-[#1e2e4a] text-[10px] font-bold px-2.5 py-0.5 rounded-sm uppercase">
                                {b.status || "Confirmado"}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 pt-2.5 text-xs text-zinc-300 border-t border-[#1e2e4a]/60">
                              <div>
                                <span className="text-zinc-500 text-[10px] block uppercase font-bold tracking-wider">Servicio</span>
                                <span className="font-semibold text-white">{b.serviceType}</span>
                              </div>
                              <div>
                                <span className="text-zinc-500 text-[10px] block uppercase font-bold tracking-wider">Sede</span>
                                <span className="font-semibold text-white">Sede {b.branch}</span>
                              </div>
                              <div>
                                <span className="text-zinc-500 text-[10px] block uppercase font-bold tracking-wider">Fecha</span>
                                <span className="font-medium text-white">{b.date}</span>
                              </div>
                              <div>
                                <span className="text-zinc-500 text-[10px] block uppercase font-bold tracking-wider">Hora</span>
                                <span className="font-medium text-white">{b.time}</span>
                              </div>
                            </div>

                            {b.modelInterest && b.modelInterest !== "General" && (
                              <div className="bg-[#131c2e] px-2.5 py-1 rounded-sm text-[10px] text-[#60a5fa] border border-[#1e2e4a] inline-block font-bold uppercase">
                                Modelo: {b.modelInterest}
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    ) : searchQuery ? (
                      <div className="text-center py-8 text-zinc-400">
                        <p className="text-sm font-semibold">No se encontraron citas programadas.</p>
                        <p className="text-xs mt-1">Verifica el número de celular e inténtalo de nuevo.</p>
                      </div>
                    ) : (
                      <div className="border border-dashed border-[#1e2e4a] rounded-sm p-8 text-center text-zinc-400 text-xs space-y-1">
                        <p className="font-semibold">Búsqueda segura de citas</p>
                        <p>Tus datos se manejan de manera confidencial y privada.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </div>
    </section>
  );
}
