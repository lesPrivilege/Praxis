# Palantir Reading List · Series Production Handoff

**状态**：2026-10-17 · 执行候选交接；尚未修改 Praxis 仓库，尚未运行视频生产与验收。  
**目标仓库**：`lesPrivilege/Praxis` · 目标归属 `palantir/reading-list-series/`，而非 `demos/`。  
**目标**：依靠英文原典与可核查的一手材料，制作中文知识视频；先形成可独立观看的内容单元与简要总纲，再由相同内容单元生成无重复引导的合集。每个发布单元提供原生 4:3 与 3:4 封面。成片与配套出处同为交付，不把研究记录冒充作品。

## 0. 指令优先级与既有裁决

1. **Writing Kit 对文案负责。** 所有中文旁白、结构文字、跨语言术语及冷读采用当前仓库的 `kit/write/`；GPT/Claude 等模型的默认语气、模板和“金句”不具有规范地位。应按需消费 `kit/write/prose/grammar.md`、`genres/narration.md`、`review.md`、`multilingual.md`，以及 `kit/write/shared/evidence.md`、`kit/write/motion/narrative.md`。个人语体只通过现行 `kit/write/prose/author-profile.md` 的配置机制取用，不从任何聊天记录归纳新的写作规则。此前聊天给出的固定六段式和时长建议是候选，不是生产约束。
2. **Output-first。** 主生产期以完成实际可观看的作品为目标，不在制作中持续“蒸馏”、更新 Kit 或做无谓框架治理；完成作品后唤醒 fresh agent 独立 dogfood，再做 RSI（从失败、反例、观察到有效修订的迭代）与必要的 Kit 晋升裁决。生产所必需的事实核查、版权检查和构建验收仍应进行，不因 Output-first 被取消。
3. **多 Agent 自由分工。** 主执行者可按任务自由编排研究、设计、旁白、音频、实现及审阅 agent；不预设模型拓扑或强制指定人数。并行写入须有文件所有权；跨分支交接须能重演与核验。准确记录实际模型与工具，不伪称执行。
4. **不重复建知识树。** 已有 `palantir/` 与 `vault/`、`kit/`、`docs/` 分层；新项目挂于 `palantir/`，不迁移历史 `demos/palantir-discovery/`。原件来源与私有全文继续遵守 Vault 的入账、快照及权限边界。
5. **不自动发布、不擅自写主分支。** 新施工分支、内容生产和对外发布分别确认；本交接不构成已完成部署/授权。

## 1. 已有材料：先消费再增量探索

当前主分支可发现：

- `palantir/README.md`：主题定位、证据状态及进入条件。
- `palantir/references/README.md`：**七个研究对象的稳定 ID、确切已读范围、缺口**。
- `vault/intake/palantir-20261001.json`：入账。
- `vault/snapshots/local/palantir-20261006/README.md`：15 件本地原件的范围、取得方式及版权边界。
- `vault/distilled/palantir-reading-20261006/README.md`：七份初次提炼笔记，仍是候选。
- `demos/knowledge-film-001-pyramid-cut5/README.md`：已有可消费的 TTS、按词锚点、成片与审阅经验，但非要复制的骨架。
- `kit/write/motion/README.md` 与 `narrative.md`：权威的 Motion 表达及双画幅封面契约。

来源现状：Qureshi、Lonsdale 两篇亲历/背景文章全文已入账；Dalio 2011 版权 PDF 全文已取得但 Part 3 大部未被提炼；Portigal 第二版第一章及其公开的六份实践 PDF 已取得；Impro 仅有出版方介绍与目录；The Looming Tower 有出版方约 2,470 词正文节选；GTD 有官方节选且节选为 2001 版，与登记的 2015 版不同。**原件到手 ≠ 全文已读 ≠ 每个结论被原典支持**。不要把五本书概括为当时寄送了五本 2017 年以后的正式成书：Qureshi 描述的是四本书加一份后来发展为 Dalio《Principles》的早期 PDF。

后续 English-source explorer 分开寻找：

