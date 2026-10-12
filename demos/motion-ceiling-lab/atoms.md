# 十二个原子候选

> 本页逐字取自交接稿（[快照](../../vault/snapshots/local/motion-ceiling-handoff-20261004/motion-ceiling-handoff-20261004.md) 第 529–683 行），十二条都是候选，没有进 Kit。交接稿写于 main `9514ce4`；此后的变化与本页哪些说法已经过时，见 [README](README.md#交接稿之后变了什么)。

## A01 · 对象锚与空间连续

description：读者跨尺度/遮挡易失去同一对象时使用；输出保留意义的表达和验证。状态candidate，当前没有实现，具体taste由Opus。

- 对象/接口：objectID、父坐标系、参照、当前层级。
- 稳定约束：镜头不改变事实；示意尺度注明；切换后找得到同ID。
- 开放变量：尺度比、镜头路径、锚/标签样式；无需服从参考作品视觉参数。
- 正常fixture：进入新层级仍找回req-1。
- 失败fixture：遮挡后ID丢失/同名对象误合并。
- 最小交付/验证：连续进入返回片段+ID日志+静态层级图；说明观察模式与未覆盖范围。
- 消费/来源：MC01；W12，R08待核；作品证据可从来源登记（源仓相对路径：`../../../vault/provenance/motion-ceiling-20261004/works.md`）回查。接口细节取合同（源仓相对路径：`../contracts.md`）。
- 退出：若问题不成立或只增加装饰，留项目局部/删除；知识准入看真实需求/复用/入口/行为/验证，共享实现另守三场景规则。

## A02 · 拓扑与身份对应

description：形变/拆合被误读为同一对象时使用；输出保留意义的表达和验证。状态candidate，当前没有实现，具体taste由Opus。

- 对象/接口：paths/孔洞、objectIDs、split/merge关系、labels。
- 稳定约束：明确对应；无对应不能静默morph；最终关系可读。
- 开放变量：路径点序、形变方法、阅读停顿；无需服从参考作品视觉参数。
- 正常fixture：owner边变reviewer边且对象不换。
- 失败fixture：one-to-many/孔洞/点序翻转。
- 最小交付/验证：正常与不兼容path过渡+最终语义图；说明观察模式与未覆盖范围。
- 消费/来源：MC02；W03/W14代码；作品证据可从来源登记（源仓相对路径：`../../../vault/provenance/motion-ceiling-20261004/works.md`）回查。接口细节取合同（源仓相对路径：`../contracts.md`）。
- 退出：若问题不成立或只增加装饰，留项目局部/删除；知识准入看真实需求/复用/入口/行为/验证，共享实现另守三场景规则。

## A03 · 文本测量与排版接力

description：字/图同时动时读者漏掉论断时使用；输出保留意义的表达和验证。状态candidate，当前没有实现，具体taste由Opus。

- 对象/接口：tokens、labelBounds、readOrder、focus。
- 稳定约束：可复制文本；长标签不截关键信息；图与文本ID相联。
- 开放变量：字重/字形/编舞/布局/停留；无需服从参考作品视觉参数。
- 正常fixture：中文长label变化仍完整可读。
- 失败fixture：字体未就绪/2倍长文/窄屏重排。
- 最小交付/验证：font-ready记录+长文/窄屏片段+语义HTML；说明观察模式与未覆盖范围。
- 消费/来源：MC02/05；W03代码；作品证据可从来源登记（源仓相对路径：`../../../vault/provenance/motion-ceiling-20261004/works.md`）回查。接口细节取合同（源仓相对路径：`../contracts.md`）。
- 退出：若问题不成立或只增加装饰，留项目局部/删除；知识准入看真实需求/复用/入口/行为/验证，共享实现另守三场景规则。

## A04 · 中断与业务状态分离

description：倒放/重击造成误显示保存成功时使用；输出保留意义的表达和验证。状态candidate，当前没有实现，具体taste由Opus。

- 对象/接口：truthState、pose、input、transition、eventVersion。
- 稳定约束：取消运动不取消业务；过渡接当前pose；late事件按版本处理。
- 开放变量：easing/时长/合并输入策略；无需服从参考作品视觉参数。
- 正常fixture：pending中再点击衔接新状态。
- 失败fixture：lateACK覆盖新版本/按时间伪成功。
- 最小交付/验证：真实UI操作log+连续中断片段+最终state；说明观察模式与未覆盖范围。
- 消费/来源：MC04；W12有限互动；作品证据可从来源登记（源仓相对路径：`../../../vault/provenance/motion-ceiling-20261004/works.md`）回查。接口细节取合同（源仓相对路径：`../contracts.md`）。
- 退出：若问题不成立或只增加装饰，留项目局部/删除；知识准入看真实需求/复用/入口/行为/验证，共享实现另守三场景规则。

## A05 · 事件时间与叙事时间

description：scroll/seek把历史状态看成当前事实时使用；输出保留意义的表达和验证。状态candidate，当前没有实现，具体taste由Opus。

- 对象/接口：eventTime、storyTime、progress、truthTime。
- 稳定约束：单位显式；映射可逆或注明不可逆；倒放为历史视图。
- 开放变量：章节窗口/曲线/scroll输入映射；无需服从参考作品视觉参数。
- 正常fixture：改进度只变历史观看位置。
- 失败fixture：逆scroll撤销真实写入/丢失时区。
- 最小交付/验证：映射表+双向输入+历史/当前标记；说明观察模式与未覆盖范围。
- 消费/来源：MC01/06；W10时间线；作品证据可从来源登记（源仓相对路径：`../../../vault/provenance/motion-ceiling-20261004/works.md`）回查。接口细节取合同（源仓相对路径：`../contracts.md`）。
- 退出：若问题不成立或只增加装饰，留项目局部/删除；知识准入看真实需求/复用/入口/行为/验证，共享实现另守三场景规则。

## A06 · 干预与守恒比较

description：好看粒子被读成证明因果时使用；输出保留意义的表达和验证。状态candidate，当前没有实现，具体taste由Opus。

- 对象/接口：initialState、baseline、intervention、unit、ledger。
- 稳定约束：同初态；单变量；累计守恒；装饰不充当量值。
- 开放变量：流表达、粒子/图表、模型步长；无需服从参考作品视觉参数。
- 正常fixture：降容量后积压且排空有滞后。
- 失败fixture：容量0/掉帧/输入丢弃未计账。
- 最小交付/验证：数值ledger+paired run+误读反例；说明观察模式与未覆盖范围。
- 消费/来源：MC03；W13原视频抽帧+代码；作品证据可从来源登记（源仓相对路径：`../../../vault/provenance/motion-ceiling-20261004/works.md`）回查。接口细节取合同（源仓相对路径：`../contracts.md`）。
- 退出：若问题不成立或只增加装饰，留项目局部/删除；知识准入看真实需求/复用/入口/行为/验证，共享实现另守三场景规则。

## A07 · 模拟检查点与寻址

description：随机seek假装可倒推stateful模拟时使用；输出保留意义的表达和验证。状态candidate，当前没有实现，具体taste由Opus。

- 对象/接口：seed、fixedStep、checkpoint、reset/restore。
- 稳定约束：pure-time与stateful分开；同设备重复；跨GPU容差。
- 开放变量：检查点频率/存储/fastforward；无需服从参考作品视觉参数。
- 正常fixture：重置→目标t与restore→目标t可比。
- 失败fixture：负dt/不定帧dt/reordered blur。
- 最小交付/验证：重复seek状态diff+连续播放+成本记录；说明观察模式与未覆盖范围。
- 消费/来源：MC03/05；W10源码；作品证据可从来源登记（源仓相对路径：`../../../vault/provenance/motion-ceiling-20261004/works.md`）回查。接口细节取合同（源仓相对路径：`../contracts.md`）。
- 退出：若问题不成立或只增加装饰，留项目局部/删除；知识准入看真实需求/复用/入口/行为/验证，共享实现另守三场景规则。

## A08 · 真实声音事件映射

description：均匀BPM/字幕猜时间伪装同步时使用；输出保留意义的表达和验证。状态candidate，当前没有实现，具体taste由Opus。

- 对象/接口：audioHash、tempoSegments、eventUnits、tokenRanges、offset。
- 稳定约束：音频版本匹配；低confidence不伪精确；静音仍传信息。
- 开放变量：编曲/表达/effects/tempo/字幕节奏；无需服从参考作品视觉参数。
- 正常fixture：tempo改变后事件重新映射。
- 失败fixture：音轨替换/offset漂移/字幕长两倍。
- 最小交付/验证：3跨章同步时点+全片听审范围+分轨/字幕；说明观察模式与未覆盖范围。
- 消费/来源：MC05；W07/W10代码；作品证据可从来源登记（源仓相对路径：`../../../vault/provenance/motion-ceiling-20261004/works.md`）回查。接口细节取合同（源仓相对路径：`../contracts.md`）。
- 退出：若问题不成立或只增加装饰，留项目局部/删除；知识准入看真实需求/复用/入口/行为/验证，共享实现另守三场景规则。

## A09 · 章节接力与镜头论断

description：镜头炫技遮蔽论证或重复fade时使用；输出保留意义的表达和验证。状态candidate，当前没有实现，具体taste由Opus。

- 对象/接口：sceneIDs、question、enters/exits、sharedObjects。
- 稳定约束：每章回答/推进问题；共享对象有接力；camera不证明因果。
- 开放变量：章数/时长/剪辑/构图/媒介；无需服从参考作品视觉参数。
- 正常fixture：误会→证据→修正成为完整故事。
- 失败fixture：章间身份丢失/镜头裁掉限制条件。
- 最小交付/验证：完整输出+逐章论断/接力表+受众复述；说明观察模式与未覆盖范围。
- 消费/来源：MC05/06；W08/W10文字代码；作品证据可从来源登记（源仓相对路径：`../../../vault/provenance/motion-ceiling-20261004/works.md`）回查。接口细节取合同（源仓相对路径：`../contracts.md`）。
- 退出：若问题不成立或只增加装饰，留项目局部/删除；知识准入看真实需求/复用/入口/行为/验证，共享实现另守三场景规则。

## A10 · 混合媒体与真实UI身份

description：模拟UI/别人的capture被当真实操作时使用；输出保留意义的表达和验证。状态candidate，当前没有实现，具体taste由Opus。

- 对象/接口：assetProvenance、captureKind、actionID、stateID、time。
- 稳定约束：同版本源；许可分项；不读取私密材料；不伪生产集成。
- 开放变量：overlay/镜头/媒介比例；无需服从参考作品视觉参数。
- 正常fixture：synthetic-app录屏可重做同state。
- 失败fixture：placeholder数字/旧版本clip/仅成功toast。
- 最小交付/验证：操作log+capture源hash+素材许可清单；说明观察模式与未覆盖范围。
- 消费/来源：MC04/06；R12–14未视觉验；作品证据可从来源登记（源仓相对路径：`../../../vault/provenance/motion-ceiling-20261004/works.md`）回查。接口细节取合同（源仓相对路径：`../contracts.md`）。
- 退出：若问题不成立或只增加装饰，留项目局部/删除；知识准入看真实需求/复用/入口/行为/验证，共享实现另守三场景规则。

## A11 · 读者通道与可访问降级

description：空间/声音/指针成为唯一信息入口时使用；输出保留意义的表达和验证。状态candidate，当前没有实现，具体taste由Opus。

- 对象/接口：semanticHTML、keyboard、captions、reduced/noGPU modes。
- 稳定约束：信息等价；焦点/读序；停播和静音；减动不只缩短tween。
- 开放变量：静态/步进/小模型/预渲染替代；无需服从参考作品视觉参数。
- 正常fixture：noGPU仍读到关系与操作结果。
- 失败fixture：keyboard困住/降级移除证据/只一处reduce。
- 最小交付/验证：同fixture不同模式对照+手动操作范围；说明观察模式与未覆盖范围。
- 消费/来源：所有MC；W12局部边界；作品证据可从来源登记（源仓相对路径：`../../../vault/provenance/motion-ceiling-20261004/works.md`）回查。接口细节取合同（源仓相对路径：`../contracts.md`）。
- 退出：若问题不成立或只增加装饰，留项目局部/删除；知识准入看真实需求/复用/入口/行为/验证，共享实现另守三场景规则。

## A12 · 采样与版本验收

description：2静帧/新代码被当整片已成熟时使用；输出保留意义的表达和验证。状态candidate，当前没有实现，具体taste由Opus。

- 对象/接口：codeCommit、mediaVersion、frameSamples、playbackRange、interactionLog。
- 稳定约束：静帧/解码/连续/交互分开；输出版本一致；ghosting另验。
- 开放变量：采样率/渲染档/压缩/资源计划；无需服从参考作品视觉参数。
- 正常fixture：连续过渡与抽帧共同确认。
- 失败fixture：旧影片/新代码、25/75%帧漏错、blur双影。
- 最小交付/验证：原件hash+观察模式+连续失败段+重渲染；说明观察模式与未覆盖范围。
- 消费/来源：所有MC；W03/W10/W13；作品证据可从来源登记（源仓相对路径：`../../../vault/provenance/motion-ceiling-20261004/works.md`）回查。接口细节取合同（源仓相对路径：`../contracts.md`）。
- 退出：若问题不成立或只增加装饰，留项目局部/删除；知识准入看真实需求/复用/入口/行为/验证，共享实现另守三场景规则。
