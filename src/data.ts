import { MototaxiModel, Branch, Testimonial, FaqItem } from "./types";

/**
 * Contacto real EPSA Motor
 */
export const CONTACT = {
  phoneDisplay: "+51 907 721 481",
  phoneTel: "+51907721481",
  email: "inversionesepsamotor@gmail.com",
  ruc: "20253690764",
  /** Texto oficial de respaldo por antigüedad (pedido del cliente) */
  yearsInMarket: 20,
  yearsInMarketLabel: "más de 20 años en el mercado",
  yearsInMarketShort: "+20 años",
  hoursWeek: "Lunes a Sábado de 9:00 AM a 5:00 PM",
  hoursSunday: "Domingos: consultar por WhatsApp o en sede",
  whatsappMessage:
    "Hola EPSA Motor, estoy interesado en cotizar un mototaxi Torito Bajaj y conocer los planes de crédito. ¿Me podrían asesorar?",
  get whatsappUrl() {
    return `https://wa.me/51907721481?text=${encodeURIComponent(this.whatsappMessage)}`;
  },
};

const IMG = "/assets/media/images/torito-pe";

/**
 * Catálogo comercial EPSA Motor (Torito Bajaj).
 * Precios referenciales: versión con lona. Pueden variar por zona, stock o accesorios.
 */
