# shared · 实验共用层

本目录只服务本次样张实验，不是 Praxis 主题或 Kit 规范。

- [contract.md](contract.md)：原子划界、五轴词表、标记与 CSS 隔离、索引片段格式。
- [fixtures.md](fixtures.md)：全部样张共用的 synthetic 内容（F0 情境与 S1–S7 压力）。
- `lab.css`：对照用 token 与 gallery chrome；token 是实验默认值，样张可局部改写。
- `index.css`：生成的入口页 `index.html` 的样式。
- `lab.js`：可选的观察控件（舞台宽度、变体堆叠/并排、原子边界显示）与 `?check` 几何检查模式；无 JS 时样张以自然宽度、堆叠顺序完整可读。

字体只用系统字体栈（PingFang SC / Hiragino Sans GB / Noto Sans CJK SC；衬线 Songti SC / STSong / Noto Serif CJK SC），不加载远端资源。缺少这些字体时退化为系统无衬线或衬线，字宽与断行会变化。
