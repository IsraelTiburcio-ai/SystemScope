/* ============================================================
   SYSTEM SCOPE — App: arranque, inicio, tutorial, observatorio,
   mapa de progreso, logros, fondo animado.
   ============================================================ */
window.SS = window.SS || {};

SS.persist = () => { try { SS.storage.save(SS.state.get()); } catch (e) { /* noop */ } };

SS.app = (() => {
  const el = SS.ui.el;
  const byId = (id) => SS.data.systems.byId(id);
  const KIND_LABELS = { physical: "Física", economic: "Económica", technical: "Técnica", temporal: "Temporal" };

  let tutorialMode = false;
  let refMode = false;
  let tutorStep = 0;
  let refStep = 0;

  /* ================= ARRANQUE ================= */
  function boot() {
    SS.ui.mountIcons();
    loadState();
    bindHome();
    bindHud();
    initBackground();
    registerRouter();
    SS.router.go("home");
  }

  function loadState() {
    const saved = SS.storage.load();
    if (!saved) { SS.state.reset(); return; }
    const d = SS.state.defaults();
    const st = SS.state.get();
    Object.assign(st, saved);
    st.missions = Object.fromEntries(SS.state.MISSION_IDS.map((id) => [id, Object.assign(d.missions[id], saved.missions && saved.missions[id])]));
    st.achievements = Object.assign({}, d.achievements, saved.achievements);
    st.stats = Object.assign({}, d.stats, saved.stats);
    st.explorer = Object.assign({}, d.explorer, saved.explorer);
    SS.audio.setEnabled(st.sound);
    SS.state.openIfReady();
  }

  /* ================= INICIO ================= */
  function bindHome() {
    document.getElementById("btn-start").addEventListener("click", () => {
      SS.audio.unlock();
      const st = SS.state.get();
      if (!st.tutorialSeen) SS.router.go("intro");
      else SS.router.go("progress");
    });
    document.getElementById("btn-continue").addEventListener("click", () => SS.router.go("progress"));
    document.getElementById("btn-instructions").addEventListener("click", showInstructions);
    document.getElementById("btn-reset").addEventListener("click", resetProgress);
    document.getElementById("btn-sound-home").addEventListener("click", toggleSound);
    document.getElementById("btn-credits").addEventListener("click", showCredits);
  }

  function refreshContinue() {
    const st = SS.state.get();
    const hasProgress = SS.state.MISSION_IDS.some((id) => st.missions[id].percent > 0 || st.missions[id].status === "done");
    document.getElementById("btn-continue").hidden = !hasProgress;
  }

  function toggleSound() {
    const st = SS.state.get();
    st.sound = !st.sound;
    SS.audio.setEnabled(st.sound);
    SS.persist();
    SS.ui.refreshSoundButtons();
    if (st.sound) SS.audio.play("select");
  }

  function resetProgress() {
    SS.ui.confirm({
      title: "Reiniciar exploración",
      text: "Se borrará todo el progreso: puntuación, misiones, logros y estadísticas. Esta acción no se puede deshacer.",
      okLabel: "Sí, reiniciar",
      danger: true,
      onOk: () => {
        SS.storage.clear();
        SS.state.reset();
        SS.ui.updateHUD();
        SS.ui.toast({ title: "Progreso reiniciado", msg: "Comienza una nueva exploración desde el inicio.", type: "ok" });
        SS.router.go("home");
      }
    });
  }

  function showInstructions() {
    const rows = [
      ["Zoom dentro", "Entra a un sistema pulsando sus subsistemas."],
      ["Zoom fuera", "Sal hacia el suprasistema pulsando el nodo violeta."],
      ["Observatorio", "Explora libremente todos los niveles de análisis."],
      ["Misiones", "Completa las misiones en el mapa de progreso."],
      ["Fronteras", "Las cuatro fronteras delimitan el alcance: física, económica, técnica y temporal."],
      ["Pistas", "Usa la pista cuando te atores; cuesta 20 puntos."]
    ];
    const body = rows.map(([t, d]) => {
      const p = el("p", { style: { margin: "8px 0" } });
      p.appendChild(el("b", { style: { color: "#4ee6ff" } }, t + ": "));
      p.appendChild(document.createTextNode(d));
      return p;
    });
    SS.ui.modal({ title: "Instrucciones", bodyNodes: body, actions: [{ label: "Entendido", class: "btn btn-primary" }] });
  }

  function showCredits() {
    const body = [
      el("p", {}, "<b>System Scope</b> — Explorador de Sistemas y Fronteras."),
      el("p", {}, "Actividad / Juego 3 de la colección de herramientas digitales de <b>Optimización I</b>."),
      el("p", {}, "Unidad: Gimnasio 1 — Introducción a la Teoría de Sistemas. Terminología académica conservada del material del curso."),
      el("p", {}, "Experiencia de aprendizaje original. Sin assets ni marcas externas. Hecho con HTML5, CSS3 y JavaScript puro.")
    ];
    SS.ui.modal({ title: "Créditos", bodyNodes: body, actions: [{ label: "Cerrar", class: "btn btn-primary" }] });
  }

  /* ================= HUD ================= */
  function bindHud() {
    document.getElementById("hud-logo").addEventListener("click", () => SS.router.go("home"));
    document.getElementById("hud-home").addEventListener("click", () => SS.router.go("home"));
    document.getElementById("hud-sound").addEventListener("click", toggleSound);
    document.getElementById("hud-observatory").addEventListener("click", () => { cancelModes(); SS.router.go("explorer"); });
    document.getElementById("hud-progress").addEventListener("click", () => SS.router.go("progress"));
    document.getElementById("hud-achievements").addEventListener("click", () => SS.router.go("achievements"));
    document.getElementById("hud-tutorial").addEventListener("click", startTutorial);
  }

  function registerRouter() {
    SS.router.on("home", refreshContinue);
    SS.router.on("intro", initIntro);
    SS.router.on("progress", renderProgress);
    SS.router.on("explorer", initExplorer);
    SS.router.on("mission", (o) => {
      SS.scoring.resetMission();
      const fn = o.mission === "m1" ? SS.missions.renderM1 : o.mission === "m2" ? SS.missions.renderM2 : o.mission === "m3" ? SS.missions.renderM3 : SS.missions.renderM4;
      fn();
    });
    SS.router.on("final", () => { SS.scoring.resetMission(); SS.missions.renderFinal(); });
    SS.router.on("results", SS.missions.renderResults);
    SS.router.on("achievements", renderAchievements);
  }

  function initIntro() {
    document.getElementById("btn-intro-start").addEventListener("click", startTutorial);
    document.getElementById("btn-intro-skip").addEventListener("click", () => {
      const st = SS.state.get();
      st.tutorialSeen = true;
      SS.persist();
      SS.router.go("progress");
    });
  }

  function startTutorial() {
    tutorialMode = true;
    refMode = false;
    tutorStep = 0;
    SS.router.go("explorer", { mode: "tutorial" });
  }

  function cancelModes() {
    tutorialMode = false;
    refMode = false;
    hideCoach();
  }

  /* ================= EXPLORADOR ================= */
  let explorerBound = false;
  function initExplorer(opts = {}) {
    const svg = document.getElementById("exp-svg");
    SS.zoom.bind(svg);
    SS.zoom.setCallback("onChange", onExplorerChange);

    if (!explorerBound) {
      explorerBound = true;
      document.getElementById("exp-home").addEventListener("click", () => { cancelModes(); SS.router.go("progress"); });
      document.getElementById("exp-ref").addEventListener("click", () => {
        tutorialMode = false; refMode = true; refStep = 0;
        SS.zoom.open("universidad");
        onExplorerChange("universidad");
        SS.ui.toast({ title: "Guía activada", msg: "Observa cómo cambian los roles al cambiar el punto de referencia.", type: "ok" });
      });
      document.getElementById("exp-out").addEventListener("click", () => SS.zoom.exit());
      document.getElementById("exp-home2").addEventListener("click", () => {
        SS.zoom.open("universidad");
        onExplorerChange("universidad");
        SS.ui.toast({ title: "Nivel inicial", msg: "Regresaste a Universidad.", type: "ok" });
      });
    }

    const mode = (opts && opts.mode) || "normal";
    if (mode === "tutorial") { tutorialMode = true; refMode = false; tutorStep = 0; }
    else if (mode === "ref") { refMode = true; tutorialMode = false; refStep = 0; }
    else cancelModes();

    const st = SS.state.get();
    let start = "universidad";
    if (!tutorialMode && !refMode && st.explorer.lastNode && byId(st.explorer.lastNode)) start = st.explorer.lastNode;
    SS.zoom.open(start);
    onExplorerChange(start);
  }

  function onExplorerChange(nodeId) {
    updateExplorerInfo(nodeId);
    if (tutorialMode) advanceTutorial(nodeId);
    else if (refMode) advanceRef(nodeId);
  }

  function ancestors(id) {
    const chain = [];
    const cur = byId(id);
    chain.unshift(cur.id);
    let p = cur.parent ? byId(cur.parent) : null;
    while (p) { chain.unshift(p.id); p = p.parent ? byId(p.parent) : null; }
    return chain;
  }

  function updateExplorerInfo(nodeId) {
    const node = byId(nodeId);
    const info = document.getElementById("exp-info");
    info.innerHTML = "";
    info.appendChild(el("div", { class: "ei-tag" }, "Sistema actual"));
    info.appendChild(el("div", { class: "ei-name" }, node.icon + " " + node.name));
    info.appendChild(el("p", { class: "ei-blurb" }, node.blurb));

    if (node.parent) {
      const p = byId(node.parent);
      const row = el("div", { class: "ei-row" });
      row.appendChild(el("div", { class: "ei-row-head" }, "Suprasistema inmediato"));
      const chips = el("div", { class: "ei-chips" });
      const chip = el("button", { class: "ei-chip super", "aria-label": "Salir hacia " + p.name }, p.icon + " " + p.name);
      chip.addEventListener("click", () => SS.zoom.exit());
      chips.appendChild(chip);
      row.appendChild(chips);
      info.appendChild(row);
    }
    if (node.children.length) {
      const row = el("div", { class: "ei-row" });
      row.appendChild(el("div", { class: "ei-row-head" }, "Posibles subsistemas"));
      const chips = el("div", { class: "ei-chips" });
      node.children.forEach((cid) => {
        const c = byId(cid);
        const chip = el("button", { class: "ei-chip sub", "aria-label": "Entrar a " + c.name }, c.icon + " " + c.name);
        chip.addEventListener("click", () => SS.zoom.enter(cid));
        chips.appendChild(chip);
      });
      row.appendChild(chips);
      info.appendChild(row);
    }
    if (node.env.length) {
      const row = el("div", { class: "ei-row" });
      row.appendChild(el("div", { class: "ei-row-head" }, "Entorno"));
      const chips = el("div", { class: "ei-chips" });
      node.env.forEach((nm) => chips.appendChild(el("span", { class: "ei-chip env" }, nm)));
      row.appendChild(chips);
      info.appendChild(row);
    }
    const b = el("div", { class: "ei-row" });
    b.appendChild(el("div", { class: "ei-row-head" }, "Fronteras"));
    ["physical", "economic", "technical", "temporal"].forEach((k) => {
      b.appendChild(el("div", { class: "ei-bound " + k }, [el("b", {}, KIND_LABELS[k] + ": "), node.boundaries[k]]));
    });
    info.appendChild(b);
    const acts = el("div", { class: "ei-actions" });
    if (node.parent) {
      const goUp = el("button", { class: "btn btn-ghost btn-sm" }, "⬆ Salir hacia " + byId(node.parent).name);
      goUp.addEventListener("click", () => SS.zoom.exit());
      acts.appendChild(goUp);
    }
    info.appendChild(acts);

    // Botón flotante "salir": habilitado solo si existe suprasistema
    const outBtn = document.getElementById("exp-out");
    if (outBtn) outBtn.disabled = !node.parent;

    // Ruta
    const path = document.getElementById("exp-path");
    path.innerHTML = "";
    const chain = ancestors(node.id);
    chain.forEach((id, i) => {
      if (i > 0) path.appendChild(el("span", { class: "crumb-sep" }, "›"));
      const n = byId(id);
      const c = el("button", { class: "crumb" + (id === node.id ? " now" : "") }, n.name);
      if (id !== node.id) { c.addEventListener("click", () => SS.zoom.open(id)); }
      path.appendChild(c);
    });
  }

  /* ---------- Coach de tutorial / referencia ---------- */
  function showCoach(icon, text, buttons) {
    const c = document.getElementById("exp-coach");
    c.hidden = false;
    c.innerHTML = "";
    c.appendChild(el("div", { class: "coach-icon" }, icon));
    const mid = el("div");
    const t = el("div", { class: "coach-text" }, text);
    mid.appendChild(t);
    const acts = el("div", { class: "coach-actions" });
    buttons.forEach((b) => {
      const btn = el("button", { class: b.class || "btn btn-primary btn-sm" }, b.label);
      if (b.onClick) btn.addEventListener("click", b.onClick);
      acts.appendChild(btn);
    });
    mid.appendChild(acts);
    c.appendChild(mid);
  }

  function hideCoach() {
    const c = document.getElementById("exp-coach");
    if (c) c.hidden = true;
    clearTarget();
  }

  function clearTarget() {
    document.querySelectorAll("#exp-svg .tutor-target").forEach((g) => g.classList.remove("tutor-target"));
  }

  function highlightTarget(nodeId) {
    clearTarget();
    if (!nodeId) return;
    const g = document.querySelector('#exp-svg .node-sub[data-node-id="' + nodeId + '"]');
    if (g) g.classList.add("tutor-target");
  }

  function finishTutorial() {
    const st = SS.state.get();
    st.tutorialSeen = true;
    SS.state.openIfReady();
    SS.persist();
    tutorialMode = false;
    hideCoach();
    SS.ui.toast({ title: "Tutorial completado", msg: "La misión 01 ya está disponible en el mapa de progreso.", type: "ok" });
    SS.router.go("progress");
  }

  function advanceTutorial(nodeId) {
    switch (tutorStep) {
      case 0:
        showCoach("🧭", "Este es el SISTEMA ACTUAL: Universidad. Todo lo que aparece dentro de la frontera punteada forma parte de este sistema.", [
          { label: "Continuar", onClick: () => { tutorStep = 1; highlightTarget("facultad"); showCoach("🔍", "Los nodos interiores son SUBSISTEMAS: partes del todo con procesos propios. Entra en «Facultad de Ingeniería» pulsándola.", [{ label: "Continuar", onClick: () => showCoach("👆", "Pulsa el nodo turquesa «Facultad de Ingeniería» para entrar.", [{ label: "Continuar", onClick: () => highlightTarget("facultad") }]) }]); } }
        ]);
        break;
      case 1:
        if (nodeId === "facultad") {
          tutorStep = 2;
          showCoach("🔭", "El nodo violeta superior es el SUPRASISTEMA: la Universidad, que contiene a la Facultad. Púlsalo para salir hacia afuera.", [{ label: "Continuar", onClick: () => { tutorStep = 2; } }]);
        }
        break;
      case 2:
        if (nodeId === "universidad") {
          tutorStep = 3;
          showCoach("🌫️", "Fuera de la frontera está el ENTORNO: los puntos grises que rodean al sistema. Interactúan con él sin ser parte de él.", [
            { label: "Continuar", onClick: () => { tutorStep = 4; showCoach("🧩", "La FRONTERA delimita hasta dónde llega el sistema: puede ser física, económica, técnica o temporal. Lo verás en acción en las misiones.", [{ label: "Terminar tutorial", class: "btn btn-primary", onClick: finishTutorial }]); } }
          ]);
        }
        break;
    }
  }

  function completeRef() {
    const st = SS.state.get();
    st.missions.ref.status = "done";
    st.missions.ref.percent = 100;
    SS.scoring.bonus(true);
    SS.state.openIfReady();
    SS.persist();
    SS.ach.checkAll();
    refMode = false;
    hideCoach();
    SS.ui.toast({ title: "Práctica completada", msg: "La misión «Estableciendo Fronteras» ya está disponible.", type: "ok", pts: 300 });
    SS.router.go("progress");
  }

  function advanceRef(nodeId) {
    switch (refStep) {
      case 0:
        showCoach("🔄", "Analizamos la Universidad. En este nivel, la Facultad es un SUBSISTEMA: una parte de la universidad con procesos propios. Entra en «Facultad de Ingeniería».", [{ label: "Continuar", onClick: () => { refStep = 1; highlightTarget("facultad"); } }]);
        break;
      case 1:
        if (nodeId === "facultad") {
          refStep = 2;
          showCoach("🎯", "Cambió el punto de referencia. Ahora la Facultad es el SISTEMA, la Universidad su SUPRASISTEMA y los Departamentos sus SUBSISTEMAS. Entra en «Departamento de Optimización».", [{ label: "Continuar", onClick: () => { refStep = 2; highlightTarget("departamento"); } }]);
        }
        break;
      case 2:
        if (nodeId === "departamento") {
          refStep = 3;
          showCoach("🧠", "El Departamento ahora es el SISTEMA y la Facultad, su suprasistema. Los roles de subsistema, sistema y suprasistema dependen del nivel de análisis que elijas.", [
            { label: "Terminar práctica", class: "btn btn-primary", onClick: completeRef }
          ]);
        }
        break;
    }
  }

  /* ================= MAPA DE PROGRESO ================= */
  function renderProgress() {
    const map = document.getElementById("progress-map");
    map.innerHTML = "";
    const order = [
      { id: "m1", icon: "🔍", meta: SS.data.missionMeta.m1 },
      { id: "m2", icon: "🔭", meta: SS.data.missionMeta.m2 },
      { id: "ref", icon: "🔄", meta: SS.data.missionMeta.ref },
      { id: "m3", icon: "📍", meta: SS.data.missionMeta.m3 },
      { id: "m4", icon: "⚡", meta: SS.data.missionMeta.m4 },
      { id: "m5", icon: "💊", meta: SS.data.missionMeta.m5 }
    ];
    order.forEach(({ id, icon, meta }) => {
      const m = SS.state.get().missions[id];
      const locked = m.status === "locked";
      const done = m.status === "done";
      const node = el("div", { class: "prog-node" + (locked ? " locked" : "") + (done ? " done" : "") });
      node.appendChild(el("div", { class: "prog-index" }, locked ? "🔒" : meta.num));
      const mid = el("div");
      mid.appendChild(el("div", { class: "prog-name" }, icon + " " + meta.title));
      mid.appendChild(el("div", { class: "prog-desc" }, meta.desc));
      node.appendChild(mid);
      const metaEl = el("div", { class: "prog-meta" });
      if (done) metaEl.appendChild(el("span", { class: "prog-check" }, "✓"));
      if (m.percent > 0) {
        const bar = el("div", { class: "prog-bar" });
        bar.appendChild(el("i", { style: { width: m.percent + "%" } }));
        metaEl.appendChild(bar);
        metaEl.appendChild(el("span", { class: "mono", style: { color: "#4ee6ff", fontSize: "12px" } }, m.percent + "%"));
      } else if (!locked && !done) metaEl.appendChild(el("span", { class: "label" }, "Disponible"));
      else if (locked) metaEl.appendChild(el("span", { class: "prog-lock" }, "Bloqueado"));
      node.appendChild(metaEl);
      node.addEventListener("click", () => {
        if (locked) { SS.ui.toast({ title: "Bloqueado", msg: "Completa la misión anterior para desbloquear «" + meta.title + "».", type: "warn" }); return; }
        if (id === "m1") SS.router.go("mission", { mission: "m1" });
        else if (id === "m2") SS.router.go("mission", { mission: "m2" });
        else if (id === "ref") SS.router.go("explorer", { mode: "ref" });
        else if (id === "m3") SS.router.go("mission", { mission: "m3" });
        else if (id === "m4") SS.router.go("mission", { mission: "m4" });
        else SS.router.go("final");
      });
      map.appendChild(node);
    });

    const st = SS.state.get();
    const stats = document.getElementById("progress-stats");
    stats.innerHTML = "";
    const row = el("div", { class: "result-stats", style: { marginTop: 0 } });
    const arr = [
      [st.score.toLocaleString("es-MX"), "Puntos"],
      [SS.scoring.precision() + "%", "Precisión"],
      [SS.ach.unlockedCount() + "/" + SS.ach.defs.length, "Logros"],
      [SS.state.MISSION_IDS.filter((id) => st.missions[id].status === "done").length + "/" + SS.state.MISSION_IDS.length, "Misiones"]
    ];
    arr.forEach(([v, l]) => {
      const s = el("div", { class: "result-stat" });
      s.appendChild(el("b", {}, v));
      s.appendChild(el("span", {}, l));
      row.appendChild(s);
    });
    stats.appendChild(row);
    if (!st.tutorialSeen) {
      const tip = el("div", { class: "feedback", style: { marginTop: "14px", textAlign: "center" } });
      tip.appendChild(el("p", {}, "¿Primera vez aquí? "));
      const btn = el("button", { class: "btn btn-ghost btn-sm", style: { marginLeft: "8px" } }, "Ver tutorial");
      btn.addEventListener("click", startTutorial);
      tip.appendChild(btn);
      stats.appendChild(tip);
    }
  }

  /* ================= LOGROS ================= */
  let achBound = false;
  function renderAchievements() {
    const grid = document.getElementById("ach-grid");
    grid.innerHTML = "";
    if (!achBound) {
      achBound = true;
      document.getElementById("ach-back").addEventListener("click", () => SS.router.go("progress"));
    }
    const st = SS.state.get();
    SS.ach.defs.forEach((def) => {
      const got = st.achievements[def.id];
      const card = el("div", { class: "ach-card" + (got ? " got" : "") });
      card.appendChild(el("div", { class: "ach-icon" }, got ? def.icon : "?"));
      card.appendChild(el("div", { class: "ach-name" }, def.name));
      card.appendChild(el("div", { class: "ach-desc" }, def.desc));
      card.appendChild(el("div", { class: "ach-status" }, got ? "Desbloqueado" : "Bloqueado"));
      grid.appendChild(card);
    });
  }

  /* ================= FONDO ANIMADO ================= */
  function initBackground() {
    const canvas = document.getElementById("bg-canvas");
    const ctx = canvas.getContext("2d");
    let W, H;
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener("resize", resize);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const N = reduced ? 0 : 42;
    const ps = [];
    for (let i = 0; i < N; i++) {
      ps.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28, r: Math.random() * 1.7 + 0.6 });
    }
    let mx = -1, my = -1;
    window.addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });

    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (const p of ps) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        if (mx >= 0) {
          const dx = mx - p.x, dy = my - p.y;
          const d = Math.hypot(dx, dy);
          if (d < 150 && d > 0.01) { p.x += (dx / d) * 0.55; p.y += (dy / d) * 0.55; }
        }
        ctx.fillStyle = "rgba(126,190,235,0.55)";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const a = ps[i], b = ps[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 110) {
            ctx.strokeStyle = "rgba(78,230,255," + (0.07 * (1 - d / 110)).toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      if (!reduced) requestAnimationFrame(frame);
    }
    if (!reduced) requestAnimationFrame(frame);
  }

  return { boot, refreshContinue, toggleSound };
})();

document.addEventListener("DOMContentLoaded", SS.app.boot);
