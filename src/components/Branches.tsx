import { BRANCHES } from "../data";
import { MapPin, Phone, Clock, Mail, ExternalLink, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

export default function Branches() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section className="py-20 bg-[#060a13] text-white relative overflow-hidden" id="branches-section">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Title Block */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#60a5fa] text-xs font-bold uppercase tracking-widest block mb-2"
          >
            Canales de Venta y Servicio
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight leading-tight"
          >
            Nuestras Sedes Autorizadas
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 mt-4 text-xs md:text-sm leading-relaxed font-sans"
          >
            Visítanos para conocer las unidades, realizar una prueba de manejo (test drive), pre-evaluar tu crédito directo o recibir mantenimiento especializado.
          </motion.p>
        </div>

        {/* Branches Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {BRANCHES.map((branch) => (
            <motion.div
              key={branch.name}
              variants={cardVariants}
              className="bg-[#131c2e] border border-[#1e2e4a] rounded-sm p-6 md:p-8 space-y-6 flex flex-col justify-between hover:border-[#3b82f6] hover:shadow-[0_0_20px_rgba(59,130,246,0.12)] transition-all duration-300 group relative overflow-hidden"
            >
              <div className="space-y-4">
                {/* Branch Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[#60a5fa] text-[9px] uppercase font-bold tracking-widest">Sede Oficial</span>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      {branch.name}
                    </h3>
                  </div>
                  <span className="bg-[#1a263e] text-[#60a5fa] border border-[#1e2e4a] px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider">
                    Abierto
                  </span>
                </div>

                {/* Information blocks */}
                <div className="space-y-3.5 pt-2 text-xs text-zinc-300">
                  {/* Address */}
                  <div className="flex gap-3">
                    <MapPin className="w-4 h-4 text-[#60a5fa] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">{branch.address}</p>
                      <p className="text-zinc-400 text-[11px] mt-0.5">{branch.reference}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-3 items-center">
                    <Phone className="w-4 h-4 text-[#60a5fa] shrink-0" />
                    <span className="font-medium text-white">{branch.phone}</span>
                  </div>

                  {/* Email */}
                  <div className="flex gap-3 items-center">
                    <Mail className="w-4 h-4 text-[#60a5fa] shrink-0" />
                    <span className="text-zinc-300">{branch.email}</span>
                  </div>

                  {/* Schedules */}
                  <div className="flex gap-3 border-t border-[#1e2e4a]/60 pt-3.5">
                    <Clock className="w-4 h-4 text-[#60a5fa] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-medium text-white">{branch.scheduleWeek}</p>
                      <p className="text-zinc-400 text-[11px]">{branch.scheduleSunday}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 z-10">
                <a
                  href={branch.mapsUrl}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="btn-secondary w-full py-2.5 px-4 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm group-hover:border-[#2563eb]/40 group-hover:bg-[#1a263e] transition-colors"
                >
                  Ver en Google Maps
                  <ExternalLink className="w-3.5 h-3.5 text-[#60a5fa] group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Brand Alliance Trust Element */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 bg-[#131c2e] border border-[#1e2e4a] p-6 md:p-8 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto shadow-md"
        >
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 rounded-full bg-[#1a263e] border border-[#1e2e4a] flex items-center justify-center text-[#60a5fa] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">Garantía EPSA de 20,000 Kilómetros</h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-md leading-relaxed font-sans">
                Todas las unidades nuevas cuentan con el respaldo de taller oficial de EPSA Motor y un stock completo de repuestos originales Bajaj.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 border-t md:border-t-0 md:border-l border-[#1e2e4a] pt-4 md:pt-0 md:pl-6 text-xs text-zinc-400 self-stretch items-center">
            <div className="text-center md:text-left">
              <p className="font-bold uppercase tracking-wider text-[#60a5fa]">¿Consultas o Emergencias?</p>
              <p className="mt-1 text-[11px]">Llámanos a nuestro taller central: <span className="text-white font-bold">987-654-321</span></p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
