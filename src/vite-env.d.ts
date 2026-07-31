/// <reference types="vite/client" />

/**
 * Variables de entorno que llegan al navegador.
 *
 * Solo las que empiezan por VITE_ se incluyen en el bundle, así que aquí no
 * puede aparecer ningún secreto: GEMINI_API_KEY, SUPABASE_SERVICE_ROLE_KEY y
 * BOOKINGS_ADMIN_TOKEN viven solo en el servidor y no llevan ese prefijo.
 */
interface ImportMetaEnv {
  /** Identificador de medición de GA4 (G-XXXXXXX). Vacía = sin analítica. */
  readonly VITE_GA_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
