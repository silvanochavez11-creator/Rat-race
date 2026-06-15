import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuración mínima de Vite con soporte para React (JSX).
export default defineConfig({
  plugins: [react()],
});
