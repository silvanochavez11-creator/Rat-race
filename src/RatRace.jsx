import { useState, useCallback, useEffect, useRef } from "react";

// ============================================================
// DESIGN TOKENS
// ============================================================
const C = {
  bg: "#080C14",
  surface: "#0F1623",
  card: "#141E2E",
  border: "#1E2D42",
  purple: "#7C6FFF",
  purpleGlow: "rgba(124,111,255,0.15)",
  green: "#00E5A0",
  red: "#FF4D6A",
  orange: "#FF8C42",
  blue: "#38BDF8",
  yellow: "#FFD166",
  textPrimary: "#F0F4FF",
  textSecondary: "#7A8BA8",
  textMuted: "#3D5068", };

// ============================================================
// SKILL TREE DATA
// ============================================================
const SKILL_TREE = {
  oficios: {
    label: "Oficios", icon: "🔧", color: C.orange,
    skills: [
      { id: "mecanica_basica", nombre: "Mecánica básica", costo: 1200, energiaCosto: 20, descripcion: "Reparaciones simples en motos y autos.", requiere: null },
      { id: "mecanica_avanzada", nombre: "Mecánica avanzada", costo: 3000, energiaCosto: 30, descripcion: "Diagnóstico y reparación compleja.", requiere: "mecanica_basica" },
      { id: "electricidad", nombre: "Electricidad básica", costo: 1500, energiaCosto: 20, descripcion: "Instalaciones y reparaciones eléctricas.", requiere: null },
      { id: "plomeria", nombre: "Plomería", costo: 1000, energiaCosto: 15, descripcion: "Reparaciones de agua y drenaje.", requiere: null },
    ]
  },
  digital: {
    label: "Digital", icon: "💻", color: C.blue,
    skills: [
      { id: "redes_sociales", nombre: "Redes sociales", costo: 800, energiaCosto: 10, descripcion: "Manejo de Instagram, TikTok y Facebook.", requiere: null },
      { id: "marketing", nombre: "Marketing digital", costo: 2500, energiaCosto: 20, descripcion: "Ads, embudos y generación de leads.", requiere: "redes_sociales" },
      { id: "diseno", nombre: "Diseño básico", costo: 1800, energiaCosto: 15, descripcion: "Canva, logos y materiales visuales.", requiere: null },
      { id: "programacion", nombre: "Programación", costo: 4500, energiaCosto: 35, descripcion: "Desarrollo web y automatizaciones.", requiere: "diseno" },
      { id: "marca_personal", nombre: "Marca personal en redes", costo: 2400, energiaCosto: 18, descripcion: "Construyes tu marca y atraes clientes recurrentes.", requiere: "redes_sociales", ingresoMensual: 1500 },
      { id: "analisis_datos", nombre: "Analista de datos", costo: 3200, energiaCosto: 25, descripcion: "Decisiones con datos: mides y optimizas resultados.", requiere: "marketing" },
    ]
  },
  ventas: {
    label: "Ventas", icon: "🎯", color: C.purple,
    skills: [
      { id: "atencion_cliente", nombre: "Atención al cliente", costo: 600, energiaCosto: 10, descripcion: "Comunicación y servicio efectivo.", requiere: null },
      { id: "ventas_basicas", nombre: "Ventas básicas", costo: 1500, energiaCosto: 15, descripcion: "Proceso de venta y manejo de objeciones.", requiere: "atencion_cliente" },
      { id: "oratoria", nombre: "Comunicación y oratoria", costo: 2000, energiaCosto: 18, descripcion: "Hablas con claridad y persuades en público.", requiere: "atencion_cliente" },
      { id: "lenguaje_corporal", nombre: "Lenguaje corporal", costo: 2600, energiaCosto: 20, descripcion: "Lees y usas gestos para conectar y cerrar tratos.", requiere: "ventas_basicas" },
      { id: "cierre", nombre: "Cierre de tratos", costo: 3000, energiaCosto: 20, descripcion: "Técnicas avanzadas de cierre.", requiere: "ventas_basicas" },
      { id: "negociacion", nombre: "Negociación", costo: 4000, energiaCosto: 25, descripcion: "Negociar contratos y acuerdos grandes.", requiere: "cierre" },
    ]
  },
  finanzas: {
    label: "Finanzas", icon: "📊", color: C.green,
    skills: [
      { id: "ahorro", nombre: "Hábito de ahorro", costo: 500, energiaCosto: 5, descripcion: "Metodología para ahorrar consistentemente.", requiere: null },
      { id: "presupuesto", nombre: "Presupuesto personal", costo: 900, energiaCosto: 8, descripcion: "Control de gastos e ingresos.", requiere: "ahorro" },
      { id: "inversion_basica", nombre: "Inversión básica", costo: 2500, energiaCosto: 20, descripcion: "CETES, fondos y bolsa de valores.", requiere: "presupuesto" },
      { id: "bienes_raices", nombre: "Bienes raíces", costo: 6000, energiaCosto: 30, descripcion: "Inversión en propiedades para rentar.", requiere: "inversion_basica" },
    ]
  },
  construccion: {
    label: "Construcción", icon: "🧱", color: "#D98A4E",
    skills: [
      { id: "albanileria", nombre: "Albañilería", costo: 1000, energiaCosto: 20, descripcion: "Construcción de muros, pisos y obra básica.", requiere: null },
      { id: "carpinteria", nombre: "Carpintería", costo: 1400, energiaCosto: 18, descripcion: "Muebles y estructuras de madera.", requiere: null },
      { id: "herreria", nombre: "Herrería", costo: 1800, energiaCosto: 22, descripcion: "Estructuras y protecciones de metal.", requiere: "albanileria" },
      { id: "maestro_obra", nombre: "Maestro de obra", costo: 4500, energiaCosto: 35, descripcion: "Diriges obras y equipos de construcción.", requiere: "herreria" },
    ]
  },
  negocios: {
    label: "Negocios", icon: "🏢", color: "#22D3EE",
    skills: [
      { id: "emprendimiento", nombre: "Emprendimiento", costo: 1500, energiaCosto: 15, descripcion: "Bases para iniciar tu propio negocio.", requiere: null },
      { id: "contratar_personal", nombre: "Contratar personal", costo: 2800, energiaCosto: 20, descripcion: "Aprende a contratar y delegar para no hacerlo todo tú.", requiere: "emprendimiento" },
      { id: "agencia_marketing", nombre: "Agencia de marketing", costo: 5500, energiaCosto: 30, descripcion: "Formas una empresa con empleados que trabaja por ti.", requiere: "contratar_personal", ingresoPasivo: 1200 },
      { id: "escalar_negocio", nombre: "Escalar negocio", costo: 9500, energiaCosto: 40, descripcion: "Sistematizas y multiplicas tu empresa.", requiere: "agencia_marketing", ingresoPasivo: 2800 },
    ]
  },
  salud: {
    label: "Salud", icon: "🩺", color: "#2DD4BF",
    skills: [
      { id: "medicina_general", nombre: "Medicina general", costo: 1500, energiaCosto: 15, descripcion: "Consultas y atención médica general.", requiere: null },
      { id: "especialidad", nombre: "Especialidad médica", costo: 5000, energiaCosto: 30, descripcion: "Cardiología, pediatría... Contratos médicos mejor pagados.", requiere: "medicina_general" },
      { id: "cirugia", nombre: "Cirugía", costo: 9000, energiaCosto: 40, descripcion: "Cirugías de alto valor y prestigio.", requiere: "especialidad" },
      { id: "consultorio_propio", nombre: "Consultorio propio", costo: 6000, energiaCosto: 25, descripcion: "Abres tu propio consultorio: ingreso pasivo.", requiere: "medicina_general", ingresoPasivo: 1800 },
      { id: "clinica", nombre: "Clínica con doctores", costo: 12000, energiaCosto: 35, descripcion: "Contratas doctores: tu clínica trabaja por ti.", requiere: "consultorio_propio", ingresoPasivo: 3800 },
      { id: "hospital", nombre: "Cadena / Hospital", costo: 20000, energiaCosto: 45, descripcion: "Escalas a hospital o cadena de clínicas.", requiere: "clinica", ingresoPasivo: 6500 },
    ]
  },
  corporativo: {
    label: "Corporativo", icon: "💼", color: "#60A5FA",
    skills: [
      { id: "gestion_tiempo", nombre: "Gestión del tiempo", costo: 1200, energiaCosto: 12, descripcion: "Productividad para destacar y ganar ascensos.", requiere: null, ingresoMensual: 1000 },
      { id: "excel_reportes", nombre: "Excel y reportes", costo: 1000, energiaCosto: 10, descripcion: "Herramienta corporativa clave para crecer.", requiere: null, ingresoMensual: 700 },
      { id: "liderazgo", nombre: "Liderazgo", costo: 2800, energiaCosto: 22, descripcion: "Coordinas equipos y abres la puerta a dirigir.", requiere: "gestion_tiempo", ingresoMensual: 1800 },
      { id: "trabajo_remoto", nombre: "Trabajo remoto", costo: 1500, energiaCosto: 10, descripcion: "Trabajas desde casa: bajan tus gastos de transporte.", requiere: null, gastoReduce: 900 },
    ]
  },
  freelance: {
    label: "Freelance", icon: "🧑‍💻", color: "#FB923C",
    skills: [
      { id: "propuestas_comerciales", nombre: "Propuestas comerciales", costo: 1500, energiaCosto: 14, descripcion: "Cierras más clientes con mejores propuestas.", requiere: null },
      { id: "gestion_proyectos", nombre: "Gestión de proyectos", costo: 2200, energiaCosto: 18, descripcion: "Llevas varios clientes a la vez: más ingreso.", requiere: null, ingresoMensual: 1600 },
      { id: "productividad", nombre: "Productividad", costo: 1800, energiaCosto: 12, descripcion: "Rindes más con menos: cada ciclo te cansa menos.", requiere: null },
      { id: "automatizacion", nombre: "Automatización", costo: 4000, energiaCosto: 28, descripcion: "Automatizas tareas: pequeño ingreso pasivo.", requiere: "gestion_proyectos", ingresoPasivo: 900 },
    ]
  },
  basico: {
    label: "Básico", icon: "🌱", color: "#34D399",
    skills: [
      { id: "tutorias", nombre: "Tutorías", costo: 300, energiaCosto: 10, descripcion: "Das clases por hora: ingreso sin capital.", requiere: null, ingresoMensual: 800 },
      { id: "reventa", nombre: "Reventa / Marketplace", costo: 400, energiaCosto: 12, descripcion: "Compras y revendes: ingreso extra.", requiere: null, ingresoMensual: 600 },
      { id: "idiomas", nombre: "Idiomas (inglés)", costo: 1500, energiaCosto: 16, descripcion: "Abres la puerta a clientes internacionales.", requiere: null },
      { id: "contenido_digital", nombre: "Contenido digital", costo: 800, energiaCosto: 14, descripcion: "TikTok/YouTube: pequeño ingreso pasivo.", requiere: "reventa", ingresoPasivo: 500 },
    ]
  } };

// ============================================================
// PROFILES
// ============================================================
const PROFILES = [
  {
    id: "estudiante", name: "Estudiante", emoji: "🎓",
    description: "Sin trabajo, sin deudas. Empiezas vendiendo lo que puedes.",
    stats: { carisma: 2, conocimiento: 3, red: 1 },
    habilidades: [],
    ramaAfin: "basico",
    ramasPermitidas: ["basico", "oficios", "construccion", "digital", "ventas", "finanzas"],
    finances: { dinero: 800, ingresoMensual: 0, gastosMensuales: 1200, deudas: 0, activosPasivos: 0 },
    energia: { actual: 60, max: 100 },
    ciclo: "diario", dificultad: "Extremo", color: C.purple
  },
  {
    id: "freelancer", name: "Freelancer", emoji: "💻",
    description: "Ingresos irregulares, gastos fijos. Ya tienes habilidades digitales.",
    stats: { carisma: 3, conocimiento: 4, red: 2 },
    habilidades: ["redes_sociales", "diseno"],
    ramaAfin: "freelance",
    ramasPermitidas: ["freelance", "digital", "ventas", "finanzas", "negocios"],
    finances: { dinero: 5000, ingresoMensual: 8000, gastosMensuales: 6500, deudas: 15000, activosPasivos: 0 },
    energia: { actual: 75, max: 100 },
    ciclo: "semanal", dificultad: "Difícil", color: C.orange
  },
  {
    id: "empleado", name: "Empleado", emoji: "👔",
    description: "Sueldo fijo quincenal. Estable, pero atrapado en la rutina.",
    stats: { carisma: 3, conocimiento: 3, red: 3 },
    habilidades: ["atencion_cliente", "ventas_basicas"],
    ramaAfin: "corporativo",
    ramasPermitidas: ["corporativo", "ventas", "digital", "finanzas", "negocios"],
    finances: { dinero: 8000, ingresoMensual: 14000, gastosMensuales: 11000, deudas: 35000, activosPasivos: 0 },
    energia: { actual: 70, max: 100 },
    ciclo: "quincenal", dificultad: "Medio", color: C.blue
  },
  {
    id: "profesional", name: "Doctor / Profesionista", emoji: "🩺",
    description: "Ingresos altos, deudas altísimas. El rat race clásico.",
    stats: { carisma: 4, conocimiento: 5, red: 4 },
    habilidades: ["medicina_general", "presupuesto"],
    ramaAfin: "salud",
    ramasPermitidas: ["salud", "finanzas", "ventas", "negocios"],
    finances: { dinero: 20000, ingresoMensual: 45000, gastosMensuales: 38000, deudas: 180000, activosPasivos: 0 },
    energia: { actual: 65, max: 100 },
    ciclo: "mensual", dificultad: "Fácil", color: C.green
  } ];

