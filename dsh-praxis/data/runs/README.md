# 运行记录

`praxis_consume` 每次写一个文件，文件名是日期加短 hash。`praxis_stale` 拿这些记录里的单元版本、挂载 revision 与来源快照跟当前比较，列出可能要重看的交付；`praxis_source` 由这些记录给出读过某个来源的运行。
