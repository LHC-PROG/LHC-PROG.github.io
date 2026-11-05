'use strict';
(()=>{
 const profile=window.PROFILE||{};
 for(const [attribute,data] of [['data-profile',profile],['data-research',profile.research],['data-practice',profile.practice],['data-vision3d',profile.vision3d],['data-medical',profile.medicalImaging]])document.querySelectorAll(`[${attribute}]`).forEach(el=>{const value=data?.[el.getAttribute(attribute)];if(typeof value==='string')el.textContent=value});
 const make=(tag,className,text)=>{const el=document.createElement(tag);el.className=className;el.textContent=text;return el};
 (profile.research?.domains||[]).forEach(name=>document.getElementById('domains').append(make('li','',name)));
 (profile.research?.contributions||[]).forEach(item=>{const el=make('article','contribution','');el.append(make('h3','',item.title),make('p','',item.text));document.getElementById('contributions').append(el)});
 (profile.research?.findings||[]).forEach(item=>{const el=make('article','finding','');el.append(make('h3','',item.title),make('p','',item.text));document.getElementById('findings').append(el)});
 (profile.skills||[]).forEach(item=>{const el=make('article','skill','');el.append(make('h3','',item.title),make('p','',item.tools));document.getElementById('skills-list').append(el)});
 for(const [id,data] of [['vision-keywords',profile.vision3d],['medical-keywords',profile.medicalImaging]])(data?.keywords||[]).forEach(keyword=>document.getElementById(id).append(make('li','',keyword)));
 const safeUrl=value=>{try{const u=new URL(value);return u.protocol==='https:'?u.href:null}catch{return null}};
 const github=safeUrl(profile.github);if(github)document.querySelectorAll('[data-github]').forEach(a=>a.href=github);
 const eventUrl=safeUrl(profile.practice?.url);if(eventUrl)document.getElementById('minicamp-link').href=eventUrl;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 if('IntersectionObserver'in window&&!reduced.matches){document.documentElement.classList.add('can-reveal');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.08});document.querySelectorAll('.panel').forEach(p=>observer.observe(p));reduced.addEventListener('change',()=>{if(reduced.matches){observer.disconnect();document.documentElement.classList.remove('can-reveal')}})}
 const sections=[...document.querySelectorAll('.panel')],previous=document.getElementById('section-prev'),next=document.getElementById('section-next'),index=document.querySelector('.section-index');
 let active=0,navigationTarget=null;
 function updateSections(){
  const marker=scrollY+innerHeight*.42;active=0;
  sections.forEach((el,i)=>{if(el.offsetTop<=marker)active=i});
  if(scrollY+innerHeight>=document.documentElement.scrollHeight-3)active=sections.length-1;
  if(navigationTarget!==null&&Math.abs(scrollY-Math.max(0,sections[navigationTarget].offsetTop-parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop||0)))<6)navigationTarget=null;
  const current=navigationTarget??active;previous.disabled=current===0;next.disabled=current===sections.length-1;
  index.textContent=String(current+1).padStart(2,'0')+' / '+String(sections.length).padStart(2,'0');
  previous.setAttribute('aria-label',current?'上一板块：'+sectionName(sections[current-1]):'已到第一板块');next.setAttribute('aria-label',current<sections.length-1?'下一板块：'+sectionName(sections[current+1]):'已到最后板块');
 }
 function sectionName(el){return el.getAttribute('aria-label')||el.querySelector('h2,h1,.breath-line')?.textContent||'内容'}
 function jump(direction){const target=Math.max(0,Math.min(sections.length-1,(navigationTarget??active)+direction));navigationTarget=target;sections[target].scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});updateSections()}
 previous.addEventListener('click',()=>jump(-1));next.addEventListener('click',()=>jump(1));
 for(const event of ['wheel','touchstart','pointerdown'])addEventListener(event,e=>{if(!e.target.closest?.('.section-controls'))navigationTarget=null},{passive:true});
 addEventListener('keydown',e=>{if(['PageDown','PageUp','Home','End','ArrowDown','ArrowUp'].includes(e.key))navigationTarget=null});
 document.fonts?.ready.then(updateSections);
 const meter=document.querySelector('.reading-progress'),bar=meter.firstElementChild;let pending=false;
 function showProgress(){pending=false;updateSections();const p=Math.max(0,Math.min(1,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)));bar.style.transform=`scaleX(${p})`;meter.setAttribute('aria-valuenow',String(Math.round(p*100)))}
 addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(showProgress)}},{passive:true});addEventListener('resize',showProgress);showProgress();
})();