export const MOTOTAXI_MODELS: MototaxiModel[] = [
  {
    id: "2t-ug-gsl",
    name: "Torito 2T UG GSL",
    tagline: "¡Bienvenido al mundo del ahorro! · Gasolina",
    basePrice: 12199,
    engine: "2 tiempos UG GSL",
    power: "8.44 HP @ 4000 RPM",
    torque: "17 Nm @ 3000 RPM",
    fuelTypes: ["Gasolina"],
    capacity: "Pasajeros + conductor",
    description:
      "Si eres nuevo en el mundo de los motocarros, el 2T UG es tu mototaxi: bajo costo de mantenimiento y gran rendimiento para recuperar tu inversión en poco tiempo. Sistema Autolube patentado por Bajaj para una lubricación óptima del motor.",
    highlights: [
      "Entrada de precio más accesible del catálogo",
      "Sistema Autolube Bajaj",
      "Motor 2T 145.45 cc · 8.44 HP",
      "Torque 17 Nm ideal para empezar",
    ],
    specs: [
      { label: "Motor", value: "2 tiempos UG GSL" },
      { label: "Cilindrada", value: "145.45 cc" },
      { label: "Potencia", value: "8.44 HP a 4000 ± 250 RPM" },
      { label: "Torque", value: "17 Nm a 3000 ± 250 RPM" },
      { label: "Transmisión", value: "Manual 4 adelante + 1 reversa" },
      { label: "Tanque", value: "8 litros" },
      { label: "Velocidad máx.", value: "60 km/h" },
      { label: "Peso", value: "340 kg" },
      { label: "Dimensiones", value: "2658 × 1300 × 1700 mm" },
    ],
    imageUrl: `${IMG}/2t-ug-gsl.png`,
    destacado: true,
    category: "pasajeros",
  },
  {
    id: "2t-ug-glp",
    name: "Torito 2T UG GLP",
    tagline: "Ahorro extra con gas · 2 tiempos",
    basePrice: 14199,
    engine: "2 tiempos UG GLP",
    power: "8.58 HP @ 5000 RPM",
    torque: "15 Nm @ 3300 RPM",
    fuelTypes: ["GLP"],
    capacity: "Pasajeros + conductor",
    description:
      "Misma línea 2T UG con versión GLP para ahorrar aún más en combustible. Ideal para ciudad, con Autolube Bajaj y operación económica del día a día.",
    highlights: [
      "Operación a GLP más económica",
      "Sistema Autolube Bajaj",
      "Tanque 20.6 litros",
      "Bajo costo de mantenimiento",
    ],
    specs: [
      { label: "Motor", value: "2 tiempos UG GLP" },
      { label: "Cilindrada", value: "145.45 cc" },
      { label: "Potencia", value: "8.58 HP a 5000 ± 250 RPM" },
      { label: "Torque", value: "15 Nm a 3300 ± 250 RPM" },
      { label: "Transmisión", value: "Manual 4 adelante + 1 reversa" },
      { label: "Tanque", value: "20.6 litros" },
      { label: "Velocidad máx.", value: "60 km/h" },
      { label: "Peso", value: "325 kg" },
      { label: "Dimensiones", value: "2658 × 1300 × 1700 mm" },
    ],
    imageUrl: `${IMG}/2t-ug-glp.png`,
    destacado: true,
    category: "pasajeros",
  },
  {
    id: "crom-plus-gsl",
    name: "Torito CROM PLUS GSL",
    tagline: "Un paso adelante · gasolina 200 cc",
    basePrice: 16699,
    engine: "4 tiempos UG GSL",
    power: "10.19 HP @ 5000 RPM",
    torque: "17.10 Nm @ 3500 RPM",
    fuelTypes: ["Gasolina"],
    capacity: "Pasajeros + conductor",
    description:
      "Excelente torque y potencia para pendientes o altura. Hipercombustión patentada por Bajaj. Torque de 17.10 Nm a 3500 RPM, de los más altos en la categoría 200 cc. Tablero Full UG y asientos ergonómicos.",
    highlights: [
      "Hipercombustión Bajaj",
      "Alto torque para pendientes",
      "Cilindrada 198.88 cc · doble bujía",
      "Velocidad máx. 65 km/h",
    ],
    specs: [
      { label: "Motor", value: "4 tiempos UG gasolina" },
      { label: "Cilindrada", value: "198.88 cc" },
      { label: "Potencia", value: "10.19 HP a 5000 ± 250 RPM" },
      { label: "Torque", value: "17.10 Nm a 3500 ± 250 RPM" },
      { label: "Bujías", value: "2 (Champion / Bosch)" },
      { label: "Tanque", value: "8 litros" },
      { label: "Velocidad máx.", value: "65 km/h" },
      { label: "Peso", value: "348 kg" },
      { label: "Dimensiones", value: "2635 × 1300 × 1710 mm" },
    ],
    imageUrl: `${IMG}/crom-plus-gsl.png`,
    destacado: true,
    category: "pasajeros",
  },
  {
    id: "crom-plus-glp",
    name: "Torito CROM PLUS GLP",
    tagline: "Un paso adelante · ahorro con gas",
    basePrice: 16699,
    engine: "4 tiempos UG GLP",
    power: "9.32 HP @ 5000 RPM",
    torque: "16 Nm @ 3500 RPM",
    fuelTypes: ["GLP"],
    capacity: "Pasajeros + conductor",
    description:
      "Hipercombustión Bajaj con versión GLP para mayor ahorro. Maneja más cómodo con asientos ergonómicos y tablero Full UG. Ideal para trabajo diario de pasajeros.",
    highlights: [
      "Hipercombustión + GLP",
      "Tanque GLP 20.6 L + gasolina 3 L",
      "Tablero Full UG",
      "Asientos ergonómicos",
    ],
    specs: [
      { label: "Motor", value: "4 tiempos UG GLP" },
      { label: "Cilindrada", value: "198.88 cc" },
      { label: "Potencia", value: "9.32 HP a 5000 ± 250 RPM" },
      { label: "Torque", value: "16 Nm a 3500 ± 250 RPM" },
      { label: "Tanque", value: "GLP 20.6 L · Gasolina 3 L" },
      { label: "Velocidad máx.", value: "65 km/h" },
      { label: "Peso", value: "370 kg" },
      { label: "Dimensiones", value: "2635 × 1300 × 1710 mm" },
    ],
    imageUrl: `${IMG}/crom-plus-glp.png`,
    destacado: true,
    category: "pasajeros",
  },
  {
    id: "crom-plus-gnv",
    name: "Torito CROM PLUS GNV",
    tagline: "El Torito que se paga solo · GNV de fábrica",
    basePrice: 16699,
    engine: "4 tiempos UG GNV",
    power: "8.78 HP @ 5000 RPM",
    torque: "14.5 Nm @ 3500 RPM",
    fuelTypes: ["GNV", "Gasolina"],
    capacity: "Pasajeros + conductor",
    description:
      "Maximiza ganancias con GNV de fábrica: tanque de 30 litros, tablero plus renovado y llantas sin cámara. La opción para rutas con red de gas natural.",
    highlights: [
      "Tanque GNV de fábrica 30 L",
      "Tablero plus renovado",
      "Llantas sin cámara",
      "Máximo ahorro en combustible",
    ],
    specs: [
      { label: "Motor", value: "4 tiempos UG GNV" },
      { label: "Cilindrada", value: "198.88 cc" },
      { label: "Potencia", value: "8.78 HP a 5000 ± 250 RPM" },
      { label: "Torque", value: "14.5 Nm a 3500 ± 250 RPM" },
      { label: "Tanque GNV", value: "30 L / 4.5 kg (reserva 3 L)" },
      { label: "Bujías", value: "Doble bujía" },
      { label: "Peso", value: "348 kg" },
      { label: "Dimensiones", value: "2635 × 1300 × 1710 mm" },
    ],
    imageUrl: `${IMG}/crom-plus-gnv.png`,
    destacado: false,
    category: "pasajeros",
  },
  {
    id: "torito-250",
    name: "Torito 250",
    tagline: "Nuevo modelo · 236.2 cc",
    basePrice: 17599,
    engine: "4 tiempos · 236.2 cc",
    power: "9.86 HP @ 4500 RPM",
    torque: "18 Nm @ 3500 RPM",
    fuelTypes: ["Gasolina", "GLP"],
    capacity: "Carga y pasajeros",
    description:
      "Modelo de lanzamiento con motor 236.2 cc. Mayor cilindrada para trabajo exigente de pasajeros y carga. Precio referencial para versión con lona; confirma en sede.",
    highlights: [
      "Nuevo modelo en catálogo",
      "Cilindrada 236.2 cc",
      "Torque 18 Nm",
      "Versátil para carga y pasajeros",
    ],
    specs: [
      { label: "Motor", value: "4 tiempos" },
      { label: "Cilindrada", value: "236.2 cc" },
      { label: "Potencia", value: "9.86 HP a 4500 ± 250 RPM" },
      { label: "Torque", value: "18 Nm a 3500 ± 250 RPM" },
      { label: "Transmisión", value: "Manual 4 adelante + 1 reversa" },
      { label: "Tanque", value: "20.6 L (reserva 3 L)" },
      { label: "Velocidad máx.", value: "62 km/h" },
      { label: "Peso", value: "348 kg" },
      { label: "Dimensiones", value: "2635 × 1300 × 1710 mm" },
    ],
    imageUrl: `${IMG}/torito-250.png`,
    destacado: true,
    category: "carga",
  },
  {
    id: "maxima-glp",
    name: "Torito MAXIMA GLP",
    tagline: "El vehículo multipropósito del Perú",
    basePrice: 17499,
    engine: "4 tiempos MX-Z UG GLP",
    power: "11.06 HP @ 4750 RPM",
    torque: "17.55 Nm @ 3250 RPM",
    fuelTypes: ["GLP"],
    capacity: "Carga y pasajeros",
    payload: "350 kg",
    description:
      "El mototaxi más potente de la línea: hipercombustión y sistema CV-Shaft para mejor rendimiento de palieres. Espacio trasero amplio y asientos abatibles para más pasajeros o carga (hasta 350 kg).",
    highlights: [
      "Capacidad de carga 350 kg",
      "Hipercombustión + CV-Shaft",
      "Asientos abatibles",
      "11.06 HP · 236.2 cc",
    ],
    specs: [
      { label: "Motor", value: "4 tiempos MX-Z UG GLP" },
      { label: "Cilindrada", value: "236.2 cc" },
      { label: "Potencia", value: "11.06 HP a 4750 ± 250 RPM" },
      { label: "Torque", value: "17.55 Nm a 3250 ± 250 RPM" },
      { label: "Carga útil", value: "350 kg" },
      { label: "Tanque", value: "8 litros" },
      { label: "Velocidad máx.", value: "62 km/h" },
      { label: "Peso", value: "495 kg" },
      { label: "Dimensiones", value: "2825 × 1350 × 1780 mm" },
    ],
    imageUrl: `${IMG}/maxima-glp.png`,
    destacado: true,
    category: "carga",
  },
];

