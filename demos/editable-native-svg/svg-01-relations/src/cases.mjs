// 输入的三个来路：inputs/ 里的合成文件、上层 fixtures.json 经适配得到的模型、
// 以及在这两者上做语义修改得到的压力与反例。build 和 check 用同一份清单。

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { need } from './kernel.mjs';
import { fan } from './fan.mjs';
import { scope } from './scope.mjs';
import { qualify } from './qualify.mjs';
import { tracks } from './tracks.mjs';
import { sheet } from './sheet.mjs';

export const HERE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const GEN = { 'rel-fan': fan, 'rel-scope': scope, 'rel-qualify': qualify, 'rel-tracks': tracks };
GEN['rel-sheet'] = (model, opt) => sheet(model, { ...opt, generators: GEN });
export const NARROW = 288;
export const wideOf = (asset) => (asset === 'rel-scope' || asset === 'rel-sheet' ? 480 : 672);

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
export const fixtures = () => {
  const all = readJson(path.join(HERE, '..', 'fixtures.json'));
  return { revision: all.revision, ...Object.fromEntries(all.fixtures.map((f) => [f.id, f])) };
};

// F01：材料、事项、规则各一条版本线；阅读绑定到它读的那个材料版本。
// fixture 的 proposal 没有 basis 字段，这里按其文字“复核 v2”绑定到最新材料版本，是适配层的假设。
export function f01ToTracks(f) {
  const latest = f.materials.at(-1);
  const readings = f.readings ?? [f.reading];
  const read = (rev) => readings.some((x) => x.basis.material_id === latest.id && x.basis.revision === rev);
  return {
    title: f.task,
    lanes: [
      { id: f.matter.id, role: '事项', versions: [{ version: f.matter.revision, label: f.matter.status, current: true }] },
      { id: latest.id, role: '材料', versions: f.materials.map((x) => ({ version: x.revision, label: x.label, current: x === latest })) },
      { id: f.rule.id, role: '规则', versions: [{ version: f.rule.revision, label: f.rule.text, current: true }] },
    ],
    bindings: [
      ...readings.map((x) => ({
        id: x.id,
        origin: 'human',
        kind: '阅读',
        state: 'recorded',
        text: x.statement,
        basis: [{ id: x.basis.material_id, version: x.basis.revision, locator: x.basis.fragment }],
      })),
      { id: f.proposal.id, origin: 'machine', kind: '建议', state: 'proposed', text: f.proposal.text, basis: [{ id: latest.id, version: latest.revision }] },
      f.decision
        ? { id: f.decision.id, origin: 'human', kind: '决定', state: 'decided', text: f.decision.text, basis: [{ id: f.matter.id, version: f.matter.revision }] }
        : { id: 'decision-pending', origin: 'human', kind: '决定', state: 'open', text: '尚未作出', basis: [{ id: f.matter.id, version: f.matter.revision }] },
    ],
    absences: f.materials.filter((x) => !read(x.revision)).map((x) => ({ id: x.id, version: x.revision, text: '没有人阅读这个版本的记录' })),
  };
}

