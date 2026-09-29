# Schema 闸门：意义成为可检查的对象

工单 VG-03。合成 fixture `vg-schema-gate-001` r1，83 秒，1920×1080 @30fps。打开 [index.html](index.html)；导出与检查见 [renders](renders/README.md)。

## 意图

把“Schema 让意义可检查”演成可定位的失败。四份候选依次经过同一份工作合同 `C-renewal v2` 的四道闸门：结构、证据、版本、权限。候选先以 JSON 原文逐字打出，再压缩成一个胶囊进入检查。三份候选分别在第一、二、三道闸门被拒收：拒收卡反白显示 reason code，胶囊按预计算的物理弹回保留区，状态卡提示“状态未变 · 无提交事件”。第四份通过三道自动检查后停在权限闸门，直到 reviewer 批准（全片蓝色只用在这里），才写入提交事件 evt-007，状态变为 v4。随后同一状态生成三种投影，各用一种字体语法：模型上下文用无衬线，审阅包用宋体，检索索引用等宽；三者之上有一根身份轨线连起 `M-0417@v4`。

## 分镜与时间线

时刻由 [scene.js](scene.js) 中的 `PLAN` 按候选起始时间和校验结果推导：阅读 3.5 秒，压缩 0.8 秒，每道闸门行进 0.9 秒、检查 1.4 秒。

| 段落 | 候选 | 止于 | reason code |
|---|---|---|---|
| 合同与闸门（0） | — | — | — |
| 类型不符（5.5） | cand-11，term_months “三年” | ① 结构 | TYPE_MISMATCH |
| 缺少证据（20.5） | cand-12，36 个月，evidence [] | ② 证据 | EVIDENCE_REQUIRED |
| 版本过期（35.5） | cand-13，expected v2，当前 v3 | ③ 版本 | STATE_VERSION_CONFLICT，保留待重载后重验 |
| 人工决定（50.5） | cand-14，expected v3，附证据 | ④ 权限，等待后批准 | — → evt-007，v4 |
| 三种投影（约 66.9） | — | — | v3 旧值可被检索命中，但标为已取代，不提升为当前事实 |

## 输入与预期

[fixture.js](fixture.js) 给出合同、初始状态 v3、四份候选（各带 expected result/gate/reason_code）和投影参数。页面内的 `validate()` 按四道闸门顺序计算结果，`RUN` 依次执行并推进状态。`selfTest()` 对照：每份候选的 result、gate 与 reason_code；最终 v4 且 term_months 24；提交事件只有 evt-007；保留候选为 cand-11/12/13；拒收期间状态不变；投影身份为 `M-0417@v4`；旧值命中不被提升；人工决定不早于候选到达。

## 实现

Canvas 2D。JSON 打字与 morph 由文档框和胶囊框的插值加文字淡出组成。拒收物理以 1/240 秒固定步长预先积分 3 秒，包括重力、地面恢复系数 0.45、摩擦和左墙；每份候选用自己的 mulberry32 种子，渲染时按 t 查表，停稳后再缓动进保留区。决定时刻取 `max(fixture 决定时刻, 到达 + 0.6)`，画面上不会出现“先批准、后到达”。

## 来源、借用与新增

| 来源 ID / 版本 | 用途 | 处理 |
|---|---|---|
| `SE-SCHEMA-01..05`（Schema Engineering `papers/src/canonical.md`，HEAD adbd793） | Candidate → Validation → Evidence → Authority → Committed Event；只有提交事件改变当前语义状态；可解析引用只说明位置存在 | 转写为四道闸门与字幕；论文语义，不是 runtime |
| `VG-SCHEMA-001` 与 `vg-schema-stale-candidate-001`（`vault/provenance/visual-grammar-schema-20260928/normal-failure-stale-candidate.json`） | 版本过期、候选保留、状态不变、下一步重载重验 | 改编为 cand-13：保留 reason code 与语义，改换事项与数值 |
| `VG-SCHEMA-002`（同一索引，开放工单） | 同一状态的三种投影：身份与版本一致，披露范围不同，旧版本命中不提升，视图重建不回写 | 首次以画面实现；只是示意，没有查询或索引实现 |
| `SE-PRACTICE-02` | 审阅包字段：Target、Delta、Evidence、Checks、Uncertainty、Consequence、Authority | 取其中七项，改写成中文标签 |

新增：validate 与 RUN、fixture、四道闸门 grammar、胶囊 morph、拒收物理、三字体投影、身份轨线及全部代码。没有借用 `SE-BUILD-01` 与 `SE-VALIDATE-01` 的代码。

## 验证

2026-09-29 本机实测，详见 [check-report.json](renders/check-report.json)。

| 结论 | 结果 |
|---|---|
| 网页可运行 | 通过：Chromium 加载无 console 错误；空格播放 1.2 秒后暂停；`?static=1` 与减少动态效果两种入口各生成 12 张分镜，390px 下无横向溢出；GL：ANGLE (Apple, ANGLE Metal Renderer: Apple M2, Unspecified Version) |
| 自检 | 通过：selfTest 20/20 项 |
| 重复 seek 一致 | 通过：31 个时刻 × 顺序、逆序、乱序 3 遍，帧指纹 0 处不一致 |
| 视频已导出 | 通过：renders/schema-gate.webm，vp09.00.40.08 8 Mbps，1920×1080 @30fps，2491 帧，12.0 MB；无音轨（作品没有声音）；WebCodecs 编码，webm.py 封装，用时 9.6 秒 |
| 实际解码 | 通过：OpenCV 5.0.0 解码 2491/2491 帧；12 个关键帧与新渲染对比，PSNR 38.75–40.63 dB |
| 完整播放 | 通过：Chromium `<video>` 4 倍速播放至 ended，时长 83.033 秒；Opus 读了解码拼图 `renders/contact-sheet.png` |
| 依赖已离线 | 部分：页面与运行层没有外部请求；字体使用系统字体，未随仓库保存；导出依赖本机 Playwright Chromium，未快照 |
| 受众验证 | 未做：没有观看基线，理解与感受未知 |

未检查：受众理解；其他浏览器与 GPU；Songti SC 缺失时的回退效果。物理只是动作隐喻，不模拟任何真实系统。

## 失败样例与 review

- 投影身份轨线最初画在 y=196，穿过了“审阅包”“检索索引”两个标题；已移到面板上方，并向每个身份标签垂下一根短线。
- 闸门规则 `expected_state_version = 当前版本` 用等宽字排版，宽于 214px，与相邻闸门的规则连成一行；已改为较短的中文规则。
- 保留区说明原先右对齐在闸门下方，被墙线与检查卡压住；已移到左侧。
- 版本拒收卡最初只显示 “v2”，看不出与什么比较；现在显示“期望 v2 · 当前 v3”。

Opus 读图 review：三次拒收位于三个不同位置，reason code 可读，状态卡的“未变”提示与拒收同时出现；投影页能一眼看出三种排印语法共享同一身份标签。左侧在胶囊行进时留白偏多，可以留作以后展示合同全文。

## 下一步验证

用一份新合同与新候选只改 fixture 重跑，确认 `PLAN` 推导的时间线不需要手改；请读者只看静帧，说出每份候选停在哪一关、为什么停。
