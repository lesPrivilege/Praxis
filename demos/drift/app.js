"use strict";

const $ = id => document.getElementById(id);
const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]);
const phaseLabels = { pending:"等待采集", running:"采集中", success:"已观测", unknown:"未知", error:"失败", unsupported:"不支持" };
const scanLabels = { queued:"等待采集", running:"采集中", complete:"采集结束", error:"采集失败" };
const titles = {
  observations:["观测概览","环境观测","保留每一项的来源，也保留尚未得到的答案。"],
  baseline:["基线","有一个参照","基线由你明确选定；后续采集不会自动改写它。"],
  changes:["变化","看见不同","只比较同一来源、同一方法下成功取得的值。"],
  sources:["来源","从哪里来","不同提供方分别保留；观测边界与结果同样重要。"],
  history:["历史","回看一次观测","选中历史记录查看当时结果，不会重新发起外部请求。"]
};
const state = {
  mode:"real", view:"observations", sample:"B", filter:"all", selected:null, reveal:false,
  connected:false, busy:false, csrf:null, sources:[], history:[], scans:new Map(), currentId:null,
  activeId:null, baseline:null, error:"", pollTimer:null, requestGeneration:0
};

const demoDefinitions = [
  ["01","出口标记","edge-a","edge-b",null,"path",true],
  ["02","路径节点","node-02","node-03",null,"path",false],
  ["03","解析方式","resolver-a","resolver-a","resolver-a","signals",false],
  ["04","区域标签","zone-a","zone-a","zone-a","signals",false],
  ["05","环境标记","profile-a","profile-a","profile-a","signals",false],
  ["06","连接测量",null,null,null,"signals",false]
];
function demoScan(letter) {
  return {id:`demo-${letter}`,status:"complete",started_at:null,finished_at:null,progress:{done:2,total:2,label:"演示样本"},observations:demoDefinitions.map(([id,label,a,b,c,source,sensitive]) => {
    const value = ({A:a,B:b,C:c})[letter];
    return {id,label,group:"演示占位",source_id:`demo-${source}`,status:value === null ? "unknown" : "success",value,observed_at:null,duration_ms:null,error:null,note:"人为编写的占位内容，不对应真实设备、位置或网络。",comparison_key:`demo-${id}`,sensitive};
  })};
}
const demoSources = [
  {id:"demo-path",label:"路径样本",url:null,method:"本地静态占位",scope:"演示",limitations:"标签与路径不对应真实网络，不表示连接可达。"},
  {id:"demo-signals",label:"信号样本",url:null,method:"本地静态占位",scope:"演示",limitations:"没有读取设备。缺失值保持未知，不推断为零或正常。"}
];
const currentScan = () => state.mode === "demo" ? demoScan(state.sample) : state.scans.get(state.currentId) || null;
const baselineScan = () => state.mode === "demo" ? demoScan("A") : state.baseline;
const currentSources = () => state.mode === "demo" ? demoSources : state.sources;
const sourceFor = observation => currentSources().find(source => source.id === observation.source_id);
const inProgress = scan => scan && ["queued","running"].includes(scan.status);
const successful = observation => observation?.status === "success" && observation.value !== null && observation.value !== undefined;
const completeValue = value => value !== null && value !== undefined && (typeof value === "string" ? value.trim().length > 0 : Array.isArray(value) ? value.length > 0 && value.every(completeValue) : typeof value === "object" ? Object.keys(value).length > 0 && Object.values(value).every(completeValue) : typeof value !== "number" || Number.isFinite(value));
const canonical = value => Array.isArray(value) ? `[${value.map(canonical).join(",")}]` : value && typeof value === "object" ? `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}` : JSON.stringify(value);
const plainValue = value => value === null || value === undefined ? "—" : typeof value === "boolean" ? (value ? "是" : "否") : typeof value === "object" ? JSON.stringify(value) : String(value);
function readableValue(value, detailed) {
  const word = item => item === null || item === undefined || item === "" ? "未知" : Array.isArray(item) ? item.map(word).join("、") : typeof item === "boolean" ? (item ? "是" : "否") : String(item);
  if (!value || typeof value !== "object" || Array.isArray(value)) return word(value);
  if ("family" in value) return [value.family === "Darwin" ? "macOS" : word(value.family), word(value.version), word(value.architecture)].join(" · ");
  if ("configured" in value) return value.configured === true ? "已配置" : value.configured === false ? "未发现可读取配置" : "配置状态未知";
  const labels = {ip:"出口 IP",asn:"ASN",country:"国家标签",target:"请求目标",tls_version:"TLS 版本",cipher:"加密套件",transport_peer:"连接对端",http_status:"HTTP 状态",nameservers:"配置的 DNS 地址",addresses:"解析所得地址",timezone:"时区",languages:"语言",online:"浏览器自报在线",language:"语言",encoding:"编码",names:"时区名称",utc_offset_seconds:"UTC 偏移"};
  const lines = Object.entries(value).map(([key,item]) => {
    let text = word(item);
    if (key === "utc_offset_seconds" && Number.isFinite(item)) {
      const minutes = Math.abs(Math.trunc(item / 60));
      text = `UTC${item < 0 ? "−" : "+"}${String(Math.floor(minutes / 60)).padStart(2,"0")}:${String(minutes % 60).padStart(2,"0")}`;
    }
    return `${labels[key] || key}：${text}`;
  });
  return lines.join(detailed ? "\n" : " · ");
}
function displayValue(observation, detailed = false) {
  if (!observation) return "未设置";
  if (!successful(observation) && !(detailed && observation.value !== null && observation.value !== undefined)) return phaseLabels[observation.status] || "未知";
  if (observation.sensitive && !state.reveal) return "已隐藏";
  const value = readableValue(observation.value,detailed);
  return successful(observation) ? value : `部分结果 · ${phaseLabels[observation.status] || "未知"}\n${value}`;
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
function resultClass(item) { return !successful(item) ? (item.status === "error" ? "error" : "unknown") : comparison(item) === "changed" ? "changed" : "same"; }
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
  return ({partial_result:"只取得部分字段，未知字段不参与完整对照。",scan_failed_storage_unavailable:"采集失败，且未能保存；重新启动后可能无法恢复这些结果。",timeout:"请求超时，未取得结果；可以重新采集。",network_unavailable:"未能建立请求，请检查当前连接后重试。",tls_validation_failed:"TLS 证书校验失败；没有跳过校验。",redirect_refused:"来源返回了重定向，本次请求未继续。",http_error:"来源未返回成功响应。",provider_rejected_request:"公开服务拒绝了本次请求，可能暂不可用或受到限额限制。",invalid_provider_ip:"提供方未返回有效地址。",non_json_response:"来源返回内容不是约定的 JSON。",invalid_json_response:"来源返回的 JSON 无法解析。",response_too_large:"来源响应超出读取上限，本次结果未使用。",invalid_provider_response:"来源响应字段不完整或不符合约定。",transport_metadata_unavailable:"无法取得该 HTTPS 连接的握手明细；不能据此判断握手状态。",dns_resolution_failed:"固定目标的 DNS 解析未取得结果。",no_dns_result:"固定目标没有返回可用地址。",no_dns_configuration:"系统没有提供可读取的 DNS 配置。",dns_configuration_unavailable:"当前无法读取 DNS 配置。",os_not_supported:"当前系统尚不支持此项采集。",browser_not_reported:"本次未收到浏览器自报值。",scan_deadline_exceeded:"本次采集已到时间上限，此项没有取得结果。",scan_failed:"采集遇到错误，已取得的结果保留。",probe_failed:"此项采集失败，可重新采集。",storage_unavailable:"结果未能保存到本机私有目录；请核对后再重试。"})[code] || String(code || "未取得结果");
}
function announce(message) { $("announcement").textContent = message; }
function emptyPanel(title, body) { return `<section class="panel"><div class="empty-state"><strong>${escapeHTML(title)}</strong>${escapeHTML(body)}</div></section>`; }

