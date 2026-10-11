---
id: DWV-07
status: verified
url: https://www.w3.org/TR/css-text-3/
---

# CSS Text Module Level 3

原件：[W3C Candidate Recommendation Draft](https://www.w3.org/TR/css-text-3/)。

## 摘要与定位

§4.1 的 segment break transformation 先说明软换行如何与空格相邻处理，再给英文与中文差别的例子：英文源文件换行移除后保留分词空格，中文无词间空格，移除断行则要避免空白被插入。§5 说明可选软断点取决于内容语言、书写系统与 CSS 属性。对网页内容来说，这意味着在编辑器源码中逐行排版不是无害格式化；若语言标记或 UA 处理有误，行断点可能变成可见空格。

本 Kit 消费：中文内容可以在允许边界自然换行，但代码必须忠实保留语义和语言信息；混排长串须通过目标浏览器验证。它不规定中文标题、引文或中西文空格的风格偏好。

## 限制

`status: verified` 表示来源已取得并读取，不表示已成为 W3C Recommendation 或浏览器实现已验证。文档版本与复核见[变更记录](../CHANGELOG.md)。

这份材料是文本规则，不证明所有当前浏览器如何实现。Grapheme 分割、地区性标点规范和字体覆盖还需结合 CLReq、实际 UA 与内容语言核查。未在浏览器执行示例。

W3C TR 的文档授权信息见页面版权和 license link；本卡仅保存 12 个单词的短引句，未复制规范代码或完整内容。

## 关联

[Typography 语法](../../../../../kit/design/composition/typography.md)，同中文需求资料：[DWV-08](chinese-layout-gap.md)。
