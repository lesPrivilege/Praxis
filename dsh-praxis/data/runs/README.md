# 运行记录

`praxis_consume` 每次写一个文件，文件名是日期加短 hash。`praxis_stale` 拿这些记录里的单元版本和挂载 revision 跟当前比较，列出可能要重看的交付。
