# 工具

[ledger.py](ledger.py)：把 `../streams/*.json` 与 `../review.json` 合并成 `../sources.json` 与 `../claims.jsonl`，再检查 `jev/draft/*.md` 里每个〔…〕引用的来源或主张 ID 都存在；有缺失时以非零状态退出。

```bash
python3 jev/research/tools/ledger.py
```

只用 Python 标准库。网页的构建脚本在 [site/build.py](../../site/build.py)，它读同一份合并结果。