// ============================================================
// EVENTS
// ============================================================
const EVENTOS = [
  { id: "e1", tipo: "chamba", titulo: "Moto descompuesta", descripcion: "Tu amigo tiene una moto que no enciende. Te ofrece lana por arreglarla.", opciones: ["Cobrar $800", "Pasar", "Negociar $1,500"], impacto: [{ dinero: 800, energia: -25 }, { dinero: 0, energia: 0 }, { dinero: 1500, energia: -30 }], emoji: "🏍️", requiereHabilidad: "mecanica_basica" },
  { id: "e2", tipo: "chamba", titulo: "Instalación eléctrica", descripcion: "Un vecino necesita que le instales contactos en su local.", opciones: ["Cobrar $600", "Pasar", "Cobrar $1,000"], impacto: [{ dinero: 600, energia: -20 }, { dinero: 0, energia: 0 }, { dinero: 1000, energia: -25 }], emoji: "⚡", requiereHabilidad: "electricidad" },
  { id: "e3", tipo: "oportunidad", titulo: "Cliente de redes sociales", descripcion: "Una tienda local quiere que les manejes sus redes un mes.", opciones: ["Aceptar $2,000", "Rechazar", "Negociar $3,500"], impacto: [{ dinero: 2000, ingreso: 0, energia: -15 }, { dinero: 0, energia: 5 }, { dinero: 3500, energia: -20 }], emoji: "📱", requiereHabilidad: "redes_sociales" },
  { id: "e4", tipo: "oportunidad", titulo: "Campaña de ads", descripcion: "Una empresa quiere que les hagas su campaña de Facebook Ads.", opciones: ["Aceptar $5,000", "Rechazar", "Negociar $8,000"], impacto: [{ dinero: 5000, energia: -25 }, { dinero: 0, energia: 0 }, { dinero: 8000, energia: -35 }], emoji: "🎯", requiereHabilidad: "marketing" },
  { id: "e5", tipo: "oportunidad", titulo: "Oferta de trabajo", descripcion: "Un contacto tuyo tiene una vacante. Necesitan a alguien con tu perfil.", opciones: ["Ir a entrevista", "Ignorar", "Negociar sueldo"], impacto: [{ dinero: 0, ingreso: 6000, energia: -10 }, { dinero: 0, energia: 0 }, { dinero: 0, ingreso: 9000, energia: -15 }], emoji: "💼", requiereHabilidad: null },
  { id: "e6", tipo: "chamba", titulo: "Vender en el mercado", descripcion: "Puedes vender dulces o frutas este fin de semana en el tianguis.", opciones: ["Ir a vender $400", "Descansar", "Armar mejor puesto $700"], impacto: [{ dinero: 400, energia: -20 }, { dinero: 0, energia: 30 }, { dinero: 700, energia: -30 }], emoji: "🍎", requiereHabilidad: null },
  { id: "e7", tipo: "inversion", titulo: "Fondo de inversión", descripcion: "Tienes oportunidad de meter dinero a un fondo con 8% anual.", opciones: ["Invertir $5,000", "Pasar", "Invertir $10,000"], impacto: [{ dinero: -5000, activosMes: 333, energia: -5 }, { dinero: 0, energia: 0 }, { dinero: -10000, activosMes: 667, energia: -5 }], emoji: "📈", requiereHabilidad: "inversion_basica" },
  { id: "e8", tipo: "inversion", titulo: "CETES disponibles", descripcion: "Puedes meter dinero en CETES al 11% anual desde tu celular.", opciones: ["Invertir $2,000", "Pasar", "Invertir $5,000"], impacto: [{ dinero: -2000, activosMes: 183, energia: -3 }, { dinero: 0, energia: 0 }, { dinero: -5000, activosMes: 458, energia: -3 }], emoji: "🏦", requiereHabilidad: "ahorro" },
  { id: "e9", tipo: "gasto", titulo: "Gasto médico", descripcion: "Tuviste un problema de salud. Necesitas atención médica.", opciones: ["Pagar consulta $800", "Ignorarlo (riesgo)", "Ir al IMSS (gratis)"], impacto: [{ dinero: -800, energia: -10 }, { dinero: 0, energia: -25, ingreso: -1000 }, { dinero: 0, energia: -5 }], emoji: "🏥", requiereHabilidad: null },
  { id: "e10", tipo: "gasto", titulo: "Se descompuso algo", descripcion: "Tu celular o computadora necesita reparación urgente.", opciones: ["Reparar $1,500", "Seguir sin él", "Financiar la reparación"], impacto: [{ dinero: -1500, energia: -5 }, { dinero: 0, ingreso: -500, energia: 0 }, { dinero: 0, deuda: 2000, energia: -5 }], emoji: "🔧", requiereHabilidad: null },
  { id: "e11", tipo: "black_swan", titulo: "Crisis económica", descripcion: "El peso se devaluó. Todo subió de precio y los contratos se cayeron.", opciones: ["Ajustar gastos (-$1,500/mes)", "Pedir préstamo $8,000", "Buscar ingreso extra"], impacto: [{ dinero: 0, gastos: -1500, energia: -10 }, { dinero: 8000, deuda: 10000, energia: 0 }, { dinero: 0, ingreso: 2000, energia: -20 }], emoji: "📉", requiereHabilidad: null },
  { id: "e12", tipo: "oportunidad", titulo: "Bono de desempeño", descripcion: "Tu jefe te da un bono por los buenos resultados del mes.", opciones: ["Ahorrar el bono", "Invertirlo en activos", "Pagar deudas"], impacto: [{ dinero: 5000, energia: 10 }, { dinero: 0, activosMes: 300, energia: 5 }, { dinero: 0, deuda: -5000, energia: 5 }], emoji: "🎁", requiereHabilidad: null },
  { id: "e13", tipo: "chamba", titulo: "Proyecto de diseño", descripcion: "Una marca local necesita logo y materiales para su negocio.", opciones: ["Cobrar $1,500", "Rechazar", "Cobrar $2,500 con revisiones"], impacto: [{ dinero: 1500, energia: -15 }, { dinero: 0, energia: 5 }, { dinero: 2500, energia: -25 }], emoji: "🎨", requiereHabilidad: "diseno" },
  { id: "e14", tipo: "chamba", titulo: "Cierre de venta grande", descripcion: "Tienes una reunión con un cliente que vale mucho. Necesitas cerrar.", opciones: ["Presentar y cerrar", "Postponer", "Negociar términos mejores"], impacto: [{ dinero: 8000, energia: -20 }, { dinero: 0, energia: -5 }, { dinero: 12000, energia: -30 }], emoji: "🤝", requiereHabilidad: "cierre" },
  { id: "e15", tipo: "oportunidad", titulo: "Propiedad en venta", descripcion: "Una propiedad barata está disponible. Podrías rentarla y generar flujo.", opciones: ["Comprar y rentar", "Pasar", "Negociar precio"], impacto: [{ dinero: -30000, activosMes: 3500, energia: -10 }, { dinero: 0, energia: 0 }, { dinero: -25000, activosMes: 3500, energia: -15 }], emoji: "🏠", requiereHabilidad: "bienes_raices" },
  { id: "e16", tipo: "chamba", titulo: "Plomería de emergencia", descripcion: "Un vecino tiene una fuga de agua. Necesita ayuda urgente.", opciones: ["Ir ahora $500", "No puedes", "Cobrar urgencia $900"], impacto: [{ dinero: 500, energia: -15 }, { dinero: 0, energia: 0 }, { dinero: 900, energia: -20 }], emoji: "🚿", requiereHabilidad: "plomeria" },
  { id: "e17", tipo: "descanso", titulo: "Fin de semana libre", descripcion: "No hay urgencias. Puedes descansar o aprovechar para estudiar.", opciones: ["Descansar (recuperar energía)", "Estudiar una habilidad", "Buscar chamba extra"], impacto: [{ dinero: 0, energia: 40 }, { dinero: 0, energia: -10 }, { dinero: 1000, energia: -20 }], emoji: "🌴", requiereHabilidad: null },
  { id: "e18", tipo: "chamba", titulo: "Página web para negocio", descripcion: "Una empresa necesita una landing page sencilla.", opciones: ["Cobrar $6,000", "Rechazar", "Cobrar $10,000 con mantenimiento"], impacto: [{ dinero: 6000, energia: -30 }, { dinero: 0, energia: 0 }, { dinero: 0, ingreso: 2000, energia: -35 }], emoji: "🌐", requiereHabilidad: "programacion" },
  { id: "e19", tipo: "black_swan", titulo: "Tarjeta de crédito fácil", descripcion: "Te ofrecen una tarjeta con línea inmediata. Dinero ahora... que pagarás con intereses después.", opciones: ["Aceptar $3,000 (deuda)", "Rechazar (no, gracias)", "Sacar efectivo $2,000 (deuda)"], impacto: [{ dinero: 3000, deuda: 5000, energia: -5 }, { dinero: 0, energia: 5 }, { dinero: 2000, deuda: 3000, energia: -5 }], emoji: "💳", requiereHabilidad: null },
  { id: "e20", tipo: "chamba", titulo: "Repartir paquetes", descripcion: "Hay temporada alta y necesitan repartidores este fin de semana.", opciones: ["Trabajar $700", "Descansar", "Doble turno $1,300"], impacto: [{ dinero: 700, energia: -20 }, { dinero: 0, energia: 20 }, { dinero: 1300, energia: -35 }], emoji: "📦", requiereHabilidad: null },
  { id: "e21", tipo: "inversion", titulo: "Tanda con amigos", descripcion: "Tus amigos organizan una tanda. Disciplina de ahorro en grupo.", opciones: ["Entrar $1,500", "Pasar", "Entrar doble $3,000"], impacto: [{ dinero: -1500, activosMes: 90, energia: -3 }, { dinero: 0, energia: 0 }, { dinero: -3000, activosMes: 190, energia: -3 }], emoji: "🤲", requiereHabilidad: "ahorro" },
  { id: "e22", tipo: "oportunidad", titulo: "Vender por internet", descripcion: "Puedes montar una tiendita en línea con lo que ya sabes de redes.", opciones: ["Montar tienda $2,000", "Pasar", "Invertir en inventario $4,000"], impacto: [{ dinero: -2000, ingreso: 1500, energia: -20 }, { dinero: 0, energia: 0 }, { dinero: -4000, ingreso: 3200, energia: -30 }], emoji: "🛒", requiereHabilidad: "redes_sociales" },
  { id: "e23", tipo: "chamba", titulo: "Construir una barda", descripcion: "Un vecino quiere levantar la barda de su terreno.", opciones: ["Cobrar $2,500", "Rechazar", "Cobrar $4,000 con acabado"], impacto: [{ dinero: 2500, energia: -30 }, { dinero: 0, energia: 0 }, { dinero: 4000, energia: -40 }], emoji: "🧱", requiereHabilidad: "albanileria" },
  { id: "e24", tipo: "chamba", titulo: "Fabricar muebles a medida", descripcion: "Una familia quiere un clóset y una mesa de madera.", opciones: ["Cobrar $3,000", "Rechazar", "Cobrar $5,000 línea premium"], impacto: [{ dinero: 3000, energia: -25 }, { dinero: 0, energia: 0 }, { dinero: 5000, energia: -35 }], emoji: "🪚", requiereHabilidad: "carpinteria" },
  { id: "e25", tipo: "chamba", titulo: "Portón de herrería", descripcion: "Necesitan un portón de metal con protección.", opciones: ["Cobrar $3,500", "Rechazar", "Cobrar $6,000 reforzado"], impacto: [{ dinero: 3500, energia: -30 }, { dinero: 0, energia: 0 }, { dinero: 6000, energia: -40 }], emoji: "🔩", requiereHabilidad: "herreria" },
  { id: "e26", tipo: "oportunidad", titulo: "Dirigir una obra", descripcion: "Te ofrecen dirigir la construcción de una casa completa.", opciones: ["Aceptar la obra", "Rechazar", "Negociar mejores términos"], impacto: [{ dinero: 15000, energia: -40 }, { dinero: 0, energia: 0 }, { dinero: 22000, energia: -50 }], emoji: "🏗️", requiereHabilidad: "maestro_obra" },
  { id: "e27", tipo: "oportunidad", titulo: "Cuenta grande para tu agencia", descripcion: "Una empresa quiere contratar a tu agencia de marketing por meses.", opciones: ["Presentar propuesta", "Rechazar", "Negociar retainer anual"], impacto: [{ dinero: 8000, ingreso: 3000, energia: -25 }, { dinero: 0, energia: 0 }, { dinero: 12000, ingreso: 5000, energia: -35 }], emoji: "📣", requiereHabilidad: "agencia_marketing" },
  { id: "e28", tipo: "black_swan", titulo: "Mes sin ventas", descripcion: "Tu negocio no vendió este mes. La nómina y la renta no esperan.", opciones: ["Cubrir gastos $3,000", "Recortar personal (baja tu ingreso)", "Pedir préstamo para aguantar"], impacto: [{ dinero: -3000, energia: -15 }, { dinero: 0, ingreso: -2500, energia: -10 }, { dinero: 5000, deuda: 6000, energia: -10 }], emoji: "📉", requiereHabilidad: null },
  { id: "e29", tipo: "black_swan", titulo: "Crisis económica del país", descripcion: "La economía nacional se contrae: suben los precios y baja el consumo.", opciones: ["Ajustar tu presupuesto", "Buscar ingreso extra", "Aguantar (suben tus gastos)"], impacto: [{ gastos: 600, energia: -15 }, { dinero: 2000, energia: -25 }, { gastos: 1500, energia: -10 }], emoji: "🏛️", requiereHabilidad: null },
  { id: "e30", tipo: "black_swan", titulo: "Accidente: atención médica", descripcion: "Tuviste un accidente y necesitas atención médica urgente y de pago.", opciones: ["Hospital privado $7,000", "IMSS $1,500 + reposo", "Ignorar (peligroso)"], impacto: [{ dinero: -7000, energia: -15 }, { dinero: -1500, energia: -35 }, { dinero: 0, energia: -45, ingreso: -2500 }], emoji: "🚑", requiereHabilidad: null },
  { id: "e31", tipo: "gasto", titulo: "Inflación: suben tus gastos", descripcion: "El costo de la vida subió. Tus compras del mes cuestan más.", opciones: ["Reducir consumo", "Comprar a crédito", "Aguantar (gastos +$1,000/mes)"], impacto: [{ energia: -10 }, { dinero: 0, deuda: 3000, energia: -5 }, { gastos: 1000, energia: -5 }], emoji: "🛒", requiereHabilidad: null },
  { id: "e32", tipo: "black_swan", titulo: "Subió la renta y los servicios", descripcion: "El casero subió la renta y los servicios aumentaron. Tus gastos fijos crecen.", opciones: ["Negociar con el casero", "Mudarte (gasto único)", "Aceptar el aumento"], impacto: [{ energia: -15 }, { dinero: -4000, energia: -20 }, { gastos: 1200, energia: -5 }], emoji: "🏚️", requiereHabilidad: null },
  { id: "e33", tipo: "gasto", titulo: "Multa de tránsito", descripcion: "Te detuvieron y debes pagar una multa.", opciones: ["Pagar $1,200", "Impugnarla (tiempo)", "Mordida $600"], impacto: [{ dinero: -1200, energia: -5 }, { energia: -15 }, { dinero: -600, energia: -8 }], emoji: "🚓", requiereHabilidad: null },
  { id: "e34", tipo: "black_swan", titulo: "Fraude / estafa", descripcion: "Caíste en una estafa por internet. Perdiste dinero.", opciones: ["Asumir la pérdida $3,000", "Intentar recuperarlo", "Denunciar"], impacto: [{ dinero: -3000, energia: -15 }, { dinero: -1000, energia: -25 }, { energia: -20 }], emoji: "🎭", requiereHabilidad: null },
  { id: "e35", tipo: "gasto", titulo: "Cumpleaños y compromisos", descripcion: "Mes de fiestas, regalos y compromisos sociales.", opciones: ["Gastar moderado $800", "Quedarte en casa", "Tirar la casa por la ventana $2,500"], impacto: [{ dinero: -800, energia: 10 }, { energia: 20 }, { dinero: -2500, energia: 25 }], emoji: "🎂", requiereHabilidad: null },
  { id: "e36", tipo: "oportunidad", titulo: "Apoyo del gobierno", descripcion: "Sale un programa de apoyo o estímulo. Puedes aprovecharlo.", opciones: ["Tomar el apoyo $2,500", "No calificas", "Apoyo a negocio $4,000"], impacto: [{ dinero: 2500, energia: 0 }, { energia: 0 }, { dinero: 4000, energia: -5 }], emoji: "🎫", requiereHabilidad: null },
  // Oportunidades de INMUEBLES (requieren la habilidad de bienes raíces; ventas ayuda con inquilinos)
  { id: "i1", tipo: "inmueble", bienId: "casa_chica", descuento: 0.9,  titulo: "Casa en remate", descripcion: "Una casa en remate, 10% bajo precio. Cómprala de contado o finánciala con un préstamo si no te alcanza.", opciones: ["Comprar de contado", "Rechazar", "Financiar con préstamo"], impacto: [{ energia: -10 }, { energia: 0 }, { energia: -10 }], emoji: "🏠", requiereHabilidad: "presupuesto" },
  { id: "i2", tipo: "inmueble", bienId: "depa", descuento: 0.92, titulo: "Departamento de oportunidad", descripcion: "Departamento céntrico con descuento. Págalo o finánicialo si no te alcanza.", opciones: ["Comprar de contado", "Rechazar", "Financiar con préstamo"], impacto: [{ energia: -10 }, { energia: 0 }, { energia: -10 }], emoji: "🏢", requiereHabilidad: "inversion_basica" },
  { id: "i3", tipo: "inmueble", bienId: "duplex", descuento: 0.9,  titulo: "Dúplex para rentar", descripcion: "Dos unidades para rentar por separado. Requiere bienes raíces. Buen flujo si consigues inquilinos.", opciones: ["Comprar de contado", "Rechazar", "Financiar con préstamo"], impacto: [{ energia: -12 }, { energia: 0 }, { energia: -12 }], emoji: "🏘️", requiereHabilidad: "bienes_raices" },
  { id: "i4", tipo: "inmueble", bienId: "edificio", descuento: 0.93, titulo: "Edificio en venta", descripcion: "Un edificio de 6 deptos. Gran inversión. Casi nadie lo paga de contado: financíalo y réntalo.", opciones: ["Comprar de contado", "Rechazar", "Financiar con préstamo"], impacto: [{ energia: -15 }, { energia: 0 }, { energia: -15 }], emoji: "🏨", requiereHabilidad: "bienes_raices" },
  // Eventos médicos (para profesionistas de la salud)
  { id: "m1", tipo: "chamba", titulo: "Consulta urgente", descripcion: "Un paciente necesita atención médica de inmediato.", opciones: ["Atender $1,500", "Rechazar", "Consulta premium $2,800"], impacto: [{ dinero: 1500, energia: -20 }, { dinero: 0, energia: 0 }, { dinero: 2800, energia: -30 }], emoji: "🩺", requiereHabilidad: "medicina_general" },
  { id: "m2", tipo: "chamba", titulo: "Guardia nocturna", descripcion: "Te ofrecen cubrir una guardia en el hospital esta noche.", opciones: ["Cubrir guardia $3,000", "No puedes", "Doble guardia $5,500"], impacto: [{ dinero: 3000, energia: -35 }, { dinero: 0, energia: 0 }, { dinero: 5500, energia: -50 }], emoji: "🌙", requiereHabilidad: "medicina_general" },
  { id: "m3", tipo: "oportunidad", titulo: "Cirugía programada", descripcion: "Te asignan una cirugía importante y bien pagada.", opciones: ["Operar", "Rechazar", "Negociar honorarios"], impacto: [{ dinero: 18000, energia: -40 }, { dinero: 0, energia: 0 }, { dinero: 26000, energia: -50 }], emoji: "🔪", requiereHabilidad: "cirugia" },
  { id: "m4", tipo: "oportunidad", titulo: "Consultoría médica", descripcion: "Una aseguradora quiere contratar tu especialidad como asesor.", opciones: ["Presentar propuesta", "Rechazar", "Negociar contrato anual"], impacto: [{ dinero: 6000, ingreso: 2500, energia: -25 }, { dinero: 0, energia: 0 }, { dinero: 9000, ingreso: 4000, energia: -35 }], emoji: "📋", requiereHabilidad: "especialidad" },
  // === Eventos exclusivos del EMPLEADO ===
  { id: "emp1", soloPerfil: "empleado", tipo: "oportunidad", titulo: "Aumento de sueldo", descripcion: "Es momento de pedir un aumento. ¿Cómo lo negocias?", opciones: ["Pedir aumento (+ingreso)", "Conformarte", "Negociar fuerte"], impacto: [{ ingreso: 1500, energia: -10 }, { energia: 0 }, { ingreso: 3000, energia: -20 }], emoji: "💹", requiereHabilidad: null },
  { id: "emp2", soloPerfil: "empleado", tipo: "oportunidad", titulo: "Ascenso disponible", descripcion: "Se abrió un puesto de jefatura. Tu liderazgo te respalda.", opciones: ["Aceptar el ascenso", "Rechazar", "Negociar el paquete"], impacto: [{ ingreso: 4000, energia: -20 }, { energia: 0 }, { ingreso: 6000, energia: -30 }], emoji: "📈", requiereHabilidad: "liderazgo" },
  { id: "emp3", soloPerfil: "empleado", tipo: "black_swan", titulo: "Reducción de personal", descripcion: "La empresa recorta. Tu ingreso peligra.", opciones: ["Asumir recorte (-ingreso)", "Buscar otra área", "Renunciar con liquidación"], impacto: [{ ingreso: -2500, energia: -15 }, { energia: -20 }, { ingreso: -6000, dinero: 8000, energia: -10 }], emoji: "📉", requiereHabilidad: null },
  { id: "emp4", soloPerfil: "empleado", tipo: "chamba", titulo: "Trabajo extra en otra empresa", descripcion: "Te ofrecen un turno extra de medio tiempo (moonlighting).", opciones: ["Tomar turno $2,000", "Descansar", "Doble turno $3,500"], impacto: [{ dinero: 2000, energia: -25 }, { energia: 20 }, { dinero: 3500, energia: -40 }], emoji: "🌜", requiereHabilidad: null },
  // === Eventos exclusivos del FREELANCER ===
  { id: "fre1", soloPerfil: "freelancer", tipo: "black_swan", titulo: "Cliente que no paga", descripcion: "Entregaste el trabajo y el cliente desapareció.", opciones: ["Asumir pérdida", "Cobrar con recargo", "Mandar a cobranza"], impacto: [{ dinero: -2500, energia: -10 }, { dinero: 1500, energia: -20 }, { energia: -15 }], emoji: "🧾", requiereHabilidad: null },
  { id: "fre2", soloPerfil: "freelancer", tipo: "oportunidad", titulo: "Contrato de retainer", descripcion: "Un cliente quiere pagarte mensual fijo por tus servicios.", opciones: ["Aceptar retainer", "Rechazar", "Negociar mejor"], impacto: [{ ingreso: 3000, energia: -15 }, { energia: 0 }, { ingreso: 4500, energia: -25 }], emoji: "📆", requiereHabilidad: null },
  { id: "fre3", soloPerfil: "freelancer", tipo: "oportunidad", titulo: "Cliente internacional (USD)", descripcion: "Un cliente del extranjero paga en dólares. ¡El tipo de cambio ayuda!", opciones: ["Tomar proyecto $7,000", "Rechazar", "Proyecto grande $12,000"], impacto: [{ dinero: 7000, energia: -25 }, { energia: 0 }, { dinero: 12000, energia: -40 }], emoji: "🌎", requiereHabilidad: null },
  { id: "fre4", soloPerfil: "freelancer", tipo: "black_swan", titulo: "Burn out", descripcion: "El exceso de trabajo te pasó factura. Necesitas parar.", opciones: ["Descanso forzado", "Seguir igual (riesgo)", "Terapia $1,500"], impacto: [{ ingreso: -1500, energia: 25 }, { energia: -30, ingreso: -2000 }, { dinero: -1500, energia: 15 }], emoji: "🔥", requiereHabilidad: null },
  // === Eventos exclusivos del ESTUDIANTE ===
  { id: "est1", soloPerfil: "estudiante", tipo: "oportunidad", titulo: "Beca o apoyo", descripcion: "Sale una beca o apoyo gubernamental. ¡Dinero sin deuda!", opciones: ["Recibir beca $2,000", "No calificas", "Beca grande $3,500"], impacto: [{ dinero: 2000, energia: 5 }, { energia: 0 }, { dinero: 3500, energia: -5 }], emoji: "🎓", requiereHabilidad: null },
  { id: "est2", soloPerfil: "estudiante", tipo: "black_swan", titulo: "Examen reprobado", descripcion: "Reprobaste una materia. Toca recuperar tiempo y energía.", opciones: ["Estudiar duro", "Aceptarlo", "Pagar curso $1,000"], impacto: [{ energia: -25 }, { energia: -10 }, { dinero: -1000, energia: 5 }], emoji: "📕", requiereHabilidad: null },
  { id: "est3", soloPerfil: "estudiante", tipo: "chamba", titulo: "Amigo con negocio", descripcion: "Un amigo te invita a trabajar o asociarte en su negocio.", opciones: ["Trabajar informal $900", "Pasar", "Asociarte $2,000"], impacto: [{ dinero: 900, energia: -20 }, { energia: 0 }, { dinero: -2000, ingreso: 1200, energia: -15 }], emoji: "🤝", requiereHabilidad: null },
  { id: "est4", soloPerfil: "estudiante", tipo: "chamba", titulo: "Tu primera venta", descripcion: "¡Hiciste tu primera venta! Pequeña, pero te da confianza y experiencia.", opciones: ["¡Celebrarlo!", "Restarle importancia", "Reinvertir las ganancias"], impacto: [{ dinero: 500, energia: 10 }, { energia: 0 }, { dinero: 300, ingreso: 400, energia: -5 }], emoji: "🎉", requiereHabilidad: null },
  // Eventos de cliente SIN requisito: para que TODOS puedan negociar / presentar proyectos
  { id: "nc1", tipo: "oportunidad", titulo: "Te recomiendan con un cliente", descripcion: "Un conocido te recomendó. El cliente quiere hablar contigo. Si NEGOCIAS, podrás convencerlo con tus respuestas.", opciones: ["Tomar el proyecto", "Rechazar", "Negociar el precio"], impacto: [{ dinero: 2500, energia: -15 }, { dinero: 0, energia: 0 }, { dinero: 4200, energia: -25 }], emoji: "🤝", requiereHabilidad: null },
  { id: "nc2", tipo: "oportunidad", titulo: "Presenta tu proyecto", descripcion: "Una empresa te deja presentar tu propuesta ante su equipo. NEGOCIA para defenderla y cerrar mejor.", opciones: ["Presentar la propuesta", "No presentar", "Presentar y negociar"], impacto: [{ dinero: 4000, ingreso: 1000, energia: -20 }, { dinero: 0, energia: 0 }, { dinero: 6500, ingreso: 1800, energia: -30 }], emoji: "📊", requiereHabilidad: null }, ];

// ============================================================
// OBJECTION / NEGOTIATION SYSTEM
// ============================================================
// When a sales/client event fires, instead of generic options,
// the player sees real objections to handle. Their choice +
// skill level determines the outcome.

const OBJECIONES = [
  {
    id: "o1",
    contextos: ["cliente_potencial", "contrato_grande"],
    objecion: '"Está muy caro, no tenemos ese presupuesto."',
    personaje: "El cliente frunce el ceño y cruza los brazos.",
    opciones: [
      { texto: "Bajar el precio de inmediato", calidad: "mala", respuesta: "Bajé el precio sin pensar. El cliente aceptó, pero ahora sabes que podías haber cobrado más — y él también lo sabe.", bonusSkill: null },
      { texto: "Ignorar el precio y cambiar tema", calidad: "mala", respuesta: "Intentaste esquivar la objeción. El cliente se incomodó y la conversación se enfrió.", bonusSkill: null },
      { texto: '"¿Cuál es tu presupuesto? Veamos si lo adaptamos."', calidad: "buena", respuesta: "Preguntaste en vez de asumir. El cliente te dijo su límite real y encontraron un punto medio.", bonusSkill: "ventas_basicas" },
      { texto: '"¿Qué te costaría NO resolver esto?"', calidad: "excelente", respuesta: "Lo hiciste pensar en el costo del problema, no en tu precio. Se quedó callado un momento — y luego dijo: \"Tienes razón.\"", bonusSkill: "cierre" },
    ],
    leccion: "💡 Ante objeciones de precio: nunca bajes sin preguntar. Haz que el cliente ponga número primero, o ayúdalo a ver el costo de no actuar.",
  },
  {
    id: "o2",
    contextos: ["cliente_potencial", "contrato_grande"],
    objecion: '"Déjame pensarlo, te aviso."',
    personaje: "El cliente empieza a recoger sus cosas.",
    opciones: [
      { texto: '"Claro, cuando quieras me avisas."', calidad: "mala", respuesta: "Nunca más te contestó. El \"te aviso\" sin fecha es casi siempre un no disfrazado.", bonusSkill: null },
      { texto: "Insistir y llamarlo tres veces esa semana", calidad: "mala", respuesta: "Te bloqueó el WhatsApp. La presión excesiva quema los prospectos.", bonusSkill: null },
      { texto: '"¿Qué información te falta para decidir?"', calidad: "buena", respuesta: "Resultó que tenía una duda técnica que resolviste en 2 minutos. Sin esa pregunta, se habría ido para siempre.", bonusSkill: "ventas_basicas" },
      { texto: '"Entiendo. ¿Podemos agendar una fecha concreta para hablar?"', calidad: "excelente", respuesta: "Propusiste un siguiente paso con fecha. El cliente aceptó, y el jueves cerraste la venta.", bonusSkill: "cierre" },
    ],
    leccion: "💡 \"Te aviso\" sin fecha = perdido. Siempre cierra con un siguiente paso concreto: una llamada, una reunión, una fecha.",
  },
  {
    id: "o3",
    contextos: ["cliente_potencial"],
    objecion: '"Ya tenemos a alguien que nos hace eso."',
    personaje: "El cliente te mira con indiferencia.",
    opciones: [
      { texto: "Disculparse y retirarte", calidad: "mala", respuesta: "Saliste sin dejar huella. Una oportunidad que pudo reactivarse en el futuro se cerró definitivamente.", bonusSkill: null },
      { texto: "Hablar mal del competidor", calidad: "mala", respuesta: "El cliente se molestó. Nunca hables mal de la competencia — hace que parezcas desesperado.", bonusSkill: null },
      { texto: '"¿Están contentos con sus resultados?"', calidad: "buena", respuesta: "Hubo una pausa. \"La verdad, más o menos\", respondió. Se abrió una conversación real.", bonusSkill: "ventas_basicas" },
      { texto: '"Perfecto. ¿Me permites mostrarte en qué soy diferente en solo 5 minutos?"', calidad: "excelente", respuesta: "No pediste que te eligieran — solo 5 minutos. El cliente dijo que sí por curiosidad, y esos 5 minutos se convirtieron en un contrato.", bonusSkill: "negociacion" },
    ],
    leccion: "💡 'Ya tenemos a alguien' no es un no definitivo. Pregunta por su satisfacción o pide solo 5 minutos para diferenciarte.",
  },
  {
    id: "o4",
    contextos: ["contrato_grande"],
    objecion: '"Necesito aprobación de mi jefe / socio."',
    personaje: "El tomador de decisiones real no está en la sala.",
    opciones: [
      { texto: "Esperar a que el jefe decida solo", calidad: "mala", respuesta: "Tu contacto nunca llegó a presentarle bien la propuesta al jefe. El proyecto murió en los pasillos.", bonusSkill: null },
      { texto: "Pedir hablar directamente con el jefe", calidad: "buena", respuesta: "Tu contacto lo coordinó. Tuviste 15 minutos con el decisor real y lo cerraste ahí mismo.", bonusSkill: "cierre" },
      { texto: '"¿Qué necesitas tú para recomendarme con tu jefe?"', calidad: "excelente", respuesta: "Hiciste aliado a tu contacto. Te dijo exactamente qué argumentos usar, y la presentación al jefe fue perfecta.", bonusSkill: "negociacion" },
      { texto: "Mandar más información por correo y esperar", calidad: "mala", respuesta: "El correo se perdió entre decenas de otros. Sin seguimiento activo, el proyecto cayó en el olvido.", bonusSkill: null },
    ],
    leccion: "💡 Si hay un decisor detrás, haz aliado a tu contacto. Pregúntale qué necesita ÉL para defenderle tu propuesta hacia arriba.",
  },
  {
    id: "o5",
    contextos: ["cliente_potencial", "contrato_grande"],
    objecion: '"No es el momento, estamos muy ocupados."',
    personaje: "El cliente parece genuinamente abrumado.",
    opciones: [
      { texto: '"Entiendo, te contacto en 3 meses."', calidad: "mala", respuesta: "En 3 meses ya había otro proveedor resolviendo su problema. El momento perfecto nunca llega solo.", bonusSkill: null },
      { texto: "Presionar para que decidan ahora", calidad: "mala", respuesta: "El cliente se sintió acorralado y cortó la conversación.", bonusSkill: null },
      { texto: '"Precisamente porque están ocupados, esto les va a ahorrar tiempo. ¿Me das 10 minutos?"', calidad: "buena", respuesta: "Reencuadraste el problema. El cliente escuchó y agendó una llamada para la semana siguiente.", bonusSkill: "ventas_basicas" },
      { texto: '"¿Qué problema específico te está quitando más tiempo ahorita?"', calidad: "excelente", respuesta: "Con una pregunta encontraste el dolor real. La solución que ofreciste fue exactamente lo que necesitaban — y firmaron esa misma semana.", bonusSkill: "cierre" },
    ],
    leccion: "💡 'No es el momento' generalmente significa 'no veo el valor suficiente aún'. Busca el dolor específico que SÍ es urgente para ellos.",
  },
  {
    id: "o6",
    contextos: ["cliente_potencial"],
    objecion: '"¿Por qué debería contratarte a ti y no a otro?"',
    personaje: "El cliente te evalúa con los brazos cruzados.",
    opciones: [
      { texto: "Listar todos tus servicios y habilidades", calidad: "mala", respuesta: "El cliente se aburrió a la mitad. Una lista de servicios no diferencia — todo el mundo tiene servicios.", bonusSkill: null },
      { texto: '"Porque soy el más barato del mercado."', calidad: "mala", respuesta: "Ganaste el proyecto, pero ahora eres \"el barato\". Difícil subir precios después.", bonusSkill: null },
      { texto: "Compartir un caso de éxito concreto con resultados", calidad: "buena", respuesta: "Un resultado real vale más que mil palabras. El cliente se identificó con el caso y quiso lo mismo.", bonusSkill: "ventas_basicas" },
      { texto: '"Cuéntame qué has intentado antes. Quiero entender tu situación específica."', calidad: "excelente", respuesta: "Les demostraste que no vendes lo mismo para todos. Eso ya te diferenció. La propuesta que hiciste después fue perfecta porque la construiste con su propio diagnóstico.", bonusSkill: "negociacion" },
    ],
    leccion: "💡 La diferenciación no está en tus servicios, está en cómo entiendes al cliente. Pregunta antes de proponer.",
  }, ];

