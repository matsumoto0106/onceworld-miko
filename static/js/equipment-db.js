document.addEventListener("DOMContentLoaded", async () => {

  const statList = ["vit","spd","atk","int","def","mdef","luk","mov"];

  const weaponBody = document.getElementById("weaponBody");
  const armorBody = document.getElementById("armorBody");
  const accessoryBody = document.getElementById("accessoryBody");

  const tabs = document.querySelectorAll(".equip-tab");
  const tables = document.querySelectorAll(".equip-table");

  // タブ切替
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {

      tabs.forEach(t => t.classList.remove("active"));
      tables.forEach(t => t.classList.remove("active"));

      tab.classList.add("active");

      const target = tab.dataset.tab;
      document.getElementById("tab-" + target).classList.add("active");

    });
  });

  // 装備読み込み
  try {

    const res = await fetch("/db/equipment.json",{cache:"no-store"});
    const data = await res.json();

    const items = data.items || [];

    items.forEach(item => {

      const tr = document.createElement("tr");

      const nameTd = document.createElement("td");
      nameTd.textContent = item.name;
      tr.appendChild(nameTd);

      statList.forEach(stat => {

        const td = document.createElement("td");

        let value = "";

        if(item.base_add && item.base_add[stat]){
          value = item.base_add[stat];
        }

        if(item.base_rate && item.base_rate[stat]){
          value = "+" + item.base_rate[stat] + "%";
        }

        if(item.final_rate && item.final_rate[stat]){
          value = "*" + item.final_rate[stat] + "%";
        }

        td.textContent = value;
        tr.appendChild(td);

      });

      if(item.category === "weapon"){
        weaponBody.appendChild(tr);
      }
      else if(item.category === "armor"){
        armorBody.appendChild(tr);
      }
      else if(item.category === "accessory"){
        accessoryBody.appendChild(tr);
      }

    });

  }
  catch(e){

    console.error("装備DB読み込み失敗",e);

  }

});
