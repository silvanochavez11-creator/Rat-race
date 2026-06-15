import { useState, useCallback, useEffect } from "react";

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
    ]
  },
  ventas: {
    label: "Ventas", icon: "🎯", color: C.purple,
    skills: [
      { id: "atencion_cliente", nombre: "Atención al cliente", costo: 600, energiaCosto: 10, descripcion: "Comunicación y servicio efectivo.", requiere: null },
      { id: "ventas_basicas", nombre: "Ventas básicas", costo: 1500, energiaCosto: 15, descripcion: "Proceso de venta y manejo de objeciones.", requiere: "atencion_cliente" },
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
    finances: { dinero: 800, ingresoMensual: 0, gastosMensuales: 1200, deudas: 0, activosPasivos: 0 },
    energia: { actual: 60, max: 100 },
    ciclo: "diario", dificultad: "Extremo", color: C.purple
  },
  {
    id: "freelancer", name: "Freelancer", emoji: "💻",
    description: "Ingresos irregulares, gastos fijos. Ya tienes habilidades digitales.",
    stats: { carisma: 3, conocimiento: 4, red: 2 },
    habilidades: ["redes_sociales", "diseno"],
    finances: { dinero: 5000, ingresoMensual: 8000, gastosMensuales: 6500, deudas: 15000, activosPasivos: 0 },
    energia: { actual: 75, max: 100 },
    ciclo: "semanal", dificultad: "Difícil", color: C.orange
  },
  {
    id: "empleado", name: "Empleado", emoji: "👔",
    description: "Sueldo fijo quincenal. Estable, pero atrapado en la rutina.",
    stats: { carisma: 3, conocimiento: 3, red: 3 },
    habilidades: ["atencion_cliente", "ventas_basicas"],
    finances: { dinero: 8000, ingresoMensual: 14000, gastosMensuales: 11000, deudas: 35000, activosPasivos: 0 },
    energia: { actual: 70, max: 100 },
    ciclo: "quincenal", dificultad: "Medio", color: C.blue
  },
  {
    id: "profesional", name: "Doctor / Profesionista", emoji: "🩺",
    description: "Ingresos altos, deudas altísimas. El rat race clásico.",
    stats: { carisma: 4, conocimiento: 5, red: 4 },
    habilidades: ["presupuesto", "ahorro"],
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
  { id: "e27", tipo: "oportunidad", titulo: "Cuenta grande para tu agencia", descripcion: "Una empresa quiere contratar a tu agencia de marketing por meses.", opciones: ["Presentar propuesta", "Rechazar", "Negociar retainer anual"], impacto: [{ dinero: 8000, ingreso: 3000, energia: -25 }, { dinero: 0, energia: 0 }, { dinero: 12000, ingreso: 5000, energia: -35 }], emoji: "📣", requiereHabilidad: "agencia_marketing" }, ];

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
    habilidadBonus: { ventas_basicas: 15, cierre: 20, negociacion: 25 },
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
    habilidadBonus: { cierre: 20, negociacion: 30, marketing: 15, maestro_obra: 25, agencia_marketing: 25, escalar_negocio: 30 },
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
    habilidadBonus: { mecanica_avanzada: 25, electricidad: 20, plomeria: 15, albanileria: 18, carpinteria: 18, herreria: 20, maestro_obra: 30 },
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
  e27: "contrato_grande", };

// Calculate success probability based on skills
const calcProbabilidad = (outcomeConfig, habilidades, resultado) => {
  let prob = resultado.probabilidadBase;
  if (outcomeConfig.habilidadBonus) {
    Object.entries(outcomeConfig.habilidadBonus).forEach(([hId, bonus]) => {
      if (habilidades.includes(hId)) prob += bonus;
    });
  }
  return Math.min(prob, 95); };

