/* ============================================================
   SYSTEM SCOPE — Utilidades de interfaz, íconos SVG, toasts, modales
   ============================================================ */
window.SS = window.SS || {};

SS.ui = (() => {
  /* ---------- Creación de elementos ---------- */
  function el(tag, props = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (k === "class") node.className = v;
      else if (k === "style" && typeof v === "object") Object.assign(node.style, v);
      else if (k === "dataset") Object.assign(node.dataset, v);
      else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === "html") node.innerHTML = v;
      else node.setAttribute(k, v);
    }
    const kids = Array.isArray(children) ? children : [children];
    for (const c of kids) {
      if (c == null || c === false) continue;
      node.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
    }
    return node;
  }

  /* ---------- Íconos SVG propios ---------- */
  const LOGO = (cls = "") => `
    <svg class="${cls}" viewBox="0 0 48 48" aria-hidden="true">
      <g class="logo-ring">
        <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" stroke-opacity=".25" stroke-width="1.5" stroke-dasharray="3 6"/>
      </g>
      <circle cx="24" cy="24" r="14" fill="none" stroke="currentColor" stroke-opacity=".5" stroke-width="1.5"/>
      <circle cx="24" cy="24" r="6.5" fill="none" stroke="currentColor" stroke-width="1.6"/>
      <circle cx="24" cy="24" r="2.3" fill="currentColor"/>
    </svg>`;

  const ICONS = {
    "sound-on": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/></svg>`,
    "sound-off": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none"/><path d="M16 9l5 6M21 9l-5 6"/></svg>`,
    observatory: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="6.5"/><circle cx="10" cy="10" r="3"/><path d="M10 2v1.5M10 16.5V18M18 10h-1.5M3.5 10H2M15.2 4.8l-1 1M5.8 14.2l-1 1M5.8 5.8l1 1M15.2 15.2l1 1"/><path d="M14.5 14.5L20 20"/></svg>`,
    progress: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/></svg>`,
    trophy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10v4a5 5 0 0 1-10 0V4z"/><path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3"/><path d="M12 13v4M9 21h6M10 17h4"/></svg>`,
    help: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.2"/><path d="M9.3 9a2.8 2.8 0 1 1 4 2.6c-.8.4-1.3 1-1.3 1.9"/><circle cx="12" cy="17" r=".4" fill="currentColor"/></svg>`,
    home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>`
  };

  function svgIcon(name) {
    return ICONS[name] || "";
  }

  /* Sustituye los placeholders #XXX# en el documento. */
  function mountIcons() {
    const map = {
      "#LOGO#": LOGO(),
      "#SOUND-ON#": svgIcon("sound-on"),
      "#SOUND-OFF#": svgIcon("sound-off"),
      "#OBS#": svgIcon("observatory"),
      "#PROG#": svgIcon("progress"),
      "#TROPHY#": svgIcon("trophy"),
      "#HELP#": svgIcon("help"),
      "#HOME#": svgIcon("home")
    };
    document.body.innerHTML = document.body.innerHTML.replace(/#(LOGO|SOUND-ON|SOUND-OFF|OBS|PROG|TROPHY|HELP|HOME)#/g, (m) => map[m] || m);
  }

  /* ---------- Toasts ---------- */
  function toast({ title, msg, type = "", pts = null, timeout = 4200 }) {
    const region = document.getElementById("toast-region");
    const t = el("div", { class: `toast ${type}`, role: "status" });
    const iconMap = { ok: "✓", err: "✕", warn: "!" };
    t.appendChild(el("div", { class: "toast-icon" }, iconMap[type] || "●"));
    const body = el("div", { class: "toast-body" });
    body.appendChild(el("div", { class: "toast-title" }, title));
    body.appendChild(el("div", { class: "toast-msg" }, msg));
    if (pts !== null) body.appendChild(el("div", { class: "toast-pts" }, `${pts >= 0 ? "+" : ""}${pts} pts`));
    t.appendChild(body);
    region.appendChild(t);
    setTimeout(() => { t.style.opacity = "0"; t.style.transition = "opacity .4s"; }, timeout);
    setTimeout(() => t.remove(), timeout + 420);
  }

  function achieveToast(def) {
    const region = document.getElementById("toast-region");
    const t = el("div", { class: "achievement-toast", role: "status" });
    t.appendChild(el("div", { class: "at-icon" }, def.icon));
    const body = el("div");
    body.appendChild(el("div", { class: "at-title" }, "Logro desbloqueado"));
    body.appendChild(el("div", { class: "at-name" }, def.name));
    body.appendChild(el("div", { class: "at-desc" }, def.desc));
    t.appendChild(body);
    region.appendChild(t);
    setTimeout(() => { t.style.opacity = "0"; t.style.transition = "opacity .4s"; }, 5200);
    setTimeout(() => t.remove(), 5650);
  }

  /* ---------- Modales ---------- */
  function modal({ title, bodyNodes = [], actions = [], onClose = null }) {
    const overlay = el("div", { class: "modal-overlay" });
    const box = el("div", { class: "modal", role: "dialog", "aria-modal": "true", "aria-label": title });
    const head = el("div", { class: "modal-head" });
    head.appendChild(el("h3", { class: "modal-title" }, title));
    const closeBtn = el("button", { class: "modal-close", "aria-label": "Cerrar", tabindex: "0" }, "✕");
    head.appendChild(closeBtn);
    box.appendChild(head);
    const body = el("div", { class: "modal-body" });
    for (const n of bodyNodes) body.appendChild(n);
    box.appendChild(body);
    const actionRow = el("div", { class: "modal-actions" });
    for (const a of actions) {
      const btn = el("button", { class: a.class || "btn btn-ghost", ...(a.attrs || {}) }, a.label);
      if (a.onClick) btn.addEventListener("click", (e) => a.onClick(e, close));
      actionRow.appendChild(btn);
    }
    box.appendChild(actionRow);
    overlay.appendChild(box);
    document.getElementById("modal-root").appendChild(overlay);

    function close() {
      overlay.remove();
      document.removeEventListener("keydown", onKey);
      if (onClose) onClose();
    }
    closeBtn.addEventListener("click", close);
    overlay.addEventListener("mousedown", (e) => { if (e.target === overlay) close(); });
    function onKey(e) { if (e.key === "Escape") close(); }
    document.addEventListener("keydown", onKey);
    closeBtn.focus();
    return close;
  }

  function confirm({ title, text, okLabel = "Sí", danger = false, onOk }) {
    return modal({
      title,
      bodyNodes: [el("p", {}, text)],
      actions: [
        { label: "Cancelar", class: "btn btn-ghost", onClick: (e, close) => close() },
        { label: okLabel, class: danger ? "btn btn-danger-ghost" : "btn btn-primary", onClick: (e, close) => { close(); onOk && onOk(); } }
      ]
    });
  }

  /* ---------- HUD ---------- */
  function updateHUD() {
    const st = SS.state.get();
    const score = document.getElementById("hud-score");
    const prec = document.getElementById("hud-precision");
    if (score) score.textContent = st.score.toLocaleString("es-MX");
    if (prec) prec.textContent = `${SS.scoring.precision()}%`;
    const hud = document.getElementById("hud");
    const onHome = !hud || (document.getElementById("screen-home") && !document.getElementById("screen-home").hidden);
    if (hud) hud.hidden = onHome;
    refreshSoundButtons();
  }

  function refreshSoundButtons() {
    const on = SS.state.get().sound;
    const hudBtn = document.getElementById("hud-sound");
    const homeBtn = document.getElementById("btn-sound-home");
    if (hudBtn) hudBtn.innerHTML = on ? svgIcon("sound-on") : svgIcon("sound-off");
    if (homeBtn) homeBtn.innerHTML = (on ? svgIcon("sound-on") : svgIcon("sound-off")) + `&nbsp; Sonido: ${on ? "activado" : "desactivado"}`;
  }

  /* ---------- Puntos flotantes ---------- */
  function floatPts(container, x, y, text, color = "#4ee6ff") {
    const f = el("div", { class: "float-pts", style: { left: `${x}px`, top: `${y}px`, color } }, text);
    container.appendChild(f);
    setTimeout(() => f.remove(), 950);
  }

  function setHudVisible(v) {
    const hud = document.getElementById("hud");
    if (hud) hud.hidden = !v;
  }

  /* ---------- Drag & drop con respaldo táctil/teclado ----------
     Chip arrastrable. Un toque sin movimiento = onTap (seleccionar).
     Un arrastre sobre una zona .drop-zone = onDrop(chip, zone, evt). */
  function makeDraggable(chip, opts = {}) {
    const zoneClass = opts.zoneClass || "drop-zone";
    let startX = 0, startY = 0, moved = false, active = false;
    const cancel = () => {
      chip.classList.remove("dragging");
      chip.style.transform = "";
      moved = false; active = false;
    };
    const onDown = (e) => {
      if (chip.classList.contains("used")) return;
      if (e.button !== undefined && e.button !== 0 && e.pointerType === "mouse") return;
      startX = e.clientX; startY = e.clientY; moved = false; active = true;
      try { chip.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
    };
    const onMove = (e) => {
      if (!active) return;
      const dx = e.clientX - startX, dy = e.clientY - startY;
      if (Math.abs(dx) + Math.abs(dy) > 6) {
        moved = true;
        chip.classList.add("dragging");
        chip.style.transform = `translate(${dx}px,${dy}px) scale(1.06)`;
        if (opts.onDragMove) opts.onDragMove(e, dx, dy);
      }
    };
    const onUp = (e) => {
      if (!active) return;
      active = false;
      chip.classList.remove("dragging");
      chip.style.transform = "";
      if (!moved) { if (opts.onTap) opts.onTap(e); return; }
      const els = document.elementsFromPoint(e.clientX, e.clientY);
      const zone = els.find((elm) => elm.classList && elm.classList.contains(zoneClass));
      if (opts.onDrop) opts.onDrop(chip, zone || null, e);
    };
    chip.addEventListener("pointerdown", onDown);
    chip.addEventListener("pointermove", onMove);
    chip.addEventListener("pointerup", onUp);
    chip.addEventListener("pointercancel", cancel);
    chip.addEventListener("dragstart", (e) => e.preventDefault());
  }

  return { el, svgIcon, mountIcons, toast, achieveToast, modal, confirm, updateHUD, refreshSoundButtons, floatPts, setHudVisible, makeDraggable, LOGO };
})();
