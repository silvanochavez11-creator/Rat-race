// ============================================================
// MODO IDLE — "Imperio de la Rata"
// Estilo idle tycoon (AdVenture Capitalist / Pizza Ready):
// negocios que producen solos, managers que automatizan, mejoras
// infinitas, expansión de zonas y ganancias mientras no juegas.
// ============================================================
import { useState, useEffect, useRef, useCallback } from "react";

// -------- Paleta (misma del juego clásico) --------
const C = {
  bg: "#080C14", surface: "#0F1623", card: "#141E2E", border: "#1E2D42",
  purple: "#7C6FFF", green: "#00E5A0", red: "#FF4D6A", orange: "#FF8C42",
  blue: "#38BDF8", yellow: "#FFD166",
  textPrimary: "#F0F4FF", textSecondary: "#7A8BA8", textMuted: "#3D5068",
};

// -------- Negocios: cada uno produce dinero por ciclo --------
// costo: precio del primer nivel · prod: dinero por ciclo (nivel 1)
// tiempo: segundos que tarda un ciclo · manager: precio de automatizarlo
const NEGOCIOS = [
  { id: "tacos",    nombre: "Puesto de tacos",   emoji: "🌮", costo: 5,        prod: 1,        tiempo: 0.8,  manager: 1000,        color: "#FF8C42", zona: 0 },
  { id: "lavado",   nombre: "Lavado de autos",   emoji: "🚿", costo: 60,       prod: 60,       tiempo: 3,    manager: 15000,       color: "#38BDF8", zona: 0 },
  { id: "renta",    nombre: "Cuarto en renta",   emoji: "🛏️", costo: 720,      prod: 540,      tiempo: 6,    manager: 100000,      color: "#7C6FFF", zona: 0 },
  { id: "cafe",     nombre: "Cafetería",         emoji: "☕", costo: 8640,     prod: 4320,     tiempo: 12,   manager: 500000,      color: "#D98A4E", zona: 1 },
  { id: "gimnasio", nombre: "Gimnasio",          emoji: "🏋️", costo: 103680,   prod: 51840,    tiempo: 24,   manager: 1.2e6,       color: "#00E5A0", zona: 1 },
  { id: "depa",     nombre: "Departamentos",     emoji: "🏢", costo: 1244160,  prod: 622080,   tiempo: 96,   manager: 1e7,         color: "#60A5FA", zona: 1 },
  { id: "agencia",  nombre: "Agencia digital",   emoji: "💻", costo: 14929920, prod: 7464960,  tiempo: 384,  manager: 1.11e8,      color: "#22D3EE", zona: 2 },
  { id: "hotel",    nombre: "Hotel",             emoji: "🏨", costo: 179159040,prod: 89579520, tiempo: 1536, manager: 1.29e9,      color: "#FFD166", zona: 2 },
  { id: "torre",    nombre: "Torre corporativa", emoji: "🏙️", costo: 2149908480,prod:1074954240,tiempo:6144, manager: 1.51e10,     color: "#FB923C", zona: 2 },
];

// -------- Zonas que desbloqueas al crecer (estilo "Expansión Glacial") --------
const ZONAS = [
  { id: 0, nombre: "Tu barrio",       emoji: "🏘️", costo: 0,      cielo: "#0D1830" },
  { id: 1, nombre: "Zona Centro",     emoji: "🌆", costo: 250000, cielo: "#151A3A" },
  { id: 2, nombre: "Distrito Élite",  emoji: "🌃", costo: 5e7,    cielo: "#1B1038" },
];

// -------- Mejoras globales (multiplicadores permanentes) --------
const MEJORAS = [
  { id: "u1", nombre: "Café para todos",     emoji: "☕", desc: "×2 producción de todo",     costo: 25000,  mult: 2 },
  { id: "u2", nombre: "Sistema de gestión",  emoji: "📋", desc: "×2 producción de todo",     costo: 1.5e6,  mult: 2 },
  { id: "u3", nombre: "Marca reconocida",    emoji: "⭐", desc: "×3 producción de todo",     costo: 8e7,    mult: 3 },
  { id: "u4", nombre: "Expansión nacional",  emoji: "🚀", desc: "×3 producción de todo",     costo: 4e9,    mult: 3 },
  { id: "v1", nombre: "Turbo operaciones",   emoji: "⚡", desc: "Ciclos 2× más rápidos",     costo: 3e5,    velocidad: 2 },
  { id: "v2", nombre: "Automatización total",emoji: "🤖", desc: "Ciclos 2× más rápidos",     costo: 2e8,    velocidad: 2 },
];

const SAVE_IDLE = "ratrace_idle_v1";

