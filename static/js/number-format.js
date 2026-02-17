(() => {
  const isNumericText = (s) => /^-?\d+(\.\d+)?$/.test(s);

  const formatNode = (el) => {
    const raw = (el.textContent || "").trim();
    if (!raw) return;

    // すでに "1,000" などになっているものは対象外（数値判定に通らない）
    if (!isNumericText(raw)) return;

    const num = Number(raw);
    if (!Number.isFinite(num)) return;

    // 整数だけカンマ（小数はそのまま）
    if (Number.isInteger(num)) {
      el.textContent = num.toLocaleString("ja-JP");
    } else {
      el.textContent = String(num);
    }
  };

  const formatAll = (root) => {
    const r = root && root.querySelectorAll ? root : document;
    r.querySelectorAll(".n").forEach(formatNode);
  };

  window.formatNumbers = formatAll;

  document.addEventListener("DOMContentLoaded", () => formatAll(document));
  window.addEventListener("load", () => formatAll(document));
})();
