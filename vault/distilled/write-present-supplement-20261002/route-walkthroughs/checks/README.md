# checks · 走读检查记录

记录日期 2026-10-02。检查者：Opus 5.5 主会话。

| 文件 | 范围 | 结果 |
|---|---|---|
| [routing.json](routing.json) | 每次运行读过的文件（含用 cat、sed 读的）、其中的治理文档、是否碰过禁读目录、是否写过文件 | 十次均未越界、未写文件 |
| [tool-calls.json](tool-calls.json) | 十次运行的工具调用清单 | 原始记录，路径已去掉仓库前缀 |
| [contentcheck.py](contentcheck.py)、[content-check.json](content-check.json) | 每份报告的交付部分里，协议列的必须保留的字串是否逐字都在 | 八份全在。R4-before 少引用行；R1-after2 少 “pushed” 一句和 “normally”，是时态与近义词替换 |

协议 [protocol.md](../protocol.md)冻结时的 SHA-256：`1a09a021b680b02420e98787b5a73bcfbc5fbd0bb133f863d4122c894ae9b462`，2026-10-02 15:02（+0800）。开跑时协议只在会话临时目录里，代理读不到；全部报告回来之后才写进仓库。

token 数取自每次运行结束时的用量通知，没有另存文件。这些检查只证明读了哪些文件、字串是否保留；改得好不好要看报告原文。
