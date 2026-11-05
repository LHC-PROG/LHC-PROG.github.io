import * as THREE from './assets/vendor/three.module.js';
import {seeded,creekX,terrainHeight} from './botany.js?v=20261105-grove5';

// Atmosphere occupies the same world as the trees: it recedes, drifts and is occluded by the banks.
export function addAtmosphere(scene,u,{mobile=false}={}){
 const rng=seeded(53831),veils=[];
 const mistMaterial=new THREE.ShaderMaterial({
  uniforms:{uTime:u.uTime,uMotion:u.uMotion,uNight:u.uNight,uOpen:u.uOpen,uFog:u.uFog,uFogFar:u.uFogFar},
  transparent:true,depthWrite:false,depthTest:true,side:THREE.DoubleSide,
  vertexShader:`varying vec2 vUv;varying vec3 vWorld;varying float vDepth;
  void main(){vUv=uv;vec4 world=modelMatrix*vec4(position,1.);vWorld=world.xyz;vec4 mv=viewMatrix*world;vDepth=-mv.z;gl_Position=projectionMatrix*mv;}`,
  fragmentShader:`varying vec2 vUv;varying vec3 vWorld;varying float vDepth;uniform float uTime,uMotion,uNight,uOpen,uFogFar;uniform vec3 uFog;
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
  void main(){vec2 p=(vUv-.5)*2.;float edge=1.-smoothstep(.35,1.,dot(p,p));float t=uTime*uMotion;
   vec2 q=vec2(vWorld.x*.20-t*.035,vWorld.z*.10+t*.018)+vUv*vec2(3.,2.);
   float n=noise(q)*.65+noise(q*2.13+4.)*.35;
   float depth=smoothstep(2.,8.,vDepth)*(1.-smoothstep(uFogFar*.65,uFogFar*1.1,vDepth));
   float alpha=edge*smoothstep(.12,.72,n)*depth*mix(.30,.18,uNight)*(1.-uOpen*.24);
   vec3 color=mix(vec3(.67,.72,.59),vec3(.37,.48,.58),uNight);color=mix(color,vec3(.87,.72,.58),uOpen*.65);
   gl_FragColor=vec4(mix(color,uFog,.23),alpha);
  }`
 });
 const quad=new THREE.PlaneGeometry(1,1);
 for(let i=0;i<32;i++){
  const hill=i>21,z=hill?-166-(i-22)*11:17-i*8.5;
  const x=hill?(i%2?-1:1)*(13+rng()*15):creekX(z)+(rng()-.5)*8;
  const mesh=new THREE.Mesh(quad,mistMaterial),width=hill?23+rng()*12:15+rng()*11,height=2+rng()*2.8;
  mesh.scale.set(width,height,1);mesh.position.set(x,terrainHeight(x,z)+.55+height*.30,z);
  mesh.userData={originX:x,phase:rng()*Math.PI*2};mesh.renderOrder=2;scene.add(mesh);veils.push(mesh);
 }

 const positions=[],phases=[],sizes=[],kinds=[];
 for(let i=0;i<(mobile?260:510);i++){
  const z=19-rng()*270,x=creekX(z)+(rng()-.5)*22;
  positions.push(x,terrainHeight(x,z)+.6+rng()*8,z);phases.push(rng()*6.28);sizes.push(.018+rng()*.032);kinds.push(0);
 }
 // A handful of close insects have two moving wings, independent curved paths and warm bodies.
 for(let i=0;i<(mobile?32:52);i++){
  const z=10-i*5+rng()*4,x=creekX(z)+(rng()-.5)*10;
  positions.push(x,terrainHeight(x,z)+1.3+rng()*3.4,z);phases.push(rng()*6.28);sizes.push(.09+rng()*.065);kinds.push(1);
 }
 const geometry=new THREE.BufferGeometry();
 for(const [name,data,size] of [['position',positions,3],['aPhase',phases,1],['aSize',sizes,1],['aKind',kinds,1]])geometry.setAttribute(name,new THREE.Float32BufferAttribute(data,size));
 const motes=new THREE.Points(geometry,new THREE.ShaderMaterial({uniforms:{...u},transparent:true,depthWrite:false,depthTest:true,
  vertexShader:`attribute float aPhase,aSize,aKind;uniform float uTime,uMotion,uNight,uPixel,uFogFar;varying float vPhase,vAlpha,vKind;
  void main(){float t=uTime*uMotion;vec3 p=position;float bug=step(.5,aKind);
   p.x+=sin(t*(.12+bug*.31)+aPhase)*(.24+bug*.95);p.y+=sin(t*(.16+bug*.43)+aPhase*1.7)*(.14+bug*.45);p.z+=cos(t*(.09+bug*.27)+aPhase)*(.2+bug*.8);
   vec4 mv=modelViewMatrix*vec4(p,1.);float d=-mv.z;gl_Position=projectionMatrix*mv;gl_PointSize=clamp(aSize*uPixel/max(2.,d),1.,14.);
   vAlpha=(1.-smoothstep(22.,min(70.,uFogFar),d))*smoothstep(1.,3.,d);vAlpha*=mix(.28-uNight*.17,.78-uNight*.2,bug);vKind=bug;vPhase=t*14.+aPhase;
   if(d<.8)gl_PointSize=0.;}`,
  fragmentShader:`varying float vPhase,vAlpha,vKind;
  void main(){vec2 p=(gl_PointCoord-.5)*2.;float alpha;vec3 color;
   if(vKind<.5){alpha=exp(-dot(p,p)*4.)*(1.-smoothstep(.5,1.,length(p)));color=vec3(.93,.87,.63);}
   else {float spread=.32+.28*abs(sin(vPhase));float wing=exp(-pow((abs(p.x)-spread)*5.,2.)-pow(p.y*2.7,2.));float body=exp(-pow(p.x*12.,2.)-pow(p.y*3.5,2.));alpha=max(wing*.7,body);color=mix(vec3(.75,.71,.47),vec3(1.,.92,.66),body);}
   if(alpha*vAlpha<.012)discard;gl_FragColor=vec4(color,alpha*vAlpha);
  }`
 }));motes.frustumCulled=false;scene.add(motes);
 return {veils:veils.length,motes:positions.length/3,update(camera,time,far,reduced){
  for(const veil of veils){const d=camera.position.z-veil.position.z;veil.visible=d>1&&d<far+10;if(!veil.visible)continue;
   veil.quaternion.copy(camera.quaternion);veil.position.x=veil.userData.originX+(reduced?0:Math.sin(time*.07+veil.userData.phase)*1.3);
  }
 }};
}
