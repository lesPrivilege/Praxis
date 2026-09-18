# ADR-007 · Environment contracts and expert roles

状态：accepted（治理边界）；runtime与Courtwork接入：deferred。编订：Astra。日期：2026-09-19。

依据：工作系统r3新增10轮，用户提出environment索引、fresh Mac、账号/数据隔离、Agent用量治理、Praxis Expert、Kit/Skill层次与抗折旧性。完整消费见 [r3提炼](../../vault/distilled/work-system/r3/README.md)。

决定：增加kit/environment作为三个消费域共享的环境契约层。Praxis声明能力、对象、规则与数据分区；机器配置、企业事实、secret和runtime state拥有各自归属。

Expert表达职责，Kit保存长期资产，Skill是有界入口，工具执行动作，runtime/model保持可替换。采纳这一分层不代表Courtwork已经支持或本轮已实现Expert。先保留通用agent手动loop；fork、profile和独立打包由实际能力缺口及可验证上游状态触发。

用量治理只记录真实可见指标；unknown不等于0。抗折旧方向采纳可移植schema、evidence、review和eval契约；关于神经attention/指令权重的具体因果解释不作为架构事实。

后果：不把Kit整体压成一个Skill，不以目录名推断宿主指令优先级，不自动修改全局Agent配置、安装工具或把企业trace用于训练。后续实现需独立ADR与可检验产物。
