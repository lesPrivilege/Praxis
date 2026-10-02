"""Exhibits bound to argument sections by name (see page-composition.json).

Labels restate the current answer draft; figures add no claim. Each exhibit serves the page's
`visual_job` and makes its reasoning relations visible:
solid box = kept or authoritative object; dashed box = on demand, conditional or not yet effective;
arrows show supply, routing or sequence; nothing is drawn between unrelated topics.
"""
import html
import json

LEVELS = ['无害', '轻微', '严重', '极严重']
PRESETS = [
    ('A', '构造分布A', [0, 0.01, 0.99, 0]),
    ('B', '构造分布B', [0.5, 0, 0, 0.5]),
]
RULE = '“低于2放行”'


def esc(text):
    return html.escape(text, quote=True)


def figure(caption, body):
    return f'<figure class="exhibit"><figcaption>{esc(caption)}</figcaption>{body}</figure>'


def node(name, body='', cls=''):
    text = f'<span class="node-body">{esc(body)}</span>' if body else ''
    return f'<div class="node {cls}"><span class="node-name">{esc(name)}</span>{text}</div>'


def eyebrow(text):
    return f'<span class="eyebrow">{esc(text)}</span>'


def table(rows, caption=None, cls=''):
    head = ''.join(f'<th scope="col">{esc(c)}</th>' for c in rows[0])
    body = ''.join('<tr>' + ''.join(f'<td data-label="{esc(rows[0][i])}">{esc(c)}</td>' for i, c in enumerate(r)) + '</tr>'
                   for r in rows[1:])
    cap = f'<caption>{esc(caption)}</caption>' if caption else ''
    return f'<table class="stack {cls}">{cap}<thead><tr>{head}</tr></thead><tbody>{body}</tbody></table>'


# ---------- line figures (CW Pages grammar: inline SVG, 1.5 strokes, solid = has happened or is determined,
# dashed = not yet happened or unresolved; a wide figure and a compact HTML variant share one caption) ----------

def svg_box(x, y, w, name, lines=(), cls='', h=None):
    h = h or 26 + 19 * len(lines) + 10
    text = f'<text x="{x + 12}" y="{y + 22}" class="n-name">{esc(name)}</text>' + ''.join(
        f'<text x="{x + 12}" y="{y + 42 + 19 * i}" class="n-body">{esc(line)}</text>' for i, line in enumerate(lines))
    return f'<g class="svg-node {cls}"><rect x="{x}" y="{y}" width="{w}" height="{h}"/>{text}</g>'


def svg_path(d, mid, cls=''):
    return f'<path d="{d}" class="edge {cls}" marker-end="url(#{mid})"/>'


def svg_figure(fid, width, height, title, desc, body):
    return (f'<svg class="figsvg fig-wide" viewBox="0 0 {width} {height}" role="img" aria-labelledby="{fid}-t {fid}-d" xmlns="http://www.w3.org/2000/svg">'
            f'<title id="{fid}-t">{esc(title)}</title><desc id="{fid}-d">{esc(desc)}</desc>'
            f'<defs><marker id="{fid}-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
            f'<path d="M 0 0 L 10 5 L 0 10 z" class="arrowhead"/></marker></defs>{body}</svg>')


def legend(x, y, items):
    out, cx = [], x
    for cls, label in items:
        out.append(f'<line x1="{cx}" y1="{y - 4}" x2="{cx + 28}" y2="{y - 4}" class="edge {cls}"/>'
                   f'<text x="{cx + 36}" y="{y}" class="n-meta">{esc(label)}</text>')
        cx += 36 + 13 * len(label) + 28
    return ''.join(out)


# ---------- Q1 ----------

