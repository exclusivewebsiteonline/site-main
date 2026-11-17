(function () {
  var chips = document.querySelectorAll(".video-chip");
  var tiles = document.querySelectorAll(".video-tile");
  var lightbox = document.getElementById("video-lightbox");
  var player = document.getElementById("video-lightbox-player");
  var titleEl = document.getElementById("video-lightbox-title");
  var shopEl = document.querySelector(".video-lightbox-shop");
  var siteLink = document.getElementById("video-lightbox-site");
  var etsyLink = document.getElementById("video-lightbox-etsy");
  var lastFocus = null;

  function filter(slug) {
    tiles.forEach(function (tile) {
      var show = slug === "all" || tile.getAttribute("data-shop") === slug;
      tile.hidden = !show;
    });
    chips.forEach(function (chip) {
      var on = chip.getAttribute("data-filter") === slug;
      chip.classList.toggle("is-active", on);
      chip.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      filter(chip.getAttribute("data-filter"));
    });
  });

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    if (player) {
      player.pause();
      player.removeAttribute("src");
      player.load();
    }
    lightbox.hidden = true;
    document.body.classList.remove("video-lightbox-open");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function openLightbox(btn) {
    lastFocus = btn;
    titleEl.textContent = btn.getAttribute("data-title") || "";
    shopEl.textContent = btn.getAttribute("data-shop") || "";
    siteLink.href = btn.getAttribute("data-shop-url") || "#";
    etsyLink.href = btn.getAttribute("data-etsy-url") || "#";
    player.poster = btn.getAttribute("data-poster") || "";
    player.src = btn.getAttribute("data-video") || "";
    lightbox.hidden = false;
    document.body.classList.add("video-lightbox-open");
    var card = lightbox.querySelector(".video-lightbox-card");
    if (card) card.focus();
    var play = player.play();
    if (play && typeof play.catch === "function") play.catch(function () {});
  }

  document.querySelectorAll(".video-tile-open").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openLightbox(btn);
    });
  });

  if (lightbox) {
    lightbox.addEventListener("click", function (ev) {
      if (ev.target && ev.target.getAttribute("data-close") === "1") closeLightbox();
    });
  }

  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape") closeLightbox();
  });
})();