// 🎯 ETAPAS DE VIDA — la lección de la "inflación del estilo de vida":
// cada vez que tu ingreso pasivo alcanza tu nivel de vida, subes de etapa...
// ¡y tu nuevo tren de vida cuesta mucho más! Solo eres libre cuando tu
// ingreso pasivo cubre la última etapa sin que tengas que trabajar.
const ETAPAS = [
  { nombre: "Sobrevivir",     emoji: "🍜", costo: 60,    desc: "Renta, comida y transporte. Vives al día." },
  { nombre: "Clase media",    emoji: "🏠", costo: 1400,  desc: "Casa propia, coche usado, algo de ahorro." },
  { nombre: "Vida cómoda",    emoji: "🚗", costo: 260000, desc: "Viajes, buen coche, colegios privados." },
  { nombre: "Vida de lujo",   emoji: "🛥️", costo: 3.2e7, desc: "Casa de playa, yate, personal a tu servicio." },
  { nombre: "Libertad total", emoji: "🏝️", costo: 2.4e9, desc: "Nunca más dependes de un trabajo. ¡Ganaste!" },
];
const etapaDe = (ingresoSeg) => {
  let i = 0;
  while (i < ETAPAS.length - 1 && ingresoSeg >= ETAPAS[i].costo) i++;
  return i;
};

// -------- Formato de números grandes (1.2K, 3.4M, 5.6B...) --------
const SUF = ["", "K", "M", "B", "T", "aa", "bb", "cc", "dd", "ee", "ff"];
const fmt = (n) => {
  if (!isFinite(n)) return "∞";
  const s = n < 0 ? "-" : "";
  n = Math.abs(n);
  if (n < 1000) return s + "$" + (n < 10 ? n.toFixed(1) : Math.floor(n));
  const i = Math.min(SUF.length - 1, Math.floor(Math.log10(n) / 3));
  return s + "$" + (n / Math.pow(1000, i)).toFixed(2) + SUF[i];
};
const fmtSeg = (n) => fmt(n) + "/s";

