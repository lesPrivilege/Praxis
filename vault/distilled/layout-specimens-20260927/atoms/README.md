# atoms · 原子样张

五个家族，每页一个 HTML 与一份同名 CSS（类名前缀 `t- e- q- v- w-`，可被 pattern 和 composition 复用）。每个原子至少有一个 baseline、两个结构不同的变体、一个压力变体，多数还有一个说明原因的失败样张。

| 家族 | 页面 | 原子 | 样张 |
|---|---|---|---|
| 文本与命题 | [text.html](text.html) | T01–T10 | 56 |
| 枚举与比较 | [enum.html](enum.html) | E01–E10（E10 值状态为本次新增） | 50 |
| 数量与关系 | [quantity.html](quantity.html) | Q01–Q10（Q10 趋势序列从 Q02 拆出） | 61 |
| 证据与解释 | [evidence.html](evidence.html) | V01–V07（V07 多来源与证据强度为本次原创） | 36 |
| 定位与辅助阅读 | [wayfinding.html](wayfinding.html) | W01–W08 | 41 |

各页由不同的 Opus 5.5 子代理按 [制作约定](../shared/contract.md) 施工，内容全部取自 [synthetic fixture](../shared/fixtures.md)。`evidence.html` 由子代理在临时目录中的生成脚本输出，该脚本没有保留；现在直接编辑 HTML 即可。状态、检查范围和索引见 [specimens.json](../specimens.json) 与 [catalog.md](../catalog.md)。