def persistent_to_working_set():
    kept = ''.join([
        node('目标与约束', '持续保留', 'kept'),
        node('当前状态', '已完成的工作、采用的文件版本、未解决的问题', 'kept'),
        node('原始材料与工具输出', '按下一步需要补入', 'on-demand'),
    ])
    m = 'fig-q1-a'
    wide = svg_figure('fig-q1', 880, 262, '跨轮保留的信息、当前步骤的上下文与执行',
        '目标和约束、当前状态跨轮保留；原始材料与工具输出按下一步需要补入。三者中这一步需要的部分组成下一步所需内容，再去读取或调用工具；'
        '结果回写当前状态，文件变化后按读取记录判断哪些结论需要重查。', ''.join([
            '<text x="16" y="18" class="n-meta">跨轮保留</text>',
            svg_box(16, 28, 236, '原始材料与工具输出', ['按下一步需要补入'], 'pending', 58),
            svg_box(16, 98, 236, '目标与约束', ['持续保留'], 'kept', 50),
            svg_box(16, 160, 236, '当前状态', ['已完成的工作、采用的文件版本、', '未解决的问题'], 'kept'),
            '<path d="M252 57 H282" class="edge dashed"/><path d="M252 123 H282 M252 192 H282 M282 57 V192" class="edge"/>',
            svg_path('M282 123 H326', m),
            '<text x="330" y="86" class="n-meta">当前步骤的上下文</text>',
            svg_box(330, 94, 236, '下一步所需内容', ['不必每一步重新携带', '全部文件和工具输出'], 'focus'),
            svg_path('M566 123 H622', m),
            '<text x="626" y="92" class="n-meta">执行</text>',
            svg_box(626, 100, 200, '读取、调用工具', [], 'plain', 46),
            svg_path('M726 146 V250 H134 V238', m, 'dashed'),
            '<text x="430" y="243" text-anchor="middle" class="n-meta">回写：文件变化后，按读取记录判断哪些结论需要重查</text>',
        ]))
    body = wide + f"""<div class="loop fig-compact">
<div class="loop-col">{eyebrow('跨轮保留')}<div class="stack-nodes">{kept}</div></div>
<span class="arrow" aria-hidden="true"></span>
<div class="loop-col">{eyebrow('当前步骤的上下文')}{node('下一步所需内容', '不必每一步重新携带全部文件和工具输出', 'focus')}</div>
<span class="arrow" aria-hidden="true"></span>
<div class="loop-col">{eyebrow('执行')}{node('读取、调用工具')}</div>
</div>
<p class="exhibit-note return-note fig-compact"><span class="eyebrow">回写</span>文件变化后，按读取记录判断哪些结论需要重查</p>"""
    return figure('保留目标和进度，按需读材料，再把结果写回进度记录', body)


def cache_path_comparison():
    rows = [
        ['加载路径', '对旧内容的影响', '旧内容的差额'],
        ['修改已缓存前缀', '受影响的旧内容重新处理', '150,000 × (1 − 0.1) ÷ 1,000,000 = 0.135元'],
        ['在会话后部追加定义', '旧前缀可能继续命中', '旧缓存命中时为0'],
        ['只更新可搜索目录', '完整schema可能尚未载入', '核对目录摘要和实际加载记录后计算，不能直接记为0'],
    ]
    body = (table(rows, cls='paths')
            + '<p class="exhibit-note">比较前提：模型和其他配置不变，原缓存仍有效。假设受影响的旧内容为150,000 token，重新处理为每百万token 1元，读取缓存为每百万token 0.1元。</p>')
    return figure('同一批旧内容在三种加载路径下的差额', body)


def routing_and_review():
    routes = [
        ('有确定的算法或规则', '算术、格式校验、明确的权限条件', '代码', ''),
        ('边界清楚且检查成本可控', '抽取和转换', '先用较低effort，再检查输出', ''),
        ('生成困难、存在冲突或返工昂贵', '多份材料冲突、规划需同时满足多个条件', '试用更高effort，比较收益', 'focus'),
    ]
    rows = ''.join(
        f'<li class="route"><div class="route-cond"><span class="node-name">{esc(c)}</span>'
        f'<span class="node-body">{esc(ex)}</span></div><span class="arrow" aria-hidden="true"></span>'
        f'{node(to, "", cls)}</li>' for c, ex, to, cls in routes)
    gap = (f'<li class="route gap"><div class="route-cond"><span class="node-name">缺少关键事实</span>'
           f'<span class="node-body">更长的推理不会产生新证据</span></div><span class="arrow" aria-hidden="true"></span>'
           f'{node("先找材料、询问用户，或请相关专业人员复核", "", "kept")}</li>')
    m = 'fig-q2-a'
    parts = []
    for i, (c, ex, to, cls) in enumerate(routes):
        y = 16 + i * 62
        parts += [f'<line x1="16" y1="{y}" x2="16" y2="{y + 44}" class="edge rule"/>',
                  f'<text x="30" y="{y + 18}" class="n-name">{esc(c)}</text>',
                  f'<text x="30" y="{y + 38}" class="n-body">{esc(ex)}</text>',
                  svg_path(f'M500 {y + 22} H596', m), svg_box(600, y, 264, to, [], cls or 'plain', 44)]
    parts += ['<line x1="16" y1="206" x2="864" y2="206" class="edge dashed thin"/>',
              '<line x1="16" y1="222" x2="16" y2="266" class="edge rule"/>',
              '<text x="30" y="240" class="n-name">缺少关键事实</text>',
              '<text x="30" y="260" class="n-body">更长的推理不会产生新证据</text>',
              svg_path('M500 244 H596', m), svg_box(600, 216, 264, '先找材料、询问用户，', ['或请相关专业人员复核'], 'kept', 58)]
    wide = svg_figure('fig-q2', 880, 282, '按当前步骤的难点选择处理方式',
        '有确定算法或规则的步骤交给代码；边界清楚且检查成本可控的抽取和转换，先用较低effort再检查输出；生成困难、存在冲突或返工昂贵的步骤，试用更高effort并比较收益；'
        '缺少关键事实时，更长的思考不会产生新证据，应先找材料、询问用户或请相关专业人员复核。', ''.join(parts))
    body = wide + f"""<ol class="routes fig-compact">{rows}</ol>
<ol class="routes gap-routes fig-compact">{gap}</ol>"""
    return figure('根据当前步骤的难点，选择代码、reasoning effort或补充材料', body)