// F02：先把事件按 id 去重再折叠。接受才产生新版本；拒绝留在记录里，对象不变。
export function foldF02(f) {
  const seen = new Map();
  // 重放可以省略字段（F02 的重放就没带理由），但带上的字段必须与第一次一致
  const same = (first, again) => Object.entries(again).every(([k, v]) => k === 'replay' || JSON.stringify(first[k]) === JSON.stringify(v));
  for (const e of f.events) {
    need(['pending', 'reject', 'accept'].includes(e.kind), 'illegal-event', `事件 ${e.id} 的类型 ${e.kind} 不认识`);
    if (seen.has(e.id)) {
      need(same(seen.get(e.id), e), 'conflict', `事件 ${e.id} 再次出现时内容变了，不是重放`);
      seen.get(e.id).replays += 1;
    } else seen.set(e.id, { ...e, replays: 0 });
  }
  const events = [...seen.values()];
  const resolved = new Set();
  for (const e of events) {
    if (e.kind === 'pending') continue;
    need(seen.get(e.candidate)?.kind === 'pending', 'illegal-event', `事件 ${e.id} 指向的 ${e.candidate} 不是一个候选`);
    need(!resolved.has(e.candidate), 'conflict', `候选 ${e.candidate} 已经有了结论，事件 ${e.id} 与之冲突`);
    resolved.add(e.candidate);
  }
  const versions = [{ rev: f.object.revision, fields: { ...f.object.fields } }];
  for (const e of events) {
    if (e.kind !== 'accept') continue;
    const cand = seen.get(e.candidate);
    const last = versions.at(-1);
    versions.push({ rev: last.rev + 1, fields: { ...last.fields, ...cand.proposes } });
  }
  return { events, versions };
}

const fieldText = (o) => Object.entries(o).map(([k, v]) => `${k} ${v}`).join('；');

export function f02ToTracks(f) {
  const { events, versions } = foldF02(f);
  const lane = f.object.id;
  const current = versions.at(-1);
  const rest = Object.keys(current.fields).filter((k) => !f.context.selected_fields.includes(k));
  const candidates = events.filter((e) => e.kind === 'pending').map((e) => {
    const res = events.find((x) => x.candidate === e.id && (x.kind === 'reject' || x.kind === 'accept'));
    return {
      id: e.id,
      kind: '候选',
      state: res?.kind === 'reject' ? 'rejected' : res?.kind === 'accept' ? 'recorded' : 'proposed',
      text: `提议改为：${fieldText(e.proposes)}`,
      basis: [{ id: lane, version: f.object.revision }],
      resolution: res && { id: res.id, kind: res.kind === 'reject' ? '拒绝' : '接受', text: res.reason ?? '没有写理由', replays: res.replays },
    };
  });
  return {
    title: f.task,
    lanes: [{ id: lane, role: '对象', versions: versions.map((v) => ({ version: v.rev, label: fieldText(v.fields), current: v === current })) }],
    bindings: [
      ...candidates,
      {
        id: 'context',
        origin: 'context',
        kind: '投影',
        state: 'recorded',
        text: `选入：${f.context.selected_fields.join('、') || '无'}。没有选入、仍在对象里：${rest.join('、') || '无'}。`,
        basis: [{ id: lane, version: f.context.basis_revision }],
      },
    ],
  };
}

export const f06ToQualify = (f) => ({
  title: f.task,
  claims: f.claims,
  qualifiers: [
    { id: f.condition.id, type: 'condition', target: { claim: f.condition.target_id }, text: f.condition.text },
    { id: f.annotation.id, type: 'note', target: { claim: f.annotation.target_id }, text: f.annotation.text },
  ],
});

const clone = (o) => structuredClone(o);

// 在 fixture 上做的语义修改。每一处都改输入，不改几何。
export const edits = {
  // A07 第二步：事项升到 v9，另有人读了材料 v2；旧阅读不动。
  f01Next(f) {
    const g = clone(f);
    g.matter.revision = 9;
    g.readings = [g.reading, { id: 'reading-demo-02', basis: { material_id: 'material-demo-01', revision: 2, fragment: '§4' }, statement: '新附件的付款说明已阅读，适用条件仍待核对' }];
    return g;
  },
  // 反例：材料 v2 一到，就把旧阅读的依据改指 v2。
  f01Rebound(f) {
    const g = clone(f);
    g.reading.basis.revision = 2;
    return g;
  },
  // A02：条件加长到四倍，混入英文、数字和一处手动换行。
  f06Long(f) {
    const g = clone(f);
    g.condition.text = `${g.condition.text}补充：管理员须持 Level-2 证书，改造验收单 (sign-off) 编号 2027-014 已归档。\n到位与验收缺一不可；任一项撤回，重新评估即中止，已作出的结论保留在记录里。条件再长，也只限定方案甲。`;
    return g;
  },
  // A03：把条件的目标从 claim-A 改到 claim-B。
  f06Retarget(f) {
    const g = clone(f);
    g.condition.target_id = 'claim-B';
    return g;
  },
};

