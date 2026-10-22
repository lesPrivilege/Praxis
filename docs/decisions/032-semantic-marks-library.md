# ADR-032：承载稳定语义的记号、控件与运动收进 Design，作可取用的参考

日期：2026-10-12。状态：accepted（用户裁决）。主会话（Claude Opus 5.5）验收并登记；绘制由另一个 Claude Code 会话按 [工单](../../demos/editable-native-svg/claude-design-order-20261012.md)完成。

## 背景

[ADR-031](031-stable-terms-and-explainer-page.md)把稳定语义的记号、控件与运动写成工单，Kit 当时没有新增图形。交付回来后，用户看过并裁决：可以进入 Kit，作为 Design 分支里的自撰库；承担稳定语义的小图形是锦上添花，较重的编排仍以临时绘制为主；取用按需，不过拟合，也可以改用外部库或重画。

## 决定

- **整包放在 [kit/design/marks](../../kit/design/marks/README.md)，在 Design 入口单列为“自撰库”，与外部参考分开。** 记号、控件页、运动页、色值和生成来源只此一份，原交付目录 `demos/semantic-marks` 不保留。
- **强度是 normal/reference。** 没有任务必须用它；grammar 与这一版画法分开写，消费者可以整套用、只取几项或按 grammar 重画。
- **发现入口三处**：Design 入口、Design / Motion 入口、Write / Publish 的 [讲解页的编排](../../dsh-praxis/kit/publish/html/explainer.md)。
- **不据第一次取用改词表。** 取用时看到的缺口记在该包的 [checks.md](../../kit/design/marks/checks.md)，等别的任务再遇到同样的缺口时再定。

## 证据与限度

用户看过交付；主会话看了记号总览和控件页的截图，重新运行了生成脚本，并在 DeerFlow 讲解页上取用了 18 个记号。交付方自己的检查和未做项见 [checks.md](../../kit/design/marks/checks.md)。运动页没有在真实帧率下看过，t 的函数没有接进视频渲染，读屏和其他浏览器没有试，没有读者对照，也没有独立审阅过页面文字。
