# 动态简报：Agent 系统设计

把[回答母稿](../answer-draft.md)编译成 96 秒无旁白动态简报。这是文档交付之外的另一种首读形式，母稿仍是可核对的事实来源。属于研究材料，不是已提交的答卷。

| 文件 | 职责 |
|---|---|
| [STORYBOARD.md](STORYBOARD.md) | 论点、视觉系统、配乐弧线与逐镜分镜 |
| [timeline.json](timeline.json) | 唯一时间源：VideoBeat 语义字段、屏幕文字、和弦与声音事件；画面和配乐都从这里读取 |
| [src/](src/) | Remotion + React 组合：`Film`（成片）与 `ContactSheet`（审片联络表）；每个镜头一个组件，画面是时间 t 的纯函数 |
| [score.py](score.py) | 配乐：numpy 合成 pad、低音、拨音脉动与语义音效，输出 `public/score.wav` |
| [out/](out/README.md) | 成片与联络表 |

## 重建

```bash
cd vault/distilled/ai-capability-assessment/motion
npm install
npm run score     # timeline.json -> public/score.wav
npm run sheet     # 先审片：out/contact-sheet.png
npm run render    # out/agent-system-design.mp4
npm run studio    # 在浏览器里逐帧拖动预览
```

改文字或时间只改 timeline.json；改画法改 `src/scenes/`；两者都不需要动配乐代码。改了时间或声音事件后重跑 `npm run score`。

Remotion 首次渲染会下载固定版本的 Chrome Headless Shell 到 `node_modules/.remotion/`。若 Node 的下载器走不通代理，用 curl 取同一 URL 解压到该目录并写入 `VERSION`。Remotion 对个人与小团队免费，公司使用需核对其许可证。

## 审片记录

首版以联络表和全尺寸单帧审阅后修正：Q1 请求框下的游离圆点；约束回到任务状态轨道时被轨道线穿过、读作删除线；Q3 的 unknown 压在钴蓝分支上；Q4 规则轴上 B 标记与阻断线说明、A 与 100% 相撞。迁到 Remotion 后逐镜对照联络表与单帧，画面一致。音频：峰值 −1 dBFS，RMS 约 −16 dBFS，除首尾淡入淡出外，相邻 0.5 秒窗口的电平跳变不超过约 7 dB。

未核实：未在外部播放器和移动端小屏上完整观看；无旁白版本对未读母稿的观众是否足够，未做观众测试。
