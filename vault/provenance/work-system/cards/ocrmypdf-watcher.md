---
id: "ocrmypdf-watcher"
status: "verified"
url: "https://ocrmypdf.readthedocs.io/en/latest/batch.html"
---

# OCRmyPDF watched folders

来源：[原始页面](https://ocrmypdf.readthedocs.io/en/latest/batch.html) · 状态：`verified`

用途：GRAMMAR / FIELD_PRACTICE

## 摘要

官方文档给出 watcher.py/Docker hot folder，把 input PDF 转到 output 并归档原件，并有防重复/目录重叠/数据目录执行代码的安全检查。

## 证据与使用边界

watcher 需自行配置，网络文件系统和事件过滤存在 caveat；OCR 不等于完整文档结构解析。

## 何时重访

部署 watcher、SMB 或客户文件边界变化时复查。

引用映射与核查日期见 [catalog](../catalog.json)。本卡为登记结果的阅读投影；补充找到的来源不代表恢复原Chat隐藏引用。