export const BRANCHES: Branch[] = [
  {
    name: "Comas",
    imageUrl: "/assets/media/images/branches/sede-comas-referencial.webp",
    imageAlt: "Representación referencial de una sede EPSA Motor en Comas",
    address: "Av. 22 de Agosto, Comas, Lima",
    reference: "Tienda principal · TORITO BAJAJ EPSA MOTOR — SEDE COMAS",
    phone: CONTACT.phoneDisplay,
    email: CONTACT.email,
    scheduleWeek: CONTACT.hoursWeek,
    scheduleSunday: CONTACT.hoursSunday,
    mapsUrl: "https://www.google.com/maps?q=Av.+22+de+Agosto,+Comas,+Lima,+Peru",
    embedQuery: "TORITO BAJAJ EPSA MOTOR SEDE COMAS",
  },
  {
    name: "Ventanilla",
    imageUrl: "/assets/media/images/branches/sede-ventanilla-referencial.webp",
    imageAlt: "Representación referencial de una sede EPSA Motor en Ventanilla",
    address: "Av. José Olaya Balandra Mz. Z, Lote 9, Ventanilla, Callao",
    reference: "Atención comercial · TORITO BAJAJ EPSA MOTOR — VENTANILLA",
    phone: CONTACT.phoneDisplay,
    email: CONTACT.email,
    scheduleWeek: CONTACT.hoursWeek,
    scheduleSunday: CONTACT.hoursSunday,
    mapsUrl: "https://www.google.com/maps?q=Av.+Jose+Olaya+Balandra,+Ventanilla,+Callao,+Peru",
    embedQuery: "TORITO BAJAJ EPSA MOTOR VENTANILLA",
  },
  {
    name: "Puente Piedra",
    imageUrl: "/assets/media/images/branches/sede-puente-piedra-referencial.webp",
    imageAlt: "Representación referencial de una sede EPSA Motor en Puente Piedra",
    address: "Asoc. de Viv. Los Rosales — Mz. C, Lote 9, Puente Piedra, Lima",
    reference: "Atención comercial · EPSA Motor Sede Puente Piedra",
    phone: CONTACT.phoneDisplay,
    email: CONTACT.email,
    scheduleWeek: CONTACT.hoursWeek,
    scheduleSunday: CONTACT.hoursSunday,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=EPSA+Motor+Sede+Puente+Piedra",
    embedQuery: "EPSA Motor Sede Puente Piedra",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Carlos M.",
    association: "Comas · CROM PLUS GLP",
    modelName: "Torito CROM PLUS GLP",
    avatarImage: `${IMG}/crom-plus-glp.png`,
    rating: 5,
    text: "Trabajo turnos largos y el motor responde parejo. En EPSA me asesoraron bien con el financiamiento y salí rodando el mismo mes.",
    tag: "Pasajeros",
  },
  {
    name: "Rosa P.",
    association: "Ventanilla · 2T UG GSL",
    modelName: "Torito 2T UG GSL",
    avatarImage: `${IMG}/2t-ug-gsl.png`,
    rating: 5,
    text: "Buscaba algo accesible para empezar. Me explicaron opciones al contado y a crédito sin presión. La atención por WhatsApp fue rápida.",
    tag: "Inicio de negocio",
  },
  {
    name: "Héctor G.",
    association: "Callao · MAXIMA GLP",
    modelName: "Torito MAXIMA GLP",
    avatarImage: `${IMG}/maxima-glp.png`,
    rating: 5,
    text: "Necesitaba carga útil real para reparto. Cotizaron claro el precio y me mostraron la unidad en sede. Buena atención comercial.",
    tag: "Carga",
  },
  {
    name: "Walter G.",
    association: "Comas · CROM PLUS GSL",
    modelName: "Torito CROM PLUS GSL",
    avatarImage: `${IMG}/crom-plus-gsl.png`,
    rating: 5,
    text: "Evaluaron mi perfil con DNI y recibo de servicios. En pocos días ya estaba con mi unidad 4T. Atención seria y profesional.",
    tag: "Financiamiento",
  },
  {
    name: "Elena C.",
    association: "Lima Norte · GLP",
    modelName: "Torito 2T UG GLP",
    avatarImage: `${IMG}/2t-ug-glp.png`,
    rating: 5,
    text: "Mi mototaxi a GLP gasta mucho menos que la gasolina. El ahorro diario me ayuda a pagar la cuota con tranquilidad.",
    tag: "Ahorro",
  },
  {
    name: "Julio C.",
    association: "Puente Piedra · Torito 250",
    modelName: "Torito 250",
    avatarImage: `${IMG}/torito-250.png`,
    rating: 5,
    text: "Adquirí una unidad de mayor cilindrada para mercadería. Buen torque en pendientes y el proceso de compra con EPSA fue claro.",
    tag: "Logística",
  },
];

