# 版本、研究活动与裁决

## 2026-10-11 · 独立研究分支

- 用户授权的唯一分支：`cloud/art-software-grammar-atlas-20261011`。工作目录原始 HEAD 与远端 main 为 `02ca9ea4b0faa6a9376523883c1f9f7afd5cf154`。
- 已 fetch 检查：此前 `cloud/design-writing-encyclopedia-20261011` 精确为 `575fae1b2dbcffdf5c0fdc91713a6cddcd154d5e`，是 main 的后代，main 未包含该交付。本批以 `575fae1b` 为直接基线；不重写其正文、提交或历史。
- 先读根/Kit AGENTS、Kit Agent、架构、文档结构、入账、reference-lifecycle，以及 Design/Write 相关入口和本地 writing 薄入口；环境 `.agents` 为空，仓库没有 `.agents/skills`。未将快照内 AGENTS 当指令，未读取私有项目数据或会话原文作为研究材料。
- 研究范围来自公开来源与原创泛化。没有安装软件/集成、启用 CI、合并 main、开 PR、发消息、使用付费服务或保存大批版权资产。

## 执行分工与发现口径

按仓库模型指导，五个 explorer 的调用请求均为 `gpt-6-luna` / high；独立 reviewer 请求 `gpt-6-astra` / high；三个新上下文发现试用请求 `gpt-6-luna` / high。它们是工具调用请求配置，不是后端模型身份的独立证明。根代理负责架构、整合、取舍和发布。

| 研究流 | 请求的 Exa 结果槽 | 入账 URL | 实際读取边界 |
|---|---:|---:|---|
| 材料/几何 | 44 | 7 | 文字；Science 正文/补充不完整；图像失败 |
| 编辑/排印 | 18 | 12 | 9 页文字、1 页源 HTML 的指定 figure 片段、2 幅原图 |
| 空间/材料 | 30 | 11 | 10 页文字、1 图像资源不可用；root 改读 class 专属 API URL |
| 时间/规则 | 45 | 10 | 文字；未听、未看原谱/原作、未运行库 |
| Open Design / agent 生态 | 30 | 9 新增 + D01 复用 | 项目/供应方/协议文字；未安装集成 |
| 发现/组件（根代理） | 25 | 7 新增 + DWI-003 复用 | 目录、API、示例代码、许可文字；原站 demo 失败，另运行原创探针 |

共 192 个请求结果槽，不称为 192 个“已读来源”。各流还有不同的图片搜索或普通网页定位，逐流记录；搜索命中、被排除候选和重复读取不算新来源。最终新入账 56 个 URL，复用 2 个既有身份。计数按 catalog，而不是搜索工具输出长度。

## 审阅与修复

保留 [独立审阅](independent-review.md)，裁决如下：

| 发现 | 处置 |
|---|---|
| R1：documents 方向混用、source 充当 implements | 统一为 source → documents → entity；implements 只允许 substrate → grammar；增加外键和端点类型检查 |
| R2：Met 章节定位错误 | 独立回读并纠正到 Pillsbury 的具体章节/页；tapestry 单独定位，来源卡/catalog 同步 |
| R3：时间实现边过宽 | 去掉 seed API 到 score 的未经支持边和音频时钟到规则页的笼统边；以叶子 grammar ID 与局部接口限制表达 |
| R4：Brown 直接演出限制遗漏 | 来源与语法补明事前只约定总时长的首要意图；事件表明确为现代设计试验 |
| R5：本地研究选集与外部档案混淆 | corpus_scope 明示 atlas-selection / external-collection；本地 contains 只说明本次纳入 |
| R6：编辑语言/fixture 证据不一致 | 新页中文化；两叶子 ID 和来源直链明确；合成截图单列有限回执，未冒充浏览器/打印验收 |
| 根代理：JLReq 图片语义误读 | img2_1 是五行日文与标点；句子提到罗马字/数字，不是实际西文数字样本。修正文、主张、实体与图像证据 |
| 根代理：three.js hash 路由撞旧来源 | 实际重读专属 MeshStandardMaterial 页面后登记精确 URL，既有 docs index 保持原位 |
| 发现试用：多条目页过读、systems 入口绕路 | 材料路由直达经纬小节并说明停止点；systems 增加设计包/registry/MCP 路由，未迁移旧页 |

根代理仅对审阅发现与重要取舍回查，未重复五条流的全部研究。独立审阅四个官方来源成功，三处访问受阻，不冒充全部独立复验。

## 保存与后续

来源阅读范围与失败记录留各流 CHANGELOG，机器投影与 Schema 留书目根，薄消费留独立文档。共享 registry 由既有构建器更新，只新增本批 source records / aliases；没有改变原 chat materials/citation mappings。最终 commit、远端核对、检查结果见 [交接](handoff.md) 和 [验证](verification.md)。

## 2026-10-11 · 最终复审

独立 reviewer 复核 R1–R6，未发现剩余阻断；另自行执行 Schema、56 来源/46 实体投影一致性、12 个锚点、10 个 corpus_scope 与 Markdown 中公布的只读 validator，均通过。根代理比较既有 registry：624 条旧 source、全部旧 material/citation mappings 完全未变。复审不扩为视觉/文化/生产背书。


## 2026-10-11 · 分类补正、草案比较与正文减重

- 补正基线为 `f30b158946b284838afd9c0253ba3d01142b027d`，仍在唯一交付分支；未重做外部研究。首次审阅遗漏了分类覆盖，当前记录明确承认该缺口。
- 对 56 个新来源追加作者语境/语言分类，46 个实体追加媒介/谱系/runtime 判断，12 个 grammar 追加有依据的用途/任务/产物；operation 单点投影。unknown、not-applicable 与缺省 unreviewed 分开计数。
- 将生成器硬编码的叶子元数据移到 grammar.json；index schema 1.1 增加各层 facets、rationale 与生成的倒排 ID 表。当前分类所有者与共享证据连接规则见 facets.md；旧 schema、旧百科索引与来源正文未改。
- 逐值复核把复合句式标签拆成可组合词值；原物谱系与候选实现分开。独立审阅纠正三件 Skyspace 的 runtime：程序化灯光的控制软件未识别应为 unknown，不能仅因未找到软件证据就判不适用。材料 substrate 的理由同步为本库候选方案。
- 实际执行 13 个确定性检索案例；另有新上下文的五次查询试用。两者分别记账，不将程序检查当用户效果证据。
- 完整读取用户给定建构草案的 Library 文本，236 行，无后续页；只发布泛化裁决，不导入原附件、Library 标识或私有会话。沿用来源/观察/判断分离与渐进读取，拒绝从采集日推导历史起源、强制英语名称、风格完全参数化和成熟度单向化。
- 9 个新挂载页面按既有中文成文与证据契约精简。独立复核发现一处将未说明规则写成开放选择的语义回归，恢复 unknown；具体运行版本和重复研究过程留在来源/回执。
- 请求执行配置：三个分类 explorer 与两个正文编辑任务为 Luna high；独立审阅为 Astra high；新增发现试用为 Luna high。此为请求 provenance，不声称后端模型身份。
- 全部修正、覆盖、验证、审阅和本地累计合并范围分别在本目录留存。最终提交及推送 SHA 由最终交付消息与远端 ref 核验；云端不合并 main。
