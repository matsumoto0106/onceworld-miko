document.addEventListener("DOMContentLoaded", async () => {
  const statList = ["vit", "spd", "atk", "int", "def", "mdef", "luk", "mov"];

  const weaponBody = document.getElementById("weaponBody");
  const armorBody = document.getElementById("armorBody");
  const accessoryBody = document.getElementById("accessoryBody");

  const tabs = document.querySelectorAll(".equip-tab");
  const tables = document.querySelectorAll(".equip-table");

  const slotLabelMap = {
    head: "頭",
    body: "体",
    hands: "手",
    feet: "脚",
    shield: "盾"
  };

  const seriesLabelMap = {
    cloth: "布",
    leather: "皮",
    metal: "メタル",
    platinum: "白金",
    mage: "魔道士",
    inferno: "獄炎",
    dragon: "ドラゴン"
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tables.forEach((t) => t.classList.remove("active"));

      tab.classList.add("active");
      const target = tab.dataset.tab;
      document.getElementById("tab-" + target)?.classList.add("active");
    });
  });

  function getBaseUrl() {
    return window.location.origin + window.location.pathname.split("/equipment")[0];
  }

  function fmtStatKey(key) {
    return String(key || "").toUpperCase().replace("MDEF", "MDEF");
  }

  function buildNormalEffectText(item) {
    const parts = [];

    for (const stat of statList) {
      const add = Number(item.base_add?.[stat] ?? 0);
      const rate = Number(item.base_rate?.[stat] ?? 0);

      if (add !== 0) {
        parts.push(`${fmtStatKey(stat)}+${add}`);
      }
      if (rate !== 0) {
        parts.push(`${fmtStatKey(stat)}+${rate}%`);
      }
    }

    return parts.join(" / ");
  }

  function buildDisplayEffects(item) {
    const effects = Array.isArray(item.display_effects) ? item.display_effects : [];
    if (!effects.length) return null;

    const initialParts = [];
    const maxParts = [];

    effects.forEach((ef) => {
      const type = ef.type || "";
      const targetRaw = String(ef.target || "");
      const target = targetRaw === "mdef" ? "MDEF" : targetRaw.toUpperCase();

      if (type === "flat") {
        initialParts.push(`${target}+${ef.initial}`);
        maxParts.push(`${target}+${ef.max}`);
      } else if (type === "rate") {
        initialParts.push(`${target}+${ef.initial}`);
        maxParts.push(`${target}+${ef.max}`);
      } else if (type === "special") {
        initialParts.push(`${target}+${ef.initial}`);
        maxParts.push(`${target}+${ef.max}`);
      } else if (type === "special_rate") {
        initialParts.push(`${target}+${ef.initial}`);
        maxParts.push(`${target}+${ef.max}`);
      }
    });

    return {
      initial: initialParts.join(" / "),
      max: maxParts.join(" / ")
    };
  }

  function appendWeaponRow(item) {
    const tr = document.createElement("tr");

    const nameTd = document.createElement("td");
    nameTd.textContent = item.name || "";
    tr.appendChild(nameTd);

    statList.forEach((stat) => {
      const td = document.createElement("td");
      const add = Number(item.base_add?.[stat] ?? 0);
      td.textContent = add !== 0 ? String(add) : "";
      tr.appendChild(td);
    });

    weaponBody?.appendChild(tr);
  }

  function appendArmorRow(item) {
    const tr = document.createElement("tr");

    const nameTd = document.createElement("td");
    nameTd.textContent = item.name || "";
    tr.appendChild(nameTd);

    const slotTd = document.createElement("td");
    slotTd.textContent = slotLabelMap[item.slot] || item.slot || "";
    tr.appendChild(slotTd);

    const seriesTd = document.createElement("td");
    seriesTd.textContent = seriesLabelMap[item.series] || "";
    tr.appendChild(seriesTd);

    statList.forEach((stat) => {
      const td = document.createElement("td");
      const add = Number(item.base_add?.[stat] ?? 0);
      td.textContent = add !== 0 ? String(add) : "";
      tr.appendChild(td);
    });

    armorBody?.appendChild(tr);
  }

  function appendAccessoryRow(item) {
    const tr = document.createElement("tr");

    const nameTd = document.createElement("td");
    nameTd.className = "acc-name";
    nameTd.textContent = item.name || "";
    tr.appendChild(nameTd);

    const effectTd = document.createElement("td");
    effectTd.className = "acc-effect";

    const maxTd = document.createElement("td");
    maxTd.className = "acc-max";

    const levelTd = document.createElement("td");
    levelTd.className = "acc-level";
    levelTd.textContent = item.max_level ? `Lv.${item.max_level}` : "";

    const displayEffects = buildDisplayEffects(item);

    if (displayEffects) {
      effectTd.textContent = displayEffects.initial;
      maxTd.textContent = displayEffects.max;
    } else {
      effectTd.textContent = buildNormalEffectText(item);
      maxTd.textContent = "";
    }

    tr.appendChild(effectTd);
    tr.appendChild(maxTd);
    tr.appendChild(levelTd);

    accessoryBody?.appendChild(tr);
  }

  try {
    const url = getBaseUrl() + "/db/equipment.json";
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const items = Array.isArray(data.items) ? data.items : [];

    items.forEach((item) => {
      if (item.category === "weapon") {
        appendWeaponRow(item);
      } else if (item.category === "armor") {
        appendArmorRow(item);
      } else if (item.category === "accessory") {
        appendAccessoryRow(item);
      }
    });
  } catch (e) {
    console.error("装備DB読み込み失敗", e);
  }
});