function providerComparisonPanel(scan) {
  if (state.mode !== "real") return "";
  const reports = (scan.observations || []).filter(item => item.group === "egress" && ["success","unknown"].includes(item.status) && item.value && typeof item.value === "object");
  const fields = [["ip","出口地址"],["asn","ASN"],["country","国家标签"]];
  const rows = fields.map(([field,label]) => {
    const usable = reports.filter(item => item.value[field] !== null && item.value[field] !== undefined && item.value[field] !== "");
    const independent = [...new Map(usable.map(item => [item.source_id,item.value[field]])).values()];
    let text = "不足两份可用值";
    if (independent.length >= 2) {
      const families = new Set(independent.map(value => String(value).includes(":") ? 6 : 4));
      text = field === "ip" && families.size > 1 ? "地址族不同，不直接对照" : new Set(independent.map(canonical)).size === 1 ? "返回值相同" : "返回值不同";
    }
    return `<div><span>${label}</span><strong>${escapeHTML(text)}</strong><small>${independent.length} 份独立来源</small></div>`;
  });
  return `<section class="provider-comparison" aria-label="提供方逐字段对照"><h3>提供方对照</h3><div class="provider-fields">${rows.join("")}</div><p>不同目标、地址族或采集时刻可能呈现不同出口。未知字段不参与；相同值也不代表环境安全。</p></section>`;
}

