"use strict";
(()=>{
 const p=window.PROFILE||{};
 for(const [attr,data] of [['data-profile',p],['data-project',p.project],['data-zoompaper',p.zoompaper],['data-practice',p.practice]])document.querySelectorAll(`[${attr}]`).forEach(el=>{const value=data?.[el.getAttribute(attr)];if(typeof value==='string')el.textContent=value});
 document.querySelectorAll('[data-stack]').forEach(list=>{list.replaceChildren();for(const keyword of p[list.dataset.stack]?.stack||[]){const li=document.createElement('li');li.textContent=keyword;list.append(li)}});
 const interests=document.getElementById('interest-list');if(p.interests?.length){interests.replaceChildren();for(const text of p.interests){const li=document.createElement('li');li.textContent=text;interests.append(li)}}
 document.getElementById('course-list').replaceChildren();
 for(const item of p.courses||[]){const li=document.createElement('li'),name=document.createElement('span'),score=document.createElement('span');name.className='course-name';name.textContent=item.name;score.className='course-score';score.textContent=item.score;li.append(name,score);document.getElementById('course-list').append(li)}
 const url=value=>{try{const u=new URL(value);return u.protocol==='https:'?u.href:null}catch{return null}};
 if(url(p.github))document.querySelectorAll('[data-github]').forEach(a=>a.href=url(p.github));
 if(typeof p.email==='string'&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email))document.querySelectorAll('[data-email]').forEach(a=>a.href='mailto:'+p.email);
 if(url(p.practice?.url))document.getElementById('minicamp-link').href=url(p.practice.url);
 const button=document.querySelector('.theme-toggle'),dark=matchMedia('(prefers-color-scheme:dark)');let choice=null;try{choice=localStorage.getItem('academic-theme')}catch{}
 function theme(){const isDark=choice?choice==='dark':dark.matches;document.documentElement.dataset.theme=isDark?'dark':'light';button.setAttribute('aria-label',isDark?'切换浅色主题':'切换深色主题');button.setAttribute('aria-pressed',String(isDark))}theme();dark.addEventListener('change',theme);button.addEventListener('click',()=>{choice=document.documentElement.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('academic-theme',choice)}catch{}theme()});
 const sections=[...document.querySelectorAll('main>section')],links=[...document.querySelectorAll('.contents a')];let queued=false;
 function active(){queued=false;let current=sections[0];for(const section of sections)if(section.getBoundingClientRect().top<innerHeight*.35)current=section;for(const a of links){const selected=a.hash==='#'+current.id;a.classList.toggle('active',selected);if(selected)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')}}
 addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(active)}},{passive:true});active();
 const aliases={courses:'education',skills:'education',interests:'about',statement:'about',zoompaper:'projects',practice:'experience',closing:'contact'};function route(){const hash=location.hash.slice(1),id=aliases[hash];if(id){history.replaceState(null,'','#'+id);document.getElementById(id)?.scrollIntoView()}}route();addEventListener('hashchange',route);
 document.getElementById('year').textContent=new Date().getFullYear();
})();
