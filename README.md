# 🐀 Rat Race — La carrera que no te enseñaron

Juego de **educación financiera** inspirado en *Cashflow* de Robert Kiyosaki.
Tomas decisiones financieras reales, aprendes habilidades, construyes activos
y cuidas tu energía. **Ganas cuando tu ingreso pasivo supera tus gastos
mensuales = libertad financiera.** 🏆

## ▶️ Cómo ejecutarlo

Necesitas tener [Node.js](https://nodejs.org) instalado. Luego:

```bash
npm install      # instala las dependencias (solo la primera vez)
npm run dev      # arranca el juego en modo desarrollo
```

Abre la URL que aparece en la terminal (normalmente `http://localhost:5173`).

Otros comandos:

```bash
npm run build    # genera la versión optimizada en la carpeta dist/
npm run preview  # sirve la versión de producción para probarla
```

## 🎮 Mecánicas del juego

- **Tutorial guiado**: la primera vez que juegas, una guía paso a paso te explica
  el objetivo, el tablero, tus números, habilidades, activos, deudas y la
  negociación. Se puede reabrir cuando quieras con el botón ❓.
- **Tablero de la carrera de la rata**: tiras el dado al avanzar y tu ficha 🐀
  recorre el tablero. La casilla donde caes (oportunidad, gasto, mercado,
  cliente, chamba, libre, paga) **sesga el evento** que aparece.
- **3 niveles de dificultad** (Fácil / Normal / Difícil) que escalan tus gastos
  iniciales, la **inflación** (tus gastos suben con el tiempo) y la frecuencia de
  imprevistos. ¡En Difícil hay que moverse rápido!
- **4 perfiles** para empezar: Estudiante, Freelancer, Empleado y Doctor/Profesionista.
  Cada uno con distinto dinero, deudas, habilidades y dificultad.
- **Árbol de habilidades** de varios nichos (Oficios, Digital, Ventas, Finanzas,
  🧱 Construcción, 🏢 Negocios y 🩺 Salud): aprende skills que desbloquean mejores
  oportunidades y suben tus probabilidades. Algunas habilidades de negocio/salud
  (agencia de marketing, consultorio/clínica, escalar) **forman una empresa que
  genera ingreso pasivo** (p. ej. el doctor monta su clínica y contrata doctores).
- **Habilidades por profesión**: cada perfil ve solo las **ramas que le
  corresponden** (el doctor ya no aprende mecánica). Hay ramas nuevas: 💼
  Corporativo (empleado), 🧑‍💻 Freelance (freelancer) y 🌱 Básico (estudiante),
  con skills propias (gestión del tiempo, liderazgo, trabajo remoto que baja
  gastos, propuestas, productividad, tutorías, idiomas, contenido digital...).
- **Afinidad por profesión**: cada perfil tiene una **carrera recomendada** con
  **−25%** en esas habilidades y una insignia ★.
- **Eventos exclusivos por perfil**: aumento de sueldo/ascenso/recorte (empleado),
  cliente que no paga/retainer/cliente internacional/burn out (freelancer),
  beca/examen reprobado/primera venta (estudiante), consulta/cirugía (doctor).
- **Animaciones**: números flotantes de dinero (+/−), shake al perder, modales
  con scale-in, botones con press, flash al subir de nivel y pulso de la barra
  de libertad cerca de la meta.
- **Experiencia (nivel 1 a 10)**: sube con las semanas trabajadas y los trabajos
  hechos. A mayor nivel, **más probabilidad de éxito y mejores pagos** en contratos.
- **Puntos de maestría** (barra independiente del nivel): se acumulan al trabajar
  y se **gastan** en mejorar habilidades (no afectan tu nivel de experiencia).
- **Maestría por habilidad (1 a 20)**: cada habilidad que tienes sube de maestría
  y se vuelve más potente. La mejoras de 3 formas: 🎓 con **puntos de maestría**
  (+0.15), 💵 con **dinero** (+0.5) o ⭐ una **mejora especial** más cara (+1.0).
  A más maestría, mejores contratos, rentas y negociaciones.
- **Pertenencias 🏠🚗**: compra vehículos, casas, dúplex, **edificios de varias
  unidades** y negocios. Tienen **plusvalía** (las casas suben de valor, los
  vehículos se deprecian) y eliges si los **rentas** o los **vendes**.
  - Cada bien añade un **mantenimiento mensual** a tus gastos (¡un bien sin rentar
    es un pasivo!).
  - Para rentar debes **buscar y negociar con un inquilino** (puedes intentar una
    renta más alta según tus habilidades).
  - Aparecen **oportunidades de inmuebles** como evento: requieren la habilidad de
    bienes raíces y, si no tienes el dinero, puedes **financiarlas** con préstamo.
- **Sistema de energía**: cada ciclo te cansa; descansa para no quedarte sin energía.
- **Eventos**: chambas, oportunidades, inversiones, gastos imprevistos y hasta
  crisis económicas ("cisnes negros").
- **Negociación con diálogo**: al elegir "Negociar" un trato con un cliente se
  abre un panel donde respondes a sus objeciones ("está muy caro", "déjame
  pensarlo"...). La calidad de tu respuesta y tus habilidades (oratoria,
  lenguaje corporal, cierre...) determinan si cierras el contrato.
- **Tiempos difíciles**: meses sin ventas, crisis económica del país,
  accidentes con gasto médico, inflación que sube tus gastos fijos, etc.
- **Invierte en tu negocio**: contrata más gente, abre sucursales o nuevas
  líneas, y corre **publicidad de pago** para atraer clientes.
- **Descansar cuesta dinero** (moderado, y a veces es gratis): cuida tu energía
  sin descapitalizarte.
- **Mentor / consejero**: te da consejos contextuales según tu situación, y
  puedes pedirle consejo cuando quieras con el botón "🧑‍🏫 Pedir consejo".
- **Sistema de deuda con bancos ficticios**: pestaña 💳 **Deudas** donde:
  - Pides préstamos eligiendo banco y cantidad. Cada banco tiene su tasa
    mensual: 🏛️ Banco Popular (3%), 🏦 CrediMax (6%), 💸 Préstamos Rapidito (8%).
  - Cada banco tiene un **límite de préstamo** que crece con tu **historial
    crediticio** (pagar tus deudas a tiempo lo sube). No puedes pedir de más.
  - Cada mes se cobra el interés y un pago mínimo automático. En bancos caros
    el interés supera el mínimo y **la deuda crece sola** (interés compuesto).
  - Puedes **Liquidar** (pagar todo) o **Abonar** (pago parcial) cuando quieras.
- **Guardado automático**: tu partida se guarda en el navegador. Al volver,
  puedes **Continuar** donde la dejaste.
- **Sonido y animaciones**: efectos de sonido (con botón 🔊/🔇 para silenciar)
  y animaciones sutiles.
- **Meta**: ingresos pasivos `>` gastos mensuales.
- **Tabla de líderes**: al salir de la carrera, tu tiempo se registra y compite en
  un **podio (top 3)** y un **top 10** de tus partidas más rápidas (ranqueadas por
  el tiempo real en meses, para comparar perfiles de forma justa).

## 🗂️ Estructura del proyecto

```
.
├── index.html            # punto de entrada HTML
├── src/
│   ├── main.jsx          # arranque de React
│   └── RatRace.jsx       # ¡todo el juego! (componente principal)
├── package.json          # dependencias y scripts
├── vite.config.js        # configuración de Vite
└── prototipo-vanilla/    # primera versión simple en HTML/CSS/JS puro
                          # (se conserva como referencia de aprendizaje)
```

## 📚 Lo que enseña

- La diferencia entre **ingresos activos** (trabajar por dinero) e **ingresos
  pasivos** (que el dinero y los activos trabajen por ti).
- Cómo las **deudas** y los **gastos** te mantienen atrapado en el rat race.
- Por qué **aprender habilidades** es la mejor inversión.
- Cómo manejar **objeciones de ventas** en la vida real.

## 💡 Ideas para seguir mejorando

- Guardar la partida con `localStorage`.
- Añadir la **"vía rápida"** (Fast Track) después de salir del rat race.
- Más eventos, perfiles y habilidades.
- Sonidos y animaciones.

¡Diviértete y aprende! 🚀