1. **书籍与作者本人**：合法阅读副本、出版社章节、作者讲座、官方网站、访谈、作者公开工作表；逐段登记英文原句定位与版本。版权受限时，不用二手摘要冒充原典。
2. **组织亲历者**：Qureshi 原文、Palantir 官方岗位和产品文档、可核查的一手访谈；将“Palantir 实践”与“我们的工作方法推导”严格分开。
3. **历史与机构资料**：《The Looming Tower》对应的 `9-11commission.gov` 官方报告、听证会笔录/影像、NARA 相关记录。报告是独立一手史料，不是 Lawrence Wright 的书的替代全文。
4. **社区与 YouTube**：可用来定位演讲、时间码、异议或例子；真正写入原典论证前仍需核对上游来源，注明作者身份、时间和出处。
5. **图像与画面**：书籍封面、作者肖像、官方产品截图、原始文档、档案照片、演讲画面、许可明确的 Commons/LOC/NARA 项目，以及原创可视化和 motion。每件单独核验权利；不靠一段通用免责声明解决。

参考法务/来源页面：

- Library of Congress `https://www.loc.gov/free-to-use/` 及其 `understanding-copyright` 说明。
- NARA 影像权限 `https://www.archives.gov/research/motion-pictures/permissions`。
- Wikimedia Commons 外部复用 `https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia/en`。
- 9/11 Commission archive `https://www.9-11commission.gov/archive/index.htm`。
- YouTube 服务条款；视频可观看不等于可下载、重剪或再发布。

## 2. 内容拓扑：先单元，后合集

先做一部**简要总论**，完成史料出处、五个对象（四书+早期 PDF）的共同问题与整体能力图景；不能让总论变成五本书概要的浓缩口播。然后将候选主题拆成可独立制作的研究单元：

- `overview`：书单来历、史料核实、为什么对 FDE 现场工作有价值。
- `user-research`：*Interviewing Users*；观察、提问、证据与诉求/问题区别。
- `impro-collaboration`：*Impro*；地位互动、即兴与建立合作（若证据仍仅为目录，必须寻求本人演示或保持推断身份）。
- `execution-system`：*Getting Things Done*；任务、下一步行动与外部系统，注意版本。
- `principled-judgment`：*Principles* 早期稿与现代版不可混同；原则、反馈、组织决策。
- `institutional-failure`：*The Looming Tower*；历史语境、组织隔离、信息与责任，书籍论点与官方档案分列。

**这些是候选研究单元，不是固定六集合同。** 一个单元如果只有概念列表、少量间接材料、重复既有讲解、没有可演示的机制，则并入相邻专题或做为合集中一个章节；证据足够且有完整问题→机制→反例的单元才独立发布。时长依实际内容确定，不硬凑分钟数，不为匹配集数注水。

单集的引入、系列身份、结尾导向作为可替换段落；**合集基于同一份正文和分镜数据重新组装**，删除重复片头、片尾、召回、订阅提示，只保留语义需要的转场与一次性总引导。不得简单拼接多个 MP4 后声称没有重复、音量和字幕问题。合集对新增的过渡段独立做证据与口播校验。两种版本的字幕、章节和出处索引需同一 ID 关联。

每个发布单元输出**独立原生 4:3 + 3:4 封面**，提供可编辑源和预览，不是同图裁切。封面画幅与成片画幅相互独立；如发布平台需要 16:9 缩略图，额外生成适配版，不拿 4:3 冒充该平台原生比例。封面保留系列的编辑性识别，但不用 Palantir 官方 logo 或品牌元素制造官方出品的误导。

## 3. 建议仓库结构（待施工者与维护者裁决）

```text
palantir/
  README.md                       # 保留既有主题入口，增加系列索引
  references/                     # 保留既有稳定引用目录，不复制全量来源
  reading-list-series/
    README.md                     # 当前版本、如何观看/构建、验收与缺口
    AGENTS.md                     # 仅项目边界；链接 Kit，不复制写作规则
    series-manifest.json          # 顺序、版本、发布模式、片段关联
    research/
      README.md                   # 哪些来源覆盖哪些主题；回链 Vault
      claims.jsonl                # 逐条主张与证据身份及原典定位
      assets.jsonl                # 候选画面、权利与使用范围
    episodes/
      00-overview/
        README.md                 # 问题、材料覆盖、为何独立
        script.md                 # 中文旁白，由 Writing Kit 生产
        beats.json                # 时间叙事和场景数据；可由实现重定格式
        scene/                    # 可编辑画面源件
        covers/                   # 4x3/3x4 原生源件与小型预览
        review.md                 # 来源审校、视觉/听感验收
      01-.../
    film/                         # 按实际消费需要共享的 renderer/构件
    assembly/                     # standalone 与 compilation 同源编排
    verification/                 # 出片前/后检查和实速观看记录
    CHANGELOG.md
```

