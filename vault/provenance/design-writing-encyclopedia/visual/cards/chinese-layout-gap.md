---
id: DWV-08
status: verified
url: https://www.w3.org/TR/clreq-gap/
---

# Chinese Layout Gap Analysis

原件：[W3C 中文布局差距分析](https://www.w3.org/TR/clreq-gap/)。页面标注 Group Draft Note / note track，明确为在研文件。

## 摘要与定位

§2 说明报告核查中文 script 在网页与电子书中的文字布局需求，并关注 W3C 规格是否表达以及浏览器/电子阅读器是否实现。§2.1 说明色块表示缺失功能对本地使用者的影响，具体优先级由参与分析者判断；§7.1 列出断行与连字符问题，其中案例涉及中文引号不同语言方向的开行规则及全角空格处理。报告目录还覆盖语言方向、字形/定位、标点、数据格式、段落版面、表格和书页布局。

可复用操作：中文文本不能仅凭“简体还是繁体”选择一种排版；按任务检查段落断行、行首/行尾标点、数字和 inline notes 等具体需求，同时留意浏览器实现。对线上网页，先查问题影响与支持状态，再决定是否使用 CSS/脚本补救。

## 差异与限制

这是持续中的 gap analysis，非强制合规规则，也不是对所有中文环境的完整清单。其“OK”含义与优先级按报告自己的阈值定义；不能推导某个浏览器在本项目布局下已通过。报告还依赖被提取的公开 issue 摘要，条目会更新。只阅读文本目录、状态说明和 §7.1 的选择段落，未运行其交互测试。

## 关联

[Typography 语法](../../../../../kit/design/composition/typography.md)；历史已登记的 [CLReq requirements 卡 S04](../../../design-grammar-atlas-20261002/cards/s04-w3c-clreq.md)侧重完整需求与地区规则，本卡补充单独的 gap report URL，二者不重复身份。
