# 术语与缩写

正文在首次承担解释作用的位置展开缩写。来源层保留原标题、原词和定位；这里的中文是编订时的解释，不冒充原文引语。没有稳定中文译法的词保留英文或缩写，含义在第一次使用时说明。产品名、对象 ID、API 字段和代码标识不翻译。名称所属的通用术语、标准、provider 概念与编订归纳四层见 [词表说明](semantics.md#名称来自哪一层)；本索引的解释不是对行业共识的独立调查。

| 原词 | 英文展开 | 中文与用途 |
|---|---|---|
| SaaS | Software as a Service | 软件即服务；通过服务持续提供软件能力 |
| AI | artificial intelligence | 人工智能；本书区分模型建议与获授权动作 |
| UI | user interface | 用户界面；人观察状态和发起动作的入口 |
| API | application programming interface | 应用程序接口；系统之间暴露的读写契约 |
| ID | identifier | 标识符；具体唯一性取决于对象和作用域 |
| JSON | JavaScript Object Notation | 结构化数据表示格式，后文保留 JSON |
| ERP | enterprise resource planning | 企业资源计划；协调企业资源与交易记录的系统类别 |
| BI | business intelligence | 商业智能；将业务数据组织为经营分析与报告 |
| HR | human resources | 人力资源；人员管理职责，不自动包含薪资或身份系统全部权威 |
| ATS | applicant tracking system | 招聘管理系统；跟踪候选人与招聘过程 |
| HRIS | human resources information system | 人力资源信息系统；保存任职等人力资源事实 |
| SCIM | System for Cross-domain Identity Management | 跨域身份管理；跨系统管理身份资源的标准协议名称 |
| SLA | service-level agreement | 服务级别协议；约定服务目标、口径与责任 |
| CMDB | configuration management database | 配置管理数据库；保存配置项及关系 |
| DB | database | 数据库；具体存储不自动取得业务权威 |
| DAG | directed acyclic graph | 有向无环图；有方向且没有有向环的依赖结构 |
| SQL | Structured Query Language | 结构化查询语言；关系数据查询和操作语言 |
| HTTP | Hypertext Transfer Protocol | 超文本传输协议；请求与响应协议，响应成功的含义取决于应用契约 |
| SSE | Server-Sent Events | 服务器发送事件；服务器向浏览器推送事件的机制 |
| PDF | Portable Document Format | 便携式文档格式；文档文件格式，不自动具有签署或批准效力 |
| CSV | comma-separated values | 逗号分隔值；表格数据交换格式 |
| OCR | optical character recognition | 光学字符识别；从图像提取文字，提取结果仍需核对 |
| FHIR | Fast Healthcare Interoperability Resources | 医疗信息交换标准；中文译名不统一，后文保留 FHIR |
| DICOM | Digital Imaging and Communications in Medicine | 医学数字成像和通信；医疗影像相关标准 |
| PACS | picture archiving and communication system | 影像归档与通信系统；影像存储、检索和通信系统 |
| CTMS | clinical trial management system | 临床试验管理系统；管理试验运营与里程碑 |
| EDC | electronic data capture | 电子数据采集；本书指临床试验数据采集与管理系统 |
| eCRF | electronic case report form | 电子病例报告表；试验中的结构化数据采集表 |
| PI | principal investigator | 主要研究者；具体试验职责依方案和组织确定 |
| CRC | clinical research coordinator | 临床研究协调员；协调试验日常工作 |
| DM | data manager | 数据管理员；V02中负责研究数据管理的角色 |
| LIMS | laboratory information management system | 实验室信息管理系统；管理样品、测试及相关记录 |
| QC | quality control | 质量控制；检查本次运行或产物是否符合要求 |
| OOS | out-of-specification | 超出规格；结果超出适用规格，调查与处置另行决定 |
| CoA | certificate of analysis | 分析证书；绑定结果与批准依据的证书 |
| POS | point of sale | 销售点系统；交易与收款操作所用系统；不等同于资金到账 |
| KDS | kitchen display system | 厨房显示系统；呈现制作任务及进度 |
| PMS | property management system | 酒店管理系统；V06语境指酒店管理系统，不能直接继承长期租赁语义 |
| SKU | stock keeping unit | 库存单位；用于区分可销售和库存规格 |
| RFI | request for information | 信息请求；建造场景中请求澄清信息的记录 |
| ROM | rough order of magnitude | 粗略量级估算；早期估计，不能直接作为正式财务变更 |
| CAD | computer-aided design | 计算机辅助设计；表达和修改设计 |
| CAM | computer-aided manufacturing | 计算机辅助制造；将设计转为制造加工安排 |
| BOM | bill of materials | 物料清单；描述产品组成与所需物料 |
| RTL | register-transfer level | 寄存器传输级；数字逻辑的描述层次 |
| VEE | validation, estimation and editing | 校验、估算与编辑；计量数据检查、更正与估算过程 |
| TOU | time of use | 分时计价；按发生时间区段使用不同价格口径 |
| EPCIS | Electronic Product Code Information Services | GS1事件共享标准，后文保留 EPCIS |
| CBV | Core Business Vocabulary | 核心业务词汇；GS1事件语义所用词汇 |
| FIX | Financial Information eXchange | 金融信息交换协议，后文保留 FIX |
| LMS | learning management system | 学习管理系统；管理学习活动、提交与评阅 |
| SIS | student information system | 学生信息系统；保存学校认可的学生、注册和记录 |
| CLR | Comprehensive Learner Record | 综合学习者记录；学习成果记录标准类别 |
| EDRM | Electronic Discovery Reference Model | 电子证据开示参考模型；区分保全、审阅与交付等工作 |
| ELM | enterprise legal management | 企业法务管理；案件事项、法律费用等管理类别 |
| ACL | access control list | 访问控制列表；表达资源访问许可 |
| RLS | row-level security | 行级安全；按策略约束行访问，仍须检查运行角色与其他通路 |

领域词如 hold、release、acceptance 的不同含义见 [共同语义](semantics.md)。机器索引见 [terminology.json](../../vault/distilled/saas-engineering-atlas/terminology.json)；图和独立节点标签可通过 `reader_term_ids` 展示同一解释。