/**
 * Preguntas frecuentes.
 *
 * Las respuestas salen de la misma fuente que usa el asesor digital
 * (shared/chat-prompt.ts), de modo que la web y el chat no se contradigan.
 * El texto es plano a propósito: se reutiliza tal cual en el JSON-LD de
 * FAQPage que lee Google.
 */
export const FAQS: FaqItem[] = [
  {
    question: "¿Qué necesito para acceder al crédito directo?",
    answer:
      "Solo tu DNI y un recibo de luz o agua. Con eso evaluamos tu historial en la sede y armamos un plan de cuotas a tu medida. No pedimos aval ni historial bancario previo.",
  },
  {
    question: "¿Cuánto es la cuota inicial?",
    answer:
      "Depende del modelo y del resultado de tu evaluación, por eso no publicamos una cifra fija: sería inexacta. Escríbenos por WhatsApp con el modelo que te interesa y te damos el monto real en el momento.",
  },
  {
    question: "¿La placa y la tarjeta de propiedad están incluidas?",
    answer:
      "Sí. Gestionamos el trámite de placa y tarjeta de propiedad en Sunarp de forma gratuita con la compra de tu mototaxi nuevo. No es un costo aparte ni un descuento promocional: va incluido siempre.",
  },
  {
    question: "¿Cuál me conviene: gasolina, GLP o GNV?",
    answer:
      "Si vas a empezar con poco presupuesto, la versión a gasolina es la más accesible. Si haces muchos kilómetros al día, el GLP o el GNV bajan bastante el costo por viaje, aunque la unidad cuesta algo más. El GNV solo compensa si trabajas en zonas con grifos de gas natural cerca.",
  },
  {
    question: "¿Los precios que aparecen en la web son finales?",
    answer:
      "Son precios referenciales de la versión con lona. El precio final puede variar según la sede, el stock disponible y los accesorios que elijas, como la cabina de fibra. Te confirmamos el precio cerrado antes de cualquier compromiso.",
  },
  {
    question: "¿Hacen mantenimiento o reparaciones?",
    answer:
      "No. EPSA Motor se dedica a la venta y el financiamiento de mototaxis Torito Bajaj; no contamos con taller de mantenimiento ni servicio técnico de reparaciones. Te lo decimos de frente para que no hagas un viaje en vano.",
  },
  {
    question: "¿Puedo ver y probar la unidad antes de comprar?",
    answer:
      "Sí. Puedes agendar una prueba de manejo o simplemente pasar por cualquiera de nuestras tres sedes en Comas, Ventanilla o Puente Piedra. Atendemos de lunes a sábado de 9:00 a. m. a 5:00 p. m.; los domingos, consúltanos por WhatsApp.",
  },
  {
    question: "¿Cuánto tiempo llevan en el mercado?",
    answer:
      "Más de 20 años vendiendo y financiando mototaxis en Lima Norte y Callao, como distribuidor oficial autorizado de Bajaj.",
  },
];

export function formatPrice(amount: number) {
  return `S/ ${Number(amount || 0).toLocaleString("es-PE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function getModelById(id: string) {
  return MOTOTAXI_MODELS.find((m) => m.id === id) || null;
}