// Get a relevant objection for the current event context
const getObjecion = (contexto, habilidades) => {
  const disponibles = OBJECIONES.filter(o => o.contextos.includes(contexto));
  return disponibles[Math.floor(Math.random() * disponibles.length)]; };

// Calculate option quality score based on skills
const getOpcionScore = (opcion, habilidades) => {
  const baseScore = { mala: 0, buena: 1, excelente: 2 }[opcion.calidad] || 0;
  const skillBonus = opcion.bonusSkill && habilidades.includes(opcion.bonusSkill) ? 1 : 0;
  return baseScore + skillBonus; };


// Each negotiation/sales event has outcomes with probability
// modified by relevant skills. Results include narrative text.

const OUTCOMES = {
  // Client negotiation outcomes
  cliente_potencial: {
    stat: "carisma", // which skill tree affects odds
    habilidadBonus: { ventas_basicas: 15, cierre: 20, negociacion: 25, propuestas_comerciales: 18, idiomas: 12 },
    resultados: [
      {
        tipo: "ganado",
        probabilidadBase: 35,
        emoji: "🎉",
        titulo: "¡Contrato cerrado!",
        narrativas: [
          "Le presentaste tu propuesta con seguridad. El cliente hizo preguntas, tú respondiste sin dudar — al final extendió la mano. '¿Cuándo empezamos?'",
          "Después de 20 minutos de reunión, el cliente dijo: 'Me convenciste. Mándame el contrato hoy mismo.'",
          "Tocaste justo el punto de dolor correcto. El cliente asintió, sacó su teléfono y te transfirió el anticipo ahí mismo.",
        ],
        impacto: { dinero: 0, ingreso: 5000 },
      },
      {
        tipo: "seguimiento",
        probabilidadBase: 35,
        emoji: "🔄",
        titulo: "En seguimiento",
        narrativas: [
          "El cliente dijo: 'Me interesa, pero necesito consultarlo con mi socio. Te marco el martes.' Tienes una oportunidad real — no la desaproveches.",
          "Buena reunión, pero el cliente no decidió en el momento. 'Déjame revisar tu propuesta con calma', dijo. El follow-up será clave.",
          "Le gustó lo que vio, pero tiene dudas sobre el precio. 'Voy a pensarlo', dijo. Necesitas un seguimiento estratégico.",
        ],
        impacto: { dinero: 0, ingreso: 0, seguimiento: true },
      },
      {
        tipo: "perdido",
        probabilidadBase: 30,
        emoji: "❌",
        titulo: "No te contrataron",
        narrativas: [
          "El cliente escuchó tu propuesta, asintió educadamente y dijo: 'Vamos a explorar otras opciones, gracias.' Clásico rechazo suave.",
          "Te dijeron que ya tenían a alguien más. A veces llegar tarde al juego te cuesta el contrato.",
          "La reunión fue bien, pero el presupuesto no alcanzaba para lo que ofrecías. No era el cliente correcto en este momento.",
        ],
        impacto: { dinero: 0, ingreso: 0 },
      },
    ]
  },
  contrato_grande: {
    stat: "carisma",
    habilidadBonus: { cierre: 20, negociacion: 30, marketing: 15, maestro_obra: 25, agencia_marketing: 25, escalar_negocio: 30, cirugia: 35, especialidad: 25, propuestas_comerciales: 15, liderazgo: 18 },
    resultados: [
      {
        tipo: "ganado",
        probabilidadBase: 25,
        emoji: "🏆",
        titulo: "¡Contrato cerrado!",
        narrativas: [
          "Tres semanas de negociación, dos presentaciones, una contrapropuesta — y finalmente firmaron. Este contrato cambia tu mes.",
          "El director general leyó tu propuesta, la dejó sobre la mesa y dijo: 'Están contratados.' Silencio. Luego sonrisas.",
          "Llegaste preparado con datos, casos de éxito y una propuesta a medida. No había forma de que dijeran no.",
        ],
        impacto: { dinero: 12000, ingreso: 3000 },
      },
      {
        tipo: "seguimiento",
        probabilidadBase: 40,
        emoji: "⏳",
        titulo: "Decisión pendiente",
        narrativas: [
          "El comité necesita aprobación del consejo directivo. 'Esta semana te confirmamos', dijeron. Es normal en contratos de este tamaño.",
          "Les gustó tu propuesta pero quieren ajustar algunos términos. Mandaron comentarios por escrito — hay que negociar detalles.",
          "'Están entre los finalistas', te dijo el contacto en voz baja. Aún no es tuyo, pero va bien.",
        ],
        impacto: { dinero: 0, ingreso: 0, seguimiento: true },
      },
      {
        tipo: "perdido",
        probabilidadBase: 35,
        emoji: "😔",
        titulo: "Se fue con otro",
        narrativas: [
          "Eligieron a un competidor con más experiencia en su industria. Te agradecieron y pidieron que vuelvas a cotizar en 6 meses.",
          "El precio fue el factor decisivo. Alguien llegó más barato y ganó. ¿Debiste haber negociado diferente?",
          "Cambió el interlocutor en el último momento y el nuevo no conocía tu propuesta. Mala suerte, pero así es la venta.",
        ],
        impacto: { dinero: 0, ingreso: 0 },
      },
    ]
  },
  chamba_oficio: {
    stat: "habilidades",
    habilidadBonus: { mecanica_avanzada: 25, electricidad: 20, plomeria: 15, albanileria: 18, carpinteria: 18, herreria: 20, maestro_obra: 30, medicina_general: 22, especialidad: 28 },
    resultados: [
      {
        tipo: "ganado",
        probabilidadBase: 55,
        emoji: "✅",
        titulo: "¡Trabajo bien hecho!",
        narrativas: [
          "Llegaste, diagnosticaste el problema en 10 minutos y lo resolviste en una hora. El cliente quedó feliz y preguntó si tienes tarjeta.",
          "Trabajo limpio y rápido. El cliente te recomendó con dos vecinos antes de que siquiera salieras de su casa.",
          "Te pagaron en efectivo, te dieron propina y te guardaron en contactos. Así se construye clientela.",
        ],
        impacto: { dinero: 1200, ingreso: 0 },
      },
      {
        tipo: "parcial",
        probabilidadBase: 25,
        emoji: "⚠️",
        titulo: "Trabajo a medias",
        narrativas: [
          "Resolviste el problema principal pero quedó un detalle pendiente. Te pagaron la mitad y prometieron el resto cuando termines.",
          "El trabajo tomó más tiempo del esperado. Cobraste, pero el cliente no quedó del todo convencido.",
          "Faltó una pieza que no traías. Tuviste que ir por ella y volver — perdiste tiempo pero terminaste.",
        ],
        impacto: { dinero: 500, ingreso: 0 },
      },
      {
        tipo: "perdido",
        probabilidadBase: 20,
        emoji: "🔧",
        titulo: "Necesitabas más skill",
        narrativas: [
          "El problema era más complejo de lo esperado. Tuviste que llamar a alguien más — el cliente pagó al otro, no a ti.",
          "Intentaste arreglarlo pero lo empeoraste. Por fortuna no cobraste por adelantado.",
          "Llegaste confiado pero el diagnóstico era más profundo. El cliente llamó a un especialista.",
        ],
        impacto: { dinero: 0, ingreso: 0 },
      },
    ]
  },
  inversion: {
    stat: "conocimiento",
    habilidadBonus: { inversion_basica: 20, bienes_raices: 25, presupuesto: 10 },
    resultados: [
      {
        tipo: "ganado",
        probabilidadBase: 50,
        emoji: "📈",
        titulo: "¡Buena inversión!",
        narrativas: [
          "El fondo tuvo un mes excelente. Tu dinero trabajó mientras tú dormías — exactamente para esto es la libertad financiera.",
          "La propiedad se rentó desde el primer día. El flujo de efectivo mensual ya está llegando a tu cuenta.",
          "Compraste en el momento correcto. El activo subió de valor y tu flujo pasivo creció.",
        ],
        impacto: { dinero: 0, activosMes: 500 },
      },
      {
        tipo: "neutral",
        probabilidadBase: 30,
        emoji: "📊",
        titulo: "Resultados normales",
        narrativas: [
          "La inversión va bien, dentro de lo esperado. No es espectacular, pero el dinero está trabajando.",
          "El mercado estuvo plano este mes. Tu inversión mantiene su valor — sin pérdidas ni ganancias extraordinarias.",
        ],
        impacto: { dinero: 0, activosMes: 200 },
      },
      {
        tipo: "perdido",
        probabilidadBase: 20,
        emoji: "📉",
        titulo: "Mes malo",
        narrativas: [
          "El mercado bajó. Tu inversión perdió valor temporalmente — pero los expertos dicen que es normal en el largo plazo.",
          "El inquilino no pagó este mes. Tienes que manejar el problema y cubrir el gasto tú mismo.",
        ],
        impacto: { dinero: -500, activosMes: 0 },
      },
    ]
  } };

// Map event IDs to outcome categories
const EVENTO_OUTCOME_MAP = {
  e3: "cliente_potencial",
  e4: "contrato_grande",
  e14: "contrato_grande",
  e1: "chamba_oficio",
  e2: "chamba_oficio",
  e13: "chamba_oficio",
  e16: "chamba_oficio",
  e18: "contrato_grande",
  e7: "inversion",
  e8: "inversion",
  e15: "inversion",
  e23: "chamba_oficio",
  e24: "chamba_oficio",
  e25: "chamba_oficio",
  e26: "contrato_grande",
  e27: "contrato_grande",
  m1: "chamba_oficio",
  m2: "chamba_oficio",
  m3: "contrato_grande",
  m4: "contrato_grande",
  nc1: "cliente_potencial",
  nc2: "contrato_grande", };

// Calculate success probability based on skills (escalado por la maestría de cada skill)
const calcProbabilidad = (outcomeConfig, habilidades, resultado, dominios = {}) => {
  let prob = resultado.probabilidadBase;
  if (outcomeConfig.habilidadBonus) {
    Object.entries(outcomeConfig.habilidadBonus).forEach(([hId, bonus]) => {
      if (habilidades.includes(hId)) prob += bonus * dominioMult(dominios, hId);
    });
  }
  return Math.min(prob, 95); };

const resolveOutcome = (eventoId, habilidades, exp = 0, bonusExtra = 0, dominios = {}) => {
  const categoria = EVENTO_OUTCOME_MAP[eventoId];
  if (!categoria) return null;
  const config = OUTCOMES[categoria];
  // La experiencia y la calidad de tu negociación suben la probabilidad de ganar.
  const totales = config.resultados.map(r => Math.max(1, calcProbabilidad(config, habilidades, r, dominios) + (r.tipo === "ganado" ? expBonusProb(exp) + bonusExtra : 0)));
  const suma = totales.reduce((a, b) => a + b, 0);
  // La experiencia también mejora el pago de los contratos ganados.
  const conExp = (resultado, prob) => {
    const mult = expBonusPago(exp);
    const impacto = { ...resultado.impacto };
    if (resultado.tipo === "ganado") {
      if (impacto.dinero) impacto.dinero = Math.round(impacto.dinero * mult);
      if (impacto.ingreso) impacto.ingreso = Math.round(impacto.ingreso * mult);
      if (impacto.activosMes) impacto.activosMes = Math.round(impacto.activosMes * mult);
    }
    const narrativa = resultado.narrativas[Math.floor(Math.random() * resultado.narrativas.length)];
    return { ...resultado, impacto, narrativa, probabilidad: prob };
  };
  let roll = Math.random() * suma;
  for (let i = 0; i < config.resultados.length; i++) {
    roll -= totales[i];
    if (roll <= 0) return conExp(config.resultados[i], Math.round((totales[i] / suma) * 100));
  }
  return conExp(config.resultados[config.resultados.length - 1], 0); };

const MENTOR_TIPS = {
  deudaAlta: "💡 Tu deuda supera el doble de tu ingreso. Prioriza pagarla — los intereses te están comiendo vivo.",
  gastosMayores: "⚠️ Gastas más de lo que ganas. Así nunca sales del rat race. Reduce gastos o aumenta ingresos.",
  sinAhorros: "💡 Sin colchón de emergencia, cualquier imprevisto te hunde. Ahorra 3 meses de gastos primero.",
  energiaBaja: "😴 Tu energía está muy baja. Si no descansas, bajarás tu rendimiento y podrías enfermarte.",
  buenaDecision: "✅ Excelente decisión. Así se construye la libertad financiera, paso a paso.",
  invertir: "📈 Los activos trabajan por ti mientras duermes. Sigue acumulando ingresos pasivos.",
  sinHabilidad: "🔒 No tienes la habilidad para esta oportunidad. Invierte en aprender — se paga solo.", };

// Consejos extra del mentor: varios por situación, se elige uno al azar.
const MENTOR_CONSEJOS = {
  bancoCaro: [
    "🏦 Tienes deuda en un banco de tasa alta (8%/mes). Eso crece más rápido de lo que puedes pagar el mínimo. Liquídala o abónale fuerte cuanto antes.",
    "🔥 Un préstamo al 8% mensual es una trampa: el interés solo supera tu pago mínimo. Pásalo a un banco más barato o págalo ya.",
  ],
  deudaCrece: [
    "📈 Tu deuda está creciendo: el interés mensual supera lo que abonas. Cada mes que pasa debes más. Ataca el principal.",
    "⚠️ Pagar solo el mínimo a una deuda cara es como achicar agua con un colador. Abona más para reducir el principal.",
  ],
  deudaAlta: [
    "💡 Tu deuda es alta. Antes de invertir, considera liquidar las deudas caras: ningún activo te rinde tanto como te cuesta un 8% mensual.",
    "🎯 Regla de oro: paga primero la deuda con la tasa más alta (método avalancha). Ahorra más intereses.",
  ],
  cercaLibertad: [
    "🔥 ¡Estás muy cerca! Tu ingreso pasivo casi cubre tus gastos. Una inversión más y sales del rat race.",
    "🏁 La meta está a la vista. No gastes en doodads ahora — cada peso a activos te cruza la línea.",
  ],
  buenFlujo: [
    "✅ Tienes flujo positivo. Ese excedente NO es para gastarlo: conviértelo en activos o en pagar deuda.",
    "💪 Vas bien. El secreto no es ganar más, sino qué haces con lo que te sobra cada mes.",
  ],
  pocoActivo: [
    "🌱 Aún no tienes ingreso pasivo. Empieza pequeño: CETES, un fondo, una renta. Lo importante es comenzar.",
    "📚 Un empleo te da seguridad; los activos te dan libertad. Destina algo cada mes a comprar activos.",
  ],
  mantenimientoAlto: [
    "🧰 Tus gastos de mantenimiento crecieron con tus adquisiciones. Asegúrate de RENTAR esos bienes: si no generan renta, solo te cuestan.",
    "🏠 Un inmueble vacío es un pasivo: paga mantenimiento sin darte renta. Consíguele inquilino o considera venderlo.",
    "⚖️ Compra activos que pongan dinero en tu bolsillo, no que lo saquen. Cada bien debería rentar más de lo que cuesta mantener.",
  ],
  inmueble: [
    "🏘️ Los bienes raíces se compran con apalancamiento: financiar a tasa baja y que la renta pague el préstamo es la jugada clásica.",
    "🔑 Antes de comprar un inmueble, ten claro a cuánto lo rentarás. La renta debe cubrir mantenimiento Y el pago del financiamiento.",
    "🏢 Un edificio de varias unidades diversifica tu riesgo: si una se desocupa, las otras siguen pagando.",
  ],
  financiar: [
    "💳 Financiar puede acelerarte, pero la deuda buena es la que compra un activo que se paga solo. La deuda mala compra cosas que pierden valor.",
    "📊 Si financias un inmueble, revisa que la renta supere el interés mensual del préstamo; si no, te quedas en números rojos.",
  ],
  cuidaEnergia: [
    "😴 No te quemes: la energía es tu motor. Trabajar agotado rinde menos. Descansa aunque cueste un poco.",
    "⚡ El descanso es una inversión: recuperas energía para cerrar mejores tratos.",
  ],
  diversifica: [
    "🧺 No pongas todos los huevos en una canasta: combina rentas, negocios e inversiones.",
    "🌍 Distintas fuentes de ingreso pasivo te protegen cuando una falla (un mes sin ventas, un inquilino que se va).",
    "🔀 Si todo tu ingreso viene de una sola fuente, eres frágil. Suma una segunda y una tercera.",
  ],
  negociar: [
    "🗣️ Cuando un cliente te ofrezca un trato, prueba 'Negociar': con buenas respuestas cierras por más.",
    "🎯 No bajes el precio a la primera. Pregunta qué necesita el cliente y muestra el valor.",
    "🤝 Las habilidades de Ventas (oratoria, cierre, lenguaje corporal) suben tu probabilidad de cerrar.",
    "📊 Presentar tu proyecto y defenderlo bien vale más que el proyecto en sí.",
  ],
  habilidades: [
    "🌳 Sube la MAESTRÍA de tus habilidades clave: una skill al nivel 20 vale casi el doble.",
    "🎓 Tu rama recomendada cuesta −25%: especialízate en lo tuyo antes de explorar otras ramas.",
    "🧠 Invertir en ti mismo (habilidades) es la inversión con mayor retorno que existe.",
  ],
  velocidad: [
    "⏱️ El tiempo cuenta: entre más rápido salgas de la carrera, mejor lugar en la tabla. No te duermas.",
    "🔥 En dificultad alta, la inflación sube tus gastos cada mes. Construye ingreso pasivo rápido.",
  ],
  energia2: [
    "🔋 La habilidad 'Productividad' hace que cada ciclo te canse menos. Vale oro si trabajas mucho.",
    "🌴 Descansar cuesta un poco, pero trabajar agotado rinde menos. Equilibra.",
  ],
  general: [
    "🧠 Riqueza no es cuánto ganas, sino cuánto conservas y haces crecer.",
    "⏳ La paciencia es tu mejor aliada: el interés compuesto premia a quien empieza temprano y no se detiene.",
    "🎓 Aprende una habilidad nueva: sube tus probabilidades de éxito y abre mejores oportunidades.",
    "💧 Cuida los pequeños gastos: una pequeña fuga hunde un gran barco.",
    "🏠 Compra activos (rentas, negocios) antes que lujos. Los lujos llegan solos cuando los activos los pagan.",
    "🤝 En una negociación, quien pregunta manda. Entiende al otro antes de proponer.",
    "📉 Prepárate para los imprevistos: un fondo de emergencia te salva de pedir prestado caro.",
    "🚀 Reinvierte tus ganancias: un negocio que crece hoy te da libertad mañana.",
    "🏦 Paga tus deudas para subir tu historial crediticio: con mejor crédito, los bancos te prestan más.",
    "🏘️ ¿Viste una 'Casa en remate' o un 'Departamento de oportunidad'? Puedes financiarlos aunque no tengas el dinero completo.",
    "💼 Cada profesión tiene su camino: el doctor su clínica, el freelancer su agencia. Crece en lo tuyo.",
    "🧮 Mide todo: si un activo no te rinde más de lo que cuesta mantenerlo, no es activo, es lastre.",
    "🐀 El sueldo te mantiene vivo; los activos te hacen libre. No confundas estar ocupado con ser rico.",
    "💸 Págate a ti primero: aparta para invertir ANTES de gastar, no con lo que sobra.",
  ],
};

// ============================================================
// BANCOS FICTICIOS Y SISTEMA DE DEUDA
// ============================================================
const BANCOS = {
  popular:  { id: "popular",  nombre: "Banco Popular",       tasa: 0.03, emoji: "🏛️", color: "#00E5A0", limiteBase: 40000,  desc: "Tasa baja (3%/mes). El más justo, pero presta con cautela." },
  credimax: { id: "credimax", nombre: "CrediMax",            tasa: 0.06, emoji: "🏦", color: "#FFD166", limiteBase: 80000,  desc: "Tasa media (6%/mes)." },
  rapidito: { id: "rapidito", nombre: "Préstamos Rapidito",  tasa: 0.08, emoji: "💸", color: "#FF4D6A", limiteBase: 120000, desc: "¡Tasa alta (8%/mes)! Presta más fácil, pero caro." },
};
const getBanco = (id) => BANCOS[id] || BANCOS.credimax;
const totalDeuda = (fin) => (fin.deudas || []).reduce((s, d) => s + d.monto, 0);
const interesMensual = (fin) => (fin.deudas || []).reduce((s, d) => s + d.monto * getBanco(d.bancoId).tasa, 0);
// Deuda actual con un banco concreto.
const deudaConBanco = (fin, bancoId) => (fin.deudas || []).filter(d => d.bancoId === bancoId).reduce((s, d) => s + d.monto, 0);
// Factor de crédito: 0/100 → ×1, 100/100 → ×3. Mejor historial = más te prestan.
const factorCredito = (credito) => 0.6 + Math.min(100, Math.max(0, credito)) / 100 * 2.4;
// Límite total que un banco te presta según tu historial crediticio.
const limiteBanco = (bancoId, credito) => Math.round(getBanco(bancoId).limiteBase * factorCredito(credito));
// Cuánto MÁS puedes pedirle a ese banco ahora mismo.
const cupoDisponible = (fin, bancoId, credito) => Math.max(0, limiteBanco(bancoId, credito) - deudaConBanco(fin, bancoId));

