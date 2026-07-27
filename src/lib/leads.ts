import { CONTACT } from "../data";
import { mensajeWhatsApp, type LeadPayload } from "../../shared/leads";

/**
 * Abre WhatsApp con el mensaje ya redactado y registra el lead en paralelo.
 *
 * El orden no es casual. `window.open` tiene que ejecutarse de forma
 * sincrónica dentro del gesto del usuario: si se espera antes a una petición
 * de red, el navegador rompe la cadena del clic y bloquea la pestaña. Por eso
 * WhatsApp se abre primero y el registro va después, sin `await` y con
 * `keepalive` para que la petición sobreviva al cambio de pestaña.
 *
 * WhatsApp es el canal primario y Supabase el registro: si el registro falla,
 * el mensaje ya salió y el negocio atiende al cliente igual.
 */
export function enviarLead(lead: LeadPayload): string {
  const telefono = CONTACT.phoneTel.replace(/\D/g, "");
  const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensajeWhatsApp(lead))}`;

  const ventana = window.open(url, "_blank", "noopener,noreferrer");
  if (!ventana) window.location.href = url;

  void fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
    keepalive: true,
  }).catch((error) => {
    console.error("No se pudo registrar el lead:", error);
  });

  return url;
}

/** Identificador del lead. El mismo valor viaja a WhatsApp y a Supabase. */
export function nuevoLeadId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Navegadores antiguos sin crypto.randomUUID.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
