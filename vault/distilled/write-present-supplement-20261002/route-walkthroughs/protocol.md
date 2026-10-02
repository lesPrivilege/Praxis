# 四条取用路线的前后走读协议

冻结时间：2026-10-02，改入口之前、任何代理开跑之前。四个任务取自 [架构校订补充](../../../snapshots/local/write-present-supplement-20261002/praxis-write-present-architecture-supplement.md)的“四条取用路线”，内容由主会话撰写，均为合成。

## 要回答什么

入口调整之后，消费者到达可执行规则要读的东西是否变少，无关分支是否不再被加载，产出是否仍然守住内容。同一任务在改动前后各跑一次，任务书逐字相同。

每个任务只跑一次，Sonnet 5.5，只读，从仓库根 `AGENTS.md` 起步，不得打开 `vault/snapshots` 与 `vault/archive`。任务书只要求报告打开的文件、做过的搜索、产出和引用的仓库原句。

## 任务与开跑前写下的预期

### R1 英文排障说明改写，命令原样

需求：把这段英文排障说明改得更清楚，命令保持原样。只给改后的文本和一张修改表。

```
## Sync fails with error 409

If the sync job stops with `409 Conflict`, the local index is ahead of the server. This happens only when two devices pushed within the same minute. Do not delete the `.sync/` folder, it holds unsent changes.

To fix it you should basically just run the reset command and then it will work again:

    syncctl index reset --keep-unsent

After that is done, you can run `syncctl push` and normally the error should be gone. If it's still there after two tries, contact support and attach `~/.sync/logs/last.json`.
```

守住：五处代码与路径逐字不变（`409 Conflict`、`.sync/`、`syncctl index reset --keep-unsent`、`syncctl push`、`~/.sync/logs/last.json`）；“只在两台设备同一分钟内推送时发生”“不要删除”“两次之后联系支持”都在；“normally”这一层不确定没有被改成肯定。

路线预期：进 Write 的成文分支，取证据底线和审阅里的不可损失项。不把中文成文原理当作英文文本的规则来套；不读 Publish、Design、Motion。

### R2 备忘录改成 5 分钟现场幻灯片，保留风险条件

需求：把这份备忘录改成 5 分钟现场汇报用的幻灯片。给每页的标题和页面内容，不用做设计。风险条件要保留。

```
关于迁移客服知识库的建议

建议在11月把客服知识库从自建系统迁到托管服务，先迁英文区，中文区推迟到明年一季度。

理由：自建系统过去三个月宕机4次，累计7.5小时；托管服务同期在试点团队的可用率为99.95%（样本只有一个团队、六周）。迁移后每月费用从约1.2万元升到约2.1万元。

条件：只有在托管服务通过数据驻留审查后才能迁中文区，审查结果预计12月中旬出，目前未知。

不同意见：运维负责人认为宕机主要来自一次配置失误，修复后自建系统可以再用一年；这一点还没有复盘数据支持或否定。

需要决定：是否批准11月迁英文区，预算增加每月约0.9万元。
```

守住：4次、7.5小时、99.95%、一个团队、六周、1.2万、2.1万、0.9万、12月中旬、未知、11月；样本限制、驻留审查条件、不同意见都在页面上，条件出现在请求决定之前或同页；说明这是改编，列出删改了什么。

路线预期：Reporting 或 Write 入口 → Publish 的内容编排 → 共享证据。不读 Motion；Design 至多读编排一页。

### R3 仪表板图表的尺度、比较与刷新动画

需求：检查这张图的尺度、比较方式和刷新动画，告诉我要改什么、为什么。

```
仪表板上有一张“每周工单量”柱状图：纵轴从 400 起，A 组本周 520、上周 480，B 组本周 455、上周 470。数据每小时刷新一次，刷新时柱子从旧值平滑长到新值，同时两组按当前值重新排序。周三的数据缺失，目前显示为 0。
```

守住：指出柱状图纵轴不从零起会夸大差异；缺失不能显示为 0；平滑生长会让人以为有中间实测值，或与重新排序同时发生时难以分辨；减少动效时仍能看懂变化。数值 520、480、455、470 不被改动。

路线预期：Design 的图形编码与运动判断。不读 Write 的成文与编排分支。

### R4 只规范中文 Markdown 的空格与标点

需求：只规范这段 Markdown 的空格和标点（中英文之间、全角半角），代码和引用原样保留，别的都不要动。给改后的文本和 diff。

```
## 安装步骤

1.先安装Node 18以上版本,然后运行`npm install`。
2.配置文件在 `config/app.yaml` ,其中`timeout`默认是30秒 。
3.如果报错"ECONNRESET",请重试(最多3次)。

> 原文引用:"the server may close idle connections after 30s".

说实话，这一步其实非常简单，大家不用担心。
```

守住：三处行内代码逐字不变；引用行逐字不变；最后一句逐字不变，不因为像套话就删改；用词不变，只动空格和标点；给出 diff。

路线预期：不需要成文原理。改动前仓库里没有只改格式的入口，预计会读成文原理；改动后预计在入口处就停下。

## 记什么

| 项 | 来源 |
|---|---|
| Read 次数、读过的文件 | 工具日志 |
| 是否读了仓库治理文档（Kit 使用约定、架构、入账规范） | 工具日志 |
| 是否读了预期之外的分支 | 工具日志 |
| 守住的内容是否都在 | 脚本逐字检查加人工看 |
| 用了多少 token | 任务通知 |

每个任务前后各一次，差别只能当线索。前一轮结果原样保留。
