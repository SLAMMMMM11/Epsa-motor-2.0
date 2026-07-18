import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK securely on the server
// The platform automatically injects GEMINI_API_KEY.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Bookings database path
const BOOKINGS_FILE = path.join(process.cwd(), "bookings.json");

// Ensure bookings database exists
if (!fs.existsSync(BOOKINGS_FILE)) {
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify([], null, 2));
}

// Helper to read bookings
function readBookings(): any[] {
  try {
    const data = fs.readFileSync(BOOKINGS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Helper to write bookings
function writeBookings(bookings: any[]) {
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
}

// API Endpoints
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Create booking
app.post("/api/bookings", (req, res) => {
  const { name, phone, email, date, time, branch, serviceType, modelInterest, notes } = req.body;

  if (!name || !phone || !date || !time || !branch || !serviceType) {
    return res.status(400).json({ error: "Por favor complete todos los campos obligatorios." });
  }

  const bookings = readBookings();
  const newBooking = {
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

  bookings.push(newBooking);
  writeBookings(bookings);

  res.status(201).json({ success: true, booking: newBooking });
});

// Get bookings (filtered by phone or email for privacy, or all if none provided - helpful for client check)
app.get("/api/bookings", (req, res) => {
  const { query } = req.query;
  const bookings = readBookings();

  if (query) {
    const term = String(query).toLowerCase();
    const filtered = bookings.filter(
      (b) =>
        b.phone.includes(term) ||
        b.email.toLowerCase().includes(term) ||
        b.name.toLowerCase().includes(term)
    );
    return res.json(filtered);
  }

  // Return last 20 bookings by default (for admin demonstration)
  res.json(bookings.slice(-20).reverse());
});

// Chat endpoint (Gemini integration)
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "El historial de mensajes es obligatorio." });
  }

  try {
    // Format conversation history for Gemini
    // Gemini chat API uses specific formats. We can map standard {role, content} to Gemini chat format:
    // role: 'user' | 'model'
    // contents: { role: string, parts: [{ text: string }] }[]
    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const systemInstruction = `
Eres un asesor comercial experto y profesional de "EPSA Motor Torijo Bajaj", el concesionario oficial líder y autorizado de motocars Torito Bajaj en el cono norte de Lima y Callao.
Tu propósito es atender a los clientes con la máxima cordialidad, respeto y profesionalismo, brindándoles información precisa y confiable para facilitar la compra de su mototaxi Bajaj o la programación de su servicio técnico en una de nuestras 3 sedes autorizadas.

NUESTRAS SEDES EN LIMA/CALLAO:
1. Sede Puente Piedra:
   - Dirección: Av. Puente Piedra 450 (Cerca a la Plaza de Armas de Puente Piedra, Lima).
   - Horario: Lunes a Sábado de 8:00 AM a 7:00 PM, Domingos de 9:00 AM a 1:00 PM.
2. Sede Comas:
   - Dirección: Av. Túpac Amaru 3450 (Cerca al paradero Correo / Metro de Belaunde, Comas, Lima).
   - Horario: Lunes a Sábado de 8:00 AM a 7:00 PM, Domingos de 9:00 AM a 1:00 PM.
3. Sede Ventanilla:
   - Dirección: Av. La Playa Mz. C Lote 15 (Frente al Plaza Vea de Ventanilla, Callao).
   - Horario: Lunes a Sábado de 8:00 AM a 7:00 PM, Domingos de 9:00 AM a 1:00 PM.

NUESTRO CATÁLOGO DE MOTOTAXIS TORITO BAJAJ:
- Bajaj Torito RE 4S:
  - Precio estimado: Desde S/. 13,500 (Versión Gasolinera) hasta S/. 14,800 (Versión GNV o GLP original).
  - Características: Motor de 198.88 cc, tecnología de triple bujía (DTS-i) para un excelente rendimiento y ahorro de combustible, enfriado por aire, espacio para 3 pasajeros, excelente durabilidad.
- Bajaj Torito Chrome:
  - Precio estimado: S/. 15,400.
  - Características: Todo el poder de la versión RE 4S pero con acabados cromados, asientos ergonómicos, amortiguadores de gas reforzados y tablero premium.
- Bajaj Maxima Cargo:
  - Precio estimado: S/. 16,200 (Chasis o Tolva).
  - Características: Motor de 236 cc, embrague húmedo de larga duración, capacidad de carga útil real de 500 kg, ideal para negocios de reparto y carga.
- Bajaj Torito RE 2T:
  - Precio estimado: S/. 12,900.
  - Características: Motor de 2 tiempos, excelente torque para subidas empinadas, mantenimiento sencillo y repuestos económicos.

NUESTRO PLAN DE FINANCIAMIENTO (Crédito Directo y Alianzas):
- Financiamiento directo con EPSA Motor (con cuota inicial flexible según evaluación).
- Alianzas estratégicas con Financiera Efectiva, CrediScotia y MiCasita para brindar las mejores tasas del mercado.
- Requisitos básicos: DNI vigente, recibo de luz o agua, y sustento de ingresos o evaluación domiciliaria. Brindamos asesoría completa para que los clientes inicien su negocio propio de transporte.

SERVICIOS ADICIONALES:
- Venta de Repuestos Originales Bajaj (filtros, cables, zapatas, cilindros, aceite Bajaj).
- Servicio Técnico Autorizado: Mantenimiento preventivo, afinamiento y reparación de motor con repuestos 100% originales.
- Trámite Express: Nos encargamos de tramitar la placa de rodaje y tarjeta de propiedad gratis con la compra de tu moto.
- Accesorios y Customización: Instalación de luces LED, carpas personalizadas y tapicería para mayor comodidad.

TONO DE COMUNICACIÓN:
- Sé sumamente cordial, educado y profesional. Habla en español de Perú pero de manera corporativa y atenta. Utiliza términos respetuosos como "estimado cliente", "señor", "señora" o "socio". No utilices jergas informales ni términos demasiado informales.
- Brinda respuestas de forma estructurada con viñetas claras cuando se pregunten especificaciones o precios.
- Invita siempre al cliente a registrar sus datos para agendar una cita o pre-evaluar su crédito mediante el formulario de reservas de la web, o a visitar nuestras sedes físicas.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "Disculpa, amigo. Tuve un pequeño contratiempo con mi sistema de Bajaj. ¿Podrías repetirme la consulta?";
    res.json({ reply });
  } catch (err: any) {
    console.error("Error with Gemini API:", err);
    res.status(500).json({
      error: "Ocurrió un error en el servidor de inteligencia artificial.",
      details: err.message,
    });
  }
});

// Configure serving of Vite app
async function initializeServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted.");
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving production static files from dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EPSA Motor Torijo server running on http://localhost:${PORT}`);
  });
}

initializeServer().catch((err) => {
  console.error("Failed to start server:", err);
});
