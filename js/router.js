/* ============================================================
   SYSTEM SCOPE — Router de pantallas
   ============================================================ */
window.SS = window.SS || {};

SS.router = (() => {
  const SCREENS = ["home", "intro", "progress", "explorer", "mission", "final", "results", "achievements"];
  const initHooks = {};
  let current = "home";

  function go(name, opts = {}) {
    const st = SS.state.get();
    st.screen = name;
    for (const id of SCREENS) {
      const sec = document.getElementById("screen-" + id);
      if (sec) sec.hidden = id !== name;
    }
    current = name;
    window.scrollTo(0, 0);
    SS.ui.updateHUD();
    if (initHooks[name]) initHooks[name](opts);
    SS.persist();
  }

  function on(name, fn) { initHooks[name] = fn; }
  function currentScreen() { return current; }

  return { go, on, currentScreen, SCREENS };
})();
