'use strict';
(()=>{
 const profile=window.PROFILE||{};
 for(const [attribute,data] of [['data-profile',profile],['data-research',profile.research],['data-practice',profile.practice]])document.querySelectorAll(`[${attribute}]`).forEach(el=>{const value=data?.[el.getAttribute(attribute)];if(typeof value==='string')el.textContent=value});
 const make=(tag,className,text)=>{const el=document.createElement(tag);el.className=className;el.textContent=text;return el};
 (profile.research?.domains||[]).forEach(name=>document.getElementById('domains').append(make('li','',name)));
 (profile.research?.contributions||[]).forEach(item=>{const el=make('article','contribution','');el.append(make('h3','',item.title),make('p','',item.text));document.getElementById('contributions').append(el)});
 (profile.research?.findings||[]).forEach(item=>{const el=make('article','finding','');el.append(make('h3','',item.title),make('p','',item.text));document.getElementById('findings').append(el)});
 (profile.skills||[]).forEach(item=>{const el=make('article','skill','');el.append(make('h3','',item.title),make('p','',item.tools));document.getElementById('skills-list').append(el)});
 const safeUrl=value=>{try{const u=new URL(value);return u.protocol==='https:'?u.href:null}catch{return null}};
 const github=safeUrl(profile.github);if(github)document.querySelectorAll('[data-github]').forEach(a=>a.href=github);
 const eventUrl=safeUrl(profile.practice?.url);if(eventUrl)document.getElementById('minicamp-link').href=eventUrl;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 if('IntersectionObserver'in window&&!reduced.matches){document.documentElement.classList.add('can-reveal');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.08});document.querySelectorAll('.panel').forEach(p=>observer.observe(p));reduced.addEventListener('change',()=>{if(reduced.matches){observer.disconnect();document.documentElement.classList.remove('can-reveal')}})}
 const meter=document.querySelector('.reading-progress'),bar=meter.firstElementChild;let pending=false;
 function showProgress(){pending=false;const p=Math.max(0,Math.min(1,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)));bar.style.transform=`scaleX(${p})`;meter.setAttribute('aria-valuenow',String(Math.round(p*100)))}
 addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(showProgress)}},{passive:true});addEventListener('resize',showProgress);showProgress();
})();
