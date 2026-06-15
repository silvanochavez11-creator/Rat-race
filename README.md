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

- **4 perfiles** para empezar: Estudiante, Freelancer, Empleado y Doctor/Profesionista.
  Cada uno con distinto dinero, deudas, habilidades y dificultad.
- **Árbol de habilidades** de varios nichos (Oficios, Digital, Ventas, Finanzas,
  🧱 Construcción y 🏢 Negocios): aprende skills que desbloquean mejores
  oportunidades y suben tus probabilidades. Algunas habilidades de negocio
  (agencia de marketing, escalar) **forman una empresa que genera ingreso pasivo**.
- **Experiencia (nivel 1 a 10)**: sube con las semanas trabajadas y los trabajos
  hechos. A mayor nivel, **más probabilidad de éxito y mejores pagos** en contratos.
- **Pertenencias 🏠🚗**: compra vehículos, casas y negocios. Tienen **plusvalía**
  (las casas suben de valor, los vehículos se deprecian) y eliges si los **rentas**
  (ingreso pasivo) o los **vendes** (efectivo). Tus habilidades aumentan la renta.
- **Sistema de energía**: cada ciclo te cansa; descansa para no quedarte sin energía.
- **Eventos**: chambas, oportunidades, inversiones, gastos imprevistos y hasta
  crisis económicas ("cisnes negros").
- **Sistema de objeciones de ventas**: practica respuestas reales a clientes
  ("está muy caro", "déjame pensarlo"...) y aprende la lección detrás de cada una.
- **Mentor / consejero**: te da consejos contextuales según tu situación, y
  puedes pedirle consejo cuando quieras con el botón "🧑‍🏫 Pedir consejo".
- **Sistema de deuda con bancos ficticios**: pestaña 💳 **Deudas** donde:
  - Pides préstamos eligiendo banco y cantidad. Cada banco tiene su tasa
    mensual: 🏛️ Banco Popular (3%), 🏦 CrediMax (6%), 💸 Préstamos Rapidito (8%).
  - Cada mes se cobra el interés y un pago mínimo automático. En bancos caros
    el interés supera el mínimo y **la deuda crece sola** (interés compuesto).
  - Puedes **Liquidar** (pagar todo) o **Abonar** (pago parcial) cuando quieras.
- **Guardado automático**: tu partida se guarda en el navegador. Al volver,
  puedes **Continuar** donde la dejaste.
- **Sonido y animaciones**: efectos de sonido (con botón 🔊/🔇 para silenciar)
  y animaciones sutiles.
- **Meta**: ingresos pasivos `>` gastos mensuales.

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
