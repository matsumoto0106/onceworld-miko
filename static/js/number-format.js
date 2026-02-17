(() => {
  const isNumericText = (s) => /^-?\d+(\.\d+)?$/.test(s);

  const formatNode = (el) => {
    const raw = (el.textContent || "").trim();
    if (!raw) return;
    if (!isNumericText(raw)) return;

    const num = Number(raw);
    if (!Number.isFinite(num)) return;

    // 整数はカンマ、小数はそのまま（必要ならここは後で変更可能）
    if (Number.isInteger(num)) {
      el.textContent = num.toLocaleString("ja-JP");
    } else {
      el.textContent = String(num);
    }
  };

  const formatAll = (root = document) => {
    root.querySelectorAll(".n").forEach(formatNode);
  };

  // 外部から呼べるようにしておく（Lv変更後に呼ぶ）
  window.formatNumbers = formatAll;

  document.addEventListener("DOMContentLoaded", () => formatAll());
  window.addEventListener("load", () => formatAll());
})();
