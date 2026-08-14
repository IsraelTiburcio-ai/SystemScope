/* ============================================================
   SYSTEM SCOPE — Estado de la aplicación (en memoria)
   ============================================================ */
window.SS = window.SS || {};

SS.state = (() => {
  const MISSION_IDS = ["m1", "m2", "ref", "m3", "m4", "m5"];

  const defaultMission = () => ({ status: "locked", percent: 0, best: 0 });

  const defaults = () => ({
    version: 1,
    screen: "home",
    sound: true,
    tutorialSeen: false,
    introSeen: false,
    score: 0,
    stats: { correct: 0, wrong: 0, hints: 0, perfects: 0 },
    missions: Object.fromEntries(MISSION_IDS.map((id) => [id, defaultMission()])),
    achievements: {
      microscopio: false,
      telescopio: false,
      cartografo: false,
      limite: false,
      analista: false,
      vision: false
    },
    explorer: { deepest: 0, highest: 0, lastNode: "universidad" }
  });

  let data = defaults();

  const reset = () => { data = defaults(); };

  const set = (obj) => { Object.assign(data, obj); };
  const get = () => data;

  const unlockRule = (id) => {
    const done = (mid) => data.missions[mid] && data.missions[mid].status === "done";
    switch (id) {
      case "m1": return true; // se desbloquea tras el tutorial
      case "m2": return done("m1");
      case "ref": return done("m2");
      case "m3": return done("ref");
      case "m4": return done("m3");
      case "m5": return done("m4");
      default: return false;
    }
  };

  /* Abre una misión si se cumplen los requisitos y no está bloqueada. */
  const openIfReady = () => {
    for (const id of MISSION_IDS) {
      const m = data.missions[id];
      if (m.status === "locked" && unlockRule(id)) m.status = "open";
    }
  };

  return { defaults, reset, set, get, unlockRule, openIfReady, MISSION_IDS };
})();
