# Demo 是项目级 provenance layer

状态：`candidate`。来源为 `6ab72e8e-00f0-83ec-b5e1-1155a6e6c68c`，主要证据是 turn `bbb21788-3902-4716-a917-f3dd97b08935` 与 assistant item `f93acd1a-9f28-4d23-a271-40b4feab49f7`。

## 项目目录候选

对话建议每个 Demo 以项目为单位组织：

```text
demos/<project-slug>/
├── README.md
├── work/
├── outputs/
│   ├── prose/
│   ├── publish/
│   └── motion/
├── assets/
└── refs/
```

`work/` 保存能解释决策或帮助下一次施工的中间产物，例如 argument tree、storyboard、composition、timeline、source→output mapping；不保存 node_modules、render cache、临时帧或一次性 debug output。`outputs/` 记录实际交付结果，按内容表达模式分组；`refs/` 登记外部依赖、角色、使用位置、license、是否有 local copy 与限制。

## README 最小职责

项目 README 应能让后来者回答：Purpose、Inputs、Outputs、关键 Work、使用的 grammar、外部依赖、Reuse 与 Known limitations。Reuse 记录可复用的内容结构、composition、code、motion pattern、renderer 或 QA 方法；Known limitations 防止一次项目经验被误读成普遍规则。

Demo 的职责是保存“做过什么”和“为什么这样做”。这一材料来路、已消费提炼、借用范围与项目自身增量的连接已纳入当前 Demo 准入；只有多个独立 Demo 反复出现且经过稳定 contract 与验证的 pattern，才有资格回到 Kit 候选；项目特例留在 Demo。原 Chat 不进入 Demo 作为规范。
