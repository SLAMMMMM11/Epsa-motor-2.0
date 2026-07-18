import { MototaxiModel, Branch, Testimonial } from "./types";

export const MOTOTAXI_MODELS: MototaxiModel[] = [
  {
    id: "re-4s",
    name: "Bajaj Torito RE 4S",
    tagline: "El Rey Indiscutible con Cabina de Fibra Javi Car",
    basePrice: 13500,
    engine: "198.88 cc DTS-i (Triple Bujía)",
    power: "13.1 HP @ 5000 RPM",
    fuelTypes: ["Gasolina", "GLP", "GNV"],
    capacity: "3 Pasajeros + Conductor",
    description: "La mototaxi favorita de los emprendedores peruanos equipada con la mítica Cabina de Fibra Javi Car (Blanco/Rojo). Diseñada para resistir el trabajo diario con el chasis robusto original de Bajaj y el acabado aerodinámico de mayor durabilidad.",
    highlights: [
      "Cabina de Fibra Javi Car original con acabados deportivos e impermeables",
      "Tecnología Patentada DTS-i (Triple Bujía) para mayor fuerza y ahorro",
      "Faros delanteros de alta penetración halógena para trabajo nocturno",
      "Asientos ergonómicos con tapicería de alto tránsito"
    ],
    specs: [
      { label: "Cabina", value: "Fibra de Vidrio Javi Car Premium (Roja y Blanca)" },
      { label: "Motor", value: "Monocilíndrico de 4 tiempos, refrigerado por aire" },
      { label: "Cilindrada", value: "198.88 cc" },
      { label: "Potencia Máxima", value: "13.1 HP a 5000 RPM" },
      { label: "Torque Máximo", value: "18.0 Nm a 3500 RPM" },
      { label: "Transmisión", value: "4 velocidades adelante + retroceso, manual" },
      { label: "Capacidad de Tanque", value: "8 Litros (Gasolina) / Equivalente en Gas" }
    ],
    imageUrl: "/assets/torito_re_4s.svg"
  },
  {
    id: "chrome",
    name: "Bajaj Torito Chrome VIP",
    tagline: "Estilo Premium y Cabina de Fibra Javi Car Azul",
    basePrice: 15400,
    engine: "198.88 cc DTS-i Dual Spark",
    power: "13.2 HP @ 5200 RPM",
    fuelTypes: ["Gasolina", "GLP"],
    capacity: "3 Pasajeros VIP + Conductor",
    description: "Lleva tu servicio de transporte al nivel VIP. Esta edición especial cuenta con la sofisticada Cabina de Fibra de Vidrio Javi Car en acabado Azul y Blanco, amortiguadores traseros hidráulicos coaxiales y un aislamiento acústico superior para tus pasajeros.",
    highlights: [
      "Cabina de Fibra Javi Car Premium Azul/Blanco con lunas corredizas",
      "Acabados cromados de lujo en parachoques y biseles",
      "Amortiguadores traseros hidráulicos con gas cargado",
      "Consola de conductor equipada con indicador digital de marcha"
    ],
    specs: [
      { label: "Cabina", value: "Fibra de Vidrio Javi Car Deluxe (Azul y Blanca)" },
      { label: "Motor", value: "Monocilíndrico 4 tiempos, doble bujía, enfriado por aire" },
      { label: "Cilindrada", value: "198.88 cc" },
      { label: "Potencia Máxima", value: "13.2 HP a 5200 RPM" },
      { label: "Torque Máximo", value: "18.3 Nm a 3300 RPM" },
      { label: "Uso recomendado", value: "Servicio de transporte VIP, turismo, o zonas urbanas exigentes" }
    ],
    imageUrl: "/assets/torito_chrome.svg"
  },
  {
    id: "re-gnv-factory",
    name: "Bajaj Torito RE GNV de Fábrica",
    tagline: "Ultra Ahorro Ecológico con Cabina GNV Homologada",
    basePrice: 14900,
    engine: "198.88 cc DTS-i Dual Spark GNV",
    power: "11.2 HP @ 5000 RPM",
    fuelTypes: ["GNV", "Gasolina"],
    capacity: "3 Pasajeros + Conductor",
    description: "El primer mototaxi diseñado de origen para funcionar con Gas Natural Vehicular (GNV). Presenta la cabina de fibra homologada con doble cilindro de gas estratégico, pegatina rombo verde oficial de GNV y un ahorro de combustible inmejorable de hasta un 60%.",
    highlights: [
      "Sistema de gas GNV homologado de fábrica con doble tanque cilíndrico de acero",
      "Pegatina rombo verde GNV oficial y cabina de fibra Javi Car adaptada",
      "Ahorro de hasta el 60% en combustible en comparación con gasolina estándar",
      "Garantía oficial completa de Bajaj Perú para todo el sistema de gas"
    ],
    specs: [
      { label: "Certificación", value: "Homologación oficial del Ministerio de Transportes (GNV)" },
      { label: "Motor", value: "Monocilíndrico 4 tiempos, doble bujía, optimizado para GNV" },
      { label: "Cilindrada", value: "198.88 cc" },
      { label: "Autonomía GNV", value: "Hasta 120 km por carga completa de gas" },
      { label: "Tanque Auxiliar", value: "Gasolina de 3 litros para emergencias o arranque" },
      { label: "Cabina", value: "Fibra Javi Car Roja/Blanca con espacio portamaleta trasero" }
    ],
    imageUrl: "/assets/torito_gnv.svg"
  },
  {
    id: "trivesa-r3",
    name: "Bajaj Torito - Cabina Trivesa R3",
    tagline: "Aerodinámica Extrema y Diseño Deportivo de Vanguardia",
    basePrice: 16100,
    engine: "198.88 cc DTS-i Dual Spark",
    power: "13.1 HP @ 5100 RPM",
    fuelTypes: ["Gasolina", "GLP", "GNV"],
    capacity: "3 Pasajeros Sport + Conductor",
    description: "La joya del tuning. Equipada con la imponente Cabina Trivesa R3 de fibra de vidrio en acabado azul y blanco, con rejillas de ventilación deportivas en negro, spoilers de techo integrados y líneas aerodinámicas que optimizan la velocidad y el consumo.",
    highlights: [
      "Cabina Deportiva Trivesa R3 con branquias de ventilación agresivas",
      "Alerón trasero aerodinámico integrado con luz de freno LED",
      "Interior espacioso con tapicería deportiva bitono y portavasos",
      "Faros halógenos reforzados y espejos deportivos de fibra"
    ],
    specs: [
      { label: "Cabina", value: "Fibra de Vidrio Trivesa R3 Sport (Azul y Blanca)" },
      { label: "Aerodinámica", value: "Deflectores laterales de aire y branquias de escape de calor" },
      { label: "Motor", value: "Monocilíndrico de 4 tiempos DTS-i" },
      { label: "Cilindrada", value: "198.88 cc" },
      { label: "Detalles", value: "Logotipos Trivesa R3 deportivos y acabados de pintura bicapa" }
    ],
    imageUrl: "/assets/trivesa_r3.svg"
  },
  {
    id: "tuning-z",
    name: "Bajaj Torito - Cabina Tuning Z",
    tagline: "El Máximo Exponente de la Cultura Tuning",
    basePrice: 16400,
    engine: "198.88 cc DTS-i Dual Spark",
    power: "13.2 HP @ 5150 RPM",
    fuelTypes: ["Gasolina", "GLP"],
    capacity: "3 Pasajeros VIP + Conductor",
    description: "Diseñada para destacar en la pista. La Cabina Tuning Z integra franjas deportivas amarillas de carreras, alerón de ventilación superior tipo spoiler, branquias laterales de competición y lunas polarizadas de fábrica para máxima privacidad y estilo urbano.",
    highlights: [
      "Cabina de Fibra Tuning Z con franjas amarillas de competición y spoiler",
      "Rejillas protectoras en faros y alerón superior estilizado",
      "Lunas corredizas de policarbonato reforzado antirruido",
      "Asientos deportivos con costuras reforzadas de color amarillo"
    ],
    specs: [
      { label: "Cabina", value: "Fibra de Vidrio Tuning Z Edition (Azul/Blanco/Amarillo)" },
      { label: "Spoiler", value: "Alerón de ventilación superior deportivo con luz auxiliar" },
      { label: "Cilindrada", value: "198.88 cc" },
      { label: "Suspensión", value: "Resortes progresivos de doble acción tuning" }
    ],
    imageUrl: "/assets/tuning_z.svg"
  },
  {
    id: "maxima-z",
    name: "Bajaj Maxima Z (Carpa Abierta)",
    tagline: "Confort Superior con Carpa de Lona y Apertura Panorámica",
    basePrice: 17500,
    engine: "236.2 cc DTS-i Dual Spark",
    power: "11.6 HP @ 4750 RPM",
    fuelTypes: ["Gasolina", "GLP", "GNV"],
    capacity: "3 Pasajeros Premium + Conductor",
    description: "Siente la libertad en cada viaje. El Bajaj Maxima Z de Carpa Abierta combina un chasis metálico azul súper robusto de 236 cc con una capota o carpa de lona color beige/tan premium impermeable. Ideal para un servicio sumamente fresco, ventilado y con visibilidad panorámica.",
    highlights: [
      "Capota / Carpa de lona color beige premium con correas de sujeción rápida",
      "Estructura abierta con barandas metálicas protectoras de alta seguridad",
      "Motor gigante de 236.2 cc ideal para pendientes pronunciadas con carga completa",
      "Cabina de pasajeros extra espaciosa con mayor espacio para las piernas"
    ],
    specs: [
      { label: "Lona/Carpa", value: "Capota de lona impermeable color beige (reforzada)" },
      { label: "Motor", value: "Monocilíndrico de 4 tiempos, refrigerado por ventilación asistida" },
      { label: "Cilindrada", value: "236.2 cc" },
      { label: "Potencia Máxima", value: "11.6 HP a 4750 RPM" },
      { label: "Torque Máximo", value: "19.2 Nm a 3250 RPM" },
      { label: "Suspensión Trasera", value: "Brazo de remolque independiente con muelle helicoidal" }
    ],
    imageUrl: "/assets/maxima_z.svg"
  },
  {
    id: "maxima-cargo",
    name: "Bajaj Maxima Cargo",
    tagline: "El Socio de Carga Pesada de tu Negocio",
    basePrice: 16200,
    engine: "236.2 cc Motor de Torque Alto",
    power: "11.1 HP @ 4500 RPM (Fuerza Pura)",
    fuelTypes: ["Gasolina", "GLP", "Diesel"],
    capacity: "Cabina de Conductor + Tolva Reforzada",
    payload: "500 kg de capacidad real",
    description: "Diseñado para mover tu negocio. Ya sea carga de mercadería, reparto a domicilio, mudanzas, materiales de ferretería o balones de gas, el Maxima Cargo tiene el chasis reforzado de viga triple y el torque necesario para subir pendientes extremas.",
    highlights: [
      "Impresionante cilindrada de 236 cc con embrague húmedo de larga duración",
      "Chasis robusto de tres vigas con placa de acero antideslizante",
      "Tolva posterior amplia de acero estructural con compuerta abatible",
      "Frenos hidráulicos de tambor autoajustables en las tres ruedas"
    ],
    specs: [
      { label: "Motor", value: "Monocilíndrico de 4 tiempos, enfriado por líquido asistido" },
      { label: "Cilindrada", value: "236.2 cc" },
      { label: "Carga Útil Homologada", value: "500 kg" },
      { label: "Torque Máximo", value: "19.5 Nm a 3250 RPM" },
      { label: "Dimensiones Tolva", value: "1.6m x 1.4m x 0.35m (Largo x Ancho x Alto)" },
      { label: "Embrague", value: "Húmedo multidisco (mayor vida útil y menor desgaste)" },
      { label: "Suspensión Trasera", value: "Independiente con brazo de torsión y resorte de alta carga" }
    ],
    imageUrl: "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "re-2t",
    name: "Bajaj Torito RE 2T",
    tagline: "La Leyenda Imbatible de los Cerros",
    basePrice: 12900,
    engine: "145.45 cc de 2 Tiempos",
    power: "9.5 HP @ 5000 RPM (Alto Torque en Corto)",
    fuelTypes: ["Gasolina con Mezcla"],
    capacity: "3 Pasajeros + Conductor",
    description: "Para quienes prefieren la velocidad de respuesta clásica. La mítica versión de dos tiempos cuenta con una aceleración instantánea y una simplicidad mecánica inigualable que le permite trepar las lomas más empinadas del cono norte sin perder potencia.",
    highlights: [
      "Aceleración y torque explosivo desde bajas revoluciones",
      "Mantenimiento mecánico ultra sencillo y repuestos de bajo costo",
      "Chasis aligerado pero altamente resistente a la torsión",
      "Carrocería de fácil acceso y desmontaje rápido para reparaciones"
    ],
    specs: [
      { label: "Motor", value: "Monocilíndrico de 2 tiempos, refrigerado por aire forzado" },
      { label: "Cilindrada", value: "145.45 cc" },
      { label: "Lubricación", value: "Pre-mezcla combustible-aceite" },
      { label: "Arranque", value: "Manual por piola de alta resistencia o eléctrico (opcional)" },
      { label: "Transmisión", value: "4 velocidades secuenciales en la empuñadura izquierda" },
      { label: "Frenos", value: "Freno hidráulico de pedal en ruedas traseras" },
      { label: "Uso recomendado", value: "Zonas con laderas y pendientes pronunciadas" }
    ],
    imageUrl: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "qute",
    name: "Bajaj Qute (Quadriciclo)",
    tagline: "El Siguiente Paso en la Evolución del Transporte Urbano",
    basePrice: 19800,
    engine: "217 cc DTS-i Refrigerado por Agua",
    power: "13.0 HP @ 5500 RPM",
    fuelTypes: ["Gasolina", "GLP", "GNV"],
    capacity: "4 Pasajeros + Conductor (Cerrado)",
    description: "Una revolución total. El Bajaj Qute es un vehículo cerrado de cuatro ruedas que combina el costo de operación ultra bajo de un mototaxi con la seguridad, comodidad y protección climática de un automóvil compacto. Ideal para rutas largas interdistritales.",
    highlights: [
      "Cabina cerrada de acero estructural con cinturones de seguridad en todos los asientos",
      "Motor de inyección de 4 válvulas enfriado por agua para máxima durabilidad",
      "Velocidad máxima autorizada de 70 km/h con estabilidad excepcional",
      "Amplio espacio de carga delantera y opción de parrilla portaequipajes"
    ],
    specs: [
      { label: "Motor", value: "Monocilíndrico de 4 tiempos, 4 válvulas, DTS-i inyección" },
      { label: "Cilindrada", value: "217 cc" },
      { label: "Refrigeración", value: "Líquida (por agua) con electroventilador" },
      { label: "Transmisión", value: "5 velocidades adelante + retroceso, secuencial" },
      { label: "Seguridad", value: "Chasis monocasco de acero, cinturones de 3 puntos" },
      { label: "Carrocería", value: "Puertas rígidas con ventanas de policarbonato de alta resistencia" },
      { label: "Rendimiento", value: "Hasta 35 km por litro (Ultra eficiente)" }
    ],
    imageUrl: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&auto=format&fit=crop&q=80"
  }
];

