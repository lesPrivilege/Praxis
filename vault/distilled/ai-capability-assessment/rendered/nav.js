// Chapter presentation. No JS: all questions remain visible, including static Q4 examples.
if (typeof document !== 'undefined') (function () {
  var ids = __IDS__;
  var answerTitle = document.querySelector('.home').textContent;
  var root = document.documentElement;
  var overview = document.getElementById('outline-dialog');
  var overviewButton = document.getElementById('chapter-overview');
  var prev = document.getElementById('chapter-prev');
  var next = document.getElementById('chapter-next');
  var count = document.getElementById('chapter-count');
  var sectionCue = document.getElementById('chapter-section');
  var progress = document.getElementById('chapter-progress');
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
    if (!current || restoring || overview.open) return;
    positions[current] = window.scrollY;
    try { sessionStorage.setItem('q-positions', JSON.stringify(positions)); } catch (e) {}
  }
  function offset(el) {
    return Math.max(0, el.getBoundingClientRect().top + window.scrollY - 24);
  }
  function closeOverview() {
    if (overview.open) overview.close();
  }
  function show(t, focusHeading) {
    restoring = true;
    current = t.page || ids[0];
    root.classList.toggle('entered', !!t.page);
    ids.forEach(function (q) {
      document.getElementById(q).hidden = q !== current;
      document.querySelectorAll('.chapter-tab[href="#' + q + '"], .chapter-link[href="#' + q + '"], .card[href="#' + q + '"]').forEach(function (link) {
        if (q === current) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    });
    var tabs = document.querySelector('.chapter-tabs');
    var activeTab = document.querySelector('.chapter-tab[aria-current="page"]');
    if (tabs && activeTab && tabs.scrollWidth > tabs.clientWidth) {
      var bounds = tabs.getBoundingClientRect();
      var activeBounds = activeTab.getBoundingClientRect();
      if (activeBounds.left < bounds.left) tabs.scrollLeft += activeBounds.left - bounds.left;
      else if (activeBounds.right > bounds.right) tabs.scrollLeft += activeBounds.right - bounds.right;
    }
    var index = ids.indexOf(current);
    var menu = document.querySelector('.chapter-menu');
    if (menu) {
      var link = menu.querySelector('.chapter-link[aria-current="page"]');
      menu.querySelector('.chapter-menu-current').textContent = link.querySelector('.chapter-tab-no').textContent + ' / '
        + String(ids.length).padStart(2, '0') + '  ' + link.querySelector('.chapter-tab-title').textContent;
      menu.open = false;
    }
    prev.disabled = index === 0;
    next.disabled = index === ids.length - 1;
    [[prev, index - 1, '上一题'], [next, index + 1, '下一题']].forEach(function (item) {
      var tab = document.querySelector('.chapter-tab[href="#' + ids[item[1]] + '"]');
      item[0].querySelector('.pager-label').textContent = tab
        ? tab.querySelector('.chapter-tab-no').textContent + ' ' + tab.querySelector('.chapter-tab-title').textContent
        : item[2];
      item[0].setAttribute('aria-label', tab ? item[2] + '：' + tab.querySelector('.chapter-tab-title').textContent : item[2]);
    });
    count.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(ids.length).padStart(2, '0');
    document.title = document.querySelector('#' + current + ' .q-title').textContent + ' · ' + answerTitle;
    requestAnimationFrame(function () {
      if (!t.page) window.scrollTo(0, 0);
      else if (t.anchor) window.scrollTo(0, offset(t.anchor));
      else window.scrollTo(0, positions[current] != null ? positions[current] : offset(document.getElementById(current)));
      if (focusHeading) {
        var heading = document.querySelector('#' + current + ' h2');
        heading.tabIndex = -1;
        heading.focus({preventScroll: true});
      }
      requestAnimationFrame(function () { restoring = false; cue(); });
    });
  }
  function cue() {
    // Section number of the part being read, shown next to the chapter count.
    var page = current && document.getElementById(current);
    if (!page) return;
    var parts = page.querySelectorAll('.argument, .q-sources');
    var line = window.innerHeight * 0.35, label = '';
    parts.forEach(function (part) {
      if (part.getBoundingClientRect().top < line) {
        var no = part.querySelector('.sec-no');
        label = no ? no.textContent : '来源';
      }
    });
    sectionCue.textContent = label ? '· ' + label : '';
    // Reading progress through the current chapter, drawn as a thin line on the pager.
    var top = page.getBoundingClientRect().top + window.scrollY;
    var span = Math.max(1, page.offsetHeight - window.innerHeight);
    var ratio = Math.min(1, Math.max(0, (window.scrollY - top + 80) / span));
    progress.style.transform = 'scaleX(' + ratio.toFixed(3) + ')';
  }
  function go(delta) {
    var index = ids.indexOf(current) + delta;
    if (index < 0 || index >= ids.length) return;
    remember();
    location.hash = ids[index];
  }
  prev.addEventListener('click', function () { go(-1); });
  next.addEventListener('click', function () { go(1); });
  overviewButton.addEventListener('click', function () {
    remember();
    overview.showModal();
    overviewButton.setAttribute('aria-expanded', 'true');
    var selected = overview.querySelector('[aria-current="page"]');
    if (selected) selected.focus();
  });
  document.getElementById('outline-close').addEventListener('click', closeOverview);
  overview.addEventListener('close', function () {
    overviewButton.setAttribute('aria-expanded', 'false');
  });
  overview.addEventListener('click', function (event) {
    var link = event.target.closest('a.card');
    if (!link) return;
    event.preventDefault();
    var hash = link.getAttribute('href');
    closeOverview();
    if (location.hash === hash) show(target(), true);
    else location.hash = hash;
  });
  document.addEventListener('pointerdown', function () { root.classList.remove('keyed'); });
  document.addEventListener('keydown', function (event) {
    if (overview.open || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
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
  window.addEventListener('hashchange', function () { closeOverview(); show(target(), true); });
  window.addEventListener('pagehide', remember);
  show(target(), false);
  if (document.readyState !== 'complete') {
    window.addEventListener('load', function () { show(target(), false); }, {once: true});
  }
})();
