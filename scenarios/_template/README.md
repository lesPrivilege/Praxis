# Scenario contract template

状态：模板，不含真实数据。

填写：场景ID/owner、受众与业务结果、worker与天然输入件、输出、system of record、对象schema、确定性规则、AI动作、人工验收点、evidence定位、权限、state/action/event、下一站。

建议场景目录：`schemas/ policies/ fixtures/ expected/`，并写 `scenario.md` 与 `demo.md`。实际创建这些目录时各加README。fixture标注synthetic/public/redacted；预期结果包含失败、缺项、异常和人工修正。

衡量acceptance、correction、missing context、覆盖率与复核时间；无真实测量不得写收益数字。首先只跑一个worker、一类材料、一个动作、一个人工验收点。
