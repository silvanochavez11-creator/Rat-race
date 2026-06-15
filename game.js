/* ============================================================
   LA CARRERA DE LA RATA — Lógica del juego
   Inspirado en "Cashflow" de Robert Kiyosaki.

   IDEA CENTRAL (lo más importante que enseña el juego):
   - Trabajas y cobras un SALARIO, pero tus GASTOS se lo comen.
   - Eso es la "carrera de la rata": correr sin avanzar.
   - Para escapar compras ACTIVOS que generan INGRESO PASIVO
     (dinero que entra sin trabajar: rentas, dividendos...).
   - GANAS cuando: ingreso pasivo >= gastos totales.
     ¡Ese día ya no necesitas tu salario = libertad financiera!
   ============================================================ */

/* ----------------------------------------------------------
   1) DATOS: profesiones disponibles
   Cada una tiene salario, gastos base, gasto por hijo y efectivo inicial.
   ---------------------------------------------------------- */
const PROFESIONES = [
  { nombre: "🧹 Conserje",      salario: 1600, gastosFijos: 1300, gastoPorHijo: 110, efectivo: 350 },
  { nombre: "🚚 Camionero",     salario: 2500, gastosFijos: 1900, gastoPorHijo: 140, efectivo: 600 },
  { nombre: "👩‍🏫 Maestra",       salario: 3300, gastosFijos: 2500, gastoPorHijo: 180, efectivo: 400 },
  { nombre: "👨‍⚕️ Doctor",        salario: 9000, gastosFijos: 7200, gastoPorHijo: 640, efectivo: 800 },
  { nombre: "💻 Programadora",  salario: 4900, gastosFijos: 3300, gastoPorHijo: 220, efectivo: 700 },
  { nombre: "✈️ Piloto",        salario: 9500, gastosFijos: 7800, gastoPorHijo: 700, efectivo: 400 },
];

/* ----------------------------------------------------------
   2) DATOS: cartas de OPORTUNIDAD (activos que puedes comprar)
   - cuota inicial: lo que pagas en efectivo ahora
   - flujo: ingreso pasivo MENSUAL que te dará ese activo
   ---------------------------------------------------------- */
const OPORTUNIDADES = [
  { nombre: "🏠 Casa para rentar (2 hab.)", cuotaInicial: 350,  flujo: 90,  texto: "Una casita modesta que puedes alquilar." },
  { nombre: "🏢 Departamento en la ciudad",  cuotaInicial: 600,  flujo: 160, texto: "Departamento bien ubicado, alta demanda de renta." },
  { nombre: "📈 Acciones de tecnología",     cuotaInicial: 200,  flujo: 40,  texto: "Paquete de acciones que reparte dividendos." },
  { nombre: "🚗 Lavado de autos",            cuotaInicial: 500,  flujo: 130, texto: "Pequeño negocio semi-automático." },
  { nombre: "🍔 Franquicia de comida",       cuotaInicial: 800,  flujo: 220, texto: "Una franquicia conocida con buen flujo." },
  { nombre: "🌐 Página web de afiliados",    cuotaInicial: 150,  flujo: 50,  texto: "Genera comisiones de forma automática." },
  { nombre: "🏬 Local comercial",            cuotaInicial: 1000, flujo: 300, texto: "Inversión grande, gran ingreso pasivo." },
];

/* ----------------------------------------------------------
   3) DATOS: cartas de DOODADS (gastos imprevistos = trampas)
   Son las compras que NO te hacen libre. ¡Cuidado con ellas!
   ---------------------------------------------------------- */
const DOODADS = [
  { nombre: "📱 Nuevo teléfono",        costo: 120, texto: "El último modelo... que no necesitabas." },
  { nombre: "🛋️ Sofá nuevo",            costo: 200, texto: "Tu sala se ve genial, tu cuenta no." },
  { nombre: "🎮 Consola de videojuegos", costo: 90,  texto: "Para distraerte de tus deudas." },
  { nombre: "💍 Regalo caro",           costo: 250, texto: "Un detalle que salió del presupuesto." },
  { nombre: "🦷 Visita al dentista",    costo: 80,  texto: "Imprevisto de salud." },
  { nombre: "🔧 Reparación del auto",   costo: 150, texto: "Siempre fallan en el peor momento." },
];