def accepted_result_cost():
    scale = 60

    def seg(value, label, cls=''):
        return f'<span class="cseg {cls}" style="width:{value / scale * 100:g}%"><span>{esc(label)}</span></span>'
    body = f'''<div class="cost">
<div class="cost-row"><span class="cost-name">人工完成</span><span class="cost-track">{seg(60, '人工12分钟 60')}</span><span class="cost-total">60元</span></div>
<div class="cost-row"><span class="cost-name">AI辅助</span><span class="cost-track">{seg(25, '人工5分钟 25')}{seg(2, '', 'model')}<span class="cseg-label">← 模型与工具费 2</span></span><span class="cost-total">27元</span></div>
<div class="cost-row"><span class="cost-name">未计入</span><span class="cost-unknown">新增错误带来的返工或其他损失</span><span class="cost-total">—</span></div>
<div class="cost-legend"><span>时间价值每小时300元；同一尺度0–60元</span></div>
</div>'''
    return figure('人工与AI辅助完成同一项工作的费用（假设演算）', body)


LATENCY = [
    ['时间终点', '记录的事件', '对应判断'],
    ['首次反馈', '界面确认收到请求', '系统是否及时回应'],
    ['首次有用结果', '出现可用于下一步工作的内容', '用户何时开始获得可用结果'],
    ['完整结果', '系统完成一份可审阅的结果', '生成和执行何时结束'],
    ['最终接受', '结果达到验收标准并被接受', '任务连同审阅、修改的总耗时'],
]


def latency_endpoints():
    m = 'fig-q2l-a'
    xs = [220, 420, 620, 820]
    parts = []
    for i, (x, row) in enumerate(zip(xs, LATENCY[1:])):
        y = 26 + i * 18
        key = ' key' if i == 1 else ''
        parts.append(f'<path d="M40 {y - 4} V{y + 4} M40 {y} H{x} M{x} {y - 4} V{y + 4}" class="edge span{key}"/>')
        label = (f'<text x="{x - 8}" y="{y - 6}" text-anchor="end"' if i == 3 else f'<text x="{x + 8}" y="{y + 5}"')
        parts.append(f'{label} class="n-name{key}">{esc(row[0])}</text>')
        anchor = 'end' if i == 3 else 'middle'
        parts.append(f'<path d="M{x} 110 V122" class="edge"/><text x="{x + 40 if i == 3 else x}" y="142" text-anchor="{anchor}" class="n-body">{esc(row[1])}</text>')
    wide = svg_figure('fig-q2l', 880, 176, '四项时间都从同一次请求发出算起',
        '首次反馈、首次有用结果、完整结果和最终接受，都从请求发出开始计时，分别以界面确认收到请求、出现可用于下一步工作的内容、'
        '系统完成一份可审阅的结果、结果达到验收标准并被接受为终点；首次有用结果是重点。刻度间距不代表实际时长。', ''.join(parts + [
            svg_path('M40 116 H864', m), '<path d="M40 108 V124" class="edge rule"/>',
            '<text x="40" y="142" text-anchor="middle" class="n-body">请求发出</text>',
            '<text x="40" y="170" class="n-meta">刻度间距不代表实际时长</text>',
        ]))
    return figure('四项时间都从同一次请求发出算起', wide + '<div class="fig-compact">' + table(LATENCY) + '</div>')


# ---------- Q3 ----------

