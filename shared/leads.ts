/**
 * Modelo de lead compartido entre el navegador y las funciones serverless.
 *
 * Todo lo que sale de la web hacia WhatsApp queda registrado como lead:
 * las cotizaciones del dock flotante y las citas del formulario de visita.
 * El mismo id viaja al mensaje de WhatsApp y a Supabase, de modo que el
 * asesor puede casar la conversación con la fila del panel de administración.
 */

export type LeadTipo = "cotizacion" | "cita";

export interface LeadPayload {
  id: string;
  tipo: LeadTipo;
  nombre: string;
  telefono: string;
  modelo?: string;
  comentario?: string;
  /** Solo cotización */
  distrito?: string;
  forma_compra?: string;
  /** Solo cita */
  sede?: string;
  fecha?: string;
  hora?: string;
  motivo?: string;
}

/** Referencia corta y legible que se enseña en WhatsApp: LD-8F3K2A */
export function referenciaCorta(id: string): string {
  return `LD-${id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;
}

/** Agrupa el celular en bloques de 3: 987 654 321 */
export function formatearTelefono(digitos: string): string {
  return digitos.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
}

/** Fecha ISO (yyyy-mm-dd) a texto legible en español, sin depender de la zona horaria. */
export function fechaLegible(iso: string): string {
  const [anio, mes, dia] = iso.split("-").map(Number);
  if (!anio || !mes || !dia) return iso;
  const fecha = new Date(anio, mes - 1, dia);
  return fecha.toLocaleDateString("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const linea = (etiqueta: string, valor?: string) =>
  valor && valor.trim() ? `${etiqueta}: ${valor.trim()}` : null;

/**
 * Construye el mensaje que verá el asesor en WhatsApp.
 * La cabecera va en mayúsculas para que el tipo de lead se distinga de un
 * vistazo cuando llegan varios seguidos.
 */
export function mensajeWhatsApp(lead: LeadPayload): string {
  const cabecera =
    lead.tipo === "cita" ? "*CITA — EPSA MOTOR*" : "*COTIZACIÓN — EPSA MOTOR*";

  const cuerpo =
    lead.tipo === "cita"
      ? [
          linea("Nombre", lead.nombre),
          linea("Celular", `+51 ${formatearTelefono(lead.telefono)}`),
          linea("Fecha", lead.fecha ? fechaLegible(lead.fecha) : undefined),
          linea("Hora", lead.hora),
          linea("Sede", lead.sede),
          linea("Motivo", lead.motivo),
          linea("Modelo de interés", lead.modelo),
          linea("Comentario", lead.comentario),
        ]
      : [
          linea("Nombre", lead.nombre),
          linea("Celular", `+51 ${formatearTelefono(lead.telefono)}`),
          linea("Modelo de interés", lead.modelo || "Necesito recomendación"),
          linea("Forma de compra", lead.forma_compra),
          linea("Distrito", lead.distrito),
          linea("Comentario", lead.comentario),
        ];

  return [cabecera, "", ...cuerpo.filter(Boolean), "", `Ref: ${referenciaCorta(lead.id)}`].join(
    "\n"
  );
}

/** Valida lo mínimo imprescindible antes de insertar en Supabase. */
export function validarLead(lead: Partial<LeadPayload>): string | null {
  if (!lead.id) return "Falta el identificador del lead.";
  if (lead.tipo !== "cotizacion" && lead.tipo !== "cita") return "Tipo de lead inválido.";
  if (!lead.nombre?.trim()) return "El nombre es obligatorio.";
  if (!lead.telefono?.trim()) return "El celular es obligatorio.";
  if (lead.tipo === "cita" && (!lead.fecha || !lead.hora || !lead.sede)) {
    return "Una cita necesita fecha, hora y sede.";
  }
  return null;
}