/* ----------------------------------------------------------
   4) DATOS: eventos de MERCADO (puedes vender un activo con ganancia)
   ---------------------------------------------------------- */
const MERCADO = [
  { texto: "📊 ¡El mercado inmobiliario sube! Si tienes una propiedad, puedes venderla con ganancia.", tipo: "venta", multiplicador: 2.5 },
  { texto: "💹 Boom de la bolsa: tus acciones se revalorizan. Puedes vender con buena ganancia.",       tipo: "venta", multiplicador: 3   },
];

/* ----------------------------------------------------------
   5) DEFINICIÓN DEL TABLERO (la carrera de la rata)
   24 casillas en círculo. Cada una tiene un tipo.
   ---------------------------------------------------------- */
const TIPOS_CASILLA = {
  oportunidad: { etiqueta: "Oportunidad", icono: "💡", clase: "tipo-oportunidad" },
  doodad:      { etiqueta: "Gasto",       icono: "🛍️", clase: "tipo-doodad" },
  mercado:     { etiqueta: "Mercado",     icono: "📊", clase: "tipo-mercado" },
  paga:        { etiqueta: "Día de paga", icono: "💰", clase: "tipo-paga" },
  caridad:     { etiqueta: "Caridad",     icono: "❤️", clase: "tipo-caridad" },
  bebe:        { etiqueta: "¡Bebé!",      icono: "👶", clase: "tipo-bebe" },
  despido:     { etiqueta: "Despido",     icono: "📉", clase: "tipo-despido" },
};

// Orden de las casillas alrededor del círculo
const CASILLAS = [
  "paga", "oportunidad", "doodad", "oportunidad", "mercado", "oportunidad",
  "caridad", "oportunidad", "paga", "doodad", "oportunidad", "bebe",
  "oportunidad", "mercado", "oportunidad", "doodad", "paga", "oportunidad",
  "despido", "oportunidad", "doodad", "oportunidad", "mercado", "oportunidad",
];

/* ----------------------------------------------------------
   6) ESTADO DEL JUEGO
   Aquí guardamos toda la información de la partida.
   ---------------------------------------------------------- */
let estado = null;

function nuevoEstado(profesion) {
  return {
    profesion: profesion.nombre,
    salario: profesion.salario,
    gastosFijos: profesion.gastosFijos,
    gastoPorHijo: profesion.gastoPorHijo,
    hijos: 0,
    efectivo: profesion.efectivo,
    activos: [],     // lista de { nombre, flujo, cuotaInicial }
    pasivos: [],     // lista de { nombre, costo }
    posicion: 0,     // casilla actual en el tablero
    turno: 0,
    ganado: false,
  };
}

/* ----------------------------------------------------------
   7) CÁLCULOS FINANCIEROS
   Funciones "puras": reciben el estado y devuelven un número.
   ---------------------------------------------------------- */
function ingresoPasivo(e) {
  // Suma del flujo mensual de todos los activos
  return e.activos.reduce((suma, a) => suma + a.flujo, 0);
}
function ingresoTotal(e) {
  return e.salario + ingresoPasivo(e);
}
function gastosHijos(e) {
  return e.hijos * e.gastoPorHijo;
}
function gastosTotales(e) {
  return e.gastosFijos + gastosHijos(e);
}
function flujoMensual(e) {
  // Lo que te queda cada mes (lo que cobras en "día de paga")
  return ingresoTotal(e) - gastosTotales(e);
}

/* ----------------------------------------------------------
   8) UTILIDADES
   ---------------------------------------------------------- */
const $ = (id) => document.getElementById(id);
const dinero = (n) => "$" + n.toLocaleString("es-MX");
const azar = (lista) => lista[Math.floor(Math.random() * lista.length)];

