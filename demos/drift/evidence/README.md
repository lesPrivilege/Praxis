# Drift · polish 证据

2026-10-05 由 `verify.py` 写出，输入全部是合成探针和隔离数据目录：IP 用文档地址段，主机名与设备属性是构造值，时间是运行时刻（UTC）。重跑会覆盖这些文件。

```sh
PYTHONDONTWRITEBYTECODE=1 python3 demos/drift/verify.py --screenshots demos/drift/evidence
```

| 文件 | 内容 |
|---|---|
| `desktop-top.png`、`mobile-top.png` | 第一次采集后的首屏，无基线，敏感值隐藏 |
| `desktop-changes.png`、`mobile-changes.png` | 变化页：宽屏当前与基线成相邻两列，窄屏成上下相邻的两个槽位 |
| `desktop-detail.png`、`mobile-detail.png` | 键盘选中“服务端代理配置”后的明细栏 |
| `mobile-return.png` | 窄屏从明细返回原行后的焦点位置 |
| `desktop.png`、`mobile.png` | 概览整页，已设基线 |
| `desktop-reflow-720.png` | 720 CSS px 视口下的概览 |
| `desktop-structure.json`、`mobile-structure.json` | 五个视图渲染后的标题、表头、观测项名、状态、按钮和明细字段名 |

截图是制作者看图的依据，不是独立看图或读者效果的证据。看过什么、没有看什么，见[交付说明](../design-polish.md#没有验证的)。
