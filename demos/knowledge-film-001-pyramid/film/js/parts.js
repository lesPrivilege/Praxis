/* Parts shared by several chapters. */
(function () {
  const { T } = Film, tl = K.tl;

  /* Chapter card: sits on the silent `<chapter>.card` segment. */
  function chapterCard(ch, no, title, sub) {
    const a = T(ch + '.card') - 0.25, b = T(ch + '.card', 'end') + 0.3;
    Film.scene(ch + '-card', a, b, ({ root }) => {
      root.classList.add('paper');
      K.el(root, 'grain'); K.el(root, 'vignette');
      gsap.set(root, { opacity: 0 });
      tl.to(root, { opacity: 1, duration: 0.35, ease: 'power2.out' }, a);
      const num = K.box(root, 'card-no t-num', 200, 372, null, null, no);
      const rule = K.box(root, 'card-rule', 200, 470, 1520, 3);
      gsap.set(rule, { scaleX: 0, transformOrigin: '0 50%' });
      const ttl = K.lines(root, 't-hero card-title', [title]);
      ttl.style.cssText += 'position:absolute;left:192px;top:500px;';
      const s = sub ? K.box(root, 't-lead card-sub', 200, 716, 1500, null, sub) : null;
      K.show(num, a + 0.3, { y: 0, duration: 0.5 });
      tl.to(rule, { scaleX: 1, duration: 1.0, ease: 'power3.inOut' }, a + 0.3);
      K.rise(ttl.inners, a + 0.55, { duration: 1.0 });
      if (s) K.show(s, a + 1.1, { y: 16, duration: 0.7 });
      tl.to(root, { opacity: 0, duration: 0.4, ease: 'power2.in' }, b - 0.4);
    });
  }

  window.Parts = { chapterCard };
})();