def action_boundary():
    body = f"""<div class="compare two">
<div class="compare-col">{eyebrow('授权范围内：继续执行')}<ul class="plain"><li>读取</li><li>整理</li><li>起草</li></ul></div>
<div class="compare-col">{eyebrow('执行前：确认授权覆盖具体后果')}<ul class="plain"><li>发送</li><li>披露</li><li>覆盖关键文件</li><li>改变生产状态</li></ul></div>
</div>"""
    return figure('按具体动作的后果决定是否需要确认', body)


STATE_GLYPH = {'ok': '✓', 'unknown': '?', 'failed': '✕', 'retry': '↻'}


def state(kind, label):
    return f'<span class="state state-{kind}"><span class="glyph" aria-hidden="true">{STATE_GLYPH[kind]}</span>{esc(label)}</span>'


def unknown_reconciliation():
    def leaf(observed, st, nxt):
        return f'<li><div class="branch-row"><span class="obs">{esc(observed)}</span>{st}<span class="next">{esc(nxt)}</span></div></li>'
    unknown_children = ''.join([
        leaf('权威记录显示已送出', state('ok', '已发送'), '记录回执'),
        leaf('原请求已终止且未提交，或仍有有效的幂等性保证', state('retry', '可有限次重试'), '沿用原请求标识和参数，并在去重有效期内重试'),
        leaf('未查到记录（可能是可见性延迟）', state('unknown', '仍为unknown'), '继续核验，不立即重发'),
    ])
    tree = f'''<div class="branch-root">{node('点击发送', '授权已覆盖这次后果', 'kept')}</div>
<ul class="branches">
{leaf('取得发送记录或业务回执', state('ok', '已发送'), '记录回执')}
<li><div class="branch-row"><span class="obs">请求超时，客户端未收到结果</span>{state('unknown', 'unknown')}<span class="next">查询权威发送记录或业务回执</span></div>
<ul class="branches">{unknown_children}</ul></li>
<li><div class="branch-row"><span class="obs">明确失败</span>{state('failed', '失败')}<span class="next">先辨认原因，见下表</span></div></li>
</ul>'''
    failures = table([
        ['失败原因', '下一步', '依据'],
        ['读取被限流', '在预算内退避后重试', '读取没有待核验的写入副作用'],
        ['参数错误', '修正参数后重新执行', '确认原请求未执行；不能沿用原参数的幂等保证替代核验'],
        ['权限拒绝', '停止', '重复尝试或换一条路径不会使动作获得授权'],
    ], caption='明确失败时', cls='failures')
    m = 'fig-q3-a'
    wide = svg_figure('fig-q3', 880, 318, '发送超时后的状态与下一步',
        '点击发送后有三种结果：取得记录即已发送；超时进入unknown；明确失败按原因处理。unknown不直接重发，先查询权威发送记录或业务回执：'
        '查到则记录回执；查不到可能是可见性延迟，仍为unknown并继续核验；只有原请求确认未提交或幂等保证仍有效时，才沿用同一请求标识和参数在去重有效期内有限次重试。',
        ''.join([
            svg_box(16, 110, 150, '点击发送', ['授权已覆盖', '这次后果'], 'kept'),
            '<path d="M166 140 H196 M196 48 V234" class="edge"/>',
            svg_path('M196 48 H222', m), svg_path('M196 140 H222', m), svg_path('M196 234 H222', m),
            svg_box(226, 24, 160, '✓ 已发送', ['取得记录或回执'], 'ok', 48),
            svg_box(226, 110, 160, '? unknown', ['超时，未收到结果', '不直接重发'], 'unknown'),
            svg_box(226, 210, 160, '✕ 明确失败', ['按下表辨认原因'], 'failed', 48),
            svg_path('M386 140 H442', m),
            svg_box(446, 110, 170, '查询权威记录', ['发送记录或', '业务回执'], 'focus'),
            '<path d="M616 140 H646 M646 53 V232" class="edge"/>',
            svg_path('M646 53 H672', m), svg_path('M646 140 H672', m), svg_path('M646 232 H672', m),
            svg_box(676, 24, 188, '✓ 已发送', ['记录回执'], 'ok', 58),
            svg_box(676, 110, 188, '? 仍为unknown', ['可能是可见性延迟', '继续核验'], 'unknown'),
            svg_box(676, 196, 188, '↻ 可有限次重试', ['原请求确认未提交，', '或幂等保证仍有效'], 'retry', 72),
            svg_path('M770 268 V296 H91 V188', m, 'dashed'),
            '<text x="440" y="289" text-anchor="middle" class="n-meta">重试：沿用同一请求标识和参数，在去重有效期内，有限次</text>',
        ]))
    body = wide + f'<div class="tree fig-compact">{tree}</div>' + failures
    return figure('发送超时后，先查邮件是否已经送出，再决定能否重试', body)