// Agrega una deuda nueva (de un banco). Si ya hay deuda del mismo banco, la suma.
const agregarDeuda = (deudas, monto, bancoId) => {
  const lista = deudas.map(d => ({ ...d }));
  const existente = lista.find(d => d.bancoId === bancoId);
  if (existente) existente.monto += monto;
  else lista.push({ id: `${bancoId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, bancoId, monto });
  return lista;
};
// Paga `monto` repartido sobre las deudas, empezando por la tasa más alta (método avalancha).
const pagarDeudaGlobal = (deudas, monto) => {
  let restante = monto;
  const orden = deudas.map(d => ({ ...d })).sort((a, b) => getBanco(b.bancoId).tasa - getBanco(a.bancoId).tasa);
  for (const d of orden) {
    if (restante <= 0) break;
    const pago = Math.min(d.monto, restante);
    d.monto -= pago;
    restante -= pago;
  }
  return orden.filter(d => d.monto > 1);
};

// ============================================================
// EXPERIENCIA (barra de nivel 1 a 10)
// Sube con las semanas trabajadas y los trabajos completados.
// A mayor nivel: más probabilidad de éxito y mejores pagos en contratos.
// ============================================================
const EXP_POR_NIVEL = 8;
const expNivel = (exp) => Math.min(10, 1 + Math.floor((exp || 0) / EXP_POR_NIVEL));
const expProgreso = (exp) => { const n = expNivel(exp); return n >= 10 ? 1 : ((exp || 0) % EXP_POR_NIVEL) / EXP_POR_NIVEL; };
const expBonusProb = (exp) => (expNivel(exp) - 1) * 2;          // +2% de probabilidad por nivel
const expBonusPago = (exp) => 1 + (expNivel(exp) - 1) * 0.03;   // hasta +27% en los pagos

// ============================================================
// MAESTRÍA / DOMINIO por habilidad (nivel 1 a 20)
// Cada habilidad que tienes sube de maestría con experiencia o con dinero.
// A más maestría, más potente es esa habilidad (mejores bonos).
// ============================================================
const DOMINIO_MAX = 20;
const COSTO_EXP_DOMINIO = 3;   // puntos de experiencia por mejora
const dominioDe = (dominios, id) => Math.min(DOMINIO_MAX, (dominios && dominios[id]) || 1);
// Multiplicador del bono de una habilidad según su maestría (1.0 en nivel 1 → 1.95 en nivel 20).
const dominioMult = (dominios, id) => 1 + (dominioDe(dominios, id) - 1) * 0.05;
// Costo en dinero de mejorar (escala con el costo de la skill y su maestría actual).
const costoDineroDominio = (skill, dominios) => Math.round((skill.costo || 1000) * 0.30 * dominioDe(dominios, skill.id));
const costoEspecialDominio = (skill, dominios) => Math.round((skill.costo || 1000) * 0.60 * dominioDe(dominios, skill.id));

// ============================================================
// MERCADO DE PERTENENCIAS (vehículos, casas, negocios)
// plusvalia: cuánto cambia su valor cada mes (+ sube, - se deprecia)
// renta: ingreso pasivo mensual si decides rentarlo
// skillRenta: habilidad que mejora su rendimiento
// ============================================================
const MERCADO_BIENES = [
  { id: "moto",       tipo: "vehiculo", nombre: "Motocicleta",        emoji: "🏍️", costo: 18000,  plusvalia: -0.010, renta: 700,   mantenimiento: 250,  unidades: 1, skillRenta: "mecanica_basica",    desc: "Para repartos. Se deprecia, pero rentada deja flujo." },
  { id: "auto",       tipo: "vehiculo", nombre: "Automóvil",          emoji: "🚗",  costo: 90000,  plusvalia: -0.008, renta: 2800,  mantenimiento: 700,  unidades: 1, skillRenta: "mecanica_basica",    desc: "Rentable para apps de transporte." },
  { id: "camioneta",  tipo: "vehiculo", nombre: "Camioneta de carga", emoji: "🚚",  costo: 160000, plusvalia: -0.006, renta: 5000,  mantenimiento: 1100, unidades: 1, skillRenta: "mecanica_avanzada",  desc: "Ideal para fletes y negocio de carga." },
  { id: "casa_chica", tipo: "casa",     nombre: "Casa pequeña",       emoji: "🏠",  costo: 130000, plusvalia: 0.012,  renta: 3800,  mantenimiento: 800,  unidades: 1, skillRenta: "bienes_raices",      desc: "Se revaloriza y puedes rentarla." },
  { id: "depa",       tipo: "casa",     nombre: "Departamento",       emoji: "🏢",  costo: 220000, plusvalia: 0.015,  renta: 6500,  mantenimiento: 1200, unidades: 1, skillRenta: "bienes_raices",      desc: "Buena plusvalía en zona céntrica." },
  { id: "duplex",     tipo: "casa",     nombre: "Dúplex (2 unidades)", emoji: "🏘️", costo: 380000, plusvalia: 0.016,  renta: 12000, mantenimiento: 2200, unidades: 2, skillRenta: "bienes_raices",      desc: "Dos viviendas para rentar por separado." },
  { id: "edificio",   tipo: "casa",     nombre: "Edificio (6 deptos)", emoji: "🏨", costo: 950000, plusvalia: 0.018,  renta: 34000, mantenimiento: 6000, unidades: 6, skillRenta: "bienes_raices",      desc: "Varias habitaciones/unidades: gran ingreso por rentas." },
  { id: "local",      tipo: "negocio",  nombre: "Local comercial",    emoji: "🏬",  costo: 360000, plusvalia: 0.018,  renta: 13000, mantenimiento: 1800, unidades: 1, skillRenta: "emprendimiento",     desc: "Réntalo o monta tu propio negocio." },
];
// Multiplicador de renta según tus habilidades (escalado por su maestría).
const boostRenta = (bien, habilidades, dominios = {}) => {
  let mult = 1;
  const add = (id, base) => { if (habilidades.includes(id)) mult += base * dominioMult(dominios, id); };
  if (bien.skillRenta) add(bien.skillRenta, 0.30);
  if (bien.tipo === "casa") add("bienes_raices", 0.20);
  if (bien.tipo === "negocio") add("agencia_marketing", 0.30);
  if (bien.tipo === "vehiculo") add("mecanica_avanzada", 0.15);
  return mult;
};
const rentaEfectiva = (bien, habilidades, dominios = {}) => Math.round((bien.rentaBase ?? bien.renta) * boostRenta(bien, habilidades, dominios));

// ============================================================
// SONIDO (Web Audio API, sin archivos) — beeps generados
// ============================================================
let _audioCtx = null;
let _soundOn = true;
const setSoundOn = (v) => { _soundOn = v; };
const playSound = (tipo) => {
  if (!_soundOn || typeof window === "undefined") return;
  try {
    _audioCtx = _audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const ctx = _audioCtx;
    const notas = {
      click:   [[660, 0.05]],
      success: [[523, 0.08], [784, 0.12]],
      coin:    [[880, 0.05], [1175, 0.08]],
      error:   [[200, 0.18]],
      pay:     [[440, 0.06], [660, 0.06]],
      win:     [[523, 0.12], [659, 0.12], [784, 0.12], [1047, 0.22]],
    }[tipo] || [[440, 0.06]];
    let t = ctx.currentTime;
    notas.forEach(([freq, dur]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.18, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur);
      t += dur;
    });
  } catch (e) { /* audio no disponible */ }
};

// Animaciones CSS (se inyectan una sola vez)
const ANIMACIONES_CSS = `
@keyframes rr-slidein { from { opacity: 0; transform: translate(-50%, -12px); } to { opacity: 1; transform: translate(-50%, 0); } }
@keyframes rr-pop { 0% { transform: scale(0.7); opacity: 0; } 60% { transform: scale(1.04); opacity: 1; } 100% { transform: scale(1); } }
@keyframes rr-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(255,77,106,0.5); } 50% { box-shadow: 0 0 0 6px rgba(255,77,106,0); } }
@keyframes rr-fadein { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes rr-floatup { 0% { opacity: 0; transform: translateY(0) scale(0.9); } 15% { opacity: 1; } 100% { opacity: 0; transform: translateY(-42px) scale(1.05); } }
@keyframes rr-shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-5px); } 40% { transform: translateX(5px); } 60% { transform: translateX(-3px); } 80% { transform: translateX(3px); } }
@keyframes rr-flash { 0%,100% { filter: brightness(1); } 50% { filter: brightness(2.2); } }
@keyframes rr-glow { 0%,100% { box-shadow: 0 0 0 0 rgba(0,229,160,0.0); } 50% { box-shadow: 0 0 12px 2px rgba(0,229,160,0.7); } }
/* Microinteracción: todos los botones se hunden al presionar */
button { transition: transform 0.06s ease, filter 0.15s ease; }
button:active:not(:disabled) { transform: scale(0.95); }
`;

// Clave para guardar la partida en el navegador (localStorage)
const SAVE_KEY = "ratrace_save_v1";

// ============================================================
// TABLA DE LÍDERES (mejores tiempos en salir de la carrera)
// Se guarda en el navegador. Se ordena por tiempo real (meses), ascendente.
// ============================================================
const LB_KEY = "ratrace_leaderboard_v1";
const cargarTabla = () => { try { return JSON.parse(localStorage.getItem(LB_KEY)) || []; } catch { return []; } };
const guardarTabla = (list) => { try { localStorage.setItem(LB_KEY, JSON.stringify(list)); } catch {} };
const agregarATabla = (entry) => {
  const lista = cargarTabla();
  lista.push(entry);
  lista.sort((a, b) => (a.tiempoMeses - b.tiempoMeses) || (a.fecha - b.fecha));
  const top = lista.slice(0, 50);   // guardamos historial; mostramos top 10
  guardarTabla(top);
  return top;
};

// ============================================================
// HELPERS
// ============================================================
const fmt = (n) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
const getCicloLabel = (c) => ({ diario: "Día", semanal: "Semana", quincenal: "Quincena", mensual: "Mes" }[c]);
// Cuánto representa un ciclo respecto a un mes (para escalar interés, plusvalía, etc.)
const factorDe = (ciclo) => ciclo === "diario" ? 1/30 : ciclo === "semanal" ? 1/4 : ciclo === "quincenal" ? 1/2 : 1;

// ============================================================
// NIVEL DE DIFICULTAD (elegido por el jugador al empezar)
// gastosMult: escala tus gastos al iniciar
// inflacion: cuánto suben tus gastos cada mes (presión con el tiempo)
// swan: cuántos imprevistos (black swans) aparecen
// ============================================================
const DIFICULTADES = {
  facil:   { id: "facil",   label: "Fácil",   emoji: "😌", gastosMult: 0.85, inflacion: 0.000, swan: 0.5, color: "#34D399", desc: "Gastos más bajos, sin inflación y pocos imprevistos." },
  normal:  { id: "normal",  label: "Normal",  emoji: "⚖️", gastosMult: 1.00, inflacion: 0.004, swan: 1.0, color: "#FFD166", desc: "Equilibrado. Tus gastos suben un poco con el tiempo." },
  dificil: { id: "dificil", label: "Difícil", emoji: "🔥", gastosMult: 1.30, inflacion: 0.012, swan: 1.8, color: "#FF4D6A", desc: "Gastos altos, inflación fuerte y muchos imprevistos." },
};
const getDificultad = (id) => DIFICULTADES[id] || DIFICULTADES.normal;

// ============================================================
// TABLERO (la carrera de la rata): casillas en círculo.
// La casilla donde caes sesga el tipo de evento que aparece.
// ============================================================
const TIPOS_CASILLA = {
  paga:        { icono: "💰", label: "Paga",     color: "#FFD166", bias: [] },
  oportunidad: { icono: "💡", label: "Oport.",   color: "#7C6FFF", bias: ["oportunidad", "inmueble"] },
  gasto:       { icono: "🛍️", label: "Gasto",    color: "#FF8C42", bias: ["gasto", "black_swan"] },
  mercado:     { icono: "📊", label: "Mercado",  color: "#38BDF8", bias: ["inversion"] },
  cliente:     { icono: "🤝", label: "Cliente",  color: "#00E5A0", bias: ["oportunidad"] },
  chamba:      { icono: "🔧", label: "Chamba",   color: "#FB923C", bias: ["chamba"] },
  descanso:    { icono: "🌴", label: "Libre",    color: "#34D399", bias: ["descanso"] },
};
// 20 casillas alrededor del borde (rejilla 7x5)
const CASILLAS = [
  "paga", "oportunidad", "gasto", "oportunidad", "mercado", "cliente", "oportunidad",
  "descanso", "gasto", "oportunidad", "paga", "cliente", "oportunidad", "gasto",
  "mercado", "oportunidad", "chamba", "gasto", "oportunidad", "cliente",
];
// Coordenadas (col, fila) del borde de una rejilla, en sentido horario.
const posicionesBorde = (cols, filas) => {
  const c = [];
  for (let x = 1; x <= cols; x++) c.push([x, 1]);          // fila superior →
  for (let y = 2; y <= filas; y++) c.push([cols, y]);      // columna derecha ↓
  for (let x = cols - 1; x >= 1; x--) c.push([x, filas]);  // fila inferior ←
  for (let y = filas - 1; y >= 2; y--) c.push([1, y]);     // columna izquierda ↑
  return c;
};

// Estilo para los botones de mejora de maestría
const btnDom = (enabled, bg, color) => ({
  flex: 1, background: enabled ? bg : C.surface, color: enabled ? color : C.textMuted,
  border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 2px", fontSize: 10, fontWeight: 700,
  lineHeight: 1.2, cursor: enabled ? "pointer" : "not-allowed", opacity: enabled ? 1 : 0.45, textAlign: "center",
});

// Estilo reutilizable para los botones de la pestaña de deudas
const btnDeuda = (enabled, bg, color) => ({
  flex: "1 1 auto", minWidth: 92, background: enabled ? bg : C.surface, color: enabled ? color : C.textMuted,
  border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 6px", fontSize: 11, fontWeight: 700,
  cursor: enabled ? "pointer" : "not-allowed", opacity: enabled ? 1 : 0.5,
});

const getAllSkills = () => Object.values(SKILL_TREE).flatMap(rama => rama.skills);
const getSkillById = (id) => getAllSkills().find(s => s.id === id);
const getRamaBySkillId = (id) => Object.entries(SKILL_TREE).find(([, rama]) => rama.skills.some(s => s.id === id));

// ============================================================
// UI COMPONENTS
// ============================================================

function EnergyBar({ actual, max }) {
  const pct = (actual / max) * 100;
  const color = pct > 60 ? C.green : pct > 30 ? C.yellow : C.red;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.textSecondary, marginBottom: 3 }}>
        <span>⚡ Energía</span>
        <span style={{ color }}>{actual}/{max}</span>
      </div>
      <div style={{ background: C.border, borderRadius: 99, height: 5, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, background: color, height: "100%", borderRadius: 99, transition: "width 0.4s ease" }} />
      </div>
    </div>
  ); }

// Tablero circular "la carrera de la rata"
function Tablero({ pos, dado, rolling, tired, profileEmoji }) {
  const cols = 7, filas = 5;
  const coords = posicionesBorde(cols, filas);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${filas}, 1fr)`, gap: 4, aspectRatio: `${cols} / ${filas}` }}>
        {CASILLAS.map((tipo, i) => {
          const info = TIPOS_CASILLA[tipo] || {};
          const [c, f] = coords[i];
          const aqui = i === pos;
          return (
            <div key={i} style={{
              gridColumn: c, gridRow: f, borderRadius: 8,
              border: `1px solid ${aqui ? info.color : C.border}`,
              background: aqui ? `${info.color}33` : `${info.color}14`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              position: "relative", boxShadow: aqui ? `0 0 10px ${info.color}aa` : "none", transition: "box-shadow 0.2s, background 0.2s"
            }}>
              <span style={{ fontSize: 13, lineHeight: 1 }}>{info.icono}</span>
              <span style={{ fontSize: 6.5, color: C.textMuted }}>{info.label}</span>
              {aqui && <span key={pos} style={{ position: "absolute", top: -4, right: -4, fontSize: 16, animation: "rr-pop 0.3s ease" }}>{tired ? "😴" : "🐀"}</span>}
            </div>
          );
        })}
        {/* Centro: meta + dado */}
        <div style={{ gridColumn: `2 / ${cols}`, gridRow: `2 / ${filas}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
          <div style={{ fontSize: 9, color: C.textMuted, letterSpacing: 2 }}>LA CARRERA</div>
          <div style={{ width: 44, height: 44, background: "#fff", color: "#111", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, animation: rolling ? "rr-shake 0.3s ease infinite" : "none", boxShadow: "0 4px 14px rgba(0,0,0,0.4)" }}>{dado || "🎲"}</div>
          <div style={{ fontSize: 8, color: C.textMuted }}>{rolling ? "corriendo..." : "🎯 sal de la carrera"}</div>
        </div>
      </div>
    </div>
  );
}

function Avatar({ position, profileEmoji, energia }) {
  const positions = { casa: "8%", trabajo: "50%", tienda: "84%", durmiendo: "8%" };
  const tired = energia < 30;
  return (
    <div style={{ position: "relative", height: 72, background: `linear-gradient(90deg, ${C.bg}, ${C.surface})`, borderRadius: 14, overflow: "hidden", marginBottom: 14, border: `1px solid ${C.border}` }}>
      {[["🏠", "8%"], ["🏢", "50%"], ["🏪", "84%"]].map(([icon, left]) => (
        <div key={left} style={{ position: "absolute", left, top: "50%", transform: "translate(-50%, -50%)", fontSize: 18, opacity: 0.3 }}>{icon}</div>
      ))}
      <div style={{ position: "absolute", left: positions[position] || "8%", top: "50%", transform: "translate(-50%, -50%)", fontSize: 26, transition: "left 0.8s cubic-bezier(0.34,1.56,0.64,1)", filter: tired ? "grayscale(0.5)" : `drop-shadow(0 0 10px ${C.purple}99)` }}>
        {tired ? "😴" : profileEmoji}
      </div>
      {tired && (
        <div style={{ position: "absolute", top: 6, right: 10, fontSize: 10, color: C.yellow, fontWeight: 700 }}>¡Necesitas descansar!</div>
      )}
      <div style={{ position: "absolute", bottom: 5, left: 0, right: 0, display: "flex", justifyContent: "space-around" }}>
        {["Casa", "Trabajo", "Tienda"].map(l => (
          <span key={l} style={{ fontSize: 8, color: C.textMuted }}>{l}</span>
        ))}
      </div>
    </div>
  ); }

function EventModal({ evento, onChoice, habilidades, energia }) {
  const tieneHabilidad = !evento.requiereHabilidad || habilidades.includes(evento.requiereHabilidad);
  const skillRequerida = evento.requiereHabilidad ? getSkillById(evento.requiereHabilidad) : null;
  const tipoColor = { black_swan: C.red, gasto: C.yellow, chamba: C.orange, oportunidad: C.purple, inversion: C.green, descanso: C.blue, inmueble: "#D98A4E" }[evento.tipo] || C.purple;
  const tipoLabel = { black_swan: "⚠️ EVENTO CRÍTICO", gasto: "GASTO INESPERADO", chamba: "CHAMBA DISPONIBLE", oportunidad: "OPORTUNIDAD", inversion: "INVERSIÓN", descanso: "TIEMPO LIBRE", inmueble: "🏠 OPORTUNIDAD INMOBILIARIA" }[evento.tipo];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 22, padding: 24, maxWidth: 380, width: "100%", animation: "rr-pop 0.25s ease" }}>
        <div style={{ fontSize: 44, textAlign: "center", marginBottom: 10 }}>{evento.emoji}</div>
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: tipoColor, marginBottom: 6, textAlign: "center" }}>{tipoLabel}</div>
        <h3 style={{ color: C.textPrimary, fontSize: 18, fontWeight: 800, textAlign: "center", marginBottom: 8 }}>{evento.titulo}</h3>
        <p style={{ color: C.textSecondary, fontSize: 13, textAlign: "center", marginBottom: 16, lineHeight: 1.6 }}>{evento.descripcion}</p>
        {!tieneHabilidad && skillRequerida && (
          <div style={{ background: C.surface, border: `1px solid ${C.yellow}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: C.yellow, textAlign: "center" }}>
            🔒 Necesitas <strong>{skillRequerida.nombre}</strong> para aprovechar esto
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {evento.opciones.map((op, i) => {
            const imp = evento.impacto[i];
            const sinEnergia = energia.actual + (imp.energia || 0) < 0;
            const bloqueado = (i !== 1 && !tieneHabilidad) || sinEnergia;
            const energiaColor = imp.energia < 0 ? C.red : imp.energia > 0 ? C.green : C.textMuted;
            return (
              <button key={i} onClick={() => !bloqueado && onChoice(i)} style={{
                background: bloqueado ? C.surface : i === 0 ? C.purple : i === 2 ? `${C.green}22` : C.surface,
                color: bloqueado ? C.textMuted : i === 1 ? C.textSecondary : C.textPrimary,
                border: i === 2 && !bloqueado ? `1px solid ${C.green}66` : `1px solid ${C.border}`,
                borderRadius: 12, padding: "11px 14px", fontSize: 13, fontWeight: 600,
                cursor: bloqueado ? "not-allowed" : "pointer", textAlign: "left",
                display: "flex", justifyContent: "space-between", alignItems: "center", opacity: bloqueado ? 0.5 : 1
              }}>
                <span>{op}</span>
                {imp.energia !== undefined && imp.energia !== 0 && (
                  <span style={{ fontSize: 11, color: energiaColor, fontWeight: 700 }}>⚡{imp.energia > 0 ? "+" : ""}{imp.energia}</span>
                )}
              </button>
            );
          })}
        </div>
        {energia.actual < 20 && (
          <p style={{ color: C.red, fontSize: 11, textAlign: "center", marginTop: 10 }}>⚠️ Energía crítica — algunas acciones no disponibles</p>
        )}
      </div>
    </div>
  ); }

function MentorTip({ tip, onClose }) {
  return (
    <div style={{ background: `linear-gradient(135deg, #1A1640, #241C5A)`, border: `1px solid ${C.purple}44`, borderRadius: 12, padding: 14, marginBottom: 14, position: "relative" }}>
      <p style={{ color: "#C4BBFF", fontSize: 13, lineHeight: 1.6, margin: 0, paddingRight: 20 }}>{tip}</p>
      <button onClick={onClose} style={{ position: "absolute", top: 10, right: 12, background: "none", border: "none", color: C.purple, cursor: "pointer", fontSize: 14 }}>✕</button>
    </div>
  ); }

