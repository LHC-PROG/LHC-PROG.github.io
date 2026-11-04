import * as THREE from './assets/vendor/three.module.js';
import {seeded,loadIllustration,treeGeometry,creekX,terrainHeight,groundChunk,waterChunk,canopyGeometry,cloudGeometry,bankDetail} from './botany.js';
import {addAtmosphere} from './atmosphere.js';

const canvas=document.getElementById('landscape');
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
const mobile=matchMedia('(max-width:760px)').matches;
const stats=window.journeyDiagnostics={ready:false,engine:'loading',frames:0,progress:0,camera:null,trees:0,points:0,paused:false};
const poster=new Image();poster.onload=()=>document.querySelector('.landscape-fallback').classList.add('has-poster');poster.src=new URL('./assets/scene-fallback.webp',import.meta.url).href;
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,alpha:false,antialias:false,powerPreference:'high-performance'});}catch{fallback()}
if(renderer)build().catch(error=>{console.warn('Journey fallback:',error.message);renderer.dispose();fallback()});
function fallback(){stats.engine='static-fallback';document.documentElement.classList.add('scene-fallback');document.querySelector('.loading').textContent='静态阅读模式'}

async function build(){
 THREE.ColorManagement.enabled=false;renderer.outputColorSpace=THREE.LinearSRGBColorSpace;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(mobile?68:57,1,.1,420);
 const rng=seeded(87197),trees=[],chunks=[],shafts=[];
 const [treeArt,slenderArt,shrubArt,appleArt,mountainArt]=await Promise.all(['eucalyptus','eucalyptus-slender','shrub','apple','mountains'].map(name=>loadIllustration(new URL(`./assets/illustrations/${name}.webp`,import.meta.url).href)));
 const baseTree=treeGeometry(treeArt,{grid:mobile?93:126}),slenderTree=treeGeometry(slenderArt,{grid:mobile?93:126,seed:647}),appleTree=treeGeometry(appleArt,{grid:mobile?144:202,apple:true});
 const fogColor=new THREE.Color(.12,.22,.17);
 const u={uTime:{value:0},uNight:{value:0},uOpen:{value:0},uMotion:{value:1},uPixel:{value:700},uFogNear:{value:20},uFogFar:{value:65},uFog:{value:fogColor}};
 const pointMaterial=new THREE.ShaderMaterial({uniforms:u,depthTest:true,depthWrite:true,transparent:false,
  vertexShader:`attribute float aSize,aLeaf,aSeed,aKind;varying vec3 vColor;varying float vEdge;uniform float uTime,uNight,uOpen,uMotion,uPixel,uFogNear,uFogFar;uniform vec3 uFog;
  void main(){
   vec4 world=modelMatrix*vec4(position,1.);float t=uTime;
   float sweep=mod(t*2.2,63.)-31.;float gust=exp(-pow((world.x*.7+world.z*.22-sweep)/3.3,2.));
   float breeze=sin(t*.57+world.z*.14+world.y*.65)*.09+sin(t*.31+world.x*.6)*.045;
   world.x+=(breeze+gust*sin(t*1.8+aSeed)*.24)*aLeaf*(.35+min(world.y,15.)*.055)*uMotion;
   world.y+=sin(t*.48+world.z*.24)*.035*aLeaf*uMotion;
   vec3 col=color;
   if(aLeaf>.4)col=mix(col,col*vec3(1.04,.94,.97)+vec3(.008,.003,.012),uOpen*.65);
   if(aKind>1.5&&aKind<2.5){world.y+=sin(world.z*1.2-t*.9+world.x)*.025*uMotion;world.z+=sin(t*.4+world.x)*.08*uMotion;float glint=pow(max(0.,sin(world.z*1.7+world.x*3.-t*.6)),14.);col+=vec3(.28,.25,.12)*glint*(1.-uNight*.45);}
   float tone=.84+.17*clamp(world.y/12.,0.,1.)+.08*sin(world.x*.22+world.z*.11);
   col*=tone;col*=mix(vec3(1.),vec3(.29,.44,.62),uNight);col+=vec3(.025,.04,.065)*uNight*(1.-aLeaf);
   vec4 mv=viewMatrix*world;float dist=-mv.z;
   if(dist<.9||dist>uFogFar*1.35){gl_Position=vec4(2.,2.,2.,1.);gl_PointSize=0.;vColor=uFog;vEdge=0.;return;}
   gl_Position=projectionMatrix*mv;
   float scale=length(modelMatrix[1].xyz),nearFade=smoothstep(.9,2.2,dist);
   gl_PointSize=clamp(aSize*scale*uPixel/max(1.,dist),1.,42.)*nearFade;
   float fog=smoothstep(uFogNear,uFogFar,dist);if(aKind>3.5&&aKind<4.5)fog*=.35;vColor=mix(col,uFog,fog);vEdge=1.;
  }`,
  fragmentShader:`varying vec3 vColor;varying float vEdge;void main(){vec2 p=gl_PointCoord-.5;if(dot(p,p)>.25||vEdge<.5)discard;gl_FragColor=vec4(vColor,1.);}`,
  vertexColors:true});
 function points(geometry,kind='chunk'){
  const object=new THREE.Points(geometry,pointMaterial);object.userData.kind=kind;scene.add(object);stats.points+=geometry.attributes.position.count;return object;
 }
 // Independently rooted specimens line a curved creek. They remain in world space as the camera walks past.
 for(let i=0;i<40;i++){
  const z=13-Math.floor(i/2)*8.5+(rng()-.5)*2.5,side=i%2?-1:1;
  const tree=points(i%3?slenderTree:baseTree,'tree'),height=12+rng()*6.7;
  tree.position.set(creekX(z)+side*(4.3+rng()*3.1),terrainHeight(creekX(z)+side*5,z),z);
  tree.scale.set(side<0?height:-height,height,height);tree.rotation.y=(rng()-.5)*.45;
  trees.push(tree);stats.trees++;
 }
 // Smaller back rows and undergrowth provide intermediate depth instead of a flat forest backdrop.
 for(let i=0;i<42;i++){
  const z=14-Math.floor(i/2)*8.2+(rng()-.5)*3,side=i%2?-1:1,height=11+rng()*8;
  const tree=points(i%2?slenderTree:baseTree,'tree');tree.position.set(creekX(z)+side*(10+rng()*5),terrainHeight(side*12,z),z);tree.scale.set((i%3?-1:1)*height,height,height);trees.push(tree);stats.trees++;
 }
 // Loose outer groves close the lateral gaps without blocking the central creek or the distant apple tree.
 for(let i=0;i<(mobile?28:42);i++){
  const z=16-Math.floor(i/2)*(mobile?12:8.2)+(rng()-.5)*4,side=i%2?-1:1,height=12+rng()*9;
  const tree=points(i%3?baseTree:slenderTree,'tree'),x=creekX(z)+side*(18+rng()*8);
  tree.position.set(x,terrainHeight(x,z),z);tree.scale.set((i%3?-1:1)*height,height,height);tree.rotation.y=(rng()-.5)*.9;trees.push(tree);stats.trees++;
 }
 const shrub=treeGeometry(shrubArt,{grid:mobile?104:142,seed:137});
 for(let i=0;i<46;i++){
  const z=12-i*3.5,side=i%2?-1:1,x=creekX(z)+side*(2.3+rng()*2.9),object=points(shrub,'shrub');
  object.position.set(x,terrainHeight(x,z),z);object.rotation.y=(rng()-.5)*.8;const scale=1.3+rng()*.9;object.scale.set(i%2?-scale:scale,scale,scale);chunks.push(object);
 }
 const overhead=points(canopyGeometry(),'canopy');
 for(let z=22;z>-151;z-=17){const detail=points(bankDetail(z-17,z,{seed:890+z,count:mobile?30:58}),'bank-detail');chunks.push(detail)}
 for(let z=24;z>-290;z-=13){const land=points(groundChunk(z-13,z,{count:mobile?1100:2100,seed:500+z}),'ground');chunks.push(land);if(z>-141){const water=points(waterChunk(z-13,z,{count:mobile?1000:1900,seed:700+z}),'water');chunks.push(water)}}
 const hillDetail=points(groundChunk(-252,-151,{count:mobile?28000:53000,seed:941}),'hill');
 for(let i=0;i<12;i++){
  const side=i%2?-1:1,z=-176-Math.floor(i/2)*15,x=4+side*(22+rng()*12),object=points(shrub,'hill-shrub'),scale=1.8+rng()*1.2;
  object.position.set(x,terrainHeight(x,z),z);object.scale.set(scale*side,scale,scale);chunks.push(object);
 }
 for(let z=-166;z>-254;z-=15){const detail=points(bankDetail(z-15,z,{seed:1280+z,count:mobile?42:78,meadow:true}),'meadow-detail');chunks.push(detail)}
 const apple=points(appleTree,'apple');apple.position.set(5,terrainHeight(5,-224),-224);apple.scale.setScalar(17.6);apple.rotation.y=-.1;
 const clouds=points(cloudGeometry(),'cloud');
 const cloudMaterial=pointMaterial.clone();cloudMaterial.uniforms=u;cloudMaterial.transparent=true;cloudMaterial.depthWrite=false;
 cloudMaterial.fragmentShader=`varying vec3 vColor;varying float vEdge;void main(){float r=length(gl_PointCoord-.5);if(r>.5||vEdge<.5)discard;gl_FragColor=vec4(vColor,(1.-smoothstep(.12,.5,r))*.55);}`;clouds.material=cloudMaterial;

 // A low, continuous terrain surface carries the hill beneath its point-painted grass.
 const terrain=new THREE.PlaneGeometry(180,480,60,160);terrain.rotateX(-Math.PI/2);terrain.translate(0,0,-145);
 const terrainPositions=terrain.attributes.position;
 for(let i=0;i<terrainPositions.count;i++)terrainPositions.setY(i,terrainHeight(terrainPositions.getX(i),terrainPositions.getZ(i))-.1);
 terrain.computeBoundingSphere();
 const floorMaterial=new THREE.MeshBasicMaterial({color:new THREE.Color(.11,.19,.105),fog:true});scene.add(new THREE.Mesh(terrain,floorMaterial));
 scene.fog=new THREE.Fog(fogColor,25,65);
 const mountainTexture=new THREE.Texture(mountainArt);mountainTexture.wrapS=THREE.MirroredRepeatWrapping;mountainTexture.repeat.x=3;mountainTexture.needsUpdate=true;
 const mountainMaterial=new THREE.MeshBasicMaterial({map:mountainTexture,transparent:true,depthWrite:false,opacity:0,fog:false});
 const mountains=new THREE.Mesh(new THREE.PlaneGeometry(900,100),mountainMaterial);mountains.position.set(0,16,-345);scene.add(mountains);

 const skyU={uNight:{value:0},uOpen:{value:0},uAspect:{value:1}};
 const sky=new THREE.Mesh(new THREE.PlaneGeometry(2,2),new THREE.ShaderMaterial({uniforms:skyU,depthWrite:false,depthTest:false,
  vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,1.,1.);}`,
  fragmentShader:`varying vec2 vUv;uniform float uNight,uOpen,uAspect;void main(){float h=smoothstep(0.,1.,vUv.y);vec3 day=mix(vec3(.21,.33,.25),vec3(.20,.30,.27),h);vec3 night=mix(vec3(.075,.13,.18),vec3(.045,.075,.14),h);vec3 evening=mix(vec3(.93,.60,.43),vec3(.40,.36,.52),smoothstep(.04,.95,vUv.y));vec3 c=mix(mix(day,night,uNight),evening,uOpen);vec2 q=(vUv-vec2(.23,.42))*vec2(uAspect,1.);float r=length(q);c+=vec3(.7,.43,.15)*exp(-r*r*65.)*uOpen;vec2 moon=(vUv-vec2(.74,.73))*vec2(uAspect,1.);float m=length(moon);c+=vec3(.33,.42,.50)*exp(-m*m*240.)*uNight;c+=vec3(.55,.59,.58)*(1.-smoothstep(.013,.023,m))*uNight;gl_FragColor=vec4(c,1.);}`
 }));sky.frustumCulled=false;sky.renderOrder=-100;scene.add(sky);
 const sunset=new THREE.Mesh(new THREE.PlaneGeometry(13,13),new THREE.ShaderMaterial({uniforms:{uOpen:skyU.uOpen},transparent:true,depthWrite:false,depthTest:true,blending:THREE.AdditiveBlending,
  vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader:`varying vec2 vUv;uniform float uOpen;void main(){float r=length(vUv-.5)*2.;float core=1.-smoothstep(.16,.25,r);float halo=exp(-r*r*5.);float alpha=(core*.85+halo*.35)*uOpen;gl_FragColor=vec4(mix(vec3(1.,.53,.20),vec3(1.,.94,.67),core),alpha);}`}));
 sunset.position.set(60,34,-305);scene.add(sunset);

 const shaftMaterial=new THREE.ShaderMaterial({uniforms:{uTime:u.uTime,uNight:u.uNight},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,
  vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader:`varying vec2 vUv;uniform float uTime,uNight;void main(){float x=exp(-pow((vUv.x-.5)*4.,2.));float y=sin(vUv.y*3.14159);float pulse=.85+.15*sin(uTime*.35+vUv.y*4.);float a=x*y*.11*pulse*(1.-uNight*.92);gl_FragColor=vec4(.96,.89,.57,a);}`});
 for(let i=0;i<9;i++){const z=4-i*18;const shaft=new THREE.Mesh(new THREE.PlaneGeometry(1.5+rng()*1.8,14),shaftMaterial);shaft.position.set(creekX(z)+1.1,7,z);shaft.rotation.z=-.26;scene.add(shaft);shafts.push(shaft)}

 const insectPositions=[],phases=[],sizes=[],tails=[];
 for(let i=0;i<(mobile?160:290);i++){
  const z=15-rng()*165,seed=[creekX(z)+(rng()-.5)*14,.8+rng()*7,z],phase=rng()*6.28,size=2.6+rng()*2;
  for(let tail=0;tail<4;tail++){insectPositions.push(...seed);phases.push(phase);sizes.push(size);tails.push(tail/3)}
 }
 const insectGeometry=new THREE.BufferGeometry();insectGeometry.setAttribute('position',new THREE.Float32BufferAttribute(insectPositions,3));insectGeometry.setAttribute('aPhase',new THREE.Float32BufferAttribute(phases,1));insectGeometry.setAttribute('aSize',new THREE.Float32BufferAttribute(sizes,1));insectGeometry.setAttribute('aTail',new THREE.Float32BufferAttribute(tails,1));
 const insectU={uTime:u.uTime,uNight:u.uNight,uDpr:{value:1},uMotion:u.uMotion};
 const insects=new THREE.Points(insectGeometry,new THREE.ShaderMaterial({uniforms:insectU,transparent:true,depthWrite:false,depthTest:true,blending:THREE.AdditiveBlending,
  vertexShader:`attribute float aPhase,aSize,aTail;uniform float uTime,uNight,uDpr,uMotion;varying float vAlpha;void main(){float t=(uTime-aTail*.3)*uMotion;vec3 p=position;p.x+=sin(t*.47+aPhase)*1.2;p.y+=sin(t*.73+aPhase*2.)*.32;p.z+=cos(t*.36+aPhase)*.8;vec4 mv=modelViewMatrix*vec4(p,1.);float d=-mv.z;gl_Position=projectionMatrix*mv;gl_PointSize=clamp(aSize*uDpr*20./max(2.,d),1.,8.);vAlpha=(.24+.7*uNight)*(.65+.35*sin(uTime*1.5+aPhase))*(1.-aTail*.82)*(1.-smoothstep(20.,65.,d));if(d<1.)gl_PointSize=0.;}`,
  fragmentShader:`varying float vAlpha;void main(){float r=length(gl_PointCoord-.5);if(r>.5)discard;gl_FragColor=vec4(1.,.94,.66,exp(-r*r*18.)*vAlpha);}`}));insects.frustumCulled=false;scene.add(insects);
 const atmosphere=addAtmosphere(scene,u,{mobile});stats.mistLayers=atmosphere.veils;stats.dustAndInsects=atmosphere.motes;

 let width=0,height=0,progress=0,target=0,time=0,frame=0,last=0,anchors=[];
 let capture=false,annotationActive=false;
 const pointer={x:0,y:0},smoothPointer={x:0,y:0};
 const stateColors={day:new THREE.Color(.12,.22,.16),night:new THREE.Color(.055,.10,.145),open:new THREE.Color(.72,.55,.47)};
 function cacheAnchors(){anchors=[...document.querySelectorAll('[data-stage]')].map(el=>({y:el.offsetTop,p:Number(el.dataset.stage)}));target=mapScroll(scrollY)}
 function mapScroll(y){for(let i=0;i<anchors.length-1;i++){const a=anchors[i],b=anchors[i+1];if(y<=b.y)return THREE.MathUtils.lerp(a.p,b.p,THREE.MathUtils.clamp((y-a.y)/Math.max(1,b.y-a.y),0,1))}return 1}
 function resize(){
  width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,mobile?1.15:1.4);renderer.setPixelRatio(dpr);renderer.setSize(width,height,false);
  camera.aspect=width/height;camera.fov=mobile?68:57;camera.updateProjectionMatrix();u.uPixel.value=height*dpr/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov*.5)));insectU.uDpr.value=dpr;skyU.uAspect.value=camera.aspect;cacheAnchors();render(0);if(reduced.matches)stop();else start();
 }
 function render(delta){
  const night=THREE.MathUtils.smoothstep(progress,.28,.43)*(1-THREE.MathUtils.smoothstep(progress,.59,.72));
  const open=THREE.MathUtils.smoothstep(progress,.63,.79);
  const z=12-progress*213,x=THREE.MathUtils.lerp(creekX(z),1.3,open);
  const ground=terrainHeight(x,z),y=2.9+ground;
  const ahead=z-16,lookX=THREE.MathUtils.lerp(creekX(ahead),5,open*.78),lookY=2.4+terrainHeight(lookX,ahead)+open*1.2;
  const ease=1-Math.exp(-Math.max(delta,.016)*3.6);smoothPointer.x+=(pointer.x-smoothPointer.x)*ease;smoothPointer.y+=(pointer.y-smoothPointer.y)*ease;
  camera.position.set(x+smoothPointer.x*.6,y-smoothPointer.y*.24,z);camera.lookAt(lookX+smoothPointer.x*.9,lookY-smoothPointer.y*.45,ahead);
  fogColor.copy(stateColors.day).lerp(stateColors.night,night).lerp(stateColors.open,open);
  u.uTime.value=time;u.uNight.value=night;u.uOpen.value=open;u.uMotion.value=reduced.matches||annotationActive?0:1;
  u.uFogNear.value=18+open*22;u.uFogFar.value=61+open*126;scene.fog.color.copy(fogColor);scene.fog.near=u.uFogNear.value;scene.fog.far=u.uFogFar.value;
  skyU.uNight.value=night;skyU.uOpen.value=open;
  floorMaterial.color.setRGB(.11+open*.23,.19+open*.23,.105+open*.04).multiplyScalar(1-night*.62);
  mountainMaterial.opacity=open;clouds.visible=open>.02;apple.visible=progress>.4;hillDetail.visible=progress>.45;sunset.visible=open>.02;sunset.quaternion.copy(camera.quaternion);
  overhead.visible=progress<.77;insects.visible=progress<.76;
  for(const tree of trees){const d=z-tree.position.z;tree.visible=d>-13&&d<u.uFogFar.value+22}
  for(const chunk of chunks){const b=chunk.geometry.boundingSphere;const center=b.center.z+chunk.position.z,d=z-center;chunk.visible=d>-21&&d<u.uFogFar.value+25}
  for(const shaft of shafts){const d=z-shaft.position.z;shaft.visible=d>-4&&d<55&&open<.5}
  atmosphere.update(camera,time,u.uFogFar.value,reduced.matches||annotationActive);
  renderer.render(scene,camera);stats.frames++;stats.progress=Number(progress.toFixed(4));stats.night=Number(night.toFixed(3));stats.open=Number(open.toFixed(3));stats.camera={x:camera.position.x,y:camera.position.y,z:camera.position.z};stats.visibleTrees=trees.filter(t=>t.visible).length;
 }
 function animate(now){frame=0;if(document.hidden||capture||annotationActive){stats.paused=true;return}if(!last)last=now-34;const delta=Math.min((now-last)/1000,.06);if(mobile&&delta<1/31){frame=requestAnimationFrame(animate);return}last=now;time+=delta;progress+=(target-progress)*(1-Math.exp(-delta/.17));if(Math.abs(target-progress)<.00001)progress=target;render(delta);stats.paused=false;if(!reduced.matches)frame=requestAnimationFrame(animate)}
 function start(){if(!frame&&!document.hidden&&!capture&&!annotationActive){last=0;if(reduced.matches){progress=target;render(0)}else frame=requestAnimationFrame(animate)}}
 function stop(){cancelAnimationFrame(frame);frame=0;last=0;stats.paused=true}
 addEventListener('scroll',()=>{target=mapScroll(scrollY);if(reduced.matches||annotationActive){progress=target;render(0)}else start()},{passive:true});
 addEventListener('resize',resize);document.fonts?.ready.then(()=>{cacheAnchors();target=mapScroll(scrollY)});
 document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
 document.addEventListener('oaiannotationmodechange',event=>{annotationActive=Boolean(event.detail?.active);if(annotationActive)stop();else start()});
 addEventListener('pointermove',event=>{if(event.pointerType!=='mouse'||reduced.matches)return;pointer.x=event.clientX/innerWidth*2-1;pointer.y=event.clientY/innerHeight*2-1},{passive:true});
 document.addEventListener('pointerleave',()=>{pointer.x=0;pointer.y=0});
 reduced.addEventListener('change',()=>{stop();pointer.x=0;pointer.y=0;smoothPointer.x=0;smoothPointer.y=0;if(reduced.matches){progress=target;time=0;render(0)}else start()});
 canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();stop();fallback();document.documentElement.classList.remove('scene-ready')});
 // The same world supplies the Profile artwork and inspection views; no alternate mock scene is used.
 window.renderJourneyFrame=(p,seconds=0)=>{capture=true;stop();progress=THREE.MathUtils.clamp(p,0,1);time=seconds;smoothPointer.x=0;smoothPointer.y=0;render(1/60);return {...stats}};
 window.exportJourneyImage=()=>canvas.toDataURL('image/webp',.9);
 window.resumeJourney=()=>{capture=false;target=mapScroll(scrollY);start()};
 resize();stats.ready=true;stats.engine='world-space-point-journey';document.documentElement.classList.add('scene-ready');document.querySelector('.loading').textContent='';start();
}