export const BRANCHES: Branch[] = [
  {
    name: "Puente Piedra",
    address: "Av. Puente Piedra 450",
    reference: "Cerca a la Plaza de Armas de Puente Piedra, Lima Norte",
    phone: "987-654-321",
    email: "puentepiedra@epsamotor.pe",
    scheduleWeek: "Lunes a Sábado de 8:00 AM a 7:00 PM",
    scheduleSunday: "Domingos de 9:00 AM a 1:00 PM",
    mapsUrl: "https://maps.google.com/?q=Av.+Puente+Piedra+450,+Puente+Piedra,+Lima",
    embedQuery: "Av. Puente Piedra 450, Puente Piedra, Lima"
  },
  {
    name: "Comas",
    address: "Av. Túpac Amaru 3450",
    reference: "Cerca al paradero Correo / Metro de Belaunde, Comas",
    phone: "987-654-322",
    email: "comas@epsamotor.pe",
    scheduleWeek: "Lunes a Sábado de 8:00 AM a 7:00 PM",
    scheduleSunday: "Domingos de 9:00 AM a 1:00 PM",
    mapsUrl: "https://maps.google.com/?q=Av.+Tupac+Amaru+3450,+Comas,+Lima",
    embedQuery: "Av. Tupac Amaru 3450, Comas, Lima"
  },
  {
    name: "Ventanilla",
    address: "Av. La Playa Mz. C Lote 15",
    reference: "Frente al Plaza Vea de Ventanilla, Callao",
    phone: "987-654-323",
    email: "ventanilla@epsamotor.pe",
    scheduleWeek: "Lunes a Sábado de 8:00 AM a 7:00 PM",
    scheduleSunday: "Domingos de 9:00 AM a 1:00 PM",
    mapsUrl: "https://maps.google.com/?q=Av.+La+Playa+Mz.+C+Lote+15,+Ventanilla,+Callao",
    embedQuery: "Av. La Playa, Ventanilla, Callao"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Walter Gonzáles",
    association: "Asoc. El Progreso, Comas",
    initials: "WG",
    rating: 5,
    text: "Evaluaron mi perfil de forma inmediata con mi recibo de servicios y DNI. En muy pocos días ya me encontraba manejando mi nuevo Torito RE 4S GNV. Una atención sumamente seria y profesional.",
    tag: "Financiamiento Rápido",
    avatarBg: "bg-blue-600"
  },
  {
    name: "Elena Condori",
    association: "Cooperativa San Juan de Lurigancho",
    initials: "EC",
    rating: 5,
    text: "¡La mejor decisión de mi vida! Mi Torito RE GLP gasta casi la mitad que mi antigua moto a gasolina. El ahorro diario me permite pagar la cuota del banco con total tranquilidad y me sobra para mi casa.",
    tag: "Ahorro de Combustible",
    avatarBg: "bg-emerald-600"
  },
  {
    name: "Julio Cárdenas",
    association: "Distribuidora JC, Puente Piedra",
    initials: "JC",
    rating: 5,
    text: "Adquirí la Bajaj Maxima Cargo para optimizar el reparto de mercadería. Posee un torque increíble en pendientes pronunciadas. El soporte postventa en el taller oficial ha sido impecable.",
    tag: "Logística y Carga",
    avatarBg: "bg-orange-600"
  },
  {
    name: "Carlos Mendoza",
    association: "Flota San Martín de Porres",
    initials: "CM",
    rating: 5,
    text: "Tengo 3 unidades Torito trabajando a diario en rutas de trocha y cerros. La suspensión reforzada original marca la diferencia, no se aflojan las piezas y los repuestos Bajaj originales duran el doble.",
    tag: "Durabilidad Extrema",
    avatarBg: "bg-red-600"
  },
  {
    name: "Moisés Ramos",
    association: "Conductor de Ruta, Ventanilla",
    initials: "MR",
    rating: 5,
    text: "Adquirí la versión Torito Chrome. El andar es sumamente confortable y la calidad de la lona instalada en el de taller EPSA es de primera calidad. Excelente servicio y transparencia en los trámites.",
    tag: "Tuning Oficial",
    avatarBg: "bg-amber-600"
  },
  {
    name: "Víctor Huamán",
    association: "Asoc. Los Claveles, Ate",
    initials: "VH",
    rating: 5,
    text: "El proceso de conversión a GNV certificado por EPSA Motor me dio total confianza. Pasó la revisión técnica a la primera y la garantía de fábrica sigue intacta. Mis clientes felicitan el confort de viaje.",
    tag: "Garantía Postventa",
    avatarBg: "bg-indigo-600"
  }
];

