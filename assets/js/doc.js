/* Wokvibe website — document pages (privacy / terms):
   header scrolled state + highlight the TOC entry of the section in view. */
(function () {
  "use strict";

  /* fixed header background after scrolling past the dark hero */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".doc-toc a"));
  var sections = tocLinks
    .map(function (a) {
      var id = a.getAttribute("href").slice(1);
      return document.getElementById(id);
    })
    .filter(Boolean);

  if (!tocLinks.length || !sections.length || !("IntersectionObserver" in window)) return;

  function setActive(id) {
    tocLinks.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + id);
    });
  }

  var visible = new Map();

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });
      var best = null;
      visible.forEach(function (ratio, id) {
        if (ratio > 0 && (!best || ratio > visible.get(best))) best = id;
      });
      if (best) setActive(best);
    },
    { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.25, 0.5, 1] }
  );

  sections.forEach(function (sec) {
    observer.observe(sec);
  });
})();
