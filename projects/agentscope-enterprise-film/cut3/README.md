# AgentScope · 第三版视觉修订

47场覆盖原53主题，62:19；原生1920×1080、24fps、H.264、无音轨。

- [完整舞台](film/index.html)，本地成片 `out/agentscope-enterprise-cut3.mp4`。
- [11:02核心样段](proof/film/index.html)，本地视频 `proof/out/agentscope-visual-proof.mp4`。
- [详尽阅读稿](../reading-v2.html) · [原生双画幅封面](covers/README.md)。
- [设计与审阅](design/README.md) · [验收与范围](evidence/README.md)。

修订保留原来源研究与固定版本。原生SVG对象承接消息增量、权限停泊与放行、目录共用/隔离、游标追加/去重以及回执核对；去掉旧版统一lead和PM色块。工具、计划、检索与身份用具体小输入，避免把四个概念换位置当机制图。旧版与研究仍在 [项目](../README.md)。

## 重建

在Praxis工作树根目录，使用现有依赖，不安装：

```bash
python3 projects/agentscope-enterprise-film/script/compile_cut3.py
python3 projects/agentscope-enterprise-film/cut3/calibrate_motion.py
export PRAXIS_FILM_ROOT="$PWD/demos/agentscope-enterprise-film/cut3"
python3 projects/agentscope-enterprise-film/build/screen_text.py
python3 projects/agentscope-enterprise-film/cut3/check_states.py
python3 projects/agentscope-enterprise-film/build/render.py --workers 4 --preset ultrafast --name agentscope-enterprise-cut3
python3 projects/agentscope-enterprise-film/script/chapter_video.py "$PRAXIS_FILM_ROOT/out/agentscope-enterprise-cut3.mp4"
python3 projects/agentscope-enterprise-film/build/check.py "$PRAXIS_FILM_ROOT/out/agentscope-enterprise-cut3.mp4" --samples 94
```

`--proof`编译四场核心样段，媒体root改指`cut3/proof`，片名用`agentscope-visual-proof`。编译会恢复由场景及read-holds输入定义的时长；随后运动校准将实际可见几何/透明度/文字变化区间与声明窗口求并，避免编码复用停在动作中途。五处密集结果页只增加静读驻留，所有动作保持1倍速度。
