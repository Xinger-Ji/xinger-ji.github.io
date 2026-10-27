'use strict';
const filters = document.querySelectorAll('[data-filter]');
filters.forEach(button => button.addEventListener('click', () => {
  const value = button.dataset.filter;
  let count = 0;
  document.querySelectorAll('.project-card').forEach(card => {
    card.hidden = value !== 'all' && card.dataset.category !== value;
    if (!card.hidden) count++;
  });
  filters.forEach(item => {
    const selected = item === button;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  document.querySelector('#filter-status').textContent = `Showing ${count} ${count === 1 ? 'project' : 'projects'}`;
}));
const copy = document.querySelector('[data-copy-email]');
if (copy) copy.addEventListener('click', async () => {
  const status = document.querySelector('.copy-status');
  try {
    if (!navigator.clipboard) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText('xingerji@brandeis.edu');
    status.textContent = 'Email address copied.';
  } catch {
    status.textContent = 'xingerji@brandeis.edu';
  }
});
document.querySelector('[data-print]')?.addEventListener('click', () => window.print());