function ObjecionModal({ objecion, habilidades, onResult }) {
  const [elegida, setElegida] = useState(null);
  const [mostrarLeccion, setMostrarLeccion] = useState(false);

  const calidades = { mala: { color: C.red, label: "❌ Respuesta débil" }, buena: { color: C.yellow, label: "✓ Buena respuesta" }, excelente: { color: C.green, label: "⭐ Respuesta experta" } };

  const elegir = (opcion) => {
    setElegida(opcion);
    setMostrarLeccion(true);
  };

  const score = elegida ? getOpcionScore(elegida, habilidades) : 0;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.93)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 120, padding: 16, overflowY: "auto" }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 22, maxWidth: 390, width: "100%", overflow: "hidden", margin: "auto", animation: "rr-pop 0.25s ease" }}>

        {!mostrarLeccion ? (
          <>
            {/* Objection header */}
            <div style={{ background: `linear-gradient(135deg, #1A0A2E, #2D1054)`, padding: "20px 22px", borderBottom: `1px solid ${C.purple}33` }}>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 3, color: C.purple, marginBottom: 10 }}>🎯 OBJECIÓN DEL CLIENTE</div>
              <div style={{ background: C.surface, borderRadius: 12, padding: "14px 16px", borderLeft: `3px solid ${C.purple}` }}>
                <p style={{ color: C.textMuted, fontSize: 11, margin: "0 0 6px", fontStyle: "italic" }}>{objecion.personaje}</p>
                <p style={{ color: C.textPrimary, fontSize: 15, fontWeight: 700, margin: 0, lineHeight: 1.5 }}>{objecion.objecion}</p>
              </div>
            </div>

            {/* Options */}
            <div style={{ padding: "18px 20px" }}>
              <p style={{ color: C.textSecondary, fontSize: 12, marginBottom: 14 }}>¿Cómo respondes?</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {objecion.opciones.map((op, i) => {
                  const tieneSkill = !op.bonusSkill || habilidades.includes(op.bonusSkill);
                  return (
                    <button key={i} onClick={() => elegir(op)} style={{
                      background: C.surface, border: `1px solid ${C.border}`,
                      borderRadius: 12, padding: "12px 14px", fontSize: 13,
                      color: C.textPrimary, cursor: "pointer", textAlign: "left",
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10
                    }}>
                      <span style={{ lineHeight: 1.4 }}>{op.texto}</span>
                      {tieneSkill && op.calidad === "excelente" && (
                        <span style={{ fontSize: 10, color: C.green, whiteSpace: "nowrap", background: `${C.green}22`, padding: "2px 7px", borderRadius: 99 }}>⭐ Skill</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Result of chosen response */}
            <div style={{ background: elegida.calidad === "excelente" ? `linear-gradient(135deg, #002A1F, #003D2A)` : elegida.calidad === "buena" ? `linear-gradient(135deg, #2A1F00, #3D2E00)` : `linear-gradient(135deg, #2A0010, #3D0018)`, padding: "22px 22px 18px", borderBottom: `1px solid ${calidades[elegida.calidad]?.color}33`, textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>
                {elegida.calidad === "excelente" ? "⭐" : elegida.calidad === "buena" ? "✓" : "💡"}
              </div>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: calidades[elegida.calidad]?.color, marginBottom: 6 }}>
                {calidades[elegida.calidad]?.label}
              </div>
              {elegida.bonusSkill && habilidades.includes(elegida.bonusSkill) && (
                <div style={{ fontSize: 11, color: C.green, background: `${C.green}22`, display: "inline-block", padding: "3px 12px", borderRadius: 99, marginTop: 4 }}>
                  ⚡ Bonus de habilidad aplicado
                </div>
              )}
            </div>

            <div style={{ padding: "18px 22px" }}>
              {/* What happened */}
              <div style={{ background: C.surface, borderRadius: 12, padding: "13px 15px", marginBottom: 14, borderLeft: `3px solid ${calidades[elegida.calidad]?.color}` }}>
                <p style={{ color: C.textSecondary, fontSize: 13, lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>"{elegida.respuesta}"</p>
              </div>

              {/* Lesson */}
              <div style={{ background: `${C.purple}11`, border: `1px solid ${C.purple}33`, borderRadius: 10, padding: "11px 14px", marginBottom: 16 }}>
                <p style={{ color: "#C4BBFF", fontSize: 12, lineHeight: 1.6, margin: 0 }}>{objecion.leccion}</p>
              </div>

              {/* Skill unlock hint */}
              {elegida.bonusSkill && !habilidades.includes(elegida.bonusSkill) && (
                <div style={{ background: `${C.yellow}11`, border: `1px solid ${C.yellow}33`, borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
                  <p style={{ color: C.yellow, fontSize: 12, margin: 0 }}>
                    🔓 Con la habilidad <strong>{getSkillById(elegida.bonusSkill)?.nombre}</strong> esta respuesta hubiera tenido más peso.
                  </p>
                </div>
              )}

              <button onClick={() => onResult(score)} style={{
                background: elegida.calidad === "excelente" ? C.green : elegida.calidad === "buena" ? C.yellow : C.purple,
                color: elegida.calidad === "buena" ? "#000" : elegida.calidad === "excelente" ? "#000" : "#fff",
                border: "none", borderRadius: 14, padding: 13, fontSize: 14,
                fontWeight: 800, cursor: "pointer", width: "100%"
              }}>
                Ver resultado →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  ); }

function OutcomeModal({ outcome, onClose }) {
  const tipoConfig = {
    ganado:     { color: C.green,  bg: "linear-gradient(135deg, #002A1F, #003D2A)", border: C.green },
    seguimiento:{ color: C.yellow, bg: "linear-gradient(135deg, #2A1F00, #3D2E00)", border: C.yellow },
    perdido:    { color: C.red,    bg: "linear-gradient(135deg, #2A0010, #3D0018)", border: C.red },
    parcial:    { color: C.orange, bg: "linear-gradient(135deg, #2A1400, #3D1E00)", border: C.orange },
    neutral:    { color: C.blue,   bg: "linear-gradient(135deg, #001A2A, #00243D)", border: C.blue },
  };
  const cfg = tipoConfig[outcome.tipo] || tipoConfig.neutral;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 150, padding: 16 }}>
      <div style={{ background: C.card, border: `1px solid ${cfg.border}55`, borderRadius: 22, maxWidth: 380, width: "100%", overflow: "hidden", animation: "rr-pop 0.25s ease" }}>
        {/* Header */}
        <div style={{ background: cfg.bg, padding: "24px 24px 20px", textAlign: "center", borderBottom: `1px solid ${cfg.border}33` }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>{outcome.emoji}</div>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 3, color: cfg.color, marginBottom: 6 }}>
            {outcome.tipo === "ganado" ? "✓ CERRADO" : outcome.tipo === "seguimiento" ? "⏳ EN SEGUIMIENTO" : outcome.tipo === "parcial" ? "⚠️ PARCIAL" : outcome.tipo === "neutral" ? "📊 ESTABLE" : "✗ SIN ÉXITO"}
          </div>
          <h3 style={{ color: C.textPrimary, fontSize: 20, fontWeight: 800, margin: 0 }}>{outcome.titulo}</h3>
        </div>

        {/* Narrative */}
        <div style={{ padding: "18px 22px" }}>
          <div style={{ background: C.surface, borderRadius: 12, padding: "14px 16px", marginBottom: 16, borderLeft: `3px solid ${cfg.color}` }}>
            <p style={{ color: C.textSecondary, fontSize: 13, lineHeight: 1.75, margin: 0, fontStyle: "italic" }}>
              "{outcome.narrativa}"
            </p>
          </div>

          {/* Impact */}
          {(outcome.impacto?.dinero !== 0 || outcome.impacto?.ingreso || outcome.impacto?.activosMes) && (
            <div style={{ background: C.surface, borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Resultado financiero</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {outcome.impacto?.dinero > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: C.textSecondary }}>Pago recibido</span><span style={{ color: C.green, fontWeight: 700 }}>+{new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(outcome.impacto.dinero)}</span></div>}
                {outcome.impacto?.dinero < 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: C.textSecondary }}>Pérdida</span><span style={{ color: C.red, fontWeight: 700 }}>{new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(outcome.impacto.dinero)}</span></div>}
                {outcome.impacto?.ingreso > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: C.textSecondary }}>Ingreso mensual</span><span style={{ color: C.green, fontWeight: 700 }}>+{new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(outcome.impacto.ingreso)}/mes</span></div>}
                {outcome.impacto?.activosMes > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: C.textSecondary }}>Ingreso pasivo</span><span style={{ color: C.purple, fontWeight: 700 }}>+{new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(outcome.impacto.activosMes)}/mes</span></div>}
                {outcome.impacto?.seguimiento && <div style={{ fontSize: 12, color: C.yellow, marginTop: 4 }}>📋 Agendado para seguimiento — puede convertirse en cliente</div>}
              </div>
            </div>
          )}

          {/* Skill tip if lost */}
          {(outcome.tipo === "perdido" || outcome.tipo === "parcial") && (
            <div style={{ background: `${C.purple}11`, border: `1px solid ${C.purple}33`, borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
              <p style={{ color: C.purple, fontSize: 12, margin: 0 }}>
                💡 Mejora tus habilidades de ventas, negociación u oficio para aumentar tus probabilidades de éxito en el siguiente intento.
              </p>
            </div>
          )}

          <button onClick={onClose} style={{ background: cfg.color, color: "#000", border: "none", borderRadius: 14, padding: "13px", fontSize: 14, fontWeight: 800, cursor: "pointer", width: "100%" }}>
            {outcome.tipo === "ganado" ? "¡A seguir creciendo! →" : outcome.tipo === "seguimiento" ? "Hacer seguimiento →" : "Continuar →"}
          </button>
        </div>
      </div>
    </div>
  ); }

