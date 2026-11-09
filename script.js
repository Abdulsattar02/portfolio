/* Abdul Sattar Maher — portfolio
   Small, dependency-free. If this file fails to load, every section is still visible
   (the hidden "reveal" state only applies once this script marks the page as ready). */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Year in footer ---------- */
  var year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Scroll reveal: smooth fade + slight rise ---------- */
  var reveals = $$(".reveal");
  function showAll() { reveals.forEach(function (el) { el.classList.add("is-in"); }); }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    showAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });

    // Anything already on screen (hero) fades in right after load
    requestAnimationFrame(function () {
      reveals.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-in");
      });
    });
  }
  // Tell the safety timer in <head> that the script ran; also show everything when printing
  window.__portfolioReady = true;
  window.addEventListener("beforeprint", showAll);

  /* ---------- Theme toggle (saved per visitor) ---------- */
  var toggle = $("#theme-toggle");
  var metaThemes = $$('meta[name="theme-color"]');
  function isDark() {
    var t = root.dataset.theme;
    return t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function syncToggle() {
    var dark = isDark();
    if (toggle) toggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    metaThemes.forEach(function (m) { m.setAttribute("content", dark ? "#1b231e" : "#f7f5ee"); });
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) {}
      syncToggle();
    });
  }
  syncToggle();

  /* ---------- Sticky header border + mobile menu ---------- */
  var header = $(".site-header");
  function onScroll() { if (header) header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var menuBtn = $("#menu-toggle");
  var navLinks = $("#nav-links");
  function setMenu(open) {
    if (!menuBtn || !navLinks) return;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    navLinks.classList.toggle("is-open", open);
  }
  if (menuBtn) {
    menuBtn.addEventListener("click", function () { setMenu(menuBtn.getAttribute("aria-expanded") !== "true"); });
    $$("a", navLinks).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    document.addEventListener("click", function (e) {
      if (navLinks.classList.contains("is-open") && !navLinks.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
    });
  }

  /* ---------- Active section highlight in the nav ---------- */
  var links = $$(".nav-links a");
  var sections = links.map(function (a) { return $(a.getAttribute("href")); }).filter(Boolean);
  function setActive() {
    var line = window.innerHeight * 0.35;
    var current = null;
    sections.forEach(function (s) { if (s.getBoundingClientRect().top <= line) current = s; });
    // at the very bottom, the last section is the active one
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = sections[sections.length - 1];
    links.forEach(function (a) {
      var on = current && a.getAttribute("href") === "#" + current.id;
      a.classList.toggle("is-active", !!on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(function () { setActive(); ticking = false; }); }
  }, { passive: true });
  window.addEventListener("resize", setActive);
  setActive();

  /* ---------- Subtle cursor ring (mouse/trackpad only) ---------- */
  var cursor = $(".cursor");
  if (cursor && !reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    root.classList.add("has-cursor");
    var x = -100, y = -100, cx = -100, cy = -100, running = false;
    function loop() {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      cursor.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0)";
      if (Math.abs(x - cx) > 0.1 || Math.abs(y - cy) > 0.1) requestAnimationFrame(loop); else running = false;
    }
    document.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      x = e.clientX; y = e.clientY;
      cursor.classList.add("is-visible");
      if (!running) { running = true; requestAnimationFrame(loop); }
    }, { passive: true });
    document.addEventListener("pointerover", function (e) {
      cursor.classList.toggle("is-hover", !!e.target.closest("a, button, .btn, input, textarea, label"));
    });
    document.documentElement.addEventListener("mouseleave", function () { cursor.classList.remove("is-visible"); });
  }

  /* ---------- Contact form → Web3Forms → your inbox ---------- */
  var form = $("#contact-form");
  if (form) {
    var status = $("#form-status");
    var submit = $("#f-submit");
    var submitText = $(".btn-text", submit);
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    var rules = {
      name: function (v) { return v.length < 2 ? "Please enter your name." : ""; },
      email: function (v) { return !v ? "Please enter your email address." : (!emailRe.test(v) ? "That email address doesn’t look right." : ""); },
      message: function (v) { return v.length < 10 ? "Please write at least a short message (10+ characters)." : ""; }
    };

    function check(field) {
      var msg = rules[field.name](field.value.trim());
      var err = $("#" + field.getAttribute("aria-describedby"));
      field.setAttribute("aria-invalid", msg ? "true" : "false");
      if (err) err.textContent = msg;
      return !msg;
    }
    var fields = ["name", "email", "message"].map(function (n) { return form.elements[n]; });
    fields.forEach(function (f) {
      f.addEventListener("blur", function () { if (f.value) check(f); });
      f.addEventListener("input", function () { if (f.getAttribute("aria-invalid") === "true") check(f); });
    });

    function setStatus(text, type) {
      status.textContent = text;
      status.className = "form-status" + (type ? " is-" + type : "");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      setStatus("", "");

      var valid = fields.map(check).every(Boolean);
      if (!valid) {
        var firstBad = fields.filter(function (f) { return f.getAttribute("aria-invalid") === "true"; })[0];
        if (firstBad) firstBad.focus();
        return;
      }
      if (form.elements.botcheck.checked) return; // bot: quietly drop it

      var key = form.elements.access_key.value;
      if (!key || key.indexOf("YOUR_") === 0) {
        // No Web3Forms key yet: open the visitor's email app with everything filled in
        var v = function (n) { return form.elements[n].value.trim(); };
        var body = v("message") + "\n\n— " + v("name") + " (" + v("email") + ")";
        window.location.href = "mailto:abdulsattarmaher20@gmail.com?subject=" +
          encodeURIComponent("Portfolio message from " + v("name")) + "&body=" + encodeURIComponent(body);
        setStatus("Opening your email app with your message ready to send.", "ok");
        return;
      }

      submit.disabled = true;
      submitText.textContent = "Sending…";

      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      data.replyto = data.email; // so "Reply" in Gmail goes straight to the sender

      fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, body: j }; }); })
        .then(function (res) {
          if (res.ok && res.body.success !== false) {
            form.reset();
            fields.forEach(function (f) { f.removeAttribute("aria-invalid"); });
            setStatus("Thanks, your message is on its way. I’ll reply soon.", "ok");
          } else {
            throw new Error(res.body.message || "Request failed");
          }
        })
        .catch(function () {
          setStatus("Sorry, the message didn’t send. Please try again or email abdulsattarmaher20@gmail.com.", "error");
        })
        .then(function () {
          submit.disabled = false;
          submitText.textContent = "Send message";
        });
    });
  }
})();
