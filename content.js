"use strict";
(()=>{
 const profile=window.PROFILE||{},reduced=matchMedia('(prefers-reduced-motion:reduce)');
 for(const [attribute,data] of [['data-profile',profile],['data-project',profile.project],['data-practice',profile.practice]])document.querySelectorAll(`[${attribute}]`).forEach(el=>{const value=data?.[el.getAttribute(attribute)];if(typeof value==='string')el.textContent=value});
 for(const [id,items] of [['course-list',profile.courses],['interest-list',profile.interests],['hobby-list',profile.hobbies]])for(const text of items||[]){const li=document.createElement('li');li.textContent=text;document.getElementById(id).append(li)}
 function renderQuote(selector,value,comma){
  if(typeof value!=='string')return;const heading=document.querySelector(selector),split=comma?value.indexOf(',')+1:value.lastIndexOf(' ');
  if(split>0)heading.replaceChildren(document.createTextNode(value.slice(0,split)),document.createElement('br'),document.createTextNode(value.slice(split).trim()));else heading.textContent=value;
  heading.closest('section').setAttribute('aria-label',value);
 }
 renderQuote('#statement .quote',profile.quote,true);renderQuote('#closing .quote',profile.closing,false);
 const safeUrl=value=>{try{const url=new URL(value);return url.protocol==='https:'?url.href:null}catch{return null}};
 const github=safeUrl(profile.github);if(github)document.querySelectorAll('[data-github]').forEach(a=>a.href=github);
 const event=safeUrl(profile.practice?.url);if(event)document.getElementById('minicamp-link').href=event;
 if(typeof profile.email==='string'&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email))document.getElementById('email-link').href='mailto:'+profile.email;
 const sections=[...document.querySelectorAll('.panel')],controls=document.querySelector('.section-controls'),previous=document.getElementById('section-prev'),next=document.getElementById('section-next'),index=document.querySelector('.section-index');
 const meter=document.querySelector('.reading-progress'),bar=meter.firstElementChild;
 let active=0,navigationTarget=null,pending=false,hideTimer,moduleHeight=innerHeight,measuring=false;
 const aliases={skills:'courses',methods:'research','findings-section':'research',vision3d:'interests','medical-imaging':'interests'};
 function sectionName(el){return el.getAttribute('aria-label')||el.querySelector('h2,h1')?.textContent||'内容'}
 function updateSections(){
  active=Math.max(0,Math.min(sections.length-1,Math.round(scrollY/moduleHeight)));
  if(navigationTarget!==null&&Math.abs(scrollY-sections[navigationTarget].offsetTop)<6)navigationTarget=null;
  const current=navigationTarget??active;previous.disabled=current===0;next.disabled=current===sections.length-1;
  index.textContent=String(current+1).padStart(2,'0')+' / 08';
  previous.setAttribute('aria-label',current?'上一模块：'+sectionName(sections[current-1]):'已到第一模块');next.setAttribute('aria-label',current<7?'下一模块：'+sectionName(sections[current+1]):'已到最后模块');
 }
 function revealControls(){
  if(scrollY<innerHeight*.12&&!controls.contains(document.activeElement)){controls.classList.remove('is-revealed');return}
  controls.classList.add('is-revealed');clearTimeout(hideTimer);hideTimer=setTimeout(()=>controls.classList.remove('is-revealed'),2400);
 }
 function jump(direction){const target=Math.max(0,Math.min(7,(navigationTarget??active)+direction));navigationTarget=target;sections[target].scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});updateSections();revealControls()}
 previous.addEventListener('click',()=>jump(-1));next.addEventListener('click',()=>jump(1));
 for(const event of ['wheel','touchstart','pointerdown'])addEventListener(event,e=>{if(!e.target.closest?.('.section-controls'))navigationTarget=null},{passive:true});
 addEventListener('keydown',e=>{if(['PageDown','PageUp','Home','End','ArrowDown','ArrowUp'].includes(e.key))navigationTarget=null});
 addEventListener('pointermove',e=>{if(e.pointerType==='mouse'&&e.clientX>innerWidth-90&&Math.abs(e.clientY-innerHeight/2)<120)revealControls()},{passive:true});
 function measureModules(){
  if(measuring)return;measuring=true;
  const oldHeight=sections[0].getBoundingClientRect().height||innerHeight,position=scrollY/oldHeight;
  const padding=getComputedStyle(sections[0]),space=parseFloat(padding.paddingTop)+parseFloat(padding.paddingBottom);
  moduleHeight=Math.ceil(Math.max(innerHeight,620,...sections.map(el=>el.querySelector('.wrap').scrollHeight+space)));
  document.documentElement.style.setProperty('--module-height',moduleHeight+'px');
  scrollTo({top:position*moduleHeight,behavior:'instant'});measuring=false;showProgress();document.dispatchEvent(new CustomEvent('portfolio-layoutchange'));
 }
 function showProgress(){pending=false;updateSections();const p=Math.max(0,Math.min(1,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)));bar.style.transform=`scaleX(${p})`;meter.setAttribute('aria-valuenow',String(Math.round(p*100)))}
 addEventListener('scroll',()=>{revealControls();if(!pending){pending=true;requestAnimationFrame(showProgress)}},{passive:true});
 addEventListener('resize',measureModules);measureModules();
 function routeHash(){const hash=decodeURIComponent(location.hash.slice(1)),target=aliases[hash]||hash;if(target&&document.getElementById(target)){navigationTarget=null;if(aliases[hash])history.replaceState(null,'','#'+target);document.getElementById(target).scrollIntoView({behavior:'instant'});showProgress()}}
 addEventListener('hashchange',routeHash);document.fonts?.ready.then(()=>{measureModules();routeHash()});
 if('IntersectionObserver'in window&&!reduced.matches){document.documentElement.classList.add('can-reveal');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.08});sections.forEach(p=>observer.observe(p));reduced.addEventListener('change',()=>{if(reduced.matches){observer.disconnect();document.documentElement.classList.remove('can-reveal')}})}
})();