不预设 Remotion/HTML/FFmpeg/Blender 必选，旧知识片可作为候选参考。先比较已验证的技术与实际需求：时间轴是否需要从音频锚点驱动、图像如何嵌入、是否需要可复用合成、素材更新是否会重排版。小的生产引擎胜过为了一个系列做平台级框架。可复用构件第一次留项目中，经其他独立任务消费与审查后再考虑 Kit/共享迁移。

Git 保留：文稿、来源定位与 license metadata、可编辑小型场景/封面源、编排数据、确定性构建脚本、锁文件与验收记录。默认不进 Git：**受限整书全文、未经许可的大批第三方图片/影片、隐私材料、凭据、TTS key、缓存、临时下载、逐帧 PNG、MP4、WAV 和其他重型生成结果**；优先项目专属 `.gitignore` 规则，确有必要才调整仓库根 ignore。生成物通过本机发布目录/独立附件交付，按构建工件 hash 与 manifest 保持可追溯；不要在源码中嵌入大段第三方原文。

## 4. 两个独立但互联的 Ledger

**Claim ledger（内容证据）**：`claim_id`、`episode_id`、`statement_zh`、`claim_type`（direct-source / eyewitness / inference / synthetic / unresolved）、`source_ids[]`、`edition`、`locators[]`（page / chapter / paragraph / timecode）、`coverage_read`、`confidence_or_limits`、`script_range`、`visual_refs[]`、`review_state`。原文未读则 `coverage_read` 必须如实记录，不能仅以来源存在标为已证实。

**Asset ledger（发布权利）**：`asset_id`、`source_id`、`title`、`creator`、`copyright_owner`、`canonical_url`、`access_date`、`license`、`license_evidence`、`attribution_required`、`credit_text`、`allowed_uses`、`local_path_or_remote_ref`、`sha256`、`episode_ids[]`、`shot_timecodes[]`、`edit_transform`、`rights_status`、`reviewer`、`replacement`。

权利状态建议：

- `approved`：已核实公有领域、开放许可条件满足或取得授权，且适用于本次视频使用。
- `commentary-review`：因批评、评论、研究等用途提出具体有限使用理由，需逐项复核，不自动通过。
- `research-only`：只作写作研究或片外指针，不能进入待发布片流。
- `unknown` / `blocked`：无权利依据、来源缺失或与平台协议冲突，发布构建拒绝进入。

书封、Palantir 产品截图、人物肖像、YouTube 影像均不默认 approved。第三方音频片段同样受 ledger 管理。只供引用研究的受控借阅材料与对外可用的图像是两种不同资产。若视觉引用真正用于针对具体原物的分析，保存该使用必要性、范围与替代评估；公有领域与开放许可条件仍按单件记录，不能由来源网站一概推定。

建议上线前检查：每个用于生成最终帧的外部 asset 都能解析到 `asset_id` 且有可审查的发布权利状态；每个事实性标注/引文对应 `claim_id`；不满足者必须替换、删去或明确由人工裁决其具体合法依据。

## 5. 工作方式与 Agent handoff

生产主代理有权自由分配并行任务。下列是**可选任务切面，而非固定 Agent 配置**：

- **Source explorer**：从既有 7 对象、原典版本、英文访谈与第一手档案入手；交付来源ID、精确原文定位、读到范围、可支持/不支持的主张、新增与缺口。
- **Visual asset explorer**：按章节语义找原典图片、作者演讲、书封、档案及实际产品图；逐件记 asset ledger 与画面用途；不能把“搜到图片”写成“有权发布”。
- **Editorial lead**：只在阅读相关 Writing Kit 后撰写中文旁白与结构文字，并进行独立冷读。个人语体使用 Kit 配置，不从其他模型的常见稿式取材。
- **Motion/film implementer**：从真实分镜选择适当引擎，支持来源图像与原创场景共存，导出两个封面画幅；单集与合集共享本体内容。
- **Sound/TTS**：以旧 Seed TTS 的真实项目经验作为参考；做多音色小样与听感/转写/对齐核验；不锁死供应商。专业名词、人物、书名和数字设读音表。
- **Independent reviewer**：在产物已可观看之后，以 fresh context 实速看完并核对音画、图注、引用、license、片头尾和合集过渡；没有完成的项目不作“已验收”声明。

