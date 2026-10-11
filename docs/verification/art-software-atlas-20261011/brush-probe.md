# D3 范围选择探针

## 2026-10-11 · 原创局部实现检查

远端 Observable 示例浏览器导航与直接 HTTP 均失败：ERR_TUNNEL_CONNECTION_FAILED / 403。D3 官网直接 HTTP 也为 403；Exa 文本读取成功。没有关闭网络策略或绕过站点限制。官方公开 CDN 的 D3 7.9.0 bundle 可正常读取，临时保存在 /tmp，未安装包、未再分发源码。

file:// 导航被环境策略拒绝；改用浏览器 `page.set_content` 渲染自己的 HTML（不访问受阻源），同一允许读取的 bundle 在内存中执行。浏览器版本、依赖 URL/hash 与状态实测见 [JSON](brush-results.json)。

根代理实际查看了 [截图](brush-synthetic.png)：B、C、F 为深蓝，其他三点灰化，透明框仍允许辨认全局点位；底部文字报告选中 ID 与总数。截图是本仓库原创合成例，不含上游汽车数据和作品资产。无听觉测试、触屏测试、屏幕阅读器测试、性能基准或 WCAG 符合性认证。

五项断言通过：初始无活动范围；拖动选 B/C/F；清除回 null；数值 [2,6) 选同集合；[8,9) 为合法空集。另检反向范围显示拒绝消息。鼠标拖动和点击由 Playwright 执行；未验证键盘焦点顺序。

## 可复现的原始 fixture

将下列自有 HTML 保存为临时文件；D3 依赖只从 JSON 中的许可明确来源获取并核对 SHA-256，按 [软件许可](../../../vault/provenance/art-software-atlas/discovery/cards/d3-license.md)保留通知。用已安装的 Chromium/Playwright `set_content` 加载，将 script src 替换为临时 bundle 的文本，避免环境 file:// 限制。该说明不要求安装任何集成。测试状态由 `window.state` 读取。

```html
<!doctype html><html lang="en"><meta charset="utf-8"><title>Extent selection probe</title><style>body{font:18px sans-serif;margin:24px;color:#172331}svg{display:block;border:1px solid #ccc}button,input{font:inherit;margin:8px 4px}p{max-width:700px}</style><h1>Extent selection probe</h1><p>Synthetic points A–F; selection highlights records without removing the context. This is an original validation fixture, not the Observable example.</p><svg width="640" height="340"></svg><label>Minimum x <input id="lo" type="number" value="2" min="0" max="10"></label><label>Maximum x <input id="hi" type="number" value="6" min="0" max="10"></label><button id="apply">Apply x interval</button><button id="clear">Clear selection</button><p id="result" aria-live="polite"></p><script src="d3.min.js"></script><script>
const points=[{id:'A',x:1,y:1},{id:'B',x:3,y:3},{id:'C',x:5,y:5},{id:'D',x:7,y:7},{id:'E',x:9,y:9},{id:'F',x:5,y:1}];
const x=d3.scaleLinear().domain([0,10]).range([40,600]),y=d3.scaleLinear().domain([0,10]).range([300,20]),svg=d3.select('svg');
svg.append('g').attr('transform','translate(0,300)').call(d3.axisBottom(x));svg.append('g').attr('transform','translate(40,0)').call(d3.axisLeft(y));
const marks=svg.selectAll('circle').data(points).join('circle').attr('cx',d=>x(d.x)).attr('cy',d=>y(d.y)).attr('r',7);
svg.selectAll('text.label').data(points).join('text').attr('class','label').attr('x',d=>x(d.x)+10).attr('y',d=>y(d.y)+5).text(d=>d.id);
const brush=d3.brush().extent([[40,20],[600,300]]).on('start brush end',({selection:s})=>{let ids=s?points.filter(d=>s[0][0]<=x(d.x)&&x(d.x)<s[1][0]&&s[0][1]<=y(d.y)&&y(d.y)<s[1][1]).map(d=>d.id):[];window.state={extent:s,ids};marks.attr('fill',d=>!s||ids.includes(d.id)?'#245b9b':'#c9cfd7');document.querySelector('#result').textContent=s?`Selected ${ids.length}: ${ids.join(', ')||'none'} / total ${points.length}`:`No active selection / total ${points.length}`;});
const layer=svg.append('g').call(brush);layer.call(brush.move,null);
document.querySelector('#apply').onclick=()=>{const lo=+document.querySelector('#lo').value,hi=+document.querySelector('#hi').value;if(lo>=hi){document.querySelector('#result').textContent='Minimum must be below maximum';return;}layer.call(brush.move,[[x(lo),20],[x(hi),300]]);};document.querySelector('#clear').onclick=()=>layer.call(brush.move,null);
</script></html>
```

实现只用于演示语义差异，未作为共享组件晋升。