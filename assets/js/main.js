/* Wokvibe website — GSAP motion.
   Motion language follows the Wokvibe brand board: GAZE FIRST / SOFT BOUNCE /
   ONE BEAT AHEAD, with full respect for prefers-reduced-motion via
   gsap.matchMedia(). All animation targets transforms and opacity only. */
(function () {
  "use strict";

  if (!window.gsap) return;

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ duration: 0.7, ease: "power2.out" });

  /* header background state */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* render-throttle safety: in a suspended/background tab rAF never fires,
     so "hide-then-animate" entrances would stay hidden. If no frame has
     painted shortly after setup, complete every non-looping animation
     immediately — content must never depend on an animation finishing. */
  var painted = false;
  var motionDead = false;
  requestAnimationFrame(function () {
    painted = true;
  });
  setTimeout(function () {
    if (painted) {
      return;
    }
    motionDead = true;
    gsap.globalTimeline.getChildren(true, true, true).forEach(function (anim) {
      if (!anim.repeat()) anim.progress(1);
    });
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.style.cssText = "";
    });
  }, 900);

  var mm = gsap.matchMedia();

  mm.add(
    {
      reduceMotion: "(prefers-reduced-motion: reduce)",
      fullMotion: "(prefers-reduced-motion: no-preference)"
    },
    function (ctx) {
      var full = ctx.conditions.fullMotion;

      /* ---- hero entrance (page has .hero) ----
         Lines are hand-authored (.hero-line wraps both languages), so the
         entrance never disturbs the bilingual markup. */
      var heroLines = document.querySelectorAll(".hero-title .hero-line > span");
      if (heroLines.length && full) {
        gsap.from(heroLines, {
          yPercent: 120,
          stagger: 0.09,
          duration: 0.85,
          ease: "power3.out",
          delay: 0.15
        });
      }

      var heroSeq = document.querySelectorAll("[data-hero-seq]");
      if (heroSeq.length && full) {
        gsap.from(heroSeq, {
          y: 26,
          autoAlpha: 0,
          stagger: 0.1,
          delay: 0.45,
          duration: 0.7,
          clearProps: "all"
        });
      }

      /* mascot card: entrance + endless soft bounce (one beat ahead) */
      var mascot = document.querySelector(".hero-stage .mascot-card");
      if (mascot && full) {
        gsap.from(mascot, {
          scale: 0.86,
          autoAlpha: 0,
          duration: 0.9,
          delay: 0.3,
          ease: "back.out(1.4)",
          clearProps: "scale"
        });
        gsap.to(mascot, {
          y: -14,
          rotation: 1.2,
          duration: 3.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 1.2
        });
      }

      /* floating decorative shapes */
      var shapes = document.querySelectorAll(".hero-stage .shape");
      if (shapes.length && full) {
        shapes.forEach(function (el, i) {
          gsap.to(el, {
            y: i % 2 === 0 ? -18 : 14,
            rotation: i % 2 === 0 ? 6 : -8,
            duration: 3.6 + i * 0.6,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
          });
          gsap.from(el, {
            scale: 0,
            autoAlpha: 0,
            duration: 0.8,
            delay: 0.7 + i * 0.12,
            ease: "back.out(1.7)",
            clearProps: "scale,opacity,visibility"
          });
        });
      }

      /* ---- marquees: seamless, continuous loops ----
         No viewport play/pause: the loop is a single cheap transform tween,
         and the browser already stops rAF natively when the page is hidden. */
      document.querySelectorAll(".marquee-track").forEach(function (track) {
        gsap.to(track, {
          xPercent: -50,
          ease: "none",
          duration: 26,
          repeat: -1
        });
      });

      var galleryTrack = document.querySelector(".gallery-track");
      if (galleryTrack) {
        gsap.to(galleryTrack, {
          xPercent: -50,
          ease: "none",
          duration: 42,
          repeat: -1
        });
      }

      /* ---- generic scroll reveals ---- */
      var reveals = document.querySelectorAll("[data-reveal]");
      if (reveals.length) {
        if (full) {
          gsap.set(reveals, { y: 34, autoAlpha: 0 });
          ScrollTrigger.batch(reveals, {
            start: "top 86%",
            once: true,
            onEnter: function (batch) {
              if (motionDead) {
                gsap.set(batch, { clearProps: "all" });
                return;
              }
              gsap.to(batch, {
                y: 0,
                autoAlpha: 1,
                stagger: 0.09,
                duration: 0.7,
                ease: "power2.out",
                overwrite: true
              });
            }
          });
        } else {
          gsap.set(reveals, { autoAlpha: 1 });
        }
      }

      /* ---- section eyebrow underline pop ---- */

      /* ---- health ring draw ---- */
      var ringArc = document.querySelector(".ring-arc");
      if (ringArc) {
        var len = ringArc.getTotalLength ? ringArc.getTotalLength() : 0;
        if (len > 0) {
          gsap.fromTo(
            ringArc,
            { strokeDasharray: len, strokeDashoffset: len },
            {
              strokeDashoffset: len * (1 - 0.82),
              duration: full ? 1.6 : 0,
              ease: "power3.inOut",
              scrollTrigger: { trigger: ringArc, start: "top 78%", once: true }
            }
          );
        }
      }

      /* ---- metric + timer bars grow on enter ---- */
      document.querySelectorAll("[data-bar]").forEach(function (bar) {
        var to = parseFloat(bar.getAttribute("data-bar")) || 0.6;
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: to,
            duration: full ? 1.1 : 0,
            ease: "power3.out",
            scrollTrigger: { trigger: bar, start: "top 88%", once: true }
          }
        );
      });

      /* ---- gentle parallax on hero glow shapes ---- */
      if (full) {
        document.querySelectorAll("[data-parallax]").forEach(function (el) {
          var amount = parseFloat(el.getAttribute("data-parallax")) || 40;
          gsap.to(el, {
            yPercent: amount,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest("section") || el,
              start: "top top",
              end: "bottom top",
              scrub: 1
            }
          });
        });
      }
    }
  );

  /* language switch can change text metrics — recalc trigger positions */
  document.addEventListener("wokvibe:langchange", function () {
    window.ScrollTrigger && ScrollTrigger.refresh();
  });
})();
