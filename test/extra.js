/* Pruebas de rutas de error: respuestas incorrectas, pistas, bloqueo de
   misiones, reinicio de progreso y precisión tras fallos. */
const { JSDOM } = require("jsdom");
const path = require("path");
const FILE = path.join(__dirname, "..", "index.html");

const beforeParse = (win) => {
  win.matchMedia = () => ({ matches: true, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
  const store = {};
  const stubStorage = { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; }, clear: () => { for (const k in store) delete store[k]; }, key: (i) => null, length: 0 };
  try { Object.defineProperty(win, "localStorage", { value: stubStorage, configurable: true }); } catch (e) { win.localStorage = stubStorage; }
  const dummyCtx = new Proxy({}, { get: () => () => undefined, set: () => true });
  win.HTMLCanvasElement.prototype.getContext = () => dummyCtx;
  win.requestAnimationFrame = () => 0; win.cancelAnimationFrame = () => {};
};

(async () => {
  const dom = await JSDOM.fromFile(FILE, { runScripts: "dangerously", resources: "usable", pretendToBeVisual: true, beforeParse });
  const { window } = dom;
  const { document } = window;
  const click = (e) => { if (!e) return; e.dispatchEvent(new window.MouseEvent("click", { bubbles: true })); };
  const tap = (e) => { if (!e) return; e.dispatchEvent(new window.MouseEvent("pointerdown", { bubbles: true })); e.dispatchEvent(new window.MouseEvent("pointerup", { bubbles: true })); };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const errs = [];
  window.addEventListener("error", (e) => errs.push(e.message));
  await new Promise((r) => setTimeout(r, 300));

  window.SS.state.get().tutorialSeen = true;

  // --- Misión bloqueada → toast ---
  window.SS.router.go("progress");
  await sleep(30);
  const locked = [...document.querySelectorAll("#screen-progress .prog-node.locked")][0];
  if (!locked) { console.log("✗ No hay misión bloqueada en progreso"); process.exit(1); }
  click(locked);
  await sleep(20);
  const toast = [...document.querySelectorAll(".toast")].pop();
  console.log(toast && toast.textContent.includes("Bloqueado") ? "✓ Misión bloqueada muestra aviso" : "✗ Aviso de bloqueo ausente");

  // --- M1 con errores y pista ---
  window.SS.router.go("mission", { mission: "m1" });
  await sleep(30);
  const scoreBefore = window.SS.state.get().score;
  // Error: colocar "Cadena de restaurantes" (fuera) dentro del sistema
  const wrongChip = document.querySelector('#mission-host .node-chip[data-node="r6"]');
  const inZone = document.querySelector('#mission-host .drop-zone[data-zone="inside"]');
  tap(wrongChip);
  click(inZone);
  await sleep(20);
  const fbErr = document.querySelector("#mission-host .feedback.err");
  console.log(fbErr ? "✓ Error en M1 muestra feedback educativo" : "✗ Sin feedback de error en M1");
  const wrongKey = "restaurante:r6";
  const tries = window.SS.scoring.getAttempts()[wrongKey];
  console.log(tries && tries.tries === 1 ? "✓ Intento de error registrado" : "✗ Intento de error no registrado");
  // Ahora responder bien (colocar fuera)
  const outZone = document.querySelector('#mission-host .drop-zone[data-zone="outside"]');
  tap(wrongChip);
  click(outZone);
  await sleep(20);
  console.log(document.querySelector("#mission-host .feedback.ok") ? "✓ Segundo intento correcto con feedback" : "✗ Sin feedback correcto tras el error");
  // La puntuación del segundo intento debe ser menor (70) → sumar: correcto ahora vale 70
  const ptsGain = window.SS.state.get().score - scoreBefore;
  console.log(ptsGain === 70 ? "✓ Puntaje 2º intento = 70 (" + ptsGain + ")" : "⚠ Puntaje 2º intento = " + ptsGain);

  // --- Pista descuenta 20 ---
  const scorePre = window.SS.state.get().score;
  const hintsPre = window.SS.state.get().stats.hints;
  const hintBtn = [...document.querySelectorAll("#mission-host .btn")].find((b) => b.textContent.includes("Pista"));
  click(hintBtn);
  await sleep(20);
  const stAfter = window.SS.state.get();
  const hintOk = stAfter.stats.hints === hintsPre + 1 && stAfter.score === Math.max(0, scorePre - 20);
  console.log(hintOk ? "✓ Pista registrada y descuenta 20 pts" : "✗ Pista no descontó correctamente");

  // --- Precisión tras un error ---
  const prec = window.SS.scoring.precision();
  console.log(prec > 0 && prec < 100 ? "✓ Precisión refleja el error: " + prec + "%" : "⚠ Precisión = " + prec + "%");

  // --- Reinicio de progreso (modal propio, sin confirm()) ---
  window.SS.router.go("home");
  await sleep(20);
  const resetBtn = document.getElementById("btn-reset");
  click(resetBtn);
  await sleep(30);
  const modal = document.querySelector(".modal");
  console.log(modal ? "✓ Modal de reinicio propio" : "✗ Sin modal de reinicio");
  const okBtn = [...modal.querySelectorAll(".btn")].find((b) => b.textContent.includes("reiniciar"));
  click(okBtn);
  await sleep(30);
  const st = window.SS.state.get();
  console.log(st.score === 0 && st.tutorialSeen === false ? "✓ Progreso reiniciado (score 0, tutorialSeen false)" : "✗ Progreso no se reinició correctamente");

  if (errs.length) { console.log("ERRS:", errs); process.exit(1); }
  console.log("✓ Sin errores de consola en rutas de error");
  process.exit(0);
})().catch((e) => { console.log("FAIL:", e); process.exit(1); });