function registrar(texto) {
  const li = document.createElement("li");
  li.textContent = `T${estado.turno}: ${texto}`;
  $("historial").prepend(li);
}

function mensaje(texto) {
  $("mensaje").innerHTML = texto;
}

/* ----------------------------------------------------------
   9) DIBUJAR LA INTERFAZ (sincroniza pantalla con el estado)
   ---------------------------------------------------------- */
function actualizarPantalla() {
  const e = estado;

  // Panel de finanzas
  $("profesion-nombre").textContent = e.profesion;
  $("ing-salario").textContent = dinero(e.salario);
  $("ing-pasivo").textContent = dinero(ingresoPasivo(e));
  $("ing-total").textContent = dinero(ingresoTotal(e));
  $("gasto-fijo").textContent = dinero(e.gastosFijos);
  $("gasto-hijos").textContent = dinero(gastosHijos(e));
  $("num-hijos").textContent = e.hijos;
  $("gasto-total").textContent = dinero(gastosTotales(e));
  $("flujo-mensual").textContent = dinero(flujoMensual(e));
  $("efectivo").textContent = dinero(e.efectivo);

  // Barra de progreso hacia la libertad
  const pasivo = ingresoPasivo(e);
  const gastos = gastosTotales(e);
  const porcentaje = Math.min(100, Math.round((pasivo / gastos) * 100));
  $("barra-libertad").style.width = porcentaje + "%";
  $("prog-pasivo").textContent = dinero(pasivo);
  $("prog-gastos").textContent = dinero(gastos);

  // Lista de activos
  const ulA = $("lista-activos");
  ulA.innerHTML = "";
  if (e.activos.length === 0) {
    ulA.innerHTML = '<li class="vacio">Aún no tienes inversiones. ¡Aprovecha las oportunidades!</li>';
  } else {
    e.activos.forEach((a) => {
      const li = document.createElement("li");
      li.innerHTML = `${a.nombre} <span class="cf-positivo">+${dinero(a.flujo)}/mes</span>`;
      ulA.appendChild(li);
    });
  }

  // Lista de pasivos
  const ulP = $("lista-pasivos");
  ulP.innerHTML = "";
  if (e.pasivos.length === 0) {
    ulP.innerHTML = '<li class="vacio">Sin deudas registradas.</li>';
  } else {
    e.pasivos.forEach((p) => {
      const li = document.createElement("li");
      li.innerHTML = `${p.nombre} <span style="color:var(--rojo)">-${dinero(p.costo)}</span>`;
      ulP.appendChild(li);
    });
  }

  dibujarTablero();
}

// Coloca las 24 casillas formando el borde de un rectángulo (un "círculo")
function dibujarTablero() {
  const tablero = $("tablero");
  tablero.innerHTML = "";

  // Posiciones (columna, fila) del borde de una rejilla 8x6, en orden horario
  const coords = posicionesBorde(8, 6);

  CASILLAS.forEach((tipo, i) => {
    const info = TIPOS_CASILLA[tipo];
    const div = document.createElement("div");
    div.className = `casilla ${info.clase}`;
    const [col, fila] = coords[i];
    div.style.gridColumn = col;
    div.style.gridRow = fila;
    div.innerHTML = `<span class="icono">${info.icono}</span><span>${info.etiqueta}</span>`;
    if (i === estado.posicion) {
      div.classList.add("activa");
      div.innerHTML += '<span class="ficha">🐀</span>';
    }
    tablero.appendChild(div);
  });
}

// Devuelve las coordenadas del borde de una rejilla, en sentido horario
function posicionesBorde(cols, filas) {
  const c = [];
  for (let x = 1; x <= cols; x++) c.push([x, 1]);            // fila superior →
  for (let y = 2; y <= filas; y++) c.push([cols, y]);        // columna derecha ↓
  for (let x = cols - 1; x >= 1; x--) c.push([x, filas]);    // fila inferior ←
  for (let y = filas - 1; y >= 2; y--) c.push([1, y]);       // columna izquierda ↑
  return c;
}