function overviewPanel() {
  const scan = currentScan();
  if (!scan) return emptyPanel(state.connected ? "从一次观测开始" : "采集器尚未连接", state.connected ? "点击开始采集，记录本机信息与固定公开服务所观察的后端出口。" : "连接本地 Drift 服务后可以采集；也可以切换到演示样本查看界面。");
  const count = counts(scan);
  const sources = [...new Set((scan.observations || []).map(item => item.source_id))].length;
  return `<section class="panel" aria-labelledby="collection-title"><div class="panel-heading"><div><h2 id="collection-title">${state.mode === "demo" ? `Sample ${state.sample}` : "本次观测"}</h2><p class="panel-subheading">${escapeHTML(timeLabel(scan.started_at))}${state.mode === "real" ? " · 本地时间" : " · 占位内容"}</p></div><span class="panel-tag">${escapeHTML(scanLabels[scan.status] || "状态未知")}</span></div><div class="observation-scope"><div><span class="scope-icon" aria-hidden="true">▤</span><strong>本机环境</strong><span>系统、区域与配置</span></div><div><span class="scope-icon" aria-hidden="true">↗</span><strong>后端请求</strong><span>各提供方独立结果</span></div><div><span class="scope-icon" aria-hidden="true">◎</span><strong>浏览器提供</strong><span>时区、语言与在线状态</span></div></div><div class="scope-footnote">${state.mode === "demo" ? "演示样本没有发起任何采集。" : "后端请求结果不等于浏览器或其他应用的出口；配置不等于实际流量路径。"}</div>${providerComparisonPanel(scan)}<div class="summary-strip"><div class="summary-item"><span class="summary-number">${count.success}</span><span class="summary-label">已观测 / ${count.total} 项</span></div><div class="summary-item"><span class="summary-number amber">${count.comparable ? count.changed : "—"}</span><span class="summary-label">${!baselineScan() ? "尚未设置基线" : count.comparable ? "可确认变化" : "暂无可比项"}</span></div><div class="summary-item"><span class="summary-number">${sources}</span><span class="summary-label">独立来源</span></div></div></section>`;
}

