# 企业系统拓扑与切入面

## 说明

本文件提炼的是对话中对大型行业/供应链公司的“常见系统骨架”与切入假设，不是对任何具体客户（包括对话举例的立讯精密）现状的审计。原回答引用过公开资料，但归档只保留 `chatgpt-content-reference` 占位，具体来源不可还原，统一标为待核实。

## 候选系统地图

| 业务域 | 常见系统类别（候选） | 典型对象 | 法律/金融 AI 可探测面 |
|---|---|---|---|
| ERP / 财务 | SAP、Oracle 或国产 ERP 等 | 公司、成本中心、PO、应付、总账、资产 | 发票异常、付款条件、对账、合同—付款一致性 |
| SRM / Procurement | Ariba、Coupa 或自研采购平台等 | Supplier、RFQ、PO、报价、准入 | 供应商准入、尽调、合同、采购合规 |
| PLM / PDM | Teamcenter、Windchill 或同类系统 | BOM、图纸、版本、ECO/ECN、NPI | IP、技术协议、变更责任、供应商条款 |
| MES / MOM | 制造执行系统 | 工单、工艺、产线、批次、设备 | 通常不是第一轮 AI 切口 |
| QMS | 独立 QMS 或 ERP/MOM 模块 | 检验、缺陷、8D、CAPA、供应商质量 | 质量事故材料、索赔、责任、合规证明 |
| SCM / APS | 计划/订单管理 | 需求、供给、交期、库存 | 供应风险、合同承诺、异常解释 |
| WMS / TMS / GTM | 仓储、运输、全球贸易 | 库存、运单、报关、原产地 | 贸易合规、单证审查、关务风险 |
| CLM / Legal | 合同生命周期、电子签、法务系统 | 合同、条款、义务、争议 | 合同审查、义务跟踪、争议材料 |
| Treasury / Tax | 资金、税务、银企系统 | 账户、支付、融资、税票 | 支付审核、税务材料、融资文档 |
| OA / BPM / IAM | OA、BPM、SSO、组织权限 | 人、组织、审批、权限 | HITL、授权、审计 |
| DMS / ECM / Data | 文档库、数据湖、BI | 文件、报表、指标 | 检索、证据来源、管理视角 |

表中“常见系统”和产品名均来自 T5/A、T6/A 的回答举例；应在具体客户访谈、系统清单或公开资料中复核，不能据此断言客户已部署。

## 核心判断：跨系统接缝是候选工作面

回答提出的采购链示意：

```text
供应商
  ↓ SRM 准入
RFQ / 报价
  ↓
采购合同 ← Legal
  ↓
PO ← ERP
  ↓
收货 ← WMS / ERP
  ↓
质检 ← QMS
  ↓
Invoice ← Finance
  ↓
付款 ← Treasury
```

首轮不必打通整条链，可以截取如下只读横截面：

```text
Supplier package + Contract + PO + Invoice
        ↓
structured review
        ↓
异常 / 缺项 / 冲突 / 风险
        ↓
采购 / 法务 / 财务人工复核
```

这里的设计逻辑是：ERP、SRM、PLM、MES、QMS 更像 system of record；AI sidecar 处理跨系统文档、规则和异常，避免复制任何一个中台（T5/A）。这仍是候选边界，需由首个场景验证。

## 五个优先探测的横截面

### 1. 供应商准入

输入可能包括营业执照、股权、银行、税务、资质、ESG 问卷、廉洁协议、NDA、供应商合同和 Excel。候选链路：

```text
documents
  → extract schema
  → completeness check
  → conflict / expiry / risk check
  → evidence-bound review report
  → 采购 / 法务 / 合规确认
```

企业差异主要应进入 policy overlay：证照要求、高风险国家、升级金额和廉洁调查条件（T5/A）。这些差异是回答中的抽象示例，不能预设任何客户规则。

### 2. 采购合同

候选 lifecycle：

```text
template → clause → deviation → review → approval → signature → obligation → renewal
```

制造采购可能关注价格、账期、MOQ、交付、Incoterms、质量、验收、变更、模具/IP、保密、赔偿、停产、不可抗力、产能保障和审计权（T5/A）。具体 schema 需由样本校准。

### 3. PO / Contract / Invoice 异常

候选一致性检查：主体、金额、币种、付款条件、PO 存在性、重复票据、税率/税号、合同有效期和额外审批。回答建议：

```text
PDF / Contract
  → LLM structured fields
  → deterministic reconciliation
  → exception
  → human
```

LLM 负责非结构化材料编译，确定性代码负责大量比对；这是可检验的设计建议，不是已证明的架构结论。

### 4. 供应商质量到法律/商业索赔

潜在材料分散在 QMS、MES、PLM、Email、合同、ERP 和 Excel。候选首期产物是 evidence pack / claim memo preparation，不替人作法律裁决（T5/A）。

### 5. 全球贸易/合规

候选输入包括商业发票、packing list、采购合同、原产地证明、产品描述、进出口证照、制裁/实体名单材料、客户问卷和供应商声明。共同特征是文档结构较强、规则多、证据需保留、人工最后确认（T5/A）；仍需按地区和客户规则核实。

## 现场探测表

首轮访谈可把每项工作登记为：

| 工作 | Input | System of record | 人在判断什么 | Output | 下一站 |
|---|---|---|---|---|---|
| 供应商准入 | 证照/问卷 | SRM | 完整性、风险 | approve/reject | procurement |
| 合同审查 | Word/PDF | CLM/OA | 标准偏离 | redline | approver |
| 发票审核 | PO/票据 | ERP | 是否匹配 | exception | AP |
| 质量索赔 | QMS+合同 | 多系统 | 责任、证据 | claim pack | legal |
| 出口审查 | 单证 | GTM/ERP | 是否满足规则 | clearance | logistics |

只把“输入可取得、判断稳定、输出可人工验收、不必修改核心系统”的行作为首个循环候选（T5/A）。这是一条筛选建议。

## 待核实

- 客户真实系统、部署厂商、接口可用性、数据权限、文档格式和 worker flow 均未在本线程验证。
- “底层生产系统可能已经很强、专业 worker 的跨系统 attention 仍昂贵”是原回答对大型制造企业的工作假设，不是客户事实。
- 需由外部源登记者补回原回答中的外部引用；本文件不承担外部事实核验。

## 来源

系统拓扑与横截面：T5/U、T5/A。  
六层企业技术图景与设计工具：T6/U、T6/A。  
dirty workflow 的窄接口原则：T10/U、T10/A。

