"use strict";
(()=>{
 const profile=window.PROFILE||{},reduced=matchMedia('(prefers-reduced-motion:reduce)');
 for(const [attribute,data] of [['data-profile',profile],['data-project',profile.project],['data-zoompaper',profile.zoompaper],['data-practice',profile.practice]])document.querySelectorAll(`[${attribute}]`).forEach(el=>{const value=data?.[el.getAttribute(attribute)];if(typeof value==='string')el.textContent=value});
 for(const [id,items] of [['interest-list',profile.interests]])for(const text of items||[]){const li=document.createElement('li');li.textContent=text;document.getElementById(id).append(li)}
 for(const item of profile.courses||[]){const li=document.createElement('li'),name=document.createElement('span'),score=document.createElement('span');name.className='course-name';name.textContent=item.name;score.className='course-score';score.textContent='（'+item.score+'）';li.append(name,score);document.getElementById('course-list').append(li)}
 document.querySelectorAll('[data-stack]').forEach(list=>{for(const keyword of profile[list.dataset.stack]?.stack||[]){const li=document.createElement('li');li.lang=/[\u3400-\u9fff]/.test(keyword)?'zh-CN':'en';li.textContent=keyword;list.append(li)}});
 function renderQuote(selector,value,comma){
  if(typeof value!=='string')return;const heading=document.querySelector(selector),split=comma?value.indexOf(',')+1:value.lastIndexOf(' ');
  if(split>0)heading.replaceChildren(document.createTextNode(value.slice(0,split)),document.createElement('br'),document.createTextNode(value.slice(split).trim()));else heading.textContent=value;
  heading.closest('section').setAttribute('aria-label',value);
 }
 renderQuote('#closing .quote',profile.closing,false);
 const safeUrl=value=>{try{const url=new URL(value);return url.protocol==='https:'?url.href:null}catch{return null}};
 const github=safeUrl(profile.github);if(github)document.querySelectorAll('[data-github]').forEach(a=>a.href=github);
 const event=safeUrl(profile.practice?.url);if(event)document.getElementById('minicamp-link').href=event;
 if(typeof profile.email==='string'&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email))document.getElementById('email-link').href='mailto:'+profile.email;
 const sections=[...document.querySelectorAll('.panel')],controls=document.querySelector('.section-controls'),previous=document.getElementById('section-prev'),next=document.getElementById('section-next'),index=document.querySelector('.section-index');
 const meter=document.querySelector('.reading-progress'),bar=meter.firstElementChild;
 let active=0,navigationTarget=null,pending=false,moduleHeight=innerHeight,measuring=false,scrollDirection='down',lastScrollY=scrollY,directionSign=0,directionDistance=0,ignoreDirectionUntil=0;
 const aliases={statement:'courses',skills:'courses',methods:'research','findings-section':'research',vision3d:'interests','medical-imaging':'interests'};
 function sectionName(el){return el.getAttribute('aria-label')||el.querySelector('h2,h1')?.textContent||'内容'}
 function updateSections(){
  active=Math.max(0,Math.min(sections.length-1,Math.round(scrollY/moduleHeight)));
  if(navigationTarget!==null&&Math.abs(scrollY-sections[navigationTarget].offsetTop)<6)navigationTarget=null;
  const current=navigationTarget??active;previous.disabled=navigationTarget===0||scrollY<=2;next.disabled=navigationTarget===7||scrollY>=sections[7].offsetTop-2;
  index.textContent=String(current+1).padStart(2,'0')+' / 08';
  const atTop=scrollY<=2,nearTop=scrollY<=Math.min(110,innerHeight*.14),atLast=scrollY>=sections[7].offsetTop-innerHeight*.12;
  if(atTop)scrollDirection='down';else if(atLast)scrollDirection='up';
  const direction=scrollDirection;previous.hidden=direction!=='up';next.hidden=direction!=='down';controls.dataset.direction=direction;
  for(const [button,show] of [[next,nearTop],[previous,atLast]]){const label=button.querySelector('.control-label');label.classList.toggle('is-muted',!show);label.setAttribute('aria-hidden',String(!show))}
  previous.setAttribute('aria-label',current?'上一模块：'+sectionName(sections[current-1]):scrollY>2?'回到首页顶部':'已到第一模块');next.setAttribute('aria-label',current<7?'下一模块：'+sectionName(sections[current+1]):scrollY<sections[7].offsetTop-2?'滑至最后模块':'已到最后模块');
 }
 function jump(direction){scrollDirection=direction<0?'up':'down';directionDistance=0;directionSign=0;lastScrollY=scrollY;const target=Math.max(0,Math.min(7,(navigationTarget??active)+direction));navigationTarget=target;sections[target].scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});updateSections()}
 previous.addEventListener('click',()=>jump(-1));next.addEventListener('click',()=>jump(1));
 for(const event of ['wheel','touchstart','pointerdown'])addEventListener(event,e=>{if(!e.target.closest?.('.section-controls'))navigationTarget=null},{passive:true});
 addEventListener('keydown',e=>{if(['PageDown','PageUp','Home','End','ArrowDown','ArrowUp'].includes(e.key))navigationTarget=null});
 function measureModules(){
  if(measuring)return;measuring=true;
  const oldHeight=sections[0].getBoundingClientRect().height||innerHeight,position=scrollY/oldHeight;
  const padding=getComputedStyle(sections[0]),space=parseFloat(padding.paddingTop)+parseFloat(padding.paddingBottom);
  moduleHeight=Math.ceil(Math.max(innerHeight,620,...sections.map(el=>el.querySelector('.wrap').scrollHeight+space)));
  document.documentElement.style.setProperty('--module-height',moduleHeight+'px');
  scrollTo({top:position*moduleHeight,behavior:'instant'});lastScrollY=scrollY;directionDistance=0;directionSign=0;ignoreDirectionUntil=performance.now()+150;measuring=false;showProgress();document.dispatchEvent(new CustomEvent('portfolio-layoutchange'));
 }
 function trackDirection(){
  const y=Math.max(0,Math.min(scrollY,document.documentElement.scrollHeight-innerHeight)),delta=y-lastScrollY;lastScrollY=y;
  if(navigationTarget!==null||performance.now()<ignoreDirectionUntil||Math.abs(delta)<.5)return;
  const sign=Math.sign(delta);if(sign!==directionSign){directionSign=sign;directionDistance=0}
  directionDistance+=Math.abs(delta);
  if(directionDistance>=Math.max(48,Math.min(72,innerHeight*.08))){scrollDirection=sign<0?'up':'down';directionDistance=0}
 }
 function showProgress(){pending=false;trackDirection();updateSections();const p=Math.max(0,Math.min(1,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)));bar.style.transform=`scaleX(${p})`;meter.setAttribute('aria-valuenow',String(Math.round(p*100)))}
 addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(showProgress)}},{passive:true});
 addEventListener('resize',measureModules);measureModules();
 function routeHash(){const hash=decodeURIComponent(location.hash.slice(1)),target=aliases[hash]||hash;if(target&&document.getElementById(target)){navigationTarget=null;scrollDirection=document.getElementById(target).offsetTop<scrollY?'up':'down';directionDistance=0;directionSign=0;if(aliases[hash])history.replaceState(null,'','#'+target);document.getElementById(target).scrollIntoView({behavior:'instant'});lastScrollY=scrollY;showProgress()}}
 addEventListener('hashchange',routeHash);document.fonts?.ready.then(()=>{measureModules();routeHash()});
 if('IntersectionObserver'in window&&!reduced.matches){document.documentElement.classList.add('can-reveal');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.08});sections.forEach(p=>observer.observe(p));reduced.addEventListener('change',()=>{if(reduced.matches){observer.disconnect();document.documentElement.classList.remove('can-reveal')}})}
})();
