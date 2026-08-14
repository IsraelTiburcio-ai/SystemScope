/* ============================================================
   SYSTEM SCOPE — Puntuación y precisión
   ============================================================ */
window.SS = window.SS || {};

SS.scoring = (() => {
  let attempts = {};

  /* Registra un intento. Devuelve {pts, firstTry}. */
  function answer(itemKey, correct) {
    const st = SS.state.get();
    attempts[itemKey] = attempts[itemKey] || { tries: 0 };
    attempts[itemKey].tries += 1;
    const t = attempts[itemKey].tries;
    if (correct) {
      st.stats.correct += 1;
      const pts = t === 1 ? 100 : t === 2 ? 70 : t === 3 ? 40 : 20;
      st.score += pts;
      SS.audio.play("correct");
      return { pts, firstTry: t === 1, tries: t };
    }
    st.stats.wrong += 1;
    SS.audio.play("wrong");
    return { pts: 0, firstTry: false, tries: t };
  }

  function hintUsed() {
    const st = SS.state.get();
    st.stats.hints += 1;
    const pts = -20;
    st.score = Math.max(0, st.score + pts);
    SS.audio.play("hint");
    return pts;
  }

  function bonus(perfect) {
    if (!perfect) return 0;
    const st = SS.state.get();
    st.score += 300;
    st.stats.perfects += 1;
    SS.audio.play("complete");
    return 300;
  }

  function resetMission() { attempts = {}; }

  function precision() {
    const st = SS.state.get();
    const tot = st.stats.correct + st.stats.wrong;
    return tot === 0 ? 0 : Math.round((st.stats.correct / tot) * 100);
  }

  return { answer, hintUsed, bonus, resetMission, precision, getAttempts: () => attempts };
})();
