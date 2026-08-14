/* ============================================================
   SYSTEM SCOPE — Persistencia en localStorage
   ============================================================ */
window.SS = window.SS || {};

SS.storage = (() => {
  const KEY = "systemscope_v1";

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== SS.state.defaults().version) return null;
      return parsed;
    } catch (e) {
      console.warn("No se pudo cargar el progreso", e);
      return null;
    }
  }

  function save(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("No se pudo guardar el progreso", e);
    }
  }

  function clear() {
    try { localStorage.removeItem(KEY); } catch (e) { /* noop */ }
  }

  return { load, save, clear, KEY };
})();
