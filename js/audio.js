/* ============================================================
   SYSTEM SCOPE — Audio sintetizado con WebAudio (sin archivos)
   ============================================================ */
window.SS = window.SS || {};

SS.audio = (() => {
  let ctx = null;
  let enabled = true;

  function ensureCtx() {
    if (!ctx) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) ctx = new AC();
      } catch (e) { /* sin audio */ }
    }
    if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
    return ctx;
  }

  function tone(freq, dur, type = "sine", vol = 0.16, delay = 0, slideTo = null) {
    const ac = ensureCtx();
    if (!ac) return;
    const t0 = ac.currentTime + delay;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(vol, t0 + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  function play(name) {
    if (!enabled) return;
    switch (name) {
      case "zoom":    tone(340, 0.28, "sine", 0.12, 0, 620); break;
      case "select":  tone(520, 0.08, "triangle", 0.1); break;
      case "correct": tone(660, 0.12, "triangle", 0.14); tone(990, 0.18, "triangle", 0.12, 0.09); break;
      case "wrong":   tone(220, 0.22, "sawtooth", 0.07, 0, 150); break;
      case "boundary":tone(420, 0.16, "sine", 0.12, 0, 300); tone(300, 0.2, "sine", 0.1, 0.14); break;
      case "hint":    tone(480, 0.1, "sine", 0.09, 0, 380); break;
      case "trophy":  tone(523, 0.14, "triangle", 0.14); tone(659, 0.14, "triangle", 0.14, 0.12); tone(784, 0.24, "triangle", 0.14, 0.24); break;
      case "complete":tone(523, 0.12, "triangle", 0.14); tone(659, 0.12, "triangle", 0.14, 0.11); tone(784, 0.12, "triangle", 0.14, 0.22); tone(1046, 0.3, "triangle", 0.15, 0.33); break;
      case "denied":  tone(180, 0.25, "square", 0.05, 0, 120); break;
      case "drop":    tone(700, 0.06, "sine", 0.1, 0, 900); break;
      default: tone(440, 0.08, "sine", 0.08);
    }
  }

  function setEnabled(v) { enabled = !!v; }
  function isEnabled() { return enabled; }
  function unlock() { ensureCtx(); }

  return { play, setEnabled, isEnabled, unlock };
})();
