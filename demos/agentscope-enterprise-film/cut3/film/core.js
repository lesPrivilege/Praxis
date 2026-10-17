/* Shared native SVG primitives. Scene geometry and semantic motion remain local. */
(function(){'use strict';
 const NS='http://www.w3.org/2000/svg',registry=new Map();let seq=0;
 const C={paper:'#f6f8fb',ink:'#182630',muted:'#617284',blue:'#255bec',line:'#bdc9d5',pale:'#e7eef8'};
 function el(p,tag,a={},value){const n=document.createElementNS(NS,tag);set(n,a);if(value!=null)n.textContent=value;p.appendChild(n);return n;}
 function set(n,a){for(const [k,v] of Object.entries(a)){if(v==null)n.removeAttribute(k);else n.setAttribute(k,String(v));}return n;}
 function text(p,x,y,value,size=32,o={}){const n=el(p,'text',{x,y,fill:o.fill||C.ink,'font-size':size,'font-weight':o.weight||450,'text-anchor':o.anchor||'start','font-family':o.mono?'"SFMono-Regular",Menlo,"PingFang SC",monospace':'"PingFang SC","Helvetica Neue",sans-serif','data-reading-key':o.key||'svg-text-'+seq++,'data-reading':o.role||'content'},value);return n;}
 function show(n,a){n.setAttribute('opacity',String(Number(a)));return n;}
 function move(n,x,y,s=1){return set(n,{transform:`translate(${x} ${y}) scale(${s})`});}
 const curve=gsap.parseEase('power3.inOut');
 const V=window.V3={C,registry,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,el,set,text,show,move,
  group:(p,id)=>el(p,'g',id?{'data-object':id}:{}),
  rect:(p,x,y,w,h,a={})=>el(p,'rect',{x,y,width:w,height:h,fill:'none',...a}),
  line:(p,x1,y1,x2,y2,a={})=>el(p,'line',{x1,y1,x2,y2,stroke:C.line,'stroke-width':2,...a}),
  circle:(p,cx,cy,r,a={})=>el(p,'circle',{cx,cy,r,fill:'none',...a}),
  path:(p,d,a={})=>el(p,'path',{d,fill:'none',stroke:C.line,'stroke-width':2,...a}),
  p:(t,at,d=1.8)=>{if(!Number.isFinite(at))return 0;const q=Math.max(0,Math.min(1,(t-at)/d));return V.reduced?(q===1?1:0):curve(q);},
  lerp:(a,b,q)=>a+(b-a)*q,
  note:s=>{const e=document.getElementById('note'),v=s||'';if(e.textContent!==v)e.textContent=v;},
  register:(id,spec)=>{if(registry.has(id))throw Error('Duplicate scene '+id);registry.set(id,{id,...spec});}
 };
})();
