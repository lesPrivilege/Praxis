# Motion · 运动与时间表现

先区分两类任务：

- 界面状态、定位与反馈需要运动：读 [界面运动编排](choreography.md)，处理连续输入、中断、反向与减弱动效；需要判断运动是否必要时回 [运动判断](grammar.md)。
- 文稿要成为视频或动态解释：先在 [Write / Motion](../../publish/video/README.md)确定分镜语义，再读本分支选择视觉运动。

把事件乐谱或规则生成转到软件时，读 [乐谱与时间](score-and-time.md) 或 [规则系统](rule-systems.md)；原作语境、演出自主权和算法可复现性分别保留。

本分支负责表现方式，不维护一套 renderer API。时长、曲线、镜头、材质与动态排印是具体任务的选择，不能把一次答卷的240ms或淡入写成通用值。来源线索见 [C16–C21](../references/composition.md)；已有动态简报仍是项目 specimen。

讲解页和知识片里常见的十种运动（移动、流向、等待、计时等）有一版写成 t 的函数的参考样张，见 [记号、控件与运动](../marks/README.md)；按需取用。

## 研究与实例

- [外部作品与技术卡](../../../../vault/provenance/visual-grammar-external-20260928/cards/README.md)：交互模拟、镜头实验和连续缩放；含 Opus 作品说明及相关工具。页面说明已读，实际媒体与源码运行未验收。

- [Motion ceiling](../../../../vault/distilled/motion-ceiling-20261004/README.md)：按空间、拓扑、因果、界面与声音探索表现方式；含逐源卡与已做的 MC01。部分来源仅核对身份或尚未读取，技术表仍是候选；逐源状态见该研究的来源卡。
- [视觉语法工场](../../../../demos/visual-grammar/README.md)：已有动态作品、各自的输入、运行实现与验收。
- [Write / Motion 的制作记录](../../publish/video/README.md#已有制作与消费记录)：长论证、机制演算与空间表达的选型、实际消费和失败记录。
