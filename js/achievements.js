/* ============================================================
   SYSTEM SCOPE — Logros
   ============================================================ */
window.SS = window.SS || {};

SS.ach = (() => {
  const DEFS = [
    { id: "microscopio", name: "Microscopio", icon: "🔬", desc: "Explora tres niveles hacia dentro de un sistema.", check: (s) => s.explorer.deepest >= 3 },
    { id: "telescopio", name: "Telescopio", icon: "🔭", desc: "Explora tres niveles hacia fuera de un sistema.", check: (s) => s.explorer.highest >= 3 },
    { id: "cartografo", name: "Cartógrafo", icon: "🗺️", desc: "Construye correctamente un mapa completo en la misión final.", check: (s) => s.missions.m5 && s.missions.m5.status === "done" && s.missions.m5.percent >= 100 },
    { id: "limite", name: "Sin salirte del límite", icon: "🎯", desc: "Completa una misión de fronteras sin errores.", check: (s) => s.stats.perfects >= 1 },
    { id: "analista", name: "Analista de Alcance", icon: "🧭", desc: "Identifica correctamente las cuatro fronteras.", check: (s) => s.missions.m3 && s.missions.m3.status === "done" && s.missions.m3.percent >= 100 },
    { id: "vision", name: "Visión Sistémica", icon: "🌟", desc: "Completa todas las misiones de System Scope.", check: (s) => SS.state.MISSION_IDS.every((m) => s.missions[m] && s.missions[m].status === "done") }
  ];

  function checkAll(silent) {
    const st = SS.state.get();
    const newly = [];
    for (const def of DEFS) {
      if (!st.achievements[def.id] && def.check(st)) {
        st.achievements[def.id] = true;
        newly.push(def);
      }
    }
    if (!silent && newly.length) {
      newly.forEach((def) => {
        SS.audio.play("trophy");
        SS.ui.achieveToast(def);
      });
    }
    return newly;
  }

  function unlockedCount() {
    const st = SS.state.get();
    return DEFS.filter((d) => st.achievements[d.id]).length;
  }

  return { defs: DEFS, checkAll, unlockedCount };
})();
