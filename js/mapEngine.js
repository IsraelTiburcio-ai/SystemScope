/* ============================================================
   SYSTEM SCOPE — Motor de mapa (SVG)
   Dibuja el nivel de un sistema: suprasistema, sistema actual,
   subsistemas y entorno, en coordenadas de mundo 1200×1200.
   ============================================================ */
window.SS = window.SS || {};

SS.map = (() => {
  const CX = 600, CY = 600;
  const R_SYS = 170, R_RING = 250, R_SUB_ORBIT = 198, R_ENV = 455;
  const R_PARENT = 88, R_CHILD = 44, R_ENVDOT = 24;

  const NS = "http://www.w3.org/2000/svg";
  const byId = (id) => SS.data.systems.byId(id);

  function el(tag, attrs = {}, parent) {
    const node = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    if (parent) parent.appendChild(node);
    return node;
  }

  function posOnCircle(angleDeg, radius) {
    const a = (angleDeg * Math.PI) / 180;
    return { x: CX + radius * Math.cos(a), y: CY + radius * Math.sin(a) };
  }

  /* Calcula las posiciones de todos los elementos del nivel. */
  function layout(node) {
    const pos = { current: { x: CX, y: CY, r: R_SYS } };
    const parent = node.parent ? byId(node.parent) : null;
    const children = node.children.map(byId).filter(Boolean);

    if (parent) {
      pos.parent = { x: CX, y: CY - R_SYS - R_PARENT - 52, r: R_PARENT };
    }

    // Subsistemas en un arco inferior (lejos del suprasistema, que está arriba)
    const n = children.length;
    children.forEach((c, i) => {
      let angle;
      if (n === 1) angle = 90; // abajo, en el extremo opuesto al suprasistema
      else if (n <= 3) angle = 220 + (i * (100 / (n - 1)));
      else angle = 235 + (i * (110 / n));
      const p = posOnCircle(angle, R_SUB_ORBIT);
      pos[c.id] = { x: p.x, y: p.y, r: R_CHILD, child: true };
    });

    // Entorno en el anillo exterior (se evita la zona del suprasistema, arriba al centro)
    const envItems = (node.env || []).slice(0, 6);
    const envAngles = [160, 200, 240, 320, 40, 80];
    envItems.forEach((name, i) => {
      const angle = envAngles[i] || (i * 47 + 20);
      const p = posOnCircle(angle, R_ENV);
      pos["env-" + i] = { x: p.x, y: p.y, r: R_ENVDOT, env: true, label: name };
    });

    return { pos, parent, children, envItems };
  }

  function nodeG(cx, cy, r, fill, stroke, opts = {}) {
    const g = el("g", { transform: `translate(${cx},${cy})`, class: "map-node" });
    if (opts.pulse) g.setAttribute("class", "map-node pulse");
    el("circle", { cx: 0, cy: 0, r, fill, stroke, "stroke-width": 1.6, class: "node-body" }, g);
    if (opts.emoji) {
      el("text", { class: "node-emoji", x: 0, y: -r * 0.55, "font-size": r * 0.42 }, g).textContent = opts.emoji;
    }
    if (opts.label) {
      const t = el("text", { class: opts.labelClass || "node-label", x: 0, y: r + 18 }, g);
      t.textContent = opts.label;
    }
    if (opts.title) {
      el("title", {}, g).textContent = opts.title;
    }
    return g;
  }

  /* Renderiza el nivel de `nodeId` dentro de `container` (g). */
  function renderInto(container, nodeId) {
    while (container.firstChild) container.removeChild(container.firstChild);
    const { pos, parent, children, envItems } = layout(byId(nodeId));
    const node = byId(nodeId);

    // Contención del suprasistema (arco violeta tenue)
    if (parent) {
      el("circle", { cx: CX, cy: CY - 60, r: 560, fill: "none", stroke: "rgba(139,92,246,.12)", "stroke-width": 1.5, "stroke-dasharray": "2 8", class: "sub-orbit" }, container);
      el("text", { class: "map-bigsub", x: CX, y: 34 }, container).textContent = "Suprasistema · " + parent.name;
    }

    // Nodo del suprasistema (clic para salir)
    if (parent) {
      const pg = nodeG(pos.parent.x, pos.parent.y, R_PARENT, "rgba(139,92,246,.16)", "#8b5cf6", { emoji: parent.icon, label: parent.name });
      pg.dataset.nodeId = parent.id;
      pg.classList.add("node-super");
      el("title", {}, pg).textContent = "Salir hacia: " + parent.name;
      container.appendChild(pg);
    }

    // Líneas de conexión
    if (parent) {
      el("line", { x1: CX, y1: CY - R_SYS + 6, x2: pos.parent.x, y2: pos.parent.y + R_PARENT - 4, class: "map-link map-link-parent" }, container);
    }
    children.forEach((c) => {
      const p = pos[c.id];
      if (p) el("line", { x1: CX + (p.x - CX) * 0.18, y1: CY + (p.y - CY) * 0.18, x2: p.x - (p.x - CX) * 0.14, y2: p.y - (p.y - CY) * 0.14, class: "map-link" }, container);
    });

    // Frontera del sistema actual
    el("circle", { cx: CX, cy: CY, r: R_RING, class: "sys-ring-glow" }, container);
    el("circle", { cx: CX, cy: CY, r: R_RING, class: "sys-ring" }, container);
    el("text", { class: "map-bigsub", x: CX, y: CY - R_RING - 10 }, container).textContent = "Frontera del sistema";

    // Sistema actual
    const curG = nodeG(CX, CY, R_SYS, "rgba(78,230,255,.14)", "#4ee6ff", { emoji: node.icon, pulse: true });
    el("text", { class: "map-bigname", x: CX, y: CY - 6, "font-size": 26 }, curG).textContent = node.name;
    el("text", { class: "map-bigsub", x: CX, y: CY + 24 }, curG).textContent = "Sistema actual";
    container.appendChild(curG);

    // Subsistemas
    children.forEach((c) => {
      const p = pos[c.id];
      const g = nodeG(p.x, p.y, R_CHILD, "rgba(45,212,191,.16)", "#2dd4bf", { emoji: c.icon, label: c.name, labelClass: "node-label sub" });
      g.dataset.nodeId = c.id;
      g.classList.add("node-sub");
      container.appendChild(g);
    });

    // Entorno
    envItems.forEach((name, i) => {
      const p = pos["env-" + i];
      const g = nodeG(p.x, p.y, R_ENVDOT, "rgba(123,147,176,.22)", "rgba(123,147,176,.7)", {});
      g.classList.add("node-env");
      const t = el("text", { class: "map-bigsub", x: 0, y: R_ENVDOT + 16, "font-size": 11 }, g);
      t.textContent = name;
      g.dataset.envName = name;
      container.appendChild(g);
    });

    return { positions: pos, node, parent, children };
  }

  return { renderInto, layout, R_SYS, R_CHILD, R_PARENT };
})();
