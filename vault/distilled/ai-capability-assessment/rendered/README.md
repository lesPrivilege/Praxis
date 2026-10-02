# AI 能力测试答卷：本地呈现副本

当前版本为问题—答案结构：5个题目、18个小节，每题每节先问后答；五题主图为同一套线图画法（实线为已发生或已确定，虚线为尚未发生，只在需要人决定处用强调色），宽屏显示SVG，窄屏显示HTML版本，打印固定用宽版。每题末尾附本题外部来源。导航（本项目已采纳，参考比较与验收边界见[记录](verification.md)）：宽屏为左侧“目录”，每题下列出小节，滚动时标出正在读的小节，布局参照 Schema Engineering 阅读器；窄屏为吸附在顶部的“目录”菜单，显示当前题、小节与阅读进度；上一题、下一题在每题末尾。Q4是唯一的数据交互。用户已确认视觉可行。

当前工作树实际产物为 `AI交付能力测试-answer-孙广昊.html` 与 `AI交付能力测试-answer-孙广昊.pdf`。下表和本主题入口均指向这两个文件；历史验收段落中的 `answer.html` / `answer.pdf` 保留当时的文件名。`build.py` 已将当前 HTML 文件名与 `evidence-index.html` 的返回链接统一到现行命名；本次只修复文档导航，不改变正文或视觉实现。

本目录是[回答母稿](../answer-draft.md)的HTML呈现副本，属于研究材料，不是已提交的招聘答卷。按[唯一Claude工单](../claude-paste-order.md)实现。

| 文件 | 职责 |
|---|---|
| [AI交付能力测试-answer-孙广昊.html](AI交付能力测试-answer-孙广昊.html) | 主要交付物：Q1–Q5五个答题页；宽屏左侧目录、窄屏目录菜单；每题末尾附来源；`#q1`–`#q5` 与小节id可直接定位 |
| [AI交付能力测试-answer-孙广昊.pdf](AI交付能力测试-answer-孙广昊.pdf) | A4打印版，21页，由当前答卷 HTML 经本机 Chrome 打印；每题末尾附来源，链接后印出网址 |
| [evidence-index.html](evidence-index.html) | 内容版本hash、展项数据身份、证据与覆盖、交叉核验；内部记录，不随答卷外发 |
| [build.py](build.py) | 读取母稿（正文与结构）、[构图映射](../page-composition.json)与[五页纲要](../five-page-outline.md)，以及[对外来源索引](../public-source-index.md)，校验后生成当前命名的 HTML 与 `evidence-index.html` |
| [exhibits.py](exhibits.py) | 各展项的内容与画法，按母稿中的 `::: figure` 行放置 |
| [q4.js](q4.js)、[nav.js](nav.js)、[style.css](style.css) | Q4分布计算、页面状态与导航、浅色冷调样式；构建时内联 |
| [../print-light/](../print-light/README.md) | Markdown/LaTeX轻量排印测试（xelatex），不是正式交付物 |
| [verification.md](verification.md)、[verification/](verification/README.md) | 验收记录与截图 |

## 内容与结构

母稿承载全部正文和结构：`##` 为题目页，`###` 为小节，二者带 `{#id}`；`::: figure <展项> <primary|supporting>` 放置展项。构图映射记录每页的论证关系、主展项与各项要点所在小节。构建在以下情况失败：母稿hash与构图映射不符、出现不支持的块、展项未知或未恰好放置一次、主展项与映射不符、要点指向不存在的小节、纲要卡与页面不对应。

## 重建

```bash
python3 vault/distilled/ai-capability-assessment/rendered/build.py
```

只用Python标准库。打印版用本机Chrome生成（不属于构建依赖）：

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-pdf-header-footer --print-to-pdf=vault/distilled/ai-capability-assessment/rendered/AI交付能力测试-answer-孙广昊.pdf "file://$PWD/vault/distilled/ai-capability-assessment/rendered/AI交付能力测试-answer-孙广昊.html"
```

修改母稿后，同步更新构图映射中的 `source_sha256`。生成的HTML无外部请求，可离线打开；禁用JS时五题正文与固定例子依次完整显示。

## 状态与下一步

验收结果与未执行项见 [verification.md](verification.md)。当前没有位图概念配图；若后续采纳，由Codex交付素材后更新工单再集成。最终提交答卷前，按[证据index](../evidence-index.md)复核影响主结论的易变来源。