function observationTable() {
  const scan = state.view === "baseline" ? baselineScan() : currentScan();
  if (!scan) return state.view === "changes" ? emptyPanel("还没有可比较的记录","先完成采集，再将一份记录明确设为基线。") : "";
  const isBaseline = state.view === "baseline";
  const items = visibleItems();
  const filters = state.view === "observations" ? `<div class="segmented" role="group" aria-label="筛选观测项">${[["all","全部"],["changed","有变化"],["missing","未取得"]].map(([key,label]) => `<button class="filter-button" data-filter="${key}" aria-pressed="${state.filter === key}">${label}</button>`).join("")}</div>` : "";
  let emptyTitle = "当前筛选没有观测项";
  let emptyBody = "切换到全部查看其他观测。";
  if (state.view === "changes" || state.filter === "changed") {
    emptyTitle = !baselineScan() ? "尚未设置基线" : counts().comparable ? "没有可确认的变化" : "暂无可比较的观测项";
    emptyBody = baselineScan() ? "未知、失败、不支持或方法不同的项不参与差异判断。" : "将一份完成的观测设为基线后，才能比较后续记录。";
  }
  return `<div class="section-heading" id="observation-list"><h2>${isBaseline ? "基线内容" : state.view === "changes" ? "可比较的变化" : "观测项"}<span>${items.length}</span></h2>${filters}</div><section class="panel" aria-label="观测对照">${items.length ? `<table class="signal-table live-table"><thead><tr><th scope="col">观测项<span class="table-sub">独立来源</span></th><th scope="col">${isBaseline ? "固定值" : "基线值"}</th><th scope="col">${isBaseline ? "采集时刻" : "当前值"}</th><th scope="col">${isBaseline ? "观测状态" : "对照结果"}</th></tr></thead><tbody>${items.map(item => `<tr class="${state.selected === item.id ? "selected" : ""}"><td><button class="signal-name" data-item="${escapeHTML(item.id)}" aria-pressed="${state.selected === item.id}">${escapeHTML(item.label || item.id)}</button><span class="row-source">${escapeHTML(sourceFor(item)?.label || item.source_id)}</span></td><td><span class="cell-value">${escapeHTML(displayValue(isBaseline ? item : baselineItem(item)))}</span></td><td><span class="cell-value current">${escapeHTML(isBaseline ? timeLabel(item.observed_at,true) : displayValue(item))}</span></td><td><span class="status ${isBaseline ? (successful(item) ? "same" : "unknown") : resultClass(item)}">${escapeHTML(isBaseline ? phaseLabels[item.status] || "未知" : resultLabel(item))}</span></td></tr>`).join("")}</tbody></table>` : `<div class="empty-state"><strong>${escapeHTML(emptyTitle)}</strong>${escapeHTML(emptyBody)}</div>`}<div class="table-footer"><span>选择观测项查看来源与方法</span><span>未取得结果 ≠ 正常</span></div></section>`;
}

function baselinePanel() {
  const baseline = baselineScan();
  const scan = currentScan();
  return `<section class="panel"><div class="baseline-card"><div class="baseline-top"><div><span class="eyebrow">REFERENCE OBSERVATION</span><h2>${baseline ? escapeHTML(state.mode === "demo" ? "Sample A" : timeLabel(baseline.started_at,true)) : "尚未设置基线"}</h2></div><span class="detail-icon" aria-hidden="true">⌁</span></div><p>${baseline ? "这份记录作为固定参照。选择历史记录或重新采集不会改写它。" : "先完成一次采集，检查观测结果，再将它设为后续比较的参照。"}</p>${state.mode === "real" ? `<button class="quiet-button baseline-pin" data-action="pin" ${!scan || scan.status !== "complete" || state.busy || scan.id === baseline?.id ? "disabled" : ""}>${scan?.id === baseline?.id ? "当前记录就是基线" : baseline ? "用当前记录替换基线" : "将当前记录设为基线"}</button>` : ""}</div><div class="baseline-note">只有同一来源、同一方法下成功取得的值才参与比较。基线中的失败或未知值仍保留原状态。</div></section>${baseline ? observationTable() : ""}`;
}

