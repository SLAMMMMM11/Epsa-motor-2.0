import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

/**
 * Reservas de visita.
 *
 * Sustituye la escritura en bookings.json de server.ts: el sistema de
 * archivos de una función serverless es efímero, así que los datos se
 * guardan en Netlify Blobs. Cada reserva es una clave independiente, lo
 * que evita perder registros si entran dos a la vez.
 */

const STORE_NAME = "bookings";
const LIST_LIMIT = 20;

interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  branch: string;
  serviceType: string;
  modelInterest: string;
  notes: string;
  createdAt: string;
  status: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

/**
 * La lectura expone nombres y teléfonos, así que exige un token.
 * Sin BOOKINGS_ADMIN_TOKEN configurado el endpoint queda cerrado:
 * preferimos negar por defecto antes que publicar datos personales.
 */
function isAuthorized(req: Request): boolean {
  const expected = process.env.BOOKINGS_ADMIN_TOKEN;
  if (!expected) return false;

  const header = req.headers.get("authorization") ?? "";
  const provided = header.replace(/^Bearer\s+/i, "").trim();
  return provided.length > 0 && provided === expected;
}

async function createBooking(req: Request): Promise<Response> {
  let payload: Partial<Booking>;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Cuerpo de la petición inválido." }, 400);
  }

  const { name, phone, email, date, time, branch, serviceType, modelInterest, notes } = payload;

  if (!name || !phone || !date || !time || !branch || !serviceType) {
    return json({ error: "Por favor complete todos los campos obligatorios." }, 400);
  }

  const booking: Booking = {
    id: `BKG-${Date.now()}`,
    name,
    phone,
    email: email || "",
    date,
    time,
    branch,
    serviceType,
    modelInterest: modelInterest || "General",
    notes: notes || "",
    createdAt: new Date().toISOString(),
    status: "Confirmado",
  };

  await getStore(STORE_NAME).setJSON(booking.id, booking);

  return json({ success: true, booking }, 201);
}

async function listBookings(req: Request): Promise<Response> {
  if (!isAuthorized(req)) {
    return json({ error: "No autorizado." }, 401);
  }

  const store = getStore(STORE_NAME);
  const { blobs } = await store.list();

  // Las claves son BKG-<epoch ms>, así que el orden lexicográfico
  // coincide con el cronológico.
  const keys = blobs
    .map((blob) => blob.key)
    .sort()
    .reverse();

  const term = new URL(req.url).searchParams.get("query")?.toLowerCase();

  const loaded = await Promise.all(
    keys.map((key) => store.get(key, { type: "json" }) as Promise<Booking | null>)
  );
  const bookings = loaded.filter((booking): booking is Booking => booking !== null);

  if (term) {
    return json(
      bookings.filter(
        (booking) =>
          booking.phone.includes(term) ||
          booking.email.toLowerCase().includes(term) ||
          booking.name.toLowerCase().includes(term)
      )
    );
  }

  return json(bookings.slice(0, LIST_LIMIT));
}

export default async (req: Request) => {
  if (req.method === "POST") return createBooking(req);
  if (req.method === "GET") return listBookings(req);
  return json({ error: "Método no permitido." }, 405);
};

export const config: Config = {
  path: "/api/bookings",
};