/* ----------------------------------------------------------
   10) MODAL (ventana de eventos / cartas)
   ---------------------------------------------------------- */
function abrirModal(titulo, texto, detallesHTML, botones) {
  $("modal-titulo").innerHTML = titulo;
  $("modal-texto").innerHTML = texto;
  $("modal-detalles").innerHTML = detallesHTML || "";
  $("modal-detalles").style.display = detallesHTML ? "block" : "none";

  const cont = $("modal-botones");
  cont.innerHTML = "";
  botones.forEach((b) => {
    const btn = document.createElement("button");
    btn.textContent = b.texto;
    btn.className = b.clase || "btn-si";
    btn.onclick = () => { cerrarModal(); b.accion(); };
    cont.appendChild(btn);
  });
  $("modal").classList.remove("oculto");
}
function cerrarModal() {
  $("modal").classList.add("oculto");
}

/* ----------------------------------------------------------
   11) LÓGICA DE CADA CASILLA (qué pasa al caer en ella)
   Cada función termina llamando a finalizarTurno().
   ---------------------------------------------------------- */
function caerEnCasilla(tipo) {
  switch (tipo) {
    case "paga":        casillaPaga();        break;
    case "oportunidad": casillaOportunidad(); break;
    case "doodad":      casillaDoodad();      break;
    case "mercado":     casillaMercado();     break;
    case "caridad":     casillaCaridad();     break;
    case "bebe":        casillaBebe();        break;
    case "despido":     casillaDespido();     break;
  }
}

// 💰 Día de paga: cobras tu flujo de caja mensual
function casillaPaga() {
  const flujo = flujoMensual(estado);
  estado.efectivo += flujo;
  registrar(`Día de paga: ${flujo >= 0 ? "+" : ""}${dinero(flujo)}`);
  abrirModal(
    "💰 ¡Día de paga!",
    flujo >= 0
      ? `Cobras tu flujo de caja de <strong>${dinero(flujo)}</strong>.`
      : `Tus gastos superan tus ingresos. Pierdes <strong>${dinero(flujo)}</strong>. ¡Necesitas más ingreso pasivo!`,
    null,
    [{ texto: "Continuar", accion: finalizarTurno }]
  );
}

// 💡 Oportunidad: te ofrecen comprar un activo
function casillaOportunidad() {
  const op = azar(OPORTUNIDADES);
  const puede = estado.efectivo >= op.cuotaInicial;
  const detalles = `
    <div><span>Cuota inicial (pagas ahora)</span><strong>${dinero(op.cuotaInicial)}</strong></div>
    <div><span>Ingreso pasivo mensual</span><strong style="color:var(--verde)">+${dinero(op.flujo)}</strong></div>
    <div><span>Tu efectivo</span><strong>${dinero(estado.efectivo)}</strong></div>
  `;
  const botones = [];
  if (puede) {
    botones.push({
      texto: `Comprar (${dinero(op.cuotaInicial)})`,
      accion: () => {
        estado.efectivo -= op.cuotaInicial;
        estado.activos.push({ nombre: op.nombre, flujo: op.flujo, cuotaInicial: op.cuotaInicial });
        registrar(`Compraste ${op.nombre} (+${dinero(op.flujo)}/mes)`);
        comprobarVictoria();
        finalizarTurno();
      },
    });
  }
  botones.push({
    texto: puede ? "Pasar" : "No tengo efectivo",
    clase: "btn-no",
    accion: finalizarTurno,
  });
  abrirModal(`💡 Oportunidad: ${op.nombre}`, op.texto, detalles, botones);
}

