# 契约

三份 OpenAPI 文件，前端和后端都以它们为准。`*.d.ts` 由它们生成，不手改：

```sh
npm run contract
```

| 文件 | 内容 |
|---|---|
| [work.yaml](work.yaml) | 两个场景共用的部分：谁在操作（User）、能做什么和为什么不能（Affordance、RuleViolation）、请求为什么被拒（Problem）、一次动作尝试的结果（ActionResult、ActionAttempt、Job）、留下的记录（AuditEvent、ObjectRef）、环境（Meta） |
| [matter.openapi.yaml](matter.openapi.yaml) | [事项工作台](../scenarios/matter-workbench.md)，接口在 `/api/matter` |
| [payment.openapi.yaml](payment.openapi.yaml) | [付款复核台](../scenarios/payment-review.md)，接口在 `/api/payment` |

公共部分里的角色、动作类型、对象种类和事件类型都是开放的字符串；每个场景在自己的文件里用 `allOf` 把它们收窄成自己的枚举。这样通用代码按公共类型写，场景代码仍然有穷尽检查。

前端的请求客户端和后端的返回值都用生成的类型，改了契约之后 `npm run typecheck` 会指出两边没跟上的地方。后端每个响应另由测试按契约的 schema 校验，状态码没有声明也算失败（401、500、503 归每个接口的 `default`）。

几处约定值得先知道：

- 动作请求必须带 `Idempotency-Key`，它是这次尝试的身份。同一个 key 再次到达返回首次结果；`GET /action-attempts/{key}` 返回 404 表示后端从未收到，可以原样重发。
- 对象随响应带 `actions`：当前身份能做哪些动作，不能做的附规则、版本和例外找谁。界面按它渲染，不自己判断权限。
- 对象随响应带 `next`：它在等哪一步、由谁负责。界面不自己推断下一责任人。
- 身份由 `X-Demo-Persona` 请求头携带，是演示身份，不是认证：浏览器报什么后端就信什么。`/users` 不需要身份，因为要先从里面挑一个。接真实身份系统时身份要从可信会话取得，这几处都要换。
- 付款复核台的金额是 `{ currency, minor }`，`minor` 是最小货币单位的整数；没有金额是 `null`。按金额筛选必须同时给币种。
