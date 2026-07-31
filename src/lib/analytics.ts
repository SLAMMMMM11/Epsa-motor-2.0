/**
 * Analítica opcional (Google Analytics 4).
 *
 * No se carga nada mientras VITE_GA_ID esté vacía, así que el proyecto
 * funciona igual sin configurarla y no se paga su peso hasta que se quiera.
 *
 * Cuando está activa, el script se pide después del evento `load`: durante el
 * primer pintado la conexión debe ser para el contenido, no para la medición.
 *
 * Para activarla:
 *   1. Crear una propiedad GA4 en analytics.google.com
 *   2. Copiar el identificador de medición (empieza por G-)
 *   3. Añadir VITE_GA_ID=G-XXXXXXX en el panel de Netlify y en .env
 *   4. Volver a desplegar (las variables se leen al compilar)
 */

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function initAnalytics() {
  if (!GA_ID || typeof window === "undefined") return;

  const cargar = () => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // gtag depende de `arguments`, no acepta rest params.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
  };

  if (document.readyState === "complete") cargar();
  else window.addEventListener("load", cargar, { once: true });
}

/**
 * Evento de conversión. La métrica que importa aquí no son las visitas sino
 * cuántas acaban escribiendo por WhatsApp, así que se registra cada lead.
 * Si la analítica no está configurada, no hace nada.
 */
export function registrarEventoLead(tipo: string, modelo?: string) {
  window.gtag?.("event", "lead_whatsapp", {
    tipo_lead: tipo,
    modelo: modelo || "sin especificar",
  });
}