function sourcePanel() {
  const sources = currentSources();
  if (!sources.length) return emptyPanel("来源尚不可用","连接本地采集器后会列出固定来源、请求方式与测量边界。");
  return `<p class="view-note">本机结果、浏览器提供值与公开服务的观测分别保存。提供方的地区与组织信息可能不同，不能由相同国家标签推断环境状态。</p><section class="panel">${sources.map(source => {
    const link = safeLink(source.url);
    return `<article class="source-card"><div class="source-card-head"><h2>${escapeHTML(source.label)}</h2><span class="panel-tag">${escapeHTML(source.scope || "独立来源")}</span></div><p>${escapeHTML(source.method || "方法未提供")}</p><p>${escapeHTML(Array.isArray(source.limitations) ? source.limitations.join("；") : source.limitations || "边界未提供")}</p><div class="source-stamp"><span>${escapeHTML(source.id)}</span>${link ? `<a href="${escapeHTML(link)}" target="_blank" rel="noopener noreferrer">来源地址 ↗</a>` : "<span>本地来源</span>"}</div></article>`;
  }).join("")}</section>`;
}

function historyPanel() {
  if (state.mode === "demo") return emptyPanel("演示模式不产生历史记录","切换本机实测后，完成的采集会保存在本机私有数据目录。");
  if (!state.history.length) return emptyPanel("还没有历史记录","采集结束后单独保存；重试会创建新记录，不覆盖上次失败。");
  return `<p class="view-note">选择一份记录查看详情。详细值默认隐藏；记录仅保存在本机。</p><section class="panel history-list">${state.history.map(scan => `<button class="history-item ${scan.id === state.currentId ? "selected" : ""}" data-history="${escapeHTML(scan.id)}" aria-pressed="${scan.id === state.currentId}" ${state.busy ? "disabled" : ""}><span><strong>${escapeHTML(timeLabel(scan.started_at))}</strong><small>${escapeHTML(scanLabels[scan.status] || "状态未知")}${scan.id === state.baseline?.id ? " · 固定基线" : ""}</small></span><span>${Number(scan.summary?.success || 0)} 项已观测 <span aria-hidden="true">↗</span></span></button>`).join("")}</section>`;
}

