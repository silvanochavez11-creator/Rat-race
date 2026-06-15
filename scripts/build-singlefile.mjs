// Genera RatRace-jugar.html: un único archivo HTML autónomo con TODO el juego
// (React + código) incrustado, para abrirlo con doble clic sin instalar nada.
//
//   node scripts/build-singlefile.mjs      (o)      npm run build:single
//
import esbuild from "esbuild";
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Empaquetamos como IIFE clásico (no módulo) para que funcione en file://
const result = await esbuild.build({
  entryPoints: [resolve(raiz, "src/main.jsx")],
  bundle: true,
  format: "iife",
  jsx: "automatic",
  minify: true,
  write: false,
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "info",
});
const js = result.outputFiles[0].text;

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>🐀 Rat Race — La carrera que no te enseñaron</title>
<style>html,body,#root{margin:0;padding:0;background:#080C14;}*{box-sizing:border-box;}</style>
</head>
<body>
<div id="root"></div>
<script>
${js.replace(/<\/script>/g, "<\\/script>")}
</script>
</body>
</html>`;

const salida = resolve(raiz, "RatRace-jugar.html");
writeFileSync(salida, html);
console.log(`✓ Generado ${salida} (${(html.length / 1024).toFixed(0)} KB)`);