代理交付至少包含：本次输入版本、文件所有权、实际阅读范围、完成产物路径、能重复的校验步骤、剩余阻塞、未验证项。探索可使用独立分支；避免多个 Agent 同时改 `palantir/README.md`、`series-manifest.json`、根脚本或同一分集的同一路径。主生产不为这些 agent 额外制造“总提炼层”。

## 6. 真实 Output 验收与 Post-output RSI

对每条独立视频至少实际检查：

- **事实**：引用的版本、英文原句定位、条件与范围；主题推导是否仍被表达为作者/Palantir 观点。发行字幕与源 claims 一致。
- **写作**：Writing Kit 冷读，听觉连续性、指代、多音字与句式重复；独立核查画面上实际出现的全部结构文字，不只看分镜稿。
- **素材**：每帧外部图片/视频对应的 ledger 状态、署名、许可与必要的评论性用途证据；书封与 logo 不被误当作开放素材。
- **视频**：真实速度观看全片，音画与字幕同步、文字驻留、封面两种比例均原生编排、无裁切和阅读障碍。
- **合集**：从单集同源数据重新组装；无重复 intro/outro/CTA、音量突变、音乐断层、过期跳转或章节 ID 冲突；新增串词重新审阅。
- **工程**：可在隔离的干净环境执行有锁版本的构建；缺凭据和受限素材时应给出明确可恢复错误，不默默改用未经授权素材；执行 `python3 scripts/validate_repository.py`。凡未运行的检查必须明确记为未执行。

**在 Output 可观看并有上述回执后**，再启动 Fresh Agent 的 dogfooding/RSI：以首次进入该系列的消费者身份，从项目 README 找到并播放视频，定位真实问题；按 `observed failure → minimal cause → local correction → rerun → regression evidence` 回合推进。完成后另派 reviewer distill 可迁移的方法、失败模式与反例到 Vault；只有跨项目成立、已有适用证据且经过 owner 裁决者才改动 Writing/Design Kit。避免因单个项目风格而改写通用规范。

## 7. 首批施工的具体完成定义

**先完成以下能够交接的对象（顺序可并行，不因没补齐五本全文而全部停工）：**

1. 基于原仓库证据编订 `series-manifest`、研究缺口图及每候选单元的证据密度判断；明确哪些足以单集、哪些暂合并。
2. 一个简要总纲，以及至少一个证据充足的独立单元，均有 Writing Kit 产出的成稿、可追溯 claim ledger 和分镜。首选 Interviewing Users，因有作者亲自发布的实践工件，但要由研究判断而非本交接强制。
3. 至少一个完整可观看的技术链路：英文素材 → 中文旁白 → 分镜 → TTS/字幕 → 图像/motion → 渲染 → 双封面 → 校验/观看页。
4. 通过相同内容单元生成一次 `standalone` 与 `compilation` 两个版本，演示引导层确实可裁剪而不会丢正文；若尚只完成一个单元，可以只做 assembly fixture，不将其称为最终合集。
5. 输出生产回执，说明来源的已验证、部分验证、受限和未取得项；不要宣称整季完成、已经发布或获得所有版权授权。

**停止条件**：若现有材料对某个单元只能提供书名和目录、无可独立论证与演示的机制，不强制成集；标为 `hold/merge`，转而完成其他具有证据支持的单元。新内容如只有社区转述，可以保留研究线索，不能以一手原典口径播出。

## 8. 启动时须实地检查的事项

- 重新读取当时仓库 HEAD：上述路径与 2026-10-17 观测一致不保证后续不变。
- 检查原视频示例的依赖、TTS 服务、许可与 renderer 是否仍可运行，无法运行时只吸收经验不迁移实现。
- 确定项目所有者希望的发布平台、视频主画幅、是否对外公开；这些决定影响版权裁决、字号和导出码率，但不阻碍文本/来源探索。
- 明确需不需要特定配音供应商；不可将现有账号、密钥或个人声音素材加入仓库。
- 任何远端 git 写入、合并、上传或正式发布都由取得对应授权的执行者操作。本 handoff 本身未执行上述动作。
