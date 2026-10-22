/* EWO shops page -> GoatCounter (2026-10-22). Event shops-click-<slug> on clicks to a seller site.
   Never blocks links: sendBeacon survives navigation; if GoatCounter is blocked, links just work. */
(function () {
  'use strict';
  var EP = 'https://exclusivewebsite.goatcounter.com/count';
  function slugOf(a) {
    var h = a.hostname.toLowerCase(), m = h.match(/^([a-z0-9-]+)\.exclusivewebsite\.online$/);
    if (m && m[1] !== 'www') return m[1];
    if (h === 'exclusivewebsiteonline.github.io') return (a.pathname.split('/')[1] || '') || null;
    return null;
  }
  function onClick(e) {
    var a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
    if (e.type === 'click' && e.button !== 0) return;
    if (e.type === 'auxclick' && e.button !== 1) return;
    var slug = slugOf(a); if (!slug) return;
    var name = 'shops-click-' + slug, title = 'Shops page \u2192 ' + slug;
    try {
      if (navigator.sendBeacon && !navigator.webdriver) {
        navigator.sendBeacon(EP + '?p=' + encodeURIComponent(name) + '&t=' + encodeURIComponent(title) +
          '&e=true&s=' + screen.width + '&rnd=' + Math.random().toString(36).slice(2, 7));
      } else if (window.goatcounter && typeof window.goatcounter.count === 'function') {
        window.goatcounter.count({ path: name, title: title, event: true });
      }
    } catch (err) {}
  }
  document.addEventListener('click', onClick, false);
  document.addEventListener('auxclick', onClick, false);
})();
