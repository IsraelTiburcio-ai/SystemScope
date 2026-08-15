/* ============================================================
   BOUNDARY RUN — Microjuego arcade (60–100 s)
   Una mecánica: toca la puerta de la frontera correcta.
   ============================================================ */
(() => {
  "use strict";

  const $ = (s) => document.querySelector(s);
  const SOUND_KEY = "boundaryrun_sound";
  const BEST_KEY = "boundaryrun_best";

  const ROUNDS = 6;          // decisiones por partida
  const SITUATION_MS = 10000; // tiempo por situación (10 s)
  const LANES = [12.5, 37.5, 62.5, 87.5];

  let sound = localStorage.getItem(SOUND_KEY) !== "0";
  let best = parseInt(localStorage.getItem(BEST_KEY) || "0", 10) || 0;

  const state = {
    playing: false,
    idx: 0,
    correct: 0,
    combo: 0,
    maxCombo: 0,
    score: 0,
    marks: [],
    answers: [],
    speed: 1,
    startAt: 0,
    timerId: null,
    locked: false,
    round: []
  };

  /* ---------------- Audio sintetizado ---------------- */
  const audio = (() => {
    let ctx = null;
    function tone(freq, dur, type, vol, delay, slide) {
      if (!sound) return;
      try {
        if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === "suspended") ctx.resume();
        const t0 = ctx.currentTime + (delay || 0);
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = type || "sine";
        o.frequency.setValueAtTime(freq, t0);
        if (slide) o.frequency.exponentialRampToValueAtTime(slide, t0 + dur);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(vol || 0.14, t0 + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        o.connect(g).connect(ctx.destination);
        o.start(t0);
        o.stop(t0 + dur + 0.05);
      } catch (e) { /* sin audio */ }
    }
    return {
      play(name) {
        switch (name) {
          case "select": tone(520, 0.07, "triangle", 0.1); break;
          case "correct": tone(660, 0.1, "triangle", 0.13); tone(990, 0.14, "triangle", 0.12, 0.09); break;
          case "combo": tone(660, 0.09, "triangle", 0.13); tone(880, 0.09, "triangle", 0.13, 0.07); tone(1320, 0.16, "triangle", 0.13, 0.14); break;
          case "wrong": tone(220, 0.2, "sawtooth", 0.08, 0, 150); break;
          case "tick": tone(880, 0.03, "sine", 0.05); break;
          case "finish": tone(523, 0.12, "triangle", 0.13); tone(659, 0.12, "triangle", 0.13, 0.11); tone(784, 0.12, "triangle", 0.13, 0.22); tone(1046, 0.3, "triangle", 0.15, 0.33); break;
        }
      }
    };
  })();

  /* ---------------- Utilidades ---------------- */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pickRound() {
    const byKind = {};
    for (const s of window.SITUATIONS) (byKind[s.kind] = byKind[s.kind] || []).push(s);
    const chosen = [];
    const kinds = shuffle(Object.keys(byKind));
    kinds.forEach((k) => chosen.push(byKind[k][Math.floor(Math.random() * byKind[k].length)]));
    while (chosen.length < ROUNDS) chosen.push(window.SITUATIONS[Math.floor(Math.random() * window.SITUATIONS.length)]);
    return shuffle(chosen);
  }

  function starsFor(correct) {
    const n = correct >= 6 ? 5 : correct >= 5 ? 4 : correct >= 4 ? 3 : correct >= 3 ? 2 : 1;
    return "★".repeat(n) + "☆".repeat(5 - n);
  }

  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Pantallas ---------------- */
  function show(sectionId) {
    document.querySelectorAll(".screen").forEach((s) => { s.hidden = s.id !== sectionId; });
  }

  /* ---------------- Portada ---------------- */
  function drawCoverRunner() {
    const el = $("#cover-runner");
    el.innerHTML = '<svg viewBox="0 0 64 64" class="runner-svg"><ellipse class="runner-body" cx="32" cy="34" rx="20" ry="24" fill="#2aa9c9"/><rect class="runner-visor" x="24" y="22" width="26" height="12" rx="6" fill="#0a1830"/><circle cx="30" cy="28" r="2.4" fill="#4ee6ff"/><circle cx="40" cy="28" r="2.4" fill="#4ee6ff"/><g class="runner-legs" stroke="#0a1830" stroke-width="5" stroke-linecap="round"><line class="leg leg-a" x1="24" y1="54" x2="20" y2="62"/><line class="leg leg-b" x1="40" y1="54" x2="44" y2="62"/></g></svg>';
  }

  function refreshBestUI() {
    $("#best-chip").textContent = best ? "MEJOR: " + best.toLocaleString("es-MX") : "MEJOR: —";
    $("#res-best").textContent = "MEJOR: " + (best ? best.toLocaleString("es-MX") : "—");
  }

  function refreshSoundUI() {
    const icon = sound ? "🔊" : "🔇";
    $("#btn-sound").textContent = icon;
    $("#btn-sound").setAttribute("aria-label", sound ? "Desactivar sonido" : "Activar sonido");
  }

  /* ---------------- Partida ---------------- */
  function play() {
    audio.play("select");
    state.playing = true;
    state.idx = 0;
    state.correct = 0;
    state.combo = 0;
    state.maxCombo = 0;
    state.score = 0;
    state.marks = [];
    state.answers = [];
    state.speed = 1;
    state.startAt = performance.now();
    state.locked = false;
    state.round = pickRound();

    $("#result").hidden = true;
    $("#review").hidden = true;
    $("#hud-score").textContent = "0";
    $("#hud-time").textContent = "0s";
    buildDots();
    setSpeed(1);
    resetRunner();
    show("game");
    showSituation();
  }

  function buildDots() {
    const box = $("#hud-dots");
    box.innerHTML = "";
    for (let i = 0; i < ROUNDS; i++) {
      const d = document.createElement("span");
      d.className = "dot";
      d.setAttribute("aria-label", "Situación " + (i + 1));
      box.appendChild(d);
    }
  }

  function showSituation() {
    const s = state.round[state.idx];
    const el = $("#situation");
    el.textContent = s.text;
    el.classList.remove("in");
    void el.offsetWidth;
    el.classList.add("in");
    startTimer();
  }

  function startTimer() {
    clearTimeout(state.timerId);
    const fill = $("#situation-fill");
    fill.style.transition = "none";
    fill.style.width = "100%";
    void fill.offsetWidth;
    fill.style.transition = "width " + SITUATION_MS + "ms linear";
    fill.style.width = "0%";
    state.timerId = setTimeout(() => {
      if (state.playing && !state.locked) answer(null);
    }, SITUATION_MS);
  }

  function setSpeed(v) {
    state.speed = Math.max(1, Math.min(4, v));
    $("#track-lines").style.animationDuration = (1.1 / state.speed).toFixed(3) + "s";
  }

  function resetRunner() {
    const r = $("#runner");
    r.style.left = "50%";
    r.classList.remove("dash", "bump", "gone");
  }

  function runnerToLane(laneIndex, then) {
    const r = $("#runner");
    r.style.left = LANES[laneIndex] + "%";
    setTimeout(then, 170);
  }

  /* ---------------- Decisión ---------------- */
  function answer(kind) {
    if (!state.playing || state.locked) return;
    state.locked = true;
    clearTimeout(state.timerId);

    const s = state.round[state.idx];
    const lane = window.DOORS.findIndex((d) => d.kind === kind);
    const correct = kind === s.kind;
    state.answers.push({ text: s.text, kind: s.kind, note: s.note, ok: correct, chosen: kind });

    if (correct) {
      state.combo += 1;
      state.maxCombo = Math.max(state.maxCombo, state.combo);
      state.correct += 1;
      const pts = 100 + (state.combo - 1) * 50;
      state.score += pts;
      state.marks.push(true);
      audio.play(state.combo > 1 ? "combo" : "correct");
      document.querySelector('.door[data-kind="' + kind + '"]').classList.add("open");
      burstAt(lane, true, 0.45);
      const gained = document.createElement("div");
      gained.className = "float-gain";
      gained.textContent = "+" + pts + (state.combo > 1 ? "  ×" + state.combo : "");
      $("#track").appendChild(gained);
      const obs = spawnObstacle(lane, "mid");
      runnerToLane(lane, () => {
        const r = $("#runner");
        r.classList.add("jump");
        setTimeout(() => {
          if (obs) { obs.classList.add("cleared"); setTimeout(() => obs.remove(), 500); }
        }, 200);
        setTimeout(() => {
          r.classList.remove("jump");
          landingDust(lane);
          resetRunner();
          afterFeedback(true);
        }, 430);
      });
    } else {
      state.combo = 0;
      state.marks.push(false);
      audio.play("wrong");
      if (kind) {
        document.querySelector('.door[data-kind="' + kind + '"]').classList.add("wrong");
        burstAt(lane, false, 0.72);
      }
      if (lane >= 0) {
        const obs = spawnObstacle(lane, "near");
        runnerToLane(lane, () => {
          const r = $("#runner");
          r.classList.add("crash");
          setTimeout(() => {
            if (obs) { obs.classList.add("broken"); setTimeout(() => obs.remove(), 500); }
          }, 70);
          setTimeout(() => {
            r.classList.remove("crash");
            resetRunner();
            afterFeedback(false);
          }, 490);
        });
      } else {
        const r = $("#runner");
        r.classList.add("stumble");
        setTimeout(() => {
          r.classList.remove("stumble");
          afterFeedback(false);
        }, 520);
      }
    }
    updateHUD();
  }

  function afterFeedback(ok) {
    const door = $(".door.open, .door.wrong");
    setTimeout(() => {
      if (door) door.classList.remove("open", "wrong");
      if (ok) flashNote();
      advance();
    }, ok ? 460 : 400);
  }

  function flashNote() {
    const s = state.round[Math.min(state.idx, state.round.length - 1)];
    const tag = document.createElement("div");
    tag.className = "frontier-tag";
    const doorName = window.DOORS.find((d) => d.kind === s.kind).name;
    tag.innerHTML = "<b>" + doorName + "</b> · " + s.note;
    $("#situation-box").appendChild(tag);
    setTimeout(() => tag.remove(), 1300);
  }

  function advance() {
    state.idx += 1;
    if (state.idx >= ROUNDS) {
      finish();
      return;
    }
    state.locked = false;
    showSituation();
  }

  function updateHUD() {
    $("#hud-score").textContent = state.score.toLocaleString("es-MX");
    const dots = $("#hud-dots").children;
    for (let i = 0; i < state.marks.length; i++) {
      dots[i].classList.add(state.marks[i] ? "ok" : "no");
    }
  }

  /* ---------------- Partículas ---------------- */
  function burstAt(laneIndex, ok, yFrac) {
    const track = $("#track");
    const x = (LANES[laneIndex] / 100) * track.clientWidth;
    const y = track.clientHeight * (yFrac == null ? 0.45 : yFrac);
    const colors = ok ? ["#4ee6ff", "#3ddc84", "#2dd4bf"] : ["#ff5d6c", "#ffb454"];
    for (let i = 0; i < (ok ? 14 : 8); i++) {
      const p = document.createElement("span");
      p.className = "spark";
      const a = Math.random() * Math.PI * 2;
      const dist = 30 + Math.random() * 70;
      p.style.setProperty("--dx", Math.cos(a) * dist + "px");
      p.style.setProperty("--dy", Math.sin(a) * dist + "px");
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.left = x + "px";
      p.style.top = y + "px";
      track.appendChild(p);
      setTimeout(() => p.remove(), 650);
    }
  }

  /* Obstáculo en un carril (mid = en el camino, near = justo frente al corredor) */
  function spawnObstacle(laneIndex, pos) {
    const o = document.createElement("div");
    o.className = "obstacle";
    o.style.left = LANES[laneIndex] + "%";
    o.style.bottom = pos === "near" ? "15%" : "30%";
    $("#track").appendChild(o);
    return o;
  }

  /* Polvo al aterrizar */
  function landingDust(laneIndex) {
    burstAt(laneIndex, true, 0.86);
  }

  /* ---------------- Final ---------------- */
  function finish() {
    state.playing = false;
    if (state.correct === ROUNDS) state.score += 200;
    audio.play("finish");
    $("#situation-fill").style.width = "0%";
    const r = $("#runner");
    r.classList.add("dash", "gone");
    r.style.left = "50%";

    const seconds = Math.round((performance.now() - state.startAt) / 1000);
    $("#res-correct").textContent = state.correct + "/" + ROUNDS;
    $("#res-time").textContent = seconds + " s";
    $("#res-speed").textContent = starsFor(state.correct);
    $("#res-score").textContent = state.score.toLocaleString("es-MX");
    if (state.score > best) {
      best = state.score;
      try { localStorage.setItem(BEST_KEY, String(best)); } catch (e) { /* noop */ }
    }
    refreshBestUI();
    renderReview();
    setTimeout(() => { $("#result").hidden = false; $("#btn-again").focus(); }, 500);
  }

  /* ---------------- Revisión de respuestas ---------------- */
  function renderReview() {
    const list = $("#review-list");
    list.innerHTML = "";
    state.answers.forEach((a, i) => {
      const door = window.DOORS.find((d) => d.kind === a.kind);
      const row = document.createElement("div");
      row.className = "rev-row";
      row.style.animationDelay = (i * 0.06) + "s";
      const num = document.createElement("span");
      num.className = "rev-num";
      num.textContent = i + 1;
      const text = document.createElement("div");
      text.className = "rev-text";
      text.textContent = a.text;
      const status = document.createElement("span");
      status.className = "rev-status " + (a.ok ? "ok" : "no");
      status.textContent = a.ok ? "✓" : "✗";
      const kind = document.createElement("span");
      kind.className = "rev-kind d-" + a.kind;
      kind.style.setProperty("--door", getComputedStyle(document.querySelector(".d-" + a.kind)).getPropertyValue("--door"));
      kind.style.setProperty("--door-bg", getComputedStyle(document.querySelector(".d-" + a.kind)).getPropertyValue("--door-bg"));
      kind.textContent = door.icon + " " + door.name + " · " + a.note;
      row.appendChild(num);
      row.appendChild(text);
      row.appendChild(status);
      row.appendChild(kind);
      if (!a.ok && a.chosen) {
        const chosenDoor = window.DOORS.find((d) => d.kind === a.chosen);
        const picked = document.createElement("div");
        picked.className = "rev-picked";
        picked.innerHTML = "Elegiste: <b>" + (chosenDoor ? chosenDoor.name : "—") + "</b>";
        row.appendChild(picked);
      }
      list.appendChild(row);
    });
  }

  function restart() {
    play();
  }

  /* ---------------- Sonido / persistencia ---------------- */
  function toggleSound() {
    sound = !sound;
    try { localStorage.setItem(SOUND_KEY, sound ? "1" : "0"); } catch (e) { /* noop */ }
    refreshSoundUI();
    if (sound) audio.play("select");
  }

  /* ---------------- Fondo (estrellas) ---------------- */
  function initBackground() {
    const canvas = $("#bg");
    const ctx = canvas.getContext("2d");
    let W, H;
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener("resize", resize);
    const stars = [];
    for (let i = 0; i < 40; i++) stars.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.6 + 0.4, v: Math.random() * 0.25 + 0.05 });
    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        s.y += s.v;
        if (s.y > H) s.y = 0;
        ctx.fillStyle = "rgba(120,190,235,0.5)";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduced()) requestAnimationFrame(frame);
    }
    if (!reduced()) requestAnimationFrame(frame);
  }

  /* ---------------- Cronómetro del HUD ---------------- */
  setInterval(() => {
    if (state.playing) {
      const s = Math.floor((performance.now() - state.startAt) / 1000);
      const el = $("#hud-time");
      if (el.textContent !== s + "s") { el.textContent = s + "s"; if (sound && s > 0) audio.play("tick"); }
    }
  }, 1000);

  /* ---------------- Eventos ---------------- */
  document.querySelectorAll(".door").forEach((d) => {
    d.addEventListener("click", () => answer(d.dataset.kind));
  });
  $("#btn-play").addEventListener("click", play);
  $("#btn-again").addEventListener("click", restart);
  $("#btn-again2").addEventListener("click", restart);
  $("#btn-restart").addEventListener("click", restart);
  $("#btn-sound").addEventListener("click", toggleSound);
  $("#btn-review").addEventListener("click", () => { $("#review").hidden = false; $("#btn-review-back").focus(); });
  $("#btn-review-back").addEventListener("click", () => { $("#review").hidden = true; $("#btn-review").focus(); });

  document.addEventListener("keydown", (e) => {
    if (e.key >= "1" && e.key <= "4") answer(window.DOORS[+e.key - 1].kind);
    if ((e.key === "Enter" || e.key === " ") && !state.playing && !$("#result").hidden) restart();
    if (e.key === "Enter" && document.getElementById("cover").hidden === false && !state.playing) play();
  });

  /* ---------------- Init ---------------- */
  refreshSoundUI();
  refreshBestUI();
  drawCoverRunner();
  initBackground();

  /* Gancho para pruebas automáticas */
  window.BR = { play, answer, restart, get state() { return state; } };
})();
