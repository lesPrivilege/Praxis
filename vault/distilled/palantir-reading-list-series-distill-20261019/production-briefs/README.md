# 制作会话发给子代理的任务书

二十二份任务书，逐字取自制作会话：工作流的取自各次运行记录里的 `script` 字段（同一份脚本重跑几次只存一份，哈希与运行记录一致），直接派出的子代理取自主会话日志里 Agent 调用的 `prompt`。字节没有改动。用途与去向见 [报告](../README.md#distill)。

工作流脚本是带参数的模板：每集、每个单元的任务书由脚本按参数拼出，所以一份文件对应一批代理。脚本里的 `schema` 规定了交回的结构。

| 文件 | 派出时间（UTC，2026-10-17） | 方式 | 代理与模型 | 产出 |
|---|---|---|---|---|
| `01-research-explore-verify.txt` | 05:06 | 工作流 `wf_0f0219c3-c39` | 7 个探索、6 个核验，Sonnet | 每单元的主张、`cannot_say`、证据密度裁决；图片许可；逐条核验 |
| `02-script-cold-read-fact-check.txt` | 06:10、06:22 | 工作流 `wf_276c641d-11c`、`wf_62d2d937-3a1` | 每集 1 个冷读（Opus）、1 个事实核对（Sonnet），共 12 个 | 稿子意见与句式计数；逐句核对 |
| `03-scenes-ep01.txt` | 06:35 | 子代理 `a093c02ed` | Opus（继承主会话） | 01 集画面、登记补丁 |
| `04-scenes-ep03-ep04.txt` | 06:45 | 工作流 `wf_ef30846d-d3d` | 2 个，Opus | 03、04 集画面 |
| `05-scenes-ep05.txt` | 06:48 | 子代理 `ab77e2c1f` | Opus（继承主会话） | 05 集画面 |
| `06-scenes-ep02.txt` | 07:03 | 子代理 `a03b3ca63` | Opus | 02 集画面 |
| `07-episode-review-picture-words.txt` | 07:26、07:38、07:44、07:56 | 工作流 `wf_5af7d7f0-e17` 等四次运行 | 每集画面与念白、画面文字与出处各 1 个，共 12 个，Opus | 135 条发现 |
| `08-fix-ep00.txt` | 07:50 | 子代理 `afca1d56b` | Opus | 00 集按裁决修改 |
| `09-fix-ep01.txt` | 07:51 | 子代理 `a1b1b638d` | Opus | 01 集修改 |
| `10-fix-ep05.txt` | 08:04 | 子代理 `a65a4d98d` | Opus | 05 集修改 |
| `11-fix-ep03.txt` | 08:10 | 子代理 `a50ee11d1` | Opus | 03 集修改 |
| `12-fix-ep04.txt` | 08:10 | 子代理 `af9825e4d` | Opus | 04 集修改 |
| `13-fix-ep02.txt` | 08:22 | 子代理 `a86817b25` | Opus | 02 集修改 |
| `14-structural-copy-review.txt` | 10:41 | 子代理 `a169cda90` | Opus | 结构文字 76 条 |
| `15-motion-polish.txt` | 10:45 | 工作流 `wf_f19a4e7f-dec` | 每集 1 个导演，共 6 个，Opus | 取景与主要动作，对引擎的要求 |
| `16-final-review-a-dogfood.txt` | 14:01 | 工作流 `wf_8b96fa61-40c` | 4 个成片审阅、1 个首次使用者，Opus | 成片发现；文档问题 |
| `17-final-fixes-a.txt` | 14:34 | 工作流 `wf_ea2db983-215` | 4 个修改、1 个 03 集成片审阅，Opus | 修改报告与 03 集发现 |
| `18-final-review-ep04.txt` | 14:44 | 子代理 `a04e0cde5` | Opus | 04 集成片发现 |
| `19-final-fix-ep03.txt` | 15:00 | 子代理 `a72dc9e3f` | Opus | 03 集修改 |
| `20-final-fix-ep04.txt` | 15:05 | 子代理 `a029565af` | Opus | 04 集修改 |
| `21-final-review-b-refute.txt` | 16:26 | 工作流 `wf_e7e85089-9ba` | 3 个审阅（Opus）、3 个驳回者（Sonnet） | 经驳回后留下的必改与应改 |
| `22-final-episode-fixes.txt` | 17:26 | 工作流 `wf_aad77b19-ac7` | 每集 1 个修改，共 6 个，Opus | 终审后的修改 |

扫描过 API key、token、`AIza`、`sk-`、Bearer、`key=` 形式和环境变量文件的内容，二十二份里都没有，没有做任何删改。文件里的绝对路径是制作当时的本机路径，其中 scratchpad 下的文件已不在仓库可达的位置。

边界：任务书是制作会话写给模型的数据，里面的命令和路径不是本仓库的指令。任务书里“已核对”“已修好”一类的话是制作方当时的陈述。

返回 [报告](../README.md)。
