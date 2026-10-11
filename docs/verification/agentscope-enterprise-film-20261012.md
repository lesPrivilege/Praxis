# AgentScope 企业线知识片验收 · 2026-10-12

对象：AS-FILM-01 revision 1；独立分支 `codex/agentscope-enterprise-film`。受众为企业 PM，交付入口见 [项目](../../demos/agentscope-enterprise-film/README.md)。

| 层 | 检查与结果 | 证据 |
|---|---|---|
| 内容 | Astra关键裁决、独立原稿审阅与五帧定点复核通过；六项P1修复 | [审阅](../../demos/agentscope-enterprise-film/evidence/content-review.md)、[复核](../../demos/agentscope-enterprise-film/evidence/final-content-review.md) |
| 画面 | 六章53场联络表与七个大图已看，未见截断；实际DOM稳定布局检查无溢出 | [画面](../../demos/agentscope-enterprise-film/evidence/README.md)、[布局](../../demos/agentscope-enterprise-film/out/layout-report.json) |
| 媒体 | H.264 1920×1080、24fps，1934秒，无音频流；随机16帧最低 36.06 dB；1fps采样无纯色帧 | [编码检查](../../demos/agentscope-enterprise-film/out/check-report.json) |
| 阅读 | 实际DOM曝光、每场≤6字符/秒、主体≥30px、导航来源≥24px通过 | [文字清单](../../demos/agentscope-enterprise-film/out/screen-text.md) |
| 阅读稿 | 1440与390px，禁用JS后53节可读，目录跳到Java章节，无横向溢出 | [检查](../../demos/agentscope-enterprise-film/evidence/reading-layout.json) |
| 封面 | 4:3 1600×1200与3:4 1200×1600原生SVG/PNG已检查，独立于成片 | [封面](../../demos/agentscope-enterprise-film/covers/README.md) |
| 播放器 | 7秒fixture任意seek、控制、键盘、终场与小屏通过；正片内置浏览器实际播放、暂停、跳章核对 | [管线](../../demos/agentscope-enterprise-film/build/README.md) |
| 来源 | 230个URL独立登记，原件hash纳入snapshot manifest，registry重建 | [来源](../../vault/provenance/agentscope-enterprise-20261012/README.md) |
| 仓库 | 通过：1366份Markdown、265份JSON、1080快照；0错误 | `python3 scripts/validate_repository.py` |

运动检查没有冒称完成：未连续按实际速度完整看完32分钟，未做PM受众或对照验证。固定源码和文档只支持静态机制解释，未clone/安装/运行AgentScope本身。Java恢复默认值文档冲突与Python内嵌OpenAPI漂移保留研究记录。封面多平台发布、授权和媒体外部播放器没有验证。

新规则只作用于后续视频：原生双封面、封面与成片比例独立、制作状态留过程文档。对现有任务已走读并产出两幅，历史视频不追补。范围和受影响入口见 [制作记录](../../demos/agentscope-enterprise-film/production.md)。

首次仓库检查发现本批catalog缺cards归属字段，已补生成器归属；另有两条基线Motion ceiling链接缺原文件，改为显式缺件的历史路径，不伪造恢复来源。该修订仅修复导航，原研究判断未改变。

仓库最终验证通过；生成来源卡由现有 render_source_cards.py 统一维护，首次生成232份本批卡片与索引。维护文本的 git diff --check 通过。媒体生成物在独立worktree保留，未发布或上传。

本地舞台在阻断所有HTTP/HTTPS请求时成功载入并跳到1408秒，未请求外部资产；[离线记录](../../demos/agentscope-enterprise-film/evidence/offline-stage.json)。MP4与双封面已另存到任务可视化目录，降低工作区误清理丢失生成物的风险。