// R08 的“五条来源”：同一项主张上三条支持、一条反驳、一条限定，其中一条只是推断。
const FIVE = {
  title: '一项主张的五条来源',
  claims: [{ id: 'c-open', text: '古籍阅览室每周开放三天。' }],
  qualifiers: [
    ['ev-notice', 'supports', 'verified', { id: 'notice-03', version: 2, locator: '第 1 段' }, '公告写明周二、周四、周六开放。'],
    ['ev-site', 'supports', 'verified', { id: 'site-hours', version: 5, locator: '开放时间表' }, '网站开放时间表与公告一致。'],
    ['ev-desk', 'supports', 'inferred', { text: '服务台口头确认' }, '没有书面记录。'],
    ['ev-roster', 'contradicts', 'verified', { id: 'roster-10', version: 1, locator: '第 3 行' }, '十月值班表只排了两天。'],
    ['ev-holiday', 'limits', 'verified', { id: 'notice-03', version: 2, locator: '第 3 段' }, '法定节假日当周另行公告。'],
  ].map(([id, relation, status, source, text]) => ({ id, type: 'evidence', relation, status, source, text, target: { claim: 'c-open' } })),
};

export function cases() {
  const F = fixtures();
  const fx = (id, fixture, asset, role, requirements, note, model) => ({ id, fixture, fixture_revision: F.revision, synthetic: true, asset, role, requirements, note, model });
  const fromFiles = fs
    .readdirSync(path.join(HERE, 'inputs'))
    .filter((n) => n.endsWith('.json'))
    .sort()
    .map((n) => readJson(path.join(HERE, 'inputs', n)));
  const order = { normal: 0, stress: 1, counterexample: 2, refuse: 3 };
  return [
    fx('f06-scope', 'F06', 'rel-qualify', 'normal', ['SVG-R06', 'SVG-R07'], '条件限定方案甲，注释解释方案乙。', f06ToQualify(F.F06)),
    fx('f06-long', 'F06', 'rel-qualify', 'stress', ['SVG-R06', 'SVG-R07'], '同一份输入，条件加长到四倍并混排。', f06ToQualify(edits.f06Long(F.F06))),
    fx('f01-versions', 'F01', 'rel-tracks', 'normal', ['SVG-R17', 'SVG-R08'], '材料 v2 到了，事项仍是 v8，旧阅读仍绑定材料 v1 §4。', f01ToTracks(F.F01)),
    fx('f01-next', 'F01', 'rel-tracks', 'stress', ['SVG-R17'], '事项升到 v9，另一条阅读绑定材料 v2；旧阅读不动。', f01ToTracks(edits.f01Next(F.F01))),
    fx('f01-rebound', 'F01', 'rel-tracks', 'counterexample', ['SVG-R17'], '反例输入：旧阅读的依据被改指 v2。图照输入画，错误因此看得见。', f01ToTracks(edits.f01Rebound(F.F01))),
    fx('f02-candidate', 'F02', 'rel-tracks', 'normal', ['SVG-R09', 'SVG-R18'], '候选被拒绝并留在记录里，对象仍是 v2；没有选入的字段仍在。', f02ToTracks(F.F02)),
    { id: 'qualify-five', synthetic: true, asset: 'rel-qualify', role: 'stress', requirements: ['SVG-R08'], note: '同一项主张上五条来源，有冲突，有一条只是推断。', model: FIVE, input: 'src/cases.mjs' },
    ...fromFiles,
  ].sort((a, b) => order[a.role] - order[b.role] || (a.order ?? 50) - (b.order ?? 50));
}
