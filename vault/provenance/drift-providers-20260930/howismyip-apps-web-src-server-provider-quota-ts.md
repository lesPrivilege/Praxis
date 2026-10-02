# Web provider quota source

- 来源：[https://raw.githubusercontent.com/superagents-lab/howismyip/94be3e5c00d857d68150d7b9b026da0887fa0eac/apps/web/src/server/provider-quota.ts](https://raw.githubusercontent.com/superagents-lab/howismyip/94be3e5c00d857d68150d7b9b026da0887fa0eac/apps/web/src/server/provider-quota.ts)
- 固定提交：`94be3e5c00d857d68150d7b9b026da0887fa0eac`
- 本地原件：`vault/provenance/drift-providers-20260930/upstream/apps/web/src/server/provider-quota.ts`
- SHA-256：`79910dc47bcfa830da153030a51b4a01a4423bd8a42287b12eaf7676e31c4772`

Hosted provider budget对缺binding和异常采用fail-open；不应照搬成关键控制。

边界：此卡只支持固定提交中该文件实际写明或实现的内容；不能外推为外部provider的当前服务承诺。
