'use strict';
(() => {
  const profile = window.PROFILE || {};
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function setTheme(theme) {
    root.dataset.theme = theme;
    toggle.setAttribute('aria-pressed', String(theme === 'dark'));
    toggle.setAttribute('aria-label', theme === 'dark' ? '切换为浅色主题' : '切换为深色主题');
  }
  let savedTheme;
  try { savedTheme = localStorage.getItem('theme'); } catch {}
  setTheme(savedTheme === 'dark' ? 'dark' : 'light');
  toggle.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(theme);
    try { localStorage.setItem('theme', theme); } catch {}
  });
  document.title = profile.title || document.title;
  for (const [attribute, data] of [['data-profile', profile], ['data-research', profile.research], ['data-practice', profile.practice]]) {
    document.querySelectorAll(`[${attribute}]`).forEach(el => {
      const value = data?.[el.getAttribute(attribute)];
      if (typeof value === 'string') el.textContent = value;
    });
  }
  function externalUrl(value) {
    try { const url = new URL(value); return url.protocol === 'https:' ? url.href : null; } catch { return null; }
  }
  const github = externalUrl(profile.github);
  if (github) document.querySelectorAll('.github-link').forEach(el => { el.href = github; });
  const minicamp = externalUrl(profile.practice?.url);
  if (minicamp) document.getElementById('minicamp-link').href = minicamp;
  function element(tag, className, text) {
    const el = document.createElement(tag); el.className = className; el.textContent = text; return el;
  }
  const contributions = document.getElementById('contributions');
  (profile.research?.contributions || []).forEach(item => {
    const article = element('article', 'contribution', '');
    article.append(element('h4', '', item.title), element('p', '', item.text));
    contributions.append(article);
  });
  const domains = document.getElementById('research-domains');
  (profile.research?.domains || []).forEach(name => domains.append(element('span', 'domain-tag', name)));
  const findings = document.getElementById('research-findings');
  (profile.research?.findings || []).forEach(item => {
    const article = element('article', 'finding', '');
    article.append(element('h4', '', item.title), element('p', '', item.text));
    findings.append(article);
  });
  const skills = document.getElementById('skills-grid');
  (profile.skills || []).forEach(item => {
    const article = element('article', 'skill', '');
    article.append(element('h3', '', item.title), element('p', 'skill-tools', item.tools), element('p', 'skill-description', item.description));
    skills.append(article);
  });
  // Content stays visible without animation support or when reduced motion is requested.
  if ('IntersectionObserver' in window && !reduced.matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: .06 });
    document.querySelectorAll('.section').forEach(el => { el.classList.add('reveal'); observer.observe(el); });
    reduced.addEventListener('change', event => {
      if (event.matches) { observer.disconnect(); document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible')); }
    });
  }
  const visual = document.querySelector('.method-visual');
  const canvas = document.getElementById('network');
  const context = canvas.getContext('2d');
  let width = 0, height = 0, frame = 0, elapsed = 0, lastTime = 0;
  let remaining = 4.5, inView = true, annotating = false;
  function drawNetwork() {
    if (!context || !width) return;
    context.clearRect(0, 0, width, height);
    const dark = root.dataset.theme === 'dark';
    const rgb = dark ? '145,181,245' : '55,105,204';
    for (let layer = 0; layer < 42; layer++) {
      const depth = layer / 41;
      context.beginPath();
      for (let i = 0; i <= 84; i++) {
        const t = i / 84;
        const x = t * width;
        const y = height * (.52 + (depth - .5) * .58 + Math.sin(t * Math.PI * 2.1 + depth * .85 + elapsed * .10) * .135 + Math.sin(t * Math.PI * 1.25 - depth * 1.35) * .17);
        if (i === 0) context.moveTo(x,y); else context.lineTo(x,y);
      }
      context.strokeStyle = `rgba(${rgb},${.13 + .27 * (1 - Math.abs(depth - .5) * 2)})`;
      context.lineWidth = layer % 6 === 0 ? 1.15 : .7; context.stroke();
    }
  }
  function animate(time) {
    frame = 0;
    if (reduced.matches || annotating || document.hidden || !inView || remaining <= 0) return;
    const delta = Math.min((time - (lastTime || time)) / 1000, .05); lastTime = time;
    elapsed += delta; remaining -= delta;
    drawNetwork(); frame = requestAnimationFrame(animate);
  }
  function start() {
    if (!frame && !reduced.matches && !annotating && !document.hidden && inView && remaining > 0 && context) {
      lastTime = 0; frame = requestAnimationFrame(animate);
    }
  }
  function stop() { cancelAnimationFrame(frame); frame = 0; }
  function resize() {
    const rect = canvas.getBoundingClientRect(); width = rect.width; height = rect.height;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    context?.setTransform(dpr, 0, 0, dpr, 0, 0); drawNetwork();
  }
  reduced.addEventListener('change', event => {
    if (event.matches) { stop(); visual.style.transform = ''; } else { remaining = 4; start(); }
    drawNetwork();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
  document.addEventListener('oaiannotationmodechange', event => {
    annotating = event.detail.active;
    if (annotating) {
      stop(); visual.style.setProperty('--tilt-x', '0deg'); visual.style.setProperty('--tilt-y', '0deg');
    } else start();
  });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting; if (inView) start(); else stop();
  }).observe(visual);
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(visual); else addEventListener('resize', resize);
  toggle.addEventListener('click', drawNetwork);
  visual.addEventListener('pointermove', event => {
    if (reduced.matches || annotating || event.pointerType === 'touch') return;
    const rect = visual.getBoundingClientRect();
    visual.style.setProperty('--tilt-x', `${(event.clientY - rect.top - rect.height / 2) / 65}deg`);
    visual.style.setProperty('--tilt-y', `${(event.clientX - rect.left - rect.width / 2) / -65}deg`);
    remaining = 1.2; start();
  });
  visual.addEventListener('pointerleave', () => { visual.style.setProperty('--tilt-x', '0deg'); visual.style.setProperty('--tilt-y', '0deg'); });
  resize(); start();
})();
