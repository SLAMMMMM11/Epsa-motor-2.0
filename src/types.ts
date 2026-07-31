export interface MototaxiModel {
  id: string;
  name: string;
  tagline: string;
  basePrice: number; // Soles (S/)
  engine: string;
  power: string;
  torque?: string;
  fuelTypes: string[];
  capacity: string;
  payload?: string;
  description: string;
  highlights: string[];
  specs: {
    label: string;
    value: string;
  }[];
  imageUrl: string;
  destacado?: boolean;
  colors?: string[];
  /** pasajeros | carga | trabajo — para filtros del catálogo */
  category?: "pasajeros" | "carga" | "trabajo";
}

export interface Booking {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  branch: "Puente Piedra" | "Comas" | "Ventanilla";
  serviceType:
    | "Prueba de Manejo"
    | "Consulta de Compra"
    | "Consulta Financiera"
    | "Cotización en Sede";
  modelInterest?: string;
  notes?: string;
  status?: string;
  createdAt?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Branch {
  name: string;
  imageUrl: string;
  imageAlt: string;
  address: string;
  reference: string;
  phone: string;
  email: string;
  scheduleWeek: string;
  scheduleSunday: string;
  mapsUrl: string;
  embedQuery: string;
}

export interface Testimonial {
  name: string;
  association: string;
  modelName: string;
  avatarImage: string;
  rating: number;
  text: string;
  tag?: string;
}

export interface FaqItem {
  /** Pregunta tal como la formularía un cliente, no en lenguaje comercial. */
  question: string;
  /** Respuesta en texto plano: también alimenta el JSON-LD de FAQPage. */
  answer: string;
}