# ---------- Q4 ----------

def fmt_prob(p):
    return f'{p:g}'


def fmt_pct(x):
    return f'{round(x * 100, 2):g}%'


def derive(vector):
    return sum(i * p for i, p in enumerate(vector)), vector[2] + vector[3]


def rule_text(mean):
    return '放行' if mean < 2 else '不放行'


def dist_bars(vector):
    rows = ''.join(
        f'<div class="bar-row{" tail" if i >= 2 else ""}"><span class="bar-label">{i} {n}</span>'
        f'<span class="bar-track"><span class="bar" style="width:{p * 100:g}%"></span></span>'
        f'<span class="bar-value">{fmt_pct(p)}</span></div>' for i, (n, p) in enumerate(zip(LEVELS, vector)))
    return f'<div class="bars" aria-hidden="true"><div class="axis"><span>0%</span><span>50%</span><span>100%</span></div>{rows}</div>'


def mean_scale(marker_attrs):
    return (f'<div class="mean-scale" aria-hidden="true"><span class="mean-axis"><span class="mean-threshold" style="left:{2 / 3 * 100:g}%"></span>'
            f'<span class="mean-marker" {marker_attrs}></span></span>'
            f'<span class="mean-ticks"><span>0</span><span>1</span><span>2</span><span>3</span></span></div>')


def dist_panel(key, title, vector):
    mean, tail = derive(vector)
    return f'''<div class="dist" data-preset="{key}">
<h4 class="dist-title">{esc(title)}（确定性合成示例）</h4>
{eyebrow('概率，0–100%')}{dist_bars(vector)}
<div class="tail-sum"><span>P(等级≥2)</span><strong>{fmt_pct(tail)}</strong></div>
{eyebrow('均值，按0–3计分；竖线为2')}{mean_scale(f'style="left:{mean / 3 * 100:g}%"')}
<dl class="derived"><div><dt>概率向量</dt><dd><code>[{', '.join(fmt_prob(p) for p in vector)}]</code></dd></div>
<div><dt>均值</dt><dd>{mean:.2f}</dd></div><div><dt>{esc(RULE)}</dt><dd>{rule_text(mean)}</dd></div></dl>
</div>'''


def risk_distribution():
    panels = ''.join(dist_panel(k, t, v) for k, t, v in PRESETS)
    heads = ''.join(f'<th scope="col">P({i} {n})</th>' for i, n in enumerate(LEVELS))
    rows = ''.join(
        f'<tr><th scope="row">{esc(t)}</th>' + ''.join(f'<td data-label="P({i})">{fmt_prob(p)}</td>' for i, p in enumerate(v))
        + f'<td data-label="均值">{derive(v)[0]:.2f}</td><td data-label="P(等级≥2)">{fmt_pct(derive(v)[1])}</td>'
        f'<td data-label="{esc(RULE)}">{rule_text(derive(v)[0])}</td></tr>' for k, t, v in PRESETS)
    inputs = ''.join(
        f'<label class="num"><span>P({i} {n})</span><input type="number" id="q4-p{i}" min="0" max="1" step="0.01" inputmode="decimal"></label>'
        for i, n in enumerate(LEVELS))
    body = f'''<div class="compare two">{panels}</div>
<table class="stack exact"><caption>原始值</caption>
<thead><tr><th scope="col">分布</th>{heads}<th scope="col">均值</th><th scope="col">P(等级≥2)</th><th scope="col">{esc(RULE)}</th></tr></thead>
<tbody>{rows}</tbody></table>
<div class="explorer" id="q4-explorer" hidden>
<h4 class="dist-title" id="q4-custom-title">自定义分布</h4>
<form id="q4-form" novalidate><fieldset><legend>概率向量（非负，总和为1）</legend>
<div class="inputs">{inputs}</div>
<div class="buttons"><button type="submit">计算</button><button type="button" data-load="A">恢复构造分布A</button><button type="button" data-load="B">恢复构造分布B</button></div>
</fieldset></form>
<p class="status" id="q4-status" role="status" aria-live="polite"></p>
<div class="dist" id="q4-custom">
{eyebrow('概率，0–100%')}<div class="bars" aria-hidden="true"><div class="axis"><span>0%</span><span>50%</span><span>100%</span></div><div id="q4-custom-bars"></div></div>
<div class="tail-sum"><span>P(等级≥2)</span><strong id="q4-tail"></strong></div>
{eyebrow('均值，按0–3计分；竖线为2')}{mean_scale('id="q4-mean-marker"')}
<dl class="derived"><div><dt>有效向量</dt><dd><code id="q4-vec"></code></dd></div><div><dt>均值</dt><dd id="q4-mean"></dd></div>
<div><dt>{esc(RULE)}</dt><dd id="q4-rule"></dd></div><div><dt>阈值</dt><dd>待目标业务数据校准</dd></div></dl>
</div></div>'''
    return figure(f'同一条{RULE}规则下的两组四等级风险分布', body)


