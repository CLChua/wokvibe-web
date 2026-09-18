/* Wokvibe website — bilingual (en/zh) switcher.
   Pages carry both languages inline (.lang-en / .lang-zh); visibility is
   CSS-driven from <html data-lang>. This script only manages state:
   persistence, <html lang>, <title>/meta description, and toggle buttons. */
(function () {
  "use strict";

  var STORAGE_KEY = "wokvibe-lang";

  function detect() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "zh") return saved;
    } catch (e) { /* storage unavailable */ }
    var nav = (navigator.languages && navigator.languages[0]) || navigator.language || "";
    return String(nav).toLowerCase().indexOf("zh") === 0 ? "zh" : "en";
  }

  function apply(lang) {
    var root = document.documentElement;
    root.setAttribute("data-lang", lang);
    root.setAttribute("lang", lang === "zh" ? "zh-CN" : "en");

    var title = root.getAttribute(lang === "zh" ? "data-title-zh" : "data-title-en");
    if (title) document.title = title;

    var desc = root.getAttribute(lang === "zh" ? "data-desc-zh" : "data-desc-en");
    if (desc) {
      var meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", desc);
    }

    var buttons = document.querySelectorAll(".lang-toggle button");
    for (var i = 0; i < buttons.length; i++) {
      var b = buttons[i];
      var isTarget = b.getAttribute("data-set-lang") === lang;
      b.classList.toggle("active", isTarget);
      b.setAttribute("aria-pressed", isTarget ? "true" : "false");
    }
  }

  function set(lang, persist) {
    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
    }
    apply(lang);
    if (document.dispatchEvent) {
      document.dispatchEvent(new CustomEvent("wokvibe:langchange", { detail: { lang: lang } }));
    }
  }

  function init() {
    apply(detect());

    var buttons = document.querySelectorAll(".lang-toggle button[data-set-lang]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function () {
        set(this.getAttribute("data-set-lang"), true);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
