// Page runtime: navigation drawer, page TOC, search, case topology views,
// and the registry interactive figures attach to. Without it every page
// stays complete: figures show their static fallback, all topology views show.
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var root = document.querySelector('.book-title').getAttribute('href').replace(/index\.html$/, '');

  // drawer
  var toggle = document.querySelector('.nav-toggle');
  toggle.addEventListener('click', function () {
    var open = document.body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
  var cur = document.querySelector('.book-nav [aria-current="page"]');
  if (cur) cur.scrollIntoView({ block: 'center' });

  // progress rail: the scene being read is current, earlier ones are passed
  var railItems = Array.prototype.slice.call(document.querySelectorAll('.rail li'));
  var scenes = railItems.map(function (li) { return document.getElementById(decodeURIComponent(li.querySelector('a').hash.slice(1))); });
  if (railItems.length) {
    var ticking = false;
    var update = function () {
      ticking = false;
      var line = window.innerHeight * 0.32;
      var cur = -1;
      scenes.forEach(function (h, i) { if (h && h.getBoundingClientRect().top <= line) cur = i; });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = scenes.length - 1;
      railItems.forEach(function (li, i) {
        li.classList.toggle('current', i === cur);
        li.classList.toggle('passed', i < cur);
        var a = li.querySelector('a');
        if (i === cur) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; setTimeout(update, 60); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // search over titles and section headings
  var input = document.querySelector('.search input');
  var list = document.createElement('ul');
  list.className = 'search-results';
  list.hidden = true;
  list.setAttribute('role', 'listbox');
  input.parentNode.appendChild(list);
  var index = [];
  (window.BOOK_INDEX || []).forEach(function (p) {
    index.push({ u: p.u, t: p.t, s: '' });
    p.h.forEach(function (h) { index.push({ u: p.u + '#' + h[0], t: h[1], s: p.t }); });
  });
  var sel = -1;
  function render(q) {
    list.innerHTML = '';
    sel = -1;
    if (!q) { list.hidden = true; return; }
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    var hits = index.filter(function (it) {
      var hay = (it.t + ' ' + it.s).toLowerCase();
      return terms.every(function (t) { return hay.indexOf(t) >= 0; });
    }).slice(0, 30);
    hits.forEach(function (it) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = root + it.u;
      a.textContent = it.t;
      if (it.s) { var s = document.createElement('span'); s.textContent = it.s; a.appendChild(s); }
      li.appendChild(a);
      list.appendChild(li);
    });
    if (!hits.length) { var li = document.createElement('li'); li.innerHTML = '<a>没有匹配的标题</a>'; list.appendChild(li); }
    list.hidden = false;
  }
  input.addEventListener('input', function () { render(input.value.trim()); });
  input.addEventListener('keydown', function (e) {
    var items = list.querySelectorAll('a[href]');
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      sel = Math.max(0, Math.min(items.length - 1, sel + (e.key === 'ArrowDown' ? 1 : -1)));
      items.forEach(function (a, i) { a.setAttribute('aria-selected', String(i === sel)); });
    } else if (e.key === 'Enter' && items.length) {
      location.href = items[Math.max(sel, 0)].href;
    } else if (e.key === 'Escape') { input.value = ''; render(''); }
  });
  document.addEventListener('click', function (e) { if (!input.parentNode.contains(e.target)) list.hidden = true; });

  // case topology: tabs and node focus
  Array.prototype.forEach.call(document.querySelectorAll('.topo'), function (topo) {
    var data = JSON.parse(topo.parentNode.querySelector('.topo-data').textContent);
    var tabs = Array.prototype.slice.call(topo.querySelectorAll('[role="tab"]'));
    var views = Array.prototype.slice.call(topo.querySelectorAll('.topo-view'));
    var detail = topo.querySelector('.topo-detail');
    var hint = detail.innerHTML;
    function show(id) {
      tabs.forEach(function (t) {
        var on = t.dataset.view === id;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
      });
      views.forEach(function (v) { v.hidden = v.dataset.view !== id; });
      clearFocus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(t.dataset.view); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (d) { var n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); show(n.dataset.view); }
      });
    });
    show(tabs[0].dataset.view);
    function clearFocus() {
      topo.querySelectorAll('svg.graph').forEach(function (s) { s.classList.remove('has-focus'); });
      topo.querySelectorAll('.on, .focus').forEach(function (el) { el.classList.remove('on', 'focus'); });
      detail.innerHTML = hint;
    }
    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    topo.querySelectorAll('svg.graph .node').forEach(function (g) {
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', data.n[g.dataset.id].l);
      function focusNode() {
        var svg = g.ownerSVGElement;
        var id = g.dataset.id;
        if (g.classList.contains('focus')) { clearFocus(); return; }
        clearFocus();
        svg.classList.add('has-focus');
        g.classList.add('focus', 'on');
        var types = {};
        svg.querySelectorAll('.edge, .edge-label').forEach(function (el) {
          if (el.dataset.from === id || el.dataset.to === id) {
            el.classList.add('on');
            types[el.dataset.from === id ? el.dataset.to : el.dataset.from] = 1;
          }
        });
        svg.querySelectorAll('.node').forEach(function (n) { if (types[n.dataset.id]) n.classList.add('on'); });
        var visible = {};
        svg.querySelectorAll('.edge').forEach(function (el) { visible[el.dataset.type] = 1; });
        var n = data.n[id];
        var rows = data.e.filter(function (e) { return (e.f === id || e.to === id) && visible[e.t]; }).map(function (e) {
          var other = e.f === id ? '→ ' + data.n[e.to].l : data.n[e.f].l + ' →';
          return '<li><b>' + esc(e.t) + '</b> ' + esc(other) + '<dl><dt>传递内容</dt><dd>' + esc(e.p) + '</dd><dt>时机</dt><dd>' + esc(e.tm) +
            '</dd><dt>约束</dt><dd>' + esc(e.i) + '</dd><dt>失败处理</dt><dd>' + esc(e.x) + '</dd>' + (e.b ? '<dt>依据</dt><dd>' + esc(e.b) + '</dd>' : '') + '</dl></li>';
        });
        detail.innerHTML = '<h4>' + esc(n.l) + '</h4><p class="node-meta">' + esc(n.k) + ' · 权威：' + esc(n.a) + ' · 租户范围：' + esc(n.s) + '</p><ul>' + rows.join('') + '</ul>';
      }
      g.addEventListener('click', focusNode);
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); focusNode(); } });
    });
  });

  // interactive figures register themselves in window.FIGURES
  window.FIGURES = window.FIGURES || {};
  // Shared helpers for figures.
  window.FigKit = {
    // Stepper: renders step chips plus prev/next; calls render(i) on change.
    stepper: function (host, labels, render) {
      var bar = document.createElement('div');
      bar.className = 'fig-controls stepper';
      var prev = btn('上一步'), next = btn('下一步');
      var chips = labels.map(function (l, i) {
        var b = btn((i + 1) + ' ' + l);
        b.className = 'step';
        b.addEventListener('click', function () { go(i); });
        return b;
      });
      bar.appendChild(prev);
      chips.forEach(function (c) { bar.appendChild(c); });
      bar.appendChild(next);
      host.appendChild(bar);
      var cur = 0;
      prev.addEventListener('click', function () { go(cur - 1); });
      next.addEventListener('click', function () { go(cur + 1); });
      function go(i) {
        cur = Math.max(0, Math.min(labels.length - 1, i));
        chips.forEach(function (c, j) { if (j === cur) c.setAttribute('aria-current', 'step'); else c.removeAttribute('aria-current'); });
        prev.disabled = cur === 0;
        next.disabled = cur === labels.length - 1;
        render(cur);
      }
      go(0);
      return { go: go, get: function () { return cur; } };
    },
    toggle: function (host, label, onChange) {
      var b = btn(label);
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () {
        var on = b.getAttribute('aria-pressed') !== 'true';
        b.setAttribute('aria-pressed', String(on));
        onChange(on);
      });
      host.appendChild(b);
      return b;
    },
    fmt: function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); },
    h: function (tag, attrs, html) {
      var el = document.createElement(tag);
      for (var k in attrs || {}) el.setAttribute(k, attrs[k]);
      if (html != null) el.innerHTML = html;
      return el;
    },
  };
  function btn(text) { var b = document.createElement('button'); b.type = 'button'; b.textContent = text; return b; }
  function initFigures() {
    Array.prototype.forEach.call(document.querySelectorAll('.fig[data-fig]'), function (el) {
      var fn = window.FIGURES[el.dataset.fig];
      if (fn && !el.classList.contains('ready')) {
        try { fn(el.querySelector('.fig-body'), el); el.classList.add('ready'); }
        catch (err) { console.error('figure ' + el.dataset.fig, err); }
      }
    });
  }
  window.addEventListener('DOMContentLoaded', initFigures);
  if (document.readyState !== 'loading') setTimeout(initFigures, 0);

  // print: open every collapsed block so nothing is lost on paper
  var opened = [];
  window.addEventListener('beforeprint', function () {
    document.querySelectorAll('details:not([open])').forEach(function (d) { d.open = true; opened.push(d); });
  });
  window.addEventListener('afterprint', function () { opened.forEach(function (d) { d.open = false; }); opened = []; });
})();
