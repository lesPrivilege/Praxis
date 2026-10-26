# Drift · 证据

保留的是带日期的验收回执 [acceptance-20261005](acceptance-20261005/README.md)。`verify.py --screenshots` 每次重跑都会覆盖输出，所以目录根不再存截图；要看当前状态就重跑一次，输出写到 `tmp/`：

```sh
PYTHONDONTWRITEBYTECODE=1 python3 projects/drift/verify.py --screenshots projects/drift/tmp
```

输入全部是合成探针和隔离数据目录：IP 用文档地址段，主机名与设备属性是构造值。截图是制作者看图的依据，不是独立看图或读者效果的证据；看过什么、没有看什么，见[交付说明](../design-polish.md#没有验证的)。