function informationalInspector(title, body) {
  return `<div class="inspector-heading"><span>阅读提示</span></div><div class="inspector-body"><div class="detail-intro"><div class="detail-icon" aria-hidden="true">◇</div><h2>${escapeHTML(title)}</h2><p class="detail-description">${escapeHTML(body)}</p></div></div>`;
}
function renderInspector() {
  if (state.view === "sources") {
    $("inspector").innerHTML = informationalInspector("区分观测范围","后端 HTTPS 握手只描述本机采集进程的连接，不是浏览器指纹。DNS 配置不证明解析器实际出口；失败、未知与不支持分别保留。");
    return;
  }
  if (state.view === "history") {
    $("inspector").innerHTML = informationalInspector("保留每次结果","选择记录只切换查看对象。设置基线需要独立操作；重新采集不会自动覆盖参照。");
    return;
  }
  const items = visibleItems();
  const item = items.find(item => item.id === state.selected);
  if (!item) {
    $("inspector").innerHTML = informationalInspector("当前没有选中项",currentScan() ? "当前列表没有可查看的项。未知与失败不计作已确认变化。" : "完成采集后，可以在这里查看每项的实际值、来源、采集时刻与限制。");
    return;
  }
  const baseline = state.view === "baseline";
  const source = sourceFor(item);
  const previous = baselineItem(item);
  $("inspector").innerHTML = `<div class="inspector-heading"><span>${baseline ? "基线明细" : "观测明细"}</span><span>${item.sensitive ? "默认隐藏" : "只读"}</span></div><div class="inspector-body"><div class="detail-intro"><h2 class="inspector-title" tabindex="-1">${escapeHTML(item.label || item.id)}</h2><span class="status ${baseline ? (successful(item) ? "same" : "unknown") : resultClass(item)}">${escapeHTML(baseline ? phaseLabels[item.status] || "未知" : resultLabel(item))}</span><p class="detail-description">${escapeHTML(item.note || source?.limitations || "未提供额外说明。")}</p>${item.error ? `<p class="item-error">${escapeHTML(errorText(item.error))}</p>` : ""}</div><div><p class="inspector-label">${baseline ? "基线值" : "当前观测值"}</p><pre class="detail-value">${escapeHTML(displayValue(item,true))}</pre>${item.sensitive ? `<button class="text-button" data-action="privacy">${state.reveal ? "隐藏详细值" : "显示详细值"}</button>` : ""}${!baseline && previous ? `<p class="inspector-label baseline-detail-label">固定基线</p><pre class="detail-value baseline-value">${escapeHTML(displayValue(previous,true))}</pre>` : ""}${!baseline && successful(item) && baselineScan() && comparison(item) === "unavailable" ? `<p class="detail-description">此项不可比较：基线缺项、未成功取得值或方法已变化。</p>` : ""}</div><div class="detail-section"><p class="inspector-label">采集信息</p><div class="detail-meta"><span>采集时刻</span><strong>${escapeHTML(timeLabel(item.observed_at))}</strong></div><div class="detail-meta"><span>耗时</span><strong>${Number.isFinite(item.duration_ms) ? `${Math.round(item.duration_ms)} ms` : "—"}</strong></div><div class="detail-meta"><span>观测来源</span><strong>${escapeHTML(source?.label || item.source_id)}</strong></div></div><div class="detail-section"><p class="inspector-label">方法与边界</p><p class="detail-description">${escapeHTML(source?.method || "方法未提供")}</p><button class="source-link" data-view="sources"><span>查看来源与测量限制</span><span aria-hidden="true">↗</span></button></div></div><div class="inspector-footnote">${state.mode === "demo" ? "此值来自演示样本，不对应真实环境。" : "只描述这一次观测，不代表浏览器、其他应用或未来连接。"}<button class="text-button back-to-list" data-action="back-to-list">返回观测列表 ↑</button></div>`;
}

function renderChrome() {
  const scan = currentScan();
  const active = state.scans.get(state.activeId);
  const real = state.mode === "real";
  const count = counts();
  $("workspace-name").innerHTML = real ? "Local workspace<small>本机观测空间</small>" : "Playground<small>演示样本空间</small>";
  $("breadcrumb-workspace").textContent = real ? "Local" : "Playground";
  $("mode-badge").textContent = !real ? "演示数据" : scan ? "本机实测" : "尚未采集";
  $("collector-state").textContent = !real ? "演示模式" : state.connected ? "本地采集器已连接" : "未连接采集器";
  $("scope-notice").textContent = !real ? (state.activeId ? "演示模式不会新增采集；先前发起的本机采集仍在后台进行。" : "演示样本不会读取设备、网络或账号信息。") : "采集由本机后端执行，公开服务会收到该请求的出口地址。详细值默认隐藏；不修改系统配置。";
  $("footer-scope").textContent = !real ? "演示数据 · 不产生采集或历史记录" : "本机私有记录 · 后端观测不等于其他应用出口";
  $("sample-picker").hidden = real;
  $("privacy-toggle").textContent = state.reveal ? "隐藏详细值" : "显示详细值";
  $("privacy-toggle").setAttribute("aria-pressed",String(state.reveal));
  const start = $("scan-button");
  start.hidden = !real;
  start.disabled = state.busy || Boolean(state.activeId);
  start.textContent = state.busy ? "处理中" : state.activeId ? "采集中" : !state.connected ? "重新连接" : scan ? "重新采集" : "开始采集";
  $("observation-count").textContent = scan ? String(count.total) : "—";
  $("change-count").textContent = scan && count.comparable ? String(count.changed) : "—";
  const bar = $("collection-bar");
  bar.hidden = !real || !active;
  if (real && active) {
    const progress = active.progress || {done:0,total:1,label:"等待结果"};
    const done = Math.max(0,Number(progress.done) || 0);
    const total = Math.max(done,Number(progress.total) || 1);
    bar.innerHTML = `<div><strong>${escapeHTML(progress.label || scanLabels[active.status])}</strong><span>${done} / ${total} 项任务完成</span></div><progress value="${done}" max="${total}" aria-label="采集任务进度">${done} / ${total}</progress>${active.id !== state.currentId ? '<button class="text-button" data-action="show-active">查看进行中的采集 ↗</button>' : ""}`;
  }
  $("operation-error").hidden = !state.error || !real;
  $("operation-error").textContent = state.error;
}

