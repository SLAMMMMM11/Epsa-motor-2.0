import type { Config } from "@netlify/functions";
import { GoogleGenAI } from "@google/genai";
import {
  CHAT_FALLBACK_REPLY,
  CHAT_MODEL,
  EPSA_SYSTEM_INSTRUCTION,
} from "../../shared/chat-prompt";

interface ChatMessage {
  role: string;
  content: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

export default async (req: Request) => {
  if (req.method !== "POST") {
    return json({ error: "Método no permitido." }, 405);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY no está configurada en el entorno.");
    return json({ error: "El asesor digital no está disponible en este momento." }, 503);
  }

  let messages: ChatMessage[] | undefined;
  try {
    ({ messages } = await req.json());
  } catch {
    return json({ error: "Cuerpo de la petición inválido." }, 400);
  }

  if (!messages || !Array.isArray(messages)) {
    return json({ error: "El historial de mensajes es obligatorio." }, 400);
  }

  // Gemini espera role 'user' | 'model'; el cliente envía 'user' | 'assistant'.
  const contents = messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }));

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { "User-Agent": "aistudio-build" } },
    });

    const response = await ai.models.generateContent({
      model: CHAT_MODEL,
      contents,
      config: {
        systemInstruction: EPSA_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return json({ reply: response.text || CHAT_FALLBACK_REPLY });
  } catch (error) {
    // El detalle del error se queda en los logs de Netlify: puede incluir
    // fragmentos de la petición y no debe viajar al navegador.
    console.error("Error con la API de Gemini:", error);
    return json({ error: "Ocurrió un error en el servidor de inteligencia artificial." }, 500);
  }
};

export const config: Config = {
  path: "/api/chat",
};
