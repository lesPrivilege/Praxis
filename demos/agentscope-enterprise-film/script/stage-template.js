(function(){
 const {box,el,svg,sv,path,show,draw}=K;
 function text(parent,cls,x,y,w,html,at){const e=box(parent,'atom '+cls,x,y,w,null,html);show(e,at,{duration:.6,y:14,stagger:0});return e;}
 function bg(parent,cls,x,y,w,h,at){const e=box(parent,cls,x,y,w,h);show(e,at,{duration:.6,y:0,stagger:0});return e;}
 STORY.scenes.forEach((s,idx)=>{
  const seg=Film.seg(s.id),T=a=>seg.start+a;
  Film.scene(s.id,seg.start,seg.end,({root})=>{
   root.classList.add(s.dark?'dark':'paper');
   const ch=el(root,'chapter',s.chapter.join(' · '));
   const no=el(root,'scene-no',String(idx+1).padStart(2,'0')+' / '+STORY.scenes.length);
   const hd=el(root,'heading',s.title);show(hd,T(0),{duration:.8,y:12,stagger:0});
   const lead=el(root,'lead',s.lead);show(lead,T(s.leadAt),{duration:.6,y:10,stagger:0});
   el(root,'source',s.sourceLine||'');
   const d=el(root,'diagram');
   const items=s.items;
   const layer=svg(d,'routes',1744,548);
   items.forEach((it,i)=>{
    let x=0,y=i*128,w=1728;
    if(s.kind==='flow'){x=i*(1744/items.length);y=40;w=1744/items.length-36;}
    else if(s.kind==='loop'){x=[0,1124,1124,0][i];y=[0,0,290,290][i];w=600;}
    else if(s.kind==='compare'){x=(i%2)*892;y=Math.floor(i/2)*250;w=820;}
    else if(s.kind==='stack'){y=i*172;w=1728;}
    if(s.kind==='flow'){
     bg(d,'box-bg',x,y,w,354,T(it.labelAt));
     text(d,'index',x+22,y+24,w-44,'0'+(i+1),T(it.labelAt));
     text(d,'label',x+22,y+86,w-44,it.label,T(it.labelAt));
     text(d,'detail',x+22,y+155,w-44,it.detail,T(it.detailAt));
     if(i>0){const p=path(layer,`M${x-30},${y+115} H${x-8}`,'', {fill:'none',stroke:s.dark?'#75c9bf':'#006d77','stroke-width':3});draw(p,T(it.labelAt),{duration:.7,stagger:0});}
    }else if(s.kind==='loop'){
     bg(d,'box-bg',x,y,w,224,T(it.labelAt));
     text(d,'label',x+26,y+24,w-52,it.label,T(it.labelAt));
     text(d,'detail',x+26,y+91,w-52,it.detail,T(it.detailAt));
     const paths=['M600 110 H1124','M1424 224 V290','M1124 404 H600','M300 290 V224'];
     const p=path(layer,paths[i],'',{fill:'none',stroke:s.dark?'#75c9bf':'#006d77','stroke-width':3});draw(p,T(it.detailAt),{duration:.7,stagger:0});
    }else if(s.kind==='compare'){
     bg(d,'soft-bg',x,y,w,212,T(it.labelAt));
     text(d,'label',x+26,y+20,w-52,it.label,T(it.labelAt));
     text(d,'detail',x+26,y+87,w-52,it.detail,T(it.detailAt));
    }else if(s.kind==='stack'){
     bg(d,'soft-bg',x,y,w,148,T(it.labelAt));
     text(d,'label',x+28,y+30,430,it.label,T(it.labelAt));
     text(d,'detail',x+490,y+28,w-526,it.detail,T(it.detailAt));
    }else{
     text(d,'label',72,y+18,420,it.label,T(it.labelAt));
     text(d,'index',0,y+22,58,String(i+1).padStart(2,'0'),T(it.labelAt));
     text(d,'detail',510,y+18,1200,it.detail,T(it.detailAt));
     const p=path(layer,`M0 ${y+111} H1728`,'',{fill:'none',stroke:s.dark?'#557c83':'#c1c9c6','stroke-width':2});draw(p,T(it.detailAt),{duration:.7,stagger:0});
    }
   });
   if(s.kind==='loop'&&s.center)text(d,'center',643,196,450,s.center,T(s.centerAt));
   const pm=el(root,'pm',s.pm);show(pm,T(s.pmAt),{duration:.6,y:10,stagger:0});
  });
 });
})();
