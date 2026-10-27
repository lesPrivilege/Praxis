# 安装与运行

需要 Node 22.20 或更新：core 用到的 `fs.globSync` 与 `path.matchesGlob` 自这一版起都是稳定 API。包没有 npm 依赖。下文的 `<包>` 指包目录的绝对路径。

## 取得包

检出的目录可以直接使用。要单独分发时，在包目录运行 `npm pack`，得到 `dsh-praxis-<版本>.tgz`；包的内容由 `package.json` 的 `files` 决定：代码、Kit、schemas、控制面页面、语言包与说明，不含 `data/`。

## DSH 插件

```bash
dsh plugin --profile <profile> add link:<包>
# 或装打包文件
dsh plugin --profile <profile> add /path/to/dsh-praxis-<版本>.tgz
```

`link:` 指向目录本身；打包文件会复制一份进 profile。装完重启 DSH 才会加载插件，profile 由桌面应用管理时重启桌面应用。插件代码更新后同样要重启：`praxis_entry` 的结果带 `reload` 时，宿主还在运行旧代码。

插件给 agent 会话注册 worker 用的 11 个工具：`praxis_entry`、`praxis_resolve`、`praxis_unit`、`praxis_search`、`praxis_catalog`、`praxis_source`、`praxis_capture`、`praxis_curate`、`praxis_consume`、`praxis_projects`、`praxis_project`。维护名册、预设与产物的其余工具在控制面、命令行与 MCP。

插件配置写在 profile 的 `cordis.patch.yml`：

```yaml
- id: praxis
  config:
    data: /path/to/praxis-data   # 数据根；省略时按下文的顺序解析
    prompt: false                # 不在系统提示里加入口段
```

## MCP

MCP 服务走 stdio，提供全部工具，以及：
- **resources：** `praxis://entry`、每个单元（`praxis://unit/<单元 ID>`），来源与产物按模板读取（`praxis://source/{id}`、`praxis://artifact/{id}`）；来源只给链接、定位与用途，不给原件；
- **prompts：** 每个任务类型一条，参数 `brief`（这次要做什么）与可选的 `pipeline`。

服务的 instructions 写明取用顺序。在 agent 的 MCP 配置（如 `.mcp.json`）里登记：

```json
{
  "mcpServers": {
    "praxis": {
      "command": "node",
      "args": ["<包>/adapters/mcp.js"],
      "env": { "PRAXIS_DATA": "/path/to/praxis-data" }
    }
  }
}
```

`env` 可以省略，省略时与 DSH 插件按同一顺序解析数据根。DSH 用了非默认的 `DSH_HOME` 时，给 MCP 设同样的 `DSH_HOME`，或用 `PRAXIS_DATA` 指向同一个数据根。

## 命令行与独立网页

```bash
node <包>/adapters/cli.js help                     # 列出工具
node <包>/adapters/cli.js resolve '{"task_type":"technical-explainer"}'
node <包>/adapters/cli.js serve [端口]              # 控制面，默认 http://127.0.0.1:7878/
node <包>/adapters/cli.js export [archive.tar.gz]  # 备份，见下文
```

工具名可省略 `praxis_` 前缀，参数是一个 JSON 对象。失败时退出码为 1。Node 24.14、25.4 或更新时，命令行与 MCP 对照上游检查来源时经 `HTTP_PROXY`、`HTTPS_PROXY` 出网；DSH 插件沿用宿主的网络设置。

## 数据根

数据根按以下顺序确定：DSH 插件配置里的 `data`；环境变量 `PRAXIS_DATA`；包旁的 `data/` 目录（存在时）；`$DSH_HOME/dsh-praxis`（未设 `DSH_HOME` 时为 `~/.dsh/dsh-praxis`）。

数据根里的 `settings.json` 可以写两项，路径都相对数据根：

| 项 | 含义 | 省略时 |
|---|---|---|
| `base` | 记录里相对路径的起点，通常是一个仓库的根 | 包内 Kit 页仍写 `kit/…`，其余路径一律存绝对路径 |
| `snapshots` | refresh 带 `keep` 时另存快照的目录 | 数据根下的 `snapshots/` |

```json
{ "base": "../..", "snapshots": "../../vault/snapshots/praxis-captures" }
```

