/* ============================================================
   SYSTEM SCOPE — Misiones: M1 dentro, M2 fuera, M3 fronteras,
   M4 fronteras en acción, Misión final y Resultados.
   ============================================================ */
window.SS = window.SS || {};

SS.missions = (() => {
  const el = SS.ui.el;
  const byId = (id) => SS.data.systems.byId(id);
  const meta = SS.data.missionMeta;
  const KIND_COLORS = SS.boundary.KIND_COLORS;
  const KIND_ICONS = { physical: "📍", economic: "💰", technical: "⚙️", temporal: "⏱️" };

  let hintShown = false;

  /* ---------- Cabecera común ---------- */
  function header(opts) {
    const head = el("div", { class: "mission-head" });
    const info = el("div");
    info.appendChild(el("h2", { class: "mission-title" }, ["Misión ", opts.num, " — ", el("span", {}, opts.title)]));
    if (opts.sub) info.appendChild(el("p", { class: "mission-sub" }, opts.sub));
    head.appendChild(info);
    const actions = el("div", { class: "mission-actions" });
    if (opts.hint) {
      const hb = el("button", { class: "btn btn-ghost btn-sm" }, "💡 Pista");
      hb.addEventListener("click", () => showHint(opts.hint));
      actions.appendChild(hb);
    }
    const exitBtn = el("button", { class: "btn btn-ghost btn-sm" }, "← Mapa de progreso");
    exitBtn.addEventListener("click", () => SS.router.go("progress"));
    actions.appendChild(exitBtn);
    head.appendChild(actions);
    return head;
  }

  function showHint(text) {
    if (!hintShown) { SS.scoring.hintUsed(); hintShown = true; }
    SS.ui.toast({ title: "Pista", msg: text, type: "warn", pts: -20, timeout: 7000 });
  }

  function feedback(box, kind, title, text, pts) {
    const f = el("div", { class: "feedback " + kind, role: "status" });
    f.appendChild(el("div", { class: "fb-head" }, title));
    f.appendChild(el("div", {}, text));
    if (pts !== null && pts > 0) f.appendChild(el("div", { class: "fb-pts" }, `+${pts} pts`));
    box.innerHTML = "";
    box.appendChild(f);
  }

  /* ---------- Finalización de misión ---------- */
  function finishMission(id, firstTryCount, total, startScore, onDone) {
    const perfect = total > 0 && firstTryCount === total;
    const bonus = perfect ? SS.scoring.bonus(true) : 0;
    const st = SS.state.get();
    const m = st.missions[id];
    m.status = "done";
    m.percent = Math.max(m.percent, Math.round((100 * firstTryCount) / total));
    m.best = Math.max(m.best, st.score - startScore);
    SS.state.openIfReady();
    SS.persist();
    SS.ach.checkAll();
    if (onDone) onDone(perfect, bonus);
  }

  function completionCard({ perfect, bonus, onNext }) {
    const c = el("div", { class: "feedback ok", style: { marginTop: "16px" } });
    c.appendChild(el("div", { class: "fb-head" }, perfect ? "Misión perfecta" : "Misión completada"));
    c.appendChild(el("div", {}, perfect
      ? "Clasificaste todo al primer intento. Bonus aplicado."
      : "Concluiste la misión. Revisa el feedback para afinar tu precisión."));
    if (bonus > 0) c.appendChild(el("div", { class: "fb-pts" }, `+${bonus} pts (bonus)`));
    const btn = el("button", { class: "btn btn-primary", style: { marginTop: "12px" } }, "Continuar");
    btn.addEventListener("click", onNext);
    c.appendChild(btn);
    return c;
  }

  /* =========================================================
     M1 — DENTRO DEL SISTEMA
     ========================================================= */
  function renderM1() {
    const host = document.getElementById("mission-host");
    const data = SS.data.mission1;
    const cases = data.cases;
    let caseIdx = 0;
    let firstTryCount = 0;
    const total = cases.reduce((a, c) => a + c.nodes.length, 0);
    const startScore = SS.state.get().score;

    function draw() {
      host.innerHTML = "";
      const c = cases[caseIdx];
      hintShown = false;
      host.appendChild(header({ num: meta.m1.num, title: meta.m1.title, sub: `${data.subtitle} Caso ${caseIdx + 1} de ${cases.length}.`, hint: c.hint }));

      const wrap = el("div", { class: "mission-card" });
      const intro = el("div", { style: { display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" } });
      intro.appendChild(el("span", { style: { fontSize: "36px" } }, c.icon));
      const i2 = el("div");
      i2.appendChild(el("h3", { style: { fontSize: "19px" } }, [el("span", { style: { color: "#4ee6ff" } }, "Sistema: "), c.system]));
      i2.appendChild(el("p", { style: { color: "#93aac7", fontSize: "13.5px", marginTop: "4px" } }, c.blurb));
      intro.appendChild(i2);
      wrap.appendChild(intro);

      const stage = el("div", { class: "m1-stage" });

      const exterior = el("div", { class: "drop-zone m1-drop", tabindex: "0", role: "button", dataset: { zone: "outside" }, "aria-label": "Zona exterior del sistema" });
      exterior.appendChild(el("span", { class: "dz-icon" }, "🌫️"));
      exterior.appendChild(el("div", { class: "dz-title" }, "FUERA DEL SISTEMA"));
      exterior.appendChild(el("div", { class: "dz-hint" }, "No es un subsistema a este nivel"));
      const extList = el("div", { class: "m1-placed" });
      exterior.appendChild(extList);
      stage.appendChild(exterior);

      const center = el("div", { class: "drop-zone m1-center", tabindex: "0", role: "button", dataset: { zone: "inside" }, "aria-label": "Interior del sistema" });
      center.appendChild(el("span", { style: { fontSize: "34px" } }, c.icon));
      center.appendChild(el("div", { class: "m1-syslabel" }, "Sistema actual"));
      center.appendChild(el("div", { class: "m1-sysname" }, c.system));
      center.appendChild(el("div", { class: "dz-hint" }, "Subsistema con procesos propios"));
      const inList = el("div", { class: "m1-placed" });
      center.appendChild(inList);
      stage.appendChild(center);

      const right = el("div", { class: "m1-drop" });
      right.appendChild(el("div", { class: "label" }, "Progreso del caso"));
      const pb = el("div", { class: "mission-progress" });
      const fill = el("i");
      pb.appendChild(fill);
      right.appendChild(pb);
      right.appendChild(el("p", { style: { color: "#93aac7", fontSize: "12.5px", marginTop: "10px" } }, "Arrastra cada elemento al interior del sistema si puede analizarse como subsistema, o a la zona exterior si pertenece al entorno o a un nivel mayor. En móvil: toca el elemento y después toca la zona."));
      const fb = el("div", { style: { marginTop: "12px" } });
      right.appendChild(fb);
      stage.appendChild(right);

      wrap.appendChild(stage);

      wrap.appendChild(el("div", { class: "label", style: { marginTop: "18px" } }, "Elementos a clasificar"));
      const tray = el("div", { class: "m1-tray" });
      wrap.appendChild(tray);
      host.appendChild(wrap);

      let placed = 0;
      let selectedChip = null;
      const chipState = {};

      function select(chip) {
        document.querySelectorAll("#mission-host .node-chip").forEach((x) => x.classList.remove("selected"));
        if (selectedChip === chip) { selectedChip = null; return; }
        selectedChip = chip;
        chip.classList.add("selected");
      }

      function drop(chip, zone) {
        if (!zone) return;
        const target = chip || selectedChip;
        if (!target) {
          SS.ui.toast({ title: "Selecciona un elemento", msg: "Toca primero un elemento de la bandeja.", type: "warn" });
          return;
        }
        if (target.classList.contains("used")) return;
        const n = c.nodes.find((x) => x.id === target.dataset.node);
        if (!n) return;
        const zoneId = zone.dataset.zone;
        const correct = (zoneId === "inside") === (n.kind === "inside");
        const res = SS.scoring.answer(c.id + ":" + n.id, correct);
        if (res.firstTry && correct) firstTryCount++;

        if (correct) {
          target.classList.add("used");
          target.classList.remove("selected");
          if (selectedChip === target) selectedChip = null;
          const tag = el("span", { class: "mini-tag" }, n.icon + " " + n.label);
          (zoneId === "inside" ? inList : extList).appendChild(tag);
          if (zoneId === "inside") {
            zone.classList.add("over");
            setTimeout(() => zone.classList.remove("over"), 400);
          }
          placed++;
          const txt = zoneId === "inside"
            ? `${n.label} puede analizarse como subsistema porque forma parte de ${c.system} y contiene elementos y procesos propios.`
            : `Correcto: ${n.label} no es un subsistema de ${c.system}; pertenece al entorno o a un nivel mayor de análisis.`;
          feedback(fb, "ok", "Integrado", txt, res.pts);
          const rect = target.getBoundingClientRect();
          SS.ui.floatPts(host, rect.left - 20, rect.top, `+${res.pts}`);
          fill.style.width = Math.round((placed / c.nodes.length) * 100) + "%";
          if (placed === c.nodes.length) onCaseComplete();
        } else {
          zone.style.animation = "shake .35s ease";
          setTimeout(() => (zone.style.animation = ""), 380);
          target.classList.remove("selected");
          if (selectedChip === target) selectedChip = null;
          const txt = zoneId === "inside"
            ? "Este elemento no pertenece al nivel interno que estamos analizando. Observa nuevamente dónde se encuentra con respecto a " + c.system + ": ¿lo rodea o lo contiene?"
            : `${n.label} forma parte de ${c.system} y puede analizarse como subsistema: es una parte con procesos propios. Colócalo dentro.`;
          feedback(fb, "err", "Todavía no", txt, 0);
        }
        SS.ui.updateHUD();
        SS.persist();
      }

      function onCaseComplete() {
        SS.audio.play("complete");
        const panel = el("div", { class: "feedback ok", style: { marginTop: "16px" } });
        panel.appendChild(el("div", { class: "fb-head" }, "Caso completado"));
        panel.appendChild(el("div", {}, `Clasificaste todos los elementos del caso «${c.system}».`));
        if (caseIdx < cases.length - 1) {
          const next = el("button", { class: "btn btn-primary", style: { marginTop: "12px" } }, "Siguiente caso →");
          next.addEventListener("click", () => { caseIdx++; draw(); });
          panel.appendChild(next);
        } else {
          finishMission("m1", firstTryCount, total, startScore, (perfect, bonus) => {
            panel.appendChild(el("div", { style: { marginTop: "8px", color: "#3ddc84" } }, perfect ? "¡Todos los casos al primer intento!" : "Puedes repetir la misión para mejorar tu precisión."));
            if (bonus) panel.appendChild(el("div", { class: "fb-pts" }, `+${bonus} pts (bonus)`));
            const go = el("button", { class: "btn btn-primary", style: { marginTop: "12px" } }, "Ver mapa de progreso");
            go.addEventListener("click", () => SS.router.go("progress"));
            panel.appendChild(go);
          });
        }
        fb.innerHTML = "";
        fb.appendChild(panel);
      }

      c.nodes.forEach((n) => {
        const chip = el("div", { class: "node-chip", role: "button", tabindex: "0", "aria-label": "Clasificar " + n.label });
        chip.appendChild(el("span", { class: "chip-icon" }, n.icon));
        chip.appendChild(el("span", {}, n.label));
        chip.dataset.node = n.id;
        tray.appendChild(chip);
        chip.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(chip); } });
        SS.ui.makeDraggable(chip, {
          zoneClass: "drop-zone",
          onTap: () => select(chip),
          onDrop: (ch, zone, evt) => drop(ch, zone)
        });
      });

      [exterior, center].forEach((z) => {
        z.addEventListener("click", () => { if (selectedChip) drop(null, z); });
        z.addEventListener("keydown", (e) => {
          if ((e.key === "Enter" || e.key === " ") && selectedChip) { e.preventDefault(); drop(null, z); }
        });
      });
    }
    draw();
  }

  /* =========================================================
     M2 — FUERA DEL SISTEMA
     ========================================================= */
  function renderM2() {
    const host = document.getElementById("mission-host");
    const data = SS.data.mission2;
    const cases = data.cases;
    let caseIdx = 0;
    let firstTryCount = 0;
    const total = cases.length;
    const startScore = SS.state.get().score;

    function draw() {
      host.innerHTML = "";
      const c = cases[caseIdx];
      hintShown = false;
      host.appendChild(header({ num: meta.m2.num, title: meta.m2.title, sub: `${data.subtitle} Caso ${caseIdx + 1} de ${cases.length}.`, hint: c.hint }));

      const wrap = el("div", { class: "mission-card" });
      const intro = el("div", { class: "feedback", style: { marginBottom: "16px", borderColor: "rgba(139,92,246,.45)", background: "rgba(139,92,246,.08)" } });
      intro.appendChild(el("div", { class: "fb-head", style: { color: "#8b5cf6" } }, [el("span", { style: { fontSize: "18px" } }, c.icon + " "), "Sistema actual: ", el("span", {}, c.system)]));
      intro.appendChild(el("div", {}, c.blurb));
      wrap.appendChild(intro);

      const grid = el("div", { class: "m2-grid" });
      wrap.appendChild(el("div", { class: "label", style: { marginBottom: "10px" } }, "¿Cuál es el suprasistema?"));
      wrap.appendChild(grid);
      const fb = el("div", { style: { marginTop: "14px" } });
      wrap.appendChild(fb);
      host.appendChild(wrap);

      let caseTries = 0;
      let done = false;
      c.options.forEach((opt) => {
        const card = el("div", { class: "m2-option", role: "button", tabindex: "0", "aria-label": "Evaluar " + opt.label });
        card.appendChild(el("div", { class: "m2-icon" }, opt.icon));
        const t = el("div");
        t.appendChild(el("div", { class: "m2-name" }, opt.label));
        t.appendChild(el("div", { class: "m2-desc" }, opt.desc));
        card.appendChild(t);
        grid.appendChild(card);

        const act = () => {
          if (done) return;
          caseTries++;
          const res = SS.scoring.answer(c.id + ":" + opt.id, opt.correct);
          if (opt.correct) {
            done = true;
            if (caseTries === 1) firstTryCount++;
            card.classList.add("correct-picked");
            c.options.forEach((o) => grid.querySelectorAll(".m2-option").forEach((el2) => { el2.style.pointerEvents = "none"; }));
            const supNode = SS.data.systems.byId({ restaurante: "cadena-restaurantes", "clase-optimizacion": "departamento", "ser-humano": "familia", "programa-computo": "sistema-operativo", universidad: "sistema-educativo" }[c.id]);
            feedback(fb, "ok", "Correcto", `El suprasistema de ${c.system} es ${opt.label}: es el sistema mayor que lo contiene.${supNode ? " El rol de cada elemento depende del nivel de análisis." : ""}`, res.pts);
            const panel = el("div", { style: { marginTop: "10px" } });
            if (caseIdx < cases.length - 1) {
              const next = el("button", { class: "btn btn-primary" }, "Siguiente caso →");
              next.addEventListener("click", () => { caseIdx++; draw(); });
              panel.appendChild(next);
            } else {
              finishMission("m2", firstTryCount, total, startScore, (perfect, bonus) => {
                panel.appendChild(el("p", { style: { color: "#3ddc84", fontSize: "13px" } }, perfect ? "¡Todos al primer intento!" : "Misión completada."));
                if (bonus) panel.appendChild(el("div", { class: "fb-pts" }, `+${bonus} pts (bonus)`));
                const go = el("button", { class: "btn btn-primary" }, "Ver mapa de progreso");
                go.addEventListener("click", () => SS.router.go("progress"));
                panel.appendChild(go);
              });
            }
            fb.appendChild(panel);
            SS.audio.play("complete");
          } else {
            card.classList.add("wrong-picked");
            setTimeout(() => card.classList.remove("wrong-picked"), 420);
            const why = opt.wrongWhy || "Ese elemento no es el sistema mayor que buscamos a este nivel de análisis.";
            feedback(fb, "err", "Todavía no", why + " Observa el nivel: buscamos algo que CONTENGA a " + c.system + ".", 0);
          }
          SS.ui.updateHUD();
          SS.persist();
        };
        card.addEventListener("click", act);
        card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(); } });
      });
    }
    draw();
  }

  /* =========================================================
     M3 — ESTABLECIENDO FRONTERAS
     ========================================================= */
  function renderM3() {
    const host = document.getElementById("mission-host");
    const scenarios = SS.data.defineScope;
    let phase = "a";
    let scIdx = 0;
    let firstTryCount = 0;
    let total = scenarios.reduce((a, s) => a + s.cards.length, 0);
    const startScore = SS.state.get().score;

    function draw() {
      host.innerHTML = "";
      hintShown = false;
      host.appendChild(header({ num: meta.m3.num, title: meta.m3.title, sub: phase === "a" ? "Conoce cómo se dibuja cada frontera." : "Asigna cada tarjeta a la frontera que delimita. Escenario " + (scIdx + 1) + " de " + scenarios.length + "." }));

      if (phase === "a") {
        const card = el("div", { class: "mission-card" });
        SS.boundary.configurator(card, "universidad");
        const cont = el("button", { class: "btn btn-primary", style: { marginTop: "16px" } }, "Continuar: Define el alcance →");
        cont.addEventListener("click", () => { phase = "b"; draw(); });
        card.appendChild(cont);
        host.appendChild(card);
      } else {
        const sc = scenarios[scIdx];
        const card = el("div", { class: "mission-card" });
        card.appendChild(el("div", { class: "label" }, "Escenario · " + sc.title + " · " + sc.icon));
        SS.boundary.defineScope(card, sc, (scFTC, perfectFlag) => {
          firstTryCount += scFTC;
          scIdx++;
          if (scIdx < scenarios.length) draw();
          else {
            finishMission("m3", firstTryCount, total, startScore, (perfect, bonus) => {
              const panel = completionCard({ perfect, bonus, onNext: () => SS.router.go("progress") });
              const fbBox = document.getElementById("mission-host");
              fbBox.appendChild(panel);
            });
          }
        });
        host.appendChild(card);
      }
    }
    draw();
  }

  /* =========================================================
     M4 — FRONTERAS EN ACCIÓN
     ========================================================= */
  function renderM4() {
    const host = document.getElementById("mission-host");
    const events = SS.data.boundaryEvents;
    let idx = 0;
    let firstTryCount = 0;
    const total = events.length;
    const startScore = SS.state.get().score;

    function draw() {
      host.innerHTML = "";
      const ev = events[idx];
      hintShown = false;
      host.appendChild(header({
        num: meta.m4.num, title: meta.m4.title,
        sub: `Evento ${idx + 1} de ${total}. Lee qué cambió y señala qué frontera se modificó.`,
        hint: "Recuerda: física (espacio), económica (recursos monetarios), técnica (conocimientos/capacidad), temporal (duración)."
      }));

      const wrap = el("div", { class: "mission-card event-stage" });

      const scen = el("div", { class: "label" }, "Escenario · " + ev.system + " " + ev.icon);
      wrap.appendChild(scen);

      const evBox = el("div", { class: "feedback", style: { margin: "10px 0", borderColor: "rgba(255,180,84,.4)", background: "rgba(255,180,84,.08)" } });
      evBox.appendChild(el("div", { class: "fb-head", style: { color: "#ffb454" } }, "Evento"));
      evBox.appendChild(el("div", {}, ev.event));
      wrap.appendChild(evBox);

      wrap.appendChild(el("div", { class: "label", style: { marginBottom: "8px" } }, "Estado actual del sistema"));
      const meters = el("div", { class: "event-status-grid" });
      wrap.appendChild(meters);
      const meterEls = {};
      ["physical", "economic", "technical", "temporal"].forEach((k) => {
        const [label, value, pct] = ev.initial[k];
        const m = el("div", { class: "event-meter", style: { "--bt-color": KIND_COLORS[k] } });
        const head2 = el("div", { class: "em-name" });
        head2.appendChild(el("span", {}, KIND_ICONS[k] + " " + label));
        head2.appendChild(el("b", {}, value));
        m.appendChild(head2);
        const bar = el("div", { class: "em-bar" });
        const f = el("i", { style: { width: pct + "%", background: KIND_COLORS[k] } });
        bar.appendChild(f);
        m.appendChild(bar);
        meterEls[k] = { m, f, head2 };
        meters.appendChild(m);
      });
      wrap.appendChild(meters);

      wrap.appendChild(el("div", { class: "label", style: { margin: "14px 0 8px" } }, "¿Qué frontera cambió?"));
      const opts = el("div", { class: "event-options" });
      wrap.appendChild(opts);
      const fb = el("div", { style: { marginTop: "14px" } });
      wrap.appendChild(fb);
      host.appendChild(wrap);

      let tries = 0;
      let done = false;
      const kinds = [
        { id: "physical", icon: "📍", name: "Física" },
        { id: "economic", icon: "💰", name: "Económica" },
        { id: "technical", icon: "⚙️", name: "Técnica" },
        { id: "temporal", icon: "⏱️", name: "Temporal" }
      ];
      kinds.forEach((k) => {
        const b = el("button", { class: "event-option", "aria-label": "Frontera " + k.name });
        b.appendChild(el("div", { class: "eo-icon" }, k.icon));
        b.appendChild(el("div", { class: "eo-name" }, k.name));
        opts.appendChild(b);
        const act = () => {
          if (done) return;
          tries++;
          const res = SS.scoring.answer(ev.id + ":" + k.id, ev.answer === k.id);
          if (ev.answer === k.id) {
            done = true;
            if (tries === 1) firstTryCount++;
            b.classList.add("correct-picked");
            opts.querySelectorAll(".event-option").forEach((x) => (x.style.pointerEvents = "none"));
            // animar cambio en el medidor correcto
            const [nl, nv, np] = ev.after[ev.answer];
            const me = meterEls[ev.answer];
            me.head2.querySelector("b").textContent = nv;
            me.f.style.width = np + "%";
            me.m.classList.add("changed");
            SS.audio.play("boundary");
            feedback(fb, "ok", "Correcto", ev.explain, res.pts);
            const panel = el("div", { style: { marginTop: "10px" } });
            if (idx < total - 1) {
              const next = el("button", { class: "btn btn-primary" }, "Siguiente evento →");
              next.addEventListener("click", () => { idx++; draw(); });
              panel.appendChild(next);
            } else {
              finishMission("m4", firstTryCount, total, startScore, (perfect, bonus) => {
                panel.appendChild(el("p", { style: { color: "#3ddc84", fontSize: "13px" } }, perfect ? "¡Todos los eventos al primer intento!" : "Misión completada."));
                if (bonus) panel.appendChild(el("div", { class: "fb-pts" }, `+${bonus} pts (bonus)`));
                const go = el("button", { class: "btn btn-primary" }, "Ir a la Misión Final");
                go.addEventListener("click", () => SS.router.go("final"));
                panel.appendChild(go);
              });
            }
            fb.appendChild(panel);
          } else {
            b.classList.add("wrong-picked");
            setTimeout(() => b.classList.remove("wrong-picked"), 420);
            const kindDesc = SS.data.boundaryKinds.find((x) => x.id === k.id);
            feedback(fb, "err", "Todavía no", `La frontera ${k.name} se relaciona con ${kindDesc.desc}. Compara el evento con el estado del sistema.`, 0);
          }
          SS.ui.updateHUD();
          SS.persist();
        };
        b.addEventListener("click", act);
      });
    }
    draw();
  }

  /* =========================================================
     MISIÓN FINAL
     ========================================================= */
  function renderFinal() {
    const host = document.getElementById("final-host");
    host.innerHTML = "";
    const fc = SS.data.finalChallenge;
    const stages = fc.stages;
    let stageIdx = 0;
    let firstTryCount = 0;
    const startScore = SS.state.get().score;
    let s4Total = stages[3].elements.length;
    let s5Total = 4;
    const total = 1 + 1 + 1 + s4Total + s5Total; // s1, s2, s3 (una relación cada una) + s4 (elementos) + s5 (cuatro fronteras)

    function stagePills() {
      const p = el("div", { class: "stage-pills" });
      stages.forEach((s, i) => {
        p.appendChild(el("span", { class: "stage-pill" + (i === stageIdx ? " now" : i < stageIdx ? " done" : "") }, (i + 1) + ". " + s.title));
      });
      return p;
    }

    function draw() {
      host.innerHTML = "";
      const st = stages[stageIdx];
      const head = el("div", { class: "mission-head" });
      head.appendChild(el("h2", { class: "mission-title" }, ["Misión Final — ", el("span", {}, "Delimita el Sistema")]));
      const back = el("button", { class: "btn btn-ghost btn-sm" }, "← Mapa de progreso");
      back.addEventListener("click", () => SS.router.go("progress"));
      head.appendChild(back);
      host.appendChild(head);
      host.appendChild(stagePills());

      if (stageIdx === 0) stageS1(st);
      else if (stageIdx === 1) stageS2(st);
      else if (stageIdx === 2) stageS3(st);
      else if (stageIdx === 3) stageS4(st);
      else stageS5(st);
    }

    function contextCard() {
      const card = el("div", { class: "mission-card", style: { marginBottom: "14px" } });
      card.appendChild(el("div", { class: "label" }, "Contexto · FarmaPlus"));
      card.appendChild(el("p", { style: { marginTop: "6px", color: "#e6f4ff", fontSize: "14px" } }, fc.context));
      return card;
    }

    function stageS1(st) {
      const card = el("div", { class: "mission-card" });
      card.appendChild(el("h3", { style: { fontSize: "17px", marginBottom: "4px" } }, [el("span", { style: { color: "#4ee6ff" } }, st.title), " — " + st.task]));
      const grid = el("div", { class: "m2-grid", style: { marginTop: "12px" } });
      card.appendChild(grid);
      const fb = el("div", { style: { marginTop: "14px" } });
      card.appendChild(fb);
      host.appendChild(contextCard());
      host.appendChild(card);

      let done = false;
      st.options.forEach((o) => {
        const optCard = el("div", { class: "m2-option", role: "button", tabindex: "0" });
        optCard.appendChild(el("div", { class: "m2-icon" }, o.icon));
        const t = el("div");
        t.appendChild(el("div", { class: "m2-name" }, o.label));
        t.appendChild(el("div", { class: "m2-desc" }, o.desc));
        optCard.appendChild(t);
        grid.appendChild(optCard);
        const act = () => {
          if (done) return;
          const res = SS.scoring.answer("m5:" + st.id + ":" + o.id, o.correct);
          if (o.correct) {
            done = true;
            if (res.firstTry) firstTryCount++;
            optCard.classList.add("correct-picked");
            st.options.forEach(() => grid.querySelectorAll(".m2-option").forEach((x) => (x.style.pointerEvents = "none")));
            feedback(fb, "ok", "Correcto", `«${o.label}» es el nivel que FarmaPlus debe analizar para delimitar su proceso de entrega.`, res.pts);
            const next = el("button", { class: "btn btn-primary", style: { marginTop: "12px" } }, "Siguiente etapa →");
            next.addEventListener("click", () => { stageIdx++; draw(); });
            fb.appendChild(next);
            SS.audio.play("complete");
          } else {
            optCard.classList.add("wrong-picked");
            setTimeout(() => optCard.classList.remove("wrong-picked"), 420);
            const isSup = !o.correct && (o.id === "o1" || o.id === "o5");
            const isSub = !o.correct && (o.id === "o3" || o.id === "o4");
            feedback(fb, "err", "Todavía no", isSup ? `${o.label} es un nivel mayor que el proceso de entrega; analizarlo como sistema sería demasiado amplio para este estudio.` : isSub ? `${o.label} es una parte del proceso (subsistema), no el sistema principal.` : "Observa el contexto: FarmaPlus quiere analizar su proceso de entrega de medicamentos.", 0);
          }
          SS.ui.updateHUD(); SS.persist();
        };
        optCard.addEventListener("click", act);
        optCard.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(); } });
      });
    }

    function stageS2(st) {
      const card = el("div", { class: "mission-card" });
      card.appendChild(el("h3", { style: { fontSize: "17px", marginBottom: "4px" } }, [el("span", { style: { color: "#2dd4bf" } }, st.title), " — " + st.task]));
      const tray = el("div", { class: "m1-tray", style: { marginTop: "14px" } });
      card.appendChild(tray);
      const fb = el("div", { style: { marginTop: "14px" } });
      card.appendChild(fb);
      host.appendChild(contextCard());
      host.appendChild(card);

      const sel = new Set();
      st.options.forEach((o) => {
        const chip = el("div", { class: "node-chip", role: "button", tabindex: "0", "aria-label": "Seleccionar " + o.label });
        chip.appendChild(el("span", { class: "chip-icon" }, o.icon));
        chip.appendChild(el("span", {}, o.label));
        tray.appendChild(chip);
        const act = () => {
          if (sel.has(o.id)) { sel.delete(o.id); chip.classList.remove("selected"); }
          else { sel.add(o.id); chip.classList.add("selected"); }
          SS.audio.play("select");
        };
        chip.addEventListener("click", act);
        chip.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(); } });
      });

      const confirmBtn = el("button", { class: "btn btn-primary", style: { marginTop: "14px" } }, "Confirmar selección");
      card.appendChild(confirmBtn);
      let tries = 0;
      let stageDone = false;
      confirmBtn.addEventListener("click", () => {
        if (stageDone) return;
        tries++;
        const correct = st.options.filter((o) => o.correct).map((o) => o.id);
        const selected = [...sel];
        const missing = correct.filter((id) => !sel.has(id));
        const extra = selected.filter((id) => !correct.includes(id));
        const ok = missing.length === 0 && extra.length === 0;
        const res = SS.scoring.answer("m5:s2", ok);
        if (ok) {
          stageDone = true;
          if (res.firstTry) firstTryCount++;
          st.options.forEach((o) => tray.querySelectorAll(".node-chip").forEach((x) => (x.style.pointerEvents = "none")));
          confirmBtn.disabled = true;
          confirmBtn.hidden = true;
          feedback(fb, "ok", "Correcto", "Recepción de pedidos, inventario, preparación y reparto son los subsistemas del sistema de entrega: cada uno forma parte del todo y tiene procesos propios.", res.pts);
          const next = el("button", { class: "btn btn-primary", style: { marginTop: "12px" } }, "Siguiente etapa →");
          next.addEventListener("click", () => { stageIdx++; draw(); });
          fb.appendChild(next);
          SS.audio.play("complete");
        } else {
          const msg = [];
          if (extra.length) {
            const extraLabels = extra.map((id) => st.options.find((o) => o.id === id).label).join(", ");
            msg.push(`${extraLabels} ${extra.length === 1 ? "no es" : "no son"} un subsistema del sistema de entrega.`);
          }
          if (missing.length) {
            const missLabels = missing.map((id) => st.options.find((o) => o.id === id).label).join(", ");
            msg.push(`Te falta incluir: ${missLabels}.`);
          }
          feedback(fb, "err", "Ajusta tu selección", msg.join(" "), 0);
        }
        SS.ui.updateHUD(); SS.persist();
      });
    }

    function stageS3(st) {
      stageS1(st);
    }

    function stageS4(st) {
      const card = el("div", { class: "mission-card" });
      card.appendChild(el("h3", { style: { fontSize: "17px", marginBottom: "4px" } }, [el("span", { style: { color: "#7b93b0" } }, st.title), " — " + st.task]));
      const stage = el("div", { class: "m1-stage", style: { marginTop: "14px" } });

      const inZone = el("div", { class: "drop-zone m1-drop", tabindex: "0", role: "button", dataset: { zone: "inside" } });
      inZone.appendChild(el("span", { class: "dz-icon" }, "💊"));
      inZone.appendChild(el("div", { class: "dz-title" }, "DENTRO DEL SISTEMA"));
      inZone.appendChild(el("div", { class: "dz-hint" }, "Parte del proceso de entrega"));
      const inList = el("div", { class: "m1-placed" });
      inZone.appendChild(inList);
      stage.appendChild(inZone);

      const center = el("div", { class: "m1-center", style: { pointerEvents: "none" } });
      center.appendChild(el("span", { style: { fontSize: "30px" } }, "💊"));
      center.appendChild(el("div", { class: "m1-syslabel" }, "Sistema"));
      center.appendChild(el("div", { class: "m1-sysname", style: { fontSize: "17px" } }, "Entrega de medicamentos"));
      stage.appendChild(center);

      const outZone = el("div", { class: "drop-zone m1-drop", tabindex: "0", role: "button", dataset: { zone: "outside" } });
      outZone.appendChild(el("span", { class: "dz-icon" }, "🌫️"));
      outZone.appendChild(el("div", { class: "dz-title" }, "ENTORNO"));
      outZone.appendChild(el("div", { class: "dz-hint" }, "Interactúa con el sistema sin ser parte de él"));
      const outList = el("div", { class: "m1-placed" });
      outZone.appendChild(outList);
      stage.appendChild(outZone);

      card.appendChild(stage);
      const tray = el("div", { class: "m1-tray", style: { marginTop: "16px" } });
      card.appendChild(tray);
      const fb = el("div", { style: { marginTop: "14px" } });
      card.appendChild(fb);
      host.appendChild(contextCard());
      host.appendChild(card);

      let placed = 0;
      let selectedChip = null;
      function select(chip) {
        document.querySelectorAll("#final-host .node-chip").forEach((x) => x.classList.remove("selected"));
        if (selectedChip === chip) { selectedChip = null; return; }
        selectedChip = chip; chip.classList.add("selected");
      }
      function drop(chip, zone) {
        if (!zone) return;
        const target = chip || selectedChip;
        if (!target || target.classList.contains("used")) return;
        const e = st.elements.find((x) => x.id === target.dataset.node);
        const zoneId = zone.dataset.zone;
        const correct = (zoneId === "inside") === e.inside;
        const res = SS.scoring.answer("m5:" + st.id + ":" + e.id, correct);
        if (res.firstTry && correct) firstTryCount++;
        if (correct) {
          target.classList.add("used"); target.classList.remove("selected");
          if (selectedChip === target) selectedChip = null;
          const tag = el("span", { class: "mini-tag" }, e.icon + " " + e.label);
          (zoneId === "inside" ? inList : outList).appendChild(tag);
          placed++;
          feedback(fb, "ok", "Colocado correctamente", zoneId === "inside" ? `${e.label} es parte del proceso de entrega; forma parte del sistema.` : `${e.label} pertenece al entorno: interactúa con el sistema desde afuera.`, res.pts);
          const rect = target.getBoundingClientRect();
          SS.ui.floatPts(host, rect.left - 20, rect.top, `+${res.pts}`);
          if (placed === st.elements.length) {
            const panel = completionCard({ perfect: false, bonus: 0, onNext: () => { stageIdx++; draw(); } });
            panel.querySelector("button").textContent = "Siguiente etapa →";
            fb.appendChild(panel);
            SS.audio.play("complete");
          }
        } else {
          zone.style.animation = "shake .35s ease";
          setTimeout(() => (zone.style.animation = ""), 380);
          target.classList.remove("selected");
          if (selectedChip === target) selectedChip = null;
          feedback(fb, "err", "Todavía no", e.inside ? `${e.label} forma parte del proceso de entrega: colócalo dentro del sistema.` : `${e.label} está fuera de la frontera: pertenece al entorno.`, 0);
        }
        SS.ui.updateHUD(); SS.persist();
      }
      st.elements.forEach((e) => {
        const chip = el("div", { class: "node-chip", role: "button", tabindex: "0", "aria-label": "Colocar " + e.label });
        chip.appendChild(el("span", { class: "chip-icon" }, e.icon));
        chip.appendChild(el("span", {}, e.label));
        chip.dataset.node = e.id;
        tray.appendChild(chip);
        chip.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); select(chip); } });
        SS.ui.makeDraggable(chip, { zoneClass: "drop-zone", onTap: () => select(chip), onDrop: (ch, z) => drop(ch, z) });
      });
      [inZone, outZone].forEach((z) => {
        z.addEventListener("click", () => { if (selectedChip) drop(null, z); });
        z.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && selectedChip) { e.preventDefault(); drop(null, z); } });
      });
    }

    function stageS5(st) {
      const card = el("div", { class: "mission-card" });
      card.appendChild(el("h3", { style: { fontSize: "17px", marginBottom: "4px" } }, [el("span", { style: { color: "#ffb454" } }, st.title), " — " + st.task]));
      const fb = el("div", { style: { marginTop: "14px" } });
      host.appendChild(contextCard());
      host.appendChild(card);

      const controlState = { physical: { done: false }, economic: { done: false }, technical: { done: false, sel: new Set() }, temporal: { done: false, start: null, end: null } };
      let remaining = 4;

      function checkComplete() {
        if (remaining > 0) return;
        finishMission("m5", firstTryCount, total, startScore, (perfect, bonus) => {
          const panel = el("div", { class: "feedback ok", style: { marginTop: "16px" } });
          panel.appendChild(el("div", { class: "fb-head" }, perfect ? "Mapa del sistema perfecto" : "Mapa del sistema completado"));
          panel.appendChild(el("div", {}, "Definiste las cuatro fronteras del sistema de entrega de medicamentos."));
          if (bonus) panel.appendChild(el("div", { class: "fb-pts" }, `+${bonus} pts (bonus)`));
          const go = el("button", { class: "btn btn-primary", style: { marginTop: "12px" } }, "Ver mapa del sistema →");
          go.addEventListener("click", () => SS.router.go("results"));
          panel.appendChild(go);
          fb.appendChild(panel);
          SS.audio.play("complete");
          SS.ach.checkAll();
        });
      }

      // --- Física ---
      const ctrl = st.controls[0];
      const block = el("div", { class: "bassign-layout", style: { marginTop: "14px" } });
      const left = el("div");
      left.appendChild(el("div", { class: "label" }, ctrl.icon + " " + ctrl.title));
      left.appendChild(el("p", { style: { color: "#93aac7", fontSize: "13px", marginTop: "4px" } }, ctrl.hint));
      const options = el("div", { class: "m2-grid", style: { marginTop: "10px" } });
      ctrl.options.forEach((o) => {
        const oc = el("div", { class: "m2-option", role: "button", tabindex: "0" });
        oc.appendChild(el("div", { class: "m2-icon" }, o.icon));
        const t = el("div");
        t.appendChild(el("div", { class: "m2-name" }, o.label));
        t.appendChild(el("div", { class: "m2-desc" }, o.desc));
        oc.appendChild(t);
        options.appendChild(oc);
        const act = () => {
          if (controlState.physical.done) return;
          const res = SS.scoring.answer("m5:s5:physical:" + o.id, o.correct);
          if (o.correct) {
            controlState.physical.done = true;
            if (res.firstTry) firstTryCount++;
            remaining--;
            oc.classList.add("correct-picked");
            options.querySelectorAll(".m2-option").forEach((x) => (x.style.pointerEvents = "none"));
            left.appendChild(el("div", { class: "feedback ok", style: { marginTop: "10px" } }, "Frontera física definida."));
            checkComplete();
            SS.audio.play("boundary");
          } else {
            oc.classList.add("wrong-picked");
            setTimeout(() => oc.classList.remove("wrong-picked"), 420);
            SS.ui.toast({ title: "Todavía no", msg: o.desc, type: "err", timeout: 3000 });
          }
          SS.ui.updateHUD(); SS.persist();
        };
        oc.addEventListener("click", act);
        oc.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(); } });
      });
      left.appendChild(options);
      block.appendChild(left);

      // --- Económica ---
      const ec = st.controls[1];
      const right = el("div");
      right.appendChild(el("div", { class: "label" }, ec.icon + " " + ec.title));
      right.appendChild(el("p", { style: { color: "#93aac7", fontSize: "13px", marginTop: "4px" } }, ec.hint));
      const gauge = el("div", { class: "config-map", style: { marginTop: "10px", minHeight: "150px", padding: "10px" } });
      const gsvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      gsvg.setAttribute("viewBox", "0 0 340 140");
      gsvg.style.width = "100%";
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      ec.segments.forEach((seg) => {
        const x = 40 + seg.from * 260, w = (seg.to - seg.from) * 260;
        const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        r.setAttribute("x", x); r.setAttribute("y", 60); r.setAttribute("width", w); r.setAttribute("height", 26);
        r.setAttribute("rx", 13); r.setAttribute("fill", "rgba(255,209,102,.12)");
        r.setAttribute("stroke", "rgba(255,209,102,.5)");
        r.setAttribute("data-seg", seg.id);
        r.style.cursor = "pointer";
        const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
        t.setAttribute("x", x + w / 2); t.setAttribute("y", 44); t.setAttribute("text-anchor", "middle");
        t.setAttribute("font-size", "10"); t.setAttribute("fill", "#ffd166");
        t.textContent = seg.label;
        g.appendChild(r); g.appendChild(t);
        r.addEventListener("click", () => {
          if (controlState.economic.done) return;
          const res = SS.scoring.answer("m5:s5:economic:" + seg.id, seg.correct);
          if (seg.correct) {
            controlState.economic.done = true;
            if (res.firstTry) firstTryCount++;
            remaining--;
            r.setAttribute("fill", "rgba(255,209,102,.35)");
            g.querySelectorAll("rect").forEach((x) => (x.style.pointerEvents = "none"));
            right.appendChild(el("div", { class: "feedback ok", style: { marginTop: "10px" } }, "Frontera económica definida."));
            checkComplete();
            SS.audio.play("boundary");
          } else {
            r.setAttribute("fill", "rgba(255,93,108,.25)");
            setTimeout(() => r.setAttribute("fill", "rgba(255,209,102,.12)"), 500);
            SS.ui.toast({ title: "Todavía no", msg: "Ese rango no corresponde al presupuesto de operación logística.", type: "err", timeout: 3000 });
          }
          SS.ui.updateHUD(); SS.persist();
        });
      });
      gsvg.appendChild(g);
      gauge.appendChild(gsvg);
      right.appendChild(gauge);
      block.appendChild(right);
      card.appendChild(block);

      // --- Técnica ---
      const tc = st.controls[2];
      const tBlock = el("div", { style: { marginTop: "16px" } });
      tBlock.appendChild(el("div", { class: "label" }, tc.icon + " " + tc.title));
      tBlock.appendChild(el("p", { style: { color: "#93aac7", fontSize: "13px", marginTop: "4px" } }, tc.hint));
      const pills = el("div", { class: "skill-pill-wrap", style: { display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" } });
      const pillEls = {};
      tc.skills.forEach((s) => {
        const pill = el("button", { class: "skill-pill", "aria-pressed": "false" }, s.label);
        pill.addEventListener("click", () => {
          if (controlState.technical.done) return;
          if (controlState.technical.sel.has(s.id)) { controlState.technical.sel.delete(s.id); pill.classList.remove("on"); pill.setAttribute("aria-pressed", "false"); }
          else { controlState.technical.sel.add(s.id); pill.classList.add("on"); pill.setAttribute("aria-pressed", "true"); }
          SS.audio.play("select");
        });
        pillEls[s.id] = pill;
        pills.appendChild(pill);
      });
      const confT = el("button", { class: "btn btn-primary btn-sm", style: { marginTop: "10px" } }, "Confirmar frontera técnica");
      confT.addEventListener("click", () => {
        if (controlState.technical.done) return;
        const correctIds = tc.skills.filter((s) => s.correct).map((s) => s.id);
        const sel = [...controlState.technical.sel];
        const ok = correctIds.length === sel.length && correctIds.every((id) => sel.includes(id));
        const res = SS.scoring.answer("m5:s5:technical", ok);
        if (ok) {
          controlState.technical.done = true;
          if (res.firstTry) firstTryCount++;
          remaining--;
          tBlock.appendChild(el("div", { class: "feedback ok", style: { marginTop: "10px" } }, "Frontera técnica definida."));
          checkComplete();
          SS.audio.play("boundary");
        } else {
          const missing = correctIds.filter((id) => !sel.includes(id));
          const extra = sel.filter((id) => !correctIds.includes(id));
          const msg = [];
          if (missing.length) msg.push("Faltan: " + missing.map((id) => tc.skills.find((s) => s.id === id).label).join(", ") + ".");
          if (extra.length) msg.push("Sobran: " + extra.map((id) => tc.skills.find((s) => s.id === id).label).join(", ") + ".");
          feedback(fb, "err", "Ajusta la frontera técnica", msg.join(" "), 0);
        }
        SS.ui.updateHUD(); SS.persist();
      });
      tBlock.appendChild(pills);
      tBlock.appendChild(confT);
      card.appendChild(tBlock);

      // --- Temporal ---
      const tm = st.controls[3];
      const tmBlock = el("div", { style: { marginTop: "16px" } });
      tmBlock.appendChild(el("div", { class: "label" }, tm.icon + " " + tm.title));
      tmBlock.appendChild(el("p", { style: { color: "#93aac7", fontSize: "13px", marginTop: "4px" } }, tm.hint));
      const tl = el("div", { class: "timeline", style: { marginTop: "14px", width: "100%" } });
      const track = el("div", { class: "timeline-track", style: { height: "18px", position: "relative", cursor: "crosshair" } });
      const tlFill = el("i", { style: { display: "block", position: "absolute", top: "0", bottom: "0", background: "rgba(126,240,160,.45)", left: "0%", width: "0%", borderRadius: "6px" } });
      track.appendChild(tlFill);
      const markStart = el("span", { style: { position: "absolute", top: "-4px", width: "4px", height: "26px", background: "#7ef0a0", left: "0%", display: "none" } });
      const markEnd = el("span", { style: { position: "absolute", top: "-4px", width: "4px", height: "26px", background: "rgba(126,240,160,.5)", left: "0%", display: "none" } });
      track.appendChild(markStart); track.appendChild(markEnd);
      tl.appendChild(track);
      const hours = el("div", { style: { display: "flex", justifyContent: "space-between", marginTop: "6px", fontFamily: "var(--font-mono)", fontSize: "10px", color: "#93aac7" } });
      hours.appendChild(el("span", {}, "0"));
      hours.appendChild(el("span", {}, "6"));
      hours.appendChild(el("span", {}, "12"));
      hours.appendChild(el("span", {}, "18"));
      hours.appendChild(el("span", {}, "23"));
      tl.appendChild(hours);
      const mode = el("div", { style: { display: "flex", gap: "8px", marginTop: "10px", alignItems: "center" } });
      const modeBtn = el("button", { class: "btn btn-ghost btn-sm", "aria-pressed": "false" }, "Modo: inicio");
      let modeIsStart = true;
      modeBtn.addEventListener("click", () => {
        modeIsStart = !modeIsStart;
        modeBtn.textContent = "Modo: " + (modeIsStart ? "inicio" : "fin");
        modeBtn.setAttribute("aria-pressed", String(modeIsStart));
      });
      mode.appendChild(modeBtn);
      const readout = el("span", { style: { fontFamily: "var(--font-mono)", fontSize: "12px", color: "#7ef0a0" } }, "inicio: — · fin: —");
      mode.appendChild(readout);
      tl.appendChild(mode);
      function setHour(e) {
        if (controlState.temporal.done) return;
        const rect = track.getBoundingClientRect();
        const frac = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
        const h = Math.round(frac * 23);
        if (modeIsStart) {
          controlState.temporal.start = h;
          markStart.style.left = (h / 23) * 100 + "%";
          markStart.style.display = "block";
        } else {
          controlState.temporal.end = h;
          markEnd.style.left = (h / 23) * 100 + "%";
          markEnd.style.display = "block";
        }
        updateTl();
        SS.audio.play("select");
      }
      function updateTl() {
        const { start, end } = controlState.temporal;
        readout.textContent = `inicio: ${start === null ? "—" : start + ":00"} · fin: ${end === null ? "—" : end + ":00"}`;
        if (start !== null && end !== null) {
          tlFill.style.left = (start / 23) * 100 + "%";
          tlFill.style.width = ((end - start) / 23) * 100 + "%";
        }
      }
      track.addEventListener("click", setHour);
      track.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { setHour({ clientX: track.getBoundingClientRect().left + track.getBoundingClientRect().width / 2 }); } });
      track.setAttribute("tabindex", "0");
      track.setAttribute("role", "button");
      track.setAttribute("aria-label", "Línea de tiempo: selecciona inicio y fin");
      const confTm = el("button", { class: "btn btn-primary btn-sm", style: { marginTop: "10px" } }, "Confirmar frontera temporal");
      confTm.addEventListener("click", () => {
        if (controlState.temporal.done) return;
        const { start, end } = controlState.temporal;
        if (start === null || end === null) { SS.ui.toast({ title: "Selecciona el ciclo", msg: "Marca primero el inicio y después el fin en la línea de tiempo.", type: "warn" }); return; }
        const ok = start === tm.startCorrect && end === tm.endCorrect;
        const res = SS.scoring.answer("m5:s5:temporal", ok);
        if (ok) {
          controlState.temporal.done = true;
          if (res.firstTry) firstTryCount++;
          remaining--;
          tmBlock.appendChild(el("div", { class: "feedback ok", style: { marginTop: "10px" } }, "Frontera temporal definida."));
          checkComplete();
          SS.audio.play("boundary");
        } else {
          feedback(fb, "err", "Todavía no", `El ciclo diario de entrega no es de ${start}:00 a ${end}:00. FarmaPlus entrega en el horario laboral, de las 8:00 a las 18:00.`, 0);
        }
        SS.ui.updateHUD(); SS.persist();
      });
      tmBlock.appendChild(tl);
      tmBlock.appendChild(confTm);
      card.appendChild(tmBlock);
      card.appendChild(fb);
    }

    draw();
  }

  /* =========================================================
     RESULTADOS — Mapa del sistema
     ========================================================= */
  function renderResults() {
    const host = document.getElementById("results-host");
    host.innerHTML = "";
    const st = SS.state.get();

    const head = el("div", { class: "mission-head" });
    const info = el("div");
    info.appendChild(el("h2", { class: "mission-title" }, ["Mapa del ", el("span", {}, "Sistema")]));
    info.appendChild(el("p", { class: "mission-sub" }, "Sistema de entrega de medicamentos · FarmaPlus"));
    head.appendChild(info);
    const actions = el("div", { class: "mission-actions" });
    const verBtn = el("button", { class: "btn btn-violet" }, "VER ANÁLISIS");
    verBtn.addEventListener("click", () => SS.missions.showAnalysis());
    actions.appendChild(verBtn);
    const progBtn = el("button", { class: "btn btn-ghost" }, "Mapa de progreso");
    progBtn.addEventListener("click", () => SS.router.go("progress"));
    actions.appendChild(progBtn);
    head.appendChild(actions);
    host.appendChild(head);

    // Mapa SVG
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 900 620");
    svg.classList.add("final-svg");
    const defs = document.createElementNS(NS, "defs");
    const grad = document.createElementNS(NS, "radialGradient");
    grad.setAttribute("id", "fsGlow");
    grad.innerHTML = '<stop offset="0%" stop-color="rgba(78,230,255,.25)"/><stop offset="100%" stop-color="transparent"/>';
    defs.appendChild(grad);
    svg.appendChild(defs);

    function rect(x, y, w, h, fill, stroke, label, sub, centerY) {
      const g = document.createElementNS(NS, "g");
      const r = document.createElementNS(NS, "rect");
      r.setAttribute("x", x); r.setAttribute("y", y); r.setAttribute("width", w); r.setAttribute("height", h); r.setAttribute("rx", "14");
      r.setAttribute("fill", fill); r.setAttribute("stroke", stroke); r.setAttribute("stroke-width", "1.4");
      g.appendChild(r);
      const t = document.createElementNS(NS, "text");
      t.setAttribute("x", x + w / 2); t.setAttribute("y", y + (centerY || h / 2 + 5));
      t.setAttribute("text-anchor", "middle"); t.setAttribute("fill", "#e6f4ff"); t.setAttribute("font-size", "15"); t.setAttribute("font-weight", "700");
      t.textContent = label;
      g.appendChild(t);
      if (sub) {
        const s = document.createElementNS(NS, "text");
        s.setAttribute("x", x + w / 2); s.setAttribute("y", y + (centerY || h / 2 + 22));
        s.setAttribute("text-anchor", "middle"); s.setAttribute("fill", "rgba(230,244,255,.6)"); s.setAttribute("font-size", "10"); s.setAttribute("letter-spacing", "0.14em");
        s.textContent = sub;
        g.appendChild(s);
      }
      return g;
    }
    function text(x, y, str, fill, size) {
      const t = document.createElementNS(NS, "text");
      t.setAttribute("x", x); t.setAttribute("y", y); t.setAttribute("text-anchor", "middle");
      t.setAttribute("fill", fill); t.setAttribute("font-size", size);
      t.textContent = str;
      return t;
    }
    function line(x1, y1, x2, y2, stroke, dash) {
      const l = document.createElementNS(NS, "line");
      l.setAttribute("x1", x1); l.setAttribute("y1", y1); l.setAttribute("x2", x2); l.setAttribute("y2", y2);
      l.setAttribute("stroke", stroke); l.setAttribute("stroke-width", "1.4"); l.setAttribute("stroke-dasharray", dash || "3 5");
      return l;
    }

    // Entorno (afuera)
    svg.appendChild(text(450, 30, "ENTORNO", "#7b93b0", 11));
    const envs = [["Pacientes", 90, 90], ["Hospitales", 810, 90], ["Proveedores", 120, 560], ["Regulación sanitaria", 780, 560], ["Tráfico y clima", 450, 90]];
    envs.forEach(([name, x, y]) => {
      svg.appendChild(text(x, y, "◍ " + name, "#7b93b0", 12));
    });

    // Suprasistema
    svg.appendChild(rect(250, 60, 400, 92, "rgba(139,92,246,.16)", "#8b5cf6", "FarmaPlus (organización)", "SUPRASISTEMA"));
    svg.appendChild(line(450, 152, 450, 190, "rgba(139,92,246,.5)"));

    // Sistema central
    svg.appendChild(rect(220, 190, 460, 220, "rgba(78,230,255,.12)", "#4ee6ff", "Sistema de entrega de medicamentos", "SISTEMA"));
    const subs = [["Recepción de pedidos", 270, 250], ["Inventario", 450, 250], ["Preparación", 630, 250], ["Reparto", 450, 330]];
    subs.forEach(([name, x, y]) => {
      svg.appendChild(rect(x - 88, y - 22, 176, 44, "rgba(45,212,191,.18)", "#2dd4bf", name, "", y));
    });

    // Fronteras
    svg.appendChild(text(70, 235, "📍", "#4ee6ff", 20));
    svg.appendChild(text(70, 255, "Física", "#4ee6ff", 11));
    svg.appendChild(text(830, 235, "💰", "#ffd166", 20));
    svg.appendChild(text(830, 255, "Económica", "#ffd166", 11));
    svg.appendChild(text(70, 345, "⚙️", "#b388ff", 20));
    svg.appendChild(text(70, 365, "Técnica", "#b388ff", 11));
    svg.appendChild(text(830, 345, "⏱️", "#7ef0a0", 20));
    svg.appendChild(text(830, 365, "Temporal", "#7ef0a0", 11));

    // Línea de frontera física
    svg.appendChild(line(120, 430, 780, 430, "#4ee6ff", "6 6"));

    // Borde inferior de sistema + entrada/salida
    svg.appendChild(text(450, 500, "ENTRADA · procesamiento · SALIDA  →  medicamentos entregados", "#93aac7", 11));
    svg.appendChild(text(450, 545, "El análisis delimita el alcance y distingue el sistema de su entorno.", "#93aac7", 11));

    const box = el("div", { class: "final-map-wrap" });
    box.appendChild(svg);
    host.appendChild(box);

    // Leyenda
    const legend = el("div", { class: "legend", style: { marginTop: "12px" } });
    const legs = [
      ["#4ee6ff", "Sistema"], ["#2dd4bf", "Subsistema"], ["#8b5cf6", "Suprasistema"], ["#7b93b0", "Entorno"],
      ["#4ee6ff", "Frontera física"], ["#ffd166", "Frontera económica"], ["#b388ff", "Frontera técnica"], ["#7ef0a0", "Frontera temporal"]
    ];
    legs.forEach(([c, l]) => {
      const it = el("span", { class: "legend-item" });
      const d = el("span", { class: "legend-dot", style: { borderColor: c } });
      it.appendChild(d);
      it.appendChild(el("span", {}, l));
      legend.appendChild(it);
    });
    host.appendChild(legend);

    // Estadísticas
    const stats = el("div", { class: "result-stats" });
    const statArr = [
      [st.score.toLocaleString("es-MX"), "Puntos totales"],
      [SS.scoring.precision() + "%", "Precisión"],
      [st.stats.correct, "Relaciones correctas"],
      [st.stats.hints, "Pistas utilizadas"],
      [SS.ach.unlockedCount() + "/" + SS.ach.defs.length, "Logros"]
    ];
    statArr.forEach(([v, l]) => {
      const s = el("div", { class: "result-stat" });
      s.appendChild(el("b", {}, v));
      s.appendChild(el("span", {}, l));
      stats.appendChild(s);
    });
    host.appendChild(stats);

    const foot = el("div", { style: { marginTop: "16px", display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" } });
    const ach = el("button", { class: "btn btn-ghost" }, "Ver logros");
    ach.addEventListener("click", () => SS.router.go("achievements"));
    const reiniciar = el("button", { class: "btn btn-ghost" }, "Explorar de nuevo");
    reiniciar.addEventListener("click", () => SS.router.go("explorer"));
    foot.appendChild(ach); foot.appendChild(reiniciar);
    host.appendChild(foot);
  }

  function showAnalysis() {
    const st = SS.state.get();
    const body = [];
    body.push(el("p", {}, "El sistema principal es el <b>sistema de entrega de medicamentos</b> de FarmaPlus."));
    body.push(el("p", {}, "Sus <b>subsistemas</b> son la recepción de pedidos, el inventario, la preparación y el reparto: cada uno forma parte del todo y tiene procesos propios."));
    body.push(el("p", {}, "El <b>suprasistema</b> inmediato es FarmaPlus, la organización que contiene al proceso. El <b>entorno</b> está formado por pacientes, hospitales, proveedores, la regulación sanitaria y las condiciones de tráfico y clima."));
    body.push(el("p", {}, "Sus <b>fronteras</b> son: física (almacén + rutas de reparto), económica (presupuesto de operación logística), técnica (capacidades de logística, validación y manejo de medicamentos) y temporal (ciclo diario de entrega, de las 8:00 a las 18:00)."));
    body.push(el("p", { style: { color: "#4ee6ff", fontSize: "13px" } }, "Precisión: " + SS.scoring.precision() + "% · Puntos: " + st.score.toLocaleString("es-MX")));
    SS.ui.modal({ title: "Análisis del sistema", bodyNodes: body, actions: [{ label: "Entendido", class: "btn btn-primary" }] });
  }

  return { renderM1, renderM2, renderM3, renderM4, renderFinal, renderResults, showAnalysis };
})();
