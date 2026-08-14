/* ============================================================
   SYSTEM SCOPE — Fronteras: Configurador de Alcance y
   "Define el alcance" (asignar tarjetas a categorías).
   ============================================================ */
window.SS = window.SS || {};

SS.boundary = (() => {
  const el = SS.ui.el;
  const NS = "http://www.w3.org/2000/svg";
  const byId = (id) => SS.data.systems.byId(id);
  const KIND_COLORS = {
    physical: "#4ee6ff",
    economic: "#ffd166",
    technical: "#b388ff",
    temporal: "#7ef0a0"
  };

  function sattr(tag, attrs = {}, parent) {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    if (parent) parent.appendChild(n);
    return n;
  }

  /* =========================================================
     CONFIGURADOR DE ALCANCE
     ========================================================= */
  function configurator(container, nodeId) {
    const node = byId(nodeId);
    const layout = el("div", { class: "config-layout" });
    const mapBox = el("div", { class: "config-map" });
    const side = el("div", { class: "config-side" });

    const svg = sattr("svg", { viewBox: "0 0 340 300", class: "config-svg", role: "img", "aria-label": "Configurador de alcance" }, mapBox);

    // Base: sistema central
    const base = sattr("g", {}, svg);
    sattr("circle", { cx: 170, cy: 118, r: 64, fill: "rgba(78,230,255,.10)", stroke: "#4ee6ff", "stroke-width": 1.6 }, base);
    sattr("circle", { cx: 170, cy: 118, r: 96, fill: "none", stroke: "rgba(78,230,255,.25)", "stroke-width": 1, "stroke-dasharray": "3 6" }, base);
    sattr("text", { x: 170, y: 112, "text-anchor": "middle", "font-size": 30 }, base).textContent = node.icon;
    const nTxt = sattr("text", { x: 170, y: 146, "text-anchor": "middle", "font-size": 15, fill: "#4ee6ff", "font-weight": 700 }, base);
    nTxt.textContent = node.name;
    sattr("text", { x: 170, y: 230, "text-anchor": "middle", "font-size": 10, fill: "#93aac7", "letter-spacing": "0.2em" }, base).textContent = "SISTEMA ANALIZADO";
    (node.env || []).slice(0, 4).forEach((nm, i) => {
      const a = (i / 4) * Math.PI * 2 - Math.PI / 2;
      const x = 170 + 128 * Math.cos(a), y = 118 + 128 * Math.sin(a);
      sattr("circle", { cx: x, cy: y, r: 4, fill: "#7b93b0", opacity: 0.8 }, base);
      sattr("text", { x, y: y + 15, "text-anchor": "middle", "font-size": 8.5, fill: "#7b93b0" }, base).textContent = nm;
    });

    // --- Física: perímetro ---
    const gPhys = sattr("g", { class: "cfg-layer", hidden: "" }, svg);
    sattr("circle", { cx: 170, cy: 118, r: 120, fill: "rgba(78,230,255,.05)", stroke: "#4ee6ff", "stroke-width": 2, "stroke-dasharray": "6 8", class: "boundary-ring drawn" }, gPhys);
    sattr("circle", { cx: 170, cy: 118, r: 128, fill: "none", stroke: "#4ee6ff", "stroke-width": 0.6, opacity: 0.4 }, gPhys);
    ["N","E","S","O"].forEach((d, i) => {
      const a = (i / 4) * Math.PI * 2 - Math.PI / 2;
      const x = 170 + 124 * Math.cos(a), y = 118 + 124 * Math.sin(a);
      sattr("text", { x, y, "text-anchor": "middle", "font-size": 11, fill: "#4ee6ff" }, gPhys).textContent = "📍";
    });
    sattr("text", { x: 170, y: 274, "text-anchor": "middle", "font-size": 9.5, fill: "#4ee6ff", "letter-spacing": "0.12em" }, gPhys).textContent = "PERÍMETRO ESPACIAL · " + (node.boundaries.physical || "").toUpperCase();

    // --- Económica: medidor ---
    const gEco = sattr("g", { class: "cfg-layer", hidden: "" }, svg);
    sattr("text", { x: 170, y: 196, "text-anchor": "middle", "font-size": 11, fill: "#ffd166", "letter-spacing": "0.12em" }, gEco).textContent = "RECURSOS DISPONIBLES";
    sattr("rect", { x: 40, y: 206, width: 260, height: 18, rx: 9, fill: "rgba(255,255,255,.07)" }, gEco);
    const fillRect = sattr("rect", { x: 40, y: 206, width: 0, height: 18, rx: 9, fill: "#d4a22e", class: "eco-fill" }, gEco);
    fillRect.style.transition = "width 1s cubic-bezier(.2,.8,.2,1)";
    requestAnimationFrame(() => { fillRect.setAttribute("width", 176); });
    sattr("rect", { x: 40, y: 206, width: 260, height: 18, rx: 9, fill: "none", stroke: "#ffd166", opacity: 0.5 }, gEco);
    sattr("text", { x: 48, y: 194, "font-size": 9.5, fill: "#ffd166" }, gEco).textContent = "0";
    sattr("text", { x: 296, y: 194, "font-size": 9.5, fill: "#ffd166", "text-anchor": "end" }, gEco).textContent = "máx";
    sattr("text", { x: 170, y: 246, "text-anchor": "middle", "font-size": 9.5, fill: "#ffd166", "letter-spacing": "0.12em" }, gEco).textContent = (node.boundaries.economic || "").toUpperCase();

    // --- Técnica: habilidades ---
    const gTec = sattr("g", { class: "cfg-layer", hidden: "" }, svg);
    sattr("text", { x: 170, y: 196, "text-anchor": "middle", "font-size": 11, fill: "#b388ff", "letter-spacing": "0.12em" }, gTec).textContent = "CAPACIDADES HABILITADAS";
    const skills = ["Conocimiento especializado", "Preparación del personal", "Equipos adecuados"];
    skills.forEach((s, i) => {
      const y = 220 + i * 26;
      sattr("circle", { cx: 60, cy: y, r: 5, fill: "#b388ff" }, gTec);
      const t = sattr("text", { x: 74, y: y + 4, "font-size": 11, fill: "#b388ff" }, gTec);
      t.textContent = s;
    });
    sattr("text", { x: 170, y: 274, "text-anchor": "middle", "font-size": 9.5, fill: "#b388ff", "letter-spacing": "0.12em" }, gTec).textContent = (node.boundaries.technical || "").toUpperCase();

    // --- Temporal: línea de tiempo ---
    const gTem = sattr("g", { class: "cfg-layer", hidden: "" }, svg);
    sattr("text", { x: 170, y: 196, "text-anchor": "middle", "font-size": 11, fill: "#7ef0a0", "letter-spacing": "0.12em" }, gTem).textContent = "DURACIÓN";
    sattr("line", { x1: 40, y1: 232, x2: 300, y2: 232, stroke: "rgba(255,255,255,.12)", "stroke-width": 6, "stroke-linecap": "round" }, gTem);
    const temFill = sattr("line", { x1: 40, y1: 232, x2: 40, y2: 232, stroke: "#7ef0a0", "stroke-width": 6, "stroke-linecap": "round", class: "tem-fill" }, gTem);
    temFill.style.transition = "x2 1s cubic-bezier(.2,.8,.2,1)";
    requestAnimationFrame(() => { temFill.setAttribute("x2", 210); });
    sattr("circle", { cx: 40, cy: 232, r: 7, fill: "#7ef0a0" }, gTem);
    sattr("circle", { cx: 210, cy: 232, r: 7, fill: "#7ef0a0", opacity: 0.6 }, gTem);
    sattr("text", { x: 40, y: 216, "font-size": 9.5, fill: "#7ef0a0", "text-anchor": "middle" }, gTem).textContent = "inicio";
    sattr("text", { x: 210, y: 216, "font-size": 9.5, fill: "#7ef0a0", "text-anchor": "middle" }, gTem).textContent = "fin";
    sattr("text", { x: 170, y: 262, "text-anchor": "middle", "font-size": 9.5, fill: "#7ef0a0", "letter-spacing": "0.12em" }, gTem).textContent = (node.boundaries.temporal || "").toUpperCase();

    // Descripción dinámica
    const desc = el("div", { class: "feedback", style: { marginTop: "12px" } });
    const introDesc = el("div");
    introDesc.innerHTML = `<b style="color:#4ee6ff">Activa cada frontera</b> para ver cómo delimita el sistema de forma distinta.<br>Una frontera no siempre es una pared física.`;
    desc.appendChild(introDesc);

    const controls = el("div", { class: "config-controls" });
    const btnState = {};
    SS.data.boundaryKinds.forEach((k) => {
      const b = el("button", {
        class: "boundary-toggle",
        "aria-pressed": "false",
        style: { "--bt-color": KIND_COLORS[k.id], "--bt-bg": "color-mix(in srgb, " + KIND_COLORS[k.id] + " 10%, transparent)" }
      });
      b.appendChild(el("span", { class: "bt-ico", style: { background: `color-mix(in srgb, ${KIND_COLORS[k.id]} 16%, transparent)`, border: `1px solid ${KIND_COLORS[k.id]}` } }, k.icon));
      const info = el("div");
      info.appendChild(el("div", { class: "bt-name" }, k.label));
      info.appendChild(el("div", { class: "bt-desc" }, k.desc));
      b.appendChild(info);
      b.addEventListener("click", () => {
        const active = btnState[k.id];
        // Reset
        SS.data.boundaryKinds.forEach((kk) => {
          const bb = btnState[kk.id];
          if (bb) { bb.classList.remove("active"); bb.setAttribute("aria-pressed", "false"); }
          const g = mapBox.querySelectorAll(".cfg-layer");
          g.forEach((gg) => gg.hidden = true);
        });
        if (!active) {
          b.classList.add("active");
          b.setAttribute("aria-pressed", "true");
          const groups = svg.querySelectorAll(".cfg-layer");
          const idx = SS.data.boundaryKinds.indexOf(k);
          groups.forEach((g, i) => { g.hidden = i !== idx; });
          desc.innerHTML = "";
          desc.className = "feedback";
          desc.appendChild(el("div", { class: "fb-head" }, `Frontera ${k.label}`));
          desc.appendChild(el("div", {}, `La frontera ${k.label.toLowerCase()} se relaciona con ${k.desc}.`));
          desc.appendChild(el("div", { style: { marginTop: "6px", color: "#e6f4ff" } }, byId(nodeId).boundaries[k.id]));
          SS.audio.play("boundary");
        } else {
          desc.innerHTML = "";
          desc.appendChild(introDesc);
        }
      });
      btnState[k.id] = b;
      controls.appendChild(b);
    });

    side.appendChild(el("div", { class: "label" }, "Configurador de alcance · " + node.name));
    side.appendChild(controls);
    side.appendChild(desc);

    layout.appendChild(mapBox);
    layout.appendChild(side);
    container.appendChild(layout);
  }

  /* =========================================================
     DEFINE EL ALCANCE — asignar tarjetas a fronteras
     ========================================================= */
  function defineScope(container, scenario, onDone) {
    container.innerHTML = "";
    const zones = [...SS.data.boundaryKinds.map((k) => k.id), "out"];
    const placedCount = {};
    const total = scenario.cards.length;
    let placed = 0;
    let firstTryCount = 0;
    const perfect = { ok: true };

    const wrap = el("div", { class: "bassign-layout" });

    // Columna izquierda: contexto + tarjetas
    const left = el("div", { class: "bassign-cards-col" });
    const ctx = el("div", { class: "mission-card", style: { marginBottom: "12px" } });
    ctx.appendChild(el("div", { class: "label" }, "Escenario · " + scenario.title));
    ctx.appendChild(el("p", { style: { marginTop: "6px", color: "#e6f4ff", fontSize: "14px" } }, scenario.context));
    left.appendChild(ctx);

    const tray = el("div", { class: "bassign-cards", role: "list", "aria-label": "Tarjetas para clasificar" });
    const cardState = {};
    scenario.cards.forEach((card) => {
      const chip = el("div", { class: "node-chip", role: "button", tabindex: "0", "aria-label": "Clasificar: " + card.text });
      chip.appendChild(el("span", { class: "chip-icon" }, card.icon));
      chip.appendChild(el("span", {}, card.text));
      chip.dataset.cardId = card.id;
      const target = { zone: null, tries: 0 };
      cardState[card.id] = { chip, card, target };
      tray.appendChild(chip);

      chip.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectCard(card.id); } });
      SS.ui.makeDraggable(chip, {
        zoneClass: "drop-zone",
        onTap: () => selectCard(card.id),
        onDrop: (c, zone, evt) => { if (zone) assign(card.id, zone.dataset.zone); }
      });
    });
    left.appendChild(tray);
    wrap.appendChild(left);

    // Columna derecha: zonas
    const right = el("div", { class: "bzones-wrap" });
    const zoneBox = el("div", { class: "bzones" });
    const zoneNodes = {};
    const zoneListEls = {};
    const zoneColors = {
      physical: { c: "#4ee6ff" },
      economic: { c: "#ffd166" },
      technical: { c: "#b388ff" },
      temporal: { c: "#7ef0a0" },
      out: { c: "#6b83a3" }
    };
    const zoneMeta = [
      { id: "physical", label: "Física", icon: "📍" },
      { id: "economic", label: "Económica", icon: "💰" },
      { id: "technical", label: "Técnica", icon: "⚙️" },
      { id: "temporal", label: "Temporal", icon: "⏱️" },
      { id: "out", label: "Fuera del alcance", icon: "🚫" }
    ];
    zoneMeta.forEach((zm) => {
      const z = el("div", { class: "drop-zone bzone bzone-" + zm.id, tabindex: "0", dataset: { zone: zm.id }, role: "button", "aria-label": "Zona " + zm.label, style: { "--bt-color": zoneColors[zm.id].c, "--bt-bg": `color-mix(in srgb, ${zoneColors[zm.id].c} 9%, transparent)` } });
      const head = el("div", { class: "bz-head" });
      head.appendChild(el("span", {}, zm.icon));
      head.appendChild(el("span", {}, zm.label));
      z.appendChild(head);
      const list = el("div", { class: "bz-list" });
      z.appendChild(list);
      z.appendChild(el("div", { class: "dz-hint" }, "Pulsa para asignar la tarjeta seleccionada"));
      zoneNodes[zm.id] = z;
      zoneListEls[zm.id] = list;
      z.addEventListener("click", () => { const sel = selectedCard; if (sel) assign(sel, zm.id); });
      z.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && selectedCard) { e.preventDefault(); assign(selectedCard, zm.id); } });
      zoneBox.appendChild(z);
    });
    right.appendChild(zoneBox);
    wrap.appendChild(right);
    container.appendChild(wrap);

    let selectedCard = null;

    function selectCard(id) {
      const st = cardState[id];
      if (st.chip.classList.contains("used")) return;
      if (selectedCard) cardState[selectedCard].chip.classList.remove("selected");
      selectedCard = (selectedCard === id) ? null : id;
      if (selectedCard) cardState[selectedCard].chip.classList.add("selected");
    }

    function assign(id, zoneId) {
      const st = cardState[id];
      if (!st || st.chip.classList.contains("used")) return;
      const correct = st.card.cat === zoneId;
      const res = SS.scoring.answer(scenario.id + ":" + id, correct);
      st.target.tries += 1;
      if (st.target.tries > 1) perfect.ok = false;

      if (correct) {
        if (res.firstTry) firstTryCount++;
        st.chip.classList.add("used");
        st.chip.classList.remove("selected");
        if (selectedCard === id) selectedCard = null;
        const tag = el("span", { class: "mini-tag" }, st.card.icon + " " + st.card.text);
        zoneListEls[zoneId].appendChild(tag);
        placed++;
        const rect = st.chip.getBoundingClientRect();
        SS.ui.floatPts(container, rect.left - 30, rect.top, `+${res.pts}`);
        SS.audio.play("drop");
        SS.ui.toast({ title: "Correcto", msg: "Corresponde a la frontera " + zoneMeta.find((z) => z.id === zoneId).label.toLowerCase() + ".", type: "ok", pts: res.pts, timeout: 2600 });
        if (placed === total) {
          SS.audio.play("complete");
          SS.ui.toast({ title: "Escenario completado", msg: "Definiste el alcance de «" + scenario.title + "».", type: "ok", pts: SS.scoring.bonus(perfect.ok) });
          if (perfect.ok) { /* logro sin error detectado en M3 */ }
          SS.ach.checkAll();
          if (onDone) onDone(firstTryCount, perfect.ok);
        }
      } else {
        SS.ui.toast({ title: "Todavía no", msg: feedbackFor(st.card, zoneId, zoneMeta), type: "err", pts: 0, timeout: 3600 });
        st.chip.style.animation = "shake .35s ease";
        setTimeout(() => (st.chip.style.animation = ""), 380);
      }
      SS.ui.updateHUD();
      SS.persist();
    }

    function feedbackFor(card, zoneId, zm) {
      const zname = zoneMeta.find((z) => z.id === zoneId).label.toLowerCase();
      const correctZone = SS.data.boundaryKinds.find((k) => k.id === card.cat);
      if (card.cat === "out") return "Este elemento está fuera del alcance definido; no limita ninguna de las cuatro fronteras. No encaja en la frontera " + zname + ".";
      return `Una frontera ${correctZone.label.toLowerCase()} se relaciona con ${correctZone.desc}. Este elemento corresponde a esa frontera, no a la ${zname}.`;
    }
  }

  return { configurator, defineScope, KIND_COLORS };
})();
