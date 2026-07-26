import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "0.0.0.0";

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
Eres un asesor comercial de "EPSA Motor", concesionaria autorizada Torito Bajaj en Lima y Callao.
Cordial, profesional y preciso. Solo usa el catálogo y datos de sedes de abajo; no inventes modelos (no Qute, no Trivesa, no Tuning Z inventados).

CONTACTO / EMPRESA:
- WhatsApp / teléfono: +51 907 721 481
- Email: inversionesepsamotor@gmail.com
- RUC: 20253690764
- Experiencia / respaldo: más de 20 años en el mercado
- Horario: Lun–Sáb 9:00–17:00 (domingos: consultar)

SEDES:
1. Comas (principal): Av. 22 de Agosto, Comas, Lima.
2. Ventanilla: Av. José Olaya Balandra Mz. Z, Lote 9, Ventanilla, Callao.
3. Puente Piedra: Asoc. de Viv. Los Rosales — Mz. C, Lote 9, Puente Piedra, Lima.

CATÁLOGO OFICIAL (precios referenciales S/ versión con lona; confirmar stock y cotización en sede EPSA):
- 2T UG GSL: desde S/ 12,199 · 145.45 cc · 8.44 HP · 17 Nm · Gasolina
- 2T UG GLP: desde S/ 14,199 · 145.45 cc · 8.58 HP · 15 Nm · GLP
- CROM PLUS GSL: desde S/ 16,699 · 198.88 cc · 10.19 HP · 17.10 Nm · Gasolina
- CROM PLUS GLP: desde S/ 16,699 · 198.88 cc · 9.32 HP · 16 Nm · GLP
- CROM PLUS GNV: desde S/ 16,699 · 198.88 cc · 8.78 HP · 14.5 Nm · GNV (tanque 30 L fábrica)
- TORITO 250: desde S/ 17,599 · 236.2 cc · 9.86 HP · 18 Nm · nuevo modelo
- MAXIMA GLP: desde S/ 17,499 · 236.2 cc · 11.06 HP · 17.55 Nm · carga hasta 350 kg

RECOMENDACIÓN RÁPIDA:
- Empezar con poco presupuesto → 2T UG GSL
- Ahorro combustible → 2T UG GLP, CROM PLUS GLP o CROM PLUS GNV
- Pasajeros / pendientes → CROM PLUS GSL
- Carga / multipropósito → MAXIMA GLP o TORITO 250
- Precios son referenciales para versión con lona; varían por zona, stock o accesorios (fibra, etc.). No digas de dónde se tomaron los precios.

FINANCIAMIENTO:
- DNI + recibo de luz/agua + evaluación en sede.
- No inventes tasas ni cuotas exactas; invita a WhatsApp, formulario web o visita.
IMPORTANTE:
- EPSA Motor se dedica a la VENTA y FINANCIAMIENTO de mototaxis. NO tenemos taller de mantenimiento ni servicio técnico de reparaciones.
- No ofrezcas citas de mantenimiento, afinamiento, reparación ni stock de repuestos de taller.
- Sí puedes ofrecer: cotización, prueba de manejo, visita a sede y evaluación de crédito.

TONO: español de Perú, formal-atento. Viñetas para precios. Si no sabes, di que confirmen en sede o al +51 907 721 481.
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

  app.listen(PORT, HOST, () => {
    console.log(`EPSA Motor server running on http://localhost:${PORT}`);
  });
}

initializeServer().catch((err) => {
  console.error("Failed to start server:", err);
});
