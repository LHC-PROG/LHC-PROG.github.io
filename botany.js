import * as THREE from './assets/vendor/three.module.js';

export function seeded(seed=38617){let state=seed>>>0;return()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296}}
export async function loadIllustration(url){return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('An illustration could not be loaded'));image.src=url})}
export function geometryFromArrays(data){
 const geometry=new THREE.BufferGeometry();
 for(const [key,size] of [['position',3],['color',3],['aSize',1],['aLeaf',1],['aSeed',1],['aKind',1]])geometry.setAttribute(key,new THREE.Float32BufferAttribute(data[key],size));
 geometry.computeBoundingSphere();return geometry;
}
export function pointData(){return{position:[],color:[],aSize:[],aLeaf:[],aSeed:[],aKind:[]}}
export function pushPoint(data,p,c,size,leaf,kind,rng){data.position.push(...p);data.color.push(...c);data.aSize.push(size);data.aLeaf.push(leaf);data.aKind.push(kind);data.aSeed.push(rng()*Math.PI*2)}

// Botanical illustrations become individual volumetric tree specimens, rooted at their own bases.
export function treeGeometry(image,{grid=126,apple=false,seed=317,trunkWidth=1,canopyDrop=0}={}){
 const rng=seeded(seed),canvas=document.createElement('canvas');
 canvas.width=grid;canvas.height=Math.round(grid*image.height/image.width);
 const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0,canvas.width,canvas.height);
 const {width:w,height:h}=canvas,pixels=ctx.getImageData(0,0,w,h).data;
 let rootSum=0,rootWeight=0;
 for(let y=Math.floor(h*.9);y<h;y++)for(let x=0;x<w;x++){const a=pixels[(y*w+x)*4+3];if(a>145){rootSum+=x*a;rootWeight+=a}}
 const root=rootWeight?rootSum/rootWeight/w:.5,aspect=w/h,data=pointData(),barkCenters=[];
 if(trunkWidth>1)for(let y=0;y<h;y++){
  let sum=0,weight=0;
  for(let x=0;x<w;x++){const i=(y*w+x)*4,r=pixels[i],g=pixels[i+1],b=pixels[i+2],a=pixels[i+3];if(a>145&&!(g>r*.94&&g>b*1.03)){sum+=x*a;weight+=a}}
  barkCenters[y]=weight?sum/weight:w*root;
 }
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const i=(y*w+x)*4,alpha=pixels[i+3]/255;if(alpha<.49||rng()>.68+alpha*.31)continue;
  const r=pixels[i]/255,g=pixels[i+1]/255,b=pixels[i+2]/255;
  const height=1-y/h,luma=r*.28+g*.57+b*.15;
  const leaf=height>.4&&g>r*.94&&g>b*1.03?1:height>.62&&luma<.59?.65:0;
  let color=apple?[r*.96,g*.97,b*.94]:leaf?[.14+luma*.31,.25+luma*.43,.075+luma*.22]:[r*.97+.04,g*.98+.045,b*.95+.045];
  color=color.map(v=>Math.min(1,v));
  let px=((x+(rng()-.5)*.6)/w-root)*aspect;
  const rawHeight=(h-y+(rng()-.5)*.5)/h,py=rawHeight-canopyDrop*THREE.MathUtils.smoothstep(rawHeight,.25,.72);
  if(trunkWidth>1&&leaf<.3){const center=(barkCenters[y]/w-root)*aspect;px=center+(px-center)*(1+(trunkWidth-1)*(1-THREE.MathUtils.smoothstep(rawHeight,.32,.64)))}
  const thickness=(apple?(leaf?.14:.085):(leaf?.09:.035))*Math.sin(Math.PI*Math.min(.98,py+.04));
  pushPoint(data,[px,py,(rng()-.5)*thickness],color,(1.35+rng()*.9)/h,leaf,apple?3:0,rng);
 }
 if(apple){
  // Fine cylindrical bark and roots add actual depth beneath the illustrated crown.
  const barkTube=(nodes,radius)=>{
   const curve=new THREE.CatmullRomCurve3(nodes.map(p=>new THREE.Vector3(...p)));
   for(let i=0;i<48;i++){
    const t=i/47,c=curve.getPoint(t),tangent=curve.getTangent(t).normalize(),axis=new THREE.Vector3(0,0,1);
    if(Math.abs(tangent.dot(axis))>.95)axis.set(1,0,0);
    const normal=new THREE.Vector3().crossVectors(tangent,axis).normalize(),binormal=new THREE.Vector3().crossVectors(tangent,normal);
    for(let j=0;j<14;j++){
     const a=j/14*Math.PI*2,r=radius*(1-t*.78)*(1+.07*Math.sin(t*75+a*3)),p=c.clone().addScaledVector(normal,Math.cos(a)*r).addScaledVector(binormal,Math.sin(a)*r),light=.07+rng()*.10+Math.cos(a)*.025;
     pushPoint(data,p.toArray(),[.36+light,.30+light,.20+light*.8],.0027+rng()*.0012,0,3,rng);
    }
   }
  };
  for(let i=0;i<6;i++){const a=i*Math.PI/3;barkTube([[0,.08,0],[Math.cos(a)*.065,.025,Math.sin(a)*.055],[Math.cos(a)*.15,.003,Math.sin(a)*.13]],.025)}
  barkTube([[.015,.27,.015],[.09,.37,.06],[.17,.40,.09],[.23,.415,.09]],.024);
  barkTube([[.015,.35,.015],[-.07,.46,.06],[-.13,.50,.09],[-.20,.505,.08]],.020);
 }
 return geometryFromArrays(data);
}

