# ASA-S-08 · three.js · MeshStandardMaterial

- URL: https://threejs.org/docs/pages/MeshStandardMaterial.html
- Catalog: [catalog.json](../catalog.json) · History: [CHANGELOG.md](../CHANGELOG.md)
- Grammar: [Ando《光之教会》](../../../../../kit/design/composition/spatial-materials.md#asa-g-ando-church-of-the-light)
- Read: MeshStandardMaterial API entry in official three.js documentation。
- Supports: ASA-S-08-C12。

three.js 将 MeshStandardMaterial 定义为使用物理基础的标准材质模型，面向 roughness/metalness 工作流程。该 API 可帮助表达程序模型中的表面参数和光照响应。它只支持“在此 renderer 中哪些材质控制可用”的实现判断，不会为工程模型生成真实水泥、木板来源或作品含义。

**边界。** API 文档不证明任何对 Church of the Light 的真实材质拟合，也不保证每种 GPU、色彩管理或设备上结果相同。本轮没有运行 three.js 示例；当前文档细节可能随版本变化，重访前固定版本与渲染配置。

版权/许可：本页文档与代码许可本轮未核验。证据形态：`text_read`。
