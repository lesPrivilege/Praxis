(function(){
 const {box,el,svg,path,show,draw}=K;
 const tx=(p,c,x,y,w,t,at)=>{const e=box(p,'atom '+c,x,y,w,null,t);show(e,at,{duration:.6,y:14,stagger:0});return e;};
 const bg=(p,c,x,y,w,h,at)=>{const e=box(p,c,x,y,w,h);show(e,at,{duration:.6,y:0,stagger:0});return e;};
 STORY.scenes.forEach((s,idx)=>{
 const seg=Film.seg(s.id),T=a=>seg.start+a;
 Film.scene(s.id,seg.start,seg.end,({root})=>{
 root.classList.add(s.dark?'dark':'paper');
 el(root,'chrome-chapter',s.chapter.join(' · '));el(root,'chrome-badge scene-no',String(idx+1).padStart(2,'0')+' / '+STORY.scenes.length);
 const hd=el(root,'heading',s.title);show(hd,T(0),{duration:.8,y:12,stagger:0});
 const lead=el(root,'lead',s.lead);show(lead,T(s.leadAt),{duration:.6,y:10,stagger:0});
 el(root,'source',s.sourceLine||'');const d=el(root,'diagram'),layer=svg(d,'routes',1744,548);
 const line=(p,at)=>{const q=path(layer,p,'',{'fill':'none','stroke':s.dark?'#75c9bf':'#006d77','stroke-width':3,'marker-end':'url(#arrow-'+s.id+')'});draw(q,T(at),{duration:.7,stagger:0});};
 const pulse=(x1,y,x2,at)=>{const c=K.sv(layer,'circle',{cx:x1,cy:y,r:6,fill:s.dark?'#75c9bf':'#006d77'});gsap.set(c,{autoAlpha:0});K.tl.set(c,{autoAlpha:1},T(at));K.tl.to(c,{attr:{cx:x2},duration:.65,ease:'power2.inOut'},T(at));K.tl.set(c,{autoAlpha:0},T(at+.7));};
 const defs=K.sv(layer,'defs');const marker=K.sv(defs,'marker',{id:'arrow-'+s.id,markerWidth:8,markerHeight:8,refX:6,refY:3,orient:'auto',markerUnits:'strokeWidth'});K.sv(marker,'path',{d:'M0 0 L6 3 L0 6',fill:'none',stroke:s.dark?'#75c9bf':'#006d77','stroke-width':1.2});
 if(s.kind==='branch') {bg(d,'box-bg',600,0,544,120,T(s.centerAt));tx(d,'label',624,32,496,'待执行工具调用',T(s.centerAt));}
 s.items.forEach((it,i)=>{
 let x=0,y=i*128,w=1728;
 if(s.kind==='flow'){x=i*(1744/s.items.length);y=40;w=1744/s.items.length-36;}
 else if(s.kind==='loop'){x=[0,1124,1124,0][i];y=[0,0,290,290][i];w=600;}
 else if(s.kind==='compare'){x=(i%2)*892;y=Math.floor(i/2)*250;w=820;}
 else if(s.kind==='stack'){y=i*172;w=1728;}
 else if(s.kind==='merge'){x=i<2?0:1100;y=i<2?i*280:140;w=620;}
 else if(s.kind==='branch'){x=i*582;y=220;w=530;}
 else if(s.kind==='replay'){x=i<3?i*582:0;y=i<3?25:380;w=i<3?535:1728;}
 if(['flow','loop','merge','branch','replay'].includes(s.kind)){
 const h=s.kind==='flow'?370:(s.kind==='replay'?(i===3?145:292):224);
 bg(d,'box-bg',x,y,w,h,T(it.labelAt));tx(d,'label',x+26,y+25,w-52,it.label,T(it.labelAt));tx(d,'detail',x+(s.kind==='replay'&&i===3?520:26),y+(s.kind==='replay'&&i===3?26:100),w-(s.kind==='replay'&&i===3?550:52),it.detail,T(it.detailAt));
 if(s.kind==='replay'&&i>0&&i<3)line(`M${x-33} ${y+66} H${x-8}`,it.labelAt);
 if(s.kind==='replay'&&i===3)line('M1430 317 V364',it.labelAt);
 if(s.kind==='flow'&&i>0){line(`M${x-33} ${y+66} H${x-8}`,it.labelAt);pulse(x-34,y+66,x-7,it.labelAt);}
 if(s.kind==='loop')line(['M600 110 H1108','M1424 224 V274','M1124 404 H616','M300 290 V240'][i],it.detailAt);
 if(s.kind==='merge'&&i===2){line('M620 110 H860 V244 H1084',it.labelAt);line('M620 390 H860 V244 H1084',it.labelAt);}
 if(s.kind==='branch')line(`M872 120 V160 H${x+w/2} V204`,it.labelAt);
 }else if(s.kind==='compare'){
 bg(d,'soft-bg',x,y,w,212,T(it.labelAt));tx(d,'label',x+26,y+20,w-52,it.label,T(it.labelAt));tx(d,'detail',x+26,y+88,w-52,it.detail,T(it.detailAt));
 }else if(s.kind==='stack'){
 bg(d,'soft-bg',x,y,w,148,T(it.labelAt));tx(d,'label',x+28,y+30,450,it.label,T(it.labelAt));tx(d,'detail',x+510,y+28,w-550,it.detail,T(it.detailAt));
 }else{
 tx(d,'index',0,y+22,60,String(i+1).padStart(2,'0'),T(it.labelAt));tx(d,'label',75,y+18,425,it.label,T(it.labelAt));tx(d,'detail',520,y+18,1190,it.detail,T(it.detailAt));
 const q=path(layer,`M0 ${y+111} H1728`,'',{'fill':'none','stroke':s.dark?'#557c83':'#c1c9c6','stroke-width':2});draw(q,T(it.detailAt),{duration:.7,stagger:0});
 }
 });
 const pm=el(root,'pm',s.pm);show(pm,T(s.pmAt),{duration:.6,y:10,stagger:0});
 });});
})();
