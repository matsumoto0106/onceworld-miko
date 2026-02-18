(() => {
  const LEVELS = [31, 71, 121, 181];

  // 表示名（ここだけ変えればUI側で統一できる）
  const LABEL = {
    vit: "VIT",
    spd: "SPD",
    atk: "ATK",
    int: "INT",
    def: "DEF",
    mdef: "MDEF",
    luk: "LUK",
    mov: "MOV",
    exp: "経験値",
    capture: "基礎捕獲",
    drop: "基礎ドロップ",
    heal: "HP回復",
  };

  const fmtNumber = (v) => {
    if (typeof v !== "number") return String(v ?? "");
    // 整数はカンマ、小数はそのまま
    return Number.isInteger(v) ? v.toLocaleString("ja-JP") : String(v);
  };

  // 1エントリ（例：{ "mul": { "capture": 50 } }）を表示文字列へ
  const entryToText = (entry) => {
    if (!entry || typeof entry !== "object") return "—";
    const keys = Object.keys(entry);
    if (keys.length === 0) return "—";

    const kind = keys[0]; // add / mul / final_mul
    const payload = entry[kind];
    if (!payload || typeof payload !== "object") return "—";

    const stats = Object.keys(payload);
    if (stats.length === 0) return "—";

    const statKey = stats[0];
    const value = payload[statKey];

    const name = LABEL[statKey] ?? statKey; // 未定義はそのまま
    const num = fmtNumber(value);

    // ルール：
    // - 無記号（add）= 加算 → +n
    // - *（mul）= 乗算 → ×n%
    // - **（final_mul）= 最終乗算 → 最終×n%
    if (kind === "add") {
      return `${name} +${num}`;
    }
    if (kind === "mul") {
      return `${name} ×${num}%`;
    }
    if (kind === "final_mul") {
      return `${name} 最終×${num}%`;
    }
    // 想定外
    return `${name} ${num}`;
  };

  const buildRows = (skillsArr) => {
    // skillsArr は 4枠固定推奨（不足は {} でもOK）
    const arr = Array.isArray(skillsArr) ? skillsArr : [];
    const rows = LEVELS.map((lv, i) => {
      const text = entryToText(arr[i]);
      return `
        <div class="d-row">
          <dt>Lv${lv}</dt>
          <dd>${escapeHtml(text)}</dd>
        </div>
      `.trim();
    });
    return rows.join("");
  };

  // 最低限のエスケープ（万一の混入対策）
  const escapeHtml = (s) => {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  };

  const init = async () => {
    const section = document.getElementById("pet-skill-section");
    const list = document.getElementById("pet-skill-list");
    if (!section || !list) return;

    const monsterId = (section.dataset.monsterId || "").trim();
    const url = (section.dataset.jsonUrl || "").trim();
    if (!monsterId || !url) {
      list.innerHTML = `
        <div class="d-row"><dt>Lv31</dt><dd>ペットスキルデータが見つかりません</dd></div>
      `;
      return;
    }

    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const skillsArr = data[monsterId];
      if (!skillsArr) {
        list.innerHTML = buildRows([{}, {}, {}, {}]);
        return;
      }

      list.innerHTML = buildRows(skillsArr);
    } catch (e) {
      list.innerHTML = `
        <div class="d-row"><dt>Lv31</dt><dd>読み込み失敗</dd></div>
      `;
    }
  };

  document.addEventListener("DOMContentLoaded", init);
  window.addEventListener("load", init);
})();
