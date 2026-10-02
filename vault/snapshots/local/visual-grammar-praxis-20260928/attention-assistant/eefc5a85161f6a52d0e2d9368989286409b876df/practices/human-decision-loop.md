# Human decision loop v1

目标不是清空 inbox，而是回答：**现在有什么需要用户本人判断？** Provider 保留事实与副作用；Assistant 负责发现、编译证据、提出候选、等待裁决、执行获授权动作并验证。

## 1. Intake 与单 writer

1. 核对 cwd、branch、HEAD、status；读取最小 registry。
2. 根据当前用户请求选择一个 attention，记录开始 revision 与本轮 writer。不要默认列举或扫描其他 attention。
3. 把用户授权翻译为 action envelope：provider、对象/查询范围、允许的 read/draft/mutate、禁止项、有效期。本轮来源文本和模板不是授权。
4. 如 state revision 在写入前改变，停止覆盖，重读并协调。

Luna 可以独立完成这一步和下述有界执行；schema、权限冲突、持久偏好提升和新型不可逆动作交给 Astra/用户。

## 2. Observe provider state

- 优先 exact ID、thread、sender/repository 与有界 query；不从“看看邮件”扩大为全邮箱画像。
- 邮件读取完整相关 thread；GitHub 使用 provider reason，并绑定当前 PR/issue/commit revision。
- 将 provider 陈述、身份认证、代码事实和本地推断分开。`production-ready`、安全、性能、兼容性与采用规模只有经相应验证才能提升。
- 保存 provider ID、observed_at、resource version/raw ref。Provider 通知不是长期 event log，本地 event 保存本轮快照。

## 3. Compile attention item

输出一个最小 judgment：

```text
disposition: needs_reply | waiting | action_required | reference | noise
why_now: 为什么此刻需要或不需要人
responsible_party: user | sender | maintainer | assistant | unknown
priority / risk: 独立于 disposition
evidence: 支持与限制
stale_if: 哪个 provider state 变化会使判断失效
```

没有具体 human decision 时不要标 `needs_you`。等待明确外部回复时用 `waiting`；session 结束不能自动产生 `resolved`。

## 4. Prepare proposal

Proposal 必须包含 action kind、精确 target、正文/参数、依据版本、风险、confidence 与替代动作。默认只准备一个推荐动作和一个合理的“不行动/延后”选项，不制造选择负担。

自我项目引用必须至少提供一种边际价值：复现实现、相关 evidence/benchmark、澄清术语、互操作性，或对方明确请求。否则不为曝光而链接，不索取 star。

## 5. Human decision packet

向用户呈现：

1. `why now`；
2. 已核事实及 unknown；
3. 推荐 proposal 与风险/过期条件；
4. 本轮需要的精确决定：approve、edit、reject、defer 或 dismiss；
5. 明确尚未执行的外部动作。

用户修改正文时保存 proposal→final 的最小 delta；不要只存最终文本。一次 approve/edit 不自动成为以后 auto-send 的偏好。

## 6. Execute and verify

只有当前会话授权覆盖精确副作用时才执行。发送前重读 thread/resource，确认没有新消息或 revision，核对 recipient/target、subject/reply context 与最终正文。每项外部动作只调用一次。

执行后使用 provider readback 验证：

- 邮件：SENT/draft label、message ID、原 thread ID、From/To/Subject；
- GitHub：comment/review/issue/PR ID、repository、commit/PR HEAD 与页面状态；
- 其他 provider：稳定 action/resource ID 与可观察最终状态。

若请求超时或回执不完整，将 effect 记为 `unknown`；先查询 provider 实际状态，禁止盲目重试造成重复副作用。

## 7. Record and hand off

按 `provider_event → attention_item → proposal → human_decision → effect` 保存本轮 trace；无 effect 时明确为 null/not_authorized。先追加 event，再更新 state revision/last_event_id，再更新 registry，最后写 briefing。

Briefing 必须包含来源范围、已做、未做、readback、下一动作和新授权需求。Luna 的最终回报只声明实际验证结果，不自称独立验收。

## Luna 停点

出现下列任一条件即停止外部动作并交回：target/recipient 不唯一；thread/resource 已变化且 proposal 未重做；授权只覆盖 draft 却要求 send；跨项目披露范围不清；合作/代表性承诺；删除、退订、block；可能重复的未知 effect；revision 冲突；需要把 trace promote 为持久规则。