const resolveOutcome = (eventoId, habilidades, exp = 0) => {
  const categoria = EVENTO_OUTCOME_MAP[eventoId];
  if (!categoria) return null;
  const config = OUTCOMES[categoria];
  // La experiencia sube la probabilidad de los resultados buenos.
  const totales = config.resultados.map(r => calcProbabilidad(config, habilidades, r) + (r.tipo === "ganado" ? expBonusProb(exp) : 0));
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
  general: [
    "🧠 Riqueza no es cuánto ganas, sino cuánto conservas y haces crecer.",
    "⏳ La paciencia es tu mejor aliada: el interés compuesto premia a quien empieza temprano y no se detiene.",
    "🎓 Aprende una habilidad nueva: sube tus probabilidades de éxito y abre mejores oportunidades.",
    "💧 Cuida los pequeños gastos: una pequeña fuga hunde un gran barco.",
  ],
};

// ============================================================
// BANCOS FICTICIOS Y SISTEMA DE DEUDA
// ============================================================
const BANCOS = {
  popular:  { id: "popular",  nombre: "Banco Popular",       tasa: 0.03, emoji: "🏛️", color: "#00E5A0", desc: "Tasa baja (3%/mes). El más justo." },
  credimax: { id: "credimax", nombre: "CrediMax",            tasa: 0.06, emoji: "🏦", color: "#FFD166", desc: "Tasa media (6%/mes)." },
  rapidito: { id: "rapidito", nombre: "Préstamos Rapidito",  tasa: 0.08, emoji: "💸", color: "#FF4D6A", desc: "¡Tasa alta (8%/mes)! Préstamo exprés, pero caro." },
};
const getBanco = (id) => BANCOS[id] || BANCOS.credimax;
const totalDeuda = (fin) => (fin.deudas || []).reduce((s, d) => s + d.monto, 0);
const interesMensual = (fin) => (fin.deudas || []).reduce((s, d) => s + d.monto * getBanco(d.bancoId).tasa, 0);

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
// MERCADO DE PERTENENCIAS (vehículos, casas, negocios)
// plusvalia: cuánto cambia su valor cada mes (+ sube, - se deprecia)
// renta: ingreso pasivo mensual si decides rentarlo
// skillRenta: habilidad que mejora su rendimiento
// ============================================================
const MERCADO_BIENES = [
  { id: "moto",       tipo: "vehiculo", nombre: "Motocicleta",        emoji: "🏍️", costo: 18000,  plusvalia: -0.010, renta: 700,   skillRenta: "mecanica_basica",    desc: "Para repartos. Se deprecia, pero rentada deja flujo." },
  { id: "auto",       tipo: "vehiculo", nombre: "Automóvil",          emoji: "🚗",  costo: 90000,  plusvalia: -0.008, renta: 2800,  skillRenta: "mecanica_basica",    desc: "Rentable para apps de transporte." },
  { id: "camioneta",  tipo: "vehiculo", nombre: "Camioneta de carga", emoji: "🚚",  costo: 160000, plusvalia: -0.006, renta: 5000,  skillRenta: "mecanica_avanzada",  desc: "Ideal para fletes y negocio de carga." },
  { id: "casa_chica", tipo: "casa",     nombre: "Casa pequeña",       emoji: "🏠",  costo: 130000, plusvalia: 0.012,  renta: 3800,  skillRenta: "bienes_raices",      desc: "Se revaloriza y puedes rentarla." },
  { id: "depa",       tipo: "casa",     nombre: "Departamento",       emoji: "🏢",  costo: 220000, plusvalia: 0.015,  renta: 6500,  skillRenta: "bienes_raices",      desc: "Buena plusvalía en zona céntrica." },
  { id: "local",      tipo: "negocio",  nombre: "Local comercial",    emoji: "🏬",  costo: 360000, plusvalia: 0.018,  renta: 13000, skillRenta: "emprendimiento",     desc: "Réntalo o monta tu propio negocio." },
];
// Multiplicador de renta según tus habilidades (tus skills te ayudan a rendir más).
const boostRenta = (bien, habilidades) => {
  let mult = 1;
  if (bien.skillRenta && habilidades.includes(bien.skillRenta)) mult += 0.30;
  if (bien.tipo === "casa" && habilidades.includes("bienes_raices")) mult += 0.20;
  if (bien.tipo === "negocio" && habilidades.includes("agencia_marketing")) mult += 0.30;
  if (bien.tipo === "vehiculo" && habilidades.includes("mecanica_avanzada")) mult += 0.15;
  return mult;
};
const rentaEfectiva = (bien, habilidades) => Math.round((bien.rentaBase ?? bien.renta) * boostRenta(bien, habilidades));

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
@keyframes rr-pop { 0% { transform: scale(0.7); } 60% { transform: scale(1.12); } 100% { transform: scale(1); } }
@keyframes rr-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(255,77,106,0.5); } 50% { box-shadow: 0 0 0 6px rgba(255,77,106,0); } }
@keyframes rr-fadein { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
`;

// Clave para guardar la partida en el navegador (localStorage)
const SAVE_KEY = "ratrace_save_v1";

// ============================================================
// HELPERS
// ============================================================
const fmt = (n) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
const getCicloLabel = (c) => ({ diario: "Día", semanal: "Semana", quincenal: "Quincena", mensual: "Mes" }[c]);
// Cuánto representa un ciclo respecto a un mes (para escalar interés, plusvalía, etc.)
const factorDe = (ciclo) => ciclo === "diario" ? 1/30 : ciclo === "semanal" ? 1/4 : ciclo === "quincenal" ? 1/2 : 1;

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
  const tipoColor = { black_swan: C.red, gasto: C.yellow, chamba: C.orange, oportunidad: C.purple, inversion: C.green, descanso: C.blue }[evento.tipo] || C.purple;
  const tipoLabel = { black_swan: "⚠️ EVENTO CRÍTICO", gasto: "GASTO INESPERADO", chamba: "CHAMBA DISPONIBLE", oportunidad: "OPORTUNIDAD", inversion: "INVERSIÓN", descanso: "TIEMPO LIBRE" }[evento.tipo];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 22, padding: 24, maxWidth: 380, width: "100%" }}>
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
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 22, maxWidth: 390, width: "100%", overflow: "hidden", margin: "auto" }}>

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
      <div style={{ background: C.card, border: `1px solid ${cfg.border}55`, borderRadius: 22, maxWidth: 380, width: "100%", overflow: "hidden" }}>
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

function SkillNode({ skill, comprada, puedePagar, puedeCursar, ramaColor, onComprar, energiaActual }) {
  const suficienteEnergia = energiaActual >= skill.energiaCosto;
  const disponible = !comprada && puedePagar && puedeCursar && suficienteEnergia;
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
          <div style={{ display: "flex", gap: 10, fontSize: 11 }}>
            <span style={{ color: C.green }}>{fmt(skill.costo)}</span>
            <span style={{ color: C.red }}>⚡-{skill.energiaCosto}</span>
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
  const [experiencia, setExperiencia] = useState(0);
  const [pertenencias, setPertenencias] = useState([]);

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

  const checkMentor = useCallback((fin, eng) => {
    const al = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const total = totalDeuda(fin);
    const tieneRapidito = (fin.deudas || []).some(d => d.bancoId === "rapidito");
    if (eng.actual < 25) { setMentorTip(MENTOR_TIPS.energiaBaja); return; }
    if (tieneRapidito) { setMentorTip(al(MENTOR_CONSEJOS.bancoCaro)); return; }
    if (total > 0 && interesMensual(fin) > total * 0.05) { setMentorTip(al(MENTOR_CONSEJOS.deudaCrece)); return; }
    if (total > fin.ingresoMensual * 2 && total > 0) { setMentorTip(MENTOR_TIPS.deudaAlta); return; }
    if (fin.activosPasivos >= fin.gastosMensuales * 0.7 && fin.activosPasivos < fin.gastosMensuales) { setMentorTip(al(MENTOR_CONSEJOS.cercaLibertad)); return; }
    if (fin.gastosMensuales > fin.ingresoMensual + fin.activosPasivos && fin.ingresoMensual > 0) { setMentorTip(MENTOR_TIPS.gastosMayores); return; }
    if (fin.dinero < fin.gastosMensuales * 0.5) { setMentorTip(MENTOR_TIPS.sinAhorros); return; }
    if (fin.activosPasivos === 0) { setMentorTip(al(MENTOR_CONSEJOS.pocoActivo)); return; }
    if (Math.random() < 0.35) setMentorTip(al(MENTOR_CONSEJOS.general));
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
    setFinances({ ...p.finances, deudas: deudaInicial(p) });
    setEnergia({ ...p.energia });
    setCiclo(0); setLog([]); setSeguimientos([]); setOutcome(null);
    setExperiencia(0); setPertenencias([]); setScreen("game");
    sfx("click");
  };

  // Guardado automático de la partida cada vez que cambia algo relevante.
  useEffect(() => {
    if (screen !== "game" || !finances || !profile) return;
    try {
      const data = { profile, stats, habilidades, finances, energia, ciclo, log, seguimientos, experiencia, pertenencias };
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      setHaySaved(true);
    } catch {}
  }, [screen, profile, stats, habilidades, finances, energia, ciclo, log, seguimientos, experiencia, pertenencias]);

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
      setScreen("game"); sfx("click");
    } catch {}
  };

  const borrarPartida = () => { try { localStorage.removeItem(SAVE_KEY); } catch {} setHaySaved(false); };

  const avanzarCiclo = () => {
    if (energia.actual <= 0) { showNotif("Sin energía — debes descansar", C.red); return; }
    sfx("click");

    setFinances(prev => {
      const nuevo = { ...prev };
      const factor = profile.ciclo === "diario" ? 1/30 : profile.ciclo === "semanal" ? 1/4 : profile.ciclo === "quincenal" ? 1/2 : 1;
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

    // Experiencia: cada semana trabajada suma. Más experiencia = mejores contratos.
    setExperiencia(e => Math.min(EXP_POR_NIVEL * 10, e + 1));

    setEnergia(prev => {
      const perdida = profile.ciclo === "diario" ? 15 : profile.ciclo === "semanal" ? 20 : profile.ciclo === "quincenal" ? 25 : 30;
      const nueva = Math.max(0, prev.actual - perdida);
      return { ...prev, actual: nueva };
    });

    setCiclo(c => c + 1);

    const positions = ["casa", "trabajo", "tienda", "casa"];
    let i = 0;
    const iv = setInterval(() => { setAvatarPos(positions[i % positions.length]); i++; if (i >= positions.length) clearInterval(iv); }, 500);

    // Always trigger an event — weighted by skills and context
    const elegirEvento = (fin, eng) => {
      // Categorize events by type for weighted selection
      const conHabilidad = EVENTOS.filter(e => e.requiereHabilidad && habilidades.includes(e.requiereHabilidad));
      const sinHabilidad = EVENTOS.filter(e => !e.requiereHabilidad);
      const sinSkillPeroVisible = EVENTOS.filter(e => e.requiereHabilidad && !habilidades.includes(e.requiereHabilidad));

      // Build weighted pool
      let pool = [];
      // If skills unlocked → those events appear more (3x weight)
      conHabilidad.forEach(e => { pool.push(e); pool.push(e); pool.push(e); });
      // Universal events always available
      sinHabilidad.forEach(e => { pool.push(e); pool.push(e); });
      // Locked events appear rarely (tease the player)
      if (Math.random() < 0.2) {
        sinSkillPeroVisible.forEach(e => pool.push(e));
      }

      // Context overrides: low money → more gasto/chamba, low energy → descanso
      if (fin.dinero < fin.gastosMensuales * 0.3) {
        const urgentes = EVENTOS.filter(e => e.tipo === "chamba" && (!e.requiereHabilidad || habilidades.includes(e.requiereHabilidad)));
        urgentes.forEach(e => { pool.push(e); pool.push(e); });
      }
      if (eng.actual < 30) {
        const descansos = EVENTOS.filter(e => e.tipo === "descanso");
        descansos.forEach(e => { pool.push(e); pool.push(e); pool.push(e); });
      }

      return pool[Math.floor(Math.random() * pool.length)];
    };

    setTimeout(() => {
      setFinances(fin => {
        setEnergia(eng => {
          const selected = elegirEvento(fin, eng);
          setEvento(selected);
          sfx("coin");
          checkMentor(fin, eng);
          return eng;
        });
        return fin;
      });
    }, 900);

    addLog(`${getCicloLabel(profile.ciclo)} ${ciclo + 1} avanzado`, "success");
  };

  const handleEventChoice = (idx) => {
    const imp = evento.impacto[idx];
    const opcion = evento.opciones[idx];

    // Check if this event has an outcome resolution
    const outcomeCategoria = EVENTO_OUTCOME_MAP[evento.id];
    const esAccionPositiva = idx !== 1; // index 1 is always "reject/pass"

    if (outcomeCategoria && esAccionPositiva) {
      // Resolve with probability based on skills AND experience
      const resolved = resolveOutcome(evento.id, habilidades, experiencia);
      if (resolved) {
        // Experiencia por completar un trabajo (más si sale bien)
        setExperiencia(e => Math.min(EXP_POR_NIVEL * 10, e + (resolved.tipo === "ganado" ? 3 : resolved.tipo === "perdido" ? 1 : 2)));
        // Apply energy cost immediately
        if (imp.energia) setEnergia(prev => ({ ...prev, actual: Math.min(prev.max, Math.max(0, prev.actual + imp.energia)) }));
        // Apply resolved outcome finances
        setFinances(prev => {
          const nuevo = { ...prev };
          if (resolved.impacto?.dinero) nuevo.dinero += resolved.impacto.dinero;
          if (resolved.impacto?.ingreso) nuevo.ingresoMensual += resolved.impacto.ingreso;
          if (resolved.impacto?.activosMes) nuevo.activosPasivos += resolved.impacto.activosMes;
          checkWin(nuevo); return nuevo;
        });
        if (resolved.impacto?.seguimiento) setSeguimientos(prev => [...prev, { evento: evento.titulo, ciclo }]);
        if (resolved.tipo === "ganado") setMentorTip(MENTOR_TIPS.buenaDecision);
        if (resolved.impacto?.activosMes > 0) setMentorTip(MENTOR_TIPS.invertir);
        addLog(`"${evento.titulo}" → ${resolved.titulo}`, resolved.tipo === "ganado" ? "success" : resolved.tipo === "perdido" ? "danger" : "info");
        sfx(resolved.tipo === "ganado" ? "success" : resolved.tipo === "perdido" ? "error" : "click");
        setEvento(null);
        setOutcome(resolved); // shows immediately
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
    if (esAccionPositiva && evento.tipo === "chamba" && imp.dinero > 0) setExperiencia(e => Math.min(EXP_POR_NIVEL * 10, e + 2));

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

  const aprenderHabilidad = (skill) => {
    if (finances.dinero < skill.costo) { showNotif("Sin dinero suficiente", C.red); return; }
    if (energia.actual < skill.energiaCosto) { showNotif("Sin energía suficiente", C.yellow); return; }
    if (habilidades.includes(skill.id)) { showNotif("Ya tienes esta habilidad", C.yellow); return; }
    // Algunas habilidades de negocio forman una empresa que genera ingreso pasivo.
    setFinances(prev => ({ ...prev, dinero: prev.dinero - skill.costo, activosPasivos: prev.activosPasivos + (skill.ingresoPasivo || 0) }));
    setEnergia(prev => ({ ...prev, actual: Math.max(0, prev.actual - skill.energiaCosto) }));
    setHabilidades(prev => [...prev, skill.id]);
    addLog(skill.ingresoPasivo ? `Formaste un negocio: ${skill.nombre} (+${fmt(skill.ingresoPasivo)}/mes)` : `Aprendiste: ${skill.nombre}`, "success");
    showNotif(skill.ingresoPasivo ? `🏢 Negocio creado: +${fmt(skill.ingresoPasivo)}/mes` : `✓ ${skill.nombre} desbloqueada`, C.green);
    sfx("success");
  };

  const descansar = () => {
    setEnergia(prev => ({ ...prev, actual: Math.min(prev.max, prev.actual + 35) }));
    setCiclo(c => c + 1);
    setAvatarPos("durmiendo");
    setTimeout(() => setAvatarPos("casa"), 1200);
    addLog("Descansaste — energía recuperada", "info");
    showNotif("Descansaste ✓", C.blue);
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
      showNotif(`Abonaste ${fmt(pago)} ✓`, C.green);
      sfx("pay");
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
      showNotif("¡Deuda liquidada! 🎉", C.green);
      sfx("success");
      return { ...prev, dinero: prev.dinero - deuda.monto, deudas };
    });
  };

  const pedirPrestamo = (bancoId, cantidad) => {
    setFinances(prev => {
      addLog(`Pediste ${fmt(cantidad)} a ${getBanco(bancoId).nombre} (${Math.round(getBanco(bancoId).tasa*100)}%/mes)`, "danger");
      showNotif(`+${fmt(cantidad)} en efectivo (deuda)`, C.yellow);
      sfx("coin");
      return { ...prev, dinero: prev.dinero + cantidad, deudas: agregarDeuda(prev.deudas || [], cantidad, bancoId) };
    });
  };

  // ============================================================
  // PERTENENCIAS (comprar, rentar / dejar de rentar, vender)
  // ============================================================
  const comprarBien = (bien) => {
    if (finances.dinero < bien.costo) { showNotif("Sin efectivo suficiente", C.red); return; }
    const nuevo = { id: `${bien.id}_${Date.now()}`, baseId: bien.id, tipo: bien.tipo, nombre: bien.nombre, emoji: bien.emoji,
      valorCompra: bien.costo, valorActual: bien.costo, plusvalia: bien.plusvalia, rentaBase: bien.renta, rentando: false, rentaAplicada: 0 };
    setFinances(prev => ({ ...prev, dinero: prev.dinero - bien.costo }));
    setPertenencias(prev => [...prev, nuevo]);
    addLog(`Compraste ${bien.nombre} por ${fmt(bien.costo)}`, "success");
    showNotif(`${bien.emoji} ${bien.nombre} adquirido`, C.green);
    sfx("coin");
  };

  const rentarBien = (id) => {
    const p = pertenencias.find(x => x.id === id);
    if (!p) return;
    if (p.rentando) {
      setFinances(f => ({ ...f, activosPasivos: Math.max(0, f.activosPasivos - (p.rentaAplicada || 0)) }));
      setPertenencias(prev => prev.map(x => x.id === id ? { ...x, rentando: false, rentaAplicada: 0 } : x));
      addLog(`Dejaste de rentar ${p.nombre}`, "info");
      showNotif("Dejaste de rentar", C.blue);
    } else {
      const renta = rentaEfectiva(p, habilidades);
      setFinances(f => { const nf = { ...f, activosPasivos: f.activosPasivos + renta }; checkWin(nf); return nf; });
      setPertenencias(prev => prev.map(x => x.id === id ? { ...x, rentando: true, rentaAplicada: renta } : x));
      addLog(`Rentas ${p.nombre}: +${fmt(renta)}/mes`, "success");
      showNotif(`+${fmt(renta)}/mes por renta`, C.green);
      sfx("coin");
    }
  };

  const venderBien = (id) => {
    const p = pertenencias.find(x => x.id === id);
    if (!p) return;
    setFinances(f => ({ ...f, dinero: f.dinero + p.valorActual, activosPasivos: Math.max(0, f.activosPasivos - (p.rentando ? (p.rentaAplicada || 0) : 0)) }));
    setPertenencias(prev => prev.filter(x => x.id !== id));
    const ganancia = p.valorActual - p.valorCompra;
    addLog(`Vendiste ${p.nombre} por ${fmt(p.valorActual)} (${ganancia >= 0 ? "+" : ""}${fmt(ganancia)})`, ganancia >= 0 ? "success" : "danger");
    showNotif(`Vendido por ${fmt(p.valorActual)}`, ganancia >= 0 ? C.green : C.yellow);
    sfx("pay");
  };

  // Consejero: da un consejo contextual al pulsar el botón del mentor.
  const pedirConsejo = () => {
    if (!finances) return;
    const f = finances, total = totalDeuda(f), pasivo = f.activosPasivos, gastos = f.gastosMensuales;
    let cat = "general";
    const tieneRapidito = (f.deudas || []).some(d => d.bancoId === "rapidito");
    if (tieneRapidito) cat = "bancoCaro";
    else if (interesMensual(f) > total * 0.05 && total > 0) cat = "deudaCrece";
    else if (total > f.ingresoMensual * 1.5 && total > 0) cat = "deudaAlta";
    else if (pasivo >= gastos * 0.7 && pasivo < gastos) cat = "cercaLibertad";
    else if (pasivo === 0) cat = "pocoActivo";
    else if (flujoMensual > 0) cat = "buenFlujo";
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
        <p style={{ color: C.textSecondary, fontSize: 13, marginBottom: 20 }}>Cada uno tiene diferente punto de partida y habilidades iniciales.</p>
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
          </div>
        ))}
      </div>
    </div>
  );

  // ============================================================
  // WIN
  // ============================================================
  if (screen === "win") return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🏆</div>
        <h1 style={{ color: C.green, fontSize: 26, fontWeight: 900, marginBottom: 6 }}>¡Saliste del Rat Race!</h1>
        <p style={{ color: C.textSecondary, fontSize: 14, marginBottom: 20 }}>
          Lo lograste en <strong style={{ color: C.textPrimary }}>{ciclo} {getCicloLabel(profile?.ciclo)}s</strong> como <strong style={{ color: C.textPrimary }}>{profile?.name}</strong>
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
          <div>
            <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", letterSpacing: 2, marginBottom: 2 }}>{profile.name}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: C.textPrimary, letterSpacing: -0.5 }}>{fmt(finances.dinero)}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", letterSpacing: 2, marginBottom: 2 }}>{getCicloLabel(profile.ciclo)} {ciclo}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: flujoMensual >= 0 ? C.green : C.red }}>
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
            <div style={{ background: C.border, borderRadius: 99, height: 5, overflow: "hidden" }}>
              <div style={{ width: `${progreso}%`, background: `linear-gradient(90deg, ${C.purple}, ${C.green})`, height: "100%", borderRadius: 99, transition: "width 0.5s ease" }} />
            </div>
          </div>
        </div>
        {/* Barra de experiencia (nivel 1 a 10) */}
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.textSecondary, marginBottom: 3 }}>
            <span>🎓 Experiencia · Nivel {expNivel(experiencia)}/10</span>
            <span style={{ color: C.yellow }}>+{expBonusProb(experiencia)}% éxito · pagos ×{expBonusPago(experiencia).toFixed(2)}</span>
          </div>
          <div style={{ background: C.border, borderRadius: 99, height: 6, overflow: "hidden" }}>
            <div style={{ width: `${Math.round(expProgreso(experiencia) * 100)}%`, background: `linear-gradient(90deg, ${C.orange}, ${C.yellow})`, height: "100%", borderRadius: 99, transition: "width 0.5s ease" }} />
          </div>
        </div>
      </div>

      <div style={{ padding: 14 }}>
        <Avatar position={avatarPos} profileEmoji={profile.emoji} energia={energia} />
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
              <p style={{ color: C.textMuted, fontSize: 11, margin: "0 0 8px" }}>{getBanco(prestamoBanco).desc}</p>
              <div style={{ display: "flex", gap: 6 }}>
                {[2000, 5000, 10000].map(cant => (
                  <button key={cant} onClick={() => pedirPrestamo(prestamoBanco, cant)} style={{
                    flex: 1, background: C.card, border: `1px solid ${C.border}`, color: C.textPrimary,
                    borderRadius: 10, padding: "10px 4px", fontSize: 12, fontWeight: 700, cursor: "pointer"
                  }}>+{fmt(cant)}</button>
                ))}
              </div>
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
                const rentaPot = rentaEfectiva(p, habilidades);
                return (
                  <div key={p.id} style={{ background: C.card, borderRadius: 12, padding: "13px 16px", border: `1px solid ${p.rentando ? C.green + "66" : C.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <span style={{ color: C.textPrimary, fontWeight: 700, fontSize: 14 }}>{p.emoji} {p.nombre}</span>
                        <div style={{ fontSize: 11, color: C.textSecondary }}>Valor actual: <strong style={{ color: C.textPrimary }}>{fmt(p.valorActual)}</strong> <span style={{ color: ganancia >= 0 ? C.green : C.red }}>({ganancia >= 0 ? "+" : ""}{fmt(ganancia)})</span></div>
                        <div style={{ fontSize: 11, color: p.rentando ? C.green : C.textMuted }}>{p.rentando ? `🟢 Rentando: +${fmt(p.rentaAplicada)}/mes` : `Renta potencial: ${fmt(rentaPot)}/mes`}</div>
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

            {/* Mercado de bienes */}
            <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>🏪 Mercado</div>
            {MERCADO_BIENES.map(b => {
              const puede = finances.dinero >= b.costo;
              const rentaPot = rentaEfectiva(b, habilidades);
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
              {Object.entries(SKILL_TREE).map(([key, r]) => (
                <button key={key} onClick={() => setActiveRama(key)} style={{
                  background: activeRama === key ? `${r.color}22` : C.surface,
                  border: `1px solid ${activeRama === key ? r.color : C.border}`,
                  color: activeRama === key ? r.color : C.textSecondary,
                  borderRadius: 99, padding: "6px 14px", fontSize: 12, fontWeight: 600,
                  cursor: "pointer", whiteSpace: "nowrap"
                }}>
                  {r.icon} {r.label}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {rama.skills.map(skill => {
                const comprada = habilidades.includes(skill.id);
                const puedePagar = finances.dinero >= skill.costo;
                const puedeCursar = !skill.requiere || habilidades.includes(skill.requiere);
                return (
                  <SkillNode key={skill.id} skill={skill} comprada={comprada} puedePagar={puedePagar} puedeCursar={puedeCursar} ramaColor={rama.color} onComprar={aprenderHabilidad} energiaActual={energia.actual} />
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
          <button onClick={avanzarCiclo} disabled={energia.actual <= 0} style={{
            background: energia.actual <= 0 ? C.border : `linear-gradient(135deg, ${C.purple}, #9333EA)`,
            color: energia.actual <= 0 ? C.textMuted : "white",
            border: "none", borderRadius: 14, padding: 13, fontSize: 14, fontWeight: 700,
            cursor: energia.actual <= 0 ? "not-allowed" : "pointer"
          }}>
            {energia.actual <= 0 ? "Sin energía — descansa" : `Avanzar ${getCicloLabel(profile.ciclo)} →`}
          </button>
        </div>
      </div>

      {evento && <EventModal evento={evento} onChoice={handleEventChoice} habilidades={habilidades} energia={energia} />}
      {outcome && <OutcomeModal outcome={outcome} onClose={() => setOutcome(null)} />}
    </div>
  ); }

