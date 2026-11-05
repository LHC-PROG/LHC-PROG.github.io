import * as THREE from './vendor/three.module.js';

// Closed, softly faceted surfaces keep small animals readable against the painted meadow.
export function createWoodlandAnimals({mobile=false}={}){
 const material=new THREE.MeshBasicMaterial({vertexColors:true,fog:true}),cache=new Map();
 function shape(parent,p,s,color){
  const key=color.join(',');let geometry=cache.get(key);
  if(!geometry){
   geometry=new THREE.SphereGeometry(1,mobile?12:18,mobile?9:13).toNonIndexed();
   const normal=geometry.attributes.normal,colors=[];
   for(let i=0;i<normal.count;i+=3){
    const light=.78+.20*Math.max(0,normal.getY(i)*.7-normal.getX(i)*.4+normal.getZ(i)*.35);
    for(let j=0;j<3;j++)colors.push(...color.map(c=>c*light));
   }
   geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));cache.set(key,geometry);
  }
  const mesh=new THREE.Mesh(geometry,material);mesh.position.set(...p);mesh.scale.set(...s);parent.add(mesh);return mesh;
 }
 const group=(parent,p)=>{const g=new THREE.Group();g.position.set(...p);parent.add(g);return g};
 function rabbit(){
  const root=new THREE.Group(),body=group(root,[0,.33,0]),fur=[.70,.67,.56],cream=[.88,.85,.73];
  shape(body,[0,.07,-.08],[.29,.30,.43],fur);
  shape(body,[0,.04,.16],[.23,.27,.25],cream);
  shape(body,[0,.05,-.48],[.12,.12,.12],cream);
  const feet=[];
  for(const side of [-1,1]){
   shape(body,[side*.23,-.03,-.22],[.17,.22,.23],fur);
   const hind=group(root,[side*.22,.10,-.13]);shape(hind,[0,0,.10],[.12,.08,.23],cream);feet.push(hind);
   const fore=group(root,[side*.14,.27,.24]);shape(fore,[0,-.08,.04],[.065,.17,.075],fur);shape(fore,[0,-.17,.09],[.08,.06,.13],cream);feet.push(fore);
  }
  const head=group(body,[0,.34,.29]);shape(head,[0,0,0],[.21,.21,.23],fur);
  shape(head,[0,-.075,.19],[.155,.105,.12],cream);
  shape(head,[0,-.035,.29],[.037,.027,.025],[.55,.32,.29]);
  const ears=[];
  for(const side of [-1,1]){
   const ear=group(head,[side*.095,.15,-.025]);ear.rotation.z=-side*.13;
   shape(ear,[0,.22,0],[.075,.29,.055],fur);shape(ear,[0,.23,.045],[.039,.215,.016],[.68,.47,.43]);ears.push(ear);
   shape(head,[side*.172,.035,.13],[.042,.047,.036],[.055,.065,.05]);
   shape(head,[side*.188,.05,.151],[.012,.014,.011],[.97,.96,.86]);
   // Three fine whiskers on each cheek, attached to the moving head.
   for(let j=0;j<3;j++){
    const geo=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(side*.09,-.07,.255),new THREE.Vector3(side*.31,-.075+(j-1)*.045,.26)]);
    head.add(new THREE.Line(geo,new THREE.LineBasicMaterial({color:0xaba48c,fog:true})));
   }
  }
  root.userData.animate=(t,hop,moving)=>{
   body.scale.y=1+Math.sin(t*1.7)*.018;head.rotation.y=Math.sin(t*.7)*.17;
   head.rotation.x=moving?-.08:Math.sin(t*1.3)*.09;
   ears.forEach((ear,i)=>{ear.rotation.x=Math.sin(t*1.8+i*2)*.09+Math.pow(Math.max(0,Math.sin(t*.65+i*2)),8)*.23;ear.rotation.z=(i?-.13:.13)+Math.sin(t*.8+i)*.055});
   feet.forEach((foot,i)=>foot.rotation.x=moving?Math.sin(hop*Math.PI*2+(i%2)*Math.PI)*.45:0);
  };
  return root;
 }
 return {rabbit};
}