function render() {
  const focused = document.activeElement;
  const focusKey = focused?.dataset ? {item:focused.dataset.item,filter:focused.dataset.filter,action:focused.dataset.action,view:focused.dataset.view,inspector:$("inspector").contains(focused),title:focused.classList.contains("inspector-title")} : null;
  const [label,title,description] = titles[state.view];
  $("breadcrumb-current").textContent = label;
  $("page-title").innerHTML = `${escapeHTML(title)}<span class="title-dot">.</span>`;
  $("page-description").textContent = description;
  document.title = `Drift — ${label}`;
  document.querySelectorAll(".nav-item").forEach(button => {
    const active = button.dataset.view === state.view;
    button.classList.toggle("active",active);
    if (active) button.setAttribute("aria-current","page"); else button.removeAttribute("aria-current");
  });
  const visible = visibleItems();
  if (!visible.some(item => item.id === state.selected)) state.selected = visible[0]?.id || null;
  renderChrome();
  $("view-content").innerHTML = state.view === "observations" ? overviewPanel() + observationTable() : state.view === "baseline" ? baselinePanel() : state.view === "changes" ? observationTable() || emptyPanel("尚未采集","先取得一份观测，再设置参照进行比较。") : state.view === "history" ? historyPanel() : sourcePanel();
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
  const summary = {id:scan.id,started_at:scan.started_at,finished_at:scan.finished_at,status:scan.status,summary:scan.summary};
  state.history = [summary,...state.history.filter(item => item.id !== scan.id)].sort((a,b) => String(b.started_at).localeCompare(String(a.started_at)));
}
async function loadScan(id) {
  const response = await api(`scans/${encodeURIComponent(id)}`);
  remember(response.scan);
  return response.scan;
}
async function refreshBaseline() { const response = await api("baseline"); state.baseline = response.scan || null; }
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
      state.activeId = null;
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
    const response = await api("bootstrap");
    state.csrf = response.csrf_token;
    state.sources = Array.isArray(response.sources) ? response.sources : [];
    state.history = Array.isArray(response.scans) ? response.scans : [];
    state.activeId = response.active_scan_id || null;
    state.connected = true;
    await refreshBaseline();
    const id = state.activeId || state.currentId || state.history[0]?.id;
    if (id) { await loadScan(id); state.currentId = id; }
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
function togglePrivacy() { state.reveal = !state.reveal; render(); announce(state.reveal ? "详细值已在本页显示。" : "详细值已隐藏。"); }

$("mode-select").addEventListener("change",event => {
  state.requestGeneration += 1;
  state.mode = event.target.value;
  state.reveal = false;
  state.filter = "all";
  state.selected = null;
  render();
  announce(state.mode === "demo" ? "已切换演示样本，不发起采集。" : "已切换本机实测。");
});
$("sample-select").addEventListener("change",event => { state.sample = event.target.value; state.filter = "all"; state.selected = null; render(); announce(`已切换 Sample ${state.sample}`); });
$("privacy-toggle").addEventListener("click",togglePrivacy);
$("scan-button").addEventListener("click",startScan);
document.addEventListener("click",async event => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest("button");
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
    renderInspector();
    if (window.matchMedia("(max-width: 1000px)").matches) {
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
