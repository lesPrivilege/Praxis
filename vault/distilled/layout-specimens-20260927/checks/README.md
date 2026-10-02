# checks · 检查记录

记录日期 2026-09-27。检查者：Opus 5.5 主会话（几何与抽看），各页施工子代理（逐变体看图）。本目录只证明下列范围，不是视觉验收或无障碍 conformance。

## 几何检查

`node tools/cdp.mjs` 通过 Chrome DevTools 协议仿真真实视口：1440 × 900 桌面，375 × 900 移动端（mobile 仿真，媒体查询与 container query 都看到 375）。探针检查三件事：页面横向滚动、元素越出样张舞台、带裁切的文本。标了 `data-allow-scroll` 的故意失败样张（T01-f 省略号截断、E03-e、W01-e、W08-f 横滚标签栏等）不计。

| 报告 | 范围 | 结果 |
|---|---|---|
| [report-js.json](report-js.json) | 12 个页面 × 1440 / 375，有 JS | 全部 0 issue |
| [report-nojs.json](report-nojs.json) | 同上，禁用脚本 | 全部 0 issue |
| [report-reduced-motion.json](report-reduced-motion.json) | C05、wayfinding × 375，prefers-reduced-motion | 0 issue |

几何探针只看盒子，不判断可读性、层级或美观。它也看不见 SVG 内部文字过小（C05 帧内 Q10-a 标注约 8–9px 是看图发现的）。

## 截图

均为本目录中的 PNG，由 `cdp.mjs --shots` 生成：

- 原子与 pattern 的单样张截图（`atoms__…`、`patterns__…`，1440 与 375 各一张）：T05-c、T08-d、E06-b、E09-a、Q03-d、Q06-d、Q07-b、V03-c、V07-c、W03-b、W07-b、P04-b、P04-d。
- 五个 composition 的 1600px 截段（`seg-compositions__…`，1440 与 375）；完整长图在会话临时目录，未入库。

## 实际看过的范围

- 施工子代理：每个原子家族的全部变体在 1440 与 `?w=375`（旧的 headless 窄屏模拟，媒体查询实际看到 500）下都看过，按截图修过断词、裁切、钉位遮挡、窄屏图表文字过小等问题；pattern 与 composition 的子代理看过大部分分段，漏看的段落写在 [handoff.md](../handoff.md)。
- 主代理：在真实 375 仿真下抽看 E06-b、Q07-b、W06-b（无 JS）、C02 两版、C05 帧 4–6、P04-d，以及 C01、C03、C04 的若干截段；入口页覆盖矩阵在 1440 下看过。

## 未检查

深色主题、打印分页、读屏器、200% 文字缩放与文字间距、真实触屏、完整键盘遍历（只有 C05 翻页与 W06/W08 控件由子代理用 headless 脚本测过按键）、Windows/Linux 字体退化、720 等中间宽度（C05 另测过 920/1040/1920）。

## 已知工具限制

旧的 `tools/check.py` 用 headless 窗口（最小 500px）加 `?w=375` 收窄布局盒，适合施工中快速自查，但不仿真移动端媒体查询；最终结论以 `cdp.mjs` 为准。
