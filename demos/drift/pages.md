# Drift · Praxis Pages 发布

日期：2026-10-05。已选用 GitHub Pages；公网观测 API 按独立契约后续接入。当前发布包是现有六项合成演示，真实本机版本继续由 Python 服务提供。

## 发布状态

仓库 `lesPrivilege/Praxis` 的 Pages 已设置为 `build_type: workflow`，预定地址为 `https://lesprivilege.github.io/Praxis/`。本次配置后 GitHub 返回 `status: null`，尚未部署页面内容。此前 Actions workflow 数量为 0，未发现可停用的自动部署 workflow。

新增 [手动发布 workflow](../../.github/workflows/praxis-pages.yml)只接受 `workflow_dispatch`。推送、合并或定时任务不会发布。该文件及构建代码进入默认分支后，维护者从 GitHub Actions 选择 **Publish Praxis Pages (manual)**，使用 `main` 手动执行。

workflow 固定构建实际检出时已提交的 `main`，将检出 SHA 记入任务摘要；本机工作区里的未提交改动不会进入发布版本。此次未提交、未执行远端 workflow、未上传静态内容。

## 静态产物

[构建脚本](../../scripts/build_drift_pages.py)只输出：

| 文件 | 内容 |
|---|---|
| `index.html` | 当前页面结构，在产物内增加显式静态标记 |
| `app.js` | 当前交互；有静态标记时进入演示模式 |
| `style.css` | 已接受的 Opus 样式与后续最小修复 |
| `.nojekyll` | 静态发布标记 |

原 `index.html` 保持本机入口。静态页默认选择演示样本，禁用本机实测切换，首开不请求 `/api`。相对资源路径支持 `/Praxis/` 子路径。后端、测试、证据、Kit、Vault 和私有记录不进入 artifact。

从仓库根目录构建到独立的临时输出目录：

```sh
drift_pages_dir="$(python3 -c 'from pathlib import Path; import tempfile; print(Path(tempfile.mkdtemp(prefix="drift-pages-")).resolve())')"
python3 scripts/build_drift_pages.py --output "$drift_pages_dir"
PYTHONDONTWRITEBYTECODE=1 python3 scripts/verify_drift_pages.py
```

输出目录须为空或尚未创建，并使用规范绝对路径；脚本拒绝符号链接路径，包括 macOS 上的 `/tmp`、`/var` 别名。上面的命令先生成规范临时目录。脚本同时拒绝危险输出目录和非本次产物，避免覆盖源码或把额外文件上传。验证覆盖静态文件白名单、真实 `/Praxis/` 路径加载、演示交互、禁用实测及零 API／外部探测；无静态标记的本机版本另用原回归验证。

2026-10-05 验证通过：静态产物在 `1440×1000` 与 `390×844` 的 `/Praxis/` 子路径加载 CSS／JS 成功，样本 B／C、五个视图、显隐与相对首页链接正常；API 请求、外部探测及非预期浏览器错误均为 0。危险目录、符号链接、非空输出、坏 HTML、额外后端／state 文件排除及四源文件稀疏检出均有检查。无静态标记的本机合成回归同样在两宽通过。Astra 已完成源码和实际截图验收；JavaScript、workflow 手动入口与仓库一致性检查通过。

## 公网观测 API

后续由 Astra 按字段契约串行接入 Cloudflare、Google、Anthropic 的实际观测。GitHub Pages 提供前端，独立 API 返回它所测得的值、来源和时间。当前合成演示不作为公网真实采集完成的证明。

公网 API 的地址、允许访问的 Pages origin、字段白名单、发送范围、配额与访客历史隔离须先确定。现有 Python 同源 API 和本机字段不直接迁成共享公网服务。

## 核查边界

GitHub 配置由 REST API 创建并重新读取确认，流程依据为[官方 Pages API](https://docs.github.com/en/rest/pages/pages#create-a-github-pages-site)。Action 版本与未快照依赖见[workflow 说明](../../.github/workflows/README.md)。远端部署运行、Pages 实际 HTTP 页面、Worker 接入及公网真实观测尚未验证。
