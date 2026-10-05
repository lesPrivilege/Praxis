"use strict";

const $ = id => document.getElementById(id);
const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]);
const phaseLabels = { pending:"等待采集", running:"采集中", success:"已观测", unknown:"未知", error:"失败", unsupported:"不支持" };
const scanLabels = { queued:"等待采集", running:"采集中", complete:"采集结束", error:"采集失败" };
const titles = {
  observations:["概览","观测概览","查看当前读数、来源、采集时间与状态。"],
  baseline:["基线","观测基线","基线由使用者明确选定；后续采集不会自动改写。"],
  changes:["变化","观测变化","只比较同一来源、同一方法下成功取得的值。"],
  sources:["来源","观测来源","按来源查看读取方法、字段范围与测量限制。"],
  history:["记录","观测记录","选择记录查看当时结果，不会重新发起外部请求。"]
};
const state = {
  mode:"real", view:"observations", sample:"B", filter:"all", selected:null, reveal:false,
  connected:false, busy:false, csrf:null, sources:[], history:[], scans:new Map(), currentId:null,
  activeId:null, baseline:null, error:"", pollTimer:null, requestGeneration:0,
  signatures:{id:null,items:new Map()}, fresh:new Set()
};

const demoDefinitions = [
  ["local.os",{family:"Synthetic OS",version:"1",architecture:"fixture"},{family:"Synthetic OS",version:"2",architecture:"fixture"},{family:"Synthetic OS",version:"1",architecture:"fixture"},"local.runtime",false],
  ["local.proxy",{configured:false},{configured:false},{configured:false},"local.runtime",false],
  ["egress.ipify",{ip:"192.0.2.10"},{ip:"192.0.2.11"},null,"egress.ipify",true],
  ["browser.context",{timezone:"Etc/UTC",languages:["en-US"],online:true},{timezone:"Etc/UTC",languages:["en-US"],online:true},{timezone:"Etc/UTC",languages:["en-US"],online:true},"browser.self",true],
  ["dns.example",{target:"example.com",addresses:["192.0.2.20"]},{target:"example.com",addresses:["192.0.2.20"]},{target:"example.com",addresses:["192.0.2.20"]},"target.dns",true],
  ["tls.example",null,null,null,"target.tls",true]
];
function demoScan(letter) {
  return {id:`demo-${letter}`,status:"complete",started_at:null,finished_at:null,progress:{done:6,total:6,label:"演示样本"},observations:demoDefinitions.map(([id,a,b,c,source,sensitive]) => {
    const value = ({A:a,B:b,C:c})[letter];
    return {id,label:observationNames[id],group:"演示样本",source_id:source,status:value === null ? "unknown" : "success",value,observed_at:null,duration_ms:null,error:null,note:"人为编写的演示读数。",comparison_key:`demo-${id}`,sensitive};
  })};
}
const demoSources = [
  {id:"local.runtime",label:"设备属性样本",url:null,method:"本地静态演示数据",scope:"演示样本",limitations:"操作系统与代理配置存在性的合成读数。"},
  {id:"egress.ipify",label:"服务端出口样本",url:null,method:"本地静态演示数据",scope:"演示样本",limitations:"IP 使用文档示例地址。"},
  {id:"browser.self",label:"浏览器属性样本",url:null,method:"本地静态演示数据",scope:"演示样本",limitations:"时区、语言与联网提示的合成读数。"},
  {id:"target.dns",label:"目标解析样本",url:null,method:"本地静态演示数据",scope:"演示样本",limitations:"解析地址使用文档示例地址。"},
  {id:"target.tls",label:"TLS 样本",url:null,method:"本地静态演示数据",scope:"演示样本",limitations:"本样本的握手读数为未知。"}
];
const currentScan = () => state.mode === "demo" ? demoScan(state.sample) : state.scans.get(state.currentId) || null;
const baselineScan = () => state.mode === "demo" ? demoScan("A") : state.baseline;
const currentSources = () => state.mode === "demo" ? demoSources : state.sources;
const sourceFor = observation => currentSources().find(source => source.id === observation.source_id);
const observationNames = {"local.os":"操作系统","local.timezone":"本机时区","local.locale":"本机语言","local.proxy":"服务端代理配置","local.dns":"系统 DNS 配置","browser.context":"浏览器自报","egress.ipify":"服务端出口 IP · ipify","egress.geojs":"服务端出口 IP · GeoJS","dns.example":"目标 DNS 解析 · example.com","dns.cloudflare":"目标 DNS 解析 · www.cloudflare.com","tls.example":"TLS · example.com","tls.cloudflare":"TLS · www.cloudflare.com"};
const observationName = item => observationNames[item.id] || item.label || "观测项";
const previousNotes = new Map([
  ["ipify 只报告 IP；ASN 与国家不在该来源覆盖内。后端请求出口不代表浏览器或其他应用。", "ipify 提供本次服务端请求的出口 IP。"],
  ["提供方独立结果；空字段保持未知。后端请求出口不代表浏览器或其他应用。", "GeoJS 提供本次服务端请求的出口 IP、自治系统编号与国家代码；空字段保持未知。"],
  ["已校验证书的后端 HTTPS 请求；传输对端可能是系统/环境代理，不代表浏览器或其他应用。", "已校验证书的服务端 HTTPS 请求；传输对端可能是系统或环境代理。"],
  ["系统解析目标地址；不表明所用 resolver 或 DNS resolver 的公网出口。", "系统 getaddrinfo 返回指定目标的解析地址。"],
  ["仅系统配置地址，不能证明一次实际查询的 resolver 或公网出口。", "系统公布的 DNS nameserver 配置地址。"],
  ["仅后端可读取的代理配置存在性；false 不证明 VPN/PAC 未启用或浏览器没有代理。不导出代理地址、凭据或其他环境变量。", "记录服务端可读取的代理配置是否存在；代理地址与凭据不保存。"],
  ["当前浏览器自报；online 不证明外网可达。", "浏览器报告的时区、语言与联网提示；联网提示来自 navigator.onLine。"]
]);
function observationNote(item) {
  const note = item.note || "";
  const prefix = "部分字段未知，不能作为完整对照。";
  if (previousNotes.has(note)) return previousNotes.get(note);
  if (note.startsWith(prefix) && previousNotes.has(note.slice(prefix.length))) return prefix + previousNotes.get(note.slice(prefix.length));
  return note;
}
const inProgress = scan => scan && ["queued","running"].includes(scan.status);
const successful = observation => observation?.status === "success" && observation.value !== null && observation.value !== undefined;
const completeValue = value => value !== null && value !== undefined && (typeof value === "string" ? value.trim().length > 0 : Array.isArray(value) ? value.length > 0 && value.every(completeValue) : typeof value === "object" ? Object.keys(value).length > 0 && Object.values(value).every(completeValue) : typeof value !== "number" || Number.isFinite(value));
const canonical = value => Array.isArray(value) ? `[${value.map(canonical).join(",")}]` : value && typeof value === "object" ? `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}` : JSON.stringify(value);
const fieldLabels = {ip:"服务端出口 IP",asn:"自治系统编号（ASN）",country:"国家代码",target:"目标域名",tls_version:"TLS 版本",cipher:"加密套件",transport_peer:"连接对端",http_status:"HTTP 状态",nameservers:"配置的 DNS 地址",addresses:"解析所得地址",timezone:"时区",languages:"语言",online:"浏览器联网提示",language:"语言",encoding:"编码",names:"时区名称",utc_offset_seconds:"UTC 偏移"};
const missing = item => item === null || item === undefined || item === "";
const word = item => missing(item) ? "未知" : Array.isArray(item) ? item.map(word).join("、") : typeof item === "boolean" ? (item ? "是" : "否") : String(item);
// Measured values are set in monospace; words Drift supplies (states, 未知) stay in the interface face.
const reading = (text, plain = false) => `<span class="reading${plain ? " plain" : ""}">${escapeHTML(text)}</span>`;
const readingNote = text => `<span class="reading-note">${escapeHTML(text)}</span>`;
function readingHTML(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return reading(word(value),missing(value));
  if ("family" in value) return reading([value.family === "Darwin" ? "macOS" : word(value.family), word(value.version), word(value.architecture)].join(" · "));
  if ("configured" in value) return reading(value.configured === true ? "已检测到配置" : value.configured === false ? "未检出配置" : "配置状态未知",true);
  return Object.entries(value).map(([key,item]) => {
    let text = word(item);
    if (key === "utc_offset_seconds" && Number.isFinite(item)) {
      const minutes = Math.abs(Math.trunc(item / 60));
      text = `UTC${item < 0 ? "−" : "+"}${String(Math.floor(minutes / 60)).padStart(2,"0")}:${String(minutes % 60).padStart(2,"0")}`;
    }
    return `<span class="reading-field"><span class="reading-key">${fieldLabels[key] || "其他字段"}：</span>${reading(text,missing(item))}</span>`;
  }).join("");
}
// inRow: the row's state column already names a missing value, so the value column shows a dash instead of repeating it.
function valueHTML(observation, inRow = false) {
  if (!observation) return readingNote("未设置");
  const hasValue = observation.value !== null && observation.value !== undefined;
  if (!successful(observation) && !hasValue) return inRow ? '<span class="reading-note reading-empty" aria-hidden="true">—</span>' : readingNote(phaseLabels[observation.status] || "未知");
  if (observation.sensitive && !state.reveal) return readingNote("已隐藏");
  return successful(observation) ? readingHTML(observation.value) : readingNote(`部分结果 · ${phaseLabels[observation.status] || "未知"}`) + readingHTML(observation.value);
}
function baselineItem(item) { return baselineScan()?.observations?.find(previous => previous.id === item.id) || null; }
function comparison(item) {
  const previous = baselineItem(item);
  if (!successful(item) || !successful(previous) || !completeValue(item.value) || !completeValue(previous.value) || !item.comparison_key || item.comparison_key !== previous.comparison_key || item.source_id !== previous.source_id) return "unavailable";
  return canonical(item.value) === canonical(previous.value) ? "same" : "changed";
}
function resultLabel(item) {
  if (!successful(item)) return phaseLabels[item.status] || "未知";
  if (!baselineScan()) return "已观测";
  return ({same:"相同",changed:"有变化",unavailable:"不可比"})[comparison(item)];
}
const phaseKind = item => successful(item) ? "ok" : ["pending","running","error","unsupported"].includes(item.status) ? item.status : "unknown";
const resultKind = item => successful(item) && baselineScan() ? comparison(item) : phaseKind(item);
const statusHTML = (kind, label) => `<span class="status ${kind}">${escapeHTML(label)}</span>`;
// Rows whose state or value changed since the last render of the same record; the table marks them once.
function freshItems(scan) {
  const fresh = new Set();
  const items = new Map((scan?.observations || []).map(item => [item.id,`${item.status}:${canonical(item.value)}`]));
  if (scan && state.signatures.id === scan.id) for (const [id,signature] of items) if (state.signatures.items.get(id) !== signature) fresh.add(id);
  state.signatures = {id:scan?.id || null,items};
  return fresh;
}
function timeLabel(time, short = false) {
  if (!time) return state.mode === "demo" ? "演示样本" : "尚未采集";
  const date = new Date(time);
  return Number.isNaN(date.getTime()) ? "时间未知" : date.toLocaleString("zh-CN", short ? {month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"} : {year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false});
}
function visibleItems() {
  const scan = state.view === "baseline" ? baselineScan() : currentScan();
  const items = scan?.observations || [];
  if (state.view === "changes") return items.filter(item => comparison(item) === "changed");
  if (state.view !== "observations") return items;
  return items.filter(item => state.filter === "all" || (state.filter === "changed" ? comparison(item) === "changed" : !successful(item)));
}
function counts(scan = currentScan()) {
  const items = scan?.observations || [];
  return {total:items.length, success:items.filter(successful).length, changed:items.filter(item => comparison(item) === "changed").length, comparable:items.filter(item => comparison(item) !== "unavailable").length, missing:items.filter(item => !successful(item)).length};
}
function safeLink(url) {
  try { const parsed = new URL(url); return parsed.protocol === "https:" && !parsed.username && !parsed.password ? parsed.href : null; }
  catch { return null; }
}
function errorText(code) {
  return ({partial_result:"只取得部分字段，未知字段不参与完整对照。",scan_failed_storage_unavailable:"采集失败，且未能保存；重新启动后可能无法恢复这些结果。",timeout:"请求超时，未取得结果；可以重新采集。",network_unavailable:"未能建立请求，请检查当前连接后重试。",tls_validation_failed:"TLS 证书校验失败。",redirect_refused:"来源返回了重定向，本次请求未继续。",http_error:"来源未返回成功响应。",provider_rejected_request:"公开服务拒绝了本次请求，可能暂不可用或受到限额限制。",invalid_provider_ip:"数据源未返回有效 IP 地址。",non_public_provider_ip:"数据源返回私用或保留地址，结果保持未知。",non_json_response:"来源返回内容不是约定的 JSON。",invalid_json_response:"来源返回的 JSON 无法解析。",response_too_large:"来源响应超出读取上限，本次结果未使用。",invalid_provider_response:"来源响应字段不完整或不符合约定。",transport_metadata_unavailable:"无法取得该 HTTPS 连接的握手明细。",dns_resolution_failed:"固定目标的 DNS 解析未取得结果。",no_dns_result:"固定目标没有返回可用地址。",no_dns_configuration:"系统没有提供可读取的 DNS 配置。",dns_configuration_unavailable:"当前无法读取 DNS 配置。",os_not_supported:"当前系统尚不支持此项采集。",browser_not_reported:"本次未收到浏览器自报值。",scan_deadline_exceeded:"本次采集已到时间上限，此项没有取得结果。",scan_failed:"采集遇到错误，已取得的结果保留。",probe_failed:"此项采集失败，可重新采集。",storage_unavailable:"结果未能保存到本机私有目录；请核对后再重试。"})[code] || "此项未取得结果；详情保留错误标识。"
}
function announce(message) { $("announcement").textContent = message; }
function emptyPanel(title, body) { return `<section class="panel"><div class="empty-state"><strong>${escapeHTML(title)}</strong>${escapeHTML(body)}</div></section>`; }

function providerComparisonPanel(scan) {
  if (state.mode !== "real") return "";
  const reports = (scan.observations || []).filter(item => item.group === "egress" && ["success","unknown"].includes(item.status) && item.value && typeof item.value === "object");
  const fields = [["ip","服务端出口 IP"],["asn","自治系统编号（ASN）"],["country","国家代码"]];
  const rows = fields.map(([field,label]) => {
    const usable = reports.filter(item => item.value[field] !== null && item.value[field] !== undefined && item.value[field] !== "");
    const independent = [...new Map(usable.map(item => [item.source_id,item.value[field]])).values()];
    let text = "不足 2 份可用值";
    if (independent.length >= 2) {
      const families = new Set(independent.map(value => String(value).includes(":") ? 6 : 4));
      text = field === "ip" && families.size > 1 ? "地址族不同，不直接对照" : new Set(independent.map(canonical)).size === 1 ? "返回值相同" : "返回值不同";
    }
    return `<div><span>${label}</span><strong>${escapeHTML(text)}</strong><small>${independent.length} 份独立来源</small></div>`;
  });
  return `<details class="provider-comparison"><summary>数据源对照</summary><div class="provider-fields">${rows.join("")}</div><p>不同目标、地址族或采集时间可能呈现不同出口；仅对照已取得的字段。</p></details>`;
}

function overviewPanel() {
  const scan = currentScan();
  if (!scan) return emptyPanel(state.connected ? "从一次观测开始" : "采集器尚未连接", state.connected ? "点击开始采集，记录本机信息与固定数据源所观察的服务端出口 IP。" : "连接本地 Drift 服务后可以采集；也可以切换到演示样本查看界面。");
  const count = counts(scan);
  const name = state.mode === "demo" ? `样本 ${state.sample}` : scan.id === state.activeId || scan.id === state.history[0]?.id ? "本次观测" : "历史观测";
  const pinned = state.mode === "real" && scan.id === state.baseline?.id ? '<span class="panel-tag">固定基线</span>' : "";
  return `<section class="observation-summary" aria-labelledby="collection-title"><div class="record-head"><h2 id="collection-title">${name}</h2><span class="panel-subheading">${escapeHTML(timeLabel(scan.started_at))}${state.mode === "real" ? " · 本地时间" : " · 占位内容"}</span><span class="panel-tag">${escapeHTML(scanLabels[scan.status] || "状态未知")}</span>${pinned}</div><div class="summary-strip"><span><strong>${count.success} / ${count.total}</strong> 项已观测</span><span><strong>${count.missing}</strong> 项未取得</span><span>${baselineScan() ? "已设固定基线" : "尚未设置基线 · 当前记录可独立查看"}</span></div></section>`;
}

function observationTable() {
  const scan = state.view === "baseline" ? baselineScan() : currentScan();
  if (!scan) return state.view === "changes" ? emptyPanel("还没有可比较的记录","先完成采集，再将一份记录明确设为基线。") : "";
  const isBaseline = state.view === "baseline";
  const items = visibleItems();
  const filters = state.view === "observations" ? `<div class="list-controls"><div class="segmented" role="group" aria-label="筛选观测项">${[["all","全部"],["missing","未取得"]].map(([key,label]) => `<button class="filter-button" data-filter="${key}" aria-pressed="${state.filter === key}">${label}</button>`).join("")}</div><button class="filter-button view-link" data-view="changes">查看变化 <span aria-hidden="true">→</span></button></div>` : "";
  let emptyTitle = "当前筛选没有观测项";
  let emptyBody = "切换到全部查看其他观测。";
  if (state.view === "changes" || state.filter === "changed") {
    emptyTitle = !baselineScan() ? "尚未设置基线" : counts().comparable ? "没有可确认的变化" : "暂无可比较的观测项";
    emptyBody = baselineScan() ? "未知、失败、不支持或方法不同的项不参与差异判断。" : "将一份完成的观测设为基线后，才能比较后续记录。";
  }
  const compare = state.view === "changes";
  const heads = compare ? [["观测项","col-name"],["当前读数","col-value"],["基线读数","col-baseline"],["对照结果","col-result"]] : [["观测项","col-name"],[isBaseline ? "基线读数" : "当前读数","col-value"],["观测状态","col-status"],["采集时间","col-time"]];
  // Explicit roles keep the table readable to assistive technology when the narrow layout turns rows into blocks.
  const rows = items.map(item => {
    const selected = state.selected === item.id;
    const status = compare ? statusHTML(resultKind(item),resultLabel(item)) : statusHTML(phaseKind(item),phaseLabels[item.status] || "未知");
    const tail = compare ? `<td role="cell" class="col-baseline" data-label="基线"><div class="cell-value">${valueHTML(baselineItem(item))}</div></td><td role="cell" class="col-result">${status}</td>` : `<td role="cell" class="col-status">${status}</td><td role="cell" class="col-time">${item.observed_at ? escapeHTML(timeLabel(item.observed_at,true)) : '<span aria-hidden="true">—</span>'}</td>`;
    return `<tr role="row" class="${[selected ? "selected" : "",!isBaseline && state.fresh.has(item.id) ? "arrived" : ""].filter(Boolean).join(" ")}"><td role="cell" class="col-name"><button class="signal-name" data-item="${escapeHTML(item.id)}" aria-pressed="${selected}">${escapeHTML(observationName(item))}</button><span class="row-source">${escapeHTML(sourceFor(item)?.label || "来源未提供")}</span></td><td role="cell" class="col-value" data-label="当前"><div class="cell-value">${valueHTML(item,!compare)}</div></td>${tail}</tr>`;
  });
  return `<div class="section-heading" id="observation-list"><h2>${isBaseline ? "基线观测项" : compare ? "已确认的变化" : "观测项"}<span>${items.length}</span></h2>${filters}</div><section class="panel" aria-label="${compare ? "观测对照" : "观测读数"}">${items.length ? `<table role="table" class="signal-table ${compare ? "comparison-table" : "reading-table"}"><thead role="rowgroup"><tr role="row">${heads.map(([label,column]) => `<th role="columnheader" scope="col" class="${column}">${label}</th>`).join("")}</tr></thead><tbody role="rowgroup">${rows.join("")}</tbody></table>` : `<div class="empty-state"><strong>${escapeHTML(emptyTitle)}</strong>${escapeHTML(emptyBody)}</div>`}<div class="table-footer"><span>选择观测项查看详细值与来源</span><span>未知 / 失败 / 不支持分别保留</span></div></section>`;
}

function baselinePanel() {
  const baseline = baselineScan();
  const scan = currentScan();
  return `<section class="panel"><div class="baseline-card">${baseline ? '<p class="card-label">基线记录</p>' : ""}<h2>${baseline ? escapeHTML(state.mode === "demo" ? "样本 A" : timeLabel(baseline.started_at)) : "尚未设置基线"}</h2><p>${baseline ? "这份记录作为固定参照。选择历史记录或重新采集不会改写它。" : "先完成一次采集，检查观测结果，再将它设为后续比较的参照。"}</p>${state.mode === "real" ? `<button class="quiet-button baseline-pin" data-action="pin" ${!scan || scan.status !== "complete" || state.busy || scan.id === baseline?.id ? "disabled" : ""}>${scan?.id === baseline?.id ? "当前记录已是基线" : baseline ? "用当前记录替换基线" : "将当前记录设为基线"}</button>` : ""}</div><div class="baseline-note">只有同一来源、同一方法下成功取得的值才参与比较。基线中的失败或未知值仍保留原状态。</div></section>${baseline ? observationTable() : ""}`;
}

function sourcePanel() {
  const sources = currentSources();
  if (!sources.length) return emptyPanel("来源尚不可用","连接本地采集器后会列出固定来源、请求方式与测量边界。");
  return `<section class="panel">${sources.map(source => {
    const link = safeLink(source.url);
    return `<article class="source-card"><div class="source-card-head"><h2>${escapeHTML(source.label)}</h2>${link ? '<span class="panel-tag">HTTPS 数据源</span>' : ""}</div><dl class="source-facts"><dt>读取方法</dt><dd>${escapeHTML(source.method || "方法未提供")}</dd><dt>字段范围</dt><dd>${escapeHTML(source.scope || "范围未提供")}</dd><dt>测量限制</dt><dd>${escapeHTML(Array.isArray(source.limitations) ? source.limitations.join("；") : source.limitations || "边界未提供")}</dd>${link ? `<dt>来源地址</dt><dd><a href="${escapeHTML(link)}" target="_blank" rel="noopener noreferrer">${escapeHTML(link)} <span aria-hidden="true">↗</span></a></dd>` : ""}</dl></article>`;
  }).join("")}</section>`;
}

function historyPanel() {
  if (state.mode === "demo") return emptyPanel("演示模式不产生历史记录","切换本机实测后，完成的采集会保存在本机私有数据目录。");
  if (!state.history.length) return emptyPanel("还没有历史记录","采集结束后单独保存；重试会创建新记录，不覆盖上次失败。");
  return `<p class="view-note">详细值默认隐藏；记录仅保存在本机。</p><section class="panel history-list">${state.history.map(scan => `<button class="history-item ${scan.id === state.currentId ? "selected" : ""}" data-history="${escapeHTML(scan.id)}" aria-pressed="${scan.id === state.currentId}" ${state.busy ? "disabled" : ""}><span><strong>${escapeHTML(timeLabel(scan.started_at))}</strong><small>${escapeHTML(scanLabels[scan.status] || "状态未知")}${scan.id === state.baseline?.id ? " · 固定基线" : ""}</small></span><span>${Number(scan.summary?.success || 0)} 项已观测 <span aria-hidden="true">→</span></span></button>`).join("")}</section>`;
}

// swap: the reader chose another row, so the detail fades in once; polling re-renders do not replay it.
function renderInspector(swap = false) {
  const inspector = $("inspector");
  inspector.hidden = state.view === "sources" || state.view === "history";
  $("content-grid").classList.toggle("single",inspector.hidden);
  if (inspector.hidden) { inspector.innerHTML = ""; return; }
  const baseline = state.view === "baseline";
  const item = visibleItems().find(item => item.id === state.selected);
  if (!item) {
    inspector.innerHTML = `<div class="inspector-heading"><span>${baseline ? "基线明细" : "观测明细"}</span></div><div class="inspector-body"><h2>当前没有选中项</h2><p class="detail-description">${currentScan() ? "当前列表没有可查看的项。未知与失败不计作已确认变化。" : "完成采集后，可以在这里查看每项的实际值、来源、采集时间与限制。"}</p></div>`;
    return;
  }
  const source = sourceFor(item);
  const previous = baselineItem(item);
  inspector.innerHTML = `<div class="inspector-heading"><span>${baseline ? "基线明细" : "观测明细"}</span>${item.sensitive ? "<span>默认隐藏</span>" : ""}</div><div class="inspector-body${swap ? " swap" : ""}"><div class="detail-intro"><h2 class="inspector-title" tabindex="-1">${escapeHTML(observationName(item))}</h2>${statusHTML(phaseKind(item),phaseLabels[item.status] || "未知")}</div><div class="detail-reading"><p class="inspector-label">${baseline ? "基线读数" : "当前读数"}</p><div class="detail-value">${valueHTML(item)}</div>${item.sensitive ? `<button class="text-button" data-action="privacy">${state.reveal ? "隐藏本页详细值" : "显示本页详细值"}</button>` : ""}${!baseline && state.view === "changes" && previous ? `<p class="inspector-label">基线读数</p><div class="detail-value">${valueHTML(previous)}</div><p class="inspector-label">对照结果</p>${statusHTML(resultKind(item),resultLabel(item))}` : ""}${item.error ? `<p class="item-error">${escapeHTML(errorText(item.error))}</p>` : ""}</div><div class="detail-section detail-evidence"><div class="detail-meta"><span>观测来源</span><strong>${escapeHTML(source?.label || "来源未提供")}</strong></div><div class="detail-meta"><span>采集时间</span><strong>${escapeHTML(timeLabel(item.observed_at))}</strong></div><div class="detail-meta"><span>采集耗时</span><strong>${Number.isFinite(item.duration_ms) ? `${Math.round(item.duration_ms)} ms` : "—"}</strong></div></div><details class="detail-section technical-details"><summary>方法与测量限制</summary><p class="detail-description">${escapeHTML(source?.method || "方法未提供")}</p><p class="detail-description">${escapeHTML(observationNote(item))}</p><p class="detail-description">${escapeHTML(source?.limitations || "边界未提供")}</p><p class="detail-description">采集时间由本机在此项结束时记录，按当前浏览器时区显示；采集耗时以 ms 计，包括探针启动、请求与解析等整段开销。</p><div class="detail-meta"><span>比较方法标识</span><strong>${escapeHTML(item.comparison_key || "未提供")}</strong></div>${item.error ? `<div class="detail-meta"><span>错误标识</span><strong>${escapeHTML(item.error)}</strong></div>` : ""}<button class="source-link" data-view="sources"><span>查看观测来源</span><span aria-hidden="true">→</span></button></details></div><div class="inspector-footnote">${state.mode === "demo" ? "演示样本 · 人为编写的静态读数" : "值、状态与采集时间来自所选记录。"}<button class="text-button back-to-list" data-action="back-to-list">返回观测列表 ↑</button></div>`;
}

function renderChrome() {
  const scan = currentScan();
  const active = state.scans.get(state.activeId);
  const real = state.mode === "real";
  const count = counts();
  $("breadcrumb-workspace").textContent = real ? "本机" : "演示";
  $("mode-badge").textContent = !real ? "演示数据" : scan ? "本机实测" : "尚未采集";
  $("mode-badge").hidden = !real || Boolean(scan);
  $("collector-state").textContent = !real ? "演示模式" : state.connected ? "本地采集器已连接" : "未连接采集器";
  $("collector-dot").classList.toggle("connected",real && state.connected);
  $("scope-notice").textContent = !real ? (state.activeId ? "演示模式不会新增采集；先前发起的本机采集仍在后台进行。" : "演示样本 · 人为编写的静态读数") : "采集由本机服务端执行；外部数据源收到该次请求的出口 IP，敏感值默认隐藏。";
  $("footer-scope").textContent = !real ? "演示样本 · 不产生采集或历史记录" : "网络 · 设备 · 浏览器观测";
  $("sample-picker").hidden = real;
  $("collection-disclosure").hidden = !real;
  $("privacy-toggle").textContent = state.reveal ? "隐藏本页详细值" : "显示本页详细值";
  $("privacy-toggle").setAttribute("aria-pressed",String(state.reveal));
  const start = $("scan-button");
  start.hidden = !real;
  start.disabled = state.busy || Boolean(state.activeId);
  start.textContent = state.busy ? "处理中" : state.activeId ? "采集中" : !state.connected ? "重新连接" : scan ? "重新采集" : "开始采集";
  $("observation-count").textContent = scan ? String(count.total) : "—";
  $("change-count").textContent = scan && count.comparable ? String(count.changed) : "—";
  $("change-count").classList.toggle("has-changes",Boolean(scan && count.changed));
  $("collection-bar").hidden = !real || !active;
  if (real && active) {
    // The bar is updated in place so the fill can move between polls; done / total are the collector's own task counts.
    const progress = active.progress || {done:0,total:1,label:"等待结果"};
    const done = Math.max(0,Number(progress.done) || 0);
    const total = Math.max(done,Number(progress.total) || 1);
    $("collection-label").textContent = progress.label || scanLabels[active.status];
    $("collection-count").textContent = `${done} / ${total} 项任务完成`;
    $("collection-progress").max = total;
    $("collection-progress").value = done;
    $("collection-progress").textContent = `${done} / ${total}`;
    $("collection-show").hidden = active.id === state.currentId;
  }
  $("operation-error").hidden = !state.error || !real;
  $("operation-error").textContent = state.error;
}

function render() {
  const focused = document.activeElement;
  const focusKey = focused?.dataset ? {item:focused.dataset.item,filter:focused.dataset.filter,action:focused.dataset.action,view:focused.dataset.view,inspector:$("inspector").contains(focused),title:focused.classList.contains("inspector-title")} : null;
  const [label,title,description] = titles[state.view];
  $("breadcrumb-current").textContent = label;
  $("page-title").textContent = title;
  $("page-description").textContent = description;
  document.title = `Drift — ${title}`;
  document.querySelectorAll(".nav-item").forEach(button => {
    const active = button.dataset.view === state.view;
    button.classList.toggle("active",active);
    if (active) button.setAttribute("aria-current","page"); else button.removeAttribute("aria-current");
  });
  const visible = visibleItems();
  if (!visible.some(item => item.id === state.selected)) state.selected = visible[0]?.id || null;
  state.fresh = freshItems(currentScan());
  // Re-rendered marks join the running pulse at its current phase instead of restarting it on every poll.
  document.documentElement.style.setProperty("--pulse-offset",`-${Math.round(performance.now() % 1200)}ms`);
  renderChrome();
  $("view-content").innerHTML = state.view === "observations" ? overviewPanel() + observationTable() + (currentScan() ? providerComparisonPanel(currentScan()) : "") : state.view === "baseline" ? baselinePanel() : state.view === "changes" ? observationTable() || emptyPanel("尚未采集","先取得一份观测，再设置参照进行比较。") : state.view === "history" ? historyPanel() : sourcePanel();
  renderInspector();
  if (focusKey && !document.contains(focused)) {
    const area = focusKey.inspector ? $("inspector") : $("view-content");
    const replacement = focusKey.title ? area.querySelector(".inspector-title") : [...area.querySelectorAll("button")].find(button => ["item","filter","action","view"].some(key => focusKey[key] && button.dataset[key] === focusKey[key]));
    replacement?.focus({preventScroll:true});
  }
}

async function api(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(),15000);
  try {
    const response = await fetch(`/api/${path}`,{credentials:"same-origin",cache:"no-store",...options,headers:{"Accept":"application/json",...(options.method ? {"Content-Type":"application/json","X-Drift-CSRF":state.csrf || ""} : {}),...options.headers},signal:controller.signal});
    let body;
    try { body = await response.json(); } catch { throw new Error("本地服务未返回有效结果。请确认已启动 Drift 采集服务。"); }
    if (!response.ok) {
      const failure = new Error(body.error?.message || `本地服务返回 ${response.status}`);
      failure.code = body.error?.code;
      failure.scanId = body.error?.scan_id;
      throw failure;
    }
    return body;
  } catch (error) {
    if (error.name === "AbortError") throw new Error("等待本地服务超时。结果尚未确认；重新连接后核对已有记录。");
    throw error;
  } finally { clearTimeout(timer); }
}
function remember(scan) {
  if (!scan?.id || !Array.isArray(scan.observations)) throw new Error("采集结果格式不完整。");
  state.scans.set(scan.id,scan);
}
async function loadScan(id) {
  const response = await api(`scans/${encodeURIComponent(id)}`);
  if (availableScanId(id)) remember(response.scan);
  return response.scan;
}
const availableScanId = id => state.activeId === id || state.baseline?.id === id || state.history.some(scan => scan.id === id);
async function refreshBaseline() { const response = await api("baseline"); state.baseline = response.scan || null; }
async function syncBootstrap() {
  const response = await api("bootstrap");
  state.csrf = response.csrf_token;
  state.sources = Array.isArray(response.sources) ? response.sources : [];
  state.history = Array.isArray(response.scans) ? response.scans : [];
  state.activeId = response.active_scan_id || null;
  await refreshBaseline();
  const available = new Set([...state.history.map(scan => scan.id),state.activeId,state.baseline?.id].filter(Boolean));
  for (const id of state.scans.keys()) if (!available.has(id)) state.scans.delete(id);
  return available;
}
async function restoreCurrent(available) {
  const previous = state.currentId;
  let restored = false;
  const candidates = [...new Set([previous,state.activeId,...state.history.map(scan => scan.id),state.baseline?.id].filter(id => id && available.has(id)))];
  for (const id of candidates) {
    try {
      await loadScan(id);
      if (state.currentId !== previous) return;
      state.currentId = id;
      restored = true;
      break;
    }
    catch (error) {
      if (error.code !== "scan_not_found") throw error;
      if (state.currentId !== previous) return;
      state.scans.delete(id);
      state.history = state.history.filter(scan => scan.id !== id);
      if (state.activeId === id) state.activeId = null;
      if (state.baseline?.id === id) state.baseline = null;
    }
  }
  if (!restored) state.currentId = null;
  if (previous && previous !== state.currentId) {
    state.reveal = false;
    state.selected = null;
    announce(state.currentId ? "先前记录已不可用，已显示可用记录。" : "先前记录已不可用，当前没有可用记录。");
  }
}
function schedulePoll() {
  clearTimeout(state.pollTimer);
  if (state.activeId) state.pollTimer = setTimeout(pollScan,850);
}
async function pollScan() {
  const id = state.activeId;
  if (!id) return;
  try {
    const scan = await loadScan(id);
    if (state.activeId !== id) return;
    state.connected = true;
    if (!inProgress(scan)) {
      const available = await syncBootstrap();
      await restoreCurrent(available);
      announce(`采集结束，${Number(scan.summary?.success || 0)} 项已观测。失败或未知项请查看明细。`);
      if (scan.status === "error") state.error = scan.error ? errorText(scan.error) : "采集未完成，已有结果已保留。";
    }
    render();
    schedulePoll();
  } catch (error) {
    state.connected = false;
    state.activeId = null;
    state.error = `${error.message} 已有结果保留；重新连接后核对采集状态。`;
    render();
  }
}
async function connect() {
  state.busy = true;
  state.error = "";
  render();
  try {
    const available = await syncBootstrap();
    await restoreCurrent(available);
    state.connected = true;
    schedulePoll();
  } catch (error) {
    state.connected = false;
    state.activeId = null;
    state.error = error.message;
  } finally { state.busy = false; render(); }
}
async function startScan() {
  if (state.busy || state.activeId || state.mode !== "real") return;
  if (!state.connected) { await connect(); return; }
  state.busy = true;
  state.error = "";
  state.reveal = false;
  render();
  try {
    const browser = {timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,languages:Array.from(navigator.languages || []).slice(0,8),online:navigator.onLine};
    const response = await api("scans",{method:"POST",body:JSON.stringify({browser})});
    remember(response.scan);
    state.currentId = response.scan.id;
    state.activeId = inProgress(response.scan) ? response.scan.id : null;
    state.view = "observations";
    state.filter = "all";
    state.selected = null;
    schedulePoll();
    announce("已开始本机只读采集。");
  } catch (error) {
    if (error.code === "scan_in_progress" && error.scanId) {
      state.activeId = error.scanId;
      state.currentId = error.scanId;
      try { await loadScan(error.scanId); schedulePoll(); } catch (loadError) { state.error = loadError.message; state.activeId = null; state.connected = false; }
    } else { state.error = `${error.message} 未自动重试，请重新连接核对记录。`; state.connected = false; }
  } finally { state.busy = false; render(); }
}
async function pinBaseline() {
  const scan = currentScan();
  if (state.mode !== "real" || !scan || scan.status !== "complete" || state.busy) return;
  state.busy = true;
  state.error = "";
  render();
  try {
    await api("baseline",{method:"POST",body:JSON.stringify({scan_id:scan.id})});
    await refreshBaseline();
    announce("已将当前记录设为固定基线。");
  } catch (error) { state.error = `${error.message} 请重新连接核对基线状态。`; state.connected = false; }
  finally { state.busy = false; render(); }
}
function togglePrivacy() { state.reveal = !state.reveal; render(); announce(state.reveal ? "详细值已在本页显示。" : "本页详细值已隐藏。"); }

$("mode-select").addEventListener("change",event => {
  state.requestGeneration += 1;
  state.mode = event.target.value;
  state.reveal = false;
  state.filter = "all";
  state.selected = null;
  render();
  announce(state.mode === "demo" ? "已切换演示样本，不发起采集。" : "已切换本机实测。");
});
$("sample-select").addEventListener("change",event => { state.sample = event.target.value; state.filter = "all"; state.selected = null; render(); announce(`已切换样本 ${state.sample}`); });
$("privacy-toggle").addEventListener("click",togglePrivacy);
$("scan-button").addEventListener("click",startScan);
document.addEventListener("click",async event => {
  if (!(event.target instanceof Element)) return;
  // A click anywhere on a row selects it, unless the reader is selecting text in a value.
  const row = event.target.closest(".signal-table tbody tr");
  const button = event.target.closest("button") || (row && window.getSelection().isCollapsed ? row.querySelector("button[data-item]") : null);
  if (!button || button.disabled) return;
  if (button.dataset.view) {
    state.requestGeneration += 1;
    const fromInspector = $("inspector").contains(button);
    state.view = button.dataset.view;
    state.filter = "all";
    render();
    if (fromInspector) $("main").focus();
    announce(`已显示${titles[state.view][0]}`);
  } else if (button.dataset.filter) {
    state.filter = button.dataset.filter;
    render();
    document.querySelector(`button[data-filter="${state.filter}"]`)?.focus();
    announce(`当前显示 ${visibleItems().length} 项观测。`);
  } else if (button.dataset.item) {
    state.selected = button.dataset.item;
    $("view-content").querySelectorAll("button[data-item]").forEach(itemButton => {
      const active = itemButton.dataset.item === state.selected;
      itemButton.setAttribute("aria-pressed",String(active));
      itemButton.closest("tr").classList.toggle("selected",active);
    });
    renderInspector(true);
    if (window.matchMedia("(max-width: 1180px)").matches) {
      $("inspector").scrollIntoView({block:"start"});
      $("inspector").querySelector(".inspector-title")?.focus({preventScroll:true});
    }
    announce("观测明细已更新。");
  } else if (button.dataset.history) {
    if (state.busy) return;
    const generation = ++state.requestGeneration;
    state.busy = true;
    state.error = "";
    state.reveal = false;
    render();
    try {
      await loadScan(button.dataset.history);
      if (generation !== state.requestGeneration) return;
      if (!availableScanId(button.dataset.history) || !state.scans.has(button.dataset.history)) {
        state.error = "这份记录已不在可用记录中，请选择其他记录。";
        announce(state.error);
        return;
      }
      state.currentId = button.dataset.history;
      state.view = "observations";
      state.filter = "all";
      state.selected = null;
    } catch (error) { state.error = error.message; }
    finally { state.busy = false; render(); if (generation === state.requestGeneration) $("main").focus(); }
  } else if (button.dataset.action === "privacy") togglePrivacy();
  else if (button.dataset.action === "pin") await pinBaseline();
  else if (button.dataset.action === "show-active") { state.currentId = state.activeId; state.view = "observations"; state.filter = "all"; render(); }
  else if (button.dataset.action === "back-to-list") {
    const selected = [...$("view-content").querySelectorAll("button[data-item]")].find(item => item.dataset.item === state.selected);
    selected?.focus();
    selected?.scrollIntoView({block:"center"});
  }
});

render();
connect();
