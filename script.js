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
  const motionToggle = document.getElementById('motion-toggle');
  let width = 0, height = 0, frame = 0, elapsed = 0, lastTime = 0;
  let paused = reduced.matches, inView = true;
  const particles = Array.from({ length: 44 }, (_, i) => ({
    x: ((i * 37.37) % 100) / 100,
    y: ((i * 61.81) % 100) / 100,
    phase: i * 2.4
  }));
  function drawNetwork() {
    if (!context || !width) return;
    context.clearRect(0, 0, width, height);
    const positions = particles.map(p => ({
      x: p.x * width + Math.sin(elapsed * .18 + p.phase) * 16,
      y: p.y * height + Math.cos(elapsed * .14 + p.phase) * 14
    }));
    for (let i = 0; i < positions.length; i++) {
      const p = positions[i];
      for (let j = i + 1; j < positions.length; j++) {
        const q = positions[j], distance = Math.hypot(p.x - q.x, p.y - q.y);
        if (distance < 105) {
          context.strokeStyle = `rgba(190,219,167,${(1 - distance / 105) * .28})`;
          context.lineWidth = .8;
          context.beginPath(); context.moveTo(p.x, p.y); context.lineTo(q.x, q.y); context.stroke();
        }
      }
      context.fillStyle = i % 5 === 0 ? '#d8e6af' : '#7eab92';
      context.beginPath(); context.arc(p.x, p.y, i % 5 === 0 ? 2 : 1.2, 0, Math.PI * 2); context.fill();
    }
  }
  function animate(time) {
    frame = 0;
    if (paused || document.hidden || !inView) return;
    elapsed += Math.min((time - (lastTime || time)) / 1000, .05); lastTime = time;
    drawNetwork(); frame = requestAnimationFrame(animate);
  }
  function start() { if (!frame && !paused && !document.hidden && inView && context) { lastTime = 0; frame = requestAnimationFrame(animate); } }
  function stop() { cancelAnimationFrame(frame); frame = 0; }
  function syncMotion() {
    document.body.classList.toggle('motion-paused', paused);
    motionToggle.setAttribute('aria-pressed', String(paused));
    motionToggle.setAttribute('aria-label', paused ? '开启动效' : '暂停动效');
    motionToggle.textContent = paused ? '▷' : 'Ⅱ';
    if (paused) stop(); else start();
    drawNetwork();
  }
  function resize() {
    const rect = canvas.getBoundingClientRect(); width = rect.width; height = rect.height;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    context?.setTransform(dpr, 0, 0, dpr, 0, 0); drawNetwork();
  }
  motionToggle.addEventListener('click', () => { paused = !paused; syncMotion(); });
  reduced.addEventListener('change', event => { paused = event.matches; syncMotion(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting; if (inView) start(); else stop();
  }).observe(visual);
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(visual); else addEventListener('resize', resize);
  resize(); syncMotion();
  visual.addEventListener('pointermove', event => {
    if (paused) return;
    const rect = visual.getBoundingClientRect();
    visual.style.setProperty('--tilt-x', `${(event.clientY - rect.top - rect.height / 2) / 45}deg`);
    visual.style.setProperty('--tilt-y', `${(event.clientX - rect.left - rect.width / 2) / -45}deg`);
  });
  visual.addEventListener('pointerleave', () => { visual.style.setProperty('--tilt-x', '0deg'); visual.style.setProperty('--tilt-y', '0deg'); });
})();
