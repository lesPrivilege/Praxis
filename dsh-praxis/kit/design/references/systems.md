# 设计系统与前端参考

查成熟设计系统或前端框架时，借各家的组织方式，品牌、工程栈与版本不照搬。

返回 [Design 参考路由](README.md)。

设计系统可借的是层次：foundations、tokens、components、patterns、accessibility、content 怎样分层，Product UI 与 Brand UI、primitives 与 tokens 怎样分开，企业组件与模板怎样组合。前端框架与 workshop 可借 enterprise shell 与 template→page 的组织、headless 的 provider 边界与逻辑/UI 分离、隔离的 story fixture 与 docs/testing/a11y addons，以及 data-dense grid、桌面工作台的分层控件与 table。

品牌、完整工程栈和电商等领域的对象边界不照搬，desktop-first 的做法不直接套到移动端，provider 名称不当作本仓库的 contract；open-core 的高级能力与许可逐项核对。这些站点随版本变化，引用具体组件、pattern 或 token 前按当前官方页面复核。

## 维护

需要将某个系统的观察提炼为跨项目语法时，先在项目 index 记录实际消费，再按修订流程提出裁决。

已有品牌规范需要让 coding agent 按需查找时，读 [设计资源的包、组件与集成](agent-design-resources.md)；该入口区分同名项目、设计系统包、registry、Skill 和 MCP，不要求安装。
