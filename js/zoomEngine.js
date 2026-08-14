/* ============================================================
   SYSTEM SCOPE — Motor de zoom semántico (cámara sobre el mapa)
   ============================================================ */
window.SS = window.SS || {};

SS.zoom = (() => {
  let svg = null;
  let world = null;
  let currentId = null;
  let positions = {};
  let cam = { x: 600, y: 600, z: 1 };
  let raf = null;
  let resizeBound = false;
  let inStreak = 0, outStreak = 0;
  let cbs = { onChange: null };
  const blurEl = () => document.getElementById("exp-blur");

  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function viewport() {
    const r = svg.getBoundingClientRect();
    return { w: Math.max(r.width, 300), h: Math.max(r.height, 300) };
  }

  /* Escala que muestra el nivel completo (suprasistema, sistema,
     subsistemas y entorno visibles) en cualquier tamaño de pantalla. */
  function fitScale() {
    const { w, h } = viewport();
    return Math.max(0.22, Math.min((w - 44) / 1160, (h - 60) / 1100, 0.95));
  }

  function applyCam(x, y, z) {
    cam = { x, y, z };
    const { w, h } = viewport();
    world.setAttribute("transform", `translate(${w / 2 - x * z}, ${h / 2 - y * z}) scale(${z})`);
  }

  function animateTo(tx, ty, tz, dur, onDone) {
    cancelAnimationFrame(raf);
    if (reduced()) { raf = 0; applyCam(tx, ty, tz); if (onDone) onDone(); return; }
    const sx = cam.x, sy = cam.y, sz = cam.z;
    const t0 = performance.now();
    function step(now) {
      const k = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      applyCam(sx + (tx - sx) * e, sy + (ty - sy) * e, sz + (tz - sz) * e);
      if (k < 1) raf = requestAnimationFrame(step);
      else { raf = 0; if (onDone) onDone(); }
    }
    raf = requestAnimationFrame(step);
  }

  function renderWorld() {
    const res = SS.map.renderInto(world, currentId);
    positions = res.positions;
    svg.querySelectorAll(".node-sub, .node-super").forEach((g) => {
      g.addEventListener("click", () => {
        if (g.classList.contains("node-sub")) enter(g.dataset.nodeId);
        else exit();
      });
      g.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (g.classList.contains("node-sub")) enter(g.dataset.nodeId); else exit(); }
      });
    });
  }

  function updateStats(dir) {
    if (dir === "in") { inStreak++; outStreak = 0; }
    else { outStreak++; inStreak = 0; }
    const st = SS.state.get();
    st.explorer.deepest = Math.max(st.explorer.deepest, inStreak);
    st.explorer.highest = Math.max(st.explorer.highest, outStreak);
    st.explorer.lastNode = currentId;
  }

  function notify() {
    if (cbs.onChange) cbs.onChange(currentId);
    SS.persist();
    SS.ach.checkAll();
  }

  function open(nodeId) {
    currentId = nodeId;
    cancelAnimationFrame(raf);
    raf = 0;
    renderWorld();
    applyCam(600, 600, fitScale(), true);
    const st = SS.state.get();
    st.explorer.lastNode = nodeId;
  }

  function enter(childId) {
    const p = positions[childId];
    if (!p || childId === currentId) return;
    SS.audio.play("zoom");
    const z0 = 3.0 * (p.r / SS.map.R_SYS);
    if (blurEl()) blurEl().classList.add("on");
    animateTo(p.x, p.y, 3.0, 560, () => {
      currentId = childId;
      renderWorld();
      applyCam(600, 600, z0, true);
      updateStats("in");
      if (blurEl()) blurEl().classList.remove("on");
      animateTo(600, 600, fitScale(), 420, notify);
    });
  }

  function exit() {
    const cur = SS.data.systems.byId(currentId);
    if (!cur || !cur.parent) { SS.ui.toast({ title: "Nivel máximo", msg: "Ya estás en el nivel más externo de esta jerarquía.", type: "warn" }); return; }
    const p = positions.parent;
    if (!p) return;
    SS.audio.play("zoom");
    if (blurEl()) blurEl().classList.add("on");
    animateTo(p.x, p.y, 1.95, 560, () => {
      currentId = cur.parent;
      renderWorld();
      const z0 = 1.95 * (p.r / SS.map.R_SYS);
      applyCam(600, 600, z0, true);
      updateStats("out");
      if (blurEl()) blurEl().classList.remove("on");
      animateTo(600, 600, fitScale(), 420, notify);
    });
  }

  function setCallback(name, fn) { cbs[name] = fn; }
  function current() { return currentId; }

  function bind(svgEl) {
    if (svg === svgEl && world) return;
    if (world && world.parentNode) world.parentNode.removeChild(world);
    svg = svgEl;
    world = document.createElementNS("http://www.w3.org/2000/svg", "g");
    world.setAttribute("class", "world");
    svg.appendChild(world);
    if (!resizeBound) {
      resizeBound = true;
      window.addEventListener("resize", () => {
        if (!raf) applyCam(cam.x, cam.y, cam.z);
      });
    }
  }

  return { bind, open, enter, exit, setCallback, current };
})();
