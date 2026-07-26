import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import {
  CHAT_FALLBACK_REPLY,
  CHAT_MODEL,
  EPSA_SYSTEM_INSTRUCTION,
} from "./shared/chat-prompt";

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

    const response = await ai.models.generateContent({
      model: CHAT_MODEL,
      contents: contents,
      config: {
        systemInstruction: EPSA_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const reply = response.text || CHAT_FALLBACK_REPLY;
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
