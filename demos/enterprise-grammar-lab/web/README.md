# 前端

一个 React 应用，装着两个工作台。入口 [main.tsx](main.tsx)把它们作为两棵路由树挂上：`/matters` 和 `/reviews`。前端只认识 `/api` 和 [契约](../contracts/README.md)，不知道后面是假后端。

| 目录 | 内容 | 知道哪个场景 |
|---|---|---|
| [api](api/README.md) | 请求的两种失败、一次动作尝试的状态机、演示身份 | 都不知道 |
| [workbench](workbench/README.md) | 工作面：外壳、对象头、面板状态、动作面板、尝试结果、记录时间线、搜索与跳转 | 都不知道 |
| [matter](matter/README.md) | 事项工作台：自己的接口模块、用词、地址和页面 | 只知道自己 |
| [payment](payment/README.md) | 付款复核台：同上 | 只知道自己 |

`Workbenches.tsx` 是左上角切换工作台的下拉，属于这个实验自己的外框，不属于任何一个工作台。`theme.ts` 是颜色和字体唯一的设定处；`app.css` 只管布局，颜色取主题的 CSS 变量。没有内联样式。

加第三个场景要做的事：一份契约，一个 `web/<场景>` 目录（接口模块、用词、地址、页面、路由树），在 `main.tsx` 和 `Workbenches.tsx` 各加一行。`api` 和 `workbench` 不用动，这一点在加第二个场景时还不成立，改了什么见 [第二轮施工发现](../evals/round-2.md)。
