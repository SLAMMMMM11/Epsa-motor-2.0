import type { Config } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { validarLead, type LeadPayload } from "../../shared/leads";

/**
 * Registro de leads en Supabase.
 *
 * Sustituye a la función bookings, que guardaba en Netlify Blobs. Escribe con
 * la service_role key desde el servidor: así la credencial nunca llega al
 * navegador y la tabla puede quedar cerrada con RLS sin políticas públicas.
 *
 * El navegador abre WhatsApp de forma sincrónica y llama aquí en paralelo, así
 * que esta función nunca debe bloquear al usuario: si algo falla, el mensaje de
 * WhatsApp ya salió y el negocio recibe al cliente igual.
 */

const TABLA = "leads";
const LIMITE_LISTADO = 100;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

function supabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

/** La lectura expone datos personales: exige token, y queda cerrada si no está configurado. */
function autorizado(req: Request): boolean {
  const esperado = process.env.BOOKINGS_ADMIN_TOKEN;
  if (!esperado) return false;
  const recibido = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  return recibido.length > 0 && recibido === esperado;
}

async function crearLead(req: Request): Promise<Response> {
  let payload: Partial<LeadPayload>;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Cuerpo de la petición inválido." }, 400);
  }

  const problema = validarLead(payload);
  if (problema) return json({ error: problema }, 400);

  const db = supabase();
  if (!db) {
    console.error("SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no están configuradas.");
    return json({ error: "El registro de leads no está disponible." }, 503);
  }

  const lead = payload as LeadPayload;
  // Los nombres de columna siguen el esquema que ya existía en Supabase:
  // nombre_completo en vez de nombre, y fecha_registro (default now()) en
  // vez de created_at.
  const { error } = await db.from(TABLA).insert({
    id: lead.id,
    tipo: lead.tipo,
    nombre_completo: lead.nombre.trim(),
    telefono: lead.telefono.trim(),
    origen: "web",
    estado: "nuevo",
    modelo: lead.modelo?.trim() || null,
    comentario: lead.comentario?.trim() || null,
    distrito: lead.distrito?.trim() || null,
    forma_compra: lead.forma_compra?.trim() || null,
    sede: lead.sede?.trim() || null,
    fecha: lead.fecha || null,
    hora: lead.hora?.trim() || null,
    motivo: lead.motivo?.trim() || null,
  });

  if (error) {
    // Reenviar el mismo lead no debe duplicar la fila ni parecer un fallo.
    if (error.code === "23505") return json({ success: true, duplicado: true }, 200);
    console.error("Error insertando el lead en Supabase:", error.message);
    return json({ error: "No se pudo registrar el lead." }, 500);
  }

  return json({ success: true, id: lead.id }, 201);
}

async function listarLeads(req: Request): Promise<Response> {
  if (!autorizado(req)) return json({ error: "No autorizado." }, 401);

  const db = supabase();
  if (!db) return json({ error: "El registro de leads no está disponible." }, 503);

  const params = new URL(req.url).searchParams;
  let consulta = db
    .from(TABLA)
    .select("*")
    .order("fecha_registro", { ascending: false })
    .limit(LIMITE_LISTADO);

  const tipo = params.get("tipo");
  if (tipo === "cotizacion" || tipo === "cita") consulta = consulta.eq("tipo", tipo);

  const estado = params.get("estado");
  if (estado) consulta = consulta.eq("estado", estado);

  const { data, error } = await consulta;
  if (error) {
    console.error("Error leyendo leads de Supabase:", error.message);
    return json({ error: "No se pudieron leer los leads." }, 500);
  }

  return json(data ?? []);
}

export default async (req: Request) => {
  if (req.method === "POST") return crearLead(req);
  if (req.method === "GET") return listarLeads(req);
  return json({ error: "Método no permitido." }, 405);
};

export const config: Config = {
  path: "/api/leads",
};
