import * as THREE from './vendor/three.module.js';
import {seeded,pointData,pushPoint,geometryFromArrays,terrainHeight,creekX} from '../botany.js?v=20261105-life7';

// Small inhabitants use the same point-painted material and world coordinates as the woodland.
export function addEcology(scene,material,{mobile=false}={}){
 const rng=seeded(73041),objects=[],birds=[],rabbits=[],squirrels=[],butterflies=[];let pointCount=0;
 const add=geometry=>{const p=new THREE.Points(geometry,material);scene.add(p);objects.push(p);pointCount+=geometry.attributes.position.count;return p};
 // Asymmetric, overlapping crowns follow the ground rather than sitting on a flat plane.
 // A separate seed keeps the existing flowers and animals in their original positions.
 const shrubRng=seeded(48236),shrubData=pointData(),patches=[];
 for(let i=0;i<12;i++){
  const z=4-i*12.5,side=i%2?-1:1;
  patches.push([creekX(z)+side*(3.5+shrubRng()*3),z,.7+shrubRng()*.5,2.3+shrubRng()*1.2]);
 }
 for(const [x,z,baseHeight,baseWidth] of patches){
  const height=Math.max(1.15,baseHeight*1.6),width=baseWidth*1.3;
  const lobes=Array.from({length:5},(_,i)=>{
   const a=i*2.399+shrubRng()*.5,spread=i?(.19+shrubRng()*.10)*width:0;
   return {x:x+Math.cos(a)*spread,z:z+Math.sin(a)*spread,h:height*(i?.58+shrubRng()*.26:1),r:width*(.19+shrubRng()*.06)};
  });
  for(const lobe of lobes){
   for(let i=0;i<(mobile?240:380);i++){
    const a=shrubRng()*Math.PI*2,v=shrubRng(),r=Math.sqrt(1-v*v)*(.76+shrubRng()*.24);
    const ripple=1+.09*Math.sin(a*5+v*9),px=lobe.x+Math.cos(a)*r*lobe.r*ripple,pz=lobe.z+Math.sin(a)*r*lobe.r*.85;
    const py=terrainHeight(px,pz)+.12+v*lobe.h,light=.06+v*.17+shrubRng()*.07;
    pushPoint(shrubData,[px,py,pz],[.13+light*.63,.235+light*.91,.065+light*.34],.085+shrubRng()*.055,.5+v*.5,10,shrubRng);
   }
   for(let i=0;i<16;i++){
    const t=i/16,px=lobe.x+Math.sin(t*2.1)*.08,pz=lobe.z+t*.04;
    pushPoint(shrubData,[px,terrainHeight(px,pz)+t*lobe.h*.65,pz],[.24,.255,.12],.034,0,10,shrubRng);
   }
  }
 }
 add(geometryFromArrays(shrubData));
 const garden=pointData(),plantCount=mobile?125:230;
 for(let i=0;i<plantCount;i++){
  const z=-176-rng()*77,x=4+(i%2?-1:1)*(3.5+rng()*25),base=terrainHeight(x,z),h=.22+rng()*.4;
  for(let j=0;j<9;j++){const t=j/8;pushPoint(garden,[x+Math.sin(t*1.8)*.06,base+h*t,z],[.22,.38,.14],.032,.8,9,rng)}
  for(const side of [-1,1])for(let j=0;j<6;j++){const t=j/6;pushPoint(garden,[x+side*t*.12,base+h*.45+Math.sin(t*Math.PI)*.05,z+t*.05],[.27,.44,.18],.04,.9,9,rng)}
  const bloom=i%3!==0,color=i%4===0?[.88,.77,.37]:[.91,.90,.71];
  if(bloom)for(let petal=0;petal<5;petal++)for(let j=0;j<7;j++){
   const a=petal*Math.PI*2/5,t=j/7,r=.035+t*.045;
   pushPoint(garden,[x+.055+Math.cos(a)*r,base+h+Math.sin(t*Math.PI)*.027,z+Math.sin(a)*r],color,.036,.7,9,rng);
  }
  if(bloom)pushPoint(garden,[x+.055,base+h+.026,z],[.87,.62,.22],.048,.7,9,rng);
 }
 // Loose wildflower drifts leave open grass between them rather than forming a flower bed.
 const meadowRng=seeded(93511);
 for(let i=0;i<(mobile?65:110);i++){
  const z=-168-meadowRng()*73,x=4+(meadowRng()-.5)*25,h=.40+meadowRng()*.5;
  const base=terrainHeight(x,z),lean=(meadowRng()-.5)*.16,ivory=i%4!==0;
  for(let j=0;j<12;j++){const t=j/11;pushPoint(garden,[x+lean*t,base+h*t,z],[.24,.39,.12],.035,.85,9,meadowRng)}
  for(let petal=0;petal<6;petal++)for(let j=0;j<12;j++){
   const a=petal*Math.PI/3,t=j/11,r=.035+t*.10;
   pushPoint(garden,[x+lean+Math.cos(a)*r,base+h+Math.sin(t*Math.PI)*.028,z+Math.sin(a)*r],ivory?[.95,.92,.75]:[.87,.66,.26],.043,.8,9,meadowRng);
  }
  pushPoint(garden,[x+lean,base+h+.03,z],[.79,.53,.14],.065,.8,9,meadowRng);
 }
 // Fine blades break the smooth hill surface without obscuring the text or landmark tree.
 for(let i=0;i<(mobile?230:430);i++){
  const z=-165-rng()*80,x=4+(rng()-.5)*32,base=terrainHeight(x,z),h=.35+rng()*.85;
  for(let blade=0;blade<3;blade++)for(let j=0;j<9;j++){
   const t=j/9,a=blade*2.4;
   pushPoint(garden,[x+Math.cos(a)*t*t*.22,base+Math.sin(t*1.7)*h,z+Math.sin(a)*t*.17],[.26+t*.12,.40+t*.13,.13+t*.04],.027,.9,9,rng);
  }
 }
 const flowers=add(geometryFromArrays(garden));
 function ellipsoid(data,c,r,n,color,size,kind){
  for(let i=0;i<n;i++){
   const a=rng()*Math.PI*2,v=rng()*2-1,s=Math.sqrt(1-v*v),light=.88+v*.07+rng()*.14;
   pushPoint(data,[c[0]+Math.cos(a)*s*r[0],c[1]+v*r[1],c[2]+Math.sin(a)*s*r[2]],color.map(x=>x*light),size,0,kind,rng);
  }
 }
 const rabbit=pointData(),fur=[.62,.59,.50];
 ellipsoid(rabbit,[0,.32,0],[.30,.27,.42],1000,fur,.045,8);
 ellipsoid(rabbit,[0,.63,.34],[.19,.19,.21],600,fur,.04,8);
 for(const side of [-1,1]){
  ellipsoid(rabbit,[side*.095,.96,.34],[.058,.25,.064],200,fur,.033,8);
  ellipsoid(rabbit,[side*.095,.97,.39],[.028,.185,.012],45,[.68,.58,.48],.022,8);
  ellipsoid(rabbit,[side*.18,.08,.25],[.13,.075,.17],85,fur,.032,8);
  ellipsoid(rabbit,[side*.145,.67,.47],[.022,.024,.024],26,[.065,.075,.057],.036,8);
 }
 ellipsoid(rabbit,[0,.32,-.41],[.09,.09,.09],90,[.78,.77,.65],.03,8);
 ellipsoid(rabbit,[0,.56,.49],[.10,.085,.07],90,[.70,.68,.56],.027,8);
 ellipsoid(rabbit,[0,.61,.565],[.025,.02,.015],20,[.28,.23,.18],.028,8);
 const rabbitGeometry=geometryFromArrays(rabbit);
 for(const [i,x,z] of [[0,5.8,-214],[1,9.5,-218]]){
  const p=add(rabbitGeometry);p.scale.setScalar(i?1:1.15);p.userData={x,z,phase:i*5.3,scale:i?1:1.15};rabbits.push(p);
 }
 const bird=pointData();
 ellipsoid(bird,[0,0,0],[.075,.075,.19],230,[.10,.14,.13],.035,7);
 ellipsoid(bird,[0,.035,.18],[.065,.06,.07],90,[.12,.16,.14],.034,7);
 for(const side of [-1,1])for(let span=0;span<23;span++)for(let feather=0;feather<9;feather++){
  const t=span/23,v=feather/9;
  pushPoint(bird,[side*(.03+t*.62),.035+Math.sin(t*Math.PI)*.045,-.035-t*.14+(v-.5)*(.20*(1-t)+.025)],[.10+t*.04,.14+t*.04,.12+t*.03],.038,0,7,rng);
 }
 for(let i=0;i<45;i++)pushPoint(bird,[(rng()-.5)*.13,-.015,-.19-rng()*.13],[.23,.29,.24],.027,0,7,rng);
 const birdGeometry=geometryFromArrays(bird);
 for(let i=0;i<(mobile?3:5);i++){
  const p=add(birdGeometry);p.scale.setScalar(2.1+rng()*.5);p.userData={x:(mobile?10:25)+i*3.2,y:(mobile?55:43)+Math.sin(i*1.7)*2.5,z:-244-i*4,phase:i*1.8};p.rotation.y=-.45;p.frustumCulled=false;birds.push(p);
 }
 // Russet squirrels and warm ivory butterflies share the woodland's painted geometry.
 const squirrel=pointData(),russet=[.48,.29,.13];
 ellipsoid(squirrel,[0,.30,0],[.20,.27,.32],600,russet,.04,12);
 ellipsoid(squirrel,[0,.57,.22],[.145,.15,.16],350,[.58,.36,.17],.035,12);
 for(const side of [-1,1]){
  ellipsoid(squirrel,[side*.09,.74,.21],[.045,.09,.04],90,russet,.03,12);
  ellipsoid(squirrel,[side*.12,.60,.31],[.018,.02,.018],24,[.035,.04,.025],.032,12);
  ellipsoid(squirrel,[side*.16,.07,.14],[.075,.07,.14],85,russet,.035,12);
 }
 for(let j=0;j<10;j++){
  const a=j/9*Math.PI*1.4;
  ellipsoid(squirrel,[0,.4+Math.sin(a)*.42,-.31-Math.cos(a)*.24],[.13,.14,.14],85,[.56,.35,.16],.04,12);
 }
 const squirrelGeometry=geometryFromArrays(squirrel);
 for(const [x,z,phase] of [[3.2,-218,0],[13,-230,4]]){
  const p=add(squirrelGeometry);p.scale.setScalar(1.1);p.userData={x,z,phase};squirrels.push(p);
 }
 const butterfly=pointData();
 ellipsoid(butterfly,[0,0,0],[.022,.085,.025],60,[.24,.20,.08],.022,11);
 for(const side of [-1,1]){
  ellipsoid(butterfly,[side*.12,.04,0],[.115,.12,.018],180,[.94,.76,.33],.028,11);
  ellipsoid(butterfly,[side*.09,-.08,0],[.085,.075,.018],100,[.92,.87,.58],.026,11);
 }
 const butterflyGeometry=geometryFromArrays(butterfly);
 for(let i=0;i<(mobile?3:5);i++){
  const p=add(butterflyGeometry);p.userData={x:1.5+i*1.7,z:-212-i*2,phase:i*2.1};p.rotation.y=.3+i*.4;butterflies.push(p);
 }
 return {pointCount,plantCount,shrubs:patches.length,birds:birds.length,rabbits:rabbits.length,squirrels:squirrels.length,butterflies:butterflies.length,
  positions:()=>rabbits.map(p=>p.position.toArray()),update(time,progress,motion){
  const t=motion?time:0;flowers.visible=progress>.62;
  for(const p of rabbits){
   const a=p.userData,cycle=(t+a.phase)%18,leg=cycle%9,forward=cycle<9,travel=Math.min(1,leg/4),path=forward?travel:1-travel;
   const x=a.x+path*2.2,z=a.z+Math.sin(path*Math.PI)*.4,hop=leg<4?Math.sin((leg%1)*Math.PI)*.42:0;
   p.visible=progress>.77;p.position.set(x,terrainHeight(x,z)+.1+hop,z);p.rotation.y=Math.PI*.5+THREE.MathUtils.smoothstep(cycle,8,9)*Math.PI-THREE.MathUtils.smoothstep(cycle,17,18)*Math.PI;
   p.rotation.x=leg<4?Math.cos((leg%1)*Math.PI)*.10:Math.sin(t*.8+a.phase)*.04;
   p.scale.y=a.scale*(leg<4?1+hop*.18:1+Math.sin(t*1.4+a.phase)*.015);
  }
  for(const p of birds){const a=p.userData;p.visible=progress>.72;p.position.set(a.x+Math.sin(t*.18+a.phase)*7,a.y+Math.sin(t*.32+a.phase)*.9,a.z+Math.cos(t*.18+a.phase)*2.5);p.rotation.z=Math.cos(t*.18+a.phase)*.15}
  for(const p of squirrels){const a=p.userData,x=a.x+Math.sin(t*.32+a.phase)*.65,z=a.z+Math.cos(t*.32+a.phase)*.3;p.visible=progress>.78;p.position.set(x,terrainHeight(x,z)+.08,z);p.rotation.y=Math.sin(t*.32+a.phase)*.7+.8;p.rotation.x=Math.sin(t*1.2+a.phase)*.05}
  for(const p of butterflies){const a=p.userData,x=a.x+Math.sin(t*.65+a.phase)*.8,z=a.z+Math.cos(t*.43+a.phase)*.65;p.visible=progress>.74;p.position.set(x,terrainHeight(x,z)+1.9+Math.sin(t*1.4+a.phase)*.32,z)}
 }};
}
