import * as THREE from './vendor/three.module.js';
import {seeded,pointData,pushPoint,geometryFromArrays,terrainHeight} from '../botany.js?v=20261105-life7';

// Small inhabitants use the same point-painted material and world coordinates as the woodland.
export function addEcology(scene,material,{mobile=false}={}){
 const rng=seeded(73041),objects=[],birds=[],rabbits=[];let pointCount=0;
 const add=geometry=>{const p=new THREE.Points(geometry,material);scene.add(p);objects.push(p);pointCount+=geometry.attributes.position.count;return p};
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
 // Fine blades break the smooth hill surface without obscuring the text or landmark tree.
 for(let i=0;i<(mobile?160:290);i++){
  const z=-175-rng()*78,x=4+(rng()-.5)*62,base=terrainHeight(x,z),h=.25+rng()*.65;
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
  const p=add(rabbitGeometry);p.scale.setScalar(i?.77:.9);p.rotation.y=i?-.8:-.35;p.userData={x,z,phase:i*2.8,scale:i?.77:.9};rabbits.push(p);
 }
 const bird=pointData();
 ellipsoid(bird,[0,0,0],[.075,.075,.19],230,[.22,.29,.24],.026,7);
 ellipsoid(bird,[0,.035,.18],[.065,.06,.07],90,[.25,.31,.25],.025,7);
 for(const side of [-1,1])for(let span=0;span<23;span++)for(let feather=0;feather<9;feather++){
  const t=span/23,v=feather/9;
  pushPoint(bird,[side*(.03+t*.62),.035+Math.sin(t*Math.PI)*.045,-.035-t*.14+(v-.5)*(.20*(1-t)+.025)],[.20+t*.07,.27+t*.06,.22+t*.04],.027,0,7,rng);
 }
 for(let i=0;i<45;i++)pushPoint(bird,[(rng()-.5)*.13,-.015,-.19-rng()*.13],[.23,.29,.24],.027,0,7,rng);
 const birdGeometry=geometryFromArrays(bird);
 for(let i=0;i<(mobile?3:5);i++){
  const p=add(birdGeometry);p.scale.setScalar(.95+rng()*.2);p.userData={x:(mobile?15:30)+i*(mobile?3:4.2),y:(mobile?62:48)+Math.sin(i*1.7)*1.8,z:-263-i*5,phase:i*1.8};p.rotation.y=-.45;p.frustumCulled=false;birds.push(p);
 }
 return {pointCount,plantCount,birds:birds.length,rabbits:rabbits.length,update(time,progress,motion){
  const t=motion?time:0;flowers.visible=progress>.62;
  for(const p of rabbits){const a=p.userData;p.visible=progress>.77;p.position.set(a.x+Math.sin(t*.18+a.phase)*.12,terrainHeight(a.x,a.z)+.08+Math.pow(Math.max(0,Math.sin(t*.75+a.phase)-.88),2)*3,a.z);p.scale.y=a.scale*(1+Math.sin(t*1.4+a.phase)*.012)}
  for(const p of birds){const a=p.userData;p.visible=progress>.72;p.position.set(a.x+Math.sin(t*.22+a.phase)*2.1,a.y+Math.sin(t*.4+a.phase)*.24,a.z+Math.cos(t*.2+a.phase)*1.2)}
 }};
}
