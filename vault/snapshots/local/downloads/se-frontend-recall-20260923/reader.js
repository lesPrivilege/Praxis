(function () {
  "use strict";

  var reader = document.querySelector("[data-reader]");
  if (!reader) return;

  var modes = ["canonical", "practice", "index"];
  var root = document.documentElement;
  try {
    var savedTheme = localStorage.getItem("schema-engineering-theme");
    if (savedTheme === "light" || savedTheme === "dark") root.setAttribute("data-theme", savedTheme);
  } catch (_) { /* Reading remains available when storage is disabled. */ }
  var controls = Array.prototype.slice.call(document.querySelectorAll("[data-mode-link]"));
  var papers = Array.prototype.slice.call(document.querySelectorAll("[data-paper-mode]"));

  function decodedHash(hash) {
    try { return decodeURIComponent(hash.replace(/^#/, "")); }
    catch (_) { return hash.replace(/^#/, ""); }
  }

  function validMode(value) {
    return modes.indexOf(value) !== -1 ? value : "canonical";
  }

  function targetForHash(id, mode) {
    var scoped = document.querySelector('[data-paper-mode="' + validMode(mode || "canonical") + '"]');
    if (scoped) {
      var descendants = scoped.querySelectorAll("[id]");
      for (var index = 0; index < descendants.length; index += 1) {
        if (descendants[index].id === id) return descendants[index];
      }
      var alias = validMode(mode || "canonical") + "-" + id;
      for (var aliasIndex = 0; aliasIndex < descendants.length; aliasIndex += 1) {
        if (descendants[aliasIndex].id === alias) return descendants[aliasIndex];
      }
    }
    return document.getElementById(id);
  }

  function modeFromHash() {
    if (!window.location.hash) return null;
    var id = decodedHash(window.location.hash);
    var aliases = {
      canonical: "canonical",正文: "canonical", "paper-canonical": "canonical",
      practice: "practice",实践: "practice", "paper-practice": "practice",
      index: "index", "paper-index": "index"
    };
    if (aliases[id]) return aliases[id];
    var target = targetForHash(id, null);
    if (!target) return null;
    var paper = target.closest("[data-paper-mode]");
    return paper ? paper.getAttribute("data-paper-mode") : null;
  }

  function modeFromLocation() {
    var params = new URLSearchParams(window.location.search);
    var queryMode = params.get("mode") || params.get("view") || params.get("paper");
    return validMode(queryMode || modeFromHash() || "canonical");
  }

  function setMode(mode, announce) {
    mode = validMode(mode);
    papers.forEach(function (paper) {
      var active = paper.getAttribute("data-paper-mode") === mode;
      paper.setAttribute("data-active", String(active));
      paper.setAttribute("aria-hidden", String(!active));
    });
    controls.forEach(function (control) {
      if (control.hasAttribute("data-toc-link")) return;
      var active = control.getAttribute("data-mode-link") === mode;
      if (active) control.setAttribute("aria-current", "page");
      else control.removeAttribute("aria-current");
    });
    reader.setAttribute("data-reader-ready", "true");
    reader.setAttribute("data-active-mode", mode);
    if (announce) {
      var activePaper = document.querySelector('[data-paper-mode="' + mode + '"]');
      if (activePaper) activePaper.setAttribute("tabindex", "-1");
    }
  }

  function setLocationForMode(mode, hash) {
    var url = new URL(window.location.href);
    url.searchParams.set("mode", validMode(mode));
    if (hash) url.hash = hash;
    window.history.pushState({}, "", url.pathname + url.search + url.hash);
  }

  controls.forEach(function (control) {
    control.addEventListener("click", function (event) {
      event.preventDefault();
      var mode = validMode(control.getAttribute("data-mode-link"));
      var target = new URL(control.href, window.location.href);
      setMode(mode, true);
      setLocationForMode(mode, target.hash);
      if (target.hash) {
        var section = targetForHash(decodedHash(target.hash), mode);
        if (section) {
          section.setAttribute("tabindex", "-1");
          section.focus({ preventScroll: true });
          section.scrollIntoView({ block: "start", behavior: "auto" });
        }
      }
    });
  });

  document.querySelectorAll("[data-language-switch]").forEach(function (link) {
    link.addEventListener("click", function () {
      var target = new URL(link.getAttribute("href"), window.location.href);
      target.searchParams.set("mode", reader.getAttribute("data-active-mode") || modeFromLocation());
      var currentHash = window.location.hash;
      {
        var active = document.querySelector('[data-paper-mode="' + (reader.getAttribute("data-active-mode") || "canonical") + '"]');
        if (active) {
          var headings = Array.prototype.slice.call(active.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]"));
          var bar = document.querySelector(".view-controls");
          var margin = headings.length ? parseFloat(getComputedStyle(headings[0]).scrollMarginTop) || 0 : 0;
          var currentY = window.scrollY + Math.max(margin + 1, (bar ? bar.getBoundingClientRect().bottom : 0) + 16);
          var candidate = headings.filter(function (heading) { return heading.getBoundingClientRect().top + window.scrollY <= currentY; }).pop();
          if (candidate) currentHash = "#" + candidate.id;
        }
      }
      if (currentHash) target.hash = currentHash;
      link.href = target.href;
    });
  });

  window.addEventListener("popstate", function () { setMode(modeFromLocation(), false); });
  window.addEventListener("hashchange", function () { setMode(modeFromLocation(), false); });

  var themeButton = document.querySelector("[data-theme-toggle]");
  if (themeButton) {
    themeButton.addEventListener("click", function () {
      var explicit = root.getAttribute("data-theme");
      var systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      var current = explicit || (systemDark ? "dark" : "light");
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      themeButton.setAttribute("aria-pressed", String(next === "dark"));
      try { localStorage.setItem("schema-engineering-theme", next); } catch (_) { /* Optional preference. */ }
    });
    var dark = root.getAttribute("data-theme") === "dark" || (!root.hasAttribute("data-theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    themeButton.setAttribute("aria-pressed", String(dark));
  }

  // Wide screens carry the contents as a rail beside the column; narrow screens keep it folded.
  var rail = window.matchMedia ? window.matchMedia("(min-width: 1100px)") : null;
  function foldContents() {
    document.querySelectorAll(".reader-toc").forEach(function (toc) { toc.open = Boolean(rail && rail.matches); });
  }
  foldContents();
  if (rail && rail.addEventListener) rail.addEventListener("change", foldContents);

  setMode(modeFromLocation(), false);
  if (window.location.hash) {
    window.setTimeout(function () {
      var id = decodedHash(window.location.hash);
      var target = targetForHash(id, modeFromLocation());
      if (target) target.scrollIntoView({ block: "start", behavior: "auto" });
    }, 0);
  }
}());
