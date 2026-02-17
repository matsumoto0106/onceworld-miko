(() => {
  const LEVELSCALE = 0.1; // ステータス用（既存のまま）

  const clampLv = (v) => {
    const n = parseInt(v, 10);
    return Number.isFinite(n) && n >= 1 ? n : 1;
  };

  const calcStat = (base, lv) => Math.floor(base * (1 + (lv - 1) * LEVELSCALE));

  // 経験値：基礎経験値 × floor(0.2×Lv^1.1（最低保証1）)
  const calcExpMultiplier = (lv) => {
    const raw = 0.2 * Math.pow(lv, 1.1);
    const floored = Math.floor(raw);
    return Math.max(1, floored);
  };

  const init = () => {
    const levelInput = document.getElementById("monster-level");
    const statEls = document.querySelectorAll("#status-table dd[data-base]");
    const lvBtns = document.querySelectorAll(".d-btn[data-lv]");
    const originExp = document.getElementById("origin-exp");
    const expEl = document.getElementById("exp-value");

    const statusRoot = document.getElementById("status-table");
    const rewardRoot = expEl ? expEl.closest(".d-list") : null;

    if (!levelInput || statEls.length === 0) return;

    const recalcStats = (lv) => {
      statEls.forEach((el) => {
        const base = Number(el.dataset.base);
        const stat = el.dataset.stat || "";
        if (!Number.isFinite(base)) return;

        if (stat === "mov") {
          el.textContent = String(base);
          return;
        }
        el.textContent = String(calcStat(base, lv));
      });
    };

    const recalcExp = (lv) => {
      if (!expEl) return;

      const baseRaw = Number(expEl.dataset.base);
      if (!Number.isFinite(baseRaw)) return;

      const base = (originExp && originExp.checked) ? baseRaw * 2 : baseRaw;
      const mult = calcExpMultiplier(lv);

      expEl.textContent = String(base * mult);
    };

    // 入力中に連打されるので、rAFで1回にまとめる
    let rafId = 0;
    const schedule = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;

        const lv = clampLv(levelInput.value);
        levelInput.value = String(lv);

        recalcStats(lv);
        recalcExp(lv);

        // ▼ カンマ表示：必要な範囲だけ
        if (typeof window.formatNumbers === "function") {
          if (statusRoot) window.formatNumbers(statusRoot);
          if (rewardRoot) window.formatNumbers(rewardRoot);
        }
      });
    };

    lvBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        levelInput.value = btn.dataset.lv || "1";
        schedule();
      });
    });

    levelInput.addEventListener("input", schedule);
    levelInput.addEventListener("change", schedule);

    if (originExp) {
      originExp.addEventListener("change", schedule);
    }

    schedule();
  };

  document.addEventListener("DOMContentLoaded", init);
  window.addEventListener("load", init);
})();
