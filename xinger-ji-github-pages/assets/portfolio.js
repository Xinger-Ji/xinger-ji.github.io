'use strict';
(() => {
  const root = new URL('../', document.currentScript.src);
  const local = path => new URL(path, root).href;
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const button = (text, label, action) => {
    const node = el('button', '', text);
    node.type = 'button';
    if (label) node.setAttribute('aria-label', label);
    node.addEventListener('click', action);
    return node;
  };
  function photoSource(path) {
    if (typeof path !== 'string' || !path.trim()) throw new Error('Missing image file.');
    const url = new URL(path, root);
    if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Invalid image URL.');
    return url.href;
  }
  async function json(path) {
    const response = await fetch(local(path));
    if (!response.ok) throw new Error('Could not load photographs. Please try again.');
    return response.json();
  }

  const themeButton = document.querySelector('.theme-toggle');
  function themeLabel() {
    const dusk = document.documentElement.dataset.theme === 'dusk';
    themeButton?.setAttribute('aria-label', dusk ? 'Switch to light theme' : 'Switch to dusk theme');
    if (themeButton) themeButton.title = dusk ? 'Light theme' : 'Dusk theme';
  }
  themeLabel();
  themeButton?.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dusk' ? 'light' : 'dusk';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('xj-theme', theme); } catch {}
    themeLabel();
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        document.querySelectorAll('.section-rail > a').forEach(link => {
          const active = link.hash === '#' + entry.target.id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    }, {rootMargin: '-15% 0px -60% 0px'});
    document.querySelectorAll('section[id]').forEach(section => observer.observe(section));
  }

  const deck = document.getElementById('project-deck');
  if (deck) {
    let active = 0;
    function select(index, focus) {
      active = (index + 4) % 4;
      deck.replaceChildren(document.querySelector('template[data-project="' + active + '"]').content.cloneNode(true));
      if (focus === 'selector') deck.querySelectorAll('.project-selector button')[active].focus();
      else if (focus) deck.querySelector('[aria-label="' + focus + '"]')?.focus();
    }
    deck.addEventListener('click', event => {
      const target = event.target.closest('button');
      if (!target) return;
      const choices = [...deck.querySelectorAll('.project-selector button')];
      if (choices.includes(target)) select(choices.indexOf(target), 'selector');
      else if (target.getAttribute('aria-label') === 'Next project') select(active + 1, 'Next project');
      else if (target.getAttribute('aria-label') === 'Previous project') select(active - 1, 'Previous project');
    });
    deck.addEventListener('keydown', event => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      select(active + (event.key === 'ArrowRight' ? 1 : -1), 'selector');
    });
  }

  if (document.querySelector('.portrait-frame')) {
    json('content/profile.json').then(profile => {
      if (!profile.src) return;
      const image = el('img');
      image.alt = profile.alt || 'Xinger Ji';
      const position = Number(profile.position);
      image.style.objectPosition = '50% ' + (Number.isFinite(position) ? Math.max(0, Math.min(100, position)) : 50) + '%';
      image.onload = () => {
        const frame = document.querySelector('.portrait-frame');
        frame.classList.add('has-photo');
        frame.replaceChildren(image);
      };
      image.src = photoSource(profile.src);
    }).catch(() => {});
  }

  document.querySelectorAll('[data-gallery]').forEach(container => {
    const preview = container.dataset.preview === 'true';
    const empty = container.querySelector('.gallery-empty').cloneNode(true);
    let photos = [], category = '', shown = [], active = 0, trigger, oldOverflow = '';
    const dialog = el('dialog', 'photo-lightbox');
    container.append(dialog);
    const top = el('div', 'lightbox-top');
    const counter = el('span');
    const closeButton = button('Close ×', 'Close photograph', () => dialog.close());
    top.append(counter, closeButton);
    const imageBox = el('div', 'lightbox-image');
    const image = el('img'); imageBox.append(image);
    const bottom = el('div', 'lightbox-bottom');
    const details = el('div');
    const title = el('h3'); title.id = 'photograph-title';
    const caption = el('p'), location = el('small');
    details.append(title, caption, location);
    const controls = el('div', 'lightbox-controls');
    controls.append(button('←', 'Previous photograph', () => move(-1)), button('→', 'Next photograph', () => move(1)));
    bottom.append(details, controls);
    dialog.append(top, imageBox, bottom);
    dialog.setAttribute('aria-labelledby', title.id);
    function display() {
      const photo = shown[active];
      image.src = photoSource(photo.src); image.alt = photo.alt || photo.title;
      title.textContent = photo.title;
      caption.textContent = photo.caption || ''; caption.hidden = !photo.caption;
      location.textContent = photo.location || ''; location.hidden = !photo.location;
      controls.hidden = shown.length < 2;
      counter.textContent = 'PHOTOGRAPH ' + String(active + 1).padStart(2, '0') + ' / ' + String(shown.length).padStart(2, '0');
    }
    function move(by) { active = (active + by + shown.length) % shown.length; display(); }
    function open(index, target) {
      active = index; trigger = target; display();
      oldOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.showModal(); closeButton.focus();
    }
    dialog.addEventListener('close', () => { document.body.style.overflow = oldOverflow; trigger?.focus(); });
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);
      }
    });
    function render() {
      container.querySelectorAll('.gallery-toolbar,.gallery-empty,.gallery-status,.photo-grid,.gallery-more').forEach(node => node.remove());
      const toolbar = el('div', 'gallery-toolbar');
      const categories = el('div', 'gallery-categories');
      categories.setAttribute('role', 'group'); categories.setAttribute('aria-label', 'Filter photographs');
      for (const value of ['', ...new Set(photos.map(photo => photo.category).filter(Boolean))]) {
        const choice = button(value || 'All photographs', '', () => { category = value; render(); [...categoriesFor()].find(node => node.textContent === (value || 'All photographs'))?.focus(); });
        choice.classList.toggle('active', category === value);
        choice.setAttribute('aria-pressed', String(category === value)); categories.append(choice);
      }
      toolbar.append(categories); container.insertBefore(toolbar, dialog);
      shown = photos.filter(photo => !category || photo.category === category);
      if (preview) shown = shown.slice(0, 6);
      if (!photos.length) { container.insertBefore(empty.cloneNode(true), dialog); return; }
      const grid = el('div', 'photo-grid');
      shown.forEach((photo, index) => {
        const figure = el('figure');
        const opener = button('', 'Open photograph: ' + photo.title, event => open(index, event.currentTarget));
        opener.className = 'photo-open';
        const thumbnail = el('img'); thumbnail.src = photoSource(photo.src); thumbnail.alt = photo.alt || photo.title; thumbnail.loading = 'lazy';
        const expand = el('span', 'photo-expand', '↗'); expand.setAttribute('aria-hidden', 'true');
        opener.append(thumbnail, expand);
        const figcaption = el('figcaption');
        const info = el('div'); info.append(el('h3', '', photo.title), el('p', '', photo.location || photo.category || ''));
        figcaption.append(el('span', 'photo-index', String(index + 1).padStart(2, '0')), info);
        figure.append(opener, figcaption); grid.append(figure);
      });
      container.insertBefore(grid, dialog);
      if (preview) {
        const more = el('div', 'gallery-more');
        const link = el('a', 'plain-link', 'View full gallery →'); link.href = local('photography/');
        more.append(el('span', '', photos.length + ' photograph' + (photos.length === 1 ? '' : 's')), link);
        container.insertBefore(more, dialog);
      }
    }
    function categoriesFor() { return container.querySelectorAll('.gallery-categories button'); }
    async function load() {
      try {
        const data = await json('content/photos.json');
        if (!Array.isArray(data.photos)) throw new Error('The photograph list could not be loaded.');
        photos = data.photos.filter(photo => !photo.hidden && typeof photo.title === 'string' && photo.src);
        photos.forEach(photo => photoSource(photo.src));
        render();
      } catch {
        container.querySelectorAll('.gallery-empty,.gallery-status').forEach(node => node.remove());
        const message = el('div', 'gallery-empty');
        message.append(el('p', '', 'Could not load the photographs. Please try again.'), button('Try again', '', load));
        container.insertBefore(message, dialog);
      }
    }
    load();
  });
})();