export const forestX=z=>1.8*Math.sin(z*.042)+1.1*Math.sin(z*.085+.4);
export const creekX=z=>{
 const forest=forestX(z),bend=THREE.MathUtils.smoothstep(-z,108,168);
 return THREE.MathUtils.lerp(forest,-42,bend);
};
export function terrainHeight(x,z){
 const rising=THREE.MathUtils.smoothstep(-z,138,178);
 const hill=14.5*Math.exp(-(((z+222)/53)**2)-(((x-4)/32)**2))*rising;
 const low=.12*Math.sin(x*.6+z*.16)+.07*Math.cos(x*.32-z*.1);
 const bank=THREE.MathUtils.smoothstep(Math.abs(x-creekX(z)),1.6,4.0);
 const turn=THREE.MathUtils.smoothstep(-z,108,120)*(1-THREE.MathUtils.smoothstep(-z,175,190));
 return THREE.MathUtils.lerp(hill+low,-.16,turn*(1-bank));
}

export function groundChunk(start,end,{count=1900,seed=1}={}){
 const rng=seeded(seed),data=pointData();
 for(let i=0;i<count;i++){
  const z=start+(end-start)*rng(),center=creekX(z),side=rng()<.5?-1:1;
  const isBank=i<count*.68;
  const x=z< -144?4+(rng()*2-1)*(isBank?17:43):center+side*(isBank?1.85+Math.pow(rng(),1.4)*10:2+rng()*39);
  const y=terrainHeight(x,z)+rng()*.3;
  const light=rng(),t=THREE.MathUtils.smoothstep(-z,140,180);
  const c=[.17+light*.16+t*.115,.27+light*.2+t*.09,.075+light*.11+t*.035];
  pushPoint(data,[x,y,z],c,.12+rng()*.19,.55,1,rng);
 }
 return geometryFromArrays(data);
}

export function waterChunk(start,end,{count=1300,seed=2}={}){
 const rng=seeded(seed),data=pointData();
 for(let i=0;i<count;i++){
  const z=start+(end-start)*rng(),half=1.65+.23*Math.sin(z*.12),x=creekX(z)+(rng()*2-1)*half;
  const l=rng();pushPoint(data,[x,.035+rng()*.02,z],[.15+l*.2,.3+l*.22,.26+l*.17],.12+rng()*.12,0,2,rng);
 }
 return geometryFromArrays(data);
}

