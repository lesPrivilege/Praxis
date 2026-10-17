// Synthetic charts of a given size for load and wrapping checks. Names are made
// up from parts; a seeded generator keeps every run of the same size identical.
(function (EC) {
  const REGIONS = ['华东', '华南', '北京', '上海', '深圳', '苏州', '成都', '宁波', '杭州', '武汉', '香港'];
  const FIELDS = ['智能制造', '数据服务', '新能源', '精密零部件', '供应链管理', '生物医药', '跨境贸易', '半导体材料', '企业管理咨询', '文化传媒'];
  const FORMS = ['有限公司', '股份有限公司', '投资合伙企业（有限合伙）', '控股（集团）有限公司', '科技有限公司', 'International Holdings Limited'];
  const SURNAMES = '王李张刘陈杨赵黄周吴';

  EC.generate = function (size) {
    let seed = size * 7919;
    const rand = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
    const pick = (list) => list[Math.floor(rand() * list.length)];
    const entities = [];
    const holdings = [];
    const people = Math.max(2, Math.round(size * 0.08));
    for (let i = 0; i < people; i++) entities.push({ id: `p${i}`, name: `${SURNAMES[i % SURNAMES.length]}某${i + 1}`, kind: 'person' });
    for (let i = 0; entities.length < size; i++) {
      const id = `c${i}`;
      entities.push({ id, name: `${pick(REGIONS)}某某${pick(FIELDS)}${pick(FORMS)}`, focus: i === 0 });
      // Each company takes one to three earlier entities as shareholders; earlier
      // indexes only, so the generated graph has no loops.
      const count = 1 + Math.floor(rand() * Math.min(3, entities.length - 1));
      const used = new Set();
      let left = 100;
      for (let k = 0; k < count; k++) {
        const from = entities[Math.floor(rand() * (entities.length - 1))].id;
        if (used.has(from)) continue;
        used.add(from);
        const pct = k === count - 1 ? left : Math.max(1, Math.round(rand() * left * 0.7));
        left -= pct;
        holdings.push({ from, to: id, pct });
      }
    }
    return { entities, holdings };
  };
})(window.EC);