记录里的路径分三种：包内 Kit 页写 `kit/…`；`base` 下的文件写相对路径；其余写绝对路径。

## 从空名册开始

新安装的名册是空的，分类随 Kit 就位：Kit 的每一层，以及层下每个带 README 的目录。下面以命令行为例；agent 经 MCP 或 DSH 调用同名工具，参数相同。

1. **看入口：** `entry` 列出常驻单元、各层入口与任务类型。
2. **登记来源：** `capture` 一次登记一批，`task` 写明为哪件任务收录；还没想好挂到哪一页时用 `category` 归到层或区域。作品集、组件库这类集合，用 `members.pattern` 给出成员链接的 URL 模式。
   ```bash
   node <包>/adapters/cli.js capture '{"task":"缓存讲解页的版式参考","sources":[{"url":"https://example.org/gallery/","title":"长文版式作品集","summary":"一组长文页面作品，可比较标题区与正文栏宽。","read_scope":"看过列表页","limits":"只看了列表","revisit_when":"每月","category":"design/composition","members":{"pattern":"https://example.org/gallery/items/*.html"}}]}'
   ```
3. **挂到单元：** `curate` 新建挂载，`expected_revision` 填 0，`description` 写这个来源对这一页有什么用。
   ```bash
   node <包>/adapters/cli.js curate '{"binding":"praxis:<slug>@kit/design/composition/layout.md","expected_revision":0,"description":"做长文页时打开，比较标题区与窄栏的比例。"}'
   ```
4. **接入来源包：** 已有自己来源登记的项目，用 `register_index` 按引用接入，文件留在原处，Praxis 只读不写。`format` 为 `index` 时用 `fields` 把名册字段对到项目的字段名；为 `registry` 时读 Praxis registry 格式的文件。
   ```bash
   node <包>/adapters/cli.js register_index '{"id":"my-research","path":"/path/to/research/sources.json","list":"sources","title":"调研来源","purpose":"某专题逐条事实的核对与引用","fields":{"id":"id","title":"title","url":"url","summary":"notes"}}'
   ```
5. **登记项目：** 产物只能登记在已登记项目的目录里。`standard` 模板约定 `draft/**` 放底稿、`build/**` 放中间产物、`out/**` 放最终产物、`evidence/**` 放验收回执、`tmp/**` 放临时文件。
   ```bash
   node <包>/adapters/cli.js project '{"expected_revision":0,"root":"/path/to/work","title":"缓存讲解页","purpose":"讲清缓存系统","template":"standard"}'
   ```
6. **交付：** `consume` 记下读过的单元与来源，并把交付的文件登记为产物。

之后 `upkeep` 列出需要人处理的事，通常为空：
- 挂载与编目：review 待改、来源变了或链接失效；
- 来源：编目放不下（没有形态，或既无 Kit 分类也未挂到页面）；集合在上游新增或下线了成员；
- Kit 修订：与包内更新后的原页冲突；
- 产物：文件找不到、最新版 review 待改，或交付物放错位置。

交付后所用单元又改过的运行、项目里未登记的最终产物，分别在运行记录与项目上标出，不进 upkeep：再交付之前，它们不等人处理。

## 备份与恢复

```bash
node <包>/adapters/cli.js export praxis-state.tar.gz
node <包>/adapters/cli.js check praxis-state.tar.gz
node <包>/adapters/cli.js restore praxis-state.tar.gz [--force]
```

`export` 把数据根打成一个带 hash 清单的包；快照目录在数据根之外时一并打入。省略文件名时为 `praxis-state-<日期>.tar.gz`。来源包的文件与产物文件留在各自主人那里，不进备份。`check` 解开并逐个核对 hash；`restore` 先做同样的核对，本地内容不同的文件列为冲突、不覆盖，加 `--force` 才覆盖。

## 发布前检查

在源码目录里运行 `npm test` 与 `npm run walkthrough`；测试与走查脚本不随包发布。走查只复制 `npm pack` 会发布的文件，给一个空的 DSH home 和一个空工作目录，经 MCP 走一遍入口、按任务取用、登记集合与成员、挂载、登记项目、交付底稿与成品、记下运行，再改动上游的集合，检查 upkeep 提出名册的修订；同时检查包内 Markdown 的链接都留在包内。输出一份 JSON，有检查不通过时退出码为 1。

发布由维护者执行。
