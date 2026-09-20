// Progressive-enhancement client-side domain filter, shared by the
// /projects and /notions listing pages (the site is fully static, so
// filtering happens in the browser rather than via server query params).
const group = document.querySelector('[data-filter-group]');
const items = document.querySelectorAll<HTMLElement>('[data-project-list] > [data-domain]');

group?.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('.filter-btn');
  if (!button) return;
  const domain = button.dataset.domain;
  group.querySelectorAll('.filter-btn').forEach((b) => b.setAttribute('aria-pressed', 'false'));
  button.setAttribute('aria-pressed', 'true');
  items.forEach((item) => {
    item.hidden = domain !== 'all' && item.dataset.domain !== domain;
  });
});
