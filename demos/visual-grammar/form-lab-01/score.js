window.VG_SCORE = {
  "score_id": "form-lab-01-score",
  "revision": "20260929-r1",
  "placeholder_data": true,
  "note": "形式优先的实验。词语与记录只是占位，不承担业务论证；节拍网格是作者事件（authored），画面与声音都从这里读取。",
  "bpm": 120,
  "duration": 64,
  "sections": [
    { "id": "void",     "t0": 0,  "t1": 4,  "label": "虚空",     "technique": "Canvas 2D · 单点与次低频" },
    { "id": "glyph",    "t0": 4,  "t1": 16, "label": "粒子排印", "technique": "WebGL2 instanced points · 160,000" },
    { "id": "cloud",    "t0": 16, "t1": 24, "label": "点云空间", "technique": "同一批粒子 · 透视轨道镜头" },
    { "id": "monolith", "t0": 24, "t1": 36, "label": "距离场建筑", "technique": "GLSL raymarching · SDF 柱廊" },
    { "id": "droste",   "t0": 36, "t1": 44, "label": "无限缩放", "technique": "对数螺旋 Droste · 文字环图集" },
    { "id": "slit",     "t0": 44, "t1": 52, "label": "时间切片", "technique": "slit-scan 位移 · RGB 分离 · 切片错位" },
    { "id": "flow",     "t0": 52, "t1": 60, "label": "流场",     "technique": "instanced lines · 解析流场拖尾" },
    { "id": "collapse", "t0": 60, "t1": 64, "label": "塌缩",     "technique": "粒子归点 · 黑场" }
  ],
  "words": ["事件", "状态", "上下文", "投影", "证据", "决定"],
  "slit_phrase": "只随已生效事件变化",
  "flow_word": "形式",
  "morphs": [
    { "t0": 4.0,  "t1": 5.6,  "to": "cloud" },
    { "t0": 6.0,  "t1": 7.8,  "to": "word:0" },
    { "t0": 9.5,  "t1": 11.0, "to": "word:1" },
    { "t0": 12.5, "t1": 14.0, "to": "word:2" },
    { "t0": 15.2, "t1": 17.6, "to": "helix" },
    { "t0": 51.0, "t1": 52.0, "to": "field" },
    { "t0": 56.0, "t1": 58.6, "to": "flow_word" },
    { "t0": 60.0, "t1": 62.4, "to": "point" }
  ],
  "helix_accents": [9, 23, 37],
  "bass_roots_midi": [38, 34, 41, 36],
  "kick": { "from": 4, "to": 60, "half_time": [[36, 44]] },
  "clap_sections": ["cloud", "monolith", "slit"],
  "hat_sections": ["monolith", "slit", "flow"],
  "pad_sections": ["glyph", "droste", "flow"],
  "impacts": [4, 16, 24, 36, 44, 52, 60]
};
