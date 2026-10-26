# 八组系统展项设计卡

2026-10-15。所有尺寸为原生1920×1080；正文至少30px；不使用TTS。消费既有固定快照与第二版来源，不运行AgentScope。与 journey、permission、workspace 共用 V3 接口，系统展项只拥有本文件与 `film/systems.js`。

| 场 | 目标动作与空间论证 | 持续对象 / 三帧 | 动作与停留 | 否决样例 |
|---|---|---|---|---|
| agent · 158s | 从一个可序列化状态展开尾部消息，逐项判定等待 | 左侧同一AgentState；右侧R2/T2。初始字段 → ASKING停留 → 同ID结果补齐 | 字段先固定；尾消息展开；观察他人消息作为分离反例；结果接入后等待线解除。每段14–25s | 只更换“等待/完成”大字，而调用、作者和结果不同时可见 |
| offload · 132s | 旧消息一分为二：摘要进入模型，原件进入文件；recent不动 | 5条旧消息与2条recent → 旧消息压缩、原件向下 → Read沿引用取回片段 | 压缩5s；保存4s；回查4s；其余静读；无offloader支路明确去向 | recent也消失；文件凭空出现；画成每次压缩都默认存盘 |
| sessions · 152s | 两个writer争同一运行权；获锁先于读，持久化先于释放 | W1/W2两条时间线、一枚lease、一份v0→v1状态 | 锁落到W1才画执行；e1先落log再live；写回v1才把锁移至W2。末段保留反例旧v0 | 同时两条执行线；600s画成任务倒计时 |
| background · 154s | 页面断开不跨进程边界；进程退出则task不能继续 | 边界内BG2与watcher、边界外观察者；10s→inbox→锁后续接 | 阈值局部翻转；任务沿进度线继续；结果进入inbox；退出分支擦去执行线、保留虚线registry | 把registry画成可恢复任务；续接硬绑定R2 |
| java-03-execution-targets · 142s | 运行者决定上下文与能力；统一Session观察面不抹平差异 | 三列属性矩阵，只有选中列强调；下面控制台随真实例示capabilities收敛 | 三列依次聚焦；注册→可见→Session→派发四级验证；Managed与Hosted控件局部联动 | 四等大说明卡；将示例available_commands写为所有目标固定能力 |
| java-05-snapshot-sse-cursor · 168s | 同一M1增量追加、completed替换；观察断开仍运行；410重建视图 | 左前端M1/c17、右服务同一Turn；e18进入M1，e19重放去重，c20新快照 | 字符片段4s进入；应用后再cursor；连接断开；服务进展；重放去重；410取快照，不画新Turn | completed再追加；cursor先于apply；重连重新提交任务 |
| java-07-files-artifacts · 140s | 一份文件经实际上传、发布与记录读取成为可下载交付 | 同一review-v3.md在workspace→JS1/JF1→JA1→应用阅读区移动 | 文件沿路径真实移动；JF1/JA1记录原地保留；下载内容在末端展开。Managed16MiB条件固定可读 | Artifact凭路径生成文件；跨Session自动可见；发布即接收 |
| end · 188s | 原材料补件后形成意见；ASK后写出；发布、接收分开；超时查原回执 | 合同纸张与附件B组成依据；同一review-v3.md携结论走完请求链 | 缺口原地留空；补件填缺口；R2/T2停闸；后段明确独立Java交付例；最后另一路E2查询回执 | Python/Java画成共享运行后端；超时直接重写；发布就是业务接受 |

共同运动约束：SVG节点预建，render(t)只根据场内时间重设属性；文本只更新对应对象字段。正向、反向seek相同。p使用V3的power3.inOut；动效服务于具体关系，不使用整层phase切换。来源与教学身份沿第二版；e18/e19/c17等是教学标识，游标不表达算术关系。

事实边界：AgentState JSON不恢复自定义Pydantic validator/default factory；offloader为显式配置；Python600s是锁参数且Redis续租/内存TTL行为不同；10s只用于普通可卸载工具；Java文件16MiB仅Managed Session upload；Hosted checkpoint_restore=false依据固定文档。end中外部回执核对是Kit业务契约设计，不声称AgentScope内置业务去重。

## 施工检查

源码 `node --check` 通过；真实core的56原生状态及逆序PNG比较通过，详见[实际画面回执](../evidence/systems/README.md)。实际查看八场代表帧后修正锁标签/存储注释/后台结果位移/文件接收标签/补件隐藏层。此处只接收组件布局和确定性，不代替整片观看与视觉裁决。