export function shrubGeometry({seed=1,count=1900,height=1.7,width=2.8}={}){
 const rng=seeded(seed),data=pointData();
 for(let i=0;i<count;i++){
  const az=rng()*Math.PI*2,v=rng()*2-1,rad=Math.pow(rng(),.35);
  const x=Math.cos(az)*Math.sqrt(1-v*v)*rad*width*.5,z=Math.sin(az)*Math.sqrt(1-v*v)*rad*width*.42;
  const y=Math.max(0,(v*.5+.5)*height*(.8+.2*Math.sin(x*3+z*2)));
  const l=rng()*.3+y/height*.35;pushPoint(data,[x,y,z],[.14+l*.3,.23+l*.4,.06+l*.2],.09+rng()*.14,1,1,rng);
 }
 return geometryFromArrays(data);
}

export function canopyGeometry(seed=1){
 const rng=seeded(seed),data=pointData();
 for(let i=0;i<15500;i++){
  const z=18-rng()*163,x=creekX(z)+(rng()*2-1)*7;
  const y=6.3+Math.abs(x-creekX(z))*.35+rng()*4.1+.8*Math.sin(z*.4+x);
  const l=rng();pushPoint(data,[x,y,z],[.16+l*.26,.29+l*.3,.07+l*.14],.13+rng()*.16,1,0,rng);
 }
 return geometryFromArrays(data);
}

export function cloudGeometry(seed=1){
 const rng=seeded(seed),data=pointData();
 for(const group of [[-32,54,-265],[35,58,-286],[-62,49,-310]])for(let i=0;i<2500;i++){
  const angle=rng()*Math.PI*2,v=rng()*2-1,rad=Math.pow(rng(),.32),x=Math.cos(angle)*Math.sqrt(1-v*v)*rad*18;
  const y=v*rad*5+Math.sin(x*.22)*2,z=Math.sin(angle)*Math.sqrt(1-v*v)*rad*4;
  const l=(y/8+.7)*.45+rng()*.18;
  pushPoint(data,[group[0]+x,group[1]+y,group[2]+z],[.56+l*.40,.43+l*.36,.47+l*.33],.30+rng()*.32,0,4,rng);
 }
 return geometryFromArrays(data);
}

// Small curved fronds and weathered stones give the banks a finer texture than the tree crowns.
export function bankDetail(start,end,{seed=92,count=48,meadow=false}={}){
 const rng=seeded(seed),data=pointData();
 for(let plant=0;plant<count;plant++){
  const z=start+(end-start)*rng(),side=plant%2?-1:1;
  const x=meadow?4+side*(8+rng()*28):creekX(z)+side*(2.05+Math.pow(rng(),.65)*12),base=terrainHeight(x,z);
  const height=.38+rng()*.8,angle=rng()*Math.PI*2;
  for(let frond=0;frond<5;frond++){
   const a=angle+frond*2.399,reach=height*(.7+rng()*.7);
   for(let j=1;j<13;j++){
    const t=j/13,y=base+Math.sin(t*Math.PI*.72)*height,spread=Math.sin(t*Math.PI)*height*.21;
    const px=x+Math.cos(a)*reach*t,pz=z+Math.sin(a)*reach*t;
    for(const leaf of [-1,0,1]){
     const light=rng()*.13+t*.12;
     pushPoint(data,[px+Math.sin(a)*spread*leaf,y-Math.abs(leaf)*.025,pz-Math.cos(a)*spread*leaf],[.22+light,.32+light,.09+light*.45],.045+rng()*.035,1,5,rng);
    }
   }
  }
 }
 for(let rock=0;rock<12;rock++){
  const z=start+(end-start)*rng(),side=rock%2?-1:1,x=creekX(z)+side*(1.9+rng()*4.4),base=terrainHeight(x,z);
  const width=.25+rng()*.6,height=.17+rng()*.32;
  for(let j=0;j<100;j++){
   const a=rng()*Math.PI*2,v=rng(),r=Math.sqrt(1-v*v),light=rng()*.1+v*.08;
   pushPoint(data,[x+Math.cos(a)*r*width,base+v*height,z+Math.sin(a)*r*width*.7],[.27+light,.31+light,.22+light],.07+rng()*.045,0,6,rng);
  }
 }
 return geometryFromArrays(data);
}
