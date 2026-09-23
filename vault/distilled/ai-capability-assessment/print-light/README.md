# print-light

答案（`answer-draft.md`）的轻量 LaTeX 排版测试，用于验证纯 Markdown/LaTeX 渲染能走到什么程度；HTML 页面才是正式交付物。

输入：`../answer-draft.md`（正文与逐句答案）、`../rendered/exhibits.py`（图示内容，改画为表格或列表）、`../public-source-index.md`（来源，合并为每章末的「来源」小字表格）。

编译（xelatex + ctex，两遍）：`cd print-light && xelatex -interaction=nonstopmode -output-directory=<scratch>/latex answer.tex`，再执行一遍同一命令。

原图示均改为表格或缩进列表呈现；Q4 的交互式概率分布仅取其两组构造分布与精确数值表，不含可调节部件。
