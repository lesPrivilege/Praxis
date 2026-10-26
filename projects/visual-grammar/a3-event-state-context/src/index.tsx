import React from 'react';
import {Composition,registerRoot,AbsoluteFill,useCurrentFrame,useVideoConfig,interpolate,Easing} from 'remotion';
import {BEATS,FIELDS,movieAt} from './model.mjs';
const colors={bg:'#0c141c',ink:'#eef2f5',muted:'#a9b8c7',line:'#30414f',event:'#63d6bd',state:'#81b9ff',context:'#f3ca76',danger:'#f3a59c'};
const sans='-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif';
const mono='ui-monospace, SFMono-Regular, Menlo, monospace';
const Txt=({x,y,children,size=28,fill=colors.ink,anchor='start',font=sans,weight=400,opacity=1}:any)=><text x={x} y={y} fill={fill} fontSize={size} textAnchor={anchor} fontFamily={font} fontWeight={weight} opacity={opacity}>{children}</text>;
const ease=Easing.bezier(.77,0,.175,1);
const p=(t:number,start:number,duration:number)=>interpolate(t,[start,start+duration],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:ease});
export const Film=()=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps;
 const m:any=movieAt(t), b=m.beat, c=m.context;
 const local=t-b.start, entry=p(t,b.start,.7);
 const changedTerm=t>=16&&t<25,changedPayment=t>=45&&t<57;
 const logTop=438, rowH=59, stateTop=476, fieldH=66;
 const unique=m.log.length;
 const intro=t<7;
 const showProjection=t>=34;
 const stale=c&&!c.current;
 const derive=changedTerm||changedPayment;
 const travel=p(local,0,1.8),travelOpacity=derive&&local<2.6?Math.min(1,p(local,0,.2)* (1-p(local,2.1,.5))):0;
 const sourceY=changedTerm?logTop+2*rowH-14:logTop+5*rowH-14;
 const targetY=changedTerm?stateTop+1*fieldH+8:stateTop+2*fieldH+8;
 const bulletX=610+(735-610)*travel,bulletY=sourceY+(targetY-sourceY)*travel;
 const candidate=m.candidates['cand-04'];
 return <AbsoluteFill style={{backgroundColor:colors.bg,fontFamily:sans}}>
  <svg width="1920" height="1080" viewBox="0 0 1920 1080" role="img" aria-label="事件日志经生效规则折叠为状态，状态按任务投影为上下文">
   <defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="#17222d" strokeWidth="1"/></pattern><marker id="arrowS" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,1 L8,5 L0,9" fill="none" stroke={colors.state} strokeWidth="1.5"/></marker><marker id="arrowC" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,1 L8,5 L0,9" fill="none" stroke={colors.context} strokeWidth="1.5"/></marker></defs>
   <rect width="1920" height="1080" fill="url(#grid)"/>
   <path d="M120 96 H1800" stroke={colors.line}/>
   <Txt x={120} y={70} size={23} fill={colors.event}>机制演算 / 01</Txt>
   <Txt x={1800} y={70} size={22} fill={colors.muted} anchor="end">合成示例 · M-0417 · 非产品实装</Txt>
   <g opacity={.3+.7*entry} transform={`translate(0,${12*(1-entry)})`}>
    <Txt x={120} y={192} size={62} weight={500}>{b.title}</Txt>
    <Txt x={120} y={284} size={51} fill={intro?colors.ink:t>=34?colors.context:colors.state} font='Georgia, "Times New Roman", "PingFang SC", serif'>{b.formula}</Txt>
    <Txt x={1800} y={278} size={21} fill={colors.muted} anchor="end">{intro?'fold：按规则折叠  ·  π：按任务选择':t>=77?'一个对象，两个派生边界':`${BEATS.findIndex((x:any)=>x.start===b.start)+1} / 9`}</Txt>
   </g>
   <path d="M120 326 H1800" stroke={colors.line}/>
   <Txt x={120} y={379} size={34} fill={colors.event}>L  事件日志</Txt>
   <Txt x={120} y={412} size={21} fill={colors.muted}>只追加 · {unique} 条唯一事件</Txt>
   <path d="M127 444 V800" stroke={colors.line} strokeWidth="2"/>
   {m.log.map((e:any,i:number)=>{
    const latest=i===unique-1;
    const reject=e.kind==='reject';
    return <g key={e.id}>
     <circle cx="127" cy={logTop+i*rowH-10} r="5" fill={latest?colors.event:colors.line}/>
     <Txt x={149} y={logTop+i*rowH} size={20} fill={colors.event} font={mono}>{e.id}</Txt>
     <Txt x={265} y={logTop+i*rowH} size={27} fill={reject?colors.danger:colors.ink}>{e.label}</Txt>
     <Txt x={265} y={logTop+i*rowH+24} size={17} fill={colors.muted}>{e.kind==='pending'?'候选提出记录':e.kind==='approve'?'人工决定 · 生效':reject?'拒绝记录 · 状态未变':'生效记录'}</Txt>
    </g>
   })}
   {t>=57&&t<66?<g opacity={p(local,0,.4)}><rect x="142" y="822" width="465" height="54" rx="6" fill="#132e2d" stroke={colors.event}/><Txt x={165} y={857} size={25} fill={colors.event}>evt-003 已存在 → 不追加</Txt></g>:candidate?<g><Txt x={149} y={842} size={22} fill={candidate.status==='rejected'?colors.danger:colors.context}>{candidate.status==='rejected'?'cand-04 已拒绝 · 付款未变':'cand-04 待审 · 付款未变'}</Txt><Txt x={149} y={871} size={19} fill={colors.muted}>{candidate.status==='rejected'?'与已签附件的付款节奏冲突':'一次性预付尚未生效'}</Txt></g>:t>=7&&t<16?<Txt x={149} y={633} size={23} fill={colors.context}>cand-02 待审 · 12 个月仍生效</Txt>:null}
   <Txt x={765} y={379} size={34} fill={colors.state}>Sᵥ  当前状态</Txt>
   <Txt x={765} y={412} size={21} fill={colors.muted}>M-0417 @ v{m.version}</Txt>
   <rect x="742" y="439" width="460" height="326" rx="9" fill="#111f2d" stroke={colors.state} strokeOpacity=".6"/>
   {FIELDS.map((f:any,i:number)=>{
    const y=stateTop+i*fieldH;
    const changed=(changedTerm&&f.key==='term')||(changedPayment&&f.key==='payment');
    const omitted=t>=66&&f.key==='term';
    return <g key={f.key}>
     {i>0?<path d={`M765 ${y-25} H1176`} stroke={colors.line}/>:null}
     {(changed||omitted)?<rect x="752" y={y-19} width="438" height="56" rx="4" fill={colors.state} fillOpacity={changed?.12:.06} stroke={omitted?colors.state:'none'}/>:null}
     <Txt x={768} y={y+12} size={24} fill={colors.muted}>{f.label}</Txt><Txt x={1007} y={y+12} size={32} fill={colors.state}>{m.state[f.key]}</Txt>
    </g>
   })}
   <Txt x={765} y={816} size={25} fill={colors.state}>{derive?`生效变化 → v${m.version}`:'只有生效变化，才更新事实。'}</Txt>
   <Txt x={765} y={853} size={21} fill={colors.muted}>{t>=66?'期限仍为 24 个月。':'候选与拒绝，各自留在日志。'}</Txt>
   <path d="M610 560 C660 560 682 560 718 560" fill="none" stroke={colors.state} strokeWidth="2" markerEnd="url(#arrowS)"/>
   <Txt x={665} y={528} size={23} fill={colors.state} anchor="middle" font="Georgia,serif">fold</Txt>
   <Txt x={665} y={602} size={17} fill={colors.muted} anchor="middle">生效规则</Txt>
   {derive?<g opacity={travelOpacity}><path d={`M607 ${sourceY} Q670 ${sourceY} 735 ${targetY}`} stroke={colors.state} strokeWidth="2" fill="none" strokeDasharray="5 6"/><circle cx={bulletX} cy={bulletY} r="9" fill={colors.state}/></g>:null}
   <Txt x={1404} y={379} size={34} fill={colors.context}>Cₜ  本次上下文</Txt>
   <Txt x={1404} y={412} size={21} fill={colors.muted}>{c?`${c.id} · ${c.task}`:'等待一次具体任务'}</Txt>
   <rect x="1380" y="439" width="420" height="326" rx="9" fill="#24251e" stroke={stale?colors.danger:colors.context} strokeOpacity=".6" strokeDasharray={stale?'8 7':'none'}/>
   {c?<>
    {Object.entries(c.values).map(([key,value]:any,i:number)=><g key={key} opacity={p(t,b.start+i*.15,.55)}><Txt x={1406} y={484+i*80} size={22} fill={colors.muted}>{FIELDS.find((f:any)=>f.key===key)?.label}</Txt><Txt x={1542} y={484+i*80} size={31} fill={colors.context}>{value}</Txt></g>)}
    {c.evidence?<><Txt x={1406} y={565} size={22} fill={colors.muted}>证据</Txt><Txt x={1406} y={608} size={23} fill={colors.context} font={mono}>src-contract-v3</Txt><Txt x={1406} y={650} size={21} fill={colors.muted}>合成附件 · 与付款修正关联</Txt></>:<><Txt x={1406} y={647} size={22} fill={colors.muted}>未选：付款、事项状态</Txt><Txt x={1406} y={683} size={21} fill={colors.muted}>不改变左侧的当前事实。</Txt></>}
    <path d="M1404 710 H1776" stroke={colors.line}/>
    <Txt x={1406} y={742} size={22} fill={stale?colors.danger:colors.context}>依据 v{c.basis} / 当前 v{m.version} · {stale?'过期':'有效'}</Txt>
    <Txt x={1404} y={816} size={stale?25:23} fill={stale?colors.danger:colors.context}>{stale?'basis.current = false':t>=66?'未选：期限、对方':'投影是一份选择，不是搬移。'}</Txt>
    <Txt x={1404} y={853} size={21} fill={colors.muted}>{stale?'本例决定入口暂停。':t>=66?'输入适用，不代表接受授权。':'输入适用，不代表接受授权。'}</Txt>
   </>:<><Txt x={1590} y={575} size={45} fill={colors.context} anchor="middle">πₜ</Txt><Txt x={1590} y={635} size={25} fill={colors.muted} anchor="middle">按任务选择状态与证据</Txt><Txt x={1590} y={681} size={22} fill={colors.muted} anchor="middle">状态存在，也可以还没有上下文。</Txt></>}
   <path d="M1227 560 H1355" stroke={stale?colors.danger:colors.context} strokeWidth="2" strokeDasharray={stale?'6 6':'none'} markerEnd={stale?undefined:'url(#arrowC)'} opacity={showProjection?1:.32}/>
   <Txt x={1290} y={528} size={25} fill={colors.context} anchor="middle" font="Georgia,serif">πₜ</Txt>
   <Txt x={1290} y={602} size={17} fill={stale?colors.danger:colors.muted} anchor="middle">{stale?'待重建':'任务选择'}</Txt>
   {stale?<><path d="M1278 547 L1302 573 M1302 547 L1278 573" stroke={colors.danger} strokeWidth="3"/></>:null}
   {showProjection&&local<2.6&&!stale?<circle cx={1227+128*p(local,0,1.5)} cy="560" r="7" fill={colors.context} opacity={1-p(local,2,.6)}/>:null}
   <rect x="120" y="937" width="1680" height="79" rx="7" fill="#182630"/>
   <Txt x={960} y={987} size={32} anchor="middle" fill={colors.ink}>{m.caption}</Txt>
   <path d="M120 1040 H1800" stroke={colors.line} strokeWidth="2"/>
   <path d={`M120 1040 H${120+1680*t/84}`} stroke={colors.state} strokeWidth="2"/>
   <Txt x={120} y={1066} size={17} fill={colors.muted}>Praxis A3 · VG-01 合成 fixture 改编 · 2026-10-02</Txt>
   <Txt x={1800} y={1066} size={17} fill={colors.muted} anchor="end">{Math.floor(t).toString().padStart(2,'0')} / 84 s</Txt>
  </svg>
 </AbsoluteFill>;
};
const Root=()=> <Composition id="Mechanism" component={Film} durationInFrames={2520} fps={30} width={1920} height={1080}/>;
registerRoot(Root);
