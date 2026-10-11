<a id="asa-g-extent"></a>

# 范围选择与上下文保留

<!-- ASA-G-EXTENT -->

用于探索连续区间、框选对象和比较子集。先区分范围、选中集合与可见集合，再决定用框选、数值输入还是并列表格。

## 从组件契约到意图

[D3 brush（ASA-R-05）](../../../vault/provenance/art-software-atlas/discovery/cards/d3-brush.md)把 brushing 定义为用指针指定一维或二维区域；SVG overlay 接收输入，selection 与 handles 表示范围。它既能框选记录，也能服务缩放和 cross-filtering，三种动作不可因共用一个矩形而混同。

[Observable cars 示例（ASA-R-06）](../../../vault/provenance/art-software-atlas/discovery/cards/brushable-scatterplot.md)在已有点图上改 stroke、返回记录数组。读者看到的全体数据仍保留，选择与过滤因此可以分开。示例代码把未知值放在轴边，并用半开像素范围判断命中；这两项决定都影响解释。

## 可操作的关系

对象为 domain extent、屏幕坐标、稳定 record ID、选中集合、可见集合和重置状态。不变量是同一记录跨视图仍为同一对象，改变 viewport 后不得默默改变用户选择的业务区间。

| 操作 | 可调变量 | 必须保持或显示的关系 |
|---|---|---|
| 框选 | 一维/二维、边界包含方式、吸附粒度 | 像素范围经过 scale 反算，不能把屏幕宽度当数值 |
| 平移/扩张 | 把手大小、步长、约束范围 | 拖动范围不等于移动数据点 |
| 高亮 | 对比、轮廓、旁列明细 | 未选数据可保留为上下文；颜色不是唯一反馈 |
| 过滤 | 是否改变分母、是否重排 | 标明当前筛选及总体数量，避免把子集当总体 |
| 清除 | clear 与 empty selection | 无活动范围与合法范围里零条数据是不同状态 |

## 实现选择

SVG + D3 brush 适合已有 DOM 图形与中等规模对象；应用维护语义范围与记录 ID，调用 `brush.move` 同步显示，避免在多个视图的事件里互相递归触发。Canvas/WebGL 可保留同一语义状态，以独立 DOM/SVG overlay 接收输入；命中检测、坐标变换与屏幕阅读器的明细路径由应用负责，不能从 GPU 绘制速度推断交互完整。无需图形时，两个原生数值/日期输入加应用、重置按钮直接表达区间，适合精确筛选；这是同一任务的另一方案。

[既有 WAI 卡 DWI-003](../../../vault/provenance/design-writing-encyclopedia/interaction/cards/wcag-dragging-movements.md)区分键盘可操作与单指非拖动替代。可提供两次点按定角或数值输入；适用要求与例外见原标准。

## 例子与最小产物

原创建构例用 A–F 六点区分选择状态：拖动选 B/C/F，清除后为 null；数值区间 [2,6) 选同三点，[8,9) 得到合法空集，反向输入被拒绝。[实验回执](../../../docs/verification/art-software-atlas-20261011/brush-probe.md)保留代码、结果与检查范围。

消费设计师的最小产物是一张状态表：输入范围、选中 ID、可见 ID、分母、空态与撤销方式。选择两种任务数据各走一次；若缩放后选集变化、清除仍像空结果或只有拖动能完成任务，回到状态与输入契约修改。

## 反例与继续研究

要比较精确的两个类别时，复选框或并排表格可能更合适。高亮让低视力用户失去上下文、过滤改变轴域造成趋势错觉、缺失值挤在边界被误认作零，都是此语法的失配。直方图 bin 的选择不能自动等价于点图的逐点选择。下一步沿 D3 官方 examples 比较时间吸附与 lasso，再读协同视图研究。

[来源与维护](../../../vault/provenance/art-software-atlas/discovery/README.md) · [消费记录](../../../docs/verification/art-software-atlas-20261011/consumption.md)。
