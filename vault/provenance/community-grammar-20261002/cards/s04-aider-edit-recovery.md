---
id: "s04-aider-edit-recovery"
status: "partial"
---

# Aider 编辑与局部恢复

状态：6 个链接，主会话读了 1 个。许可（研究包自述）：Apache-2.0。

## 研究包取什么，不取什么

取：每次应用后把成功的块和失败的块分开回报，展示实际文本，已成功的不重发。

不取：标记格式、围栏位置、模糊匹配。

## 逐链接

| 编号 | 链接 | 状态 | 本仓库读到的 |
|---|---|---|---|
| K14 | [恢复代码](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/coders/editblock_coder.py) | `verified` | 主会话读了 apply_edits：逐块记 passed 与 failed，失败块附文件里相近的实际行，替换内容已在文件里时提示可能不需要，末尾写明其余块已成功、不要重发。注释引用了 issue 2258。 |
| K15 | [回归测试](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/tests/basic/test_editblock.py) | `unverified` | 未打开 |
| K16 | [Apache-2.0许可](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/LICENSE.txt) | `unverified` | 未打开 |
| K17 | [2023-12-21格式实验](https://aider.chat/2023/12/21/unified-diffs.html) | `unverified` | 未打开 |
| K18 | [格式与模型适配](https://aider.chat/docs/more/edit-formats.html) | `unverified` | 未打开 |
| K19 | [故障记录](https://github.com/Aider-AI/aider/issues/2258) | `unverified` | 未打开 |

没有打开的链接，内容以研究包 [sources.md](../../../snapshots/local/community-grammar-20261002/sources.md)记的读取范围为准，本仓库没有核对。

## 何时重访

要据这组来源在 Kit 里写规则、上游改动、或研究包的结论被真实任务推翻时。

研究包正文见 [快照](../../../snapshots/local/community-grammar-20261002/community-grammar-review.md)，机器登记见 [`../catalog.json`](../catalog.json)。
