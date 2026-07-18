export interface MototaxiModel {
  id: string;
  name: string;
  tagline: string;
  basePrice: number; // in Peruvian Soles (S/.)
  engine: string;
  power: string;
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
}

export interface Booking {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  branch: "Puente Piedra" | "Comas" | "Ventanilla";
  serviceType: "Prueba de Manejo" | "Mantenimiento Preventivo" | "Reparación General" | "Consulta Financiera" | "Personalización / Tuning";
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
  initials: string;
  rating: number;
  text: string;
  avatarBg?: string;
  tag?: string;
}

