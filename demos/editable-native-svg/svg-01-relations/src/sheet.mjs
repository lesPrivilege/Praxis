// rel-sheet：把几件图叠成一张，靠共同的指向串起来。
// 某一件里写到的 对象@版本，如果正好是另一件里画出来的对象或版本，就在左侧留白处拉一条细线把两处连上。
// 线用最浅的一档灰，主干画在各件的内容之外；它只是文字指向的重复，连不上的指向照常以文字留在原处。

import { T, PAD, canvas, finish, need } from './kernel.mjs';
import { LEGEND } from './standing.mjs';

const MAX_RAILS = 5;
const FIRST_LINE = 10.5;

export function sheet(model, { width = 480, scope, generators }) {
  const m = model;
  need(Array.isArray(m.pieces) && m.pieces.length >= 2, 'pieces', '组合至少要有两件');
  need(m.pieces.every((p) => Object.hasOwn(generators, p.asset) && p.asset !== 'rel-sheet' && p.heading), 'pieces', '每一件要有已知的 asset 和一个小标题，组合里不再套组合');
  // 连线只在各件都是上下排的窄版时不穿过内容
  need(width <= 520, 'capacity', `组合宽度 ${width} 超过 520：各件会换成左右排的宽版，连线会穿过内容`);

  const draw = (inner) => m.pieces.map((p, i) => generators[p.asset](p.model, { width: inner, scope: `${scope}-p${i}`, legend: false }));
  // 一处写到的指向落在另一件画出来的对象或版本上，才算连得上
  const linksOf = (pieces) => {
    const rails = new Map();
    pieces.forEach((res, i) => {
      for (const mt of res.mentions) {
        const hits = pieces.map((other, k) => k).filter((k) => k !== i && Object.hasOwn(pieces[k].boxes, mt.target));
        need(hits.length <= 1, 'ambiguous-target', `${mt.text} 在另外两件里都画了出来，不知道该连到哪一件`);
        if (!hits.length) continue;
        const j = hits[0];
        if (!rails.has(mt.target)) rails.set(mt.target, { target: mt.target, piece: j, mentions: [] });
        rails.get(mt.target).mentions.push({ piece: i, owner: mt.owner, text: mt.text, x: mt.x, y: mt.y });
      }
    });
    return [...rails.values()];
  };

  // 先按满宽排一遍，数出要几条连线，再按留白后的宽度重排
  const count = linksOf(draw(width - 2 * PAD)).length;
  need(count <= MAX_RAILS, 'capacity', `有 ${count} 个对象或版本被别的件指到，超过已测试的 ${MAX_RAILS} 个；拆成两张，或只保留文字指向`);
  const margin = count ? 8 + 12 * count : 0;
  const inner = width - 2 * PAD - margin;
  const pieces = draw(inner);
  const rails = linksOf(pieces);
  // 同一个对象在各件里用同一个名字，读者才能用眼睛对上
  const names = new Map();
  for (const mt of pieces.flatMap((p) => p.mentions)) {
    need(!names.has(mt.id) || names.get(mt.id) === mt.name, 'inconsistent-label', `对象 ${mt.id} 在各处的名字不一样：“${names.get(mt.id)}”和“${mt.name}”`);
    names.set(mt.id, mt.name);
  }

  const c = canvas(scope, pieces.flatMap((p) => p.marks));
  let y = 0;
  const top = [];
  pieces.forEach((res, i) => {
    y += c.label(`piece.${i}.heading`, m.pieces[i].heading, { x: margin, y, w: inner, size: T.small, weight: 600, fill: T.sub }).h + 6;
    top[i] = y;
    // 嵌入的一件保留自己的坐标系；名称和说明由整张图统一给出
    c.add(res.svg.replace(/^<svg /, `<svg x="${margin}" y="${y}" `).replace(/ role="img" aria-labelledby="[^"]*"/, '').trimEnd());
    y += res.height + 18;
  });
  y -= 18;

  // 被指到的一端在上或在下都可以；跨度长的线排在外侧
  const at = (piece, localY) => top[piece] + PAD + localY;
  const spans = rails.map((r) => {
    const b = pieces[r.piece].boxes[r.target];
    const ty = at(r.piece, b.y + FIRST_LINE);
    const ends = r.mentions.map((mt) => ({ ...mt, gy: at(mt.piece, mt.y) }));
    const ys = [ty, ...ends.map((e) => e.gy)];
    return { ...r, ty, tx: margin + PAD + b.x, ends, y1: Math.min(...ys), y2: Math.max(...ys) };
  });
  spans.sort((a, b) => b.y2 - b.y1 - (a.y2 - a.y1));
  const links = [];
  spans.forEach((r, k) => {
    const x = 4 + 12 * k;
    c.open({ 'data-role': 'cross-link', 'data-target': r.target });
    c.path([[r.tx - 2, r.ty], [x, r.ty], [x, r.y1 === r.ty ? r.y2 : r.y1]], { color: T.faint, width: 1 });
    if (r.y1 < r.ty && r.y2 > r.ty) c.path([[x, r.ty], [x, r.y2]], { color: T.faint, width: 1 });
    c.add(`<circle cx="${r.tx - 2}" cy="${r.ty}" r="2" fill="${T.faint}"/>`);
    for (const e of r.ends) {
      const ex = margin + PAD + e.x - 4;
      c.path([[x, e.gy], [ex, e.gy]], { color: T.faint, width: 1, data: { 'data-mention-of': r.target, 'data-owner': e.owner } });
      links.push({ target: r.target, target_piece: r.piece, owner: e.owner, piece: e.piece, text: e.text });
    }
    c.close();
  });

  const h = c.legend(LEGEND, y + 14, width - 2 * PAD);
  if (h) y += 14 + h;

  const name = (i) => m.pieces[i].heading;
  const notes = [
    ...links.map((l) => `“${name(l.piece)}”里写到的“${l.text}”，在“${name(l.target_piece)}”里画了出来，两处有连线`),
    ...pieces.flatMap((res, i) => res.mentions.filter((mt) => !rails.some((r) => r.target === mt.target)).map((mt) => `“${name(i)}”里写到的“${mt.text}”不在这张图里，只留作文字`)),
  ];
  const summary = `${m.pieces.length} 件图叠成一张，${rails.length} 个对象或版本被别的件指到，各有一条连线。`;
  const done = finish(c, { asset: 'rel-sheet', width, height: y, title: m.title, desc: summary });
  return {
    ...done,
    labels: [...done.labels, ...pieces.flatMap((res, i) => res.labels.map((l) => ({ ...l, in: `${scope}-p${i}` })))],
    links,
    pieces: pieces.map((res, i) => ({ heading: name(i), asset: m.pieces[i].asset, x: margin, y: top[i], equivalent: res.equivalent })),
    equivalent: { summary, items: pieces.flatMap((res, i) => [`${name(i)}：${res.equivalent.summary}`, ...res.equivalent.items.map((t) => `　${t}`), ...res.equivalent.notes.map((t) => `　${t}`)]), notes },
  };
}
