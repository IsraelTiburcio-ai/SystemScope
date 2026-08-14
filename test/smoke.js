/* Smoke test: carga System Scope en jsdom y juega la experiencia completa. */
const { JSDOM } = require("jsdom");
const path = require("path");
const FILE = path.join(__dirname, "..", "index.html");

const beforeParse = (win) => {
  // matchMedia: reduced-motion=true para animaciones síncronas
  win.matchMedia = () => ({ matches: true, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
  // localStorage stub (jsdom con file:// no habilita storage)
  const store = {};
  const stubStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { for (const k in store) delete store[k]; },
    key: (i) => Object.keys(store)[i] || null,
    get length() { return Object.keys(store).length; }
  };
  try { Object.defineProperty(win, "localStorage", { value: stubStorage, configurable: true }); } catch (e) { win.localStorage = stubStorage; }
  // canvas 2d stub
  const dummyCtx = new Proxy({}, { get: (t, p) => (typeof p === "string" ? (...a) => undefined : undefined), set: () => true });
  win.HTMLCanvasElement.prototype.getContext = () => dummyCtx;
  win.requestAnimationFrame = (cb) => { return 0; };
  win.cancelAnimationFrame = () => {};
};

(async () => {
  const dom = await JSDOM.fromFile(FILE, {
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true,
    beforeParse
  });
  const { window } = dom;
  const { document } = window;
  const errs = [];
  window.addEventListener("error", (e) => errs.push("window.onerror: " + e.message));
  const $ = (sel) => document.querySelector(sel);

  const click = (el2) => { if (!el2) return; el2.dispatchEvent(new window.MouseEvent("click", { bubbles: true })); };
  const tap = (el2) => { if (!el2) return; el2.dispatchEvent(new window.MouseEvent("pointerdown", { bubbles: true })); el2.dispatchEvent(new window.MouseEvent("pointerup", { bubbles: true })); };
  const btn = (sel) => click($(sel));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // esperar carga
  await new Promise((r) => setTimeout(r, 300));
  if (!window.SS || !window.SS.app) { console.log("FAIL: SS.app no cargó"); console.log(errs); process.exit(1); }
  console.log("✓ Boot: app cargada, screen =", window.SS.router.currentScreen());

  // ---- Integridad del grafo ----
  const sys = window.SS.data.systems;
  const ids = new Set(sys.nodes.map((n) => n.id));
  let graphOk = true;
  for (const n of sys.nodes) {
    if (n.parent && !ids.has(n.parent)) { console.log("FAIL: parent no existe", n.id, n.parent); graphOk = false; }
    for (const c of n.children) if (!ids.has(c)) { console.log("FAIL: child no existe", n.id, c); graphOk = false; }
  }
  console.log(graphOk ? "✓ Grafo de sistemas íntegro" : "✗ Grafo con errores");

  // ---- Tutorial ----
  btn("#btn-start");
  await sleep(50);
  console.log("✓ Inicio → intro:", window.SS.router.currentScreen());
  btn("#btn-intro-start");
  await sleep(50);
  console.log("✓ Intro → explorador (tutorial):", window.SS.router.currentScreen());
  if (!window.SS.zoom.current()) { console.log("FAIL: zoom sin sistema actual"); process.exit(1); }
  console.log("✓ Nivel inicial:", window.SS.zoom.current());

  // paso 1 (explicación) → continuar
  btn("#exp-coach .coach-actions .btn");
  // paso: entrar en facultad
  window.SS.zoom.enter("facultad");
  await sleep(30);
  console.log("✓ Tutorial: nivel tras entrar =", window.SS.zoom.current());
  // paso: salir
  window.SS.zoom.exit();
  await sleep(30);
  console.log("✓ Tutorial: nivel tras salir =", window.SS.zoom.current());
  // terminar tutorial
  btn("#exp-coach .coach-actions .btn"); // entorno
  btn("#exp-coach .coach-actions .btn"); // fronteras → terminar
  await sleep(50);
  console.log("✓ Tras tutorial:", window.SS.router.currentScreen(), "| tutorialSeen =", window.SS.state.get().tutorialSeen);

  // ---- M1 ----
  window.SS.router.go("mission", { mission: "m1" });
  await sleep(30);
  const m1 = window.SS.data.mission1;
  let m1done = false;
  for (const c of m1.cases) {
    for (const n of c.nodes) {
      const chip = document.querySelector('#mission-host .node-chip[data-node="' + n.id + '"]');
      if (!chip) { console.log("FAIL: chip no encontrado", n.id); process.exit(1); }
      const zone = document.querySelector('#mission-host .drop-zone[data-zone="' + (n.kind === "inside" ? "inside" : "outside") + '"]');
      tap(chip);
      click(zone);
      await sleep(5);
    }
    // siguiente caso
    const next = document.querySelector("#mission-host .btn-primary");
    if (next) { click(next); await sleep(10); }
  }
  m1done = window.SS.state.get().missions.m1.status === "done";
  console.log(m1done ? "✓ M1 completada (perfecta)" : "✗ M1 no completada", "| percent:", window.SS.state.get().missions.m1.percent);

  // ---- M2 ----
  window.SS.router.go("mission", { mission: "m2" });
  await sleep(30);
  for (const c of window.SS.data.mission2.cases) {
    const opt = c.options.find((o) => o.correct);
    const cards = document.querySelectorAll("#mission-host .m2-option");
    const card = [...cards].find((el2) => el2.textContent.includes(opt.label));
    click(card);
    await sleep(10);
    const next = document.querySelector("#mission-host .btn-primary");
    if (next) { click(next); await sleep(10); }
  }
  console.log(window.SS.state.get().missions.m2.status === "done" ? "✓ M2 completada" : "✗ M2 falló");

  // ---- REF (práctica de referencia) ----
  window.SS.router.go("explorer", { mode: "ref" });
  await sleep(30);
  btn("#exp-coach .coach-actions .btn");
  window.SS.zoom.enter("facultad");
  await sleep(20);
  btn("#exp-coach .coach-actions .btn");
  window.SS.zoom.enter("departamento");
  await sleep(20);
  btn("#exp-coach .coach-actions .btn"); // terminar
  await sleep(50);
  console.log(window.SS.state.get().missions.ref.status === "done" ? "✓ REF completada" : "✗ REF falló");

  // ---- M3 ----
  window.SS.router.go("mission", { mission: "m3" });
  await sleep(30);
  // parte A: configurador
  btn("#mission-host .btn-primary"); // Continuar: define el alcance
  await sleep(20);
  for (const sc of window.SS.data.defineScope) {
    for (const card of sc.cards) {
      const chip = document.querySelector('#mission-host .node-chip[data-card-id="' + card.id + '"]');
      const zone = document.querySelector('#mission-host .drop-zone[data-zone="' + card.cat + '"]');
      tap(chip);
      click(zone);
      await sleep(5);
    }
    // se vuelve a dibujar el siguiente escenario automáticamente
    await sleep(20);
  }
  await sleep(50);
  console.log(window.SS.state.get().missions.m3.status === "done" ? "✓ M3 completada" : "✗ M3 no completada", "| percent:", window.SS.state.get().missions.m3.percent);

  // ---- M4 ----
  window.SS.router.go("mission", { mission: "m4" });
  await sleep(30);
  for (const ev of window.SS.data.boundaryEvents) {
    const opts = [...document.querySelectorAll("#mission-host .event-option")];
    const correctBtn = opts.find((b) => b.textContent.includes(ev.answer === "physical" ? "Física" : ev.answer === "economic" ? "Económica" : ev.answer === "technical" ? "Técnica" : "Temporal"));
    click(correctBtn);
    await sleep(10);
    const next = document.querySelector("#mission-host .btn-primary");
    if (next) { click(next); await sleep(10); }
  }
  console.log(window.SS.state.get().missions.m4.status === "done" ? "✓ M4 completada" : "✗ M4 falló", "| percent:", window.SS.state.get().missions.m4.percent);

  // ---- MISIÓN FINAL ----
  window.SS.router.go("final");
  await sleep(30);
  const fc = window.SS.data.finalChallenge;
  // etapa 1
  let opt = fc.stages[0].options.find((o) => o.correct);
  click([...document.querySelectorAll("#final-host .m2-option")].find((x) => x.textContent.includes(opt.label)));
  await sleep(10);
  click([...document.querySelectorAll("#final-host .btn-primary")].filter((b)=>!b.hidden).pop());
  await sleep(10);
  // etapa 2
  fc.stages[1].options.filter((o) => o.correct).forEach((o) => {
    click([...document.querySelectorAll("#final-host .node-chip")].find((x) => x.textContent.includes(o.label)));
  });
  click([...document.querySelectorAll("#final-host .btn-primary")].find((x) => x.textContent.includes("Confirmar")));
  await sleep(10);
  click([...document.querySelectorAll("#final-host .btn-primary")].filter((b)=>!b.hidden).pop());
  await sleep(10);
  // etapa 3
  opt = fc.stages[2].options.find((o) => o.correct);
  click([...document.querySelectorAll("#final-host .m2-option")].find((x) => x.textContent.includes(opt.label)));
  await sleep(10);
  click([...document.querySelectorAll("#final-host .btn-primary")].filter((b)=>!b.hidden).pop());
  await sleep(10);
  // etapa 4
  for (const e of fc.stages[3].elements) {
    const chip = [...document.querySelectorAll("#final-host .node-chip")].find((x) => x.dataset.node === e.id);
    const zone = document.querySelector('#final-host .drop-zone[data-zone="' + (e.inside ? "inside" : "outside") + '"]');
    tap(chip);
    click(zone);
    await sleep(5);
  }
  click([...document.querySelectorAll("#final-host .btn-primary")].filter((b)=>!b.hidden).pop());
  await sleep(10);
  // etapa 5
  // física
  const phys = fc.stages[4].controls[0].options.find((o) => o.correct);
  click([...document.querySelectorAll("#final-host .m2-option")].find((x) => x.textContent.includes(phys.label)));
  await sleep(10);
  // económica
  const econRect = document.querySelector('#final-host rect[data-seg="e2"]');
  econRect.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await sleep(10);
  // técnica
  fc.stages[4].controls[2].skills.filter((s) => s.correct).forEach((s) => {
    click([...document.querySelectorAll("#final-host .skill-pill")].find((x) => x.textContent.includes(s.label)));
  });
  click([...document.querySelectorAll("#final-host .btn-primary")].find((x) => x.textContent.includes("técnica")));
  await sleep(10);
  // temporal
  const track = document.querySelector("#final-host .timeline-track");
  const fakeRect = { left: 0, top: 0, width: 460, height: 18, right: 460, bottom: 18 };
  track.getBoundingClientRect = () => fakeRect;
  track.dispatchEvent(new window.MouseEvent("click", { bubbles: true, clientX: (8 / 23) * 460 }));
  await sleep(5);
  click([...document.querySelectorAll("#final-host .btn")].find((x) => x.textContent.includes("inicio")));
  track.dispatchEvent(new window.MouseEvent("click", { bubbles: true, clientX: (18 / 23) * 460 }));
  await sleep(5);
  click([...document.querySelectorAll("#final-host .btn-primary")].find((x) => x.textContent.includes("temporal")));
  await sleep(50);
  console.log(window.SS.state.get().missions.m5.status === "done" ? "✓ MISIÓN FINAL completada" : "✗ MISIÓN FINAL no completada", "| percent:", window.SS.state.get().missions.m5.percent);

  // ir a resultados
  click([...document.querySelectorAll("#final-host .btn-primary")].find((x) => x.textContent.includes("mapa del sistema")));
  await sleep(50);
  console.log("✓ Pantalla de resultados:", window.SS.router.currentScreen());
  if (window.SS.router.currentScreen() === "results") {
    console.log("✓ Mapa del sistema presente:", !!document.querySelector(".final-map-wrap"));
  }

  // ---- Logros ----
  console.log("✓ Logros desbloqueados:", window.SS.ach.unlockedCount(), "/", window.SS.ach.defs.length);
  console.log("✓ Puntos:", window.SS.state.get().score, "| Precisión:", window.SS.scoring.precision() + "%");

  // ---- Persistencia ----
  let saved = null;
  try { saved = window.localStorage.getItem("systemscope_v1"); } catch (e) { /* noop */ }
  console.log(saved ? "✓ Progreso guardado en localStorage" : "✗ No se guardó progreso");

  // ---- Puntaje en misiones ----
  const st = window.SS.state.get();
  for (const id of window.SS.state.MISSION_IDS) {
    console.log("  misión", id, "→", st.missions[id].status, st.missions[id].percent + "%");
  }

  if (errs.length) { console.log("ERRS:", errs); process.exit(1); }
  console.log(errs.length ? "✗ Errores de consola detectados" : "✓ Sin errores de consola");
  process.exit(0);
})().catch((e) => { console.log("FAIL:", e); process.exit(1); });
