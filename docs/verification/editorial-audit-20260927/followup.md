# Kit 结构迁移后的消费走读 · 2026-09-27

本页从当前 [Kit 首页](../../../kit/README.md)重新起步，只沿页面实际给出的入口走三项任务；没有用迁移前审计推断新路径。只读检查，未生成材料、打开浏览器或修改源文档。路径与行号对应本次走读时的未提交工作树。

## 1 · 改写并审校一段对外中文，不改变证据强度

最小读取路径：`kit/README.md:10` → [Write](../../../kit/write/README.md#L7) 第 7 行 → [Prose](../../../kit/write/prose/README.md#L5) 第 5–6 行 → [成文原理](../../../kit/write/prose/grammar.md#L7) 第 7–19 行、[证据与来源](../../../kit/write/shared/evidence.md#L3) 第 3–13 行、[审阅方法](../../../kit/write/prose/review.md#L3) 第 3–26 行。审校按 Prose 第 6 行加载 review；不需要先读 Reporting、Design、Genres 或 Vault。

产物可定位：`review.md:3,18–20` 要求最终成文及位置、原文、改后、理由的修改记录；`review.md:22–26` 把不可损失项、结构语体与旁白清理作为完成条件。`grammar.md:13` 和 `evidence.md:11` 都禁止把观察/推断/假设改成已证，前者是 Prose 入口提醒，后者是跨 mode 的来源权威，未见相反规则。`review.md:7,12,24` 给出前后逐项核对法。若只是改写一段且受众、决定已经给定，不必填写 Reporting brief。

## 2 · 制作含比较图、description、图注、来源的 HTML 说明

最小读取路径：`kit/README.md:10–11,13` → [Write](../../../kit/write/README.md#L8) 第 8、10 行 → [Publish](../../../kit/write/publish/README.md#L3) 第 3–8 行 → [内容编排](../../../kit/write/publish/composition.md#L11) 第 11–17 行与 [展项与说明](../../../kit/write/publish/exhibits.md#L3) 第 3–19 行 → [Shared 证据](../../../kit/write/shared/evidence.md#L3) 第 3–15 行。比较图的编码才进入 [Design / Composition](../../../kit/design/composition/README.md#L5) 第 5–9 行 → [图形编码](../../../kit/design/composition/encoding.md#L3) 第 3–11 行；若宽窄布局需要重新编排，才读 [空间编排](../../../kit/design/composition/layout.md#L3) 第 3–15 行。最后用 [Shared 验收](../../../kit/write/shared/verification.md#L9) 第 9–18 行检验实际 HTML。已给定读者、主张和证据的任务无需先进入 Reporting；本走读也不需要 References 或 Vault 原件。

产物和完成条件可定位：`exhibits.md:7–17` 区分 description 的比较范围/口径、caption 的独立结论/限定、source 的身份/时间/定位；`encoding.md:5–9` 要求共同尺度、零点/缺失/单位/图例；`verification.md:14` 要求在真实输出检查宽窄布局、键盘、状态以及任务所需的断网和打印。页面可由这些规则完成，但存在下面 F-A、F-B 两个真实断点。

## 3 · 将原稿转成动态解释，并交接实际表现

最小读取路径：`kit/README.md:10,13` → [Write](../../../kit/write/README.md#L9) 第 9–10 行 → [Write / Motion](../../../kit/write/motion/README.md#L3) 第 3–7 行 → [叙事与分镜](../../../kit/write/motion/narrative.md#L3) 第 3–24 行、[Shared 证据](../../../kit/write/shared/evidence.md#L3) 第 3–15 行 → [Design / Motion](../../../kit/design/motion/README.md#L3) 第 3–8 行 → [运动判断](../../../kit/design/motion/grammar.md#L9) 第 9–15 行 → [Shared 验收](../../../kit/write/shared/verification.md#L11) 第 11–18 行。原稿已明确主题和受众时无需 Reporting；已有动态简报 specimen 仅在需要案例时才读，不是执行依赖。

产物和完成条件可定位：`write/motion/README.md:5` 要求可回查原稿的分镜/时间线、屏幕文字或字幕、来源配套、观看记录；`narrative.md:11–18,22–24` 给出 beat 交接字段、逐段核对与未做观众测试的报告边界；`verification.md:16` 要求实际速度全片观看、文字驻留、音画同步和来源配套，单帧及联络表不足以证明完成。Write 决定认知任务与信息，Design 决定运动表现；没有发现规则所有权冲突，也没有把 Remotion 当通用运行依赖。

## 仅加载 Writing skill 的两种情形

- **Kit 可用**：直接读 [skill](../../../.claude/skills/writing/SKILL.md#L8) 第 8–14 行，会被引到 Prose 入口、成文原理、共享证据和审阅方法。上述文件本次均实际存在，直接相对路径成立。skill 没有复制原则正文；能力测试体例只是按需分支。若当前任务同时要求审校，skill 第 11、14 行可找到修改记录和裁决路径。
- **Kit 缺失**：这是条件模拟，未删除或卸载目录。skill 第 14 行要求先定位实际挂载路径；仍不可用时说明缺失，不声称按 Kit 核验，也不凭记忆重建规则。此时不能完成“按项目 Writing Kit 审校”的保证，但可明确报告依赖缺口。相对路径指向当前 repo；异位挂载能否被成功发现并未实际测试。

## 真实断点与最小处置

### F-A · P2 · Publish 将 Slide 专用入口泛化到 HTML

[Publish 入口](../../../kit/write/publish/README.md#L3) 第 3 行明示 HTML、报告、Slides 与 PDF 都消费此分支；[内容编排](../../../kit/write/publish/composition.md#L5) 第 5 行却要求“先选 Slide Job，再选 Exhibit Family、Container 和 Notation”。对本次 HTML 说明，没有 slide 这一单位，也不需要为它创建 slide job。该句源于汇报/幻灯片语境，却以无条件先手放进通用 mode，和同页第 11–17 行的“先标主张、证据、条件，再安排页面”形成执行顺序冲突。建议将 Slide Job 限定为 Slides/投屏类任务；HTML 默认从读者判断、内容关系和页面阅读顺序开始。保留 Diagram/Chart/Table/Card 的选择语义。

### F-B · P2 · 来源到 index 的链接没有披露条件

[展项与说明](../../../kit/write/publish/exhibits.md#L14) 第 14 行无条件要求 Source “链接至证据 index”；[共享证据](../../../kit/write/shared/evidence.md#L15) 第 15 行又明确原 Chat、身份映射和本地资料不能因已索引就复制进公开交付。制作对外 HTML 时，内部 index 可能包含无法公开的身份、路径或核查记录；只要机械按展项表执行，就可能把内部索引暴露给读者。建议在展项职责中区分“公开安全的来源说明/链接”和“项目内部完整证据 index”，要求两者保持 claim ID 对应，但只在披露许可时从公开页面直链内部 index。Publish README 第 5–8 行未直接提示 Shared 证据，补一处短链接即可让使用者在放置 source 前看到该边界。

## 覆盖边界

这是从入口到规则与完成条件的合成任务走读，检查的是可发现性和契约是否自洽；没有制作真实中文段落、HTML 或动态视频，也没有验证浏览器、播放器、受众理解或外部来源。旧 [audit.md](audit.md) 保留迁移前结论，不应拿旧路径评价当前 Kit。