def q4_script_data():
    return json.dumps(LEVELS, ensure_ascii=False), json.dumps(
        {k: {'title': t, 'values': v} for k, t, v in PRESETS}, ensure_ascii=False)


def evaluation_contract():
    rows = [
        ('标准答案', '由独立标注者给出，意见不一致时另行裁决'),
        ('测试材料', '调参、校准和最终测试各用一批，互不重复'),
        ('报告指标', '严重漏报及其置信区间、自动处理覆盖率、转人工比例和成本'),
        ('网络与故障', '国内网络下的延迟、超时率和降级演练结果'),
        ('用途与批准', '批准的用途与禁用用途、模型和rubric版本、负责人'),
    ]
    ledger = '<dl class="ledger">' + ''.join(f'<div><dt>{esc(a)}</dt><dd>{esc(b)}</dd></div>' for a, b in rows) + '</dl>'
    steps = [('字段选择', '选错', 'focus'), ('后续计算', '随之改变', ''), ('最终通过标签', '恰好没有改变', 'on-demand')]
    chain = '<ol class="chain">' + ''.join(f'<li>{node(n, b, cls)}</li>' for n, b, cls in steps) + '</ol>'
    body = f'''<div class="compare two">
<div class="compare-col">{eyebrow('发布报告内容')}{ledger}</div>
<div class="compare-col">{eyebrow('只核对最终标签时漏检的错误')}{chain}</div>
</div>'''
    return figure('发布报告的内容，以及只核对最终标签时漏检的错误', body)


def two_fallback_paths():
    network = ''.join(f'<li>{node(n, b)}</li>' for n, b in [
        ('超时、有限次重试、熔断', ''), ('切换到事先验收的备用方案', '本地模型、规则或人工')])
    judgement = ''.join(f'<li>{node(n, b)}</li>' for n, b in [('判断证据是否充分、风险高低', ''), ('送审（review）或标为unknown', '')])
    m = 'fig-q4f-a'
    wide = svg_figure('fig-q4f', 880, 222, '网络故障与判断不确定的两条处理路径',
        '网络故障时，超时、有限次重试、熔断，再切换到事先验收的备用方案（本地模型、规则或人工）；判断不确定时，判断证据是否充分、风险高低，再送审或标为unknown。'
        '两条路径返回同一组动作allow、review、deny、unknown，但触发条件不同，分数和阈值不能直接共用。', ''.join([
            '<text x="16" y="18" class="n-meta">网络故障</text>',
            svg_box(16, 28, 230, '超时、有限次重试、熔断', [], 'plain', 46),
            svg_path('M246 51 H292', m),
            svg_box(296, 28, 250, '切换到事先验收的备用方案', ['本地模型、规则或人工'], 'plain', 58),
            '<text x="16" y="134" class="n-meta">判断不确定</text>',
            svg_box(16, 144, 230, '判断证据是否充分、风险高低', [], 'plain', 46),
            svg_path('M246 167 H292', m),
            svg_box(296, 144, 250, '送审（review）或标为unknown', [], 'plain', 46),
            '<path d="M546 57 H566 V112" class="edge"/><path d="M546 167 H566 V112" class="edge"/>',
            svg_path('M566 112 H584', m),
            svg_box(588, 70, 276, '统一返回的动作', ['allow · review · deny · unknown', '触发条件不同，阈值不共用'], 'kept', 84),
        ]))
    body = f'''{wide}<div class="compare two fig-compact">
<div class="compare-col">{eyebrow('网络故障')}<ol class="chain">{network}</ol></div>
<div class="compare-col">{eyebrow('判断不确定')}<ol class="chain">{judgement}</ol></div>
</div>
<dl class="facts shared"><div class="fig-compact"><dt>统一返回</dt><dd>allow、review、deny、unknown；分数与阈值不能直接共用</dd></div>
<div><dt>数据去向</dt><dd>接入时确定，不在故障后临时更换供应商或传输区域</dd></div>
<div><dt>高影响动作</dt><dd>校验服务不可用时，只保存草稿或交人工处理</dd></div></dl>'''
    return figure('网络故障与判断不确定分别处理', body)


