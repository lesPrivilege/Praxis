# Remotion 组合

`Root` 注册 `Film`（成片，含配乐）与 `ContactSheet`（审片联络表）。`timeline.ts` 读取 [timeline.json](../timeline.json) 并按事件 id 取时间；`draw.tsx` 是色板、缓动和 SVG 图元；`Film.tsx` 的 `Frame` 是时间 t 的纯函数，成片和联络表共用它。镜头组件见 [scenes/](scenes/README.md)。
