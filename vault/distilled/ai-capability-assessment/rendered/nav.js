// Chapter presentation. No JS: all questions remain visible, chapter links and chapter-end links jump by anchor.
if (typeof document !== 'undefined') (function () {
  var ids = __IDS__;
  var answerTitle = document.querySelector('.home').textContent;
  var root = document.documentElement;
  var menu = document.querySelector('.chapter-menu');
  var menuCurrent = menu.querySelector('.chapter-menu-current');
  var menuProgress = menu.querySelector('.menu-progress');
  var positions = {};
  var current = null;
  var restoring = false;
  try { positions = JSON.parse(sessionStorage.getItem('q-positions')) || {}; } catch (e) {}
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  root.classList.add('paged');

  function target() {
    var id = (location.hash || '').slice(1);
    if (ids.indexOf(id) >= 0) return {page: id, anchor: null};
    var el = id && document.getElementById(id);
    var page = el && el.closest('.q-page');
    return page ? {page: page.id, anchor: el} : {page: null, anchor: null};
  }
  function remember() {
    if (!current || restoring) return;
    positions[current] = window.scrollY;
    try { sessionStorage.setItem('q-positions', JSON.stringify(positions)); } catch (e) {}
  }
  function offset(el) {
    // Leave room for the sticky chapter menu when it is shown (narrower screens).
    var cover = menu.offsetHeight ? menu.offsetHeight + 16 : 24;
    return Math.max(0, el.getBoundingClientRect().top + window.scrollY - cover);
  }
  function chapterLabel(index) {
    var link = document.querySelector('.chapter-menu .chapter-link[href="#' + ids[index] + '"]');
    return link.querySelector('.chapter-tab-no').textContent + ' / ' + String(ids.length).padStart(2, '0')
      + '  ' + link.querySelector('.chapter-tab-title').textContent;
  }
  function cue() {
    // Section being read and reading progress through the current chapter.
    var page = current && document.getElementById(current);
    if (!page) return;
    var line = window.innerHeight * 0.35, label = '', reading = null;
    page.querySelectorAll('.argument, .q-sources').forEach(function (part) {
      if (part.getBoundingClientRect().top < line) {
        var no = part.querySelector('.sec-no');
        label = no ? no.textContent : '来源';
        reading = part.classList.contains('argument') ? part.id : null;
      }
    });
    var top = page.getBoundingClientRect().top + window.scrollY;
    var span = Math.max(1, page.offsetHeight - window.innerHeight);
    var ratio = Math.min(1, Math.max(0, (window.scrollY - top + 80) / span));
    document.querySelectorAll('.rail-section-link').forEach(function (link) {
      link.classList.toggle('reading', link.getAttribute('href') === '#' + reading);
    });
    menuCurrent.textContent = chapterLabel(ids.indexOf(current)) + (label ? '  · ' + label : '');
    menuProgress.style.transform = 'scaleX(' + ratio.toFixed(3) + ')';
  }
  function show(t, focusHeading) {
    restoring = true;
    current = t.page || ids[0];
    ids.forEach(function (q) {
      document.getElementById(q).hidden = q !== current;
      document.querySelectorAll('.chapter-link[href="#' + q + '"]').forEach(function (link) {
        if (q === current) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    });
    menu.open = false;
    document.title = document.querySelector('#' + current + ' .q-title').textContent + ' · ' + answerTitle;
    requestAnimationFrame(function () {
      if (!t.page) window.scrollTo(0, 0);
      else if (t.anchor) window.scrollTo(0, offset(t.anchor));
      else window.scrollTo(0, positions[current] != null ? positions[current] : offset(document.getElementById(current)));
      if (focusHeading) {
        // Programmatic focus target for screen readers; its outline is suppressed in CSS.
        var heading = document.querySelector('#' + current + ' h2');
        heading.tabIndex = -1;
        heading.focus({preventScroll: true});
      }
      requestAnimationFrame(function () { restoring = false; cue(); });
    });
  }
  function go(delta) {
    var index = ids.indexOf(current) + delta;
    if (index < 0 || index >= ids.length) return;
    remember();
    location.hash = ids[index];
  }
  document.addEventListener('pointerdown', function () { root.classList.remove('keyed'); });
  document.addEventListener('keydown', function (event) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.target.closest('input, textarea, select, [contenteditable], .explorer, [role="slider"]')) return;
    var selection = window.getSelection();
    if (selection && !selection.isCollapsed) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      root.classList.add('keyed');
      go(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  var pending = false;
  window.addEventListener('scroll', function () {
    if (pending || restoring) return;
    pending = true;
    requestAnimationFrame(function () { pending = false; remember(); cue(); });
  }, {passive: true});
  window.addEventListener('hashchange', function () { show(target(), true); });
  window.addEventListener('pagehide', remember);
  show(target(), false);
  if (document.readyState !== 'complete') {
    window.addEventListener('load', function () { show(target(), false); }, {once: true});
  }
})();
