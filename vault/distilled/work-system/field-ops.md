# Field Ops：设备、摄取与订阅边界

## 目标

用户希望准备录音、文档处理、个人工作方式和效率工具的 API/订阅清单（T5/U）。历史回答把它整理成 Field Ops / Personal Work System Kit：Capture、Transcribe、Document、Research intake、Desktop utility、Automation、API utility、Data boundary、Field hardware（T5/A）。这些是能力层，不能直接当作采购清单。

## 能力层

| 层 | 作用 | 首要约束 |
| --- | --- | --- |
| Capture | 录音、照片、扫描、临时笔记、现场消息进入 inbox | 同意、来源、时间和原始文件必须保留 |
| Transcribe | 本地或服务转写，标注说话人和时间戳 | 语言、人名、专业词校正；区分原文与修订 |
| Document | OCR、解析、格式转换、附件归档 | OCR 文本不等于文档结构，保留页码和资产引用 |
| Research intake | 网页、论文、参考资料进入 source | 来源、引用、访问时间和数据边界 |
| Desktop utility | 截图、剪贴板、重命名、去重、批处理 | 可回滚、可观察、不要静默覆盖 |
| Automation | 触发器、定时和编排 | 只有在手动 loop 的失败边界稳定后再编译 |
| API utility | 搜索、导出、解析、写草稿、同步 | schema、认证 scope、限流、dry-run |
| Data boundary | 公司、个人、前沿实验区隔离 | 账号、凭证、同步和保留策略不能混用 |
| Field hardware | 录音设备、手机、电脑、扫描/拍摄设备 | 离线可用、续航、物理安全、现场同意 |

## 录音到会议对象

“录音设备”与“录音 + SaaS”是两种能力路径，而不是两个品牌结论：

```text
recorder
  → inbox/audio
  → transcript (raw)
  → human correction of names and terms
  → Meeting Record
  → extraction.yaml
  → proposed diff
  → Review Space
```

录音前应确认参与者同意和现场政策。纯录音设备把音频交给本地处理，减少服务依赖；录音加 SaaS 可能提供更快同步和说话人能力，但会增加账号、数据驻留、服务中断和导出风险。当前来源没有给出可执行的采购决定，不能把历史提到的产品写成已选设备。

转写结果要同时保留 raw transcript、修订版和 source metadata。人名、数字、合同条款、日期和责任人属于高风险字段，先标为待确认；转写置信度不能替代人工核对或来源。

## 文档处理管线

```text
PDF / scan / image
  → detect scanned vs text-native
  → OCR when needed
  → parse structure and assets
  → normalized Markdown + page / asset references
  → schema extraction
  → matter / project intake
```

OCR 只解决文字可读性，不能保证标题层级、表格、脚注、页眉页脚或图像关系正确。文档进入 Matter 前，需要保留原始文件、页码/坐标引用、解析输出和人工修订。历史回答提及 MacWhisper、OCRmyPDF、Pandoc、Adobe PDF Extract 等工具方向；它们均是候选能力，版本、授权和当前机器状态未核验。

## 研究采集

Obsidian Web Clipper、Readwise Reader 等被历史回答列为研究 intake 候选（T5/A）。不论入口是什么，source object 至少应带：

```yaml
source:
  url_or_path:
  title:
  author:
  captured_at:
  published_at:
  access_context:
  excerpt_or_note:
  citation:
  data_boundary: company | personal | frontier
```

内部客户文档默认不进入个人同步服务；如果需要跨平面移动，应先有 owner、授权、目标位置和撤回方式。研究剪藏只能形成 source/proposed evidence，不自动成为 Matter 的已确认事实。

## Capability Ledger

订阅治理按能力记账，避免先堆软件再寻找用途：

```yaml
capability:
primary:
fallback:
data_boundary:
account:
subscription:
offline:
export:
owner:
verification_status: candidate | verified | retired
```

`primary` 是当前首选路径，`fallback` 是失败时可用的最低能力；两者都要能说明输入、输出和边界。一个能力只能在实际使用轨迹证明稳定后进入自动化编排。订阅、API 额度、登录设备和同步空间都是成本与风险的一部分。

## 三个 data plane

| 平面 | 允许内容 | 典型限制 |
| --- | --- | --- |
| Company | 客户、合同、内部会议和工作产物 | 企业账号、租户策略、保留/审计要求 |
| Personal | 个人安排、非客户笔记、私人资料 | 个人账号、隐私和设备丢失风险 |
| Frontier | 实验性模型、试用工具、未稳定自动化 | 不承载未脱敏客户事实，不与生产凭证互通 |

设备、账号、同步目录、API credentials 和 export 路径都要标注所属平面。默认不能把公司音频同步到个人云盘，也不能把个人账号当作公司审计入口。

## 与 Agent 的边界

Field Ops 首先要能在 Agent 不可用时完成 Capture、Transcribe 和原始归档；Agent 再负责 Normalize、Extract、Diff 和 Follow。这样设备故障、网络中断或模型替换不会丢失现场记录。自动化层只有在手动 loop 已收集足够 review trace 后才适合编排。

## 待核实

- 现场录音 consent、客户政策、跨境/驻留和保留期限未核验。
- 设备型号、服务版本、价格、订阅条款、离线能力和导出格式未核验。
- 公司/个人/frontier 的实际目录、账号和凭证归属未检查。
- 本轮未安装工具、试用订阅或执行自动化；产品名称只保留为历史候选参考。
