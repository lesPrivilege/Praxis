# 社区语法研究的版本与读取范围

核查日2026-10-02 UTC。这里记录已读范围与证据边界，不是外部prompt全文集。所有正文提案尚未执行。SHA为快照或明确标注的文件变更版本；仓库最近更新不能证明某个skill最近重验。

## 1 OpenAI skill-creator

- 主体版本：4ab6e0fd99c6667163bc34173e3ed3a3fed75ebc，2026-02-09
- 全读：skills/.system/skill-creator/SKILL.md、独立LICENSE.txt；另读3次路径提交、issue #109、对应修复diff
- [固定主体](https://github.com/openai/skills/blob/4ab6e0fd99c6667163bc34173e3ed3a3fed75ebc/skills/.system/skill-creator/SKILL.md)；[Apache-2.0许可](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.system/skill-creator/LICENSE.txt)；[缺失指针报告](https://github.com/openai/skills/issues/109)
- 成熟证据限于包装和发现路径修复，quick_validate是结构验证，不是任务效果评测。生态旁证：[安装后无需重启的2026-06-24修复](https://github.com/openai/skills/commit/49f948faa9258a0c61caceaf225e179651397431)，不归功于creator主体

## 2 Anthropic skill-creator

- 主体与run_loop变更版本：b0cbd3df1533b396d281a6886d5132f623393a9c，2026-03-06；读取时仓库头8a1541c4a3ffa5a20a5a91de0dcf3f0bab1d1ef4，2026-09-29
- 全读：SKILL.md、scripts/run_loop.py、agents/analyzer.md、LICENSE.txt；另读提交diff与路径历史
- [固定主体](https://github.com/anthropics/skills/blob/b0cbd3df1533b396d281a6886d5132f623393a9c/skills/skill-creator/SKILL.md)；[选择最佳描述的代码](https://github.com/anthropics/skills/blob/b0cbd3df1533b396d281a6886d5132f623393a9c/skills/skill-creator/scripts/run_loop.py)；[Apache-2.0许可](https://github.com/anthropics/skills/blob/8a1541c4a3ffa5a20a5a91de0dcf3f0bab1d1ef4/skills/skill-creator/LICENSE.txt)
- SDK认证与旧thinking措辞被移除来自提交；“选优集合不应再当未见终测”是本文据代码作的方法判断，不是项目承认的bug

## 3 superpowers 调试与TDD

- 快照：8ca22dba9a94f28898bbce59f2537ff4d87c747d，2026-09-25
- 全读：systematic-debugging/SKILL.md、root-cause-tracing.md、test-pressure-1.md、test-pressure-2.md、tests/systematic-debugging/test-find-polluter.sh、test-driven-development/SKILL.md、writing-good-tests.md、LICENSE；另读issue #1283、两次关键提交message/patch、路径历史与测试目录
- [调试主体](https://github.com/obra/superpowers/blob/8ca22dba9a94f28898bbce59f2537ff4d87c747d/skills/systematic-debugging/SKILL.md)；[TDD主体](https://github.com/obra/superpowers/blob/8ca22dba9a94f28898bbce59f2537ff4d87c747d/skills/test-driven-development/SKILL.md)；[MIT许可](https://github.com/obra/superpowers/blob/8ca22dba9a94f28898bbce59f2537ff4d87c747d/LICENSE)
- [关键词耦合改动90e1721](https://github.com/obra/superpowers/commit/90e1721817ff783a200017e395911b9af858285a)：author 2026-05-23，committer 2026-06-16；[压力消融报告b9e75dd](https://github.com/obra/superpowers/commit/b9e75dddec7a384f42ce08532ec17bb1ef5d9459)：author 2026-07-05，committer 2026-07-24。正文用“入库”日期
- 压力结果是维护者报告的n=10小样本遵循实验，未取得完整逐次记录、未复跑；脚本测试与工作流真实效果分开

## 4 Aider 编辑与局部恢复

- 快照：5dc9490bb35f9729ef2c95d00a19ccd30c26339c，2026-05-22；editblock prompt最后路径变更bfed819c1927b26e261e9ec6ab4e08020135676c，2025-10-05
- 全读：aider/coders/editblock_prompts.py、base_prompts.py、editblock_coder.py、tests/basic/test_editblock.py、LICENSE.txt；读issue #2258和评论、路径历史、作者格式文章。test_coder.py只扫描测试名，未算深读证据
- [恢复代码](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/coders/editblock_coder.py)；[回归测试](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/tests/basic/test_editblock.py)；[Apache-2.0许可](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/LICENSE.txt)
- [2023-12-21格式实验](https://aider.chat/2023/12/21/unified-diffs.html)；[格式与模型适配](https://aider.chat/docs/more/edit-formats.html)。旧实验不充当2026模型效果；恢复机制部分落实在executor，不只是prompt

## 5 SWE-agent

- 快照：3ea751c087f32b16e039a2233dd6eefecef325d5，2026-07-16；default.yaml路径变更a1193dd8fd84eb3e2cd6b0ecbd0bed1cdbb84993，2025-09-15
- 全读：config/default.yaml、tests/test_agent.py、LICENSE；agents.py重点读L789–868、L1062–1218及相关配置/轨迹定义；另读配置清理提交与目录
- [默认契约](https://github.com/SWE-agent/SWE-agent/blob/3ea751c087f32b16e039a2233dd6eefecef325d5/config/default.yaml)；[错误处理](https://github.com/SWE-agent/SWE-agent/blob/3ea751c087f32b16e039a2233dd6eefecef325d5/sweagent/agent/agents.py#L1062-L1218)；[含xfail的测试](https://github.com/SWE-agent/SWE-agent/blob/3ea751c087f32b16e039a2233dd6eefecef325d5/tests/test_agent.py)；[MIT许可](https://github.com/SWE-agent/SWE-agent/blob/3ea751c087f32b16e039a2233dd6eefecef325d5/LICENSE)
- 不外推为生产提交保障；不把blocklist或ContentPolicyViolation重询迁为拒绝绕过。保全diff不等于授权提交/推送

## 6 Trail of Bits differential-review

- 快照：82fe8226252622fa807643bdca1710901198553a，2026-09-28；skill路径变更4b1b74b181e81cbcaa8d3b68a0e4ed867165b972，2026-08-26；插件1.1.4
- 全读：该技能SKILL.md、methodology.md、adversarial.md、reporting.md、plugin.json、Makefile、.github/workflows/validate.yml、LICENSE；README只读项目/许可段；查插件目录和历史
- [入口](https://github.com/trailofbits/skills/blob/82fe8226252622fa807643bdca1710901198553a/plugins/differential-review/skills/differential-review/SKILL.md)；[方法](https://github.com/trailofbits/skills/blob/82fe8226252622fa807643bdca1710901198553a/plugins/differential-review/skills/differential-review/methodology.md)；[CI](https://github.com/trailofbits/skills/blob/82fe8226252622fa807643bdca1710901198553a/.github/workflows/validate.yml)；[CC BY-SA 4.0许可](https://github.com/trailofbits/skills/blob/82fe8226252622fa807643bdca1710901198553a/LICENSE)
- 未找到专属漏洞检出效果评测；不从“仓库CI成熟”推导“该skill已证明有效”，也不宣称不存在未公开验证

## 7 Anthropic DOCX

- 快照：8a1541c4a3ffa5a20a5a91de0dcf3f0bab1d1ef4，2026-09-29；相关修复fa0fa64bdc967915dc8399e803be67759e1e62b8，2026-07-17
- 全读：skills/docx/SKILL.md、scripts/office/validators/redlining.py、独立LICENSE.txt；另读路径历史、PR #1447与相关diff
- [主体](https://github.com/anthropics/skills/blob/8a1541c4a3ffa5a20a5a91de0dcf3f0bab1d1ef4/skills/docx/SKILL.md)；[正文覆盖范围](https://github.com/anthropics/skills/blob/8a1541c4a3ffa5a20a5a91de0dcf3f0bab1d1ef4/skills/docx/scripts/office/validators/redlining.py)；[独立Proprietary许可](https://github.com/anthropics/skills/blob/8a1541c4a3ffa5a20a5a91de0dcf3f0bab1d1ef4/skills/docx/LICENSE.txt)
- 仅分析抽象机制；不分发原prompt、脚本或全文缓存。验证器通过的声明只能覆盖它实际检查的正文部分

## 8 Open Deep Research

项目2026-08-21已归档，仓库只读；抽象价值仍可研究，不能期待继续维护或修复。

- 快照：1b7d2e80db9faa586165c60e09096dbbfd483a64，2026-08-10；研究图最近实质修改6532a4176a93cc9bb2102b3d825dcefa560c85d9，2025-08-06
- 全读：src/open_deep_research/prompts.py、deep_researcher.py、tests/evaluators.py、README、LICENSE；另读主图历史与#163、#283、#252。#252未继续核查utils，未用于正文结论
- [prompts](https://github.com/langchain-ai/open_deep_research/blob/1b7d2e80db9faa586165c60e09096dbbfd483a64/src/open_deep_research/prompts.py)；[异常分支](https://github.com/langchain-ai/open_deep_research/blob/1b7d2e80db9faa586165c60e09096dbbfd483a64/src/open_deep_research/deep_researcher.py#L331-L343)；[#283最小复现](https://github.com/langchain-ai/open_deep_research/issues/283)；[MIT许可](https://github.com/langchain-ai/open_deep_research/blob/1b7d2e80db9faa586165c60e09096dbbfd483a64/LICENSE)
- #283核查时open，代码交叉印证；本文未执行PoC。评测是原项目配置与LLM裁判，不是每条prompt的独立因果证据

## 9 BMAD product brief

- 快照：4f61d4e769e50bc11d0d5d724f48942aac699679，2026-10-02；skill路径变更0d499b9b827d978968b9d16ed80324ae9a0f6a41，2026-09-28
- 全读：skills/bmad-product-brief/SKILL.md、customize.toml、LICENSE；历史evals.json @ c19f6cd72a874b85ac00f100626c19136b5e120d；查新旧目录、测试树、相关提交、#2885
- [当前主体](https://github.com/bmad-code-org/BMAD-METHOD/blob/4f61d4e769e50bc11d0d5d724f48942aac699679/skills/bmad-product-brief/SKILL.md)；[2026-05-09历史eval](https://github.com/bmad-code-org/BMAD-METHOD/blob/c19f6cd72a874b85ac00f100626c19136b5e120d/evals/bmm-skills/bmad-product-brief/evals.json)；[2026-06-20删除记录](https://github.com/bmad-code-org/BMAD-METHOD/commit/cd8ac7e9aa54782f3f584b601edce6020f8fd110)；[MIT及商标说明](https://github.com/bmad-code-org/BMAD-METHOD/blob/4f61d4e769e50bc11d0d5d724f48942aac699679/LICENSE)
- 旧16-case suite未证明多轮facilitation；当前树未见此skill替代行为评测，不等于证明项目从未做过其他验证。#2885是旧版本handoff例，不宣称当前仍复现

## 10 Fabric improve_writing

- 文件路径最后变更：4004c51b9e54356ce64015b6d649ac4765cbde08，2025-07-09，为目录重构
- 全读：data/patterns/improve_writing/system.md、internal/plugins/db/fsdb/patterns_test.go、LICENSE；查旧路径历史、当前目录与issues
- [主体](https://github.com/danielmiessler/Fabric/blob/4004c51b9e54356ce64015b6d649ac4765cbde08/data/patterns/improve_writing/system.md)；[输送测试](https://github.com/danielmiessler/Fabric/blob/4004c51b9e54356ce64015b6d649ac4765cbde08/internal/plugins/db/fsdb/patterns_test.go)；[MIT许可](https://github.com/danielmiessler/Fabric/blob/4004c51b9e54356ce64015b6d649ac4765cbde08/LICENSE)
- 未找到该pattern语义保真的行为评测；它是本报告刻意保留的较弱证据反例，不作为“成熟万能写作法”

## 独立研究与检索边界

- [SkillsBench v4](https://arxiv.org/html/2602.12670v4)，2026-06-14：读摘要、方法、结果、限制，未复跑。任务/模型/harness与公共社区全部分布不同；结构贡献尚缺更强对照
- [Evaluating AGENTS.md v3](https://arxiv.org/html/2602.11988v3)，2026-09-29：读摘要、CTXbench方法、实验设置与结果/消融段；不能将context文件结果外推所有skills
- [Agent Skills Can Be Harmful v1](https://arxiv.org/html/2608.11888v1)，2026-08-12：读摘要、差分方法与有效性威胁；筛选失败案例不是生态发生率
- 候选发现共12组成功Exa检索、65个返回结果槽位，含重复URL；另有3次因缺字段而在搜索前拒绝的请求，未得到结果。数字不表示65个独立证据或全部深读；正文以以上实际原文读取为准
- 未完整审计任何仓库；未安装、执行被研究素材，未做真实Praxis评测；未经闭环的故障线索没有混入强结论
