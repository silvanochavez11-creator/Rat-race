import React from "react";
import ReactDOM from "react-dom/client";
import RatRaceGame from "./RatRace.jsx";

// Punto de entrada: montamos el juego dentro del <div id="root"> del index.html
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RatRaceGame />
  </React.StrictMode>
);