// Costo del siguiente nivel (crece exponencialmente) y de comprar `cant` niveles.
const costoNivel = (neg, nivel) => neg.costo * Math.pow(1.07, nivel);
const costoLote = (neg, nivel, cant) => {
  // Suma geométrica: c*r^n * (r^cant - 1)/(r - 1)
  const r = 1.07;
  return neg.costo * Math.pow(r, nivel) * (Math.pow(r, cant) - 1) / (r - 1);
};
// Cuántos niveles puedes pagar con `dinero`
const maxComprables = (neg, nivel, dinero) => {
  const r = 1.07, base = neg.costo * Math.pow(r, nivel);
  if (dinero < base) return 0;
  return Math.floor(Math.log(1 + (dinero * (r - 1)) / base) / Math.log(r));
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function IdleMode({ onSalir }) {
  const [dinero, setDinero] = useState(0);
  const [totalGanado, setTotalGanado] = useState(0);
  const [niveles, setNiveles] = useState({ tacos: 1 });      // empiezas con 1 puesto de tacos
  const [progresos, setProgresos] = useState({});             // 0..1 por negocio
  const [managers, setManagers] = useState({});
  const [mejoras, setMejoras] = useState([]);
  const [zonas, setZonas] = useState([0]);
  const [tiempo, setTiempo] = useState(0);                    // segundos jugados
  const [cantidad, setCantidad] = useState(1);                // ×1 ×10 ×100 MAX
  const [tab, setTab] = useState("negocios");
  const [billetes, setBilletes] = useState([]);               // dinero que brota
  const [ganado, setGanado] = useState(false);
  const [offlineMsg, setOfflineMsg] = useState(null);
  const [subioEtapa, setSubioEtapa] = useState(null);
  const [muted, setMuted] = useState(false);

  const billeteId = useRef(0);
  const cargado = useRef(false);

  // ---------- Cálculos derivados ----------
  const multProd = mejoras.reduce((m, id) => m * (MEJORAS.find(x => x.id === id)?.mult || 1), 1);
  const multVel = mejoras.reduce((m, id) => m * (MEJORAS.find(x => x.id === id)?.velocidad || 1), 1);
  const nivelDe = (id) => niveles[id] || 0;
  const prodPorCiclo = (neg) => neg.prod * nivelDe(neg.id) * multProd;
  const tiempoCiclo = (neg) => neg.tiempo / multVel;
  // Ingreso pasivo real: solo cuentan los negocios AUTOMATIZADOS (con manager)
  const ingresoSeg = NEGOCIOS.reduce((s, n) => s + (managers[n.id] && nivelDe(n.id) > 0 ? prodPorCiclo(n) / tiempoCiclo(n) : 0), 0);
  // Tu etapa de vida actual y la meta para subir a la siguiente
  const etapaIdx = etapaDe(ingresoSeg);
  const etapa = ETAPAS[etapaIdx];
  const gastoSeg = etapa.costo;
  const progresoLibertad = Math.min(100, (ingresoSeg / gastoSeg) * 100);
  const progresoTotal = Math.min(100, (etapaIdx / (ETAPAS.length - 1)) * 100 + (progresoLibertad / 100) * (100 / (ETAPAS.length - 1)));

  // ---------- Cargar partida (con ganancias offline) ----------
  useEffect(() => {
    if (cargado.current) return;
    cargado.current = true;
    try {
      const d = JSON.parse(localStorage.getItem(SAVE_IDLE));
      if (!d) return;
      setDinero(d.dinero || 0); setTotalGanado(d.totalGanado || 0);
      setNiveles(d.niveles || { tacos: 1 }); setManagers(d.managers || {});
      setMejoras(d.mejoras || []); setZonas(d.zonas || [0]); setTiempo(d.tiempo || 0);
      // 💤 Ganancias offline: lo que produjeron tus managers mientras no jugabas
      const seg = Math.min(8 * 3600, (Date.now() - (d.ts || Date.now())) / 1000);
      if (seg > 60) {
        const mp = (d.mejoras || []).reduce((m, id) => m * (MEJORAS.find(x => x.id === id)?.mult || 1), 1);
        const mv = (d.mejoras || []).reduce((m, id) => m * (MEJORAS.find(x => x.id === id)?.velocidad || 1), 1);
        const ips = NEGOCIOS.reduce((s, n) => {
          const lv = (d.niveles || {})[n.id] || 0;
          return s + ((d.managers || {})[n.id] && lv > 0 ? (n.prod * lv * mp) / (n.tiempo / mv) : 0);
        }, 0);
        const gan = ips * seg;
        if (gan > 0) {
          setDinero(x => x + gan); setTotalGanado(x => x + gan);
          setOfflineMsg({ gan, min: Math.round(seg / 60) });
        }
      }
    } catch {}
  }, []);

  // ---------- Guardado automático ----------
  useEffect(() => {
    const t = setInterval(() => {
      try {
        localStorage.setItem(SAVE_IDLE, JSON.stringify({ dinero, totalGanado, niveles, managers, mejoras, zonas, tiempo, ts: Date.now() }));
      } catch {}
    }, 3000);
    return () => clearInterval(t);
  }, [dinero, totalGanado, niveles, managers, mejoras, zonas, tiempo]);

  // ---------- Billete que brota de un negocio ----------
  const brotar = useCallback((negId, monto) => {
    const id = ++billeteId.current;
    setBilletes(prev => [...prev.slice(-14), { id, negId, monto }]);
    setTimeout(() => setBilletes(prev => prev.filter(b => b.id !== id)), 1200);
  }, []);

  // ---------- EL TICK: el corazón del idle (10 veces por segundo) ----------
  useEffect(() => {
    const DT = 0.1;
    const t = setInterval(() => {
      setTiempo(x => x + DT);
      setProgresos(prev => {
        const next = { ...prev };
        let cobro = 0;
        const cobros = [];
        NEGOCIOS.forEach(neg => {
          const lv = niveles[neg.id] || 0;
          if (lv <= 0) return;
          const corriendo = next[neg.id] > 0 || managers[neg.id];
          if (!corriendo) return;
          const dur = neg.tiempo / multVel;
          const p = (next[neg.id] || 0) + DT / dur;
          if (p >= 1) {
            const monto = neg.prod * lv * multProd;
            cobro += monto;
            cobros.push([neg.id, monto]);
            next[neg.id] = managers[neg.id] ? p - 1 : 0;   // el manager reinicia solo
          } else {
            next[neg.id] = p;
          }
        });
        if (cobro > 0) {
          setDinero(d => d + cobro);
          setTotalGanado(d => d + cobro);
          cobros.forEach(([id, m]) => brotar(id, m));
        }
        return next;
      });
    }, 100);
    return () => clearInterval(t);
  }, [niveles, managers, multProd, multVel, brotar]);

  // ---------- Victoria: cubrir la ÚLTIMA etapa de vida ----------
  useEffect(() => {
    if (!ganado && etapaIdx === ETAPAS.length - 1 && ingresoSeg >= ETAPAS[ETAPAS.length - 1].costo) setGanado(true);
  }, [ingresoSeg, etapaIdx, ganado]);

  // ---------- Celebrar al subir de etapa de vida ----------
  const etapaPrev = useRef(null);
  useEffect(() => {
    if (etapaPrev.current !== null && etapaIdx > etapaPrev.current) {
      setSubioEtapa(ETAPAS[etapaIdx]);
      setTimeout(() => setSubioEtapa(null), 4000);
    }
    etapaPrev.current = etapaIdx;
  }, [etapaIdx]);

  // ---------- Acciones ----------
  const trabajar = (neg) => {   // tocar el negocio para iniciar un ciclo a mano
    if ((niveles[neg.id] || 0) <= 0) return;
    setProgresos(prev => (prev[neg.id] > 0 ? prev : { ...prev, [neg.id]: 0.0001 }));
  };
  const comprar = (neg) => {
    const lv = nivelDe(neg.id);
    const cant = cantidad === "MAX" ? Math.max(1, maxComprables(neg, lv, dinero)) : cantidad;
    const costo = costoLote(neg, lv, cant);
    if (dinero < costo) return;
    setDinero(d => d - costo);
    setNiveles(n => ({ ...n, [neg.id]: lv + cant }));
  };
  const contratar = (neg) => {
    if (managers[neg.id] || dinero < neg.manager) return;
    setDinero(d => d - neg.manager);
    setManagers(m => ({ ...m, [neg.id]: true }));
    setProgresos(p => ({ ...p, [neg.id]: p[neg.id] || 0.0001 }));
  };
  const comprarMejora = (u) => {
    if (mejoras.includes(u.id) || dinero < u.costo) return;
    setDinero(d => d - u.costo);
    setMejoras(m => [...m, u.id]);
  };
  const desbloquearZona = (z) => {
    if (zonas.includes(z.id) || dinero < z.costo) return;
    setDinero(d => d - z.costo);
    setZonas(prev => [...prev, z.id]);
  };
  const reiniciar = () => {
    try { localStorage.removeItem(SAVE_IDLE); } catch {}
    setDinero(0); setTotalGanado(0); setNiveles({ tacos: 1 }); setProgresos({});
    setManagers({}); setMejoras([]); setZonas([0]); setTiempo(0); setGanado(false);
  };

  const zonaActual = ZONAS.filter(z => zonas.includes(z.id)).pop() || ZONAS[0];
  const negociosVisibles = NEGOCIOS.filter(n => zonas.includes(n.zona));
  const proximaZona = ZONAS.find(z => !zonas.includes(z.id));

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter', -apple-system, sans-serif", maxWidth: 460, margin: "0 auto", paddingBottom: 90, color: C.textPrimary }}>
      <style>{CSS_IDLE}</style>

      {/* ---------- HEADER ---------- */}
      <div style={{ position: "sticky", top: 0, zIndex: 40, background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "10px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={onSalir} title="Volver" style={{ background: "none", border: "none", color: C.textSecondary, fontSize: 18, cursor: "pointer", padding: 0 }}>←</button>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5 }}>{fmt(dinero)}</div>
            <div style={{ fontSize: 11, fontWeight: 700 }}>
              <span style={{ color: C.green }}>🔁 {fmtSeg(ingresoSeg)}</span>
              <span style={{ color: C.textMuted, fontWeight: 400 }}> · meta </span>
              <span style={{ color: C.yellow }} title={etapa.desc}>{etapa.emoji} {fmtSeg(gastoSeg)}</span>
            </div>
          </div>
          <button onClick={() => setMuted(m => !m)} style={{ background: "none", border: "none", fontSize: 15, cursor: "pointer" }}>{muted ? "🔇" : "🔊"}</button>
        </div>
        {/* Barra de libertad */}
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.textSecondary, marginBottom: 3 }}>
            <span>Siguiente nivel de vida: {etapa.emoji} <strong style={{ color: C.textPrimary }}>{etapa.nombre}</strong> <span style={{ color: C.textMuted }}>({etapaIdx + 1}/{ETAPAS.length})</span></span>
            <span style={{ color: progresoLibertad >= 100 ? C.yellow : C.green, fontWeight: 700 }}>{progresoLibertad.toFixed(1)}%</span>
          </div>
          <div style={{ background: C.border, borderRadius: 99, height: 8, overflow: "hidden" }}>
            <div style={{ width: `${progresoLibertad}%`, height: "100%", borderRadius: 99, background: `linear-gradient(90deg, ${C.purple}, ${C.green})`, transition: "width .3s", boxShadow: progresoLibertad > 80 ? `0 0 10px ${C.green}` : "none" }} />
          </div>
          {/* Puntos de las etapas de vida */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            {ETAPAS.map((e, i) => (
              <span key={e.nombre} title={`${e.nombre}: ${fmtSeg(e.costo)} — ${e.desc}`} style={{ fontSize: 12, opacity: i <= etapaIdx ? 1 : 0.28, filter: i <= etapaIdx ? "none" : "grayscale(1)" }}>{e.emoji}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- ESCENA ISOMÉTRICA ---------- */}
      <Escena negocios={negociosVisibles} niveles={niveles} managers={managers} progresos={progresos} zona={zonaActual} billetes={billetes} />

      {/* ---------- TABS ---------- */}
      <div style={{ display: "flex", gap: 4, padding: "0 12px", margin: "10px 0" }}>
        {[["negocios", "🏪", "Negocios"], ["mejoras", "⚡", "Mejoras"], ["zonas", "🗺️", "Zonas"]].map(([k, ic, lb]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            flex: 1, background: tab === k ? C.card : C.surface, border: `1px solid ${tab === k ? C.purple : C.border}`,
            color: tab === k ? C.textPrimary : C.textSecondary, borderRadius: 10, padding: "8px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer"
          }}>{ic} {lb}</button>
        ))}
      </div>

      {/* ---------- NEGOCIOS ---------- */}
      {tab === "negocios" && (
        <div style={{ padding: "0 12px" }}>
          {/* Selector de cantidad de compra */}
          <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: C.textMuted, alignSelf: "center", marginRight: 4 }}>Comprar:</span>
            {[1, 10, 100, "MAX"].map(c => (
              <button key={c} onClick={() => setCantidad(c)} style={{
                flex: 1, background: cantidad === c ? `${C.purple}33` : C.surface, border: `1px solid ${cantidad === c ? C.purple : C.border}`,
                color: cantidad === c ? C.purple : C.textSecondary, borderRadius: 8, padding: "5px 0", fontSize: 11, fontWeight: 800, cursor: "pointer"
              }}>×{c}</button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {negociosVisibles.map(neg => (
              <TarjetaNegocio key={neg.id} neg={neg} nivel={nivelDe(neg.id)} progreso={progresos[neg.id] || 0}
                manager={!!managers[neg.id]} dinero={dinero} cantidad={cantidad} multProd={multProd} multVel={multVel}
                onTrabajar={() => trabajar(neg)} onComprar={() => comprar(neg)} onContratar={() => contratar(neg)} />
            ))}
          </div>
        </div>
      )}

      {/* ---------- MEJORAS ---------- */}
      {tab === "mejoras" && (
        <div style={{ padding: "0 12px", display: "flex", flexDirection: "column", gap: 8 }}>
          {MEJORAS.map(u => {
            const tengo = mejoras.includes(u.id), puedo = dinero >= u.costo;
            return (
              <div key={u.id} style={{ background: C.card, border: `1px solid ${tengo ? C.green : C.border}`, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, opacity: tengo ? 0.7 : 1 }}>
                <div style={{ fontSize: 26 }}>{u.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{u.nombre}</div>
                  <div style={{ fontSize: 11, color: u.velocidad ? C.blue : C.green }}>{u.desc}</div>
                </div>
                <button disabled={tengo || !puedo} onClick={() => comprarMejora(u)} style={{
                  background: tengo ? "transparent" : puedo ? C.green : C.border, color: tengo ? C.green : puedo ? "#03281b" : C.textMuted,
                  border: "none", borderRadius: 9, padding: "8px 12px", fontSize: 11, fontWeight: 800, cursor: tengo || !puedo ? "default" : "pointer", whiteSpace: "nowrap"
                }}>{tengo ? "✓ Tienes" : fmt(u.costo)}</button>
              </div>
            );
          })}
        </div>
      )}

      {/* ---------- ZONAS ---------- */}
      {tab === "zonas" && (
        <div style={{ padding: "0 12px", display: "flex", flexDirection: "column", gap: 8 }}>
          {ZONAS.map(z => {
            const tengo = zonas.includes(z.id), puedo = dinero >= z.costo;
            const negs = NEGOCIOS.filter(n => n.zona === z.id);
            return (
              <div key={z.id} style={{ background: C.card, border: `1px solid ${tengo ? C.green : C.border}`, borderRadius: 12, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 800 }}>{z.emoji} {z.nombre}</span>
                  {tengo ? <span style={{ fontSize: 11, color: C.green, fontWeight: 700 }}>✓ Desbloqueada</span>
                    : <button disabled={!puedo} onClick={() => desbloquearZona(z)} style={{ background: puedo ? C.purple : C.border, color: puedo ? "#fff" : C.textMuted, border: "none", borderRadius: 9, padding: "7px 14px", fontSize: 11, fontWeight: 800, cursor: puedo ? "pointer" : "default" }}>🔓 {fmt(z.costo)}</button>}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {negs.map(n => <span key={n.id} style={{ fontSize: 11, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 99, padding: "3px 9px", color: tengo ? C.textSecondary : C.textMuted }}>{n.emoji} {n.nombre}</span>)}
                </div>
              </div>
            );
          })}
          <div style={{ background: `${C.purple}11`, border: `1px solid ${C.purple}33`, borderRadius: 10, padding: "10px 14px" }}>
            <p style={{ color: "#C4BBFF", fontSize: 11, margin: 0, lineHeight: 1.6 }}>💡 Solo los negocios con <strong>manager</strong> cuentan como ingreso pasivo: son los que trabajan sin ti. ¡Esa es la clave para salir de la carrera de la rata!</p>
          </div>
          <button onClick={reiniciar} style={{ background: C.surface, border: `1px solid ${C.red}44`, color: C.red, borderRadius: 10, padding: 10, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>🗑️ Reiniciar imperio</button>
        </div>
      )}

      {/* ---------- Barra inferior: siguiente meta ---------- */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 460, background: C.bg, borderTop: `1px solid ${C.border}`, padding: "10px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11 }}>
          <span style={{ color: C.textMuted }}>💼 Total ganado: <strong style={{ color: C.textSecondary }}>{fmt(totalGanado)}</strong></span>
          {proximaZona
            ? <span style={{ color: C.textMuted }}>🔒 {proximaZona.nombre}: <strong style={{ color: dinero >= proximaZona.costo ? C.green : C.yellow }}>{fmt(proximaZona.costo)}</strong></span>
            : <span style={{ color: C.green }}>🌍 Todas las zonas</span>}
        </div>
      </div>

      {/* ---------- Subiste de etapa de vida ---------- */}
      {subioEtapa && (
        <div style={{ position: "fixed", top: 90, left: "50%", transform: "translateX(-50%)", zIndex: 190, width: "88%", maxWidth: 380, background: `linear-gradient(135deg, ${C.card}, ${C.surface})`, border: `1px solid ${C.yellow}77`, borderRadius: 16, padding: "12px 16px", boxShadow: `0 10px 34px rgba(0,0,0,.6)`, animation: "idle-pop .3s ease" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ fontSize: 30, animation: "idle-bob 1.6s infinite" }}>{subioEtapa.emoji}</div>
            <div>
              <div style={{ fontSize: 10, color: C.yellow, letterSpacing: 1.5, fontWeight: 800 }}>SUBISTE DE NIVEL DE VIDA</div>
              <div style={{ fontSize: 15, fontWeight: 900 }}>{subioEtapa.nombre}</div>
              <div style={{ fontSize: 11, color: C.textSecondary, lineHeight: 1.4 }}>{subioEtapa.desc}</div>
              <div style={{ fontSize: 10, color: C.red, marginTop: 3 }}>⚠️ Tu tren de vida ahora cuesta {fmtSeg(subioEtapa.costo)}</div>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Ganancias offline ---------- */}
      {offlineMsg && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
          <div style={{ background: C.card, border: `1px solid ${C.green}66`, borderRadius: 20, padding: 26, textAlign: "center", maxWidth: 320, animation: "idle-pop .3s ease" }}>
            <div style={{ fontSize: 46 }}>💤</div>
            <h3 style={{ margin: "8px 0 4px", fontSize: 17 }}>¡Tu imperio trabajó sin ti!</h3>
            <p style={{ color: C.textSecondary, fontSize: 13, margin: "0 0 14px" }}>Tus managers produjeron durante <strong>{offlineMsg.min} min</strong>.</p>
            <div style={{ fontSize: 28, fontWeight: 900, color: C.green, marginBottom: 16 }}>+{fmt(offlineMsg.gan)}</div>
            <button onClick={() => setOfflineMsg(null)} style={{ background: C.green, color: "#03281b", border: "none", borderRadius: 12, padding: "11px 30px", fontSize: 14, fontWeight: 800, cursor: "pointer", width: "100%" }}>¡Recoger!</button>
          </div>
        </div>
      )}

      {/* ---------- Victoria ---------- */}
      {ganado && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.92)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 210, padding: 20 }}>
          <div style={{ background: C.card, border: `1px solid ${C.yellow}66`, borderRadius: 20, padding: 26, textAlign: "center", maxWidth: 340, animation: "idle-pop .3s ease" }}>
            <div style={{ fontSize: 54, animation: "idle-bob 2s infinite" }}>🏆</div>
            <h2 style={{ color: C.green, fontSize: 22, fontWeight: 900, margin: "8px 0 6px" }}>¡Saliste de la carrera!</h2>
            <p style={{ color: C.textSecondary, fontSize: 13, lineHeight: 1.6, margin: "0 0 14px" }}>
              Tu ingreso pasivo (<strong style={{ color: C.green }}>{fmtSeg(ingresoSeg)}</strong>) ya cubre lo que cuesta tu vida
              (<strong>{fmtSeg(gastoSeg)}</strong>). Tus negocios trabajan solos. 🐀💨
            </p>
            <div style={{ background: C.surface, borderRadius: 12, padding: 12, marginBottom: 14, fontSize: 12, color: C.textSecondary }}>
              ⏱️ Lo lograste en <strong style={{ color: C.textPrimary }}>{Math.floor(tiempo / 60)} min {Math.floor(tiempo % 60)} s</strong>
            </div>
            <button onClick={() => setGanado(false)} style={{ background: `linear-gradient(135deg, ${C.purple}, #9333EA)`, color: "#fff", border: "none", borderRadius: 12, padding: "11px", fontSize: 14, fontWeight: 800, cursor: "pointer", width: "100%" }}>Seguir creciendo →</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// ESCENA ISOMÉTRICA: tu imperio visto desde arriba
// ============================================================
function Escena({ negocios, niveles, managers, progresos, zona, billetes }) {
  const activos = negocios.filter(n => (niveles[n.id] || 0) > 0);
  return (
    <div style={{ position: "relative", margin: "0 12px", borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}`, background: `linear-gradient(180deg, ${zona.cielo}, ${C.bg})`, height: 210 }}>
      <div style={{ position: "absolute", top: 8, left: 10, fontSize: 9, letterSpacing: 2, color: C.textMuted, textTransform: "uppercase", zIndex: 3 }}>{zona.emoji} {zona.nombre}</div>
      {/* Suelo isométrico (escalado para que toda la parcela quepa en el marco) */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", perspective: 700 }}>
        <div style={{ width: 246, height: 246, transform: "rotateX(56deg) rotateZ(-45deg) scale(.82)", transformStyle: "preserve-3d", position: "relative" }}>
          {/* Losas del terreno (3×3) */}
          {Array.from({ length: 9 }).map((_, i) => {
            const fila = Math.floor(i / 3), col = i % 3;
            const neg = activos[i];
            const lv = neg ? (niveles[neg.id] || 0) : 0;
            const alto = neg ? Math.min(50, 10 + Math.log2(lv + 1) * 7) : 0;
            const trabajando = neg && (progresos[neg.id] > 0 || managers[neg.id]);
            return (
              <div key={i} style={{ position: "absolute", left: col * 82, top: fila * 82, width: 74, height: 74, transformStyle: "preserve-3d" }}>
                {/* Losa */}
                <div style={{ position: "absolute", inset: 0, background: neg ? `${neg.color}22` : "#131C2E", border: `1px solid ${neg ? neg.color + "66" : "#1E2D42"}`, borderRadius: 6 }} />
                {/* Edificio (crece con el nivel) */}
                {neg && (
                  <>
                    <div style={{
                      position: "absolute", left: 11, top: 11, width: 52, height: 52, borderRadius: 5,
                      background: `linear-gradient(145deg, ${neg.color}dd, ${neg.color}77)`,
                      transform: `translateZ(${alto}px)`, boxShadow: `0 0 20px ${neg.color}66`,
                      border: `1px solid ${neg.color}`,
                      animation: trabajando ? "idle-work 1.6s ease-in-out infinite" : "none",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ fontSize: 23, transform: "rotateZ(45deg) rotateX(-56deg)", display: "block" }}>{neg.emoji}</span>
                    </div>
                    {/* Etiqueta de nivel */}
                    <div style={{ position: "absolute", left: 20, top: 54, transform: `translateZ(${alto}px) rotateZ(45deg) rotateX(-56deg)`, fontSize: 9, fontWeight: 800, color: "#fff", background: "rgba(0,0,0,.65)", padding: "1px 6px", borderRadius: 99, whiteSpace: "nowrap" }}>
                      {managers[neg.id] ? "🤖" : ""}{lv}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* 💵 Billetes que brotan */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 4 }}>
        {billetes.map((b, i) => {
          const idx = activos.findIndex(n => n.id === b.negId);
          const x = 22 + ((idx >= 0 ? idx : 0) % 3) * 30 + (i % 3) * 4;
          const y = 34 + Math.floor((idx >= 0 ? idx : 0) / 3) * 22;
          return (
            <div key={b.id} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, fontSize: 12, fontWeight: 800, color: C.green, whiteSpace: "nowrap", animation: "idle-float 1.2s ease-out forwards", textShadow: "0 2px 8px rgba(0,0,0,.9)" }}>
              💵 +{fmt(b.monto)}
            </div>
          );
        })}
      </div>
      {activos.length === 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: C.textMuted, fontSize: 12 }}>Compra tu primer negocio 👇</div>
      )}
    </div>
  );
}

// ============================================================
// TARJETA DE NEGOCIO (con barra de progreso del ciclo)
// ============================================================
function TarjetaNegocio({ neg, nivel, progreso, manager, dinero, cantidad, multProd, multVel, onTrabajar, onComprar, onContratar }) {
  const cant = cantidad === "MAX" ? Math.max(1, maxComprables(neg, nivel, dinero)) : cantidad;
  const costo = costoLote(neg, nivel, cant);
  const puedeComprar = dinero >= costo;
  const puedeManager = !manager && dinero >= neg.manager && nivel > 0;
  const produccion = neg.prod * nivel * multProd;
  const dur = neg.tiempo / multVel;
  const bloqueado = nivel === 0;

  return (
    <div style={{ background: C.card, border: `1px solid ${bloqueado ? C.border : neg.color + "55"}`, borderRadius: 14, padding: 12, opacity: bloqueado ? 0.75 : 1 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {/* Botón grande: tocar para trabajar */}
        <button onClick={onTrabajar} disabled={bloqueado || manager} title={manager ? "Automatizado" : "¡Toca para trabajar!"} style={{
          width: 58, height: 58, borderRadius: 14, flexShrink: 0, position: "relative", overflow: "hidden",
          background: bloqueado ? C.surface : `${neg.color}22`, border: `2px solid ${bloqueado ? C.border : neg.color}`,
          cursor: bloqueado || manager ? "default" : "pointer", fontSize: 26,
          animation: !bloqueado && !manager && progreso === 0 ? "idle-pulse 2s infinite" : "none",
        }}>
          {/* Relleno circular del ciclo */}
          <span style={{ position: "absolute", inset: 0, background: `conic-gradient(${neg.color}66 ${progreso * 360}deg, transparent 0deg)` }} />
          <span style={{ position: "relative" }}>{bloqueado ? "🔒" : neg.emoji}</span>
          {manager && <span style={{ position: "absolute", bottom: 1, right: 3, fontSize: 11 }}>🤖</span>}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: 13, fontWeight: 800 }}>{neg.nombre}</span>
            <span style={{ fontSize: 11, color: C.textMuted }}>nv {nivel}</span>
          </div>
          {/* Barra de progreso del ciclo */}
          <div style={{ background: C.surface, borderRadius: 99, height: 14, overflow: "hidden", margin: "5px 0", position: "relative", border: `1px solid ${C.border}` }}>
            <div style={{ width: `${progreso * 100}%`, height: "100%", background: `linear-gradient(90deg, ${neg.color}aa, ${neg.color})`, transition: "width .1s linear" }} />
            <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,.8)" }}>
              {nivel > 0 ? `${fmt(produccion)} · ${dur < 1 ? dur.toFixed(1) : Math.round(dur)}s` : "bloqueado"}
            </span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={onComprar} disabled={!puedeComprar} style={{
              flex: 2, background: puedeComprar ? neg.color : C.border, color: puedeComprar ? "#0A0F1C" : C.textMuted,
              border: "none", borderRadius: 9, padding: "7px 4px", fontSize: 11, fontWeight: 800, cursor: puedeComprar ? "pointer" : "default",
            }}>{nivel === 0 ? "Comprar" : `+${cant}`} · {fmt(costo)}</button>
            <button onClick={onContratar} disabled={!puedeManager} title="Manager: trabaja solo" style={{
              flex: 1.4, background: manager ? "transparent" : puedeManager ? `${C.purple}` : C.border,
              color: manager ? C.green : puedeManager ? "#fff" : C.textMuted, border: manager ? `1px solid ${C.green}55` : "none",
              borderRadius: 9, padding: "7px 4px", fontSize: 10, fontWeight: 800, cursor: puedeManager ? "pointer" : "default", whiteSpace: "nowrap",
            }}>{manager ? "🤖 Auto" : `🤖 ${fmt(neg.manager)}`}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const CSS_IDLE = `
@keyframes idle-float { 0% { opacity: 0; transform: translateY(6px) scale(.8); } 20% { opacity: 1; transform: translateY(0) scale(1); } 100% { opacity: 0; transform: translateY(-34px) scale(1.05); } }
@keyframes idle-pop { from { transform: scale(.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes idle-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes idle-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(255,255,255,.0); } 50% { box-shadow: 0 0 0 5px rgba(255,255,255,.09); } }
@keyframes idle-work { 0%,100% { filter: brightness(1); } 50% { filter: brightness(1.35); } }
button { transition: transform .06s ease, filter .15s ease; }
button:active:not(:disabled) { transform: scale(.94); }
`;
