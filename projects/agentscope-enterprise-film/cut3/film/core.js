/* Shared native SVG primitives. Scene geometry and semantic motion remain local. */
(function(){'use strict';
 const NS='http://www.w3.org/2000/svg',registry=new Map();let seq=0;
 const C={paper:'#f6f8fb',card:'#ffffff',ink:'#182630',muted:'#617284',blue:'#255bec',line:'#bdc9d5',edge:'#d3dce6',frame:'#8d9cad',slate:'#7d8ea1',pale:'#e9f0fb'};
 function el(p,tag,a={},value){const n=document.createElementNS(NS,tag);set(n,a);if(value!=null)n.textContent=value;p.appendChild(n);return n;}
 function set(n,a){for(const [k,v] of Object.entries(a)){if(v==null)n.removeAttribute(k);else n.setAttribute(k,String(v));}return n;}
 function text(p,x,y,value,size=32,o={}){const n=el(p,'text',{x,y,fill:o.fill||C.ink,'font-size':size,'font-weight':o.weight||450,'text-anchor':o.anchor||'start','font-family':o.mono?'"SFMono-Regular",Menlo,"PingFang SC",monospace':'"PingFang SC","Helvetica Neue",sans-serif','data-reading-key':o.key||'svg-text-'+seq++,'data-reading':o.role||'content'},value);return n;}
 function show(n,a){n.setAttribute('opacity',String(Number(a)));return n;}
 function move(n,x,y,s=1){return set(n,{transform:`translate(${x} ${y}) scale(${s})`});}
 const curve=gsap.parseEase('power3.inOut');
 const V=window.V3={C,registry,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,el,set,text,show,move,
  group:(p,id)=>el(p,'g',id?{'data-object':id}:{}),
  rect:(p,x,y,w,h,a={})=>el(p,'rect',{x,y,width:w,height:h,fill:'none',rx:h>=40&&w>=40?10:null,...a}),
  line:(p,x1,y1,x2,y2,a={})=>el(p,'line',{x1,y1,x2,y2,stroke:C.line,'stroke-width':2,...a}),
  circle:(p,cx,cy,r,a={})=>el(p,'circle',{cx,cy,r,fill:'none',...a}),
  path:(p,d,a={})=>el(p,'path',{d,fill:'none',stroke:C.line,'stroke-width':2,...a}),
  p:(t,at,d=1.8)=>{if(!Number.isFinite(at))return 0;const q=Math.max(0,Math.min(1,(t-at)/d));return V.reduced?(q===1?1:0):curve(q);},
  lerp:(a,b,q)=>a+(b-a)*q,
  // Filled arrowheads without outline, sized in user space so stroke width does not scale them.
  arrows(svg,key){const defs=el(svg,'defs',{}),ids={};for(const [name,color] of [['blue',C.blue],['slate',C.slate],['ink',C.ink],['muted',C.muted]]){const id=`arrow-${key}-${name}`;const m=el(defs,'marker',{id,viewBox:'0 0 12 12',refX:11,refY:6,markerWidth:15,markerHeight:15,markerUnits:'userSpaceOnUse',orient:'auto-start-reverse'});el(m,'path',{d:'M0 0.5 L12 6 L0 11.5 L3 6 Z',fill:color,stroke:'none'});ids[name]=`url(#${id})`;}return ids;},
  // Orthogonal polyline with rounded corners.
  route(pts,r=14){let d=`M${pts[0][0]} ${pts[0][1]}`;for(let i=1;i<pts.length-1;i++){const [px,py]=pts[i-1],[x,y]=pts[i],[nx,ny]=pts[i+1];const a=Math.min(r,Math.hypot(x-px,y-py)/2),b=Math.min(r,Math.hypot(nx-x,ny-y)/2);const ux=Math.sign(x-px),uy=Math.sign(y-py),vx=Math.sign(nx-x),vy=Math.sign(ny-y);d+=` L${x-ux*a} ${y-uy*a} Q${x} ${y} ${x+vx*b} ${y+vy*b}`;}const z=pts.at(-1);return d+` L${z[0]} ${z[1]}`;},
  note:s=>{const e=document.getElementById('note'),v=s||'';if(e.textContent!==v)e.textContent=v;},
  register:(id,spec)=>{if(registry.has(id))throw Error('Duplicate scene '+id);registry.set(id,{id,...spec});}
 };
})();
