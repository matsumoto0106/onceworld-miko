(() => {
  const search = document.getElementById("mbsSearch");
  const tbody = document.getElementById("mbsBody");
  const table = document.getElementById("mbsTable");
  const sortStatus = document.getElementById("mbsSortStatus");
  const wrap = document.getElementById("mbsWrap");
  const compactToggle = document.getElementById("mbsCompactToggle");

  if (!search || !tbody || !table) return;

  const rows = Array.from(tbody.querySelectorAll("tr"));
  const headers = Array.from(table.querySelectorAll("thead th.sort"));

  // ヘッダーに矢印表示用のspanを付与
  headers.forEach(h => {
    if (!h.querySelector(".arrow")) {
      const s = document.createElement("span");
      s.className = "arrow";
      s.textContent = "↕";
      h.appendChild(s);
    }
  });

  // 初期状態：id 昇順（Hugoで既に id昇順に並んでいるが、状態表示のため持つ）
  let sortState = { key: "id", dir: 1 }; // 1=asc, -1=desc

  // 文字表示用（ステータス表示）
  const keyLabel = (key) => {
    const map = {
      id: "id",
      element: "element",
      attack_type: "attack_type",
      attack_range: "attack_range",
      vit: "vit",
      spd: "spd",
      atk: "atk",
      int: "int",
      def: "def",
      mdef: "mdef",
      luk: "luk",
      mov: "mov",
    };
    return map[key] || key;
  };

  // 検索（名前/属性/攻撃タイプ/射程）
  function applyFilter() {
    const q = (search.value || "").trim().toLowerCase();
    if (!q) {
      rows.forEach(r => (r.style.display = ""));
      updateRanks();
      return;
    }
    rows.forEach(r => {
      const hay =
        (r.dataset.name || "") + " " +
        (r.dataset.element || "") + " " +
        (r.dataset.attack_type || "") + " " +
        (r.dataset.attack_range || "");
      r.style.display = hay.includes(q) ? "" : "none";
    });
    updateRanks();
  }
  search.addEventListener("input", applyFilter);

  // コンパクト切り替え
  if (compactToggle && wrap) {
    const sync = () => {
      wrap.classList.toggle("mbs-compact-on", !!compactToggle.checked);
    };
    compactToggle.addEventListener("change", sync);
    sync();
  }

  function getValue(row, key) {
    const v = row.dataset[key];
    if (v == null) return "";

    // id が "001" のように0埋めなら文字でもOKだが、数値も見ておく
    // "001" -> 1 にしても順は崩れない
    const n = Number(v);
    if (Number.isFinite(n) && String(v).trim() !== "") return n;

    return String(v);
  }

  function setSortUI() {
    // ステータス行
    if (sortStatus) {
      sortStatus.textContent = `${keyLabel(sortState.key)} ${sortState.dir === 1 ? "↑" : "↓"}`;
    }
    // 見出しの矢印（アクティブ列だけ▲▼）
    headers.forEach(h => {
      h.classList.remove("is-active");
      const arrow = h.querySelector(".arrow");
      if (!arrow) return;

      if (h.dataset.key === sortState.key) {
        h.classList.add("is-active");
        arrow.textContent = sortState.dir === 1 ? "▲" : "▼";
      } else {
        arrow.textContent = "↕";
      }
    });
  }

  function updateRanks() {
    // 表示中（display != none）の行だけに順位を振る
    let rank = 0;
    rows.forEach(r => {
      const cell = r.querySelector(".mbs-rank");
      if (!cell) return;
      if (r.style.display === "none") {
        cell.textContent = "";
        return;
      }
      rank += 1;
      cell.textContent = rank;
    });
  }

  function applySort(key) {
    // 同じ列なら昇順↔降順
    if (sortState.key === key) sortState.dir *= -1;
    else sortState = { key, dir: 1 };

    rows.sort((a, b) => {
      const va = getValue(a, sortState.key);
      const vb = getValue(b, sortState.key);

      const na = typeof va === "number";
      const nb = typeof vb === "number";

      if (na && nb) return (va - vb) * sortState.dir;
      return String(va).localeCompare(String(vb), "ja") * sortState.dir;
    });

    const frag = document.createDocumentFragment();
    rows.forEach(r => frag.appendChild(r));
    tbody.appendChild(frag);

    setSortUI();
    updateRanks();
  }

  // 列クリックでソート
  headers.forEach(h => {
    h.addEventListener("click", () => applySort(h.dataset.key));
  });

  // 初期表示：UIと順位だけ整える
  setSortUI();
  updateRanks();
})();