function SkillNode({ skill, comprada, puedePagar, puedeCursar, ramaColor, onComprar, energiaActual, costo, afin }) {
  const suficienteEnergia = energiaActual >= skill.energiaCosto;
  const disponible = !comprada && puedePagar && puedeCursar && suficienteEnergia;
  const costoMostrar = costo ?? skill.costo;
  return (
    <div style={{
      background: comprada ? `${ramaColor}15` : C.surface,
      border: `1px solid ${comprada ? ramaColor : C.border}`,
      borderRadius: 12, padding: "12px 14px",
      opacity: (!puedeCursar) ? 0.4 : 1,
      transition: "all 0.2s"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            {comprada && <span style={{ color: ramaColor, fontSize: 11 }}>✓</span>}
            {!puedeCursar && <span style={{ fontSize: 11 }}>🔒</span>}
            <span style={{ color: comprada ? ramaColor : C.textPrimary, fontSize: 13, fontWeight: 700 }}>{skill.nombre}</span>
          </div>
          <p style={{ color: C.textSecondary, fontSize: 11, margin: "0 0 6px" }}>{skill.descripcion}</p>
          <div style={{ display: "flex", gap: 10, fontSize: 11, alignItems: "center" }}>
            <span style={{ color: C.green }}>{fmt(costoMostrar)}{afin && !comprada && <span style={{ color: C.textMuted, textDecoration: "line-through", marginLeft: 4 }}>{fmt(skill.costo)}</span>}</span>
            <span style={{ color: C.red }}>⚡-{skill.energiaCosto}</span>
            {afin && <span style={{ color: ramaColor, fontWeight: 700 }}>★ afín</span>}
          </div>
        </div>
        {!comprada && (
          <button onClick={() => disponible && onComprar(skill)} style={{
            background: disponible ? ramaColor : C.border,
            color: disponible ? "#fff" : C.textMuted,
            border: "none", borderRadius: 8, padding: "6px 12px",
            fontSize: 11, fontWeight: 700, cursor: disponible ? "pointer" : "not-allowed",
            marginLeft: 10, whiteSpace: "nowrap"
          }}>
            {!puedeCursar ? "Bloqueado" : !suficienteEnergia ? "Sin energía" : !puedePagar ? "Sin dinero" : "Aprender"}
          </button>
        )}
      </div>
    </div>
  ); }

// ============================================================
// MAIN GAME
// ============================================================
export default function RatRaceGame() {
  const [screen, setScreen] = useState("intro");
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [habilidades, setHabilidades] = useState([]);
  const [finances, setFinances] = useState(null);
  const [energia, setEnergia] = useState({ actual: 100, max: 100 });
  const [ciclo, setCiclo] = useState(0);
  const [avatarPos, setAvatarPos] = useState("casa");
  const [boardPos, setBoardPos] = useState(0);   // casilla actual en el tablero
  const [dado, setDado] = useState(null);          // valor del dado
  const [rolling, setRolling] = useState(false);   // animación de movimiento
  const [evento, setEvento] = useState(null);
  const [log, setLog] = useState([]);
  const [mentorTip, setMentorTip] = useState(null);
  const [activeTab, setActiveTab] = useState("balance");
  const [activeRama, setActiveRama] = useState("oficios");
  const [notification, setNotification] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const [seguimientos, setSeguimientos] = useState([]);
  const [muted, setMuted] = useState(() => { try { return localStorage.getItem("ratrace_muted") === "1"; } catch { return false; } });
  const [haySaved, setHaySaved] = useState(() => { try { return !!localStorage.getItem(SAVE_KEY); } catch { return false; } });
  const [prestamoBanco, setPrestamoBanco] = useState("credimax");
  const [nivelDificultad, setNivelDificultad] = useState("normal");
  const [experiencia, setExperiencia] = useState(0);
  const [puntosMaestria, setPuntosMaestria] = useState(0);  // puntos que se gastan en maestría (independientes del nivel)
  const [credito, setCredito] = useState(20);               // historial crediticio 0-100
  const [pertenencias, setPertenencias] = useState([]);
  const [dominios, setDominios] = useState({});      // maestría 1-20 por habilidad
  const [objecion, setObjecion] = useState(null);   // diálogo de negociación activo
  const [negPend, setNegPend] = useState(null);      // trato pendiente de resolver tras negociar
  const [inquilino, setInquilino] = useState(null);   // negociación con inquilino al rentar
  const [floaters, setFloaters] = useState([]);       // números flotantes (+/− dinero)
  const [shakeMoney, setShakeMoney] = useState(0);    // contador para animar shake al perder dinero
  const [levelFlash, setLevelFlash] = useState(0);    // flash al subir de nivel
  const [cyclePulse, setCyclePulse] = useState(0);    // pulso del flujo al avanzar ciclo
  const [tabla, setTabla] = useState(() => cargarTabla());  // tabla de líderes
  const [miEntradaId, setMiEntradaId] = useState(null);     // id de tu partida recién registrada
  const winRecordedRef = useRef(false);
  const dineroPrevRef = useRef(null);
  const nivelPrevRef = useRef(1);
  const floaterId = useRef(0);

  // Número flotante "+$X" / "-$X"
  const flotante = (text, color) => {
    const id = ++floaterId.current;
    setFloaters(prev => [...prev.slice(-4), { id, text, color }]);
    setTimeout(() => setFloaters(prev => prev.filter(f => f.id !== id)), 1100);
  };

  // Detecta cambios de dinero → lanza número flotante (y shake si pierdes).
  useEffect(() => {
    if (!finances) { dineroPrevRef.current = null; return; }
    const prev = dineroPrevRef.current;
    if (prev != null && finances.dinero !== prev) {
      const delta = Math.round(finances.dinero - prev);
      if (Math.abs(delta) >= 1) {
        flotante((delta > 0 ? "+" : "−") + fmt(Math.abs(delta)), delta > 0 ? C.green : C.red);
        if (delta < 0) setShakeMoney(s => s + 1);
      }
    }
    dineroPrevRef.current = finances.dinero;
  }, [finances && finances.dinero]);

  // Detecta subida de nivel de experiencia → flash.
  useEffect(() => {
    const n = expNivel(experiencia);
    if (n > nivelPrevRef.current) setLevelFlash(f => f + 1);
    nivelPrevRef.current = n;
  }, [experiencia]);

  // Al GANAR: registra tu tiempo en la tabla de líderes (una sola vez).
  useEffect(() => {
    if (screen === "win" && profile && finances && !winRecordedRef.current) {
      winRecordedRef.current = true;
      const id = `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const entry = {
        id, perfil: profile.name, emoji: profile.emoji, dificultad: profile.dificultad,
        nivelEmoji: getDificultad(nivelDificultad).emoji, nivelLabel: getDificultad(nivelDificultad).label,
        ciclo, cicloLabel: getCicloLabel(profile.ciclo),
        tiempoMeses: Math.round(ciclo * factorDe(profile.ciclo) * 10) / 10,
        pasivo: finances.activosPasivos, fecha: Date.now(),
      };
      setTabla(agregarATabla(entry));
      setMiEntradaId(id);
    }
  }, [screen]);

  // Mantener el flag de sonido sincronizado con el estado de "muted"
  useEffect(() => { setSoundOn(!muted); try { localStorage.setItem("ratrace_muted", muted ? "1" : "0"); } catch {} }, [muted]);

  const sfx = (t) => { if (!muted) playSound(t); };

  const addLog = (msg, tipo = "info") => setLog(prev => [{ msg, tipo, ciclo }, ...prev].slice(0, 25));

  const showNotif = (msg, color = C.purple) => {
    setNotification({ msg, color });
    setTimeout(() => setNotification(null), 2500);
  };

  const checkWin = useCallback((fin) => {
    if (fin.activosPasivos >= fin.gastosMensuales) {
      playSound("win");
      try { localStorage.removeItem(SAVE_KEY); } catch {}
      setScreen("win");
    }
  }, []);

  const checkMentor = useCallback((fin, eng, pert = []) => {
    const al = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const total = totalDeuda(fin);
    const tieneRapidito = (fin.deudas || []).some(d => d.bancoId === "rapidito");
    const bienSinRentar = (pert || []).some(p => !p.rentando && (p.mantenimiento || 0) > 0);
    if (eng.actual < 25) { setMentorTip(MENTOR_TIPS.energiaBaja); return; }
    if (tieneRapidito) { setMentorTip(al(MENTOR_CONSEJOS.bancoCaro)); return; }
    if (total > 0 && interesMensual(fin) > total * 0.05) { setMentorTip(al(MENTOR_CONSEJOS.deudaCrece)); return; }
    if (bienSinRentar) { setMentorTip(al(MENTOR_CONSEJOS.mantenimientoAlto)); return; }
    if (total > fin.ingresoMensual * 2 && total > 0) { setMentorTip(MENTOR_TIPS.deudaAlta); return; }
    if (fin.activosPasivos >= fin.gastosMensuales * 0.7 && fin.activosPasivos < fin.gastosMensuales) { setMentorTip(al(MENTOR_CONSEJOS.cercaLibertad)); return; }
    if (fin.gastosMensuales > fin.ingresoMensual + fin.activosPasivos && fin.ingresoMensual > 0) { setMentorTip(MENTOR_TIPS.gastosMayores); return; }
    if (fin.dinero < fin.gastosMensuales * 0.5) { setMentorTip(MENTOR_TIPS.sinAhorros); return; }
    if (eng.actual < 45) { setMentorTip(al(MENTOR_CONSEJOS.cuidaEnergia)); return; }
    if (fin.activosPasivos === 0) { setMentorTip(al(MENTOR_CONSEJOS.pocoActivo)); return; }
    if (Math.random() < 0.5) {
      const cats = ["general", "negociar", "habilidades", "diversifica", "velocidad", "general"];
      const c = cats[Math.floor(Math.random() * cats.length)];
      setMentorTip(al(MENTOR_CONSEJOS[c] || MENTOR_CONSEJOS.general));
    }
  }, []);

  // Convierte la deuda inicial (un número) en deudas por banco según el perfil.
  const deudaInicial = (p) => {
    if (!p.finances.deudas) return [];
    // Asignamos la deuda de arranque a un banco coherente con cada perfil.
    const bancoPorPerfil = { freelancer: "rapidito", empleado: "credimax", profesional: "popular" };
    const bancoId = bancoPorPerfil[p.id] || "credimax";
    return [{ id: `${bancoId}_init`, bancoId, monto: p.finances.deudas }];
  };

  const startGame = (p) => {
    setProfile(p); setStats({ ...p.stats });
    setHabilidades([...p.habilidades]);
    // La dificultad escala tus gastos iniciales.
    const dif = getDificultad(nivelDificultad);
    setFinances({ ...p.finances, deudas: deudaInicial(p), gastosMensuales: Math.round(p.finances.gastosMensuales * dif.gastosMult) });
    setEnergia({ ...p.energia });
    // Cada habilidad inicial empieza con maestría 1.
    const dom0 = {}; p.habilidades.forEach(id => { dom0[id] = 1; });
    setDominios(dom0);
    setCiclo(0); setLog([]); setSeguimientos([]); setOutcome(null);
    setExperiencia(0); setPuntosMaestria(0); setCredito(20); setPertenencias([]);
    setActiveRama(p.ramaAfin || (p.ramasPermitidas && p.ramasPermitidas[0]) || "finanzas");
    setBoardPos(0); setDado(null); setRolling(false);
    winRecordedRef.current = false; setMiEntradaId(null);
    setScreen("game");
    sfx("click");
  };

  // Guardado automático de la partida cada vez que cambia algo relevante.
  useEffect(() => {
    if (screen !== "game" || !finances || !profile) return;
    try {
      const data = { profile, stats, habilidades, finances, energia, ciclo, log, seguimientos, experiencia, pertenencias, dominios, puntosMaestria, credito, nivelDificultad };
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      setHaySaved(true);
    } catch {}
  }, [screen, profile, stats, habilidades, finances, energia, ciclo, log, seguimientos, experiencia, pertenencias, dominios, puntosMaestria, credito, nivelDificultad]);

  // Cargar la partida guardada y continuar.
  const continuarPartida = () => {
    try {
      const data = JSON.parse(localStorage.getItem(SAVE_KEY));
      if (!data) return;
      setProfile(data.profile); setStats(data.stats); setHabilidades(data.habilidades);
      // Compatibilidad: si una partida vieja guardó deudas como número, la convertimos.
      const fin = { ...data.finances };
      if (!Array.isArray(fin.deudas)) fin.deudas = fin.deudas ? [{ id: "credimax_init", bancoId: "credimax", monto: fin.deudas }] : [];
      setFinances(fin);
      setEnergia(data.energia); setCiclo(data.ciclo); setLog(data.log || []); setSeguimientos(data.seguimientos || []);
      setExperiencia(data.experiencia || 0); setPertenencias(data.pertenencias || []);
      setPuntosMaestria(data.puntosMaestria ?? (data.experiencia || 0));   // compat: usa la exp previa como puntos iniciales
      setCredito(data.credito ?? 20);
      setNivelDificultad(data.nivelDificultad || "normal");
      // Compatibilidad: si una partida vieja no tiene maestrías, las creamos en 1.
      const dom = data.dominios || {}; (data.habilidades || []).forEach(id => { if (!dom[id]) dom[id] = 1; });
      setDominios(dom);
      const perms = data.profile && data.profile.ramasPermitidas;
      setActiveRama((data.profile && data.profile.ramaAfin) || (perms && perms[0]) || "finanzas");
      setBoardPos(0); setDado(null); setRolling(false);
      winRecordedRef.current = false; setMiEntradaId(null);
      setScreen("game"); sfx("click");
    } catch {}
  };

  const borrarPartida = () => { try { localStorage.removeItem(SAVE_KEY); } catch {} setHaySaved(false); };

  const avanzarCiclo = () => {
    if (energia.actual <= 0) { showNotif("Sin energía — debes descansar", C.red); return; }
    sfx("click");
    setCyclePulse(p => p + 1);

    const dif = getDificultad(nivelDificultad);
    setFinances(prev => {
      const nuevo = { ...prev };
      const factor = profile.ciclo === "diario" ? 1/30 : profile.ciclo === "semanal" ? 1/4 : profile.ciclo === "quincenal" ? 1/2 : 1;
      // Inflación: tus gastos suben un poco cada mes (según la dificultad).
      if (dif.inflacion) nuevo.gastosMensuales = Math.round(nuevo.gastosMensuales * (1 + dif.inflacion * factor));
      nuevo.dinero += (nuevo.ingresoMensual + nuevo.activosPasivos - nuevo.gastosMensuales) * factor;
      // Deudas: cada banco cobra su interés (aumenta el saldo) y se hace un pago
      // mínimo automático del 5% del saldo, limitado por el efectivo disponible.
      // Si el interés supera el pago mínimo (bancos caros), ¡la deuda crece!
      nuevo.deudas = (nuevo.deudas || []).map(d => {
        const tasa = getBanco(d.bancoId).tasa;
        const interes = d.monto * tasa * factor;
        const minObjetivo = d.monto * 0.05 * factor;
        const pago = Math.max(0, Math.min(nuevo.dinero, minObjetivo));
        nuevo.dinero -= pago;
        return { ...d, monto: Math.max(0, d.monto + interes - pago) };
      }).filter(d => d.monto > 1);
      checkWin(nuevo);
      return nuevo;
    });

    // Plusvalía: cada mes tus pertenencias cambian de valor (casas suben, vehículos bajan).
    setPertenencias(prev => prev.map(p => ({ ...p, valorActual: Math.max(0, Math.round(p.valorActual * (1 + p.plusvalia * factorDe(profile.ciclo)))) })));

    // Experiencia: cada semana trabajada suma (nivel) y da puntos de maestría (independientes).
    setExperiencia(e => Math.min(EXP_POR_NIVEL * 10, e + 1));
    setPuntosMaestria(p => p + 1);
    // Historial crediticio: mejora si pagas tu deuda cada mes; mejora poco si no debes nada.
    setCredito(c => Math.min(100, c + (totalDeuda(finances) > 0 ? 1.2 : 0.4)));

    setEnergia(prev => {
      let perdida = profile.ciclo === "diario" ? 15 : profile.ciclo === "semanal" ? 20 : profile.ciclo === "quincenal" ? 25 : 30;
      if (habilidades.includes("productividad")) perdida = Math.round(perdida * 0.8);  // rindes más con menos
      const nueva = Math.max(0, prev.actual - perdida);
      return { ...prev, actual: nueva };
    });

    setCiclo(c => c + 1);

    // Always trigger an event — weighted by skills, context y la casilla donde caes
    const elegirEvento = (fin, eng, biasTipos = []) => {
      // Solo eventos universales o exclusivos de TU perfil
      const DISP = EVENTOS.filter(e => !e.soloPerfil || e.soloPerfil === profile.id);
      // Categorize events by type for weighted selection
      const conHabilidad = DISP.filter(e => e.requiereHabilidad && habilidades.includes(e.requiereHabilidad));
      const sinHabilidad = DISP.filter(e => !e.requiereHabilidad);
      const sinSkillPeroVisible = DISP.filter(e => e.requiereHabilidad && !habilidades.includes(e.requiereHabilidad));

      // Build weighted pool. Los imprevistos (black swans) se ponderan aparte
      // según la dificultad, así que aquí los excluimos del peso base.
      let pool = [];
      // If skills unlocked → those events appear more (3x weight)
      conHabilidad.filter(e => e.tipo !== "black_swan").forEach(e => { pool.push(e); pool.push(e); pool.push(e); });
      // Universal events always available
      sinHabilidad.filter(e => e.tipo !== "black_swan").forEach(e => { pool.push(e); pool.push(e); });
      // Imprevistos según dificultad (más en difícil, menos en fácil)
      const swanCopias = Math.max(0, Math.round(dif.swan * 2));
      DISP.filter(e => e.tipo === "black_swan" && (!e.requiereHabilidad || habilidades.includes(e.requiereHabilidad)))
        .forEach(e => { for (let k = 0; k < swanCopias; k++) pool.push(e); });
      // Locked events appear sometimes (tease the player)
      if (Math.random() < 0.25) {
        sinSkillPeroVisible.forEach(e => pool.push(e));
      }

      // Context overrides: low money → more gasto/chamba, low energy → descanso
      if (fin.dinero < fin.gastosMensuales * 0.3) {
        const urgentes = DISP.filter(e => e.tipo === "chamba" && (!e.requiereHabilidad || habilidades.includes(e.requiereHabilidad)));
        urgentes.forEach(e => { pool.push(e); pool.push(e); });
      }
      if (eng.actual < 30) {
        const descansos = DISP.filter(e => e.tipo === "descanso");
        descansos.forEach(e => { pool.push(e); pool.push(e); pool.push(e); });
      }
      // Sesgo de la casilla del tablero donde caíste
      if (biasTipos && biasTipos.length) {
        DISP.filter(e => biasTipos.includes(e.tipo) && (!e.requiereHabilidad || habilidades.includes(e.requiereHabilidad)))
          .forEach(e => { pool.push(e); pool.push(e); pool.push(e); });
      }

      return pool[Math.floor(Math.random() * pool.length)];
    };

    // 🎲 Tira el dado y mueve la ficha por el tablero, casilla por casilla.
    const d = 1 + Math.floor(Math.random() * 6);
    setDado(d);
    setRolling(true);
    const inicio = boardPos;
    let pasos = 0;
    const iv = setInterval(() => {
      pasos++;
      const np = (inicio + pasos) % CASILLAS.length;
      setBoardPos(np);
      sfx("click");
      if (pasos >= d) {
        clearInterval(iv);
        setRolling(false);
        const bias = (TIPOS_CASILLA[CASILLAS[np]] || {}).bias || [];
        setFinances(fin => {
          setEnergia(eng => {
            setEvento(elegirEvento(fin, eng, bias));
            sfx("coin");
            checkMentor(fin, eng, pertenencias);
            return eng;
          });
          return fin;
        });
      }
    }, 170);

    addLog(`${getCicloLabel(profile.ciclo)} ${ciclo + 1} avanzado`, "success");
  };

  // Oportunidad de inmueble: comprar de contado, rechazar o financiar (préstamo).
  const manejarInmueble = (idx) => {
    const ev = evento;
    const bien = MERCADO_BIENES.find(b => b.id === ev.bienId);
    if (!bien) { setEvento(null); return; }
    const precio = Math.round(bien.costo * (ev.descuento || 1));
    if (idx === 1) { addLog(`Rechazaste: ${ev.titulo}`, "info"); sfx("click"); setEvento(null); return; }
    if (idx === 0 && finances.dinero < precio) { showNotif("No te alcanza de contado. Prueba financiar.", C.yellow); return; }
    const imp = ev.impacto[idx];
    if (imp?.energia) setEnergia(prev => ({ ...prev, actual: Math.min(prev.max, Math.max(0, prev.actual + imp.energia)) }));
    comprarBienPrecio(bien, precio, idx === 2);
    setMentorTip(MENTOR_TIPS.invertir);
    setEvento(null);
  };

  const handleEventChoice = (idx) => {
    if (evento.tipo === "inmueble") { manejarInmueble(idx); return; }
    const imp = evento.impacto[idx];
    const opcion = evento.opciones[idx];

    // Check if this event has an outcome resolution
    const outcomeCategoria = EVENTO_OUTCOME_MAP[evento.id];
    const esAccionPositiva = idx !== 1; // index 1 is always "reject/pass"

    if (outcomeCategoria && esAccionPositiva) {
      // Si eliges NEGOCIAR (opción 2) un trato con un cliente, se abre el panel
      // de diálogo: tus respuestas (según tus habilidades) mejoran el resultado.
      const esNegociacion = idx === 2 && (outcomeCategoria === "cliente_potencial" || outcomeCategoria === "contrato_grande");
      if (esNegociacion) {
        setEvento(null);
        setNegPend({ ev: evento, imp });
        setObjecion(getObjecion(outcomeCategoria, habilidades));
        sfx("click");
        return;
      }
      // Tomar el trato directo: se resuelve con probabilidad por skills y experiencia.
      const resolved = resolveOutcome(evento.id, habilidades, experiencia, 0, dominios);
      if (resolved) {
        setEvento(null);
        procesarResolved(evento, imp, resolved);
        return;
      }
    }

    // Standard event (no outcome resolution) — show immediate result
    setFinances(prev => {
      const nuevo = { ...prev };
      if (imp.dinero) nuevo.dinero += imp.dinero;
      if (imp.ingreso) nuevo.ingresoMensual += imp.ingreso;
      if (imp.gastos) nuevo.gastosMensuales += imp.gastos;
      // Deuda nueva por evento → entra como préstamo de CrediMax (6%). Deuda negativa → abono.
      if (imp.deuda > 0) nuevo.deudas = agregarDeuda(nuevo.deudas || [], imp.deuda, "credimax");
      if (imp.deuda < 0) nuevo.deudas = pagarDeudaGlobal(nuevo.deudas || [], -imp.deuda);
      if (imp.activosMes) nuevo.activosPasivos += imp.activosMes;
      checkWin(nuevo); return nuevo;
    });
    if (imp.energia) setEnergia(prev => ({ ...prev, actual: Math.min(prev.max, Math.max(0, prev.actual + imp.energia)) }));
    // Experiencia por una chamba realizada (acción positiva)
    if (esAccionPositiva && evento.tipo === "chamba" && imp.dinero > 0) { setExperiencia(e => Math.min(EXP_POR_NIVEL * 10, e + 2)); setPuntosMaestria(p => p + 2); }

    // Build immediate result message
    const resultParts = [];
    if (imp.dinero > 0) resultParts.push(`+${fmt(imp.dinero)}`);
    if (imp.dinero < 0) resultParts.push(`${fmt(imp.dinero)}`);
    if (imp.ingreso > 0) resultParts.push(`+${fmt(imp.ingreso)}/mes`);
    if (imp.ingreso < 0) resultParts.push(`${fmt(imp.ingreso)}/mes`);
    if (imp.activosMes > 0) resultParts.push(`+${fmt(imp.activosMes)} pasivo/mes`);
    if (imp.deuda > 0) resultParts.push(`+${fmt(imp.deuda)} deuda`);
    if (imp.energia > 0) resultParts.push(`+${imp.energia} energía`);
    if (imp.energia < 0) resultParts.push(`${imp.energia} energía`);
    const resultMsg = resultParts.length > 0 ? resultParts.join(" · ") : opcion;

    const esPositivo = imp.dinero > 0 || imp.ingreso > 0 || imp.activosMes > 0 || imp.energia > 0;
    const esNegativo = imp.dinero < 0 || imp.ingreso < 0 || imp.deuda > 0;

    if (idx === 2) setMentorTip(MENTOR_TIPS.buenaDecision);
    if (imp.activosMes > 0) setMentorTip(MENTOR_TIPS.invertir);
    addLog(`"${evento.titulo}" → ${opcion} (${resultMsg})`, esPositivo ? "success" : esNegativo ? "danger" : "info");
    showNotif(resultMsg, esPositivo ? C.green : esNegativo ? C.red : C.blue);
    sfx(esPositivo ? "success" : esNegativo ? "error" : "click");
    setEvento(null);
  };

  // Aplica el resultado resuelto (ganado/perdido/...) a tus finanzas y lo muestra.
  const procesarResolved = (ev, imp, resolved) => {
    const gan = resolved.tipo === "ganado" ? 3 : resolved.tipo === "perdido" ? 1 : 2;
    setExperiencia(e => Math.min(EXP_POR_NIVEL * 10, e + gan));
    setPuntosMaestria(p => p + gan);
    if (imp.energia) setEnergia(prev => ({ ...prev, actual: Math.min(prev.max, Math.max(0, prev.actual + imp.energia)) }));
    setFinances(prev => {
      const nuevo = { ...prev };
      if (resolved.impacto?.dinero) nuevo.dinero += resolved.impacto.dinero;
      if (resolved.impacto?.ingreso) nuevo.ingresoMensual += resolved.impacto.ingreso;
      if (resolved.impacto?.activosMes) nuevo.activosPasivos += resolved.impacto.activosMes;
      checkWin(nuevo); return nuevo;
    });
    if (resolved.impacto?.seguimiento) setSeguimientos(prev => [...prev, { evento: ev.titulo, ciclo }]);
    if (resolved.tipo === "ganado") setMentorTip(MENTOR_TIPS.buenaDecision);
    if (resolved.impacto?.activosMes > 0) setMentorTip(MENTOR_TIPS.invertir);
    addLog(`"${ev.titulo}" → ${resolved.titulo}`, resolved.tipo === "ganado" ? "success" : resolved.tipo === "perdido" ? "danger" : "info");
    sfx(resolved.tipo === "ganado" ? "success" : resolved.tipo === "perdido" ? "error" : "click");
    setOutcome(resolved);
  };

  // Tras responder en el panel de diálogo, la calidad de tu respuesta (0-3)
  // da un bono a la probabilidad de cerrar el trato.
  const resolverNegociacion = (score) => {
    const pend = negPend;
    setObjecion(null); setNegPend(null);
    if (!pend) return;
    let bonus = [-8, 4, 14, 22][score] ?? 0;
    // Las habilidades de comunicación te ayudan a convencer mejor (escaladas por su maestría).
    if (habilidades.includes("oratoria")) bonus += 4 * dominioMult(dominios, "oratoria");
    if (habilidades.includes("lenguaje_corporal")) bonus += 4 * dominioMult(dominios, "lenguaje_corporal");
    const resolved = resolveOutcome(pend.ev.id, habilidades, experiencia, bonus, dominios);
    if (resolved) procesarResolved(pend.ev, pend.imp, resolved);
  };

  // Afinidad: las habilidades de tu rama recomendada cuestan menos (-25%).
  const ramaDe = (skillId) => { const e = getRamaBySkillId(skillId); return e ? e[0] : null; };
  const esAfin = (skill) => !!(profile && profile.ramaAfin && ramaDe(skill.id) === profile.ramaAfin);
  const costoSkillEfectivo = (skill) => esAfin(skill) ? Math.round(skill.costo * 0.75) : skill.costo;

  const aprenderHabilidad = (skill) => {
    const costo = costoSkillEfectivo(skill);
    if (finances.dinero < costo) { showNotif("Sin dinero suficiente", C.red); return; }
    if (energia.actual < skill.energiaCosto) { showNotif("Sin energía suficiente", C.yellow); return; }
    if (habilidades.includes(skill.id)) { showNotif("Ya tienes esta habilidad", C.yellow); return; }
    // Algunas habilidades forman una empresa (ingreso pasivo), atraen clientes (ingreso
    // mensual) o reducen tus gastos fijos (p. ej. trabajo remoto baja el transporte).
    setFinances(prev => ({ ...prev, dinero: prev.dinero - costo,
      activosPasivos: prev.activosPasivos + (skill.ingresoPasivo || 0),
      ingresoMensual: prev.ingresoMensual + (skill.ingresoMensual || 0),
      gastosMensuales: Math.max(0, prev.gastosMensuales - (skill.gastoReduce || 0)) }));
    setEnergia(prev => ({ ...prev, actual: Math.max(0, prev.actual - skill.energiaCosto) }));
    setHabilidades(prev => [...prev, skill.id]);
    setDominios(prev => ({ ...prev, [skill.id]: 1 }));   // empieza con maestría 1
    const extra = skill.ingresoPasivo ? ` (+${fmt(skill.ingresoPasivo)}/mes pasivo)` : skill.ingresoMensual ? ` (+${fmt(skill.ingresoMensual)}/mes en clientes)` : skill.gastoReduce ? ` (−${fmt(skill.gastoReduce)}/mes de gastos)` : "";
    addLog(`${skill.ingresoPasivo ? "Formaste un negocio" : "Aprendiste"}: ${skill.nombre}${extra}`, "success");
    showNotif(skill.ingresoPasivo ? `🏢 Negocio creado:${extra}` : skill.ingresoMensual ? `📣 Clientes nuevos:${extra}` : skill.gastoReduce ? `🏠 Menos gastos:${extra}` : `✓ ${skill.nombre} desbloqueada`, C.green);
    sfx("success");
  };

  // Mejora la maestría de una habilidad. modo: "exp" (+0.15, gasta PUNTOS DE MAESTRÍA),
  // "dinero" (+0.5) o "especial" (+1.0, más caro).
  const mejorarDominio = (skill, modo) => {
    const actual = dominioDe(dominios, skill.id);
    if (actual >= DOMINIO_MAX) { showNotif("¡Maestría al máximo (20)!", C.yellow); return; }
    let inc = 0;
    if (modo === "exp") {
      if (puntosMaestria < COSTO_EXP_DOMINIO) { showNotif(`Necesitas ${COSTO_EXP_DOMINIO} puntos de maestría`, C.yellow); return; }
      setPuntosMaestria(p => Math.max(0, p - COSTO_EXP_DOMINIO));
      inc = 0.15;
    } else {
      const costo = modo === "especial" ? costoEspecialDominio(skill, dominios) : costoDineroDominio(skill, dominios);
      if (finances.dinero < costo) { showNotif("Sin dinero suficiente", C.red); return; }
      setFinances(prev => ({ ...prev, dinero: prev.dinero - costo }));
      inc = modo === "especial" ? 1.0 : 0.5;
    }
    const nuevo = Math.min(DOMINIO_MAX, Math.round((actual + inc) * 100) / 100);
    setDominios(prev => ({ ...prev, [skill.id]: nuevo }));
    addLog(`Maestría de ${skill.nombre}: ${actual.toFixed(2)} → ${nuevo.toFixed(2)} (×${dominioMult({ [skill.id]: nuevo }, skill.id).toFixed(2)})`, "success");
    showNotif(`📈 ${skill.nombre} maestría ${nuevo.toFixed(2)}/20`, C.green);
    sfx(modo === "exp" ? "click" : "pay");
  };

  const descansar = () => {
    // Descansar cuesta un costo moderado (comida, salidas, etc.), pero ~35% de las veces es gratis.
    const COSTO_DESCANSO = 1000;
    const gratis = Math.random() < 0.35 || finances.dinero < COSTO_DESCANSO;
    const costo = gratis ? 0 : COSTO_DESCANSO;
    setFinances(prev => ({ ...prev, dinero: prev.dinero - costo }));
    setEnergia(prev => ({ ...prev, actual: Math.min(prev.max, prev.actual + 35) }));
    setCiclo(c => c + 1);
    setAvatarPos("durmiendo");
    setTimeout(() => setAvatarPos("casa"), 1200);
    addLog(gratis ? "Descansaste gratis — energía recuperada" : `Descansaste (-${fmt(costo)}) — energía recuperada`, "info");
    showNotif(gratis ? "Descanso gratis ✓" : `Descansaste (-${fmt(costo)}) ✓`, C.blue);
    sfx("click");
  };

  // ============================================================
  // ACCIONES DE DEUDA (liquidar, abonar, pedir préstamo)
  // ============================================================
  const abonarDeuda = (deudaId, cantidad) => {
    setFinances(prev => {
      const deuda = (prev.deudas || []).find(d => d.id === deudaId);
      if (!deuda) return prev;
      const pago = Math.min(cantidad, deuda.monto, prev.dinero);
      if (pago <= 0) { showNotif("Sin efectivo suficiente", C.red); return prev; }
      const deudas = prev.deudas.map(d => d.id === deudaId ? { ...d, monto: d.monto - pago } : d).filter(d => d.monto > 1);
      addLog(`Abonaste ${fmt(pago)} a ${getBanco(deuda.bancoId).nombre}`, "success");
      showNotif(`Abonaste ${fmt(pago)} ✓ (+crédito)`, C.green);
      sfx("pay");
      setCredito(c => Math.min(100, c + 2));   // pagar mejora tu historial crediticio
      return { ...prev, dinero: prev.dinero - pago, deudas };
    });
  };

  const liquidarDeuda = (deudaId) => {
    setFinances(prev => {
      const deuda = (prev.deudas || []).find(d => d.id === deudaId);
      if (!deuda) return prev;
      if (prev.dinero < deuda.monto) { showNotif("No te alcanza para liquidarla. Abona lo que puedas.", C.yellow); return prev; }
      const deudas = prev.deudas.filter(d => d.id !== deudaId);
      addLog(`💥 ¡Liquidaste tu deuda con ${getBanco(deuda.bancoId).nombre}!`, "success");
      showNotif("¡Deuda liquidada! 🎉 (+crédito)", C.green);
      sfx("success");
      setCredito(c => Math.min(100, c + 6));   // liquidar sube bastante tu crédito
      return { ...prev, dinero: prev.dinero - deuda.monto, deudas };
    });
  };

  // Pedir préstamo: limitado por el cupo disponible del banco (según historial crediticio).
  const pedirPrestamo = (bancoId, cantidad) => {
    const cupo = cupoDisponible(finances, bancoId, credito);
    if (cupo <= 0) { showNotif(`${getBanco(bancoId).nombre} no te presta más por ahora`, C.red); return; }
    const monto = Math.min(cantidad, cupo);
    setFinances(prev => ({ ...prev, dinero: prev.dinero + monto, deudas: agregarDeuda(prev.deudas || [], monto, bancoId) }));
    addLog(`Pediste ${fmt(monto)} a ${getBanco(bancoId).nombre} (${Math.round(getBanco(bancoId).tasa*100)}%/mes)`, "danger");
    showNotif(monto < cantidad ? `Solo te prestaron ${fmt(monto)} (tu límite)` : `+${fmt(monto)} en efectivo (deuda)`, C.yellow);
    sfx("coin");
  };

  // ============================================================
  // PERTENENCIAS (comprar, rentar / dejar de rentar, vender)
  // ============================================================
  // Compra un bien a un precio dado. Si `financiar` es true, se toma un
  // préstamo por el precio (deuda) en vez de pagar de contado.
  // Cada bien añade su mantenimiento a los gastos mensuales.
  const comprarBienPrecio = (bien, precio, financiar = false) => {
    if (!financiar && finances.dinero < precio) { showNotif("Sin efectivo. Puedes financiarlo.", C.red); return false; }
    const nuevo = { id: `${bien.id}_${Date.now()}`, baseId: bien.id, tipo: bien.tipo, nombre: bien.nombre, emoji: bien.emoji,
      valorCompra: precio, valorActual: precio, plusvalia: bien.plusvalia, rentaBase: bien.renta,
      mantenimiento: bien.mantenimiento || 0, unidades: bien.unidades || 1, rentando: false, rentaAplicada: 0 };
    setFinances(prev => {
      const nf = { ...prev, gastosMensuales: prev.gastosMensuales + (bien.mantenimiento || 0) };
      if (financiar) nf.deudas = agregarDeuda(prev.deudas || [], precio, "credimax");
      else nf.dinero = prev.dinero - precio;
      return nf;
    });
    setPertenencias(prev => [...prev, nuevo]);
    addLog(financiar ? `Financiaste ${bien.nombre} (${fmt(precio)}, deuda) · mantenimiento +${fmt(bien.mantenimiento || 0)}/mes`
                     : `Compraste ${bien.nombre} por ${fmt(precio)} · mantenimiento +${fmt(bien.mantenimiento || 0)}/mes`, financiar ? "danger" : "success");
    showNotif(`${bien.emoji} ${bien.nombre} ${financiar ? "financiado" : "adquirido"}`, financiar ? C.yellow : C.green);
    sfx("coin");
    return true;
  };
  const comprarBien = (bien) => { comprarBienPrecio(bien, bien.costo, false); };

  // Al rentar, primero hay que BUSCAR Y NEGOCIAR con un inquilino (modal).
  const rentarBien = (id) => {
    const p = pertenencias.find(x => x.id === id);
    if (!p) return;
    if (p.rentando) {
      setFinances(f => ({ ...f, activosPasivos: Math.max(0, f.activosPasivos - (p.rentaAplicada || 0)) }));
      setPertenencias(prev => prev.map(x => x.id === id ? { ...x, rentando: false, rentaAplicada: 0 } : x));
      addLog(`Dejaste de rentar ${p.nombre}`, "info");
      showNotif("Dejaste de rentar", C.blue);
    } else {
      setInquilino({ id, base: rentaEfectiva(p, habilidades, dominios), nombre: p.nombre, emoji: p.emoji });
      sfx("click");
    }
  };
  // Aplica el resultado de la negociación con el inquilino.
  const cerrarRentaConInquilino = (rentaFinal) => {
    const data = inquilino; setInquilino(null);
    if (!data || rentaFinal <= 0) return;
    setFinances(f => { const nf = { ...f, activosPasivos: f.activosPasivos + rentaFinal }; checkWin(nf); return nf; });
    setPertenencias(prev => prev.map(x => x.id === data.id ? { ...x, rentando: true, rentaAplicada: rentaFinal } : x));
    addLog(`Inquilino para ${data.nombre}: +${fmt(rentaFinal)}/mes`, "success");
    showNotif(`🔑 +${fmt(rentaFinal)}/mes por renta`, C.green);
    sfx("coin");
  };
  // Negociar una renta más alta: depende de tus habilidades (puede salir mal).
  const negociarInquilino = () => {
    const data = inquilino; if (!data) return;
    let prob = 0.4;
    if (habilidades.includes("bienes_raices")) prob += 0.15;
    if (habilidades.includes("negociacion")) prob += 0.20;
    if (habilidades.includes("oratoria")) prob += 0.10;
    if (habilidades.includes("lenguaje_corporal")) prob += 0.10;
    if (Math.random() < Math.min(0.9, prob)) {
      cerrarRentaConInquilino(Math.round(data.base * 1.2));
    } else {
      setInquilino(null);
      addLog(`El inquilino de ${data.nombre} no aceptó la renta alta. Intenta luego.`, "danger");
      showNotif("El inquilino se fue 😕", C.red); sfx("error");
    }
  };

  const venderBien = (id) => {
    const p = pertenencias.find(x => x.id === id);
    if (!p) return;
    setFinances(f => ({ ...f, dinero: f.dinero + p.valorActual,
      activosPasivos: Math.max(0, f.activosPasivos - (p.rentando ? (p.rentaAplicada || 0) : 0)),
      gastosMensuales: Math.max(0, f.gastosMensuales - (p.mantenimiento || 0)) }));
    setPertenencias(prev => prev.filter(x => x.id !== id));
    const ganancia = p.valorActual - p.valorCompra;
    addLog(`Vendiste ${p.nombre} por ${fmt(p.valorActual)} (${ganancia >= 0 ? "+" : ""}${fmt(ganancia)})`, ganancia >= 0 ? "success" : "danger");
    showNotif(`Vendido por ${fmt(p.valorActual)}`, ganancia >= 0 ? C.green : C.yellow);
    sfx("pay");
  };

  // ============================================================
  // INVERTIR EN TU NEGOCIO Y PUBLICIDAD DE PAGO
  // ============================================================
  const tieneNegocio = !!finances && (habilidades.includes("agencia_marketing") || (pertenencias || []).some(p => p.tipo === "negocio"));
  const INVERSIONES_NEGOCIO = [
    { id: "empleado", nombre: "Contratar más gente", emoji: "👷", costo: 4000,  pasivo: 700,  desc: "Más manos = más capacidad y más ingreso pasivo." },
    { id: "sucursal", nombre: "Abrir otra sucursal", emoji: "🏬", costo: 15000, pasivo: 2600, desc: "Expande tu negocio a otra ubicación." },
    { id: "linea",    nombre: "Nueva línea de negocio", emoji: "🚀", costo: 9000,  pasivo: 1600, desc: "Diversifica con otro tipo de negocio." },
  ];
  const invertirNegocio = (inv) => {
    if (finances.dinero < inv.costo) { showNotif("Sin efectivo suficiente", C.red); return; }
    // El analista de datos hace tu inversión más rentable (+25%).
    const pasivo = Math.round(inv.pasivo * (habilidades.includes("analisis_datos") ? 1.25 : 1));
    setFinances(f => { const nf = { ...f, dinero: f.dinero - inv.costo, activosPasivos: f.activosPasivos + pasivo }; checkWin(nf); return nf; });
    addLog(`Invertiste en tu negocio: ${inv.nombre} (+${fmt(pasivo)}/mes)`, "success");
    showNotif(`🏢 ${inv.nombre}: +${fmt(pasivo)}/mes`, C.green);
    sfx("coin");
  };
  const correrPublicidad = (costo) => {
    if (finances.dinero < costo) { showNotif("Sin efectivo suficiente", C.red); return; }
    // Tus habilidades de marketing aumentan la probabilidad y el retorno de la campaña.
    let exito = 0.5;
    if (habilidades.includes("marketing")) exito += 0.2;
    if (habilidades.includes("marca_personal")) exito += 0.1;
    if (habilidades.includes("analisis_datos")) exito += 0.15;
    const funciono = Math.random() < Math.min(0.95, exito);
    setFinances(f => {
      const nuevoIngreso = funciono ? Math.round(costo * (0.6 + Math.random() * 0.9)) : 0; // clientes recurrentes
      return { ...f, dinero: f.dinero - costo, ingresoMensual: f.ingresoMensual + nuevoIngreso };
    });
    if (funciono) {
      const aprox = Math.round(costo * 0.75);
      addLog(`Publicidad de pago (${fmt(costo)}) → trajo clientes (~+${fmt(aprox)}/mes)`, "success");
      showNotif(`📣 ¡La campaña trajo clientes!`, C.green); sfx("success");
    } else {
      addLog(`Publicidad de pago (${fmt(costo)}) → no funcionó esta vez`, "danger");
      showNotif("La campaña no funcionó 😕", C.red); sfx("error");
    }
  };

  // Consejero: da un consejo contextual al pulsar el botón del mentor.
  const pedirConsejo = () => {
    if (!finances) return;
    const f = finances, total = totalDeuda(f), pasivo = f.activosPasivos, gastos = f.gastosMensuales;
    let cat = "general";
    const tieneRapidito = (f.deudas || []).some(d => d.bancoId === "rapidito");
    const bienSinRentar = (pertenencias || []).some(p => !p.rentando && (p.mantenimiento || 0) > 0);
    if (tieneRapidito) cat = "bancoCaro";
    else if (interesMensual(f) > total * 0.05 && total > 0) cat = "deudaCrece";
    else if (bienSinRentar) cat = "mantenimientoAlto";
    else if (total > f.ingresoMensual * 1.5 && total > 0) cat = "deudaAlta";
    else if (pasivo >= gastos * 0.7 && pasivo < gastos) cat = "cercaLibertad";
    else if (energia.actual < 45) cat = "cuidaEnergia";
    else if (pasivo === 0) cat = "pocoActivo";
    else if (habilidades.includes("bienes_raices") && pertenencias.length === 0) cat = "inmueble";
    else {
      // Variedad: rota entre varios temas útiles
      const opciones = ["buenFlujo", "diversifica", "negociar", "habilidades", "velocidad", "energia2", "general", "general"];
      cat = opciones[Math.floor(Math.random() * opciones.length)];
    }
    const lista = MENTOR_CONSEJOS[cat] || MENTOR_CONSEJOS.general;
    setMentorTip(lista[Math.floor(Math.random() * lista.length)]);
    sfx("click");
  };

  if (!finances && screen === "game") return null;

  const flujoMensual = finances ? finances.ingresoMensual + finances.activosPasivos - finances.gastosMensuales : 0;
  const progreso = finances ? Math.min(100, (finances.activosPasivos / Math.max(1, finances.gastosMensuales)) * 100) : 0;
  const rama = SKILL_TREE[activeRama];

  // ============================================================
  // INTRO
  // ============================================================
  if (screen === "intro") return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
        <div style={{ width: 80, height: 80, background: `radial-gradient(circle, ${C.purple}33, transparent)`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, margin: "0 auto 20px", border: `1px solid ${C.purple}44` }}>🐀</div>
        <h1 style={{ color: C.textPrimary, fontSize: 36, fontWeight: 900, letterSpacing: -1.5, margin: "0 0 6px" }}>RAT RACE</h1>
        <p style={{ color: C.purple, fontSize: 11, letterSpacing: 4, textTransform: "uppercase", margin: "0 0 28px" }}>La carrera que no te enseñaron</p>
        <p style={{ color: C.textSecondary, fontSize: 14, lineHeight: 1.8, margin: "0 0 40px" }}>
          Toma decisiones financieras reales. Aprende habilidades. Construye activos. Cuida tu energía. Sal del rat race.
        </p>
        {haySaved && (
          <button onClick={continuarPartida} style={{ background: `linear-gradient(135deg, ${C.green}, #00A878)`, color: "#03281b", border: "none", borderRadius: 16, padding: "15px 48px", fontSize: 15, fontWeight: 800, cursor: "pointer", width: "100%", marginBottom: 10 }}>
            ▶️ Continuar partida
          </button>
        )}
        <button onClick={() => { if (haySaved) borrarPartida(); setScreen("select"); }} style={{ background: haySaved ? C.surface : `linear-gradient(135deg, ${C.purple}, #9333EA)`, color: haySaved ? C.textSecondary : "white", border: haySaved ? `1px solid ${C.border}` : "none", borderRadius: 16, padding: "15px 48px", fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%", marginBottom: 12 }}>
          {haySaved ? "Empezar de nuevo" : "Comenzar →"}
        </button>
        <p style={{ color: C.textMuted, fontSize: 11 }}>Meta: Ingresos pasivos {">"} Gastos mensuales</p>
      </div>
    </div>
  );

  // ============================================================
  // SELECT
  // ============================================================
  if (screen === "select") return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: 20, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <button onClick={() => setScreen("intro")} style={{ background: "none", border: "none", color: C.textSecondary, cursor: "pointer", fontSize: 13, marginBottom: 20, padding: 0 }}>← Volver</button>
        <h2 style={{ color: C.textPrimary, fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Elige tu perfil</h2>
        <p style={{ color: C.textSecondary, fontSize: 13, marginBottom: 14 }}>Cada uno tiene diferente punto de partida y habilidades iniciales.</p>

        {/* Selector de dificultad */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>🎚️ Dificultad</div>
          <div style={{ display: "flex", gap: 6 }}>
            {Object.values(DIFICULTADES).map(d => (
              <button key={d.id} onClick={() => { setNivelDificultad(d.id); sfx("click"); }} style={{
                flex: 1, background: nivelDificultad === d.id ? `${d.color}22` : C.surface,
                border: `1px solid ${nivelDificultad === d.id ? d.color : C.border}`,
                color: nivelDificultad === d.id ? d.color : C.textSecondary,
                borderRadius: 12, padding: "9px 4px", fontSize: 12, fontWeight: 700, cursor: "pointer"
              }}>{d.emoji} {d.label}</button>
            ))}
          </div>
          <p style={{ color: C.textMuted, fontSize: 11, margin: "6px 0 0" }}>{getDificultad(nivelDificultad).desc}</p>
        </div>
        {PROFILES.map(p => (
          <div key={p.id} onClick={() => startGame(p)} style={{ background: C.card, border: `1px solid ${p.color}33`, borderRadius: 16, padding: 18, marginBottom: 10, cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 30 }}>{p.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: C.textPrimary, fontWeight: 800, fontSize: 15 }}>{p.name}</span>
                  <span style={{ background: `${p.color}22`, color: p.color, fontSize: 10, padding: "3px 10px", borderRadius: 99, fontWeight: 700 }}>{p.dificultad}</span>
                </div>
                <p style={{ color: C.textSecondary, fontSize: 12, margin: "3px 0 0" }}>{p.description}</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
              {[
                { label: "Inicio", value: fmt(p.finances.dinero), color: C.green },
                { label: "Deuda", value: fmt(p.finances.deudas), color: p.finances.deudas > 0 ? C.red : C.green },
                { label: "Energía", value: `${p.energia.actual}%`, color: C.yellow },
              ].map(item => (
                <div key={item.label} style={{ background: C.surface, borderRadius: 8, padding: "8px 10px" }}>
                  <div style={{ color: C.textMuted, fontSize: 10 }}>{item.label}</div>
                  <div style={{ color: item.color, fontWeight: 700, fontSize: 13 }}>{item.value}</div>
                </div>
              ))}
            </div>
            {p.habilidades.length > 0 && (
              <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4 }}>
                {p.habilidades.map(hId => {
                  const sk = getSkillById(hId);
                  return sk ? <span key={hId} style={{ background: C.surface, color: C.textSecondary, fontSize: 10, padding: "2px 8px", borderRadius: 99, border: `1px solid ${C.border}` }}>✓ {sk.nombre}</span> : null;
                })}
              </div>
            )}
            {p.ramaAfin && SKILL_TREE[p.ramaAfin] && (
              <div style={{ marginTop: 8, fontSize: 11, color: SKILL_TREE[p.ramaAfin].color }}>
                ★ Carrera recomendada: <strong>{SKILL_TREE[p.ramaAfin].icon} {SKILL_TREE[p.ramaAfin].label}</strong> (−25% en sus habilidades)
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ============================================================
  // WIN
  // ============================================================
  if (screen === "win") return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Inter', -apple-system, sans-serif", overflowY: "auto" }}>
      <div style={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🏆</div>
        <h1 style={{ color: C.green, fontSize: 26, fontWeight: 900, marginBottom: 6 }}>¡Saliste del Rat Race!</h1>
        <p style={{ color: C.textSecondary, fontSize: 14, marginBottom: 20 }}>
          Lo lograste en <strong style={{ color: C.textPrimary }}>{ciclo} {getCicloLabel(profile?.ciclo)}s</strong> (≈ {profile ? Math.round(ciclo * factorDe(profile.ciclo) * 10) / 10 : ciclo} meses) como <strong style={{ color: C.textPrimary }}>{profile?.name}</strong>
        </p>
        <div style={{ background: C.card, borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <div style={{ color: C.textSecondary, fontSize: 12, marginBottom: 6 }}>Ingreso pasivo mensual</div>
          <div style={{ color: C.green, fontSize: 38, fontWeight: 900 }}>{fmt(finances?.activosPasivos || 0)}</div>
          <div style={{ color: C.textMuted, fontSize: 12, marginTop: 6 }}>Gastos mensuales: {fmt(finances?.gastosMensuales || 0)}</div>
        </div>
        <div style={{ background: C.card, borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <div style={{ color: C.textSecondary, fontSize: 12, marginBottom: 10 }}>Habilidades que aprendiste</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
            {habilidades.map(hId => {
              const sk = getSkillById(hId);
              const ramaEntry = getRamaBySkillId(hId);
              const ramaColor = ramaEntry ? SKILL_TREE[ramaEntry[0]].color : C.purple;
              return sk ? <span key={hId} style={{ background: `${ramaColor}22`, color: ramaColor, fontSize: 11, padding: "3px 10px", borderRadius: 99, border: `1px solid ${ramaColor}44` }}>✓ {sk.nombre}</span> : null;
            })}
          </div>
        </div>
        {/* 🏁 PODIO + TOP 10 (tus partidas más rápidas) */}
        {(() => {
          const top = tabla.slice(0, 10);
          const miRank = tabla.findIndex(e => e.id === miEntradaId);
          const podio = top.slice(0, 3);
          const medallas = ["🥇", "🥈", "🥉"];
          const alturas = [66, 50, 42];
          return (
            <div style={{ background: C.card, borderRadius: 16, padding: 16, marginBottom: 20, animation: "rr-fadein 0.4s ease" }}>
              <div style={{ color: C.textSecondary, fontSize: 12, marginBottom: 12 }}>🏁 Mejores tiempos en salir de la carrera</div>
              {/* Podio: 2º, 1º (más alto al centro), 3º */}
              <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 8, marginBottom: 14 }}>
                {[1, 0, 2].map(pos => {
                  const e = podio[pos];
                  if (!e) return <div key={pos} style={{ flex: 1 }} />;
                  const esMio = e.id === miEntradaId;
                  return (
                    <div key={pos} style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ fontSize: 24 }}>{medallas[pos]}</div>
                      <div style={{ fontSize: 12, color: esMio ? C.green : C.textPrimary, fontWeight: 800 }}>{e.tiempoMeses} <span style={{ fontSize: 9, fontWeight: 400 }}>meses</span></div>
                      <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 4 }}>{e.emoji}</div>
                      <div style={{ height: alturas[pos], background: esMio ? `linear-gradient(180deg, ${C.green}, ${C.green}55)` : `linear-gradient(180deg, ${C.purple}, ${C.purple}44)`, borderRadius: "8px 8px 0 0" }} />
                    </div>
                  );
                })}
              </div>
              {/* Lista top 10 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {top.map((e, i) => (
                  <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, padding: "5px 8px", borderRadius: 8, background: e.id === miEntradaId ? `${C.green}22` : "transparent", border: e.id === miEntradaId ? `1px solid ${C.green}66` : "1px solid transparent" }}>
                    <span style={{ color: C.textSecondary }}>{i + 1}. {e.emoji} {e.perfil} {e.nivelEmoji || ""}</span>
                    <span style={{ color: e.id === miEntradaId ? C.green : C.textPrimary, fontWeight: 700 }}>{e.tiempoMeses} meses <span style={{ color: C.textMuted, fontWeight: 400 }}>({e.ciclo} {e.cicloLabel}s)</span></span>
                  </div>
                ))}
              </div>
              {miRank >= 0 && (
                <p style={{ color: miRank < 3 ? C.yellow : C.textSecondary, fontSize: 12, marginTop: 10, fontWeight: 700 }}>
                  {miRank === 0 ? "🥇 ¡NUEVO RÉCORD! Quedaste en 1er lugar" : `Tu partida quedó en el lugar #${miRank + 1} de ${tabla.length}`}
                </p>
              )}
            </div>
          );
        })()}
        <button onClick={() => setScreen("select")} style={{ background: `linear-gradient(135deg, ${C.purple}, #9333EA)`, color: "white", border: "none", borderRadius: 16, padding: 15, fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%" }}>
          Jugar de nuevo
        </button>
      </div>
    </div>
  );

  // ============================================================
  // GAME
  // ============================================================
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter', -apple-system, sans-serif", maxWidth: 420, margin: "0 auto", paddingBottom: 100 }}>
      <style>{ANIMACIONES_CSS}</style>

      {/* Notification */}
      {notification && (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", background: notification.color, color: "#fff", padding: "9px 22px", borderRadius: 99, fontSize: 13, fontWeight: 700, zIndex: 200, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", whiteSpace: "nowrap", pointerEvents: "none", animation: "rr-slidein 0.25s ease" }}>
          {notification.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ background: C.surface, padding: "14px 18px", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", letterSpacing: 2, marginBottom: 2 }}>{profile.name}</div>
            <div key={shakeMoney} style={{ fontSize: 22, fontWeight: 900, color: C.textPrimary, letterSpacing: -0.5, animation: shakeMoney ? "rr-shake 0.4s ease" : "none" }}>{fmt(finances.dinero)}</div>
            {/* Números flotantes +/- dinero */}
            <div style={{ position: "absolute", left: 0, top: 14, pointerEvents: "none" }}>
              {floaters.map((f, i) => (
                <div key={f.id} style={{ position: "absolute", left: i * 4, top: 0, color: f.color, fontWeight: 800, fontSize: 14, whiteSpace: "nowrap", animation: "rr-floatup 1.1s ease forwards" }}>{f.text}</div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", letterSpacing: 2, marginBottom: 2 }}>{getCicloLabel(profile.ciclo)} {ciclo}</div>
            <div key={cyclePulse} style={{ fontSize: 14, fontWeight: 700, color: flujoMensual >= 0 ? C.green : C.red, display: "inline-block", animation: cyclePulse && flujoMensual >= 0 ? "rr-pop 0.5s ease" : "none" }}>
              {flujoMensual >= 0 ? "+" : ""}{fmt(flujoMensual)}/mes
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <EnergyBar actual={energia.actual} max={energia.max} />
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.textSecondary, marginBottom: 3 }}>
              <span>🏆 Libertad</span><span>{Math.round(progreso)}%</span>
            </div>
            <div style={{ background: C.border, borderRadius: 99, height: 5, overflow: "hidden", animation: progreso > 85 ? "rr-glow 1.2s infinite" : "none" }}>
              <div style={{ width: `${progreso}%`, background: `linear-gradient(90deg, ${C.purple}, ${C.green})`, height: "100%", borderRadius: 99, transition: "width 0.5s ease" }} />
            </div>
          </div>
        </div>
        {/* Barra 1: nivel de experiencia (1 a 10) — da bonos, no se gasta */}
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.textSecondary, marginBottom: 3 }}>
            <span>🎓 Nivel de experiencia {expNivel(experiencia)}/10</span>
            <span style={{ color: C.yellow }}>+{expBonusProb(experiencia)}% éxito · pagos ×{expBonusPago(experiencia).toFixed(2)}</span>
          </div>
          <div style={{ background: C.border, borderRadius: 99, height: 6, overflow: "hidden" }}>
            <div key={levelFlash} style={{ width: `${Math.round(expProgreso(experiencia) * 100)}%`, background: `linear-gradient(90deg, ${C.orange}, ${C.yellow})`, height: "100%", borderRadius: 99, transition: "width 0.5s ease", animation: levelFlash ? "rr-flash 0.6s ease" : "none" }} />
          </div>
        </div>
        {/* Barra 2: puntos de maestría — se gastan en mejorar habilidades (independientes) */}
        <div style={{ marginTop: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.textSecondary }}>
            <span>🏅 Puntos de maestría</span>
            <span style={{ color: C.purple, fontWeight: 700 }}>{puntosMaestria} pts</span>
          </div>
        </div>
      </div>

      <div style={{ padding: 14 }}>
        <Tablero pos={boardPos} dado={dado} rolling={rolling} tired={energia.actual < 30} profileEmoji={profile.emoji} />
        {mentorTip && <MentorTip tip={mentorTip} onClose={() => setMentorTip(null)} />}

        {/* Controles rápidos: consejo del mentor y sonido */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <button onClick={pedirConsejo} style={{ flex: 1, background: `linear-gradient(135deg, #1A1640, #241C5A)`, border: `1px solid ${C.purple}44`, color: "#C4BBFF", borderRadius: 12, padding: "10px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            🧑‍🏫 Pedir consejo
          </button>
          <button onClick={() => { setMuted(m => !m); }} title="Activar/silenciar sonido" style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.textSecondary, borderRadius: 12, padding: "10px 14px", fontSize: 14, cursor: "pointer" }}>
            {muted ? "🔇" : "🔊"}
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: C.surface, borderRadius: 12, padding: 4, marginBottom: 14, gap: 2 }}>
          {[["balance", "💰", "Balance"], ["deudas", "💳", "Deudas"], ["pertenencias", "🏠", "Bienes"], ["habilidades", "⚡", "Skills"], ["log", "📋", "Log"]].map(([tab, icon, label]) => (
            <button key={tab} onClick={() => { setActiveTab(tab); sfx("click"); }} style={{
              flex: 1, background: activeTab === tab ? C.card : "none", border: activeTab === tab ? `1px solid ${C.border}` : "1px solid transparent",
              color: activeTab === tab ? C.textPrimary : C.textSecondary, padding: "8px 2px", borderRadius: 8,
              fontSize: 10, fontWeight: 600, cursor: "pointer", position: "relative", whiteSpace: "nowrap"
            }}>
              <span style={{ fontSize: 13 }}>{icon}</span><br />{label}
              {tab === "deudas" && totalDeuda(finances) > 0 && (
                <span style={{ position: "absolute", top: 2, right: 4, width: 7, height: 7, borderRadius: 99, background: C.red }} />
              )}
            </button>
          ))}
        </div>

        {/* BALANCE TAB */}
        {activeTab === "balance" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Ingresos mensuales", value: fmt(finances.ingresoMensual), color: C.green, icon: "📥" },
              { label: "Gastos mensuales", value: fmt(finances.gastosMensuales), color: C.red, icon: "📤" },
              { label: "Ingresos pasivos", value: fmt(finances.activosPasivos), color: C.purple, icon: "🔁" },
              { label: "Deudas totales", value: fmt(totalDeuda(finances)), color: totalDeuda(finances) > 0 ? C.yellow : C.green, icon: "💳" },
            ].map(item => (
              <div key={item.label} style={{ background: C.card, borderRadius: 12, padding: "13px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${C.border}` }}>
                <span style={{ color: C.textSecondary, fontSize: 13 }}>{item.icon} {item.label}</span>
                <span style={{ color: item.color, fontWeight: 700, fontSize: 15 }}>{item.value}</span>
              </div>
            ))}
            <div style={{ background: C.card, borderRadius: 12, padding: "13px 16px", border: `1px solid ${flujoMensual >= 0 ? C.green + "44" : C.red + "44"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: C.textSecondary, fontSize: 13 }}>📊 Flujo mensual neto</span>
                <span style={{ color: flujoMensual >= 0 ? C.green : C.red, fontWeight: 800, fontSize: 16 }}>{flujoMensual >= 0 ? "+" : ""}{fmt(flujoMensual)}</span>
              </div>
            </div>
            {seguimientos.length > 0 && (
              <div style={{ background: `${C.yellow}11`, border: `1px solid ${C.yellow}33`, borderRadius: 12, padding: "13px 16px" }}>
                <div style={{ fontSize: 11, color: C.yellow, fontWeight: 700, marginBottom: 8 }}>📋 EN SEGUIMIENTO ({seguimientos.length})</div>
                {seguimientos.map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.textSecondary, marginBottom: 4 }}>
                    <span>{s.evento}</span>
                    <span style={{ color: C.textMuted }}>{getCicloLabel(profile.ciclo)} {s.ciclo}</span>
                  </div>
                ))}
                <p style={{ color: C.textMuted, fontSize: 11, margin: "8px 0 0" }}>Estos clientes pueden convertirse en contratos en próximos ciclos.</p>
              </div>
            )}
          </div>
        )}

        {/* DEUDAS TAB */}
        {activeTab === "deudas" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, animation: "rr-fadein 0.3s ease" }}>
            {/* Resumen */}
            <div style={{ background: C.card, borderRadius: 12, padding: "13px 16px", border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: C.textSecondary, fontSize: 13 }}>💳 Deuda total</span>
                <span style={{ color: totalDeuda(finances) > 0 ? C.red : C.green, fontWeight: 800, fontSize: 16 }}>{fmt(totalDeuda(finances))}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: C.textMuted, fontSize: 12 }}>Interés que se cobra este mes</span>
                <span style={{ color: C.yellow, fontWeight: 700, fontSize: 13 }}>{fmt(interesMensual(finances))}/mes</span>
              </div>
            </div>

            {/* Historial crediticio: determina cuánto te prestan los bancos */}
            <div style={{ background: C.card, borderRadius: 12, padding: "13px 16px", border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.textSecondary, marginBottom: 5 }}>
                <span>📊 Historial crediticio</span>
                <span style={{ color: credito >= 60 ? C.green : credito >= 30 ? C.yellow : C.red, fontWeight: 700 }}>{Math.round(credito)}/100</span>
              </div>
              <div style={{ background: C.border, borderRadius: 99, height: 7, overflow: "hidden" }}>
                <div style={{ width: `${credito}%`, background: `linear-gradient(90deg, ${C.red}, ${C.yellow}, ${C.green})`, height: "100%", borderRadius: 99, transition: "width 0.5s ease" }} />
              </div>
              <p style={{ color: C.textMuted, fontSize: 10, margin: "6px 0 0" }}>Pagar tus deudas a tiempo lo sube; un mejor historial = los bancos te prestan más.</p>
            </div>

            {/* Lista de deudas por banco */}
            {(finances.deudas || []).length === 0 ? (
              <div style={{ background: `${C.green}11`, border: `1px solid ${C.green}33`, borderRadius: 12, padding: "16px", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>🎉</div>
                <p style={{ color: C.green, fontSize: 13, margin: 0, fontWeight: 700 }}>¡Estás libre de deudas!</p>
                <p style={{ color: C.textMuted, fontSize: 11, margin: "6px 0 0" }}>Sin deudas, todo tu flujo va a construir riqueza.</p>
              </div>
            ) : (
              finances.deudas.map(d => {
                const b = getBanco(d.bancoId);
                const interes = d.monto * b.tasa;
                const puede1000 = finances.dinero >= 1000;
                const puede5000 = finances.dinero >= 5000;
                const puedeLiquidar = finances.dinero >= d.monto;
                const creciendo = interes > d.monto * 0.05; // el interés supera el pago mínimo
                return (
                  <div key={d.id} style={{ background: C.card, borderRadius: 12, padding: "13px 16px", border: `1px solid ${b.color}44`, animation: creciendo ? "rr-pulse 2s infinite" : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div>
                        <span style={{ color: C.textPrimary, fontWeight: 700, fontSize: 14 }}>{b.emoji} {b.nombre}</span>
                        <div style={{ color: b.color, fontSize: 11, fontWeight: 700 }}>{Math.round(b.tasa * 100)}%/mes · interés {fmt(interes)}/mes</div>
                      </div>
                      <span style={{ color: C.red, fontWeight: 800, fontSize: 16 }}>{fmt(d.monto)}</span>
                    </div>
                    {creciendo && <p style={{ color: C.red, fontSize: 10, margin: "0 0 8px" }}>⚠️ El interés supera el pago mínimo: esta deuda crece sola. ¡Abona fuerte!</p>}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <button disabled={!puede1000} onClick={() => abonarDeuda(d.id, 1000)} style={btnDeuda(puede1000, C.surface, C.textPrimary)}>Abonar $1,000</button>
                      <button disabled={!puede5000} onClick={() => abonarDeuda(d.id, 5000)} style={btnDeuda(puede5000, C.surface, C.textPrimary)}>Abonar $5,000</button>
                      <button disabled={!puedeLiquidar} onClick={() => liquidarDeuda(d.id)} style={btnDeuda(puedeLiquidar, `${C.green}22`, C.green)}>Liquidar {fmt(d.monto)}</button>
                    </div>
                  </div>
                );
              })
            )}

            {/* Solicitar préstamo */}
            <div style={{ background: C.surface, borderRadius: 12, padding: "14px 16px", border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 12, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>🏦 Solicitar préstamo</div>
              <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                {Object.values(BANCOS).map(b => (
                  <button key={b.id} onClick={() => { setPrestamoBanco(b.id); sfx("click"); }} style={{
                    flex: 1, background: prestamoBanco === b.id ? `${b.color}22` : C.card,
                    border: `1px solid ${prestamoBanco === b.id ? b.color : C.border}`, color: prestamoBanco === b.id ? b.color : C.textSecondary,
                    borderRadius: 10, padding: "8px 4px", fontSize: 10, fontWeight: 700, cursor: "pointer"
                  }}>
                    {b.emoji}<br />{b.nombre}<br /><span style={{ fontSize: 11 }}>{Math.round(b.tasa * 100)}%/mes</span>
                  </button>
                ))}
              </div>
              <p style={{ color: C.textMuted, fontSize: 11, margin: "0 0 4px" }}>{getBanco(prestamoBanco).desc}</p>
              {(() => {
                const cupo = cupoDisponible(finances, prestamoBanco, credito);
                const limite = limiteBanco(prestamoBanco, credito);
                return (
                  <>
                    <p style={{ color: cupo > 0 ? C.green : C.red, fontSize: 11, margin: "0 0 8px", fontWeight: 700 }}>
                      Cupo disponible: {fmt(cupo)} <span style={{ color: C.textMuted, fontWeight: 400 }}>(límite {fmt(limite)} según tu crédito)</span>
                    </p>
                    <div style={{ display: "flex", gap: 6 }}>
                      {[5000, 20000, 50000].map(cant => {
                        const puede = cupo >= cant;
                        return (
                          <button key={cant} disabled={!puede} onClick={() => pedirPrestamo(prestamoBanco, cant)} style={{
                            flex: 1, background: puede ? C.card : C.surface, border: `1px solid ${C.border}`, color: puede ? C.textPrimary : C.textMuted,
                            borderRadius: 10, padding: "10px 4px", fontSize: 12, fontWeight: 700, cursor: puede ? "pointer" : "not-allowed", opacity: puede ? 1 : 0.5
                          }}>+{fmt(cant)}</button>
                        );
                      })}
                      <button disabled={cupo <= 0} onClick={() => pedirPrestamo(prestamoBanco, cupo)} style={{
                        flex: 1, background: cupo > 0 ? `${C.purple}` : C.surface, border: "none", color: cupo > 0 ? "#fff" : C.textMuted,
                        borderRadius: 10, padding: "10px 4px", fontSize: 12, fontWeight: 700, cursor: cupo > 0 ? "pointer" : "not-allowed", opacity: cupo > 0 ? 1 : 0.5
                      }}>Máx</button>
                    </div>
                  </>
                );
              })()}
            </div>

            <div style={{ background: `${C.purple}11`, border: `1px solid ${C.purple}33`, borderRadius: 10, padding: "10px 14px" }}>
              <p style={{ color: "#C4BBFF", fontSize: 11, margin: 0, lineHeight: 1.6 }}>💡 Cada mes se cobra el interés y un pago mínimo automático (5% del saldo). En bancos caros el interés supera el mínimo y la deuda crece. <strong>Liquida o abona</strong> para romper el ciclo.</p>
            </div>
          </div>
        )}

        {/* PERTENENCIAS TAB */}
        {activeTab === "pertenencias" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, animation: "rr-fadein 0.3s ease" }}>
            {/* Tus pertenencias */}
            <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>🏠 Tus pertenencias</div>
            {pertenencias.length === 0 ? (
              <div style={{ background: C.surface, border: `1px dashed ${C.border}`, borderRadius: 12, padding: "14px", textAlign: "center" }}>
                <p style={{ color: C.textMuted, fontSize: 12, margin: 0 }}>Aún no tienes bienes. Compra vehículos, casas o negocios abajo: ganan plusvalía y puedes rentarlos para generar ingreso pasivo.</p>
              </div>
            ) : (
              pertenencias.map(p => {
                const ganancia = p.valorActual - p.valorCompra;
                const rentaPot = rentaEfectiva(p, habilidades, dominios);
                return (
                  <div key={p.id} style={{ background: C.card, borderRadius: 12, padding: "13px 16px", border: `1px solid ${p.rentando ? C.green + "66" : C.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <span style={{ color: C.textPrimary, fontWeight: 700, fontSize: 14 }}>{p.emoji} {p.nombre}</span>
                        <div style={{ fontSize: 11, color: C.textSecondary }}>Valor actual: <strong style={{ color: C.textPrimary }}>{fmt(p.valorActual)}</strong> <span style={{ color: ganancia >= 0 ? C.green : C.red }}>({ganancia >= 0 ? "+" : ""}{fmt(ganancia)})</span></div>
                        <div style={{ fontSize: 11, color: p.rentando ? C.green : C.textMuted }}>{p.rentando ? `🟢 Rentando: +${fmt(p.rentaAplicada)}/mes` : `Renta potencial: ${fmt(rentaPot)}/mes`}</div>
                        <div style={{ fontSize: 11, color: C.yellow }}>🧰 Mantenimiento: {fmt(p.mantenimiento || 0)}/mes{p.unidades > 1 ? ` · ${p.unidades} unidades` : ""}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <button onClick={() => rentarBien(p.id)} style={btnDeuda(true, p.rentando ? C.surface : `${C.green}22`, p.rentando ? C.textSecondary : C.green)}>{p.rentando ? "Dejar de rentar" : "Rentar"}</button>
                      <button onClick={() => venderBien(p.id)} style={btnDeuda(true, `${C.yellow}22`, C.yellow)}>Vender {fmt(p.valorActual)}</button>
                    </div>
                  </div>
                );
              })
            )}

            {/* Tu negocio: invertir y publicidad */}
            {(tieneNegocio || habilidades.includes("marketing") || habilidades.includes("marca_personal")) && (
              <div style={{ background: `${"#22D3EE"}11`, border: `1px solid ${"#22D3EE"}44`, borderRadius: 12, padding: "13px 16px" }}>
                <div style={{ fontSize: 11, color: "#22D3EE", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, fontWeight: 700 }}>🏢 Tu negocio</div>
                {tieneNegocio ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                    {INVERSIONES_NEGOCIO.map(inv => {
                      const puede = finances.dinero >= inv.costo;
                      return (
                        <button key={inv.id} disabled={!puede} onClick={() => invertirNegocio(inv)} style={{ background: puede ? C.surface : C.surface, border: `1px solid ${C.border}`, color: puede ? C.textPrimary : C.textMuted, borderRadius: 10, padding: "10px 12px", fontSize: 12, fontWeight: 600, cursor: puede ? "pointer" : "not-allowed", textAlign: "left", opacity: puede ? 1 : 0.5 }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}><span>{inv.emoji} {inv.nombre}</span><span style={{ color: C.green }}>+{fmt(inv.pasivo)}/mes</span></div>
                          <div style={{ fontSize: 10, color: C.textMuted }}>{inv.desc} · {fmt(inv.costo)}</div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ fontSize: 11, color: C.textMuted, margin: "0 0 10px" }}>Forma una empresa (habilidad "Agencia de marketing") o compra un negocio para poder invertir y contratar gente.</p>
                )}
                <div style={{ fontSize: 11, color: C.textSecondary, marginBottom: 6 }}>📣 Publicidad de pago (atrae clientes):</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[2500, 5000].map(c => (
                    <button key={c} onClick={() => correrPublicidad(c)} style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, color: C.textPrimary, borderRadius: 10, padding: "9px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Invertir {fmt(c)}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Mercado de bienes */}
            <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>🏪 Mercado</div>
            {MERCADO_BIENES.map(b => {
              const puede = finances.dinero >= b.costo;
              const rentaPot = rentaEfectiva(b, habilidades, dominios);
              const tipoLabel = { vehiculo: "🚗 Vehículo", casa: "🏠 Inmueble", negocio: "🏢 Negocio" }[b.tipo];
              const plus = b.plusvalia >= 0 ? `+${(b.plusvalia * 100).toFixed(1)}%/mes` : `${(b.plusvalia * 100).toFixed(1)}%/mes`;
              return (
                <div key={b.id} style={{ background: C.surface, borderRadius: 12, padding: "12px 14px", border: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ color: C.textPrimary, fontWeight: 700, fontSize: 13 }}>{b.emoji} {b.nombre}</span>
                    <span style={{ fontSize: 10, color: C.textMuted }}>{tipoLabel}</span>
                  </div>
                  <p style={{ color: C.textMuted, fontSize: 11, margin: "0 0 6px" }}>{b.desc}</p>
                  <div style={{ display: "flex", gap: 10, fontSize: 11, marginBottom: 8, flexWrap: "wrap" }}>
                    <span style={{ color: C.textSecondary }}>💵 {fmt(b.costo)}</span>
                    <span style={{ color: b.plusvalia >= 0 ? C.green : C.red }}>📈 {plus}</span>
                    <span style={{ color: C.purple }}>🔁 renta {fmt(rentaPot)}/mes</span>
                    <span style={{ color: C.yellow }}>🧰 manten. {fmt(b.mantenimiento)}/mes</span>
                    {b.unidades > 1 && <span style={{ color: C.textSecondary }}>🚪 {b.unidades} unid.</span>}
                  </div>
                  <button disabled={!puede} onClick={() => comprarBien(b)} style={{ width: "100%", background: puede ? C.purple : C.border, color: puede ? "#fff" : C.textMuted, border: "none", borderRadius: 10, padding: "9px", fontSize: 12, fontWeight: 700, cursor: puede ? "pointer" : "not-allowed" }}>
                    {puede ? `Comprar ${fmt(b.costo)}` : "Sin efectivo suficiente"}
                  </button>
                </div>
              );
            })}
            <div style={{ background: `${C.purple}11`, border: `1px solid ${C.purple}33`, borderRadius: 10, padding: "10px 14px" }}>
              <p style={{ color: "#C4BBFF", fontSize: 11, margin: 0, lineHeight: 1.6 }}>💡 Las <strong>casas</strong> ganan plusvalía; los <strong>vehículos</strong> se deprecian pero rentan bien. Tus habilidades (mecánica, bienes raíces, agencia…) aumentan la renta. Elige: <strong>rentar</strong> para ingreso pasivo o <strong>vender</strong> para efectivo.</p>
            </div>
          </div>
        )}

        {/* HABILIDADES TAB */}
        {activeTab === "habilidades" && (
          <div>
            <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", paddingBottom: 4 }}>
              {Object.entries(SKILL_TREE).filter(([key]) => !profile.ramasPermitidas || profile.ramasPermitidas.includes(key)).map(([key, r]) => {
                const recomendada = profile && profile.ramaAfin === key;
                return (
                  <button key={key} onClick={() => setActiveRama(key)} style={{
                    position: "relative",
                    background: activeRama === key ? `${r.color}22` : C.surface,
                    border: `1px solid ${activeRama === key ? r.color : recomendada ? `${r.color}88` : C.border}`,
                    color: activeRama === key ? r.color : C.textSecondary,
                    borderRadius: 99, padding: "6px 14px", fontSize: 12, fontWeight: 600,
                    cursor: "pointer", whiteSpace: "nowrap"
                  }}>
                    {r.icon} {r.label}{recomendada && <span style={{ color: r.color }}> ★</span>}
                  </button>
                );
              })}
            </div>
            {profile && SKILL_TREE[activeRama] && profile.ramaAfin === activeRama && (
              <div style={{ background: `${rama.color}15`, border: `1px solid ${rama.color}44`, borderRadius: 10, padding: "8px 12px", marginBottom: 10, fontSize: 11, color: rama.color }}>
                ★ <strong>Recomendado para ti</strong> ({profile.name}): estas habilidades cuestan <strong>−25%</strong>.
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {rama.skills.map(skill => {
                const comprada = habilidades.includes(skill.id);
                const costoEf = costoSkillEfectivo(skill);
                const afin = esAfin(skill);
                const puedePagar = finances.dinero >= costoEf;
                const puedeCursar = !skill.requiere || habilidades.includes(skill.requiere);
                const dom = dominioDe(dominios, skill.id);
                const cDinero = costoDineroDominio(skill, dominios);
                const cEspecial = costoEspecialDominio(skill, dominios);
                const maxed = dom >= DOMINIO_MAX;
                return (
                  <div key={skill.id}>
                    <SkillNode skill={skill} comprada={comprada} puedePagar={puedePagar} puedeCursar={puedeCursar} ramaColor={rama.color} onComprar={aprenderHabilidad} energiaActual={energia.actual} costo={costoEf} afin={afin} />
                    {comprada && (
                      <div style={{ background: C.surface, border: `1px solid ${rama.color}33`, borderTop: "none", borderRadius: "0 0 10px 10px", padding: "8px 12px", marginTop: -4 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.textSecondary, marginBottom: 4 }}>
                          <span>🏅 Maestría <strong style={{ color: rama.color }}>{dom.toFixed(2)}/20</strong></span>
                          <span style={{ color: C.green }}>potencia ×{dominioMult(dominios, skill.id).toFixed(2)}</span>
                        </div>
                        <div style={{ background: C.border, borderRadius: 99, height: 5, overflow: "hidden", marginBottom: 8 }}>
                          <div style={{ width: `${(dom / DOMINIO_MAX) * 100}%`, background: rama.color, height: "100%", borderRadius: 99, transition: "width 0.4s ease" }} />
                        </div>
                        {maxed ? (
                          <div style={{ fontSize: 10, color: C.yellow, textAlign: "center" }}>⭐ Maestría máxima alcanzada</div>
                        ) : (
                          <div style={{ display: "flex", gap: 5 }}>
                            <button onClick={() => mejorarDominio(skill, "exp")} disabled={puntosMaestria < COSTO_EXP_DOMINIO} style={btnDom(puntosMaestria >= COSTO_EXP_DOMINIO, `${C.orange}22`, C.orange)}>🎓 +0.15<br /><span style={{ fontSize: 8 }}>{COSTO_EXP_DOMINIO} pts</span></button>
                            <button onClick={() => mejorarDominio(skill, "dinero")} disabled={finances.dinero < cDinero} style={btnDom(finances.dinero >= cDinero, C.card, C.textPrimary)}>💵 +0.5<br /><span style={{ fontSize: 8 }}>{fmt(cDinero)}</span></button>
                            <button onClick={() => mejorarDominio(skill, "especial")} disabled={finances.dinero < cEspecial} style={btnDom(finances.dinero >= cEspecial, `${C.green}22`, C.green)}>⭐ +1.0<br /><span style={{ fontSize: 8 }}>{fmt(cEspecial)}</span></button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 12, background: C.surface, borderRadius: 10, padding: 12, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>Habilidades desbloqueadas ({habilidades.length})</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {habilidades.length === 0 ? <span style={{ color: C.textMuted, fontSize: 12 }}>Ninguna aún</span> :
                  habilidades.map(hId => {
                    const sk = getSkillById(hId);
                    const ramaEntry = getRamaBySkillId(hId);
                    const rc = ramaEntry ? SKILL_TREE[ramaEntry[0]].color : C.purple;
                    return sk ? <span key={hId} style={{ background: `${rc}22`, color: rc, fontSize: 10, padding: "2px 8px", borderRadius: 99, border: `1px solid ${rc}44` }}>✓ {sk.nombre}</span> : null;
                  })}
              </div>
            </div>
          </div>
        )}

        {/* LOG TAB */}
        {activeTab === "log" && (
          <div style={{ background: C.card, borderRadius: 12, padding: 14, border: `1px solid ${C.border}` }}>
            {log.length === 0 ? (
              <p style={{ color: C.textSecondary, fontSize: 13, textAlign: "center", padding: "20px 0" }}>Aún no hay historial. ¡Avanza tu primer ciclo!</p>
            ) : log.map((entry, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ color: entry.tipo === "success" ? C.green : entry.tipo === "danger" ? C.red : C.textMuted, fontSize: 10, minWidth: 55, paddingTop: 1 }}>{getCicloLabel(profile.ciclo)} {entry.ciclo}</span>
                <span style={{ color: C.textSecondary, fontSize: 12, lineHeight: 1.5 }}>{entry.msg}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 420, background: C.bg, borderTop: `1px solid ${C.border}`, padding: "12px 14px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8 }}>
          <button onClick={descansar} style={{ background: C.surface, color: energia.actual < 50 ? C.yellow : C.textSecondary, border: `1px solid ${energia.actual < 50 ? C.yellow + "66" : C.border}`, borderRadius: 14, padding: "13px 8px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            😴 Descansar
          </button>
          <button onClick={avanzarCiclo} disabled={energia.actual <= 0 || rolling} style={{
            background: (energia.actual <= 0 || rolling) ? C.border : `linear-gradient(135deg, ${C.purple}, #9333EA)`,
            color: (energia.actual <= 0 || rolling) ? C.textMuted : "white",
            border: "none", borderRadius: 14, padding: 13, fontSize: 14, fontWeight: 700,
            cursor: (energia.actual <= 0 || rolling) ? "not-allowed" : "pointer"
          }}>
            {rolling ? "🎲 corriendo..." : energia.actual <= 0 ? "Sin energía — descansa" : `🎲 Avanzar ${getCicloLabel(profile.ciclo)} →`}
          </button>
        </div>
      </div>

      {evento && <EventModal evento={evento} onChoice={handleEventChoice} habilidades={habilidades} energia={energia} />}
      {objecion && <ObjecionModal objecion={objecion} habilidades={habilidades} onResult={resolverNegociacion} />}
      {outcome && <OutcomeModal outcome={outcome} onClose={() => setOutcome(null)} />}
      {inquilino && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 130, padding: 16 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 22, padding: 24, maxWidth: 380, width: "100%", animation: "rr-pop 0.25s ease" }}>
            <div style={{ fontSize: 40, textAlign: "center", marginBottom: 8 }}>🔑</div>
            <h3 style={{ color: C.textPrimary, fontSize: 17, fontWeight: 800, textAlign: "center", margin: "0 0 6px" }}>Buscar inquilino</h3>
            <p style={{ color: C.textSecondary, fontSize: 13, textAlign: "center", margin: "0 0 16px", lineHeight: 1.6 }}>
              Para {inquilino.emoji} <strong>{inquilino.nombre}</strong>. Hay interesados — decide cómo manejar la renta. Negociar más depende de tus habilidades.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button onClick={() => cerrarRentaConInquilino(inquilino.base)} style={{ background: C.purple, color: "#fff", border: "none", borderRadius: 12, padding: "11px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "left" }}>
                ✅ Aceptar inquilino — {fmt(inquilino.base)}/mes
              </button>
              <button onClick={negociarInquilino} style={{ background: `${C.green}22`, color: C.green, border: `1px solid ${C.green}66`, borderRadius: 12, padding: "11px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "left" }}>
                💬 Negociar renta más alta (+20%) — riesgo
              </button>
              <button onClick={() => setInquilino(null)} style={{ background: C.surface, color: C.textSecondary, border: `1px solid ${C.border}`, borderRadius: 12, padding: "11px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left" }}>
                ⏳ Buscar después (cancelar)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  ); }

