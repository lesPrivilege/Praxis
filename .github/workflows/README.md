# 手动发布 workflow

[Praxis Pages](praxis-pages.yml)只有 `workflow_dispatch` 入口。推送、Pull Request、定时任务和其他 workflow 完成事件均不会触发发布。实际发布需要该文件已进入默认分支，再由维护者手动执行。

构建固定读取检出时已提交的 `main`，将实际 SHA 记入任务摘要，由 [构建脚本](../../scripts/build_drift_pages.py)生成专用临时目录。上传范围只包括 Drift 的 `index.html`、`app.js`、`style.css` 和 `.nojekyll`，不使用仓库根目录作为 Pages artifact。

2026-10-05 核对的 GitHub 官方依赖：

| 来源 ID | Action 与版本 | 固定提交 | 用途 |
|---|---|---|---|
| GHA-CHECKOUT | [actions/checkout](https://github.com/actions/checkout) v6 | `d23441a48e516b6c34aea4fa41551a30e30af803` | 读取指定的 main 文件 |
| GHA-CONFIGURE-PAGES | [actions/configure-pages](https://github.com/actions/configure-pages) v5 | `983d7736d9b0ae728b81ab479565c72886d7745b` | 读取已配置的 Pages 元数据 |
| GHA-UPLOAD-PAGES | [actions/upload-pages-artifact](https://github.com/actions/upload-pages-artifact) v4 | `7b1f4a764d45c48632c6b24a0339c27f5614fb0b` | 打包专用静态目录 |
| GHA-DEPLOY-PAGES | [actions/deploy-pages](https://github.com/actions/deploy-pages) v4 | `d6db90164ac5ed86f2b6aed7e0febac5b3c0c03e` | 手动任务内发布 artifact |

版本标签到提交的映射由 GitHub API 核对；Action 源码及运行依赖未做本地快照，本轮未执行远端 workflow。更新 Action 或 runner 时重新核对版本与权限，并做一次手动发布验证。

流程依据为 [GitHub Pages 自定义 workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)及[手动执行说明](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow)，核查日期同上。上述文档仅用于配置本项目的发布链，没有采纳其“上传整个目录”的示例。
