# Editorial research log

## 2026-10-11 — Isotype and Japanese editorial composition

- Scope: two grammar candidates, twelve URL identities after follow-up: five Isotype records, six Japanese requirements/specification/figure records, one Japanese print-object catalog record. The four W3C/NDL sources for Japanese layout are JLReq, CSS Writing Modes, CSS Ruby, and the NDL item record; Isotype includes the University of Vienna project and documents archive, RIT Cary exhibit, University of Reading paper, and Isotype Collection.
- Discovery: three Exa queries at six returned results each (18 result slots); two image queries returned eight image-result slots. Exact-URL scan across `vault/**/*.json` found no duplicates.
- Read: nine exact public URLs in the initial pass (all retrieved as text), then one public JLReq source-HTML URL (code read); two linked JLReq figure URLs were directly viewed. No complete local snapshots were captured.
- Visual check: browser screenshot was requested for the University of Reading PDF and JLReq HTML page; the PDF request returned only a citation reference, while screenshot on HTML was explicitly unavailable. Shell fetch of public image/PDF URLs returned 403. No original visual is claimed as inspected. A follow-up visual inspection remains required before using image-specific observations.
- Limits: source text supports historical description, selected principles and requirements, and named specimen identity; it does not establish universal picture-language comprehension, comparative learning effects, current browser interoperability, or the detailed appearance of an unviewed image.
- Files: `cards/asa-e-01…09`, `catalog.json`, `entities.json`, `README.md`; derived references in `kit/design/composition/editorial-translations.md`.


## 2026-10-11 — JLReq figure evidence

- Added separate source identities for the JLReq source HTML and two exact figure asset URLs after reading the markup around `fig2_11` and `fig2_1` and viewing both static PNGs.
- The figures show narrowly specified punctuation and mixed-script examples. They do not establish complete Japanese page design, common practice, or renderer behavior.
- Repeated exact-URL deduplication against `vault/**/*.json`; no duplicate canonical URL found.

## 2026-10-11 · 视觉语义复核

根代理重看 img2_1，发现先前把句子谈到的罗马字/数字误写为实际图像内容，且行数写成三行。修为五行日文与标点；来源卡、支持主张、实体、语法同步，不能宣称此图展示西文数字混排。早期无图描述只对应第一次尝试，之后两幅官方图的观看有效。

## 2026-10-11 · 分面补正

依既有来源卡与主张定位补作者语境/语言和实体媒介/谱系/runtime；值、未知与不适用的理由在 canonical facets，不扩张原证据范围。来源正文与身份不变，补正前后覆盖及裁决见 [分类回执](../../../../docs/verification/art-software-atlas-20261011/facet-correction.md)。
