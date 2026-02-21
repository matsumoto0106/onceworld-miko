(() => {
  const header = document.getElementById("siteHeader");
  if (!header) return;

  const button = header.querySelector(".hamburger");
  const menu = document.getElementById("siteMenu");
  const overlay = document.getElementById("menuOverlay");

  if (!button || !menu || !overlay) return;

  const openMenu = () => {
    menu.hidden = false;
    overlay.hidden = false;

    // アニメ開始用に次フレームでクラス付与
    requestAnimationFrame(() => {
      header.classList.add("menu-open");
    });

    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-label", "メニューを閉じる");
    document.body.classList.add("no-scroll");
  };

  const closeMenu = () => {
    header.classList.remove("menu-open");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "メニューを開く");
    document.body.classList.remove("no-scroll");

    // アニメ終わりでhiddenに戻す
    window.setTimeout(() => {
      if (!header.classList.contains("menu-open")) {
        menu.hidden = true;
        overlay.hidden = true;
      }
    }, 200);
  };

  const toggleMenu = () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    expanded ? closeMenu() : openMenu();
  };

  button.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", closeMenu);

  // ESCで閉じる
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
      closeMenu();
    }
  });

  // 画面リサイズでメニューが変に残るのを防止
  window.addEventListener("resize", () => {
    if (button.getAttribute("aria-expanded") === "true") closeMenu();
  });

  // メニュー内リンク押したら閉じる
  menu.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a) closeMenu();
  });
})();