// 🛍️ Doodad: gasto imprevisto que debes pagar
function casillaDoodad() {
  const d = azar(DOODADS);
  estado.efectivo -= d.costo;
  registrar(`Gasto: ${d.nombre} -${dinero(d.costo)}`);
  abrirModal(
    `🛍️ ${d.nombre}`,
    `${d.texto}<br><br>Pagas <strong style="color:var(--rojo)">${dinero(d.costo)}</strong>. Así es como el dinero se escapa sin construir riqueza.`,
    null,
    [{ texto: "Continuar", accion: finalizarTurno }]
  );
}

// 📊 Mercado: puedes vender un activo con ganancia
function casillaMercado() {
  const ev = azar(MERCADO);
  if (estado.activos.length === 0) {
    abrirModal("📊 Mercado", ev.texto + "<br><br>Pero aún no tienes activos para vender.", null,
      [{ texto: "Continuar", accion: finalizarTurno }]);
    return;
  }
  // Vendemos el primer activo (versión simple) con ganancia
  const activo = estado.activos[0];
  const precioVenta = Math.round(activo.cuotaInicial * ev.multiplicador);
  abrirModal(
    "📊 Evento de mercado",
    `${ev.texto}<br><br>¿Vendes <strong>${activo.nombre}</strong> por <strong style="color:var(--verde)">${dinero(precioVenta)}</strong>? (Perderás su ingreso pasivo de ${dinero(activo.flujo)}/mes).`,
    null,
    [
      {
        texto: `Vender (${dinero(precioVenta)})`,
        accion: () => {
          estado.efectivo += precioVenta;
          estado.activos.shift();
          registrar(`Vendiste ${activo.nombre} por ${dinero(precioVenta)}`);
          finalizarTurno();
        },
      },
      { texto: "Conservar", clase: "btn-no", accion: finalizarTurno },
    ]
  );
}

// ❤️ Caridad: donar para "ayudar" (en este juego, motivacional)
function casillaCaridad() {
  const donacion = Math.max(0, Math.round(flujoMensual(estado) * 0.1));
  if (estado.efectivo < donacion || donacion === 0) {
    abrirModal("❤️ Caridad", "Pasas por la casilla de caridad. La generosidad también es parte de la riqueza.", null,
      [{ texto: "Continuar", accion: finalizarTurno }]);
    return;
  }
  abrirModal(
    "❤️ Caridad",
    `Puedes donar el 10% de tu flujo (<strong>${dinero(donacion)}</strong>) a una buena causa. ¡Ayudar también te hace sentir rico!`,
    null,
    [
      {
        texto: `Donar ${dinero(donacion)}`,
        accion: () => {
          estado.efectivo -= donacion;
          registrar(`Donaste ${dinero(donacion)} a caridad ❤️`);
          finalizarTurno();
        },
      },
      { texto: "Ahora no", clase: "btn-no", accion: finalizarTurno },
    ]
  );
}

// 👶 Bebé: aumenta tus gastos mensuales
function casillaBebe() {
  estado.hijos += 1;
  registrar(`¡Nació un bebé! Gastos +${dinero(estado.gastoPorHijo)}/mes 👶`);
  abrirModal(
    "👶 ¡Felicidades, un bebé!",
    `Tu familia crece. Pero también tus gastos: <strong style="color:var(--rojo)">+${dinero(estado.gastoPorHijo)}/mes</strong>. Más razón para construir ingreso pasivo.`,
    null,
    [{ texto: "Continuar", accion: finalizarTurno }]
  );
}

// 📉 Despido: pierdes un mes de gastos y un turno
function casillaDespido() {
  const costo = gastosTotales(estado);
  estado.efectivo -= costo;
  estado.saltarTurno = true;
  registrar(`¡Despido! Pagas ${dinero(costo)} y pierdes un turno 📉`);
  abrirModal(
    "📉 ¡Te despidieron!",
    `Te quedaste sin empleo. Igual debes pagar tus gastos de <strong style="color:var(--rojo)">${dinero(costo)}</strong> y pierdes el próximo turno.<br><br>Si tuvieras suficiente ingreso pasivo, ¡esto no te afectaría!`,
    null,
    [{ texto: "Continuar", accion: finalizarTurno }]
  );
}