# ---------- Q5 ----------

def atomic_change_branches():
    def chain(steps):
        return '<ol class="chain">' + ''.join(
            f'<li>{node(n, b, "focus" if i == 0 else "pending")}</li>' for i, (n, b) in enumerate(steps)) + '</ol>'
    d1 = chain([('律师已删去风险句', '删除理由尚未核实'), ('查明删除理由', '原句错误、缺少依据、不适用于这份合同，还是客户在谈判中作出的取舍'),
                ('请独立复核者检查', '删去这句，不代表以后都不必提示这类风险'), ('批准可复用的做法', ''), ('仅用于获准的客户和法域', '')])
    d2 = chain([('律师已加上公式', '计算依据尚待核实'), ('查明公式出处', '从哪里来、计算什么、适用于谁'),
                ('核对各法域的条件', '德国：基数、期间和适用范围；越南没有已批准的依据时保持待审'), ('批准可复用的做法', ''), ('仅用于获准的客户和法域', '')])
    m = 'fig-q5-a'
    xs = [16, 238, 460, 682]

    def lane(y, steps):
        out = []
        for i, (x, (name, lines)) in enumerate(zip(xs, steps)):
            out.append(svg_box(x, y, 180, name, lines, 'kept' if i == 0 else 'decision' if i == len(steps) - 1 else 'pending', 72))
            if i:
                out.append(svg_path(f'M{x - 38} {y + 36} H{x - 4}', m, 'dashed'))
        return ''.join(out)
    approve = ('批准', ['只在获准的客户', '和法域内生效'])
    wide = svg_figure('fig-q5', 880, 280, '两处修改各自的审查路径',
        'D1删去风险句、D2加上公式都已发生，但理由和依据尚未核实。D1依次查明删除理由、独立复核、批准；D2依次查明公式出处、逐个法域核对、批准。'
        '两条路径分别审查，一项的理由不能用于另一项；批准后只在获准的客户和法域内生效。', ''.join([
            '<line x1="217" y1="24" x2="217" y2="250" class="edge now"/>',
            '<text x="217" y="16" text-anchor="middle" class="n-meta">现在</text>',
            lane(40, [('D1 已删去风险句', ['删除理由尚未核实']),
                      ('查明删除理由', ['原句错误、缺少依据，', '不适用或谈判让步']),
                      ('独立复核', ['删去一次，不代表', '以后都不必提示']), approve]),
            '<text x="540" y="137" text-anchor="middle" class="n-meta">两项分别审查，一项的理由不能用于另一项</text>',
            lane(160, [('D2 已加上公式', ['计算依据尚未核实']),
                       ('查明公式出处', ['从哪里来、计算什么、', '适用于谁']),
                       ('逐个法域核对', ['德国：基数、期间、范围', '越南：无批准依据则待审']), approve]),
            f'<g transform="translate(16 270)">{legend(0, 0, [("", "已经发生"), ("dashed", "尚未发生")])}</g>',
        ]))
    body = f'''<ol class="diff" aria-label="律师修改的两项原子变更">
<li class="diff-del"><span class="diff-sign" aria-hidden="true">−</span><span class="diff-id">D1 删除</span><span class="diff-text">若条款被挑战，供应商可能面临 50% 规则制裁</span></li>
<li class="diff-add"><span class="diff-sign" aria-hidden="true">+</span><span class="diff-id">D2 新增</span><span class="diff-text">补偿公式 = 月薪 × 12 × 当地 50% 规则系数</span></li>
</ol>
{wide}
<div class="compare two fig-compact">
<div class="compare-col">{eyebrow('D1')}{d1}</div>
<div class="compare-col">{eyebrow('D2')}{d2}</div>
</div>
<p class="exhibit-note fig-compact">实线表示已发生的修改，虚线表示尚未进行的步骤。</p>'''
    return figure('删去风险句与加上公式各自所需的理由和检查', body)


