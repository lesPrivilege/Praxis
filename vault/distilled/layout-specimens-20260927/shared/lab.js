// Layout specimen lab · optional viewing controls.
// Without JS every specimen is readable at natural width in stacked order.
(function () {
  var bar = document.querySelector('.lab-bar');
  if (!bar) return;
  var body = document.body;
  var store = {
    get: function (k) { try { return localStorage.getItem('lab:' + k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem('lab:' + k, v); } catch (e) { /* private mode */ } }
  };

  var groups = [
    { key: 'width', label: '舞台宽', options: [['auto', '自然'], ['720', '720'], ['375', '375']] },
    { key: 'layout', label: '变体', options: [['stack', '堆叠'], ['side', '并排']] }
  ];
  if (document.querySelector('[data-atom]')) {
    groups.push({ key: 'bounds', label: '原子边界', options: [['off', '隐藏'], ['on', '显示']] });
  }

  var wrap = document.createElement('div');
  wrap.className = 'lab-controls';
  groups.forEach(function (g) {
    var fs = document.createElement('fieldset');
    var lg = document.createElement('legend');
    lg.textContent = g.label;
    fs.appendChild(lg);
    var current = store.get(g.key) || g.options[0][0];
    body.setAttribute('data-' + g.key, current);
    g.options.forEach(function (opt) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = opt[1];
      b.setAttribute('aria-pressed', String(opt[0] === current));
      b.addEventListener('click', function () {
        body.setAttribute('data-' + g.key, opt[0]);
        store.set(g.key, opt[0]);
        fs.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      });
      fs.appendChild(b);
    });
    wrap.appendChild(fs);
  });
  bar.appendChild(wrap);
})();

// Check mode (?check): report horizontal overflow and clipped text for headless runs.
// Output lands in <pre id="lab-check"> so `chrome --dump-dom` can read it.
// ?w=375 narrows the layout box for headless Chrome, whose window cannot go below 500px.
// Media queries still see the real window; container queries see the narrowed width.
(function () {
  var m = /[?&]w=(\d+)/.exec(location.search);
  if (m) { document.documentElement.style.width = m[1] + 'px'; document.documentElement.style.overflowX = 'visible'; }
  // ?focus=ID keeps only that element (and the top bar) so headless screenshots start at it.
  var f = /[?&]focus=([^&#]+)/.exec(location.search);
  var target = f && document.getElementById(decodeURIComponent(f[1]));
  for (var el = target; el && el !== document.body; el = el.parentElement) {
    Array.prototype.forEach.call(el.parentElement.children, function (sib) {
      if (sib !== el && sib.tagName !== 'SCRIPT' && !sib.classList.contains('lab-bar')) sib.style.display = 'none';
    });
  }
  if (location.search.indexOf('check') < 0) return;
  function run() {
    var vw = m ? +m[1] : document.documentElement.clientWidth;
    var issues = [];
    var sw = m ? document.body.scrollWidth : document.documentElement.scrollWidth;
    if (sw > vw + 1) {
      issues.push({ kind: 'page-hscroll', scrollWidth: sw, viewport: vw });
    }
    document.querySelectorAll('.stage, [data-check-root]').forEach(function (root) {
      var rb = root.getBoundingClientRect();
      root.querySelectorAll('*').forEach(function (el) {
        var cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || el.closest('.sr-only')) return;
        if (el.closest('[data-allow-scroll]')) return;
        var b = el.getBoundingClientRect();
        if (b.width === 0 && b.height === 0) return;
        var owner = (el.closest('[id]') || root).id || '?';
        if (b.right > rb.right + 1 || b.left < rb.left - 1) {
          issues.push({ kind: 'outside-stage', at: owner, tag: el.tagName.toLowerCase(), cls: String(el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className).slice(0, 60), over: Math.round(b.right - rb.right) });
        }
        var clips = /(hidden|clip)/.test(cs.overflowX + cs.overflowY) || cs.textOverflow === 'ellipsis';
        if (clips && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) && el.textContent.trim()) {
          issues.push({ kind: 'clipped', at: owner, tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 60) });
        }
      });
    });
    // collapse duplicates per owner/kind
    var seen = {}, out = [];
    issues.forEach(function (i) { var k = i.kind + '|' + i.at + '|' + (i.cls || ''); if (!seen[k]) { seen[k] = 1; out.push(i); } });
    var pre = document.createElement('pre');
    pre.id = 'lab-check';
    pre.hidden = true;
    pre.textContent = JSON.stringify({ viewport: vw, issues: out });
    document.body.appendChild(pre);
  }
  if (document.readyState === 'complete') run(); else window.addEventListener('load', run);
})();