/* ----------------------------------------------------------
   12) CONDICIÓN DE VICTORIA
   ---------------------------------------------------------- */
function comprobarVictoria() {
  if (ingresoPasivo(estado) >= gastosTotales(estado) && !estado.ganado) {
    estado.ganado = true;
    setTimeout(() => {
      abrirModal(
        '🎉 <span class="ganaste">¡LIBERTAD FINANCIERA!</span>',
        `Tu ingreso pasivo (<strong>${dinero(ingresoPasivo(estado))}</strong>) ya cubre todos tus gastos (<strong>${dinero(gastosTotales(estado))}</strong>).<br><br>
         ¡Saliste de la carrera de la rata en <strong>${estado.turno} turnos</strong>! Ya no dependes de tu salario. 🐀💨`,
        null,
        [{ texto: "Jugar de nuevo", accion: () => location.reload() }]
      );
    }, 400);
    $("btn-tirar").disabled = true;
  }
}

/* ----------------------------------------------------------
   13) FLUJO DE TURNOS
   ---------------------------------------------------------- */
function tirarDado() {
  if (estado.ganado) return;
  $("btn-tirar").disabled = true;

  // Si quedó pendiente saltar turno por despido
  if (estado.saltarTurno) {
    estado.saltarTurno = false;
    estado.turno += 1;
    mensaje("⏭️ Pierdes este turno por el despido.");
    registrar("Turno perdido por despido");
    setTimeout(() => { $("btn-tirar").disabled = false; actualizarPantalla(); }, 600);
    return;
  }

  const valor = Math.floor(Math.random() * 6) + 1;
  $("dado").textContent = valor;
  estado.turno += 1;

  // Avanzamos paso a paso para que se vea el movimiento de la rata
  let pasos = 0;
  const intervalo = setInterval(() => {
    estado.posicion = (estado.posicion + 1) % CASILLAS.length;
    dibujarTablero();
    pasos++;
    if (pasos >= valor) {
      clearInterval(intervalo);
      const tipo = CASILLAS[estado.posicion];
      mensaje(`Caíste en: <strong>${TIPOS_CASILLA[tipo].icono} ${TIPOS_CASILLA[tipo].etiqueta}</strong>`);
      caerEnCasilla(tipo);
    }
  }, 180);
}

function finalizarTurno() {
  actualizarPantalla();
  comprobarVictoria();
  if (!estado.ganado) $("btn-tirar").disabled = false;
}

/* ----------------------------------------------------------
   14) PANTALLA DE INICIO: elegir profesión
   ---------------------------------------------------------- */
function mostrarProfesiones() {
  const cont = $("lista-profesiones");
  cont.innerHTML = "";
  PROFESIONES.forEach((p) => {
    const card = document.createElement("div");
    card.className = "tarjeta-profesion";
    card.innerHTML = `
      <h3>${p.nombre}</h3>
      <p>💵 Salario: <strong>${dinero(p.salario)}</strong></p>
      <p>🧾 Gastos: ${dinero(p.gastosFijos)}</p>
      <p>👶 Por hijo: ${dinero(p.gastoPorHijo)}</p>
      <p>🏦 Efectivo inicial: ${dinero(p.efectivo)}</p>
    `;
    card.onclick = () => iniciarJuego(p);
    cont.appendChild(card);
  });
}

function iniciarJuego(profesion) {
  estado = nuevoEstado(profesion);
  $("inicio").classList.add("oculto");
  $("inicio").style.display = "none";
  $("btn-tirar").disabled = false;
  mensaje("¡A jugar! Tira el dado para avanzar por la carrera de la rata.");
  registrar(`Empiezas como ${profesion.nombre}`);
  actualizarPantalla();
}

/* ----------------------------------------------------------
   15) ARRANQUE
   ---------------------------------------------------------- */
$("btn-tirar").addEventListener("click", tirarDado);
$("btn-tirar").disabled = true;
mostrarProfesiones();
