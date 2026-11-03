'use strict';
(() => {
  const profile = window.PROFILE || {};

  // ========== Theme Toggle ==========
  const themeToggle = document.querySelector('.theme-toggle');
  const html = document.documentElement;

  // Load saved theme or default to light
  const savedTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', savedTheme);

  themeToggle?.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // ========== Populate Profile Data ==========
  document.querySelectorAll('[data-profile]').forEach(el => {
    const key = el.dataset.profile;
    const value = profile[key];
    if (typeof value === 'string') {
      el.textContent = value;
    }
  });

  // ========== Render Research Projects ==========
  const researchList = document.getElementById('research-list');
  if (researchList && Array.isArray(profile.research)) {
    profile.research.forEach(item => {
      const article = document.createElement('article');
      article.className = 'research-item';

      // Header
      const header = document.createElement('div');
      header.className = 'research-item__header';

      const titleGroup = document.createElement('div');
      titleGroup.className = 'research-item__title-group';

      const title = document.createElement('h3');
      title.textContent = item.title;
      titleGroup.appendChild(title);

      const subtitle = document.createElement('div');
      subtitle.className = 'research-item__subtitle';
      subtitle.textContent = item.subtitle;
      titleGroup.appendChild(subtitle);

      const meta = document.createElement('div');
      meta.className = 'research-item__meta';

      const period = document.createElement('span');
      period.className = 'research-item__period';
      period.textContent = item.period;
      meta.appendChild(period);

      const role = document.createElement('span');
      role.className = 'research-item__role';
      role.textContent = item.role;
      meta.appendChild(role);

      // Add status badge if exists
      if (item.status) {
        const status = document.createElement('span');
        status.className = 'research-item__status';
        status.textContent = item.status;
        meta.appendChild(status);
      }

      header.appendChild(titleGroup);
      header.appendChild(meta);
      article.appendChild(header);

      // Description
      const desc = document.createElement('p');
      desc.className = 'research-item__description';
      desc.textContent = item.description;
      article.appendChild(desc);

      // Achievements
      if (item.achievements && item.achievements.length > 0) {
        const achievementsList = document.createElement('ul');
        achievementsList.className = 'research-item__achievements';
        item.achievements.forEach(achievement => {
          const li = document.createElement('li');
          li.textContent = achievement;
          achievementsList.appendChild(li);
        });
        article.appendChild(achievementsList);
      }

      // Tags
      if (item.tags && item.tags.length > 0) {
        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'research-item__tags';
        item.tags.forEach(tag => {
          const tagSpan = document.createElement('span');
          tagSpan.className = 'research-item__tag';
          tagSpan.textContent = tag;
          tagsDiv.appendChild(tagSpan);
        });
        article.appendChild(tagsDiv);
      }

      researchList.appendChild(article);
    });
  }

  // ========== Render Skills ==========
  const skillsGrid = document.getElementById('skills-grid');
  if (skillsGrid && profile.skills) {
    Object.entries(profile.skills).forEach(([category, items]) => {
      const card = document.createElement('article');
      card.className = 'skill-category';

      const title = document.createElement('h3');
      title.className = 'skill-category__title';
      title.textContent = category;
      card.appendChild(title);

      const itemsDiv = document.createElement('div');
      itemsDiv.className = 'skill-category__items';
      items.forEach(item => {
        const span = document.createElement('span');
        span.className = 'skill-category__item';
        span.textContent = item;
        itemsDiv.appendChild(span);
      });
      card.appendChild(itemsDiv);

      skillsGrid.appendChild(card);
    });
  }

  // ========== Render Achievements ==========
  const achievementsList = document.getElementById('achievements-list');
  if (achievementsList && Array.isArray(profile.achievements)) {
    profile.achievements.forEach(achievement => {
      const article = document.createElement('article');
      article.className = 'achievement-item';

      const year = document.createElement('div');
      year.className = 'achievement-item__year';
      year.textContent = achievement.year;
      article.appendChild(year);

      const title = document.createElement('div');
      title.className = 'achievement-item__title';
      title.textContent = achievement.title;
      article.appendChild(title);

      const category = document.createElement('div');
      category.className = 'achievement-item__category';
      category.textContent = achievement.category;
      article.appendChild(category);

      achievementsList.appendChild(article);
    });
  }

  // ========== Render Activities ==========
  const activitiesList = document.getElementById('activities-list');
  if (activitiesList && Array.isArray(profile.activities)) {
    profile.activities.forEach(activity => {
      const article = document.createElement('article');
      article.className = 'activity-item';

      const header = document.createElement('div');
      header.className = 'activity-item__header';

      const role = document.createElement('div');
      role.className = 'activity-item__role';
      role.textContent = activity.role;
      header.appendChild(role);

      const period = document.createElement('div');
      period.className = 'activity-item__period';
      period.textContent = activity.period;
      header.appendChild(period);

      article.appendChild(header);

      const org = document.createElement('h3');
      org.className = 'activity-item__organization';
      org.textContent = activity.organization;
      article.appendChild(org);

      const desc = document.createElement('p');
      desc.className = 'activity-item__description';
      desc.textContent = activity.description;
      article.appendChild(desc);

      if (activity.website) {
        const website = document.createElement('a');
        website.className = 'activity-item__website';
        website.href = activity.website;
        website.target = '_blank';
        website.rel = 'noopener noreferrer';
        website.textContent = activity.website;
        article.appendChild(website);
      }

      activitiesList.appendChild(article);
    });
  }

  // ========== Update GitHub Link ==========
  const githubLinks = document.querySelectorAll('a[href*="github.com"]');
  if (profile.contact?.github) {
    githubLinks.forEach(link => {
      link.href = profile.contact.github;
    });
  }

  // ========== Smooth Scroll ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#top') {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // ========== Intersection Observer for Fade-in ==========
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe sections
  document.querySelectorAll('.section, .research-item, .skill-category, .achievement-item, .activity-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });

  // Hero always visible
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.style.opacity = '1';
  }

  // ========== Console Easter Egg ==========
  console.log('%c👋 Hi there!', 'font-size: 20px; font-weight: bold;');
  console.log('%cInterested in the code? Check out the source on GitHub!', 'font-size: 14px;');
  if (profile.contact?.github) {
    console.log('%c' + profile.contact.github, 'font-size: 14px; color: #c84848;');
  }
})();