def scope_and_state():
    record = [('修改内容', '原稿、逐项diff和父版本'),
              ('修改理由', '作者身份、执业法域、修改理由、法源与反对意见'),
              ('检查与批准', '测试结果、审批人和生效时间')]
    layers = [('合同事实', ''), ('客户偏好', '可以影响起草选择，不能覆盖强制规定或平台的权限要求'),
              ('法律要求', ''), ('平台核查步骤', '')]
    scope_cells = ''.join(
        f'<div class="scope"><span class="node-name">{esc(n)}</span>'
        + (f'<span class="node-body">{esc(b)}</span>' if b else '') + '</div>' for n, b in layers)
    body = f'''<dl class="ledger">{''.join(f'<div><dt>{esc(a)}</dt><dd>{esc(b)}</dd></div>' for a, b in record)}</dl>
<div class="scopes-block">{eyebrow('四类信息分开保存，读取和使用时都核对范围')}<div class="scopes">{scope_cells}</div></div>'''
    return figure('保留修改理由和批准过程，再限定可适用的合同范围', body)


Q5_ATOMIC = [
    ['比较对象', '待回答的问题', '验收条件', '状态'],
    ['原版', '—', '作为父版本与对照基线', '父版本'],
    ['仅删除D1（风险句）', '原句错误、缺少依据、不适用于这份合同，还是谈判取舍', '不据此推定以后都不必提示这类风险', '已提出，待核查'],
    ['仅新增D2（公式）', '公式从哪里来、计算什么、适用于谁', '各法域分别取得依据；没有已批准依据时保持待审', '已提出，待核查'],
    ['D1＋D2组合', '改进来自哪一处修改', '版本冻结后，用未参与调参的材料验收', 'D1、D2分别待审'],
]
Q5_COUNTER = [
    ['变化', '预期行为', '验收条件'],
    ['客户A换成客户B', 'A的红线不进入B的材料', '检查检索、摘要、记忆和评估材料，不只删除最后的客户名'],
    ['换成另一法域（德国或越南）', '不通过替换国家名称补出系数', '各法域分别取得依据，由对应法域的复核者核查'],
    ['德国样例算出相同金额', '不据此认定公式完整、可用于其他法域', '检查基数、期间和适用范围'],
    ['越南没有已批准的依据', '保持待审', '不输出系数'],
    ['只有尚未生效的版本号', '不绕过验收与批准', '以规则是否已批准生效为准，不以版本号为准'],
    ['作者换成知名合伙人', '不绕过验收与批准', '相同证据得到相同处理'],
]


def counterfactual_matrix():
    return figure('先比较四个版本，再检查更换客户、法域或作者后的行为', table(Q5_ATOMIC, caption='分别测试删除、新增及两者组合') + table(Q5_COUNTER, caption='改变条件后的预期行为'))


EXHIBITS = {
    'persistent-to-working-set': persistent_to_working_set,
    'cache-path-comparison': cache_path_comparison,
    'routing-and-review': routing_and_review,
    'latency-endpoints': latency_endpoints,
    'accepted-result-cost': accepted_result_cost,
    'action-boundary': action_boundary,
    'unknown-reconciliation': unknown_reconciliation,
    'risk-distribution': risk_distribution,
    'evaluation-contract': evaluation_contract,
    'two-fallback-paths': two_fallback_paths,
    'atomic-change-branches': atomic_change_branches,
    'scope-and-state': scope_and_state,
    'counterfactual-matrix': counterfactual_matrix,
}

IDENTITY = [
    ['展项', '数据身份', '边界'],
    ['Q1 跨轮信息与上下文', '按正文Q1整理的关系图', '设计方案，未做目标任务对照'],
    ['Q1 三种加载路径的差额', '假设演算与条件路径', '150,000 token、1元与0.1元/百万token为假设值；目录路径不给数值'],
    ['Q2 按步骤选择reasoning effort', '按正文Q2整理的关系图', '设计方案，未做API或用户等待实验'],
    ['Q2 四个计时终点', '按正文Q2整理的计时定义', '1秒与p95不超过3秒为初始设计目标；刻度间距不代表时长，没有实测数据'],
    ['Q2 被接受结果的费用', '假设演算', '人工5分钟×300元/小时=25元由正文假设推得；错误损失未计，不是生产账单'],
    ['Q3 授权边界与unknown分支', '按正文Q3整理的设计路径', '不含真实账号、请求或发送回执；未连接邮件接口'],
    ['Q4 构造分布A、B', '确定性合成例子', '不是Jev测量或校准曲线；送审、阻断与放行阈值未设常量'],
    ['Q4 自定义分布', '页面内确定性计算', '只接受非负且总和为1的向量；非法输入不更新结果，不自动归一化'],
    ['Q4 独立验证与回退', '按正文Q4整理', '未运行评估、重放或降级测试'],
    ['Q5 证据链、记录范围与反事实', '按正文Q5整理的评估设计', '预期行为与验收条件，不含测试结果；D1、D2均未批准或生效'],
]
