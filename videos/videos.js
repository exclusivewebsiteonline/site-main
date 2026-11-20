(function () {
  document.documentElement.classList.add("js");

  var chips = document.querySelectorAll(".video-chips .video-chip");
  var tiles = Array.prototype.slice.call(document.querySelectorAll(".video-tile"));
  var sections = Array.prototype.slice.call(document.querySelectorAll(".video-cat"));
  var nav = document.querySelector(".videos-nav");
  var lightbox = document.getElementById("video-lightbox");
  var player = document.getElementById("video-lightbox-player");
  var titleEl = document.getElementById("video-lightbox-title");
  var shopEl = document.querySelector(".video-lightbox-shop");
  var siteLink = document.getElementById("video-lightbox-site");
  var etsyLink = document.getElementById("video-lightbox-etsy");
  var lastFocus = null;
  var filterSlug = "all";

  function resetSectionMore(sec) {
    var more = sec.querySelector(".videos-more");
    var btn = sec.querySelector(".videos-more-btn");
    if (more) more.classList.remove("is-open");
    if (btn) {
      btn.setAttribute("aria-expanded", "false");
      if (btn.dataset.more) btn.textContent = btn.dataset.more;
    }
  }

  function openSectionMore(sec) {
    var more = sec.querySelector(".videos-more");
    var btn = sec.querySelector(".videos-more-btn");
    if (more) more.classList.add("is-open");
    if (btn) {
      btn.setAttribute("aria-expanded", "true");
      if (btn.dataset.less) btn.textContent = btn.dataset.less;
    }
  }

  function applyVisibility() {
    tiles.forEach(function (tile) {
      var match = filterSlug === "all" || tile.getAttribute("data-shop") === filterSlug;
      tile.hidden = !match;
    });
    sections.forEach(function (sec) {
      var secTiles = sec.querySelectorAll(".video-tile");
      var visible = 0;
      for (var i = 0; i < secTiles.length; i++) {
        if (!secTiles[i].hidden) visible += 1;
      }
      sec.hidden = visible === 0;
      var wrap = sec.querySelector(".videos-more-wrap");
      if (filterSlug === "all") {
        resetSectionMore(sec);
        if (wrap) wrap.hidden = false;
      } else {
        openSectionMore(sec);
        if (wrap) wrap.hidden = true;
      }
    });
  }

  function setFilter(slug) {
    filterSlug = slug;
    chips.forEach(function (chip) {
      var on = chip.getAttribute("data-filter") === slug;
      chip.classList.toggle("is-active", on);
      chip.setAttribute("aria-pressed", on ? "true" : "false");
    });
    applyVisibility();
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      setFilter(chip.getAttribute("data-filter"));
    });
  });

  document.addEventListener("click", function (ev) {
    var btn = ev.target.closest && ev.target.closest(".videos-more-btn");
    if (!btn) return;
    var list = document.getElementById(btn.getAttribute("aria-controls"));
    if (!list) return;
    var open = btn.getAttribute("aria-expanded") !== "true";
    btn.setAttribute("aria-expanded", String(open));
    list.classList.toggle("is-open", open);
    btn.textContent = open ? btn.dataset.less : btn.dataset.more;
    if (!open) {
      var sec = btn.closest(".video-cat");
      if (sec && sec.getBoundingClientRect().top < 0) sec.scrollIntoView();
    }
  });

  if (nav) {
    nav.addEventListener("click", function (ev) {
      var a = ev.target.closest && ev.target.closest("a");
      if (!a) return;
      if (filterSlug !== "all") setFilter("all");
    });
  }

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
    var shopUrl = btn.getAttribute("data-shop-url") || "#";
    var etsyUrl = btn.getAttribute("data-etsy-url") || "";
    var isRoundup = btn.getAttribute("data-roundup") === "1";
    siteLink.href = shopUrl;
    siteLink.innerHTML = isRoundup
      ? 'See the shops <span aria-hidden="true">&rarr;</span>'
      : 'Visit their site <span aria-hidden="true">&rarr;</span>';
    if (etsyUrl && !isRoundup) {
      etsyLink.hidden = false;
      etsyLink.href = etsyUrl;
    } else {
      etsyLink.hidden = true;
      etsyLink.removeAttribute("href");
    }
    player.setAttribute("preload", "none");
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

  applyVisibility();
})();
